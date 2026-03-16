from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import User
from app.core.security.dependencies import get_current_user
from app.db.session import get_async_session
from app.services.classification_service import get_recent_by_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}/activities")
async def get_user_activities(
  current_user: User = Depends(get_current_user),
  session: AsyncSession = Depends(get_async_session)
):
  try:
    return await get_recent_by_user(
      session=session,
      user_id=current_user.id
    )
  except Exception as e:
    return HTTPException(status_code=500, detail=str(e))