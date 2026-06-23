from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

# Engine is the entry point to the database, configured from DATABASE_URL.
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Session factory; instantiate (SessionLocal()) to get a unit-of-work session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base that future ORM models will inherit from.
Base = declarative_base()
