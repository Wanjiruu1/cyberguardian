from pydantic import BaseModel

# Request model for chatbot
class ChatRequest(BaseModel):
    message: str
    age_group: str = "10-13"  # Default age group

# Response model for chatbot
class ChatResponse(BaseModel):
    bot_reply: str

# Response model for screenshot analysis
class ScreenshotAnalysisResponse(BaseModel):
    category: str
    risk_score: int
    explanation: str
    advice: str
    suggested_action: str
