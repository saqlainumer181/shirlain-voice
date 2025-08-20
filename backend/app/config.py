import os

from dotenv import load_dotenv

load_dotenv()


class Settings:

    def __init__(self):
        import pytz

        try:
            pytz.timezone(self.RESTAURANT_TIMEZONE)
        except:
            print(f"Invalid timezone {self.RESTAURANT_TIMEZONE}, using UTC")
            self.RESTAURANT_TIMEZONE = "UTC"

    # OpenAI
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL = "gpt-4o-mini"

    # Database
    DATABASE_URL = os.getenv("DATABASE_URL")

    # Qdrant
    QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))
    QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "restaurant_info")

    # Google Calendar
    GOOGLE_CALENDAR_ID = os.getenv("GOOGLE_CALENDAR_ID", "")
    GOOGLE_SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", "")

    # Application
    APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
    APP_PORT = int(os.getenv("APP_PORT", 8000))

    # Restaurant Info
    RESTAURANT_NAME = "The Golden Fork"
    RESTAURANT_TIMEZONE = "Asia/Karachi"
    RESTAURANT_HOURS = {
        "monday": {"open": "11:00", "close": "22:00"},
        "tuesday": {"open": "11:00", "close": "22:00"},
        "wednesday": {"open": "11:00", "close": "22:00"},
        "thursday": {"open": "11:00", "close": "23:00"},
        "friday": {"open": "11:00", "close": "23:00"},
        "saturday": {"open": "10:00", "close": "23:00"},
        "sunday": {"open": "10:00", "close": "21:00"},
    }


settings = Settings()
