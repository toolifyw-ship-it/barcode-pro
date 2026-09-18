import React, { useState, useEffect } from "react";

export interface ReferralState {
  referralCode: string;
  referralCount: number;
  unlockedTiers: number[];
  claimedRewards: string[];
  referredBy?: string;
}

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  showToast: (msg: string) => void;
  referralState: ReferralState;
  onUpdateReferralState: (newState: ReferralState) => void;
}

export function ReferralModal({
  isOpen,
  onClose,
  isDarkMode,
  showToast,
  referralState,
  onUpdateReferralState,
}: ReferralModalProps) {
  const [copied, setCopied] = useState(false);

  // Derive the full shareable URL
  const origin = typeof window !== "undefined" ? window.location.origin : "https://barcoderpro.com";
  const shareUrl = `${origin}/?ref=${referralState.referralCode}`;

  const shareText = `🚀 Generate industrial-grade Barcodes & QR Codes for free on BarcoderPro! Use my exclusive invite link to unlock +500 Bulk Batch Quotas & VIP Vector Exports: ${shareUrl}`;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast("📋 Referral Link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      showToast("⚠️ Please copy link manually: " + shareUrl);
    }
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent("Gift: Unlock Free VIP Barcode Quotas on BarcoderPro");
    const body = encodeURIComponent(shareText);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  };

  // Simulation handler for instant testing
  const handleSimulateInvite = () => {
    const newCount = referralState.referralCount + 1;
    const newTiers = [...referralState.unlockedTiers];
    if (newCount >= 1 && !newTiers.includes(1)) newTiers.push(1);
    if (newCount >= 3 && !newTiers.includes(2)) newTiers.push(2);
    if (newCount >= 5 && !newTiers.includes(3)) newTiers.push(3);

    const updated: ReferralState = {
      ...referralState,
      referralCount: newCount,
      unlockedTiers: newTiers,
    };
    onUpdateReferralState(updated);
    showToast(`🎉 Referral simulated! Total invites: ${newCount}. Reward tiers updated!`);
  };

  const handleResetSim = () => {
    const updated: ReferralState = {
      ...referralState,
      referralCount: 0,
      unlockedTiers: [],
      claimedRewards: [],
    };
    onUpdateReferralState(updated);
    showToast("🔄 Referral counter reset to 0 for fresh testing.");
  };

  if (!isOpen) return null;

  const currentCount = referralState.referralCount;
  const progressPercent = Math.min(100, Math.round((currentCount / 5) * 100));

  return (
    <div
      className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="referral-modal-title"
      >
        {/* MODAL HEADER */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between gap-3 shrink-0 ${
            isDarkMode ? "border-slate-800 bg-slate-900/70" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center text-xl font-black shadow-md shrink-0">
              🎁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="referral-modal-title" className="text-base sm:text-lg font-black tracking-tight">
                  Refer & Unlock VIP Perks
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Double-Sided Rewards
                </span>
              </div>
              <p className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Invite coworkers & friends. Both you and your friend unlock instant VIP perks!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm transition-all cursor-pointer shrink-0 ${
              isDarkMode ? "text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700" : "text-slate-500 hover:text-slate-900 bg-slate-200 hover:bg-slate-300"
            }`}
            title="Close Referral Hub"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* MODAL SCROLLABLE BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* PROGRESS SUMMARY CARD */}
          <div
            className={`p-4 rounded-2xl border ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border-amber-500/30"
                : "bg-gradient-to-br from-amber-50/60 to-yellow-50/40 border-amber-200"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">
                  Your Referral Status
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black">{currentCount}</span>
                  <span className={`text-xs font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    / 5 Friends Joined
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block">Current Rank</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-amber-500 text-slate-950">
                  {currentCount >= 5 ? "👑 Enterprise VIP" : currentCount >= 3 ? "💎 Vector Pro" : currentCount >= 1 ? "⚡ Batch Pro" : "🌱 Starter"}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700/30 h-2.5 rounded-full overflow-hidden mb-1">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>0 (Starter)</span>
              <span>1 (1K Bulk)</span>
              <span>3 (Vector HD)</span>
              <span>5 (Lifetime VIP)</span>
            </div>
          </div>

          {/* SHAREABLE LINK SECTION */}
          <div className="space-y-2">
            <label className={`block text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
              Your Unique Referral Link
            </label>
            <div className="flex items-center gap-2">
              <div
                className={`flex-1 px-3.5 py-2.5 rounded-xl border font-mono text-xs truncate select-all ${
                  isDarkMode ? "bg-slate-950 border-slate-750 text-amber-300" : "bg-slate-50 border-slate-300 text-amber-800"
                }`}
                title={shareUrl}
              >
                {shareUrl}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-blue-600/20 shrink-0 flex items-center gap-1.5"
              >
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>
            <p className={`text-[10px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              💡 Anyone who clicks this link automatically receives <strong>+500 Free Bulk Quota</strong>!
            </p>
          </div>

          {/* 1-CLICK VIRAL SHARE BUTTONS */}
          <div className="space-y-2">
            <label className={`block text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
              Instant 1-Click Share
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                title="Share on WhatsApp"
              >
                <span>💬</span> WhatsApp
              </button>
              <button
                type="button"
                onClick={handleShareTelegram}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                title="Share on Telegram"
              >
                <span>✈️</span> Telegram
              </button>
              <button
                type="button"
                onClick={handleShareTwitter}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-black hover:bg-slate-900 border border-slate-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                title="Share on X / Twitter"
              >
                <span>𝕏</span> Post
              </button>
              <button
                type="button"
                onClick={handleShareLinkedIn}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                title="Share on LinkedIn"
              >
                <span>💼</span> LinkedIn
              </button>
              <button
                type="button"
                onClick={handleShareEmail}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                  isDarkMode ? "bg-slate-900 border-slate-750 text-slate-200 hover:bg-slate-800" : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200"
                }`}
                title="Send Invite via Email"
              >
                <span>✉️</span> Email
              </button>
            </div>
          </div>

          {/* REWARDS & TIERS BREAKDOWN (Like Dropbox / Canva) */}
          <div className="space-y-3">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
              What You & Your Friends Unlock
            </h3>

            <div className="space-y-2.5">
              {/* TIER 1 */}
              <div
                className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 transition-all ${
                  currentCount >= 1
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : isDarkMode ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 font-bold ${
                      currentCount >= 1 ? "bg-emerald-500 text-white" : "bg-slate-700/50 text-slate-400"
                    }`}
                  >
                    1
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs">Tier 1: 1 Friend Invited</span>
                      {currentCount >= 1 && (
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                          ✓ Unlocked
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-0.5 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                      <strong>1,000 Bulk Batch Export Limit</strong> (Expanded from regular 250 codes) + Golden VIP Profile Badge.
                    </p>
                  </div>
                </div>
              </div>

              {/* TIER 2 */}
              <div
                className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 transition-all ${
                  currentCount >= 3
                    ? "border-purple-500/40 bg-purple-500/10"
                    : isDarkMode ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 font-bold ${
                      currentCount >= 3 ? "bg-purple-500 text-white" : "bg-slate-700/50 text-slate-400"
                    }`}
                  >
                    3
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs">Tier 2: 3 Friends Invited</span>
                      {currentCount >= 3 && (
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase">
                          ✓ Unlocked
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-0.5 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                      <strong>Ultra-HD 600 DPI Vector PDF & SVG Pack</strong> + Custom Logo Embed on QR Codes with zero watermarks.
                    </p>
                  </div>
                </div>
              </div>

              {/* TIER 3 */}
              <div
                className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 transition-all ${
                  currentCount >= 5
                    ? "border-amber-500/40 bg-amber-500/10"
                    : isDarkMode ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 font-bold ${
                      currentCount >= 5 ? "bg-amber-500 text-slate-950" : "bg-slate-700/50 text-slate-400"
                    }`}
                  >
                    5
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs">Tier 3: 5 Friends Invited</span>
                      {currentCount >= 5 && (
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                          ✓ Lifetime Unlocked
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-0.5 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                      <strong>10,000 Bulk Batch Limit</strong> + All 50+ A4 Sheet Sticker presets + 100% Ad-Free forever.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TESTING / SIMULATION CONTROLS */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
            isDarkMode ? "bg-slate-900/30 border-slate-850" : "bg-slate-100/70 border-slate-200"
          }`}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                🧪 Developer & Preview Test Sandbox
              </span>
              <span className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Test your referral progression immediately
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleSimulateInvite}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
              >
                +1 Invite
              </button>
              <button
                type="button"
                onClick={handleResetSim}
                className={`px-2.5 py-1.5 rounded-lg border font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div
          className={`px-5 py-3 border-t flex items-center justify-between gap-3 shrink-0 ${
            isDarkMode ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-slate-50"
          }`}
        >
          <span className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Referral Code: <strong className="font-mono text-amber-500">{referralState.referralCode}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-blue-600/20 active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
