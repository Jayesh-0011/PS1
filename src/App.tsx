import { useState, type ReactNode } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CheckCircle,
  CreditCard,
  FileUp,
  Filter,
  Home,
  IndianRupee,
  Mic,
  Minus,
  Package,
  Plus,
  Search,
  Send,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";

const businessHealthIndex = 78;

const customers = [
  {
    name: "Rajesh Kumar",
    phone: "UPI: rajesh@oksbi",
    balance: 4250,
    status: "Due",
    lastEntry: "Bought vegetables",
    date: "Today",
  },
  {
    name: "Meena Stores",
    phone: "UPI: meenastore@upi",
    balance: -1800,
    status: "Advance",
    lastEntry: "Paid by cash",
    date: "Yesterday",
  },
  {
    name: "Amit Tea Stall",
    phone: "UPI: amitstall@paytm",
    balance: 920,
    status: "Due",
    lastEntry: "Milk packets",
    date: "29 May",
  },
];

const recentEntries = [
  {
    label: "Rajesh Kumar",
    note: "Tomato, onion, potato",
    amount: 780,
    type: "out",
    time: "10:45 AM",
    periods: ["today", "month", "year"],
  },
  {
    label: "Meena Stores",
    note: "Cash received",
    amount: 1800,
    type: "in",
    time: "09:20 AM",
    periods: ["today", "month", "year"],
  },
  {
    label: "Amit Tea Stall",
    note: "Milk packets",
    amount: 420,
    type: "out",
    time: "Yesterday",
    periods: ["month", "year"],
  },
];

const khataFilters = [
  { label: "Today", value: "today" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
] as const;

const khataSummary = {
  today: {
    receivable: "1,200",
    moneyIn: "Rs 1,800",
    moneyOut: "Rs 1,200",
  },
  month: {
    receivable: "6,970",
    moneyIn: "Rs 18,200",
    moneyOut: "Rs 11,230",
  },
  year: {
    receivable: "84,600",
    moneyIn: "Rs 2,18,400",
    moneyOut: "Rs 1,33,800",
  },
};

type KhataFilter = (typeof khataFilters)[number]["value"];

const loanOffers = [
  {
    name: "Daily Working Capital",
    amount: "Rs 15,000",
    tenure: "45 days",
    rate: "1.2% monthly",
    minScore: 70,
  },
  {
    name: "Inventory Booster",
    amount: "Rs 25,000",
    tenure: "90 days",
    rate: "1.5% monthly",
    minScore: 80,
  },
  {
    name: "Festival Stock Loan",
    amount: "Rs 40,000",
    tenure: "120 days",
    rate: "1.8% monthly",
    minScore: 85,
  },
];

const reminders = [
  {
    title: "Restock onions",
    description: "Only 12 Kg left. Suggested restock: 30 Kg before evening rush.",
    tag: "Inventory",
    tone: "amber",
  },
  {
    title: "Loan offer available",
    description: "Business health index is 78, so Daily Working Capital is eligible.",
    tag: "Loans",
    tone: "emerald",
  },
  {
    title: "Collect Rajesh balance",
    description: "Rs 4,250 is due. Send a polite payment reminder today.",
    tag: "Khata",
    tone: "rose",
  },
  {
    title: "GST filing due",
    description: "Filing is due in 10 days. Keep sales and expense entries updated.",
    tag: "Compliance",
    tone: "sky",
  },
  {
    title: "UPI collection active",
    description: "UPI is working normally. Share QR for faster collections.",
    tag: "Payments",
    tone: "emerald",
  },
];

type Page = "home" | "khata" | "alerts" | "loans" | "profile";

const App = () => {
  const [activePage, setActivePage] = useState<Page>("khata");

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-4 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-md flex-col overflow-hidden rounded-[28px] bg-white shadow-xl shadow-slate-300/60">
        {activePage === "home" && <HomePage />}
        {activePage === "khata" && <KhataPage />}
        {activePage === "alerts" && <AlertsPage />}
        {activePage === "loans" && <LoansPage />}
        {activePage === "profile" && <ProfilePage />}

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
      </div>
    </main>
  );
};

const HomePage = () => (
  <>
    <header className="bg-green-600 p-5 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Vendor App</h1>

        <button className="rounded-full bg-white px-3 py-1 text-sm font-medium text-green-600">
          Hindi
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Hello, Ramesh</h2>
        <p className="text-sm opacity-90">Manage your business easily</p>
      </div>
    </header>

    <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard title="Sales" value="Rs 2450" bg="bg-green-50" />
        <StatCard title="Expenses" value="Rs 650" bg="bg-red-50" />
        <StatCard title="Profit" value="Rs 1800" bg="bg-blue-50" />
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 p-4 font-semibold text-white">
        <Mic size={20} />
        Voice Entry
      </button>

      <div className="grid grid-cols-2 gap-3 py-4">
        <button className="flex items-center justify-center gap-2 rounded-xl bg-green-100 p-4 font-semibold">
          <Plus size={18} />
          Add Sale
        </button>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-red-100 p-4 font-semibold">
          <Minus size={18} />
          Update Expense
        </button>
      </div>

      <SectionCard icon={<Package className="text-green-600" />} title="Inventory">
        <div className="space-y-2">
          <Row label="Tomatoes" value="35 Kg" />
          <Row label="Onions" value="12 Kg" />
          <Row label="Potatoes" value="50 Kg" />
        </div>
      </SectionCard>

      <SectionCard icon={<BookOpen className="text-blue-600" />} title="Digital Khata">
        <div className="space-y-2">
          <Row label="Money In" value="Rs 18,200" />
          <Row label="Money Out" value="Rs 11,300" />
          <Row bold label="Cash Flow" value="Rs 6,900" />
        </div>
      </SectionCard>

      <SectionCard
        icon={<CreditCard className="text-purple-600" />}
        title="Business Health"
      >
        <div>
          <p className="text-lg font-bold">78 / 100</p>
          <div className="mt-2 h-3 w-full rounded-full bg-gray-200">
            <div className="h-3 w-4/5 rounded-full bg-green-500" />
          </div>
          <p className="mt-3 text-sm">
            Eligible Loan: <span className="font-bold">Rs 15,000</span>
          </p>
        </div>
      </SectionCard>

      <SectionCard icon={<Bell className="text-yellow-500" />} title="Alerts">
        <ul className="space-y-2 text-sm">
          <li>GST filing due in 10 days</li>
          <li>UPI collection active</li>
          <li>No pending repayments</li>
        </ul>
      </SectionCard>
    </div>
  </>
);

const KhataPage = () => {
  const [activeFilter, setActiveFilter] = useState<KhataFilter>("month");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const summary = khataSummary[activeFilter];
  const activeFilterLabel =
    khataFilters.find((filter) => filter.value === activeFilter)?.label ??
    "Month";
  const filteredRecentEntries = recentEntries.filter((entry) =>
    entry.periods.includes(activeFilter),
  );

  return (
    <>
    <header className="bg-emerald-700 px-5 pb-5 pt-5 text-white">
      <div className="flex items-center justify-between">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
          <BookOpen size={21} />
        </button>
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-100">
            Digital Khata
          </p>
          <h1 className="text-lg font-bold">Customer Ledger</h1>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
          <Bell size={20} />
        </button>
      </div>

      <section className="mt-5 rounded-2xl bg-white p-4 text-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Total receivable</p>
            <h2 className="mt-1 flex items-center text-3xl font-black">
              <IndianRupee size={25} />
              {summary.receivable}
            </h2>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
            8 accounts
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <MiniStat
            icon={<ArrowDownLeft size={17} />}
            label="Money in"
            value={summary.moneyIn}
            tone="green"
          />
          <MiniStat
            icon={<ArrowUpRight size={17} />}
            label="Money out"
            value={summary.moneyOut}
            tone="red"
          />
        </div>
      </section>
    </header>

    <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
      <div className="flex gap-2">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 py-3 text-slate-500">
          <Search size={18} />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500"
            placeholder="Search customer"
            type="search"
          />
        </label>
        <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
          <CalendarDays size={20} />
        </button>
      </div>

      <div className="relative mt-4 flex justify-end">
        <button
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
          onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
          type="button"
        >
          <Filter size={17} />
          {activeFilterLabel}
        </button>

        {isFilterOpen && (
          <div className="absolute right-0 top-14 z-10 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-300/60">
            {khataFilters.map((filter) => (
              <button
                key={filter.value}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-bold ${
                  activeFilter === filter.value
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600"
                }`}
                onClick={() => {
                  setActiveFilter(filter.value);
                  setIsFilterOpen(false);
                }}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white">
          <Plus size={18} />
          Add Entry
        </button>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white">
          <Send size={17} />
          Send Reminder
        </button>
      </div>

      <SectionTitle action="View all" title="Customers" />
      <div className="space-y-3">
        {customers.map((customer) => (
          <CustomerRow key={customer.name} {...customer} />
        ))}
      </div>

      <SectionTitle action="Export" title="Recent Entries" />
      <div className="rounded-2xl border border-slate-200">
        {filteredRecentEntries.map((entry, index) => (
          <EntryRow
            key={`${entry.label}-${entry.time}`}
            isLast={index === filteredRecentEntries.length - 1}
            {...entry}
          />
        ))}
      </div>
    </div>
    </>
  );
};

const AlertsPage = () => (
  <>
    <header className="bg-emerald-700 px-5 pb-5 pt-5 text-white">
      <div className="flex items-center justify-between">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
          <Bell size={21} />
        </button>
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-100">
            Reminders
          </p>
          <h1 className="text-lg font-bold">Alerts</h1>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
          <CheckCircle size={20} />
        </button>
      </div>

      <section className="mt-5 rounded-2xl bg-white p-4 text-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Needs attention</p>
            <h2 className="mt-1 text-3xl font-black">{reminders.length}</h2>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
            Today
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Inventory, khata, loan, payment, and compliance reminders in one place.
        </p>
      </section>
    </header>

    <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
      <SectionTitle action="All" title="Reminders & Suggestions" />
      <div className="space-y-3">
        {reminders.map((reminder) => (
          <ReminderCard key={reminder.title} {...reminder} />
        ))}
      </div>
    </div>
  </>
);

const LoansPage = () => (
  <>
    <header className="bg-emerald-700 px-5 pb-5 pt-5 text-white">
      <div className="flex items-center justify-between">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
          <CreditCard size={21} />
        </button>
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-100">
            Loan Offers
          </p>
          <h1 className="text-lg font-bold">Business Loans</h1>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
          <Bell size={20} />
        </button>
      </div>

      <section className="mt-5 rounded-2xl bg-white p-4 text-slate-950">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Business Health Index</p>
            <p className="mt-1 text-3xl font-black">{businessHealthIndex} / 100</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            Good
          </span>
        </div>
        <div className="mt-3 h-3 w-full rounded-full bg-gray-200">
          <div className="h-3 w-4/5 rounded-full bg-green-500" />
        </div>
      </section>
    </header>

    <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
      <SectionTitle action="Raw data" title="Available Loans" />
      <div className="space-y-3">
        {loanOffers.map((loan) => (
          <LoanCard key={loan.name} {...loan} />
        ))}
      </div>
    </div>
  </>
);

const ProfilePage = () => (
  <>
    <header className="bg-emerald-700 px-5 pb-5 pt-5 text-white">
      <div className="flex items-center justify-between">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
          <User size={21} />
        </button>
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-100">
            Vendor Profile
          </p>
          <h1 className="text-lg font-bold">eKYC Details</h1>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
          <ShieldCheck size={20} />
        </button>
      </div>

      <section className="mt-5 rounded-2xl bg-white p-4 text-slate-950">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-700">
            RK
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-black">Ramesh Kumar</h2>
            <p className="truncate text-sm text-slate-500">Street Food Vendor</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            Verified
          </span>
        </div>
      </section>
    </header>

    <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
      <SectionTitle action="Status" title="eKYC Information" />
      <div className="space-y-3">
        <KycRow label="Aadhaar Verification" status="Completed" value="XXXX XXXX 2481" />
        <KycRow label="PAN Verification" status="Completed" value="ABCDE1234F" />
        <KycRow label="Bank Account" status="Completed" value="SBI ending 0924" />
        <KycRow label="UPI ID" status="Completed" value="ramesh@oksbi" />
        <KycRow label="Shop Address" status="Pending" value="Address proof needed" />
      </div>

      <SectionTitle action="Actions" title="Reports & Bank Sharing" />
      <div className="space-y-3">
        <ProfileActionRow
          icon={<FileUp size={20} />}
          label="Update GSTR Reports"
          value="Submit latest sales and tax report to govt portal"
        />
        <ProfileActionRow
          icon={<Send size={20} />}
          label="Send Business Status"
          value="Share current business health with bank for loan eligibility"
        />
      </div>
    </div>
  </>
);

interface MiniStatProps {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "green" | "red";
}

const MiniStat = ({ icon, label, value, tone }: MiniStatProps) => {
  const toneClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-rose-50 text-rose-700";

  return (
    <div className={`rounded-xl p-3 ${toneClass}`}>
      <div className="flex items-center gap-2 text-xs font-semibold">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-base font-black">{value}</p>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  bg: string;
}

const StatCard = ({ title, value, bg }: StatCardProps) => (
  <div className={`${bg} rounded-xl p-3 text-center`}>
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-lg font-bold">{value}</h3>
  </div>
);

interface RowProps {
  label: string;
  value: string;
  bold?: boolean;
}

const Row = ({ label, value, bold = false }: RowProps) => (
  <div className={`flex justify-between ${bold ? "font-bold" : ""}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

const SectionCard = ({ title, icon, children }: SectionCardProps) => (
  <div className="mb-4 rounded-xl border bg-white p-4">
    <div className="mb-3 flex items-center gap-2">
      {icon}
      <h3 className="font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

interface LoanCardProps {
  name: string;
  amount: string;
  tenure: string;
  rate: string;
  minScore: number;
}

const LoanCard = ({ name, amount, tenure, rate, minScore }: LoanCardProps) => {
  const isEligible = businessHealthIndex >= minScore;

  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-black">{name}</h3>
          <p className="mt-1 text-sm text-slate-500">Minimum index: {minScore}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
            isEligible
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {isEligible ? "Eligible" : "Not eligible"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <LoanInfo label="Amount" value={amount} />
        <LoanInfo label="Tenure" value={tenure} />
        <LoanInfo label="Rate" value={rate} />
      </div>
    </div>
  );
};

interface LoanInfoProps {
  label: string;
  value: string;
}

const LoanInfo = ({ label, value }: LoanInfoProps) => (
  <div className="rounded-xl bg-slate-100 p-2">
    <p className="text-[11px] font-semibold text-slate-500">{label}</p>
    <p className="mt-1 text-xs font-black">{value}</p>
  </div>
);

interface ReminderCardProps {
  title: string;
  description: string;
  tag: string;
  tone: string;
}

const ReminderCard = ({ title, description, tag, tone }: ReminderCardProps) => {
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
            <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${toneClass}`}>
              {tag}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

interface KycRowProps {
  label: string;
  status: "Completed" | "Pending";
  value: string;
}

const KycRow = ({ label, status, value }: KycRowProps) => {
  const isCompleted = status === "Completed";

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          isCompleted
            ? "bg-emerald-50 text-emerald-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {isCompleted ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold">{label}</p>
        <p className="truncate text-sm text-slate-500">{value}</p>
      </div>
      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
          isCompleted
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        {status}
      </span>
    </div>
  );
};

interface ProfileActionRowProps {
  icon: ReactNode;
  label: string;
  value: string;
}

const ProfileActionRow = ({ icon, label, value }: ProfileActionRowProps) => (
  <button className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate font-bold">{label}</p>
      <p className="text-sm text-slate-500">{value}</p>
    </div>
    <ChevronRight className="shrink-0 text-slate-400" size={18} />
  </button>
);

interface CustomerRowProps {
  name: string;
  phone: string;
  balance: number;
  status: string;
  lastEntry: string;
  date: string;
}

const CustomerRow = ({
  name,
  phone,
  balance,
  status,
  lastEntry,
  date,
}: CustomerRowProps) => {
  const isDue = balance > 0;

  return (
    <button className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-base font-black text-slate-700">
        {name
          .split(" ")
          .map((word) => word[0])
          .slice(0, 2)
          .join("")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate font-bold">{name}</p>
          <p
            className={`shrink-0 text-sm font-black ${
              isDue ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            Rs {Math.abs(balance).toLocaleString("en-IN")}
          </p>
        </div>
        <p className="truncate text-xs text-slate-500">{phone}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="truncate text-xs text-slate-600">{lastEntry}</p>
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${
              isDue
                ? "bg-rose-50 text-rose-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {status}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 text-slate-400">
        <ChevronRight size={18} />
        <span className="text-[11px]">{date}</span>
      </div>
    </button>
  );
};

interface EntryRowProps {
  label: string;
  note: string;
  amount: number;
  type: string;
  time: string;
  isLast: boolean;
}

const EntryRow = ({ label, note, amount, type, time, isLast }: EntryRowProps) => {
  const isMoneyIn = type === "in";

  return (
    <div
      className={`flex items-center gap-3 px-3 py-3 ${
        isLast ? "" : "border-b border-slate-200"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          isMoneyIn
            ? "bg-emerald-50 text-emerald-600"
            : "bg-rose-50 text-rose-600"
        }`}
      >
        {isMoneyIn ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{label}</p>
        <p className="truncate text-xs text-slate-500">{note}</p>
      </div>
      <div className="shrink-0 text-right">
        <p
          className={`text-sm font-black ${
            isMoneyIn ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {isMoneyIn ? "+" : "-"} Rs {amount.toLocaleString("en-IN")}
        </p>
        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
  );
};

interface SectionTitleProps {
  title: string;
  action: string;
}

const SectionTitle = ({ title, action }: SectionTitleProps) => (
  <div className="mb-3 mt-6 flex items-center justify-between">
    <h2 className="text-base font-black">{title}</h2>
    <button className="text-sm font-bold text-emerald-700">{action}</button>
  </div>
);

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active = false, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    type="button"
    className={`flex min-w-0 flex-col items-center gap-1 text-xs font-semibold ${
      active ? "text-emerald-700" : "text-slate-500"
    }`}
  >
    {icon}
    <span className="truncate">{label}</span>
  </button>
);

export default App;
