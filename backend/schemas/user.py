from pydantic import BaseModel, EmailStr
from datetime import datetime

# Schema for user registration
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

# Schema for user login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schema for user response (no password)
class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    created_at: datetime

    class Config:
        orm_mode = True
