import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildKhataFeed,
  computeHomeStatsFromBusiness,
  computeKhataOverview,
  computeTotalReceivable,
  getEligibleLoanAmount,
  getEntryPeriods,
  getLocalDateKey,
  mapBusinessTransaction,
  mapCustomers,
  mapHomeAlerts,
  mapInventoryItem,
  mapKhataEntryToLedger,
  mapLoanOffer,
  mapReminder,
  mapVendorProfile,
} from "../lib/mappers";
import {
  fetchVendorData,
  insertBusinessTransaction,
  insertKhataEntry,
  insertProfileAction,
  isSupabaseConfigured,
  refreshBusinessTransactions,
  refreshKhataData,
  updateInventoryItem,
} from "../lib/supabaseRest";
import type {
  BusinessTransaction,
  Customer,
  HomeAlert,
  HomeStats,
  InventoryRow,
  LedgerEntry,
  LoanOfferItem,
  ProfileActionType,
  ReminderItem,
  TransactionInput,
  TransactionIntent,
  VendorProfileView,
} from "../types";

const mockProfile: VendorProfileView = mapVendorProfile({
  id: "signed-out",
  name: "Vendor",
  business_type: "Vendor",
  phone: "",
  upi_id: "Not provided",
  business_health_index: 0,
  aadhaar_status: "pending",
  pan_status: "pending",
  bank_status: "pending",
  shop_address_status: "pending",
  aadhaar_masked: null,
  pan_masked: null,
  bank_masked: null,
  created_at: new Date().toISOString(),
});

const formatInventoryValue = (quantity: number, unit: string) =>
  `${quantity.toLocaleString("en-IN")} ${unit}`;

export const useVendorApp = (vendorId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [loadedVendorId, setLoadedVendorId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [profile, setProfile] = useState<VendorProfileView>(mockProfile);
  const [ledgerEntries, setLedgerEntries] =
    useState<LedgerEntry[]>([]);
  const [businessTransactions, setBusinessTransactions] = useState<
    BusinessTransaction[]
  >([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [loanOffers, setLoanOffers] = useState<LoanOfferItem[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [homeStats, setHomeStats] = useState<HomeStats>({
    sales: 0,
    expenses: 0,
  });
  const [homeAlerts, setHomeAlerts] = useState<HomeAlert[]>([]);
  const [eligibleLoanAmount, setEligibleLoanAmount] = useState("Rs 0");
  const [totalReceivable, setTotalReceivable] = useState(0);

  const khataFeed = useMemo(
    () => buildKhataFeed(ledgerEntries, businessTransactions),
    [ledgerEntries, businessTransactions],
  );

  const khataOverview = useMemo(
    () => computeKhataOverview(khataFeed),
    [khataFeed],
  );

  const syncKhataFromServer = useCallback(async () => {
    if (!vendorId) return;
    const { khataEntries, customers: customerRecords } =
      await refreshKhataData(vendorId);
    const mappedEntries = khataEntries.map(mapKhataEntryToLedger);
    const mappedCustomers = mapCustomers(customerRecords, khataEntries);

    setLedgerEntries(mappedEntries);
    setCustomers(mappedCustomers);
    setTotalReceivable(computeTotalReceivable(mappedCustomers));
  }, [vendorId]);

  const syncBusinessFromServer = useCallback(async () => {
    if (!vendorId) return;
    const records = await refreshBusinessTransactions(vendorId);
    const mapped = records.map(mapBusinessTransaction);
    setBusinessTransactions(mapped);
    setHomeStats(computeHomeStatsFromBusiness(mapped));
  }, [vendorId]);

  const loadData = useCallback(async () => {
    if (!vendorId) {
      setLoadedVendorId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadedVendorId(null);
    setError(null);
    setUsingMockData(false);
    setProfile(mockProfile);
    setLedgerEntries([]);
    setBusinessTransactions([]);
    setCustomers([]);
    setInventory([]);
    setLoanOffers([]);
    setReminders([]);
    setHomeStats({ sales: 0, expenses: 0 });
    setHomeAlerts([]);
    setEligibleLoanAmount("Rs 0");
    setTotalReceivable(0);

    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured.");
      setLoadedVendorId(vendorId);
      setLoading(false);
      return;
    }

    try {
      const data = await fetchVendorData(vendorId);
      const mappedProfile = mapVendorProfile(data.profile);
      const mappedEntries = data.khataEntries.map(mapKhataEntryToLedger);
      const mappedCustomers = mapCustomers(data.customers, data.khataEntries);
      const mappedInventory = data.inventory.map(mapInventoryItem);
      const mappedOffers = data.loanOffers.map(mapLoanOffer);
      const mappedReminders = data.reminders.map(mapReminder);
      const mappedBusiness = data.businessTransactions.map(
        mapBusinessTransaction,
      );

      setProfile(mappedProfile);
      setInventory(mappedInventory);
      setLoanOffers(mappedOffers);
      setReminders(mappedReminders);
      setHomeAlerts(mapHomeAlerts(mappedReminders));
      setEligibleLoanAmount(
        getEligibleLoanAmount(mappedOffers, mappedProfile.businessHealthIndex),
      );
      setLedgerEntries(mappedEntries);
      setCustomers(mappedCustomers);
      setTotalReceivable(computeTotalReceivable(mappedCustomers));
      setBusinessTransactions(mappedBusiness);
      setHomeStats(computeHomeStatsFromBusiness(mappedBusiness));
      setUsingMockData(false);
      setLoadedVendorId(vendorId);

      if (data.missingTables.length > 0) {
        setError(
          `Missing Supabase tables: ${data.missingTables.join(", ")}. Run supabase/migrations/20250603_missing_tables.sql in the SQL Editor.`,
        );
      }
    } catch (loadError) {
      setUsingMockData(false);
      setLoadedVendorId(vendorId);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load data from Supabase.",
      );
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadData]);

  const saveBusinessTransaction = useCallback(
    async (
      transaction: TransactionInput,
      transactionType: "sale" | "expense",
    ) => {
      const transactionDate = getLocalDateKey();
      const tempId = `temp-business-${Date.now()}`;
      const optimistic: BusinessTransaction = {
        id: tempId,
        transaction_type: transactionType,
        amount: transaction.amount,
        note: transaction.note,
        transaction_date: transactionDate,
      };

      setBusinessTransactions((current) => [optimistic, ...current]);
      setHomeStats((current) => ({
        sales:
          transactionType === "sale"
            ? current.sales + transaction.amount
            : current.sales,
        expenses:
          transactionType === "expense"
            ? current.expenses + transaction.amount
            : current.expenses,
      }));

      if (!isSupabaseConfigured() || !vendorId) {
        throw new Error("You are not logged in or Supabase is unavailable.");
      }

      try {
        await insertBusinessTransaction({
          vendor_id: vendorId,
          transaction_type: transactionType,
          amount: transaction.amount,
          note: transaction.note,
          transaction_date: transactionDate,
          voice_payload: transaction.voicePayload ?? null,
        });

        await syncBusinessFromServer();
        setError(null);
      } catch (saveError) {
        setBusinessTransactions((current) =>
          current.filter((item) => item.id !== tempId),
        );
        setError(
          saveError instanceof Error
            ? saveError.message
            : "Could not save sale/expense. Run supabase/migrations/20250603_missing_tables.sql if the table is missing.",
        );
        await loadData();
        throw saveError;
      }
    },
    [loadData, syncBusinessFromServer, vendorId],
  );

  const saveKhataEntry = useCallback(
    async (transaction: TransactionInput) => {
      const entryDate = getLocalDateKey();
      const tempId = `temp-khata-${Date.now()}`;
      const optimisticEntry: LedgerEntry = {
        id: tempId,
        label: transaction.customer,
        note: transaction.note,
        amount: transaction.amount,
        type: transaction.type,
        time: "Just now",
        periods: getEntryPeriods(entryDate),
        entryDate,
        source: "khata",
        isUserAdded: true,
      };

      setLedgerEntries((current) => [optimisticEntry, ...current]);

      const balanceDelta =
        transaction.type === "out" ? transaction.amount : -transaction.amount;
      setCustomers((currentCustomers) => {
        const existingCustomer = currentCustomers.find(
          (customer) => customer.name === transaction.customer,
        );

        const nextCustomers = existingCustomer
          ? currentCustomers.map((customer) => {
              if (customer.name !== transaction.customer) {
                return customer;
              }

              const nextBalance = customer.balance + balanceDelta;

              return {
                ...customer,
                balance: nextBalance,
                status:
                  nextBalance > 0
                    ? "Due"
                    : nextBalance < 0
                      ? "Advance"
                      : "Settled",
                lastEntry: transaction.note,
                date: "Today",
              };
            })
          : [
              {
                name: transaction.customer,
                phone: "",
                balance: balanceDelta,
                status:
                  balanceDelta > 0
                    ? "Due"
                    : balanceDelta < 0
                      ? "Advance"
                      : "Settled",
                lastEntry: transaction.note,
                date: "Today",
              },
              ...currentCustomers,
            ];

        setTotalReceivable(computeTotalReceivable(nextCustomers));
        return nextCustomers;
      });

      if (!isSupabaseConfigured() || !vendorId) {
        throw new Error("You are not logged in or Supabase is unavailable.");
      }

      try {
        await insertKhataEntry({
          vendor_id: vendorId,
          customer_name: transaction.customer,
          customer_upi: null,
          note: transaction.note,
          amount: transaction.amount,
          entry_type: transaction.type === "in" ? "money_in" : "money_out",
          entry_date: entryDate,
        });

        await syncKhataFromServer();
        setError(null);
      } catch (saveError) {
        setError(
          saveError instanceof Error
            ? saveError.message
            : "Could not save khata entry.",
        );
        await loadData();
        throw saveError;
      }
    },
    [loadData, syncKhataFromServer, vendorId],
  );

  const saveTransaction = useCallback(
    async (transaction: TransactionInput, intent: TransactionIntent) => {
      if (intent === "khata") {
        await saveKhataEntry(transaction);
        return;
      }

      await saveBusinessTransaction(
        transaction,
        intent === "sale" ? "sale" : "expense",
      );
    },
    [saveBusinessTransaction, saveKhataEntry],
  );

  const updateInventory = useCallback(
    async (itemId: string, quantity: number) => {
      const item = inventory.find((row) => row.id === itemId);
      if (!item || quantity < 0) {
        return;
      }

      setInventory((current) =>
        current.map((row) =>
          row.id === itemId
            ? {
                ...row,
                quantity,
                value: formatInventoryValue(quantity, row.unit),
              }
            : row,
        ),
      );

      if (!isSupabaseConfigured() || !vendorId) {
        return;
      }

      try {
        await updateInventoryItem(itemId, quantity);
        setError(null);
      } catch (updateError) {
        setError(
          updateError instanceof Error
            ? updateError.message
            : "Could not update inventory.",
        );
        void loadData();
      }
    },
    [inventory, loadData, vendorId],
  );

  const submitProfileAction = useCallback(
    async (actionType: ProfileActionType) => {
      if (!isSupabaseConfigured() || !vendorId) {
        return;
      }

      try {
        await insertProfileAction(vendorId, actionType, {
          business_health_index: profile.businessHealthIndex,
          submitted_at: new Date().toISOString(),
        });
        setError(null);
      } catch (actionError) {
        setError(
          actionError instanceof Error
            ? actionError.message
            : "Could not submit profile action.",
        );
      }
    },
    [profile.businessHealthIndex, vendorId],
  );

  return {
    loading: loading || Boolean(vendorId && loadedVendorId !== vendorId),
    error,
    usingMockData,
    profile,
    ledgerEntries,
    khataFeed,
    customers,
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
    reload: loadData,
  };
};
