/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Language = "en" | "hi";

const hi: Record<string, string> = {
  "Add Expense": "खर्च जोड़ें", "Add Sale": "बिक्री जोड़ें", Alerts: "अलर्ट", "Amount (Rs)": "राशि (रु.)",
  "Available Loans": "उपलब्ध ऋण", "Bank Account": "बैंक खाता", "Business Health": "व्यवसाय स्वास्थ्य",
  "Business Health Index": "व्यवसाय स्वास्थ्य सूचकांक", "Business Loans": "व्यवसाय ऋण", "Cash Flow": "नकदी प्रवाह",
  Continue: "जारी रखें", Customer: "ग्राहक", Description: "विवरण", "Digital Khata": "डिजिटल खाता",
  Eligible: "पात्र", "Eligible Loan": "पात्र ऋण", entries: "प्रविष्टियां", Export: "निर्यात", Expenses: "खर्च",
  Good: "अच्छा", Hello: "नमस्ते", Home: "होम", Inventory: "स्टॉक", "Item name": "वस्तु का नाम",
  "Item sold": "बेची गई वस्तु", Khata: "खाता", "Loan Offers": "ऋण प्रस्ताव", Loans: "ऋण",
  "Log out": "लॉग आउट", "Manage your business easily": "अपना व्यवसाय आसानी से संभालें", "Mobile number": "मोबाइल नंबर",
  "Money In": "पैसा आया", "Money Out": "पैसा गया", "Money in": "पैसा आया", "Money out": "पैसा गया",
  "Needs attention": "ध्यान देने की जरूरत", "No alerts right now.": "अभी कोई अलर्ट नहीं है।", "Not eligible": "पात्र नहीं",
  Note: "टिप्पणी", "Note (optional)": "टिप्पणी (वैकल्पिक)", "Other item": "अन्य वस्तु", Pending: "लंबित",
  Completed: "पूर्ण", Profile: "प्रोफाइल", Profit: "लाभ", Quantity: "मात्रा", Reminders: "रिमाइंडर",
  "Recent Entries": "हाल की प्रविष्टियां", Sales: "बिक्री", Save: "सहेजें", "Save Stock": "स्टॉक सहेजें",
  "Saving...": "सहेजा जा रहा है...", "Search entries": "प्रविष्टियां खोजें", "Shop Address": "दुकान का पता",
  "Signing in...": "लॉग इन हो रहा है...", Status: "स्थिति", Today: "आज", Month: "महीना", Year: "वर्ष",
  Type: "प्रकार", "Update Expense": "खर्च अपडेट करें", "Update Stock": "स्टॉक अपडेट करें", "Vendor App": "विक्रेता ऐप",
  "Vendor Profile": "विक्रेता प्रोफाइल", Verified: "सत्यापित", "Voice Entry": "आवाज से प्रविष्टि",
  "Sales & Expenses": "बिक्री और खर्च", "Total receivable": "कुल प्राप्य राशि",
  "Tap an item to update stock": "स्टॉक बदलने के लिए वस्तु पर टैप करें", "Loading vendor data...": "विक्रेता का डेटा लोड हो रहा है...",
  "Login to Vendor App": "विक्रेता ऐप में लॉग इन करें",
  "Enter your mobile number to continue. No OTP is required.": "जारी रखने के लिए मोबाइल नंबर दर्ज करें। OTP की जरूरत नहीं है।",
  "Enter a valid 10-digit mobile number.": "सही 10 अंकों का मोबाइल नंबर दर्ज करें।",
  "No reminders yet. They will appear here when you add them.": "अभी कोई रिमाइंडर नहीं है। जोड़ने पर वे यहां दिखाई देंगे।",
  "Reminders & Suggestions": "रिमाइंडर और सुझाव", "eKYC Details": "ई-केवाईसी विवरण",
  "eKYC Information": "ई-केवाईसी जानकारी", "Aadhaar Verification": "आधार सत्यापन", "PAN Verification": "पैन सत्यापन",
  "UPI ID": "यूपीआई आईडी", "Reports & Bank Sharing": "रिपोर्ट और बैंक साझा करना",
  "Update GSTR Reports": "जीएसटीआर रिपोर्ट अपडेट करें", "Send Business Status": "व्यवसाय स्थिति भेजें",
  "Minimum index": "न्यूनतम सूचकांक", Amount: "राशि", Tenure: "अवधि", Rate: "दर", "Raw data": "मूल डेटा", All: "सभी",
  Actions: "कार्रवाई", "Add Khata Entry": "खाता प्रविष्टि जोड़ें", "Enter item sold": "बेची गई वस्तु दर्ज करें",
  "Sale details": "बिक्री का विवरण", "Could not save the entry.": "प्रविष्टि सहेजी नहीं जा सकी।",
  "Inventory, khata, loan, payment, and compliance reminders in one place.": "स्टॉक, खाता, ऋण, भुगतान और अनुपालन रिमाइंडर एक ही जगह।",
  "Submit latest sales and tax report to govt portal": "नवीनतम बिक्री और कर रिपोर्ट सरकारी पोर्टल पर भेजें",
  "Share current business health with bank for loan eligibility": "ऋण पात्रता के लिए वर्तमान व्यवसाय स्थिति बैंक से साझा करें",
  "No inventory items yet.": "अभी स्टॉक में कोई वस्तु नहीं है।",
};

interface LanguageContextValue { language: Language; setLanguage: (language: Language) => void; t: (text: string) => string; }
const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => window.localStorage.getItem("app-language") === "hi" ? "hi" : "en");
  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage: (next) => { window.localStorage.setItem("app-language", next); setLanguageState(next); },
    t: (text) => language === "hi" ? (hi[text] ?? text) : text,
  }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
};

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  return <button className="fixed right-5 top-5 z-50 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-lg" onClick={() => setLanguage(language === "en" ? "hi" : "en")} type="button">{language === "en" ? "हिंदी" : "English"}</button>;
};
