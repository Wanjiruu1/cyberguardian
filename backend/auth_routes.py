from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import auth_models, auth_schemas, auth_security
from .database import SessionLocal
from .auth_dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=auth_schemas.UserResponse)
def register(user: auth_schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(auth_models.User).filter(auth_models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )
    # Hash the password
    hashed_pw = auth_security.hash_password(user.password)
    # Create new user
    new_user = auth_models.User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    # Return user info (no password)
    return new_user

@router.get("/me")
def read_current_user(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email
    }
