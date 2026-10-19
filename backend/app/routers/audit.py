from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AuditLog
from app.security import calculate_chain_hash
from app.schemas import VerifyIntegrityResponse

router = APIRouter(prefix="/audit", tags=["Audit & Integrity"])


@router.get("/logs")
def fetch_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(100).all()
    return [
        {
            "id": l.id,
            "token": l.token,
            "doc_id": l.doc_id,
            "ip_address": l.ip_address,
            "action": l.action,
            "status": l.status,
            "timestamp": l.timestamp,
            "previous_hash": l.previous_hash,
            "current_hash": l.current_hash,
        }
        for l in logs
    ]


@router.get("/verify-integrity", response_model=VerifyIntegrityResponse)
def verify_tamper_proofing(db: Session = Depends(get_db)):
    """Walks through the HMAC Merkle chain to prove logs have not been tampered with."""
    logs = db.query(AuditLog).order_by(AuditLog.id.asc()).all()
    if not logs:
        return {
            "is_valid": True,
            "total_logs_checked": 0,
            "message": "No logs recorded yet.",
        }

    prev_hash = "0" * 64
    for log in logs:
        if log.previous_hash != prev_hash:
            return {
                "is_valid": False,
                "total_logs_checked": log.id,
                "message": f"Integrity broken at log ID {log.id}! Previous hash mismatch.",
            }

        payload = f"{log.token}:{log.doc_id}:{log.ip_address}:{log.action}:{log.status}:{log.timestamp}"
        recalculated = calculate_chain_hash(prev_hash, payload)
        if recalculated != log.current_hash:
            return {
                "is_valid": False,
                "total_logs_checked": log.id,
                "message": f"Tampering detected at log ID {log.id}! Cryptographic signature violated.",
            }
        prev_hash = log.current_hash

    return {
        "is_valid": True,
        "total_logs_checked": len(logs),
        "message": "All log entries verified against cryptographic HMAC signatures. Zero tampering detected.",
    }
