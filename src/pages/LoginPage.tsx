import { useState } from "react";
import { Smartphone } from "lucide-react";
import { useLanguage } from "../lib/i18n";

interface LoginPageProps {
  error?: string;
  onLogin: (mobileNumber: string) => Promise<void>;
}

const normalizeMobileNumber = (value: string) =>
  value.replace(/\D/g, "").slice(-10);

export const LoginPage = ({ error: loginError, onLogin }: LoginPageProps) => {
  const { t } = useLanguage();
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizeMobileNumber(mobileNumber);

    if (!/^[6-9]\d{9}$/.test(normalized)) {
      setError(t("Enter a valid 10-digit mobile number."));
      return;
    }

    setSubmitting(true);
    try {
      await onLogin(normalized);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-4 py-8 text-slate-950">
      <section className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-xl shadow-emerald-100">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white">
          <Smartphone size={26} />
        </div>
        <h1 className="mt-6 text-2xl font-black">{t("Login to Vendor App")}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {t("Enter your mobile number to continue. No OTP is required.")}
        </p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-bold text-slate-700">
              {t("Mobile number")}
            </span>
            <div className="mt-2 flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-emerald-500">
              <span className="flex items-center bg-slate-50 px-3 text-sm font-bold text-slate-600">
                +91
              </span>
              <input
                autoComplete="tel"
                autoFocus
                className="min-w-0 flex-1 px-3 py-4 text-base outline-none"
                inputMode="numeric"
                maxLength={10}
                onChange={(event) => {
                  setMobileNumber(event.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                placeholder="9876543210"
                type="tel"
                value={mobileNumber}
              />
            </div>
          </label>

          {(error || loginError) && (
            <p className="mt-2 text-sm font-semibold text-rose-600">
              {error || loginError}
            </p>
          )}

          <button
            className="mt-5 w-full rounded-xl bg-emerald-600 p-4 font-bold text-white disabled:bg-emerald-300"
            disabled={submitting}
            type="submit"
          >
            {submitting ? t("Signing in...") : t("Continue")}
          </button>
        </form>
      </section>
    </main>
  );
};
