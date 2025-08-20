import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional

import openai

from app.config import settings
from app.utils.date_parser import parse_date_time

openai.api_key = settings.OPENAI_API_KEY


class OpenAIService:
    def __init__(self):
        self.model = settings.OPENAI_MODEL
        import pytz

        tz = pytz.timezone(settings.RESTAURANT_TIMEZONE)
        current_date = datetime.now(tz).strftime("%A, %B %d, %Y")
        self.system_prompt = f"""You are a friendly and professional restaurant reservation assistant for The Golden Fork, 
        an upscale dining establishment. 


        IMPORTANT CONTEXT:
        - Current date/time: {current_date} (Timezone: {settings.RESTAURANT_TIMEZONE})
        - When customer says "tomorrow", it means {(datetime.now(tz) + timedelta(days=1)).strftime("%B %d, %Y")}
        - Always interpret dates relative to {settings.RESTAURANT_TIMEZONE} timezone
            
        
        Your ROLE is to:
        1. Answer questions about our menu, restaurant, and services
        2. Help customers make table reservations
        3. Collect necessary information for bookings (name, email, phone, party size, date/time, special requests)
        
        Be warm, professional, and helpful. When collecting reservation information, ensure you get:
        - Customer's full name
        - Email address
        - Phone number
        - Number of guests (party size)
        - Preferred date and time
        - Any special requests or dietary restrictions
        
        Restaurant Hours:
        Monday-Wednesday: 11:00 AM - 10:00 PM
        Thursday-Friday: 11:00 AM - 11:00 PM
        Saturday: 10:00 AM - 11:00 PM
        Sunday: 10:00 AM - 9:00 PM
        
        Always confirm the information before finalizing the reservation."""

    async def get_chat_response(
        self, messages: List[Dict], context: Optional[str] = None
    ) -> Dict:
        """Get response from OpenAI with reservation intent detection"""

        # Add context if available (from Qdrant search)
        if context:
            context_message = {
                "role": "system",
                "content": f"Context from restaurant information: {context}",
            }
            messages.insert(1, context_message)

        # Add system prompt
        full_messages = [{"role": "system", "content": self.system_prompt}] + messages

        try:
            response = openai.chat.completions.create(
                model=self.model,
                messages=full_messages,
                temperature=0.7,
                max_tokens=500,
                functions=[
                    {
                        "name": "extract_reservation_info",
                        "description": "Extract reservation information from the conversation",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "has_complete_info": {
                                    "type": "boolean",
                                    "description": "Whether all required information is collected",
                                },
                                "customer_name": {"type": "string"},
                                "customer_email": {"type": "string"},
                                "customer_phone": {"type": "string"},
                                "party_size": {"type": "integer"},
                                "reservation_datetime": {"type": "string"},
                                "special_requests": {"type": "string"},
                            },
                        },
                    }
                ],
                function_call="auto",
            )

            message_content = response.choices[0].message.content
            function_call = None

            if response.choices[0].message.function_call:
                function_call = json.loads(
                    response.choices[0].message.function_call.arguments
                )

                # Parse date if present with timezone awareness
                if function_call.get("reservation_datetime"):
                    import pytz

                    tz = pytz.timezone(settings.RESTAURANT_TIMEZONE)

                    # First try to parse the date
                    parsed_date = parse_date_time(function_call["reservation_datetime"])

                    if parsed_date:
                        # Ensure timezone is set
                        if parsed_date.tzinfo is None:
                            parsed_date = tz.localize(parsed_date)
                        function_call["reservation_datetime"] = parsed_date.isoformat()

            return {"content": message_content, "function_call": function_call}

        except Exception as e:
            print(f"OpenAI API error: {e}")
            return {
                "content": "I apologize, but I'm having trouble processing your request. Please try again.",
                "function_call": None,
            }

    async def generate_confirmation_message(self, reservation_info: Dict) -> str:
        """Generate a confirmation message for the reservation"""

        prompt = f"""Generate a warm, professional confirmation message for this reservation:
        Name: {reservation_info['customer_name']}
        Party Size: {reservation_info['party_size']} guests
        Date/Time: {reservation_info['reservation_datetime']}
        Special Requests: {reservation_info.get('special_requests', 'None')}
        
        Include: confirmation of details, next steps, and contact information."""

        response = openai.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a restaurant reservation assistant at The Golden Fork. Your contacts: [thegoldenfork@gmail.com, 03305186773]",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=200,
        )

        return response.choices[0].message.content
