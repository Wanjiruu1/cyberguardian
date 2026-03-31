import os
from datetime import datetime, timedelta
from jose import jwt, JWTError, ExpiredSignatureError
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecret")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# Generate a JWT access token with expiry
def generate_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Decode and validate a JWT access token
def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise Exception("Token has expired.")
    except JWTError:
        raise Exception("Invalid token.")
