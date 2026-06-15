import { useState } from "react";
import { XCircle } from "lucide-react";
import type {
  InventoryRow,
  TransactionInput,
  TransactionIntent,
} from "../types";
import { useLanguage } from "../lib/i18n";

interface TransactionModalProps {
  inventory: InventoryRow[];
  mode: TransactionIntent;
  onClose: () => void;
  onSave: (
    transaction: TransactionInput,
    mode: TransactionIntent,
  ) => Promise<void>;
}

export const TransactionModal = ({
  inventory,
  mode,
  onClose,
  onSave,
}: TransactionModalProps) => {
  const { t } = useLanguage();
  const isKhata = mode === "khata";
  const isSale = mode === "sale";
  const title = isSale
    ? t("Add Sale")
    : mode === "expense"
      ? t("Update Expense")
      : t("Add Khata Entry");

  const [customer, setCustomer] = useState(
    isKhata ? "Rajesh Kumar" : "Walk-in Customer",
  );
  const [selectedItemId, setSelectedItemId] = useState(
    isSale ? (inventory[0]?.id ?? "other") : "",
  );
  const [otherItem, setOtherItem] = useState("");
  const [note, setNote] = useState(
    mode === "expense" ? "Business expense" : "",
  );
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"in" | "out">(
    isKhata ? "out" : isSale ? "in" : "out",
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const numericAmount = Number(amount);
    const selectedItem = inventory.find((item) => item.id === selectedItemId);
    const saleItem =
      selectedItemId === "other" ? otherItem.trim() : selectedItem?.label;
    const transactionNote = isSale
      ? [saleItem, note.trim()].filter(Boolean).join(" - ")
      : note.trim();

    if (!transactionNote || numericAmount <= 0) {
      return;
    }

    if (isKhata && !customer.trim()) {
      return;
    }

    setSaving(true);
    setSaveError("");
    try {
      await onSave(
        {
          amount: numericAmount,
          customer: isKhata ? customer.trim() : "Business",
          note: transactionNote,
          type: isKhata ? type : isSale ? "in" : "out",
        },
        mode,
      );
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : t("Could not save the entry."),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-slate-950/40 px-3 pb-4">
      <form
        className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">{title}</h2>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600"
            onClick={onClose}
            type="button"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {isKhata && (
            <label className="block">
              <span className="text-sm font-bold text-slate-600">{t("Customer")}</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500"
                onChange={(event) => setCustomer(event.target.value)}
                value={customer}
              />
            </label>
          )}

          {isSale && (
            <label className="block">
              <span className="text-sm font-bold text-slate-600">{t("Item sold")}</span>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500"
                onChange={(event) => setSelectedItemId(event.target.value)}
                required
                value={selectedItemId}
              >
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
                <option value="other">{t("Other item")}</option>
              </select>
            </label>
          )}

          {isSale && selectedItemId === "other" && (
            <label className="block">
              <span className="text-sm font-bold text-slate-600">{t("Item name")}</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500"
                onChange={(event) => setOtherItem(event.target.value)}
                placeholder={t("Enter item sold")}
                required
                value={otherItem}
              />
            </label>
          )}

          <label className="block">
            <span className="text-sm font-bold text-slate-600">
              {isSale ? t("Note (optional)") : t("Note")}
            </span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500"
              onChange={(event) => setNote(event.target.value)}
              placeholder={isSale ? t("Sale details") : t("Description")}
              value={note}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-600">{t("Amount (Rs)")}</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500"
              min="1"
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0"
              required
              step="any"
              type="number"
              value={amount}
            />
          </label>

          {isKhata && (
            <label className="block">
              <span className="text-sm font-bold text-slate-600">{t("Type")}</span>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500"
                onChange={(event) =>
                  setType(event.target.value === "out" ? "out" : "in")
                }
                value={type}
              >
                <option value="in">{t("Money In")}</option>
                <option value="out">{t("Money Out")}</option>
              </select>
            </label>
          )}
        </div>

        {saveError && (
          <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
            {saveError}
          </p>
        )}

        <button
          className="mt-4 w-full rounded-xl bg-emerald-600 p-4 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={saving}
          type="submit"
        >
          {saving ? t("Saving...") : t("Save")}
        </button>
      </form>
    </div>
  );
};
