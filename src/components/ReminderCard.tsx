import { Bell } from "lucide-react";

interface ReminderCardProps {
  title: string;
  description: string;
  tag: string;
  tone: string;
}

export const ReminderCard = ({
  title,
  description,
  tag,
  tone,
}: ReminderCardProps) => {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "rose"
        ? "bg-rose-50 text-rose-700"
        : tone === "sky"
          ? "bg-sky-50 text-sky-700"
          : "bg-amber-50 text-amber-700";

  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneClass}`}
        >
          <Bell size={19} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-black">{title}</h3>
            <span
              className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${toneClass}`}
            >
              {tag}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  );
};
