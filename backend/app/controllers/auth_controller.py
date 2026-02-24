from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_session
from app.schemas.user import UserOut, UserCreate
from app.db.models import User
from app.core.security.jwt import create_access_token
from app.core.security.dependencies import get_current_user
from app.services.user_service import get_by_email, create_user, validate_password
from app.core.error_messages import USER_ALREADY_EXISTS, INVALID_CREDENTIALS
from app.core.config import Settings


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut)
async def register_user(
  req: UserCreate, 
  session : AsyncSession = Depends(get_async_session)
):
  existing_user = await get_by_email(req.email, session)

  if existing_user:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=USER_ALREADY_EXISTS)

  user = await create_user(
    full_name=req.full_name,
    email=req.email,
    password=req.password,
    session=session
  )

  return user


@router.post("/login")
async def login(
  response: Response,
  form_data: OAuth2PasswordRequestForm = Depends(), 
  session: AsyncSession = Depends(get_async_session)
):
  settings = Settings()

  user = await get_by_email(form_data.username, session)

  if not user or not validate_password(form_data.password, user.password_hash):
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail=INVALID_CREDENTIALS,
      headers={"WWW-Authenticate": "Bearer"},
    )
  access_token = create_access_token(data={"sub": str(user.id)})

  response.set_cookie(
    key="access_token",
    value=access_token,
    httponly=True,
    #secure=True,  # Set to True in production
    samesite="lax",
    max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
  )
  
  return {"message": "Login successful"}


@router.post("/logout")
async def logout(response: Response):
  response.delete_cookie(key="access_token")
  return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
  return current_user
