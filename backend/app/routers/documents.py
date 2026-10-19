from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Document
from app.schemas import DocumentUploadRequest
import secrets
import time

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload")
def upload_document(payload: DocumentUploadRequest, db: Session = Depends(get_db)):
    if not payload.ciphertext or not payload.iv:
        raise HTTPException(status_code=422, detail="Ciphertext and IV are mandatory.")

    doc_id = secrets.token_hex(8)
    new_doc = Document(
        id=doc_id,
        filename=payload.filename,
        file_type=payload.file_type,
        file_category=payload.file_category,
        ciphertext=payload.ciphertext,
        iv=payload.iv,
        created_at=time.time(),
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return {
        "status": "success",
        "doc_id": new_doc.id,
        "filename": new_doc.filename,
        "created_at": new_doc.created_at,
    }


@router.get("/")
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.created_at.desc()).all()
    return [
        {
            "id": d.id,
            "filename": d.filename,
            "file_type": d.file_type,
            "file_category": d.file_category,
            "created_at": d.created_at,
        }
        for d in docs
    ]
