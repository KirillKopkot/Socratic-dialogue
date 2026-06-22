# Socratic Dialogue

An interactive web app where users engage in philosophical dialogues with an AI—guided by the Socratic method. Rather than providing direct answers, the AI poses thoughtful questions to help users reach their own conclusions, just as Socrates did.

## Current Status

**Frontend UI complete. FastAPI backend skeleton scaffolded. Database, auth, and AI integration still pending.**

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

### Backend — Skeleton in Place
- **`backend/app/main.py`**: FastAPI application with CORS middleware configured for `localhost:5500` (VSCode Live Server). Includes:
  - Root endpoint (`GET /`) returning project info
  - Health check endpoint (`GET /health`)
  - Ready for additional routes (conversations, messages, chat)
- **`backend/app/config.py`**: Settings management via Pydantic, loads from `.env` file
- **`backend/requirements.txt`**: FastAPI, Uvicorn, Pydantic Settings
- **`backend/Dockerfile`**: Python 3.12 slim container, runs Uvicorn on port 8000
- **`backend/.env.example`**: Template for environment variables
- **`.venv/`**: Python virtual environment with dependencies installed

### What's Missing
- Database models and PostgreSQL integration
- Authentication (Auth0)—hardcoded "Kirill" user in frontend sidebar
- Gemini API integration and Socratic system prompt
- Conversation and message endpoints
- Frontend-to-backend connection (currently all mock data)
- Conversation persistence and history

## Planned Architecture

| Component | Status | Details |
|-----------|--------|---------|
| **Frontend** | ✅ Complete | Vanilla HTML/CSS/JS (no build step); mock data only |
| **Backend** | 🔄 In progress | FastAPI skeleton; needs DB, auth, AI routes |
| **Database** | ⭕ Not started | PostgreSQL + SQLAlchemy models (User, Conversation, Message) |
| **Auth** | ⭕ Not started | Auth0 integration to replace hardcoded user |
| **AI** | ⭕ Not started | Google Gemini API with Socratic system prompt |

## Roadmap

- [x] Scaffold FastAPI backend with basic project structure
- [ ] Set up PostgreSQL and SQLAlchemy: User, Conversation, Message models
- [ ] Create database connection pool and migration setup
- [ ] Integrate Auth0 for authentication; replace hardcoded user
- [ ] Build backend API endpoints:
  - `POST /api/conversations` — create new dialogue
  - `GET /api/conversations` — list user's conversations
  - `GET /api/conversations/{id}/messages` — fetch conversation history
  - `POST /api/conversations/{id}/messages` — send user message and get AI response
- [ ] Integrate Gemini API with Socratic system prompt (never give direct answers, always ask questions)
- [ ] Connect frontend to backend: update chat.js to call real API endpoints instead of mocking
- [ ] Stream AI responses for real-time typing effect
- [ ] Add error handling and retry logic
- [ ] Deploy (frontend: Vercel, backend: Railway/Render)

## Getting Started

### Frontend (No Setup Required)

1. Open `frontend/index.html` directly in a browser to see the landing page
2. Click "Start" to navigate to `frontend/chat.html` and try the mock chat interface
3. Type a message or click a suggestion button; the AI will respond after ~1.3 seconds with a hardcoded Socratic response

**Note:** Login/Registration buttons point to a YouTube placeholder and are not functional.

### Backend (Local Development)

1. Navigate to the `backend/` folder
2. Activate the virtual environment:
   ```bash
   # Windows (PowerShell)
   .venv\Scripts\Activate.ps1
   
   # macOS/Linux
   source .venv/bin/activate
   ```
3. Start the FastAPI dev server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`

4. (Optional) Run the backend in Docker:
   ```bash
   docker build -t socrat-backend .
   docker run -p 8000:8000 socrat-backend
   ```

### What Doesn't Work Yet

- Frontend cannot call backend (no database or API routes)
- No authentication—"Kirill" user is hardcoded in sidebar
- No AI responses—frontend has mocked replies only
- No conversation persistence or history
