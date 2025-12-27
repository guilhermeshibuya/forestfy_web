from pydantic import BaseModel, EmailStr
from uuid import UUID

class UserCreate(BaseModel):
  full_name: str
  email: EmailStr
  password: str

class UserLogin(BaseModel):
  email: EmailStr
  password: str

class UserOut(BaseModel):
  id: UUID
  full_name: str
  email: EmailStr
  is_admin: bool
  profile_image_url: str | None = None
