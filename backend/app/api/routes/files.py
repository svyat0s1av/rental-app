import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.filename or "." not in file.filename:
        raise HTTPException(status_code=400, detail="Некорректное имя файла")

    allowed_extensions = {".pdf", ".jpg", ".jpeg", ".png"}
    file_ext = "." + file.filename.rsplit(".", 1)[-1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Разрешены только PDF, JPG и PNG")
        
    os.makedirs("uploads", exist_ok=True)
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join("uploads", unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"/uploads/{unique_filename}"}
