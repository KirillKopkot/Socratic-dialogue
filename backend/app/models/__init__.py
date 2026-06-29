"""SQLAlchemy models.

Importing every model here ensures they are registered on ``Base.metadata``
so Alembic autogeneration can detect them.
"""

from app.models.conversation import Conversation
from app.models.message import Message
from app.models.user import User

__all__ = ["User", "Conversation", "Message"]
