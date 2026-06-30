"""Gemini service layer.

Wraps the Google Gen AI SDK (``google-genai``) and exposes a single,
database-decoupled entry point for producing Socratic responses.
"""

from google import genai
from google.genai import types

from app.config import settings
from app.prompts.socratic import SYSTEM_PROMPT

# Model to use for the dialogue. "gemini-2.5-flash"
# swap here if a newer one is preferred.
MODEL_NAME = "gemini-2.5-flash"


class GeminiServiceError(RuntimeError):
    """Raised when the Gemini API call cannot be completed."""


def _build_contents(history: list[dict]) -> list[types.Content]:
    """Convert our ``{"role", "content"}`` dicts into Gemini ``Content`` turns.

    Gemini expects roles of "user" and "model"; our schema uses
    "user"/"assistant", so "assistant" is mapped to "model".
    """
    role_map = {"user": "user", "assistant": "model"}
    contents: list[types.Content] = []
    for turn in history:
        role = role_map.get(turn.get("role"))
        if role is None:
            raise GeminiServiceError(
                f"Unsupported message role: {turn.get('role')!r}"
            )
        contents.append(
            types.Content(role=role, parts=[types.Part(text=turn["content"])])
        )
    return contents


async def get_socratic_response(history: list[dict]) -> str:
    """Return Gemini's Socratic reply to the given conversation history.

    Args:
        history: ordered list of ``{"role": "user"|"assistant",
            "content": str}`` dicts.

    Returns:
        The model's reply text.

    Raises:
        GeminiServiceError: if the key is missing or the API call fails.
    """
    if not settings.GEMINI_API_KEY:
        raise GeminiServiceError("GEMINI_API_KEY is not configured.")

    contents = _build_contents(history)

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        response = await client.aio.models.generate_content(
            model=MODEL_NAME,
            contents=contents,
            config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT),
        )
    except Exception as exc:  # noqa: BLE001 — re-raised as a clear domain error
        raise GeminiServiceError(f"Gemini API call failed: {exc}") from exc

    text = response.text
    
    return text
