import { FileUp, LogOut, Send, ShieldCheck, User } from "lucide-react";
import { KycRow } from "../components/KycRow";
import { ProfileActionRow } from "../components/ProfileActionRow";
import { SectionTitle } from "../components/SectionTitle";
import type { ProfileActionType, VendorProfileView } from "../types";
import { useLanguage } from "../lib/i18n";

interface ProfilePageProps {
  profile: VendorProfileView;
  onLogout: () => void;
  onSubmitAction: (actionType: ProfileActionType) => void;
}

export const ProfilePage = ({
  profile,
  onLogout,
  onSubmitAction,
}: ProfilePageProps) => {
  const { t } = useLanguage();
  return (
  <>
    <header className="bg-emerald-700 px-5 pb-5 pt-5 text-white">
      <div className="flex items-center justify-between">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
          <User size={21} />
        </button>
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-100">
            {t("Vendor Profile")}
          </p>
          <h1 className="text-lg font-bold">{t("eKYC Details")}</h1>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
          <ShieldCheck size={20} />
        </button>
      </div>

      <section className="mt-5 rounded-2xl bg-white p-4 text-slate-950">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-700">
            {profile.initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-black">{profile.name}</h2>
            <p className="truncate text-sm text-slate-500">{profile.businessType}</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            {t("Verified")}
          </span>
        </div>
      </section>
    </header>

    <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
      <SectionTitle action={t("Status")} title={t("eKYC Information")} />
      <div className="space-y-3">
        <KycRow
          label={t("Aadhaar Verification")}
          status={profile.aadhaar.status}
          value={profile.aadhaar.value}
        />
        <KycRow
          label={t("PAN Verification")}
          status={profile.pan.status}
          value={profile.pan.value}
        />
        <KycRow
          label={t("Bank Account")}
          status={profile.bank.status}
          value={profile.bank.value}
        />
        <KycRow
          label={t("UPI ID")}
          status={profile.upi.status}
          value={profile.upi.value}
        />
        <KycRow
          label={t("Shop Address")}
          status={profile.shopAddress.status}
          value={profile.shopAddress.value}
        />
      </div>

      <SectionTitle action={t("Actions")} title={t("Reports & Bank Sharing")} />
      <div className="space-y-3">
        <ProfileActionRow
          icon={<FileUp size={20} />}
          label={t("Update GSTR Reports")}
          onClick={() => onSubmitAction("gstr_report")}
          value={t("Submit latest sales and tax report to govt portal")}
        />
        <ProfileActionRow
          icon={<Send size={20} />}
          label={t("Send Business Status")}
          onClick={() => onSubmitAction("bank_business_status")}
          value={t("Share current business health with bank for loan eligibility")}
        />
      </div>

      <button
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 p-4 font-bold text-rose-700"
        onClick={onLogout}
        type="button"
      >
        <LogOut size={19} />
        {t("Log out")}
      </button>
    </div>
  </>
  );
};
