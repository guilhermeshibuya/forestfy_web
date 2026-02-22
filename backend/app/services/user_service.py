from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import User
from sqlalchemy import select
from uuid import UUID

from app.core.security.hashing import hash_password, verify_password

async def get_by_email(
  email: str,
  session: AsyncSession
):
  result = await session.execute(
    select(User).where(User.email == email)
  )
  return result.scalars().first()


async def get_by_id(
  user_id: UUID,
  session: AsyncSession
):
  result = await session.execute(
    select(User).where(User.id == user_id)
  )
  return result.scalars().first()


async def create_user(
  full_name: str,
  email: str,
  password: str,
  session: AsyncSession
):
  new_user = User(
    full_name=full_name,
    email=email,
    password_hash=hash_password(password)
  )
  session.add(new_user)

  await session.commit()
  await session.refresh(new_user)

  return new_user


def validate_password(plain: str, hashed: str) -> bool:
  return verify_password(plain, hashed)
  