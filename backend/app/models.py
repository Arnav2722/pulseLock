from sqlalchemy import Column, String, Integer, Float, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
import time
import secrets


class Document(Base):
    __tablename__ = "documents"

    id = Column(String(32), primary_key=True, default=lambda: secrets.token_hex(8))
    filename = Column(String(255), nullable=False)
    file_type = Column(String(100), default="application/octet-stream")
    ciphertext = Column(Text, nullable=False)  # Base64 encrypted payload
    iv = Column(String(64), nullable=False)  # Base64 IV
    file_category = Column(
        String(100), default="general"
    )  # e.g. blood_test, mri, prescription
    created_at = Column(Float, default=lambda: time.time())

    tokens = relationship(
        "AccessToken", back_populates="document", cascade="all, delete-orphan"
    )
    logs = relationship(
        "AuditLog", back_populates="document", cascade="all, delete-orphan"
    )


class AccessToken(Base):
    __tablename__ = "access_tokens"

    token = Column(String(64), primary_key=True)
    doc_id = Column(
        String(32), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False
    )
    doctor_alias = Column(String(255), default="General Doctor")
    is_revoked = Column(Boolean, default=False)
    valid_until = Column(Float, nullable=False)
    created_at = Column(Float, default=lambda: time.time())

    document = relationship("Document", back_populates="tokens")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String(64), nullable=True)
    doc_id = Column(
        String(32), ForeignKey("documents.id", ondelete="SET NULL"), nullable=True
    )
    ip_address = Column(String(64), nullable=False)
    user_agent = Column(String(255), nullable=True)
    action = Column(String(50), nullable=False)  # VIEW, EXPIRED_ATTEMPT, MANUAL_REVOKE
    status = Column(String(30), nullable=False)  # SUCCESS, BLOCKED, EXPIRED
    timestamp = Column(Float, default=lambda: time.time())

    # Tamper-proof cryptographic integrity chaining
    previous_hash = Column(String(64), nullable=False)
    current_hash = Column(String(64), nullable=False)

    document = relationship("Document", back_populates="logs")
