from fastapi import FastAPI, Depends, Request, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.config import settings
from app.database import Base, engine, get_db
from app.routers import documents, share, audit, voice_ai
from app.schemas import DocumentUploadRequest, ShareLinkCreate
import base64
from typing import Optional

# Tables create karo
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Zero-Knowledge Ephemeral Health Data Exchange Engine",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Production modular routers
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(share.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)
app.include_router(voice_ai.router, prefix=settings.API_V1_STR)


# ==========================================
# BACKWARD COMPATIBILITY ALIASES (FOR FRONTEND)
# ==========================================


@app.post("/api/upload")
async def legacy_upload(
    request: Request,
    filename: Optional[str] = Form(None),
    file_type: Optional[str] = Form(None),
    ciphertext: Optional[str] = Form(None),
    iv: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    final_filename = "medical_record.pdf"
    final_filetype = "application/pdf"
    final_ciphertext = ""
    final_iv = ""

    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        body = await request.json()
        final_filename = (
            body.get("filename") or body.get("fileName") or "medical_record.pdf"
        )
        final_filetype = (
            body.get("file_type") or body.get("fileType") or "application/pdf"
        )
        final_ciphertext = body.get("ciphertext", "")
        final_iv = body.get("iv", "")
    else:
        form_data = await request.form()
        final_filename = (
            form_data.get("filename")
            or form_data.get("fileName")
            or "medical_record.pdf"
        )
        final_filetype = (
            form_data.get("file_type") or form_data.get("fileType") or "application/pdf"
        )
        final_ciphertext = form_data.get("ciphertext", "")
        final_iv = form_data.get("iv", "")

        if file:
            final_filename = file.filename or final_filename
            content = await file.read()
            final_ciphertext = base64.b64encode(content).decode("utf-8")

    payload = DocumentUploadRequest(
        filename=str(final_filename),
        file_type=str(final_filetype),
        ciphertext=str(final_ciphertext),
        iv=str(final_iv),
        file_category="general",
    )
    return documents.upload_document(payload, db)


@app.post("/api/share")
async def legacy_share(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    doc_id = body.get("doc_id") or body.get("docId")
    duration = body.get("duration_seconds") or body.get("durationSeconds") or 900
    alias = body.get("doctor_alias") or "Consulting Doctor"

    payload = ShareLinkCreate(
        doc_id=doc_id, duration_seconds=int(duration), doctor_alias=alias
    )
    return share.create_share_token(payload, db)


@app.get("/api/record/{token}")
def legacy_record(token: str, request: Request, db: Session = Depends(get_db)):
    return share.access_record_by_token(token, request, db)


@app.get("/api/logs")
def legacy_logs(db: Session = Depends(get_db)):
    return audit.fetch_audit_logs(db)


@app.get("/")
def health_check():
    return {
        "system": "PulseLock Enterprise Core",
        "status": "OPERATIONAL",
        "zero_knowledge_engine": "ACTIVE",
    }
