// ============================================================================
// ENTERPRISE SUBSCRIPTION MODAL & PAYMENT GATEWAY ENGINE
// ============================================================================
// Used when SITE_CONFIG.incomeModel is "subscription_only" or "hybrid"
// Safety Rules:
// 1. Backend HMAC must verify, frontend never sets isPaidVerified=true
// 2. Owner permission lock required before executing plan modifications
// 3. GST Inclusive: CGST 9% + SGST 9%, SAC Code 998313
// ============================================================================

import React, { useState } from "react";
import { SITE_CONFIG } from "../lib/siteConfig";
import { requestOwnerPermission } from "../lib/safetyBackup";

interface SubscriptionModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isDarkMode,
  onClose,
  showToast
}) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string>("starter");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Plans Structure
  const plans = [
    {
      id: "starter",
      name: "Starter Merchant",
      priceMonthly: 999,
      priceYearly: 9999,
      features: [
        "Up to 2,500 High-Speed Barcodes / Month",
        "18+ Linear & 2D Symbologies Included",
        "Bulk CSV Export & ZIP Archival",
        "No Watermarks & Commercial Rights",
        "GST Invoice with SAC 998313 Provided"
      ],
      badge: "Popular for Retail"
    },
    {
      id: "pro",
      name: "Pro Warehouse",
      priceMonthly: 2999,
      priceYearly: 29999,
      features: [
        "Unlimited Barcode & QR Generation",
        "Batch Sequential Range Engine (Up to 5,000)",
        "Vector SVG & High-DPI Print PDF",
        "Live Camera Barcode Scanner Integration",
        "Priority Support SLA < 4 Hours"
      ],
      badge: "Best for Logistics"
    },
    {
      id: "enterprise",
      name: "Enterprise Fleet",
      priceMonthly: 9999,
      priceYearly: 99999,
      features: [
        "50+ Multi-Site Fleet API Access",
        "Custom ERP / SAP Connector Integration",
        "Dedicated Account Engineer in India",
        "Custom DPI Laser Scanner Calibrations",
        "Full DPDP Act 2023 Compliance Guarantee"
      ],
      badge: "Corporate"
    }
  ];

  const handleSubscribe = async (plan: any) => {
    setIsProcessing(true);
    const amount = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

    // Trigger Owner Permission Lock
    const perm = await requestOwnerPermission(
      `Purchase ${plan.name} (${billingCycle})`,
      amount,
      SITE_CONFIG.siteName
    );

    if (!perm.approved) {
      setIsProcessing(false);
      showToast(perm.message);
      return;
    }

    showToast(`🔄 Connecting to secure payment gateway for ₹${amount}...`);

    // ========================================================================
    // PAYMENT SAFETY ENFORCEMENT:
    // Backend HMAC must verify, frontend never sets isPaidVerified=true
    // ========================================================================
    setTimeout(() => {
      setIsProcessing(false);
      showToast(
        "🛡️ Secure Gateway: Real payment required via Razorpay. Backend HMAC signature verification pending."
      );
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
        isDarkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-white border-slate-300 text-slate-800"
      }`}>

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💳</span>
              <h3 className="text-lg font-black text-white">Commercial Licensing & Pricing</h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase">
                SAC 998313
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              GST Compliant Tax Invoicing • Protected by Owner WhatsApp Permission Lock
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-base transition-colors min-h-[44px] min-w-[44px] cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="p-4 sm:p-6 pb-0 flex justify-center">
          <div className="p-1 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all min-h-[40px] cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all min-h-[40px] cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.2 bg-emerald-500 text-black text-[9px] font-black rounded uppercase">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto">
          {plans.map((plan) => {
            const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-500 bg-blue-950/20 shadow-xl ring-1 ring-blue-500/50"
                    : "border-slate-800 bg-slate-900/30 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-400 font-bold text-[10px] uppercase">
                      {plan.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{plan.name}</h4>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-white">₹{price.toLocaleString()}</span>
                    <span className="text-xs text-slate-400">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Includes 18% GST (CGST 9% + SGST 9%)</p>

                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span className="text-[11px] leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe(plan);
                    }}
                    disabled={isProcessing}
                    className={`w-full py-2.5 font-bold text-xs rounded-xl min-h-[44px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                    }`}
                  >
                    <span>{isProcessing ? "⏳" : "🔒"}</span>
                    <span>{isProcessing ? "Verifying..." : `Select ${plan.name}`}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 text-center text-xs text-slate-400">
          <p>
            GST SAC 998313 • Invoicing Grievance Redressal: <strong>{SITE_CONFIG.grievanceName}</strong>, {SITE_CONFIG.grievanceAddress}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            // Backend HMAC must verify, frontend never sets isPaidVerified=true
          </p>
        </div>

      </div>
    </div>
  );
};
