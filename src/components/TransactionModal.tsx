import { useState } from "react";
import { XCircle } from "lucide-react";
import type { TransactionInput, TransactionIntent } from "../types";

interface TransactionModalProps {
  mode: TransactionIntent;
  onClose: () => void;
  onSave: (transaction: TransactionInput, mode: TransactionIntent) => void;
}

export const TransactionModal = ({
  mode,
  onClose,
  onSave,
}: TransactionModalProps) => {
  const isKhata = mode === "khata";
  const isSale = mode === "sale";
  const title = isSale
    ? "Add Sale"
    : mode === "expense"
      ? "Update Expense"
      : "Add Khata Entry";

  const [customer, setCustomer] = useState(
    isKhata ? "Rajesh Kumar" : "Walk-in Customer",
  );
  const [note, setNote] = useState(
    isSale ? "New sale" : mode === "expense" ? "Business expense" : "",
  );
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"in" | "out">(
    isKhata ? "out" : isSale ? "in" : "out",
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const numericAmount = Number(amount);
    if (!note.trim() || numericAmount <= 0) {
      return;
    }

    if (isKhata && !customer.trim()) {
      return;
    }

    onSave(
      {
        amount: numericAmount,
        customer: isKhata ? customer.trim() : "Business",
        note: note.trim(),
        type: isKhata ? type : isSale ? "in" : "out",
      },
      mode,
    );
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
              <span className="text-sm font-bold text-slate-600">Customer</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500"
                onChange={(event) => setCustomer(event.target.value)}
                value={customer}
              />
            </label>
          )}

          <label className="block">
            <span className="text-sm font-bold text-slate-600">Note</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500"
              onChange={(event) => setNote(event.target.value)}
              placeholder={isSale ? "What was sold?" : "Description"}
              value={note}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-600">Amount (Rs)</span>
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
              <span className="text-sm font-bold text-slate-600">Type</span>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500"
                onChange={(event) =>
                  setType(event.target.value === "out" ? "out" : "in")
                }
                value={type}
              >
                <option value="in">Money In</option>
                <option value="out">Money Out</option>
              </select>
            </label>
          )}
        </div>

        <button
          className="mt-4 w-full rounded-xl bg-emerald-600 p-4 font-bold text-white"
          type="submit"
        >
          Save
        </button>
      </form>
    </div>
  );
};
