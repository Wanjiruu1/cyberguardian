from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import auth_models, auth_schemas, auth_security, auth_jwt
from database import SessionLocal

router = APIRouter(prefix="/auth", tags=["auth"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login(user: auth_schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(auth_models.User).filter(auth_models.User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")
    if not auth_security.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")
    # Create JWT token
    token_data = {"user_id": db_user.id, "email": db_user.email}
    access_token = auth_jwt.create_access_token(token_data)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "full_name": db_user.full_name,
            "email": db_user.email,
            "created_at": db_user.created_at
        }
    }
