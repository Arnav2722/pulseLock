from pydantic import BaseModel
from typing import Optional


class DocumentUploadRequest(BaseModel):
    filename: str
    file_type: str = "application/pdf"
    file_category: Optional[str] = "general"
    ciphertext: str
    iv: str


class ShareLinkCreate(BaseModel):
    doc_id: str
    duration_seconds: int = 900
    doctor_alias: Optional[str] = "Consulting Doctor"


class VoiceCommandRequest(BaseModel):
    transcript: str


class VerifyIntegrityResponse(BaseModel):
    is_valid: bool
    total_logs_checked: int
    message: str
