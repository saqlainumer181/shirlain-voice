import json

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models.schemas import FileUploadResponse
from app.services.qdrant_service import QdrantService

router = APIRouter()
qdrant_service = QdrantService()


@router.post("/upload-restaurant-info", response_model=FileUploadResponse)
async def upload_restaurant_info(file: UploadFile = File(...)):
    """Upload restaurant information JSON file for embeddings"""

    if not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Only JSON files are accepted")

    try:
        # Read file content
        content = await file.read()
        data = json.loads(content)

        # Upload to Qdrant
        document_count = await qdrant_service.upload_restaurant_info(data)

        return FileUploadResponse(
            success=True,
            message=f"Successfully uploaded {document_count} document chunks",
            document_count=document_count,
        )

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
