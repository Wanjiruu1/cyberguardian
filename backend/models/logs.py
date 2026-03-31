from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func
from database import Base

# Model for screenshot analysis logs
class ScreenshotLog(Base):
    __tablename__ = "screenshot_logs"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    category = Column(String, nullable=False)
    risk_score = Column(Float, nullable=False)
    explanation = Column(Text, nullable=False)
    advice = Column(Text, nullable=False)
    suggested_action = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Model for chatbot conversation logs
class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_message = Column(Text, nullable=False)
    bot_reply = Column(Text, nullable=False)
    age_group = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())