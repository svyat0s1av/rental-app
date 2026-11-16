from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    role: UserRole = UserRole.RENTER

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=50)

class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True