import type { VoiceInterpretation } from "../types";

const voiceApiUrl = (import.meta.env.VITE_VOICE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export const interpretVoiceEntry = async (audio: Blob, language: string) => {
  const form = new FormData();
  form.append("audio", audio, "voice-entry.webm");
  form.append("language", language);

  const response = await fetch(`${voiceApiUrl}/v1/voice/interpret`, {
    body: form,
    method: "POST",
  });
  const payload = (await response.json().catch(() => null)) as
    | VoiceInterpretation
    | { detail?: string }
    | null;

  if (!response.ok) {
    console.error("[voice] API request failed", { status: response.status, payload });
    throw new Error(
      payload && "detail" in payload && payload.detail
        ? payload.detail
        : "Voice service could not process this recording.",
    );
  }

  console.info("[voice] model JSON received", payload);
  return payload as VoiceInterpretation;
};
