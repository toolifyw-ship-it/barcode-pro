import React, { useEffect, useRef, useState } from "react";

// Adsterra Ads Configuration
// 1. 300x250 Rectangle: key '5dcf231b67f4d5d4326eb80afbaf7f80'
// 2. 320x50 Mobile: key '348725a6605e3b48ff87a73a267311e2'
// 3. 728x90 Leaderboard: key 'c123a9382995bc40acd2e0aeb9965d63'
// 4. Native Banner: key '7e837b037212e65acf251eda0a3a4f79' (pl31448935)
// 5. Social Bar: pl31448936.profitableratecpmnetwork.com (loaded in index.html)

interface AdProps {
  className?: string;
}

/**
 * Isolated Dynamic Adsterra Slot
 * Uses programmatically written same-origin iframes rather than about:srcdoc.
 * This ensures:
 * 1. window.location and document.referrer preserve the real approved domain (barcode-pro-zeta.vercel.app)
 * 2. atOptions is isolated to this iframe window, preventing collisions with other ads
 * 3. Base target="_blank" handles all click-throughs in new tabs
 * 4. Graceful loading & adblock detection state
 */
export const AdsterraAdSlot: React.FC<{
  adKey: string;
  width: number;
  height: number;
  title: string;
  className?: string;
}> = ({ adKey, width, height, title, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAdBlockDetected, setIsAdBlockDetected] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset container contents
    container.innerHTML = "";

    // Create same-origin iframe
    const iframe = document.createElement("iframe");
    iframe.title = title;
    iframe.width = `${width}`;
    iframe.height = `${height}`;
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.style.maxWidth = "100%";
    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("frameborder", "0");

    container.appendChild(iframe);

    // Write content directly to document so it inherits parent origin & referrer
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <base target="_blank">
              <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                html, body {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: transparent;
                  overflow: hidden;
                }
              </style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key' : '${adKey}',
                  'format' : 'iframe',
                  'height' : ${height},
                  'width' : ${width},
                  'params' : {}
                };
              </script>
              <script 
                type="text/javascript" 
                src="https://www.highrevenueformat.com/${adKey}/invoke.js"
                onerror="window.parent.postMessage({ type: 'ADSTERRA_BLOCKED', key: '${adKey}' }, '*');"
              ></script>
            </body>
          </html>
        `);
        doc.close();
      }
    } catch (err) {
      console.warn("Adsterra iframe initialization notice:", err);
    }

    // Listen for adblock detection signal
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "ADSTERRA_BLOCKED" && event.data?.key === adKey) {
        setIsAdBlockDetected(true);
      }
    };
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [adKey, width, height, title]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden max-w-full ad-skeleton-wrapper ${className}`} style={{ minWidth: `${Math.min(width, 320)}px`, minHeight: `${height}px` }}>
      {/* Background skeleton label during fetching */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 select-none">
        <span className="text-[10px] font-bold text-slate-500/80 uppercase tracking-widest">
          {title}
        </span>
        <span className="text-[9px] text-slate-600/70 mt-0.5">
          {width} × {height}
        </span>
      </div>

      <div 
        ref={containerRef} 
        className="relative z-10 flex items-center justify-center max-w-full"
        style={{ width: `${width}px`, height: `${height}px`, maxWidth: "100%" }}
      />
      {isAdBlockDetected && (
        <div className="absolute inset-0 z-20 bg-slate-900/90 border border-slate-700/60 rounded-xl flex flex-col items-center justify-center p-3 text-center pointer-events-none">
          <span className="text-[11px] font-bold text-amber-400 mb-1">🛡️ Ad Blocker Detected</span>
          <span className="text-[10px] text-slate-400">Please consider whitelisting to support free tools</span>
        </div>
      )}
    </div>
  );
};

/**
 * 300x250 Medium Rectangle Banner (Code 1)
 */
export const AdsterraRectangle300x250: React.FC<AdProps> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center my-3 w-full max-w-full overflow-hidden ${className}`}>
      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
        Sponsored Advertisement
      </span>
      <div className="w-[300px] max-w-full h-[250px] bg-slate-900/40 border border-slate-800/60 rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
        <AdsterraAdSlot
          adKey="5dcf231b67f4d5d4326eb80afbaf7f80"
          width={300}
          height={250}
          title="Sponsored Ad 300x250"
        />
      </div>
    </div>
  );
};

/**
 * Responsive Header/Footer Banner
 * Automatically serves:
 * - 320x50 on mobile and portrait tablets (< 768px) (Code 2)
 * - 728x90 on landscape tablets, laptops & desktops (≥ 768px) (Code 3)
 */
export const AdsterraResponsiveBanner: React.FC<AdProps> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center my-4 w-full max-w-full overflow-hidden px-2 ${className}`}>
      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
        Sponsored Advertisement
      </span>

      {/* Mobile & Small Tablet View (< 768px: 320x50, zero overflow) */}
      <div className="block md:hidden w-[320px] max-w-full h-[50px] bg-slate-900/40 border border-slate-800/60 rounded-lg overflow-hidden shadow-xs">
        <AdsterraAdSlot
          adKey="348725a6605e3b48ff87a73a267311e2"
          width={320}
          height={50}
          title="Sponsored Ad 320x50"
        />
      </div>

      {/* Tablet Landscape, Laptop & Desktop View (≥ 768px: 728x90) */}
      <div className="hidden md:flex justify-center items-center w-[728px] max-w-full h-[90px] bg-slate-900/40 border border-slate-800/60 rounded-xl overflow-hidden shadow-xs">
        <AdsterraAdSlot
          adKey="c123a9382995bc40acd2e0aeb9965d63"
          width={728}
          height={90}
          title="Sponsored Ad 728x90"
        />
      </div>
    </div>
  );
};

/**
 * Native Adsterra Banner (Code 4)
 * pl31448935.profitableratecpmnetwork.com/7e837b037212e65acf251eda0a3a4f79/invoke.js
 */
export const AdsterraNativeBanner: React.FC<AdProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if script already injected
    const existingScript = containerRef.current.querySelector("script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = "https://pl31448935.profitableratecpmnetwork.com/7e837b037212e65acf251eda0a3a4f79/invoke.js";
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center my-4 w-full px-2 ${className}`}>
      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
        Sponsored Recommendations
      </span>
      <div 
        ref={containerRef} 
        className="w-full max-w-4xl min-h-[100px] bg-slate-900/20 border border-slate-800/40 rounded-xl p-3 flex flex-col items-center justify-center"
      >
        <div id="container-7e837b037212e65acf251eda0a3a4f79"></div>
      </div>
    </div>
  );
};
