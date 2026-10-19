from sqlalchemy.orm import Session
from app.models import AuditLog
from app.security import calculate_chain_hash
import time


def log_audit_event(
    db: Session,
    token: str | None,
    doc_id: str | None,
    ip_address: str,
    action: str,
    status: str,
    user_agent: str | None = None,
) -> AuditLog:
    # Pichla log hash nikalo
    last_log = db.query(AuditLog).order_by(AuditLog.id.desc()).first()
    prev_hash = last_log.current_hash if last_log else "0" * 64

    now = time.time()
    payload = f"{token}:{doc_id}:{ip_address}:{action}:{status}:{now}"
    curr_hash = calculate_chain_hash(prev_hash, payload)

    new_log = AuditLog(
        token=token,
        doc_id=doc_id,
        ip_address=ip_address,
        user_agent=user_agent or "unknown",
        action=action,
        status=status,
        timestamp=now,
        previous_hash=prev_hash,
        current_hash=curr_hash,
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log
