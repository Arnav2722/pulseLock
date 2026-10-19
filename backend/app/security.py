import hmac
import hashlib
from app.config import settings


def calculate_chain_hash(prev_hash: str, log_payload: str) -> str:
    """Tamper-proof HMAC SHA-256 for audit chaining."""
    message = f"{prev_hash}|{log_payload}".encode("utf-8")
    return hmac.new(
        settings.SECRET_KEY.encode("utf-8"), message, hashlib.sha256
    ).hexdigest()
