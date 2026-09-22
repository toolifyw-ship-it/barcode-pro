import React, { useEffect, useRef } from "react";

// Adsterra Ads Configuration
// 1. 300x250 Rectangle: key '5dcf231b67f4d5d4326eb80afbaf7f80'
// 2. 320x50 Mobile: key '348725a6605e3b48ff87a73a267311e2'
// 3. 728x90 Leaderboard: key 'c123a9382995bc40acd2e0aeb9965d63'
// 4. Native Banner: key '7e837b037212e65acf251eda0a3a4f79' (pl31448935)
// 5. Social Bar / Direct Script: pl31448936.profitableratecpmnetwork.com (loaded in index.html)

interface AdProps {
  className?: string;
}

/**
 * 300x250 Medium Rectangle Banner (Code 1)
 */
export const AdsterraRectangle300x250: React.FC<AdProps> = ({ className = "" }) => {
  const srcDocContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <base target="_blank">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; background: transparent; overflow: hidden; width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <script type="text/javascript">
        atOptions = {
          'key' : '5dcf231b67f4d5d4326eb80afbaf7f80',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="https://www.highrevenueformat.com/5dcf231b67f4d5d4326eb80afbaf7f80/invoke.js"></script>
    </body>
    </html>
  `;

  return (
    <div className={`flex flex-col items-center justify-center my-3 w-full max-w-full overflow-hidden ${className}`}>
      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
        Sponsored Advertisement
      </span>
      <div className="w-[300px] max-w-full h-[250px] bg-slate-900/30 border border-slate-800/60 rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
        <iframe
          title="Sponsored Ad 300x250"
          srcDoc={srcDocContent}
          width={300}
          height={250}
          frameBorder={0}
          scrolling="no"
          className="border-0 overflow-hidden max-w-full w-full h-full"
          loading="lazy"
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
  const mobileSrcDoc = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <base target="_blank">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; background: transparent; overflow: hidden; width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <script type="text/javascript">
        atOptions = {
          'key' : '348725a6605e3b48ff87a73a267311e2',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="https://www.highrevenueformat.com/348725a6605e3b48ff87a73a267311e2/invoke.js"></script>
    </body>
    </html>
  `;

  const desktopSrcDoc = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <base target="_blank">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; background: transparent; overflow: hidden; width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <script type="text/javascript">
        atOptions = {
          'key' : 'c123a9382995bc40acd2e0aeb9965d63',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="https://www.highrevenueformat.com/c123a9382995bc40acd2e0aeb9965d63/invoke.js"></script>
    </body>
    </html>
  `;

  return (
    <div className={`flex flex-col items-center justify-center my-4 w-full max-w-full overflow-hidden px-2 ${className}`}>
      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
        Sponsored Advertisement
      </span>

      {/* Mobile & Small Tablet View (< 768px: 320x50, zero overflow) */}
      <div className="block md:hidden w-[320px] max-w-full h-[50px] bg-slate-900/30 border border-slate-800/60 rounded-lg overflow-hidden shadow-xs">
        <iframe
          title="Sponsored Ad 320x50"
          srcDoc={mobileSrcDoc}
          width={320}
          height={50}
          frameBorder={0}
          scrolling="no"
          className="border-0 overflow-hidden max-w-full w-full h-full"
          loading="lazy"
        />
      </div>

      {/* Tablet Landscape, Laptop & Desktop View (≥ 768px: 728x90) */}
      <div className="hidden md:flex justify-center items-center w-[728px] max-w-full h-[90px] bg-slate-900/30 border border-slate-800/60 rounded-xl overflow-hidden shadow-xs">
        <iframe
          title="Sponsored Ad 728x90"
          srcDoc={desktopSrcDoc}
          width={728}
          height={90}
          frameBorder={0}
          scrolling="no"
          className="border-0 overflow-hidden max-w-full w-full h-full"
          loading="lazy"
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
