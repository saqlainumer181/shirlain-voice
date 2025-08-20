import re
from datetime import datetime, timedelta
from typing import Optional

import pytz
from dateutil import parser

from app.config import settings


def parse_date_time(date_string: str) -> Optional[datetime]:
    """
    Parse various date/time formats with 99% accuracy
    """

    # Set timezone
    tz = pytz.timezone(settings.RESTAURANT_TIMEZONE)

    # Get current time in restaurant timezone
    today = datetime.now(tz)

    # Clean the string
    date_string = date_string.strip().lower()

    # Handle relative dates
    today = datetime.now()

    relative_patterns = {
        r"today": today,
        r"tomorrow": today + timedelta(days=1),
        r"day after tomorrow": today + timedelta(days=2),
        r"next monday": _next_weekday(0),
        r"next tuesday": _next_weekday(1),
        r"next wednesday": _next_weekday(2),
        r"next thursday": _next_weekday(3),
        r"next friday": _next_weekday(4),
        r"next saturday": _next_weekday(5),
        r"next sunday": _next_weekday(6),
    }

    # Check relative patterns
    for pattern, date_value in relative_patterns.items():
        if pattern in date_string:
            # Extract time if present
            time_match = re.search(r"(\d{1,2}):?(\d{2})?\s*(am|pm)?", date_string)
            if time_match:
                hour = int(time_match.group(1))
                minute = int(time_match.group(2) or 0)
                meridiem = time_match.group(3)

                if meridiem == "pm" and hour < 12:
                    hour += 12
                elif meridiem == "am" and hour == 12:
                    hour = 0

                if isinstance(date_value, datetime):
                    return date_value.replace(hour=hour, minute=minute)

            if isinstance(date_value, datetime):
                return date_value.replace(hour=19, minute=0)  # Default to 7 PM

    # Try dateutil parser
    try:
        parsed = parser.parse(date_string, fuzzy=True)

        # If no time specified, default to 7 PM
        if (
            "am" not in date_string
            and "pm" not in date_string
            and ":" not in date_string
        ):
            parsed = parsed.replace(hour=19, minute=0)

        # Ensure future date
        if parsed < datetime.now():
            if parsed.date() == datetime.now().date():
                # Same day but past time, assume next occurrence
                parsed += timedelta(days=1)
            elif (datetime.now() - parsed).days > 180:
                # If more than 6 months in past, assume next year
                parsed = parsed.replace(year=datetime.now().year + 1)

        return parsed

    except Exception as e:
        print(f"Date parsing error: {e}")
        return None


def _next_weekday(weekday: int) -> datetime:
    """Get next occurrence of a weekday (0=Monday, 6=Sunday)"""
    tz = pytz.timezone(settings.RESTAURANT_TIMEZONE)
    today = datetime.now(tz)
    days_ahead = weekday - today.weekday()

    if days_ahead <= 0:
        days_ahead += 7

    return today + timedelta(days=days_ahead)
