import json
import uuid

from fastapi import Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.config import settings
from app.models.database import get_db
from app.services.chat_service import ChatService


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket

    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]

    async def send_message(self, message: str, session_id: str):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_text(message)


manager = ConnectionManager()
chat_service = ChatService()


async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    session_id = str(uuid.uuid4())
    await manager.connect(websocket, session_id)

    try:
        from datetime import datetime

        import pytz

        tz = pytz.timezone(settings.RESTAURANT_TIMEZONE)
        current_date = datetime.now(tz).strftime("%A, %B %d, %Y at %I:%M %p %Z")
        # Send welcome message
        welcome = {
            "type": "system",
            "content": f"Welcome to The Golden Fork! I'm here to help you with menu inquiries and table reservations. Current time: {current_date}. How may I assist you today?",
            "session_id": session_id,
            "timezone": settings.RESTAURANT_TIMEZONE,
        }
        await manager.send_message(json.dumps(welcome), session_id)

        while True:
            # Receive message
            data = await websocket.receive_text()
            message_data = json.loads(data)

            # Process message
            response = await chat_service.process_message(
                session_id, message_data["message"], db
            )

            # Send response
            response_data = {
                "type": "assistant",
                "content": response["content"],
                "session_id": session_id,
                "metadata": response.get("function_call"),
                "reservation_completed": response.get("reservation_completed", False),
                "reservation_details": response.get("reservation_details"),
            }

            await manager.send_message(json.dumps(response_data), session_id)

    except WebSocketDisconnect:
        manager.disconnect(session_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(session_id)
