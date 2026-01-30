from fastapi import APIRouter, HTTPException, UploadFile, File
from app.services.classification_service import run_classification, save_classification
from PIL import Image
from app.services.ml.preprocess import preprocess_image
from app.services.auth_service import get_current_user
from app.db.models import User
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_session

router = APIRouter(prefix="/classification", tags=["classification"])

@router.post("/")
async def classification(
  file: UploadFile = File(...), 
  current_user: User = Depends(get_current_user),
  session: AsyncSession = Depends(get_async_session)
):
  TOP_K = 5

  try:
    image = Image.open(file.file)
  except Exception as e:
    raise HTTPException(status_code=400, detail="Invalid image")
  
  tensor = preprocess_image(image)
  results = run_classification(tensor, top_k=TOP_K)

  classification = await save_classification(
    session=session,
    user_id=current_user.id,
    image_url="http://example.com/image.jpg",  # Placeholder URL
    location=None,
    predictions=results
  )

  return {
    "classification_id": classification.id,
    "top_k": TOP_K,
    "predictions": results
  }