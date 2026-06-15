import { Bell, CheckCircle } from "lucide-react";
import { ReminderCard } from "../components/ReminderCard";
import { SectionTitle } from "../components/SectionTitle";
import type { ReminderItem } from "../types";
import { useLanguage } from "../lib/i18n";

interface AlertsPageProps {
  reminders: ReminderItem[];
}

export const AlertsPage = ({ reminders }: AlertsPageProps) => {
  const { t } = useLanguage();
  return (
  <>
    <header className="bg-emerald-700 px-5 pb-5 pt-5 text-white">
      <div className="flex items-center justify-between">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
          <Bell size={21} />
        </button>
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-100">
            {t("Reminders")}
          </p>
          <h1 className="text-lg font-bold">{t("Alerts")}</h1>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
          <CheckCircle size={20} />
        </button>
      </div>

      <section className="mt-5 rounded-2xl bg-white p-4 text-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{t("Needs attention")}</p>
            <h2 className="mt-1 text-3xl font-black">{reminders.length}</h2>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
            {t("Today")}
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          {t("Inventory, khata, loan, payment, and compliance reminders in one place.")}
        </p>
      </section>
    </header>

    <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
      <SectionTitle action={t("All")} title={t("Reminders & Suggestions")} />
      <div className="space-y-3">
        {reminders.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
            {t("No reminders yet. They will appear here when you add them.")}
          </p>
        ) : (
          reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id ?? reminder.title}
              {...reminder}
            />
          ))
        )}
      </div>
    </div>
  </>
  );
};
