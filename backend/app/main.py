import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import chat, upload, websocket
from app.config import settings

app = FastAPI(
    title="Restaurant Reservation Chatbot API",
    description="API for The Golden Fork restaurant reservation chatbot",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(upload.router, prefix="/api", tags=["upload"])

# WebSocket endpoint
app.websocket("/ws")(websocket.websocket_endpoint)


@app.get("/")
async def root():
    return {
        "message": "Welcome to The Golden Fork Reservation System API",
        "docs": "/docs",
        "websocket": "ws://localhost:8000/ws",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app", host=settings.APP_HOST, port=settings.APP_PORT, reload=True
    )
