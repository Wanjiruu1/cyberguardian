import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("GEMINI_API_KEY loaded:", bool(GEMINI_API_KEY))

client = genai.Client(api_key=GEMINI_API_KEY)


def analyze_image_with_ai(image_bytes: bytes):
    prompt = """
You are an online child safety assistant.

Analyze this screenshot and determine whether it shows signs of:
- phishing
- cyberbullying
- grooming
- hate_speech
- sexual_content
- scam
- suspicious_link
- safe
- unknown

Return only valid JSON in this format:
{
  "category": "safe",
  "risk_score": 0,
  "explanation": "brief explanation",
  "advice": "child-friendly advice",
  "suggested_action": "ignore_block_report_tell_adult"
}

Rules:
- risk_score must be an integer from 0 to 100
- advice must be simple and child-friendly
- explanation must be short
- if unsure, use category "unknown"
- do not return markdown
"""

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=[
                prompt,
                {
                    "inline_data": {
                        "mime_type": "image/png",
                        "data": image_bytes
                    }
                }
            ],
        )

        content = response.text.strip()
        content = content.replace("```json", "").replace("```", "").strip()

        return json.loads(content)

    except Exception as e:
        print("=== GEMINI IMAGE ERROR ===")
        print(type(e).__name__)
        print(str(e))
        return {
            "category": "unknown",
            "risk_score": 0,
            "explanation": f"Gemini error: {str(e)}",
            "advice": "Try again or ask an adult for help.",
            "suggested_action": "retry"
        }


def chat_with_ai(message: str, age_group: str):
    prompt = f"""
You are a friendly online safety assistant for children.

The child age group is: {age_group}.

Rules:
- Keep answers short, simple, and calm
- Use child-friendly language
- Give practical online safety advice
- Encourage involving a trusted adult if the situation is dangerous

Child's question:
{message}
"""

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )
        print("=== GEMINI CHAT TEXT ===")
        print(response.text)
        return response.text.strip()

    except Exception as e:
        print("=== GEMINI CHAT ERROR ===")
        print(type(e).__name__)
        print(str(e))
        return f"DEBUG ERROR: {type(e).__name__}: {str(e)}"