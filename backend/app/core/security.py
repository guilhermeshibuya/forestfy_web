from fastapi import Depends, HTTPException, status
from app.services.auth_service import get_current_user
from app.db.models import User

async def get_admin_user(
  current_user: User = Depends(get_current_user)
) -> User:
  if not current_user.is_admin:
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail="Admin privileges required"
    )
  return current_user