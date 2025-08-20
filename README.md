# 🍽️ The Golden Fork - AI Restaurant Reservation Chatbot

An intelligent, real-time chatbot system for restaurant reservations and inquiries, featuring natural language processing, automated booking management, and seamless calendar integration.

![Chat Interface Screenshot](./screenshots/chat-interface.png)
_[Add your screenshot here - showing the beautiful purple gradient chat interface]_

## ✨ Features

- **🤖 AI-Powered Conversations**: Natural language processing using OpenAI GPT-4 for intelligent customer interactions
- **📅 Automated Reservations**: Complete reservation system with Google Calendar integration
- **💬 Real-time Communication**: WebSocket-based instant messaging for seamless conversations
- **🔍 Smart Context Retrieval**: Vector database (Qdrant) for accurate restaurant information retrieval
- **📱 Responsive Design**: Modern, mobile-friendly interface with elegant purple gradient theme
- **🗄️ Data Persistence**: PostgreSQL database for storing conversations and reservation history
- **🐳 Containerized Deployment**: Docker setup for easy deployment and scaling

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern UI framework
- **Styled Components** - Component-based styling
- **Socket.io Client** - WebSocket communication
- **React Markdown** - Rich text message rendering
- **Date-fns** - Date formatting utilities

### Backend

- **FastAPI** - High-performance Python web framework
- **OpenAI API** - GPT-4 model for conversational AI
- **Qdrant** - Vector database for semantic search
- **PostgreSQL** - Relational database for data storage
- **Google Calendar API** - Reservation management
- **WebSockets** - Real-time bidirectional communication

### DevOps

- **Docker & Docker Compose** - Containerization and orchestration
- **Nginx** - Reverse proxy (optional)

## 📋 Prerequisites

- Docker and Docker Compose installed
- OpenAI API key
- Google Cloud service account with Calendar API access
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/golden-fork-chatbot.git
cd golden-fork-chatbot
```

### 2. Set Up Environment Variables

Create a `.env` file in the `backend` directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=postgresql://shirlain:shirlain@postgres:5432/restaurant_chatbot

# Qdrant Configuration
QDRANT_HOST=qdrant
QDRANT_PORT=6333
QDRANT_COLLECTION=restaurant_info

# Google Calendar Configuration
GOOGLE_CALENDAR_ID=your_calendar_id@group.calendar.google.com
GOOGLE_SERVICE_ACCOUNT_FILE=/app/credentials/service-account.json

# Application Configuration
APP_HOST=0.0.0.0
APP_PORT=8000
```

### 3. Set Up Google Calendar Service Account

1. Create a service account in Google Cloud Console
2. Enable Google Calendar API
3. Download the service account JSON key
4. Place it in `backend/credentials/service-account.json`
5. Share your Google Calendar with the service account email

### 4. Launch with Docker Compose

```bash
docker-compose up --build
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Qdrant Dashboard**: http://localhost:6333/dashboard

## 💻 Development Setup

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend
npm install
npm start
```

## 📁 Project Structure

```
golden-fork-chatbot/
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   ├── config.py      # Configuration
│   │   └── main.py        # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   ├── Dockerfile
│   └── restaurant_info.json  # Restaurant data
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # WebSocket service
│   │   ├── styles/        # Styled components
│   │   └── App.js         # Main application
│   ├── package.json       # Node dependencies
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

### REST API

- `POST /api/chat` - Send chat message
- `POST /api/upload-restaurant-info` - Upload restaurant information
- `GET /health` - Health check endpoint

### WebSocket

- `ws://localhost:8000/ws` - Real-time chat connection

## 🎯 Key Features Explained

### Intelligent Conversation Flow

The chatbot understands context and maintains conversation history, providing relevant responses about:

- Menu items and pricing
- Restaurant hours and location
- Dietary restrictions and special requests
- Table availability and reservations

### Reservation System

Complete reservation workflow including:

1. Natural language date/time parsing
2. Customer information collection
3. Availability checking
4. Google Calendar integration
5. Confirmation with details

### Vector Search

Restaurant information is embedded and stored in Qdrant for:

- Fast semantic search
- Context-aware responses
- Accurate menu recommendations

## 🔧 Configuration

### Restaurant Information

Update `backend/restaurant_info.json` to customize:

- Menu items and descriptions
- Operating hours
- Policies and special services
- Wine list and pricing

### Timezone Settings

Configure timezone in `backend/app/config.py`:

```python
RESTAURANT_TIMEZONE = "Asia/Karachi"
```

### UI Customization

Modify colors and styling in `frontend/src/config.js`:

```javascript
COLORS: {
  primary: '#5B5FCF',      // Primary purple
  secondary: '#7B3FF2',    // Secondary purple
  // ... other colors
}
```

## 📊 Database Schema

The system uses PostgreSQL with the following main tables:

- `chat_sessions` - Track conversation sessions
- `chat_messages` - Store message history
- `reservations` - Manage restaurant bookings

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📈 Monitoring

- **Logs**: Check Docker logs with `docker-compose logs -f [service_name]`
- **Database**: Connect to PostgreSQL at `localhost:5432`
- **Vector DB**: Qdrant dashboard at `http://localhost:6333/dashboard`

## 🚢 Deployment

### Production Considerations

1. Use environment-specific `.env` files
2. Set up SSL certificates for HTTPS
3. Configure proper CORS origins
4. Use production-grade database hosting
5. Implement rate limiting and authentication
6. Set up monitoring and logging services

### Docker Production Build

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please contact:

- Email: thegoldenfork@gmail.com
- Phone: XXXXXXXXXXX

## 🖼️ Screenshots

### Chat Interface

![Chat Interface](./screenshots/chat-interface.png)
_[Add screenshot showing the main chat interface with the purple gradient background]_

<p align="center">Built with ❤️ for The Golden Fork Restaurant</p>
