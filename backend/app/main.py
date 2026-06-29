from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.config import settings
from app.database import SessionLocal

app = FastAPI(title=settings.PROJECT_NAME)

# Frontend origins allowed to call the API (e.g. VSCode Live Server).
# Adjust as needed once the frontend's real origin is known.
origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/health")
def health():
    return {"status": "ok"}


# Temporary endpoint to verify the database connection works.
# Safe to remove once migrations/models are in place.
@app.get("/health/db")
def health_db():
    try:
        with SessionLocal() as session:
            session.execute(text("SELECT 1"))
        return {"database": "ok"}
    except Exception as exc:
        return JSONResponse(
            status_code=503,
            content={"database": "error", "detail": str(exc)},
        )
