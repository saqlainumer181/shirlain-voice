from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, EmailStr, Field


class ChatMessage(BaseModel):
    role: str
    content: str
    metadata: Optional[Dict[str, Any]] = None


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    session_id: str
    response: str
    metadata: Optional[Dict[str, Any]] = None


class ReservationInfo(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    party_size: int = Field(ge=1, le=20)
    reservation_date: datetime
    special_requests: Optional[str] = None


class ReservationResponse(BaseModel):
    success: bool
    message: str
    reservation_id: Optional[int] = None
    google_event_id: Optional[str] = None


class FileUploadResponse(BaseModel):
    success: bool
    message: str
    document_count: Optional[int] = None
