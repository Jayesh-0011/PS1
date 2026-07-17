import { useEffect, useRef, useState } from "react";
import { Mic, Square, XCircle } from "lucide-react";
import { interpretVoiceEntry } from "../lib/voiceApi";
import { useLanguage } from "../lib/i18n";
import type { TransactionInput, TransactionIntent, VoiceInterpretation } from "../types";

interface VoiceEntryModalProps {
  onClose: () => void;
  onSaved: () => void;
  onSave: (transaction: TransactionInput, intent: TransactionIntent) => Promise<void>;
}

const emptyResult: VoiceInterpretation = {
  amount: null,
  confidence: 0,
  intent: "unknown",
  item: "",
  note: "",
  transcript: "",
  translation: "",
};

export const VoiceEntryModal = ({ onClose, onSave, onSaved }: VoiceEntryModalProps) => {
  const { language } = useLanguage();
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<VoiceInterpretation>(emptyResult);

  useEffect(() => () => {
    if (recorder.current?.state === "recording") recorder.current.stop();
  }, []);

  const persistInterpretation = async (interpretation: VoiceInterpretation) => {
    if (interpretation.intent === "unknown" || !interpretation.amount || interpretation.amount <= 0) {
      setError("I could not identify a sale or expense amount. Please record the transaction again.");
      return false;
    }
    setSaving(true);
    try {
      console.info("[voice] saving model JSON to Supabase", interpretation);
      await onSave(
        {
          amount: interpretation.amount,
          customer: "Business",
          note: [
            interpretation.item.trim(),
            interpretation.note.trim() || interpretation.translation || interpretation.transcript,
          ]
            .filter(Boolean)
            .join(" - "),
          type: interpretation.intent === "sale" ? "in" : "out",
          voicePayload: interpretation,
        },
        interpretation.intent,
      );
      console.info("[voice] Supabase transaction saved; history refresh requested");
      onSaved();
      return true;
    } catch (saveError) {
      console.error("[voice] Supabase save failed", saveError);
      setError(saveError instanceof Error ? saveError.message : "Could not save the entry.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const startRecording = async () => {
    setError("");
    setResult(emptyResult);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      chunks.current = [];
      recorder.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => event.data.size && chunks.current.push(event.data);
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        setProcessing(true);
        try {
          const audio = new Blob(chunks.current, { type: mediaRecorder.mimeType || "audio/webm" });
          const interpretation = await interpretVoiceEntry(audio, language);
          setResult(interpretation);
          await persistInterpretation(interpretation);
        } catch (voiceError) {
          setError(voiceError instanceof Error ? voiceError.message : "Could not understand the recording.");
        } finally {
          setProcessing(false);
        }
      };
      mediaRecorder.start();
      setRecording(true);
    } catch {
      setError("Microphone access is required for voice entry.");
    }
  };

  const stopRecording = () => recorder.current?.state === "recording" && recorder.current.stop();

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-slate-950/40 px-3 pb-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div><h2 className="text-lg font-black">Voice entry</h2><p className="text-sm text-slate-500">Say: “Sold tea for 120 rupees”</p></div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600" onClick={onClose} type="button"><XCircle size={20} /></button>
        </div>

        <button
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl p-4 font-bold text-white ${recording ? "bg-rose-600" : "bg-emerald-600"}`}
          disabled={processing}
          onClick={recording ? stopRecording : startRecording}
          type="button"
        >
          {recording ? <Square size={19} /> : <Mic size={19} />}
          {recording ? "Stop recording" : processing ? "Understanding…" : "Start speaking"}
        </button>

        {Boolean(result.transcript) && (
          <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-3">
            <p className="text-sm text-slate-600"><span className="font-bold">Heard:</span> {result.transcript}</p>
            {result.translation && result.translation !== result.transcript && (
              <p className="text-sm text-slate-600"><span className="font-bold">English:</span> {result.translation}</p>
            )}
            <p className="text-sm text-slate-600">
              Saving {result.intent === "sale" ? "sale" : result.intent === "expense" ? "expense" : "transaction"}
              {result.amount ? ` of Rs ${result.amount.toLocaleString("en-IN")}` : ""} to history…
            </p>
          </div>
        )}
        {error && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        {saving && <p className="mt-3 text-center text-sm font-semibold text-emerald-700">Saving transaction to history…</p>}
      </div>
    </div>
  );
};
