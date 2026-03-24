from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import User
from app.core.security.dependencies import get_current_user
from app.db.session import get_async_session
from app.services.classification_service import get_recent_by_user
from app.services import user_service
from app.core.storage import upload_file_to_s3


router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}/activities")
async def get_user_activities(
  limit: int = 5,
  offset: int = 0,
  current_user: User = Depends(get_current_user),
  session: AsyncSession = Depends(get_async_session)
):
  try:
    result = await get_recent_by_user(
      session=session,
      user_id=current_user.id,
      limit=limit,
      offset=offset
    )
    data = result["data"]
    total = result["total"]

    return {
      "data": data,
      "total": total,
      "limit": limit,
      "offset": offset
    }
  except Exception as e:
    return HTTPException(status_code=500, detail=str(e))
  

@router.post("/profile-image")
async def update_profile_image(
  image: UploadFile,
  current_user: User = Depends(get_current_user),
  session: AsyncSession = Depends(get_async_session)
):
  try:
    img_ext = image.filename.split(".")[-1]

    if img_ext.lower() not in ["jpg", "jpeg", "png"]:
      raise HTTPException(status_code=400, detail="Invalid image format. Only JPG and PNG are allowed.")
    
    image_url = await upload_file_to_s3(image, f"profile-images/{current_user.id}")

    updated_user = await user_service.update_profile_image(
      user_id=current_user.id,
      image_url=image_url,
      session=session
    )
    return { "profile_picture_url": updated_user.profile_picture_url }
  except Exception as e:
    return HTTPException(status_code=500, detail=str(e))
