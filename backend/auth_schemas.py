from pydantic import BaseModel, EmailStr
from datetime import datetime

# Pydantic schema for user creation
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

# Pydantic schema for user login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Pydantic schema for user response (no password)
class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    created_at: datetime

    class Config:
        orm_mode = True
