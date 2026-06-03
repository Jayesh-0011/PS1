const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

export const demoVendorId = "11111111-1111-1111-1111-111111111111";

export const isSupabaseConfigured = () =>
  Boolean(supabaseUrl?.trim() && supabaseAnonKey?.trim());

const headers = () => ({
  apikey: supabaseAnonKey ?? "",
  Authorization: `Bearer ${supabaseAnonKey ?? ""}`,
  "Content-Type": "application/json",
});

const getEndpoint = (table: string, query = "") => {
  if (!isSupabaseConfigured()) {
    throw new Error("Missing Supabase environment variables.");
  }

  return `${supabaseUrl}/rest/v1/${table}${query}`;
};

export interface VendorProfile {
  id: string;
  name: string;
  business_type: string;
  phone: string;
  upi_id: string;
  business_health_index: number;
  aadhaar_status: string;
  pan_status: string;
  bank_status: string;
  shop_address_status: string;
  aadhaar_masked: string | null;
  pan_masked: string | null;
  bank_masked: string | null;
  created_at: string;
}

export interface CustomerRecord {
  id: string;
  vendor_id: string;
  name: string;
  upi_id: string | null;
  phone: string | null;
  opening_balance: number;
  created_at: string;
}

export interface BusinessTransactionRecord {
  id: string;
  vendor_id: string;
  transaction_type: "sale" | "expense";
  amount: number;
  note: string;
  transaction_date: string;
  created_at: string;
}

export interface KhataEntry {
  id: string;
  vendor_id: string;
  customer_name: string;
  customer_upi: string | null;
  note: string;
  amount: number;
  entry_type: "money_in" | "money_out";
  entry_date: string;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  vendor_id: string;
  item_name: string;
  quantity: number;
  unit: string;
  restock_level: number;
  updated_at: string;
}

export interface LoanOffer {
  id: string;
  name: string;
  amount: number;
  tenure_days: number;
  monthly_rate: number;
  min_business_health_index: number;
}

export interface Reminder {
  id: string;
  vendor_id: string;
  title: string;
  description: string;
  category: string;
  status: "open" | "done";
  due_date: string | null;
  created_at: string;
}

export interface ProfileAction {
  id: string;
  vendor_id: string;
  action_type: "gstr_report" | "bank_business_status";
  status: "pending" | "sent" | "failed";
  payload: Record<string, unknown>;
  created_at: string;
}

export interface VendorDataBundle {
  profile: VendorProfile;
  customers: CustomerRecord[];
  khataEntries: KhataEntry[];
  businessTransactions: BusinessTransactionRecord[];
  inventory: InventoryItem[];
  loanOffers: LoanOffer[];
  reminders: Reminder[];
}

const parseError = async (response: Response, action: string) => {
  const detail = await response.text();
  return new Error(
    detail ? `${action}: ${detail}` : `${action} (${response.status})`,
  );
};

export class MissingTableError extends Error {
  constructor(public readonly table: string) {
    super(
      `Table "${table}" is missing in Supabase. Run supabase/migrations/20250603_missing_tables.sql in the SQL Editor.`,
    );
    this.name = "MissingTableError";
  }
}

export const fetchRows = async <T>(table: string, query = ""): Promise<T[]> => {
  const response = await fetch(getEndpoint(table, query), {
    headers: headers(),
  });

  if (response.status === 404) {
    throw new MissingTableError(table);
  }

  if (!response.ok) {
    throw await parseError(response, `Failed to fetch ${table}`);
  }

  return response.json() as Promise<T[]>;
};

/** Returns [] if the table does not exist yet (404). */
export const fetchRowsOptional = async <T>(
  table: string,
  query = "",
): Promise<T[]> => {
  try {
    return await fetchRows<T>(table, query);
  } catch (error) {
    if (error instanceof MissingTableError) {
      return [];
    }
    throw error;
  }
};

export const insertRow = async <T>(
  table: string,
  payload: Record<string, unknown>,
): Promise<T[]> => {
  const response = await fetch(getEndpoint(table), {
    body: JSON.stringify(payload),
    headers: {
      ...headers(),
      Prefer: "return=representation",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw await parseError(response, `Failed to insert ${table}`);
  }

  return response.json() as Promise<T[]>;
};

export const updateRow = async <T>(
  table: string,
  id: string,
  payload: Record<string, unknown>,
): Promise<T[]> => {
  const response = await fetch(getEndpoint(table, `?id=eq.${id}`), {
    body: JSON.stringify(payload),
    headers: {
      ...headers(),
      Prefer: "return=representation",
    },
    method: "PATCH",
  });

  if (!response.ok) {
    throw await parseError(response, `Failed to update ${table}`);
  }

  return response.json() as Promise<T[]>;
};

export const fetchVendorProfile = (vendorId: string) =>
  fetchRows<VendorProfile>(
    "vendor_profiles",
    `?id=eq.${vendorId}&select=*`,
  ).then((rows) => rows[0] ?? null);

export const fetchCustomers = (vendorId: string) =>
  fetchRows<CustomerRecord>(
    "customers",
    `?vendor_id=eq.${vendorId}&select=*&order=name.asc`,
  );

export const fetchBusinessTransactions = (vendorId: string) =>
  fetchRows<BusinessTransactionRecord>(
    "business_transactions",
    `?vendor_id=eq.${vendorId}&select=*&order=transaction_date.desc,created_at.desc`,
  );

export const fetchKhataEntries = (vendorId: string) =>
  fetchRows<KhataEntry>(
    "khata_entries",
    `?vendor_id=eq.${vendorId}&select=*&order=entry_date.desc,created_at.desc`,
  );

export const refreshBusinessTransactions = (vendorId: string) =>
  fetchRowsOptional<BusinessTransactionRecord>(
    "business_transactions",
    `?vendor_id=eq.${vendorId}&select=*&order=transaction_date.desc,created_at.desc`,
  );

export const refreshKhataData = async (vendorId: string) => {
  const [khataEntries, customers] = await Promise.all([
    fetchKhataEntries(vendorId),
    fetchRowsOptional<CustomerRecord>(
      "customers",
      `?vendor_id=eq.${vendorId}&select=*&order=name.asc`,
    ),
  ]);

  return { khataEntries, customers };
};

export const fetchInventoryItems = (vendorId: string) =>
  fetchRows<InventoryItem>(
    "inventory_items",
    `?vendor_id=eq.${vendorId}&select=*&order=item_name.asc`,
  );

export const fetchLoanOffers = () =>
  fetchRows<LoanOffer>(
    "loan_offers",
    "?select=*&order=min_business_health_index.asc",
  );

export const fetchReminders = (vendorId: string) =>
  fetchRows<Reminder>(
    "reminders",
    `?vendor_id=eq.${vendorId}&status=eq.open&select=*&order=created_at.desc`,
  );

export interface FetchVendorDataResult extends VendorDataBundle {
  missingTables: string[];
}

export const fetchVendorData = async (
  vendorId: string,
): Promise<FetchVendorDataResult> => {
  const missingTables: string[] = [];

  const loadOptional = async <T>(table: string, query: string) => {
    try {
      return await fetchRows<T>(table, query);
    } catch (error) {
      if (error instanceof MissingTableError) {
        missingTables.push(table);
        return [];
      }
      throw error;
    }
  };

  const [
    profile,
    customers,
    khataEntries,
    businessTransactions,
    inventory,
    loanOffers,
    reminders,
  ] = await Promise.all([
    fetchVendorProfile(vendorId),
    loadOptional<CustomerRecord>(
      "customers",
      `?vendor_id=eq.${vendorId}&select=*&order=name.asc`,
    ),
    fetchKhataEntries(vendorId),
    loadOptional<BusinessTransactionRecord>(
      "business_transactions",
      `?vendor_id=eq.${vendorId}&select=*&order=transaction_date.desc,created_at.desc`,
    ),
    fetchInventoryItems(vendorId),
    fetchLoanOffers(),
    fetchReminders(vendorId),
  ]);

  if (!profile) {
    throw new Error(
      'Vendor profile not found. Run supabase/schema.sql in the SQL Editor (demo vendor id: 11111111-1111-1111-1111-111111111111).',
    );
  }

  return {
    profile,
    customers,
    khataEntries,
    businessTransactions,
    inventory,
    loanOffers,
    reminders,
    missingTables,
  };
};

export const insertBusinessTransaction = (
  payload: Omit<BusinessTransactionRecord, "id" | "created_at">,
) => insertRow<BusinessTransactionRecord>("business_transactions", payload);

export const updateInventoryItem = (id: string, quantity: number) =>
  updateRow<InventoryItem>("inventory_items", id, {
    quantity,
    updated_at: new Date().toISOString(),
  });

export const insertKhataEntry = (
  payload: Omit<KhataEntry, "id" | "created_at">,
) => insertRow<KhataEntry>("khata_entries", payload);

export const insertProfileAction = (
  vendorId: string,
  actionType: ProfileAction["action_type"],
  payload: Record<string, unknown> = {},
) =>
  insertRow<ProfileAction>("profile_actions", {
    action_type: actionType,
    payload,
    vendor_id: vendorId,
  });
