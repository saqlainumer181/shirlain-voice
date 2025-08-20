from datetime import datetime
from typing import Dict, List

from loguru import logger
from sqlalchemy.orm import Session

from app.models.database import ChatMessage, Reservation
from app.services.calendar_service import CalendarService
from app.services.openai_service import OpenAIService
from app.services.qdrant_service import QdrantService


class ChatService:
    def __init__(self):
        self.openai_service = OpenAIService()
        self.qdrant_service = QdrantService()
        self.calendar_service = CalendarService()

    async def process_message(self, session_id: str, message: str, db: Session) -> Dict:
        """Process a chat message and return response"""

        # Save user message
        user_msg = ChatMessage(session_id=session_id, role="user", content=message)
        db.add(user_msg)
        db.commit()

        # Get conversation history
        messages = self._get_conversation_history(session_id, db)

        # Get context from Qdrant
        context = await self.qdrant_service.get_context_for_query(message)

        # Get OpenAI response
        response = await self.openai_service.get_chat_response(messages, context)

        # Check if we have complete reservation info
        if response.get("function_call") and response["function_call"].get(
            "has_complete_info"
        ):

            # Process reservation
            reservation_result = await self._process_reservation(
                session_id, response["function_call"], db
            )

            logger.info(f"reservation result: {reservation_result}")

            if reservation_result["success"]:
                # Generate confirmation message
                confirmation = await self.openai_service.generate_confirmation_message(
                    response["function_call"]
                )

                logger.info(f"confirmation messages: {confirmation}")

                response["content"] = confirmation
                response["reservation_completed"] = True
                response["reservation_details"] = reservation_result

        # Save assistant response
        assistant_msg = ChatMessage(
            session_id=session_id,
            role="assistant",
            content=response["content"],
            metadata=response.get("function_call"),
        )
        db.add(assistant_msg)
        db.commit()

        return response

    def _get_conversation_history(
        self, session_id: str, db: Session, limit: int = 10
    ) -> List[Dict]:
        """Get recent conversation history"""
        messages = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.desc())
            .limit(limit)
            .all()
        )

        messages.reverse()

        return [{"role": msg.role, "content": msg.content} for msg in messages]

    async def _process_reservation(
        self, session_id: str, reservation_info: Dict, db: Session
    ) -> Dict:
        """Process and create a reservation"""

        try:
            # Check availability
            is_available = await self.calendar_service.check_availability(
                reservation_info["reservation_datetime"]
            )

            if not is_available:
                return {
                    "success": False,
                    "message": "The requested time slot is not available.",
                }

            # Create calendar event
            calendar_result = await self.calendar_service.create_reservation(
                reservation_info
            )

            logger.info(f"calendar_result {calendar_result}")

            if not calendar_result["success"]:
                return {"success": False, "message": "Failed to create calendar event."}

            # Save to database
            reservation = Reservation(
                session_id=session_id,
                customer_name=reservation_info["customer_name"],
                customer_email=reservation_info["customer_email"],
                customer_phone=reservation_info["customer_phone"],
                party_size=reservation_info["party_size"],
                reservation_date=datetime.fromisoformat(
                    reservation_info["reservation_datetime"]
                ),
                special_requests=reservation_info.get("special_requests"),
                status="confirmed",
                google_event_id=calendar_result["event_id"],
            )

            db.add(reservation)
            db.commit()

            return {
                "success": True,
                "message": "Reservation confirmed!",
                "reservation_id": reservation.id,
                "google_event_id": calendar_result["event_id"],
                "customer_name": reservation_info["customer_name"],
                "customer_phone": reservation_info["customer_phone"],
            }

        except Exception as e:
            print(f"Reservation processing error: {e}")
            return {
                "success": False,
                "message": f"Error processing reservation: {str(e)}",
            }
