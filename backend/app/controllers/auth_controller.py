from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from db.session import get_async_session
from schemas.user import UserOut, UserCreate
from db.models import User
from services.auth_service import hash_password

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
    hashed_password=hash_password(password)
  )
  session.add(new_user)
  await session.commit()
  await session.refresh(new_user)

  return {
    "id": str(new_user.id),
    "full_name": new_user.full_name,
    "email": new_user.email
  }
