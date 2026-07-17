import {
  Bell,
  BookOpen,
  CreditCard,
  Mic,
  Minus,
  Package,
  Plus,
} from "lucide-react";
import { Row } from "../components/Row";
import { SectionCard } from "../components/SectionCard";
import { StatCard } from "../components/StatCard";
import { useLanguage } from "../lib/i18n";
import type {
  HomeAlert,
  HomeStats,
  InventoryRow,
  KhataOverview,
  VendorProfileView,
} from "../types";

interface HomePageProps {
  profile: VendorProfileView;
  stats: HomeStats;
  inventory: InventoryRow[];
  khataOverview: KhataOverview;
  eligibleLoanAmount: string;
  alerts: HomeAlert[];
  onAddSale: () => void;
  onUpdateExpense: () => void;
  onEditInventory: (item: InventoryRow) => void;
  onVoiceEntry: () => void;
}

export const HomePage = ({
  profile,
  stats,
  inventory,
  khataOverview,
  eligibleLoanAmount,
  alerts,
  onAddSale,
  onUpdateExpense,
  onEditInventory,
  onVoiceEntry,
}: HomePageProps) => {
  const { t } = useLanguage();
  return (
  <>
    <header className="bg-green-600 p-5 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t("Vendor App")}</h1>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">{t("Hello")}, {profile.name.split(" ")[0]}</h2>
        <p className="text-sm opacity-90">{t("Manage your business easily")}</p>
      </div>
    </header>

    <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard title={t("Sales")} value={`Rs ${stats.sales.toLocaleString("en-IN")}`} bg="bg-green-50" />
        <StatCard
          title={t("Expenses")}
          value={`Rs ${stats.expenses.toLocaleString("en-IN")}`}
          bg="bg-red-50"
        />
        <StatCard
          title={t("Profit")}
          value={`Rs ${(stats.sales - stats.expenses).toLocaleString("en-IN")}`}
          bg="bg-blue-50"
        />
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 p-4 font-semibold text-white" onClick={onVoiceEntry} type="button">
        <Mic size={20} />
        {t("Voice Entry")}
      </button>

      <div className="grid grid-cols-2 gap-3 py-4">
        <button
          className="flex items-center justify-center gap-2 rounded-xl bg-green-100 p-4 font-semibold"
          onClick={onAddSale}
          type="button"
        >
          <Plus size={18} />
          {t("Add Sale")}
        </button>

        <button
          className="flex items-center justify-center gap-2 rounded-xl bg-red-100 p-4 font-semibold"
          onClick={onUpdateExpense}
          type="button"
        >
          <Minus size={18} />
          {t("Update Expense")}
        </button>
      </div>

      <SectionCard icon={<Package className="text-green-600" />} title={t("Inventory")}>
        <p className="mb-2 text-xs text-slate-500">{t("Tap an item to update stock")}</p>
        <div className="space-y-2">
          {inventory.length === 0 && (
            <p className="py-2 text-sm text-slate-500">{t("No inventory items yet.")}</p>
          )}
          {inventory.map((item) => (
            <button
              key={item.id}
              className="flex w-full justify-between rounded-lg px-1 py-1 text-left hover:bg-slate-50"
              onClick={() => onEditInventory(item)}
              type="button"
            >
              <span>{item.label}</span>
              <span className="font-semibold">{item.value}</span>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={<BookOpen className="text-blue-600" />} title={t("Digital Khata")}>
        <div className="space-y-2">
          <Row label={t("Money In")} value={khataOverview.moneyIn} />
          <Row label={t("Money Out")} value={khataOverview.moneyOut} />
          <Row bold label={t("Cash Flow")} value={khataOverview.cashFlow} />
        </div>
      </SectionCard>

      <SectionCard
        icon={<CreditCard className="text-purple-600" />}
        title={t("Business Health")}
      >
        <div>
          <p className="text-lg font-bold">
            {profile.businessHealthIndex} / 100
          </p>
          <div className="mt-2 h-3 w-full rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-green-500"
              style={{ width: `${profile.businessHealthIndex}%` }}
            />
          </div>
          <p className="mt-3 text-sm">
            {t("Eligible Loan")}: <span className="font-bold">{eligibleLoanAmount}</span>
          </p>
        </div>
      </SectionCard>

      <SectionCard icon={<Bell className="text-yellow-500" />} title={t("Alerts")}>
        {alerts.length === 0 ? (
          <p className="text-sm text-slate-500">{t("No alerts right now.")}</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {alerts.map((alert) => (
              <li key={alert.text}>{alert.text}</li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  </>
  );
};
