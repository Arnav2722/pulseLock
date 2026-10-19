from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Document, AccessToken
from app.schemas import ShareLinkCreate
from app.utils.merkle_logger import log_audit_event
import secrets
import time

router = APIRouter(prefix="/share", tags=["Sharing & Access"])


@router.post("/create")
def create_share_token(payload: ShareLinkCreate, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == payload.doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    token = secrets.token_urlsafe(24)
    now = time.time()
    valid_until = now + payload.duration_seconds

    new_token = AccessToken(
        token=token,
        doc_id=doc.id,
        doctor_alias=payload.doctor_alias,
        is_revoked=False,
        valid_until=valid_until,
        created_at=now,
    )
    db.add(new_token)
    db.commit()

    return {
        "status": "success",
        "token": token,
        "valid_until": valid_until,
        "expires_in_seconds": payload.duration_seconds,
        "doctor_alias": payload.doctor_alias,
    }


@router.get("/record/{token}")
def access_record_by_token(token: str, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    now = time.time()

    token_obj = db.query(AccessToken).filter(AccessToken.token == token).first()

    if not token_obj:
        log_audit_event(
            db, token, None, client_ip, "ACCESS_ATTEMPT", "INVALID_TOKEN", user_agent
        )
        raise HTTPException(
            status_code=404, detail="Access token invalid or does not exist."
        )

    if token_obj.is_revoked:
        log_audit_event(
            db,
            token,
            token_obj.doc_id,
            client_ip,
            "ACCESS_ATTEMPT",
            "MANUALLY_REVOKED",
            user_agent,
        )
        raise HTTPException(
            status_code=403, detail="Access privilege was revoked by the patient."
        )

    if now > token_obj.valid_until:
        log_audit_event(
            db,
            token,
            token_obj.doc_id,
            client_ip,
            "ACCESS_ATTEMPT",
            "SESSION_EXPIRED",
            user_agent,
        )
        raise HTTPException(status_code=403, detail="Access link expired.")

    doc = db.query(Document).filter(Document.id == token_obj.doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Underlying document removed.")

    log_audit_event(
        db, token, doc.id, client_ip, "DOCUMENT_VIEW", "SUCCESS", user_agent
    )

    return {
        "status": "success",
        "filename": doc.filename,
        "file_type": doc.file_type,
        "ciphertext": doc.ciphertext,
        "iv": doc.iv,
        "doctor_alias": token_obj.doctor_alias,
        "valid_until": token_obj.valid_until,
        "time_remaining_seconds": max(0, int(token_obj.valid_until - now)),
    }


@router.post("/revoke/{token}")
def emergency_revoke(token: str, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "unknown"
    token_obj = db.query(AccessToken).filter(AccessToken.token == token).first()
    if not token_obj:
        raise HTTPException(status_code=404, detail="Token not found.")

    token_obj.is_revoked = True
    db.commit()

    log_audit_event(
        db, token, token_obj.doc_id, client_ip, "EMERGENCY_REVOKE", "REVOKED"
    )
    return {
        "status": "success",
        "message": "Access instantly terminated across all active sessions.",
    }
