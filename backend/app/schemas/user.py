from pydantic import BaseModel, EmailStr
from uuid import UUID

class UserCreate(BaseModel):
  full_name: str
  email: EmailStr
  password: str

class UserOut(BaseModel):
  id: UUID
  full_name: str
  email: EmailStr
