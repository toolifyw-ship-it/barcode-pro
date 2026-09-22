import React, { useState, useEffect } from "react";
import { Cookie, X, ShieldCheck } from "lucide-react";

interface CookieConsentBannerProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

/**
 * Enterprise Cookie Consent & Privacy Bottom Banner
 * Modeled precisely after top tech enterprise banners (as specified in user screenshot):
 * - Dark slate container with generous padding & rounded corners
 * - 🍪 Orange cookie icon with bold "COOKIE CONSENT & PRIVACY"
 * - Privacy Policy & Terms of Service links with orange underline
 * - Vibrant orange "Accept All" button + Slate "Close" button
 * - Persistent round "S" floating badge with live green status indicator
 */
export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookie_consent_accepted");
      if (consent !== "true") {
        // Show after a subtle delay for smooth entry animation
        const timer = setTimeout(() => setIsVisible(true), 600);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem("cookie_consent_accepted", "true");
      localStorage.setItem("cookie_consent_timestamp", new Date().toISOString());
    } catch (e) {
      console.warn("Storage not available:", e);
    }
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleReopen = () => {
    setIsVisible(true);
  };

  return (
    <>
      {/* Bottom Floating Banner (as in user screenshot) */}
      {isVisible && (
        <aside 
          className="fixed bottom-3 left-3 right-3 sm:bottom-5 sm:left-auto sm:right-6 sm:max-w-lg z-[9990] animate-fade"
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
        >
          <div className="bg-[#141721]/98 border border-slate-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl text-slate-100 relative">
            {/* Top Close Button (✕) */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-slate-800/80 cursor-pointer"
              aria-label="Close cookie consent dialog"
              title="Close notification"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header: 🍪 Icon + COOKIE CONSENT & PRIVACY */}
            <div className="flex items-center gap-2.5 mb-3 pr-8">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500/20 text-orange-500 shrink-0">
                <Cookie className="w-4 h-4 text-orange-500" />
              </span>
              <h2 
                id="cookie-consent-title" 
                className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white select-none m-0"
              >
                COOKIE CONSENT & PRIVACY
              </h2>
            </div>

            {/* Body Description */}
            <p 
              id="cookie-consent-desc" 
              className="text-xs sm:text-[13px] leading-relaxed text-slate-300/90 mb-5 font-normal"
            >
              We use non-intrusive cookies to serve ads via Google AdSense and support server costs. Learn more in our{" "}
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-orange-500 hover:text-orange-400 underline decoration-orange-500/80 underline-offset-4 font-semibold transition-colors cursor-pointer bg-transparent border-none p-0 inline"
              >
                Privacy Policy
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={onOpenTerms}
                className="text-orange-500 hover:text-orange-400 underline decoration-orange-500/80 underline-offset-4 font-semibold transition-colors cursor-pointer bg-transparent border-none p-0 inline"
              >
                Terms of Service
              </button>
              .
            </p>

            {/* Action Buttons: "Accept All" (Orange) + "Close" (Slate) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-orange-600/25 active:scale-[0.98] cursor-pointer text-center"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 bg-slate-800/90 hover:bg-slate-700 active:bg-slate-750 text-slate-200 font-semibold text-xs sm:text-sm py-3 rounded-xl sm:rounded-2xl transition-all border border-slate-700/60 active:scale-[0.98] cursor-pointer text-center"
              >
                Close
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Floating Monogram 'S' Badge with Live Green Indicator (Shown in user screenshot) */}
      <div className="fixed bottom-4 right-4 z-[9985] group select-none">
        <button
          type="button"
          onClick={handleReopen}
          className="relative w-11 h-11 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white flex items-center justify-center shadow-xl border-2 border-slate-900 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Privacy & Cookie Preferences"
          aria-label="Open Privacy and Cookie Settings"
        >
          {/* Serif italic S as seen in uploaded screenshot */}
          <span className="font-serif italic font-bold text-lg leading-none">S</span>
          {/* Green Live Status Indicator Dot */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-xs animate-pulse" />
        </button>
      </div>

      {/* Quick Privacy Details Modal if user clicks status */}
      {showStatusModal && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade"
          onClick={() => setShowStatusModal(false)}
        >
          <div 
            className="bg-[#141721] border border-slate-700 rounded-3xl p-6 max-w-sm w-full text-slate-100 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowStatusModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Privacy & Verification</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Barcoder Pro is verified by Sukanta Singha. We process 100% of barcodes locally in your browser with zero remote data collection.
            </p>
            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
              <span>Status: <strong className="text-emerald-400">Verified Safe</strong></span>
              <button 
                onClick={() => { setShowStatusModal(false); setIsVisible(true); }}
                className="text-orange-400 hover:underline font-semibold"
              >
                Change Cookies
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
