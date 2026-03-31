from passlib.context import CryptContext

# Create a password context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash a plain password
# Usage: hashed = hash_password('mysecret')
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verify a plain password against a hashed password
# Usage: verify_password('plain', 'hashed') -> True/False
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
