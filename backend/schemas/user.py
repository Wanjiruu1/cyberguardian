from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    user = "user"
    guardian = "guardian"
    admin = "admin"

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    age_group: Optional[str] = None
    role: UserRole = UserRole.user

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: UserRole
    age_group: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserProfileResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: UserRole
    age_group: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age_group: Optional[str] = None