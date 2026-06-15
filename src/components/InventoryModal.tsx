import { useState } from "react";
import { XCircle } from "lucide-react";
import type { InventoryRow } from "../types";
import { useLanguage } from "../lib/i18n";

interface InventoryModalProps {
  item: InventoryRow;
  onClose: () => void;
  onSave: (itemId: string, quantity: number) => void;
}

export const InventoryModal = ({ item, onClose, onSave }: InventoryModalProps) => {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(String(item.quantity));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const numericQuantity = Number(quantity);
    if (Number.isNaN(numericQuantity) || numericQuantity < 0) {
      return;
    }

    onSave(item.id, numericQuantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-slate-950/40 px-3 pb-4">
      <form
        className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">{t("Update Stock")}: {item.label}</h2>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600"
            onClick={onClose}
            type="button"
          >
            <XCircle size={20} />
          </button>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-bold text-slate-600">
            {t("Quantity")} ({item.unit})
          </span>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500"
            min="0"
            onChange={(event) => setQuantity(event.target.value)}
            required
            step="any"
            type="number"
            value={quantity}
          />
        </label>

        <button
          className="mt-4 w-full rounded-xl bg-emerald-600 p-4 font-bold text-white"
          type="submit"
        >
          {t("Save Stock")}
        </button>
      </form>
    </div>
  );
};
