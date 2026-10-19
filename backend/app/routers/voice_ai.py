from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Document
from app.schemas import VoiceCommandRequest
import re

router = APIRouter(prefix="/ai", tags=["Senior Citizen Voice AI"])


@router.post("/process-voice")
def parse_voice_command(payload: VoiceCommandRequest, db: Session = Depends(get_db)):
    """
    Parses natural language speech spoken by elderly users.
    e.g. 'Doctor Sharma ko meri blood test report 15 minute ke liye share kardo'
    """
    text = payload.transcript.lower()

    # 1. Doctor Alias extraction
    doctor_alias = "Consulting Doctor"
    doctor_match = re.search(r"(dr\.?\s*\w+|doctor\s*\w+)", text, re.IGNORECASE)
    if doctor_match:
        doctor_alias = doctor_match.group(0).title()

    # 2. Duration extraction (default: 900s = 15 mins)
    duration_seconds = 900
    if "1 minute" in text or "ek minute" in text or "demo" in text:
        duration_seconds = 60
    elif "5 minute" in text or "panch minute" in text:
        duration_seconds = 300
    elif "15 minute" in text or "pandra minute" in text:
        duration_seconds = 900
    elif "1 ghanta" in text or "1 hour" in text or "ek ghante" in text:
        duration_seconds = 3600
    elif "1 din" in text or "24 hours" in text:
        duration_seconds = 86400

    # 3. Document matching based on spoken keyword
    all_docs = db.query(Document).all()
    matched_doc = None

    for doc in all_docs:
        name_lower = doc.filename.lower()
        cat_lower = (doc.file_category or "").lower()
        # Common terms: blood, sugar, report, mri, prescription, lab
        if any(term in text for term in [name_lower, cat_lower]) or any(
            t in text and t in name_lower
            for t in ["blood", "sugar", "cbc", "mri", "xray", "ecg", "report"]
        ):
            matched_doc = doc
            break

    # If no specific match, fallback to the most recent document
    if not matched_doc and all_docs:
        matched_doc = all_docs[-1]

    if not matched_doc:
        raise HTTPException(
            status_code=404,
            detail="Koi document nahi mila. Kripya pehle report upload karein.",
        )

    return {
        "status": "success",
        "action": "CREATE_SHARE_LINK",
        "matched_document": {
            "id": matched_doc.id,
            "filename": matched_doc.filename,
            "file_category": matched_doc.file_category,
        },
        "target_doctor": doctor_alias,
        "duration_seconds": duration_seconds,
        "confirmation_message": (
            f"Kya aap '{matched_doc.filename}' ko {doctor_alias} ke saath "
            f"{int(duration_seconds / 60)} minute ke liye share karna chahte hain?"
        ),
    }
