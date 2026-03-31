from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from models import user as user_model
from routes import auth as auth_routes
from schemas.chat import ChatRequest, ChatResponse
from schemas.user import UserCreate, UserLogin, UserResponse
from ai_service import chat_with_ai

# Create database tables
Base.metadata.create_all(bind=engine)
app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the authentication router
app.include_router(auth_routes.router)

# Simple health check endpoint
@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/test-gemini")
def test_gemini():
    return {"message": "Gemini route is working"}

@app.post("/chat")
def chat(request: ChatRequest):
    reply = chat_with_ai(request.message, request.age_group)
    return {"reply": reply}
