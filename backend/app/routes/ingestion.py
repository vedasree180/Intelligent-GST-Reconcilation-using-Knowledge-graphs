from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.services.ingestion_service import process_upload

router = APIRouter()

@router.post("/data")
async def upload_data(
    file: UploadFile = File(...),
    document_type: Optional[str] = Form(None)
):
    try:
        content = await file.read()
        return process_upload(content, file.filename, document_type)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
