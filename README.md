# Socratic Dialogue

An interactive web app where users engage in philosophical dialogues with an AI—guided by the Socratic method. Rather than providing direct answers, the AI poses thoughtful questions to help users reach their own conclusions, just as Socrates did.

## Current Status

**Frontend UI complete. Backend fully scaffolded with FastAPI, PostgreSQL, models, migrations, and Gemini API integration. Auth0 and conversation/message API endpoints pending.**

### Frontend — Complete UI
- **`frontend/index.html`**: Landing page with header (Login/Registration links point to YouTube placeholder), hero section featuring Socrates quote, explanation of Socratic dialogue, CTA with "Start" button, and footer with social links.
- **`frontend/chat.html`**: Chat interface with collapsible sidebar (showing mock conversation history), top bar, empty state with greeting and suggestion buttons, message display area, and input box with "Socratic mode" indicator.
- **`frontend/js/chat.js`**: Client-side logic for:
  - Textarea auto-resize and Enter-to-send (Shift+Enter for newline)
  - Suggestion buttons populate the input
  - User/AI message rendering with HTML escaping
  - Typing indicator animation
  - Transition from empty state to messages view on first message
  - "New Dialogue" button to reset the chat
  - Mobile sidebar toggle
  - **Hardcoded placeholder**: AI responses are mocked with a 1.3-second delay and a static Socratic response—no real API calls yet
- **`frontend/style.css` + `frontend/chat.css`**: Complete styling for landing page and chat interface
- **`frontend/images/`**: Favicon, Socrates statue image, wreath, and social icons

### Backend — FastAPI + PostgreSQL + Gemini
- **`backend/app/main.py`**: FastAPI application with CORS middleware configured for `localhost:5500`. Endpoints:
  - `GET /` — project info
  - `GET /health` — API health check
  - `GET /health/db` — database connection test
  - `POST /test/gemini` — temporary endpoint to test Gemini response (for development)
- **`backend/app/config.py`**: Settings management via Pydantic (loads from `.env`), includes DATABASE_URL, GEMINI_API_KEY
- **`backend/app/database.py`**: SQLAlchemy engine, session factory, and declarative base
- **`backend/app/models/`**: SQLAlchemy ORM models:
  - **`user.py`**: User model with `auth0_sub` (unique), email, name, avatar_url, created_at
  - **`conversation.py`**: Conversation model with user FK, title, is_archived, timestamps, user relationship
  - **`message.py`**: Message model with conversation FK, role ('user'/'assistant'), content, created_at, conversation relationship
- **`backend/app/services/gemini_service.py`**: Gemini API wrapper:
  - `get_socratic_response(history)` async function — sends conversation history to Gemini and returns Socratic reply
  - Converts message roles (assistant → model) for Gemini API compatibility
  - Uses `gemini-2.5-flash` model
  - Error handling with `GeminiServiceError`
- **`backend/app/prompts/socratic.py`**: System prompt that enforces Socratic dialogue:
  - Never give direct answers; always ask probing questions
  - Surface contradictions/assumptions as questions, not statements
  - Keep responses concise (back-and-forth dialogue, not essays)
  - Engage with any topic (philosophy, science, ethics, personal decisions, etc.)
- **`backend/alembic/`**: Alembic migration framework with initial migration:
  - Creates `users`, `conversations`, `messages` tables with relationships
  - Supports rollback/forward migrations
- **`backend/requirements.txt`**: FastAPI, Uvicorn, Pydantic Settings, SQLAlchemy, psycopg2-binary, Alembic, google-genai
- **`docker-compose.yml`**: PostgreSQL 16 service with persistent volume
- **`backend/.env.example`**: Template with PostgreSQL and Gemini API credentials
- **`backend/Dockerfile`**: Python 3.12 slim container, runs Uvicorn on port 8000
- **`.venv/`**: Python virtual environment with dependencies installed

### What's Missing
- Authentication (Auth0)—hardcoded "Kirill" user in frontend sidebar
- Conversation and message API endpoints (endpoints for CRUD operations)
- Frontend-to-backend connection (frontend still uses mock data; needs real API calls)
- Conversation history loading from database in sidebar
- Frontend integration with real Gemini responses

## Planned Architecture

| Component | Status | Details |
|-----------|--------|---------|
| **Frontend** | ✅ Complete | Vanilla HTML/CSS/JS (no build step); mock data only |
| **Backend** | 🔄 In progress | FastAPI, CORS, config, health checks, Gemini service; needs conversation/message routes |
| **Database** | ✅ Complete | PostgreSQL 16, SQLAlchemy models (User/Conversation/Message), Alembic migrations |
| **Auth** | ⭕ Not started | Auth0 integration to replace hardcoded user |
| **AI** | ✅ Complete | Google Gemini API with comprehensive Socratic system prompt |

## Roadmap

- [x] Scaffold FastAPI backend with basic project structure
- [x] Set up PostgreSQL and SQLAlchemy connection layer (Docker Compose, database.py, config)
- [x] Define ORM models: User, Conversation, Message (with relationships and timestamps)
- [x] Create database migrations (Alembic) — User/Conversation/Message tables with FKs
- [x] Integrate Gemini API with comprehensive Socratic system prompt
- [ ] Integrate Auth0 for authentication; replace hardcoded user
- [ ] Build backend API endpoints:
  - `POST /api/conversations` — create new dialogue
  - `GET /api/conversations` — list user's conversations
  - `GET /api/conversations/{id}/messages` — fetch conversation history
  - `POST /api/conversations/{id}/messages` — send user message and get Gemini response
- [ ] Apply database migration: `alembic upgrade head`
- [ ] Connect frontend to backend: update chat.js to call real API endpoints instead of mocking
- [ ] Stream AI responses for real-time typing effect (instead of 1.3s mock delay)
- [ ] Add error handling and retry logic for API failures
- [ ] Deploy (frontend: Vercel, backend: Railway/Render)

## Getting Started

### Frontend (No Setup Required)

1. Open `frontend/index.html` directly in a browser to see the landing page
2. Click "Start" to navigate to `frontend/chat.html` and try the mock chat interface
3. Type a message or click a suggestion button; the AI will respond after ~1.3 seconds with a hardcoded Socratic response

**Note:** Login/Registration buttons point to a YouTube placeholder and are not functional.

### Backend + Database (Local Development)

**Option 1: Local PostgreSQL via Docker Compose** (recommended)

1. In the project root, start PostgreSQL:
   ```bash
   docker-compose up -d
   ```
   This spins up a PostgreSQL 16 container on `localhost:5432` with database `socrat`.

2. Navigate to `backend/` and set up the `.env` file:
   ```bash
   cd backend
   cp .env.example .env
   ```
   Edit `.env` and add your Gemini API key (get one free at https://aistudio.google.com/apikey):
   ```
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

3. Activate the virtual environment:
   ```bash
   # Windows (PowerShell)
   .venv\Scripts\Activate.ps1
   
   # macOS/Linux
   source .venv/bin/activate
   ```

4. Run Alembic migrations to create tables:
   ```bash
   alembic upgrade head
   ```

5. Start the FastAPI dev server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`.

6. Test endpoints:
   ```bash
   # Health check
   curl http://localhost:8000/health
   
   # Database connection
   curl http://localhost:8000/health/db
   
   # Test Gemini (returns Socratic response)
   curl -X POST http://localhost:8000/test/gemini \
     -H "Content-Type: application/json" \
     -d '{"message": "What is knowledge?"}'
   ```

**Option 2: Docker Compose for Backend + Database**

```bash
docker-compose up -d
docker build -t socrat-backend ./backend
docker run -p 8000:8000 --network socrat-setup_default -e DATABASE_URL=postgresql://postgres:postgres@db:5432/socrat socrat-backend
```

### Next Steps

- **Auth0 integration**: Authentication not yet wired up; "Kirill" hardcoded in frontend sidebar
- **Conversation/Message API endpoints**: Need to build routes to persist conversations to database
- **Frontend-backend connection**: chat.js still uses mock data and hardcoded 1.3s delay instead of calling real API
- **Conversation history**: Sidebar shows static mock conversations; not yet loading from database
- **Error handling**: API error handling and retry logic for network failures
- **Deployment**: Frontend and backend deployment setup
