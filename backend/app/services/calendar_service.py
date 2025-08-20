from datetime import datetime, timedelta
from typing import Dict

import pytz
from google.oauth2 import service_account
from googleapiclient.discovery import build
from loguru import logger

from app.config import settings


class CalendarService:
    def __init__(self):
        self.calendar_id = settings.GOOGLE_CALENDAR_ID
        self.timezone = settings.RESTAURANT_TIMEZONE
        self.service = self._build_service()
        self._validate_calendar()

    def _build_service(self):
        """Build Google Calendar service"""
        try:
            credentials = service_account.Credentials.from_service_account_file(
                settings.GOOGLE_SERVICE_ACCOUNT_FILE,
                scopes=["https://www.googleapis.com/auth/calendar"],
            )

            return build("calendar", "v3", credentials=credentials)
        except Exception as e:
            logger.info(f"Warning: Could not initialize Google Calendar service: {e}")
            return None

    def _validate_calendar(self):
        """Validate and fix calendar ID if needed"""
        if not self.service:
            return

        # If calendar_id looks like a hash, try 'primary'
        # if len(self.calendar_id) > 50:
        #     logger.info(self.calendar_id)
        #     logger.info("Calendar ID looks invalid, trying 'primary'")
        #     self.calendar_id = "primary"

        # Test the calendar access
        try:
            self.service.calendars().get(calendarId=self.calendar_id).execute()
            logger.info(f"✅ Connected to calendar: {self.calendar_id}")
        except Exception as e:
            if "Not Found" in str(e):
                logger.info(f"Calendar '{self.calendar_id}' not found, using 'primary'")
                self.calendar_id = "primary"
                try:
                    self.service.calendars().get(calendarId="primary").execute()
                    logger.info("✅ Connected to primary calendar")
                except:
                    logger.info(
                        "⚠️ Could not connect to any calendar, reservations will be database-only"
                    )
                    self.service = None

    async def create_reservation(self, reservation_info: Dict) -> Dict:
        """Create a reservation in Google Calendar"""

        # Parse datetime
        reservation_dt = datetime.fromisoformat(
            reservation_info["reservation_datetime"]
        )

        # Set timezone
        tz = pytz.timezone(self.timezone)
        if reservation_dt.tzinfo is None:
            reservation_dt = tz.localize(reservation_dt)

        # Set timezone only if not already set
        tz = pytz.timezone(self.timezone)
        if reservation_dt.tzinfo is None:
            reservation_dt = tz.localize(reservation_dt)
        else:
            # Convert to restaurant timezone if different
            reservation_dt = reservation_dt.astimezone(tz)

        # Calculate end time (2 hours for dining)
        end_dt = reservation_dt + timedelta(hours=2)

        # Create event WITHOUT attendees (service accounts can't invite attendees)
        event = {
            "summary": f"Reservation - {reservation_info['customer_name']} ({reservation_info['party_size']} guests)",
            "description": f"""
Restaurant Reservation Details:
================================
Customer: {reservation_info['customer_name']}
Email: {reservation_info['customer_email']}
Phone: {reservation_info['customer_phone']}
Party Size: {reservation_info['party_size']} guests
Special Requests: {reservation_info.get('special_requests', 'None')}
--------------------------------
Reservation Time: {reservation_dt.strftime('%B %d, %Y at %I:%M %p')}
            """,
            "start": {
                "dateTime": reservation_dt.isoformat(),
                "timeZone": self.timezone,
            },
            "end": {
                "dateTime": end_dt.isoformat(),
                "timeZone": self.timezone,
            },
            "colorId": "11",  # Red color for visibility
            "reminders": {
                "useDefault": True,  # Use calendar's default reminders
            },
        }

        try:
            # Create event without sendUpdates parameter
            created_event = (
                self.service.events()
                .insert(calendarId=self.calendar_id, body=event)
                .execute()
            )

            return {
                "success": True,
                "event_id": created_event["id"],
                "event_link": created_event.get("htmlLink"),
            }
        except Exception as e:
            logger.info(f"Calendar API error: {e}")
            # If calendar fails, still allow reservation (fallback)
            if "Not Found" in str(e):
                logger.info(
                    "Calendar not found, but reservation will be saved to database"
                )
                return {
                    "success": True,
                    "event_id": f"local_{datetime.now().timestamp()}",
                    "event_link": None,
                }
            return {"success": False, "error": str(e)}

    async def check_availability(self, datetime_str: str) -> bool:
        """Check if a time slot is available"""

        check_dt = datetime.fromisoformat(datetime_str)
        tz = pytz.timezone(self.timezone)

        if check_dt.tzinfo is None:
            check_dt = tz.localize(check_dt)

        # Check restaurant hours
        day_name = check_dt.strftime("%A").lower()
        hours = settings.RESTAURANT_HOURS.get(day_name)

        if not hours:
            return False

        open_time = datetime.strptime(hours["open"], "%H:%M").time()
        close_time = datetime.strptime(hours["close"], "%H:%M").time()

        if not (open_time <= check_dt.time() <= close_time):
            return False

        # Check existing reservations (with error handling)
        time_min = check_dt.isoformat()
        time_max = (check_dt + timedelta(hours=2)).isoformat()

        try:
            events_result = (
                self.service.events()
                .list(
                    calendarId=self.calendar_id,
                    timeMin=time_min,
                    timeMax=time_max,
                    singleEvents=True,
                    orderBy="startTime",
                )
                .execute()
            )

            events = events_result.get("items", [])

            # Simple availability check (can be enhanced)
            return len(events) < 10  # Max 10 reservations per 2-hour slot

        except Exception as e:
            logger.info(f"Availability check error: {e}")
            # If calendar check fails, still allow reservation
            return True  # Default to available if check fails
