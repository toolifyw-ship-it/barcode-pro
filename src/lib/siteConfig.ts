// ============================================================================
// SINGLE OWNER SITE_CONFIG - 50+ PRODUCTION SITES SCALING ARCHITECTURE
// ============================================================================
// CRITICAL SAFETY RULES:
// 1. NEVER hardcode live secret keys in code: Use REPLACE_WITH_ENV_ placeholders.
// 2. Keys come from SITE_CONFIG environment variables only.
// 3. Backend HMAC must verify, frontend never sets isPaidVerified=true.
// 4. Default income model for barcoderpro-zeta is "adsense_only".
// ============================================================================

export interface PlanConfig {
  limit?: number;
  days?: number;
  price?: number;
  GST?: string;
}

export interface SiteConfig {
  siteName: string;
  domain: string;
  incomeModel: "adsense_only" | "subscription_only" | "hybrid";
  adsenseId: string;
  razorpayKey: string;
  apiEndpoint: string;
  supportEmail: string;
  grievanceName: string;
  grievanceAddress: string;
  isolationPrefix: string;
  ownerWhatsApp: string;
  ownerEmail: string;
  plans: {
    free_7: { limit: number; days: number };
    free_15: { limit: number; days: number };
    monthly: { price: number; GST: string };
    yearly: { price: number };
  };
  version: string;
}

declare global {
  interface Window {
    SITE_CONFIG: SiteConfig;
  }
}

// Initialized at VERY TOP of runtime
export const SITE_CONFIG: SiteConfig = {
  siteName: "BarcoderPro", // Change per site: SecureSaaS, FluxCall, TaxPilotAI etc
  domain: "barcoderpro-zeta.vercel.app", // Change per site
  incomeModel: "adsense_only", // OPTIONS: "adsense_only" OR "subscription_only" OR "hybrid" - THIS CONTROLS INCOME
  adsenseId: "REPLACE_WITH_ENV_ADSENSE_ID", // If incomeModel adsense_only or hybrid, put real pub- ID in ENV, if subscription_only set "DISABLED"
  razorpayKey: "REPLACE_WITH_ENV_KEY", // If subscription_only or hybrid, put real rzp_ in ENV, if adsense_only set "DISABLED"
  apiEndpoint: "REPLACE_WITH_ENV_API_ENDPOINT",
  supportEmail: "REPLACE_WITH_ENV_SUPPORT_EMAIL",
  grievanceName: "Sukanta Singha",
  grievanceAddress: "Berhampore Town, WB 742101, IN",
  isolationPrefix: "barcoderpro_v1_", // MUST unique per site: freebarcode_v1_, fluxcall_v1_ etc
  ownerWhatsApp: "REPLACE_WITH_ENV_OWNER_WHATSAPP",
  ownerEmail: "sukanta.singha786@gmail.com",
  plans: { 
    free_7: { limit: 5, days: 7 }, 
    free_15: { limit: 10, days: 15 }, 
    monthly: { price: 999, GST: "CGST 9%+SGST 9% SAC 998313" }, 
    yearly: { price: 9999 } 
  },
  version: "2026.billion.final.v1"
};

// Expose globally on window
if (typeof window !== "undefined") {
  window.SITE_CONFIG = SITE_CONFIG;
}

// Backend HMAC verification reminder:
// Backend HMAC must verify, frontend never sets isPaidVerified=true
