import React, { useState, useEffect } from "react";
import { ShieldAlert, X, HelpCircle, RefreshCw } from "lucide-react";

/**
 * Lightweight, Non-Intrusive Ad-Blocker Detector & Notification
 * - Detects if uBlock, AdBlock Plus, Brave Shields, or Pi-hole is blocking ads
 * - Non-intrusive: Does NOT lock screen or break user workflow
 * - Can be dismissed with 1-click (persisted in sessionStorage)
 * - Helps recover publisher revenue without degrading user experience
 */
export const AdBlockerNotice: React.FC = () => {
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("adblock_notice_dismissed") === "true";
    } catch {
      return false;
    }
  });
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  useEffect(() => {
    if (isDismissed) return;

    // Detect using hidden bait element and network test
    const detectAdBlock = () => {
      try {
        const bait = document.createElement("div");
        bait.className = "pub_300x250 pub_728x90 text-ad textAd ad-banner adsbox ad-placement";
        bait.style.position = "absolute";
        bait.style.left = "-9999px";
        bait.style.top = "-9999px";
        bait.style.width = "1px";
        bait.style.height = "1px";
        document.body.appendChild(bait);

        setTimeout(() => {
          const blocked =
            bait.offsetHeight === 0 ||
            bait.clientHeight === 0 ||
            window.getComputedStyle(bait).display === "none" ||
            window.getComputedStyle(bait).visibility === "hidden";

          if (blocked) {
            setIsBlocked(true);
          }
          if (document.body.contains(bait)) {
            document.body.removeChild(bait);
          }
        }, 150);
      } catch {
        // Safe fallback
      }
    };

    // Run after 2.5s delay to keep first render ultra-fast
    const timer = setTimeout(detectAdBlock, 2500);

    // Also listen to postMessage from ad iframes
    const handleMsg = (e: MessageEvent) => {
      if (e.data?.type === "ADSTERRA_BLOCKED") {
        setIsBlocked(true);
      }
    };
    window.addEventListener("message", handleMsg);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("message", handleMsg);
    };
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("adblock_notice_dismissed", "true");
    } catch (e) {
      console.warn("Storage notice:", e);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (!isBlocked || isDismissed) {
    return null;
  }

  return (
    <div className="w-full bg-slate-900/95 border-b border-amber-500/30 px-3 py-2 sm:py-2.5 text-slate-200 text-xs shadow-md transition-all animate-fade">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-amber-300 font-semibold">Ad-Blocker Active: </strong>
            We keep Barcoder Pro 100% free with zero user data tracking. Please consider pausing your ad-blocker or whitelisting our site to support server costs.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowInstructions(!showInstructions)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700/50 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>How to Whitelist</span>
          </button>

          <button
            type="button"
            onClick={handleReload}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refreshed</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            title="Dismiss notice"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Whitelist Instructions Dropdown */}
      {showInstructions && (
        <div className="max-w-3xl mx-auto mt-2 p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-[11px] text-slate-300 leading-relaxed">
          <p className="font-bold text-white mb-1">How to whitelist barcode-pro-zeta.vercel.app in 5 seconds:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>Click your AdBlock / uBlock / Brave Shields extension icon in your browser toolbar.</li>
            <li>Click the power icon or toggle switch to <strong>&quot;Disable on this site&quot;</strong>.</li>
            <li>Click <strong>&quot;Refreshed&quot;</strong> above. Thank you for supporting free software!</li>
          </ol>
        </div>
      )}
    </div>
  );
};
