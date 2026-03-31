from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from . import auth_models, auth_jwt_utils
from database import SessionLocal

# OAuth2 scheme for extracting the Bearer token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency to get the current authenticated user
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth_jwt_utils.decode_access_token(token)
        user_id = payload.get("user_id")
        email = payload.get("email")
        if user_id is None and email is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    # Query the user from the database
    user = None
    if user_id:
        user = db.query(auth_models.User).filter(auth_models.User.id == user_id).first()
    elif email:
        user = db.query(auth_models.User).filter(auth_models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user
