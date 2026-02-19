from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_async_session
from app.schemas.user import UserOut, UserCreate
from app.db.models import User
from app.services.auth_service import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
async def register_user(req: UserCreate, session : AsyncSession = Depends(get_async_session)):
  full_name, email, password = req.full_name, req.email, req.password

  query_result = await session.execute(select(User).where(User.email == email))
  existing_user = query_result.scalars().first()

  if existing_user:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

  new_user = User(
    full_name=full_name,
    email=email,
    password_hash=hash_password(password)
  )
  session.add(new_user)
  await session.commit()
  await session.refresh(new_user)

  return {
    "id": str(new_user.id),
    "full_name": new_user.full_name,
    "email": new_user.email
  }


@router.post("/login")
async def login(
  form_data: OAuth2PasswordRequestForm = Depends(), 
  session: AsyncSession = Depends(get_async_session)
):
  query_result = await session.execute(select(User).where(User.email == form_data.username))
  user = query_result.scalars().first()

  if not user or not verify_password(form_data.password, user.password_hash):
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid email or password",
      headers={"WWW-Authenticate": "Bearer"},
    )
  access_token = create_access_token(data={"sub": str(user.id)})
  
  return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
async def logout(response: Response):
  response.delete_cookie(key="access_token")
  return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
  return {
    "id": str(current_user.id),
    "full_name": current_user.full_name,
    "email": current_user.email,
    "is_admin": current_user.is_admin,
    "profile_image_url": current_user.profile_image_url
  }
