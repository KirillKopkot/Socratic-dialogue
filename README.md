# Socratic Dialogue

An interactive web app where users engage in philosophical dialogues with an AI—guided by the Socratic method. Rather than providing direct answers, the AI poses thoughtful questions to help users reach their own conclusions, just as Socrates did.

## Current Status

**Frontend prototype—no backend or API integration yet.**

### What's Built
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
- **`.gitignore`**: Excludes `.env`, `node_modules`, `.claude/`, etc.

### What's Missing
- Backend API (planned: FastAPI)
- Database layer (planned: PostgreSQL)
- Authentication (planned: Auth0—currently hardcoded "Kirill" user in sidebar)
- Gemini API integration (currently mocked)
- Conversation persistence and history
- Real API endpoints to connect frontend to backend

## Planned Architecture

| Component | Status | Details |
|-----------|--------|---------|
| **Frontend** | ✓ In progress | Vanilla HTML/CSS/JS (no build step) |
| **Backend** | ⭕ Not started | FastAPI (Python) |
| **Database** | ⭕ Not started | PostgreSQL + ORM (e.g., SQLAlchemy) |
| **Auth** | ⭕ Not started | Auth0 integration |
| **AI** | ⭕ Not started | Google Gemini API with Socratic system prompt |

## Roadmap

- [ ] Scaffold FastAPI backend with basic project structure
- [ ] Set up PostgreSQL database and define user + conversation models
- [ ] Integrate Auth0 for user authentication and replace hardcoded user
- [ ] Create backend API endpoints: `/api/conversations`, `/api/messages`, `/api/chat` (streaming)
- [ ] Integrate Gemini API with Socratic system prompt (ensure it asks questions, never gives direct answers)
- [ ] Connect frontend to backend: fetch conversations, send user messages, stream AI responses
- [ ] Implement conversation history: load past dialogues in sidebar, fetch messages
- [ ] Add error handling and retry logic (API failures, auth errors)
- [ ] Deploy (likely Vercel for frontend, cloud platform for backend—e.g., Railway, Render, AWS)

## Getting Started

Currently, only the frontend prototype works:

1. Open `frontend/index.html` in a browser to see the landing page
2. Click "Start" to navigate to `frontend/chat.html` and try the chat interface
3. Type a message or click a suggestion button; the AI will respond after ~1.3 seconds with a mock Socratic question

**Note:** Login/Registration buttons on the landing page are not functional (hardcoded to YouTube placeholder links).

Backend, database, and API integration do not yet exist. See the Roadmap above for next steps.
