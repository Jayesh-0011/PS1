import { useState } from "react";
import {
  Bell,
  BookOpen,
  CreditCard,
  Home,
  User,
} from "lucide-react";
import { InventoryModal } from "./components/InventoryModal";
import { NavItem } from "./components/NavItem";
import { TransactionModal } from "./components/TransactionModal";
import { useVendorApp } from "./hooks/useVendorApp";
import { AlertsPage } from "./pages/AlertsPage";
import { HomePage } from "./pages/HomePage";
import { KhataPage } from "./pages/KhataPage";
import { LoansPage } from "./pages/LoansPage";
import { ProfilePage } from "./pages/ProfilePage";
import type { InventoryRow, Page, TransactionInput, TransactionIntent } from "./types";

const App = () => {
  const [activePage, setActivePage] = useState<Page>("khata");
  const [transactionIntent, setTransactionIntent] =
    useState<TransactionIntent | null>(null);
  const [editingInventoryItem, setEditingInventoryItem] =
    useState<InventoryRow | null>(null);
  const {
    loading,
    error,
    usingMockData,
    profile,
    khataFeed,
    inventory,
    loanOffers,
    reminders,
    homeStats,
    khataOverview,
    homeAlerts,
    eligibleLoanAmount,
    totalReceivable,
    saveTransaction,
    updateInventory,
    submitProfileAction,
  } = useVendorApp();

  const handleSaveTransaction = (
    transaction: TransactionInput,
    intent: TransactionIntent,
  ) => {
    setTransactionIntent(null);
    void saveTransaction(transaction, intent);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-3 py-4 text-slate-950">
        <div className="rounded-2xl bg-white px-6 py-4 text-sm font-semibold shadow-lg">
          Loading vendor data...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-4 text-slate-950">
      {(error || usingMockData) && (
        <div className="mx-auto mb-3 max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {usingMockData
            ? "Supabase is not configured or unavailable. Changes stay on this device only."
            : error}
        </div>
      )}

      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-md flex-col overflow-hidden rounded-[28px] bg-white shadow-xl shadow-slate-300/60">
        {activePage === "home" && (
          <HomePage
            alerts={homeAlerts}
            eligibleLoanAmount={eligibleLoanAmount}
            inventory={inventory}
            khataOverview={khataOverview}
            onAddSale={() => setTransactionIntent("sale")}
            onEditInventory={setEditingInventoryItem}
            onUpdateExpense={() => setTransactionIntent("expense")}
            profile={profile}
            stats={homeStats}
          />
        )}
        {activePage === "khata" && (
          <KhataPage
            entries={khataFeed}
            onAddExpense={() => setTransactionIntent("expense")}
            onAddSale={() => setTransactionIntent("sale")}
            totalReceivable={totalReceivable}
          />
        )}
        {activePage === "alerts" && <AlertsPage reminders={reminders} />}
        {activePage === "loans" && (
          <LoansPage
            businessHealthIndex={profile.businessHealthIndex}
            loanOffers={loanOffers}
          />
        )}
        {activePage === "profile" && (
          <ProfilePage
            onSubmitAction={submitProfileAction}
            profile={profile}
          />
        )}

        <nav className="fixed bottom-4 left-1/2 grid w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 grid-cols-5 rounded-2xl border border-slate-200 bg-white px-2 py-3 shadow-lg shadow-slate-300/60">
          <NavItem
            active={activePage === "home"}
            icon={<Home size={20} />}
            label="Home"
            onClick={() => setActivePage("home")}
          />
          <NavItem
            active={activePage === "khata"}
            icon={<BookOpen size={20} />}
            label="Khata"
            onClick={() => setActivePage("khata")}
          />
          <NavItem
            active={activePage === "alerts"}
            icon={<Bell size={20} />}
            label="Alerts"
            onClick={() => setActivePage("alerts")}
          />
          <NavItem
            active={activePage === "loans"}
            icon={<CreditCard size={20} />}
            label="Loans"
            onClick={() => setActivePage("loans")}
          />
          <NavItem
            active={activePage === "profile"}
            icon={<User size={20} />}
            label="Profile"
            onClick={() => setActivePage("profile")}
          />
        </nav>

        {transactionIntent && (
          <TransactionModal
            mode={transactionIntent}
            onClose={() => setTransactionIntent(null)}
            onSave={handleSaveTransaction}
          />
        )}

        {editingInventoryItem && (
          <InventoryModal
            item={editingInventoryItem}
            onClose={() => setEditingInventoryItem(null)}
            onSave={(itemId, quantity) => {
              void updateInventory(itemId, quantity);
            }}
          />
        )}
      </div>
    </main>
  );
};

export default App;
