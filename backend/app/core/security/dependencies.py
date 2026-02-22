from fastapi import Depends, HTTPException, status
from app.services.auth_service import verify_access_token
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_session
from fastapi.params import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.db.models import User
from app.core.error_messages import INVALID_TOKEN, USER_NOT_FOUND, ADMIN_PRIVILEGES_REQUIRED
from app.services.user_service import get_by_id


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: AsyncSession = Depends(get_async_session)
):
    token = credentials.credentials
    payload = verify_access_token(token)
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_TOKEN
        )
    
    user = await get_by_id(user_id, session)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=USER_NOT_FOUND
        )
    return user


async def get_admin_user(
  current_user: User = Depends(get_current_user)
) -> User:
  if not current_user.is_admin:
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail=ADMIN_PRIVILEGES_REQUIRED
    )
  return current_user
