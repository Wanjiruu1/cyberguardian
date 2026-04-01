from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from models.user import User
from schemas.user import UserCreate, UserLogin, UserResponse, UserProfileResponse, UserProfileUpdate
from utils.security import hash_password, verify_password, generate_access_token, decode_access_token
from database import SessionLocal

router = APIRouter(prefix="/auth", tags=["auth"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# OAuth2 scheme for extracting the Bearer token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Register endpoint
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.")

    if user.role == "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin accounts cannot be created through public registration."
        )

    hashed_pw = hash_password(user.password)

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hashed_pw,
        age_group=user.age_group,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Login endpoint
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials."
        )

    token_data = {
        "user_id": db_user.id,
        "email": db_user.email,
        "role": db_user.role
    }
    access_token = generate_access_token(token_data)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "full_name": db_user.full_name,
            "email": db_user.email,
            "role": db_user.role,
            "age_group": db_user.age_group,
            "created_at": db_user.created_at
        }
    }

# Dependency to get the current authenticated user
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        user_id = payload.get("user_id")
        email = payload.get("email")
        if user_id is None and email is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    user = db.query(User).filter(User.id == user_id).first() if user_id else db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# Protected route to get current user info
@router.get("/me")
def read_current_user(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email
    }

# GET /profile/me endpoint to return the current user's profile
@router.get("/profile/me", response_model=UserProfileResponse)
def get_my_profile(current_user=Depends(get_current_user)):
    """
    Get the currently authenticated user's profile.
    """
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": getattr(current_user, "role", None),
        "age_group": getattr(current_user, "age_group", None),
        "created_at": current_user.created_at,
        "updated_at": current_user.updated_at,
    }

# PUT /profile/me endpoint to update the current user's full_name and age_group
@router.put("/profile/me", response_model=UserProfileResponse)
def update_my_profile(
    update: UserProfileUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(SessionLocal)
):
    """
    Update the currently authenticated user's profile (full_name, age_group only).
    """
    updated = False
    if update.full_name is not None:
        current_user.full_name = update.full_name
        updated = True
    if update.age_group is not None:
        current_user.age_group = update.age_group
        updated = True
    if not updated:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No valid fields to update.")
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": getattr(current_user, "role", None),
        "age_group": getattr(current_user, "age_group", None),
        "created_at": current_user.created_at,
        "updated_at": current_user.updated_at,
    }
