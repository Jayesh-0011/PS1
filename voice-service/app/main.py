import json
import logging
import os
import re
import tempfile
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Literal

import httpx
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel
from pydantic import BaseModel, Field

logger = logging.getLogger("voice-service")


MODEL_SIZE = os.getenv("WHISPER_MODEL", "small")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:3b")
MAX_AUDIO_BYTES = int(os.getenv("MAX_AUDIO_BYTES", str(10 * 1024 * 1024)))
ALLOWED_ORIGINS = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",") if origin.strip()]
TRANSACTION_SCHEMA = {
    "type": "object",
    "properties": {
        "intent": {"type": "string", "enum": ["sale", "expense", "unknown"]},
        "amount": {"type": ["number", "null"]},
        "item": {"type": "string"},
        "note": {"type": "string"},
        "confidence": {"type": "number", "minimum": 0, "maximum": 1},
    },
    "required": ["intent", "amount", "item", "note", "confidence"],
}

DEVANAGARI_DIGITS = str.maketrans("०१२३४५६७८९", "0123456789")
SALE_TERMS = ("sold", "sale", "sell", "बेचा", "बेची", "बेचे", "बिक्री", "बिकी")
EXPENSE_TERMS = ("paid", "bought", "purchase", "spent", "expense", "खरीदा", "खरीदी", "खर्च", "भुगतान")
NUMBER_WORDS = {
    "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
    "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14,
    "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18,
    "nineteen": 19, "twenty": 20, "thirty": 30, "forty": 40,
    "fifty": 50, "sixty": 60, "seventy": 70, "eighty": 80,
    "ninety": 90,
    "शून्य": 0, "एक": 1, "दो": 2, "तीन": 3, "चार": 4, "पांच": 5,
    "पाँच": 5, "छह": 6, "सात": 7, "आठ": 8, "नौ": 9, "दस": 10,
    "ग्यारह": 11, "बारह": 12, "तेरह": 13, "चौदह": 14, "पंद्रह": 15,
    "पन्द्रह": 15, "सोलह": 16, "सत्रह": 17, "अठारह": 18, "उन्नीस": 19,
    "बीस": 20, "तीस": 30, "चालीस": 40, "पचास": 50, "साठ": 60,
    "सत्तर": 70, "अस्सी": 80, "नब्बे": 90,
}
HUNDRED_WORDS = {"hundred", "सौ"}
THOUSAND_WORDS = {"thousand", "हजार"}
CURRENCY_WORDS = {"rs", "rupee", "rupees", "रुपया", "रुपये", "रुपयों"}


class VoiceInterpretation(BaseModel):
    transcript: str
    translation: str = ""
    intent: Literal["sale", "expense", "unknown"] = "unknown"
    amount: float | None = Field(default=None, ge=0)
    item: str = ""
    note: str = ""
    confidence: float = Field(default=0, ge=0, le=1)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # CPU int8 keeps the container economical; use CUDA only on a GPU worker.
    app.state.whisper = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
    yield


app = FastAPI(title="Vendor Voice Service", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.get("/healthz")
async def healthz():
    return {"status": "ok", "whisper_model": MODEL_SIZE}


def parse_model_json(raw: str, transcript: str, translation: str) -> VoiceInterpretation:
    """Keep the LLM advisory: malformed output safely becomes an unclassified entry."""
    match = re.search(r"\{.*\}", raw, flags=re.DOTALL)
    if not match:
        return VoiceInterpretation(transcript=transcript, translation=translation, note=translation or transcript)

    try:
        data = json.loads(match.group())
        intent = data.get("intent") if data.get("intent") in {"sale", "expense"} else "unknown"
        amount = data.get("amount")
        amount = float(amount) if amount is not None else None
        return VoiceInterpretation(
            transcript=transcript,
            translation=translation,
            intent=intent,
            amount=amount if amount and amount > 0 else None,
            item=str(data.get("item") or "")[:120],
            note=str(data.get("note") or transcript)[:240],
            confidence=float(data.get("confidence", 0)) if 0 <= float(data.get("confidence", 0)) <= 1 else 0,
        )
    except (TypeError, ValueError, json.JSONDecodeError):
        return VoiceInterpretation(transcript=transcript, translation=translation, note=translation or transcript)


def parse_spoken_number(tokens: list[str]) -> float | None:
    if not tokens:
        return None

    total = 0
    current = 0
    for token in tokens:
        if token in NUMBER_WORDS:
            current += NUMBER_WORDS[token]
        elif token in HUNDRED_WORDS:
            current = (current or 1) * 100
        elif token in THOUSAND_WORDS:
            total += (current or 1) * 1000
            current = 0
        else:
            return None

    amount = total + current
    return float(amount) if amount > 0 else None


def extract_amount(text: str) -> float | None:
    normalized = text.lower().translate(DEVANAGARI_DIGITS)
    numeric_match = re.search(
        r"(?:₹\s*|(?:rs\.?|rupees?|रुपया|रुपये|रुपयों)\s*)(\d+(?:\.\d{1,2})?)|"
        r"(\d+(?:\.\d{1,2})?)\s*(?:₹|rs\.?|rupees?|रुपया|रुपये|रुपयों)",
        normalized,
    )
    if numeric_match:
        amount = float(numeric_match.group(1) or numeric_match.group(2))
        return amount if amount > 0 else None

    tokens = re.findall(r"[a-z]+|[\u0900-\u097f]+|\d+(?:\.\d+)?", normalized)
    for index, token in enumerate(tokens):
        if token not in CURRENCY_WORDS:
            continue

        number_tokens: list[str] = []
        for previous in reversed(tokens[max(0, index - 4):index]):
            if previous in NUMBER_WORDS or previous in HUNDRED_WORDS or previous in THOUSAND_WORDS:
                number_tokens.append(previous)
            elif number_tokens:
                break

        amount = parse_spoken_number(list(reversed(number_tokens)))
        if amount is not None:
            return amount

    return None


def extract_fallback_transaction(transcript: str, translation: str) -> VoiceInterpretation | None:
    texts = [translation, transcript]
    combined_text = " ".join(texts).lower()
    is_sale = any(term in combined_text for term in SALE_TERMS)
    is_expense = any(term in combined_text for term in EXPENSE_TERMS)
    intent = "sale" if is_sale and not is_expense else "expense" if is_expense and not is_sale else "unknown"
    amount = None
    for text in texts:
        amount = extract_amount(text)
        if amount is not None:
            break

    if intent == "unknown" or amount is None:
        return None

    return VoiceInterpretation(
        transcript=transcript,
        translation=translation,
        intent=intent,
        amount=amount,
        note=translation or transcript,
        confidence=0.75,
    )


def complete_interpretation(result: VoiceInterpretation, transcript: str, translation: str) -> VoiceInterpretation:
    fallback = extract_fallback_transaction(transcript, translation)
    if not fallback:
        return result

    if result.intent == "unknown":
        result.intent = fallback.intent
    if result.amount is None:
        result.amount = fallback.amount
    if not result.note:
        result.note = fallback.note
    result.confidence = max(result.confidence, fallback.confidence)
    return result


async def interpret_with_ollama(transcript: str, translation: str) -> VoiceInterpretation:
    prompt = f'''You are a transaction extractor for a small Indian business. Extract exactly one bookkeeping transaction from this speech transcript: {transcript!r}
English translation, when the original speech is not English: {translation!r}
Return JSON only with keys intent, amount, item, note, confidence.
intent must be sale, expense, or unknown. amount must be a number in Indian rupees or null.
item is the product/service purchased or sold, if mentioned; otherwise an empty string.
Never invent an amount or item. Convert spoken numbers such as "one hundred and twenty" to 120.
Examples: "sold 3 tea for 120 rupees" => sale, 120, tea. "paid 80 rupees for milk" => expense, 80, milk.
Return the JSON object only; do not explain your answer.'''
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False, "format": TRANSACTION_SCHEMA, "think": False, "options": {"temperature": 0}},
            )
            response.raise_for_status()
            result = parse_model_json(response.json().get("response", ""), transcript, translation)
            result = complete_interpretation(result, transcript, translation)
            logger.info("Voice transaction extracted: intent=%s, amount=%s", result.intent, result.amount)
            return result
    except httpx.HTTPError:
        # A transcript is still useful if the optional interpretation service is unavailable.
        logger.exception("Ollama transaction extraction failed")
        fallback = extract_fallback_transaction(transcript, translation)
        return fallback or VoiceInterpretation(
            transcript=transcript,
            translation=translation,
            note=translation or transcript,
        )


@app.post("/v1/voice/interpret", response_model=VoiceInterpretation)
async def interpret_voice(audio: UploadFile = File(...), language: str = Form("en")):
    if audio.content_type and not audio.content_type.startswith(("audio/", "video/")):
        raise HTTPException(status_code=415, detail="Please upload an audio recording.")
    payload = await audio.read(MAX_AUDIO_BYTES + 1)
    if not payload:
        raise HTTPException(status_code=400, detail="The recording was empty.")
    if len(payload) > MAX_AUDIO_BYTES:
        raise HTTPException(status_code=413, detail="Recording is too large. Please keep it under 10 MB.")

    suffix = Path(audio.filename or "recording.webm").suffix or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temp_file:
        temp_file.write(payload)
        temp_path = temp_file.name
    try:
        detected_language = "hi" if language == "hi" else None
        segments, info = app.state.whisper.transcribe(
            temp_path,
            language=detected_language,
            task="transcribe",
            vad_filter=True,
            beam_size=3,
        )
        transcript = " ".join(segment.text.strip() for segment in segments).strip()
        if not transcript:
            raise HTTPException(status_code=422, detail="No speech was detected. Please try again.")
        translation = transcript
        if info.language != "en":
            translated_segments, _ = app.state.whisper.transcribe(
                temp_path,
                language=detected_language,
                task="translate",
                vad_filter=True,
                beam_size=3,
            )
            translation = " ".join(segment.text.strip() for segment in translated_segments).strip() or transcript

        result = await interpret_with_ollama(transcript, translation)
        # Whisper language confidence is not a transaction confidence, so it is only a fallback.
        if not result.confidence:
            result.confidence = max(0, min(1, info.language_probability))
        return result
    finally:
        Path(temp_path).unlink(missing_ok=True)
