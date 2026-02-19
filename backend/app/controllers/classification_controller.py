from fastapi import APIRouter, HTTPException, UploadFile, File
from app.services.classification_service import run_classification, save_classification, get_user_classifications, get_classification_by_id
from PIL import Image
from app.services.ml.preprocess import preprocess_image
from app.services.auth_service import get_current_user
from app.db.models import User
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_session
from app.schemas.classification import ClassificationOut
from app.core.constants import TOP_K

router = APIRouter(prefix="/classifications", tags=["classifications"])

@router.get("/", response_model=list[ClassificationOut])
async def get_classifications(
  current_user: User = Depends(get_current_user),
  session: AsyncSession = Depends(get_async_session)
):
  return await get_user_classifications(
    session=session,
    user_id=current_user.id
  )
  

@router.get("/{classification_id}", response_model=ClassificationOut)
async def get_classification(
  classification_id: str,
  current_user: User = Depends(get_current_user),
  session: AsyncSession = Depends(get_async_session)
):
  return await get_classification_by_id(
    session=session,
    classification_id=classification_id,
    user_id=current_user.id
  )


@router.post("/")
async def classification(
  file: UploadFile = File(...), 
  current_user: User = Depends(get_current_user),
  session: AsyncSession = Depends(get_async_session)
):
  try:
    image = Image.open(file.file)
  except Exception:
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


