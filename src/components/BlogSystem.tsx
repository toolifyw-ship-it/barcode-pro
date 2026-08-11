import React from "react";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";

interface BlogSystemProps {
  path: string;
  isDarkMode: boolean;
  navigate: (path: string) => void;
  showToast: (msg: string) => void;
}

export const BlogSystem: React.FC<BlogSystemProps> = ({ path, isDarkMode, navigate, showToast }) => {
  const bgCard = isDarkMode ? "bg-slate-900/40 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-750 shadow-sm";
  const bgSubCard = isDarkMode ? "bg-slate-950/80 border-slate-850" : "bg-slate-50 border-slate-200";
  const titleColor = isDarkMode ? "text-white" : "text-slate-900";

  // If on blog index page (/blog or /blog/)
  if (path === "/blog" || path === "/blog/") {
    const articles = [
      {
        id: "what-is-code128",
        title: "Understanding Code 128: The Industry Standard for Shipping & Logistics",
        subtitle: "Symbology specifications, Character Subsets A/B/C packing algorithms, and modern e-commerce warehousing.",
        tag: "Logistics & Shipping",
        readTime: "6 min read",
        author: "Sukanta Singha",
        url: "/blog/what-is-code128"
      },
      {
        id: "what-is-ean13",
        title: "The Anatomy of EAN-13 Product Barcodes: From India Prefix to Checksum Calculation",
        subtitle: "A complete technical specification of European Product Association retail standards, prefixes, and Modulo checksums.",
        tag: "Retail POS",
        readTime: "7 min read",
        author: "Sukanta Singha",
        url: "/blog/what-is-ean13"
      },
      {
        id: "what-is-upc",
        title: "Master Guide to UPC-A and UPC-E Retail Barcodes in North America",
        subtitle: "How 12-digit UPC systems work, zero-suppression packing for small products, and Amazon FBA compliance.",
        tag: "E-Commerce",
        readTime: "5 min read",
        author: "Sukanta Singha",
        url: "/blog/what-is-upc"
      },
      {
        id: "barcode-vs-qr-code",
        title: "Linear (1D) Barcodes vs. 2D QR Codes: Quantitative Technical Comparison",
        subtitle: "Data density benchmarks, optical scanner mechanics, and Reed-Solomon error correction breakdown.",
        tag: "Technical Analysis",
        readTime: "8 min read",
        author: "Sukanta Singha",
        url: "/blog/barcode-vs-qr-code"
      },
      {
        id: "gs1-guide",
        title: "Universal GS1 Compliance: How to Properly Register Commercial Goods",
        subtitle: "Step-by-step guide to assigning company prefixes, allocating GTIN numbers, and configuring printing setups.",
        tag: "GS1 Compliance",
        readTime: "10 min read",
        author: "Sukanta Singha",
        url: "/blog/gs1-guide"
      }
    ];

    return (
      <div className="animate-fade max-w-5xl mx-auto px-2 space-y-8">
        <div className={`p-6 sm:p-8 rounded-2rem border transition-colors ${bgCard}`}>
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs text-blue-500 font-bold hover:underline mb-6 cursor-pointer"
          >
            ← Back to Generator Suite
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📚</span>
            <h1 className={`text-2xl sm:text-3xl font-extrabold ${titleColor}`}>
              Barcoder Pro Technical Engineering Blog
            </h1>
          </div>
          <p className="text-xs text-blue-500 font-bold italic mb-6">
            In-depth technical guides on barcode symbologies, GS1 compliance, thermal printing, and barcode scanner optics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {articles.map((art) => (
              <div 
                key={art.id} 
                onClick={() => navigate(art.url)}
                className={`p-6 rounded-2xl border transition-all hover:border-blue-500/50 cursor-pointer space-y-3 flex flex-col justify-between ${bgSubCard}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-[10px]">
                      {art.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{art.readTime}</span>
                  </div>
                  <h3 className={`text-base font-extrabold hover:text-blue-400 transition-colors ${titleColor}`}>
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {art.subtitle}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>By <strong>{art.author}</strong></span>
                  <span className="text-blue-400 font-bold hover:underline flex items-center gap-1">
                    Read Article →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Article details setup
  let blogTitle = "";
  let blogSubtitle = "";
  let blogBody = "";
  let widgetFormat = "CODE128";
  let widgetPlaceholder = "1200384950";

  if (path.includes("what-is-code128")) {
    blogTitle = "Understanding Code 128: The Industry Standard for Shipping & Logistics";
    blogSubtitle = "Symbology specifications, Character Subsets A/B/C packing algorithms, and modern e-commerce warehousing.";
    blogBody = `
      <h3 class="text-base font-bold text-blue-500 mt-4 mb-2">🔍 1. Introduction to Code 128</h3>
      <p class="mb-4"><strong>Code 128</strong> is an exceptionally high-density, high-security linear (1D) barcode standard. Developed by Computer Identics in 1981, it supports encoding all 128 ASCII symbols, including digits, symbols, alphanumeric text, and control characters. Because of its structural compactness and safety checksum, it is the primary standard for logistics, shipping label templates, package distribution, tracking identifiers, and warehousing protocols worldwide.</p>

      <h3 class="text-base font-bold text-blue-500 mt-4 mb-2">⚙️ 2. The Multi-Pack Character Subsets (A/B/C)</h3>
      <p class="mb-2">A key feature of Code 128 is its ability to transition between three distinct subsets (A, B, and C) mid-barcode to optimize spacing:</p>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        <li><strong>Subset A:</strong> Alphanumeric characters, control commands, and uppercase alphabets.</li>
        <li><strong>Subset B:</strong> Direct ASCII standard text, punctuation, and lowercase alphabets.</li>
        <li><strong>Subset C:</strong> Packs double digits (00-99) into single visual bar markers, reducing code widths by up to 50% for numeric streams.</li>
      </ul>

      <h3 class="text-base font-bold text-blue-500 mt-4 mb-2">⚖️ 3. GS1-128 and Enterprise Compliance</h3>
      <p class="mb-4">When prefixed with localized application identifiers (AIs), Code 128 turns into <strong>GS1-128</strong> (formerly UCC/EAN-128). This compliant design specifies expiration dates, net weights, serial indices, and tracking ids on shipment parcels, keeping automated global ports running seamlessly.</p>
    `;
    widgetFormat = "CODE128";
    widgetPlaceholder = "SYS-LOGIS-902";
  } else if (path.includes("what-is-ean13")) {
    blogTitle = "The Anatomy of EAN-13 Product Barcodes: From India Prefix to Checksum Calculation";
    blogSubtitle = "A complete technical specification of European Product Association retail standards, prefixes, and Modulo checksums.";
    blogBody = `
      <h3 class="text-base font-bold text-blue-500 mt-4 mb-2">🔍 1. Defining EAN-13</h3>
      <p class="mb-4">The <strong>EAN-13 (European Article Number, or International Article Number)</strong> represents the gold standard for global checkout scanning. Based on UPC-A systems, EAN-13 is designed with exactly thirteen numeric digits, allowing individual manufacturers to uniquely identify their retail goods in supermarkets worldwide.</p>

      <h3 class="text-base font-bold text-blue-500 mt-4 mb-2">📊 2. Anatomical Grid Layout</h3>
      <p class="mb-2">The EAN-13 string divides logically into four key sectors:</p>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        <li><strong>Country Prefix (3 digits):</strong> Identifies the regional GS1 authority (e.g., <strong>890 for India</strong>, 400-440 for Germany, 500 for UK).</li>
        <li><strong>Manufacturer Code (4 to 6 digits):</strong> Uniquely assigned by GS1 to individual commercial businesses.</li>
        <li><strong>Item Reference (3 to 5 digits):</strong> Allocated by the company to detail individual products.</li>
        <li><strong>Checksum (Last digit):</strong> A mandatory mathematical check preventing scan failures.</li>
      </ul>
    `;
    widgetFormat = "EAN13";
    widgetPlaceholder = "8901234567890";
  } else if (path.includes("what-is-upc")) {
    blogTitle = "Master Guide to UPC-A and UPC-E Retail Barcodes in North America";
    blogSubtitle = "How 12-digit UPC systems work, zero-suppression packing for small products, and Amazon FBA compliance.";
    blogBody = `
      <h3 class="text-base font-bold text-blue-500 mt-4 mb-2">🔍 1. Overview of UPC-A Standard</h3>
      <p class="mb-4"><strong>Universal Product Code (UPC-A)</strong> consists of 12 numerical digits used extensively across retail stores in North America (USA and Canada). It includes a Number System digit, 5-digit Manufacturer ID, 5-digit Item number, and 1 Modulo-10 checksum digit.</p>

      <h3 class="text-base font-bold text-blue-500 mt-4 mb-2">📦 2. Zero-Suppression UPC-E</h3>
      <p class="mb-4">For small packages like cosmetics and candy wrappers where space is limited, UPC-E compresses 12 digits into 8 digits by suppressing extra zeros, maintaining 100% scanning accuracy.</p>
    `;
    widgetFormat = "UPC";
    widgetPlaceholder = "012345678905";
  } else if (path.includes("barcode-vs-qr-code")) {
    blogTitle = "Linear (1D) Barcodes vs. 2D QR Codes: Quantitative Technical Comparison";
    blogSubtitle = "Data density benchmarks, optical scanner mechanics, and Reed-Solomon error correction breakdown.";
    blogBody = `
      <h3 class="text-base font-bold text-blue-500 mt-4 mb-2">⚡ 1. One-Dimensional (1D) Barcodes</h3>
      <p class="mb-4">Linear barcodes store data horizontally in parallel line/space ratios. Excellent for quick 1D laser scanning in retail POS and warehouse logistics.</p>

      <h3 class="text-base font-bold text-blue-500 mt-4 mb-2">📱 2. Two-Dimensional (2D) Matrix Codes</h3>
      <p class="mb-4">2D codes like QR Code and DataMatrix store up to 4,296 characters vertically and horizontally. Feature Reed-Solomon error correction to remain scannable even if up to 30% damaged.</p>
    `;
    widgetFormat = "QR";
    widgetPlaceholder = "https://barcoderpro-zeta.vercel.app/";
  } else {
    blogTitle = "Universal GS1 Compliance: How to Properly Register Commercial Goods";
    blogSubtitle = "Step-by-step guide to assigning company prefixes, allocating GTIN numbers, and configuring printing setups.";
    blogBody = `
      <h3 class="text-base font-bold text-blue-500 mt-4 mb-2">🎯 1. How GS1 Compliance Works</h3>
      <p class="mb-4">Universal product registries depend on <strong>GS1 standards</strong>. GS1 is the global non-profit governing system that allocates retail barcodes, ensuring no two products are issued identical numbers.</p>

      <h3 class="text-base font-bold text-blue-500 mt-4 mb-2">🛠️ 2. Registration Guide Step-by-Step</h3>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        <li><strong>Step A: Join National Authority:</strong> Register at your official local registry (e.g., GS1 India, GS1 USA).</li>
        <li><strong>Step B: Obtain Company Prefix:</strong> You receive a unique 6-to-10 digit prefix code.</li>
        <li><strong>Step C: Assign GTIN Codes:</strong> Generate Global Trade Item Number (GTIN-13) sequences.</li>
        <li><strong>Step D: Select Graphics Tool:</strong> Run compliance generators like Barcoder Pro to render crisp PNG codes for commercial retail wraps.</li>
      </ul>
    `;
    widgetFormat = "CODE128";
    widgetPlaceholder = "GS1-INDI-8902";
  }

  const handleWidgetDownload = (inputVal: string) => {
    try {
      const tempCanvas = document.createElement("canvas");
      if (widgetFormat === "QR") {
        QRCode.toCanvas(tempCanvas, inputVal, { width: 300 }, () => {
          const a = document.createElement("a");
          a.download = `Blog_BarcoderPro_Widget.png`;
          a.href = tempCanvas.toDataURL("image/png");
          a.click();
        });
      } else {
        JsBarcode(tempCanvas, inputVal, { format: widgetFormat, lineColor: "#000000", width: 2, height: 80 });
        const a = document.createElement("a");
        a.download = `Blog_BarcoderPro_Widget.png`;
        a.href = tempCanvas.toDataURL("image/png");
        a.click();
      }
      showToast("✅ Downloaded from informational widget!");
    } catch {
      showToast("❌ Unable to compile widget text");
    }
  };

  return (
    <div className="animate-fade max-w-5xl mx-auto px-2 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Core informational text */}
      <div className={`lg:col-span-8 p-6 sm:p-8 rounded-2rem border transition-colors ${bgCard}`}>
        <button 
          onClick={() => navigate("/blog")}
          className="flex items-center gap-1.5 text-xs text-blue-500 font-bold hover:underline mb-6 cursor-pointer"
        >
          ← Back to Blog Directory
        </button>
        
        <h1 className={`text-2xl sm:text-3xl font-extrabold pb-3 border-b border-dashed ${
          isDarkMode ? "text-white border-slate-800" : "text-slate-900 border-slate-200"
        }`}>
          {blogTitle}
        </h1>
        <p className="text-xs text-blue-500 font-bold mt-2 italic">{blogSubtitle}</p>
        
        <div 
          className="blog-main-content mt-6 text-xs sm:text-[13px] leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: blogBody }}
        ></div>

        {/* Directory links */}
        <div className="border-t border-dashed mt-8 pt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-3">📖 Continuous Learning Directory</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-bold">
            <button onClick={() => navigate("/blog/what-is-code128")} className="text-left text-blue-500 hover:underline">📚 Guide: Learning Code 128 Specifications</button>
            <button onClick={() => navigate("/blog/what-is-ean13")} className="text-left text-blue-500 hover:underline">📚 Guide: Mastering EAN-13 retail codes</button>
            <button onClick={() => navigate("/blog/what-is-upc")} className="text-left text-blue-500 hover:underline">📚 Guide: UPC-A systems and North America</button>
            <button onClick={() => navigate("/blog/barcode-vs-qr-code")} className="text-left text-blue-500 hover:underline">📚 Guide: Quantitative study: Linear vs 2D Matrix</button>
            <button onClick={() => navigate("/blog/gs1-guide")} className="text-left text-blue-500 hover:underline">📚 Guide: Full GS1 registration procedure</button>
          </div>
        </div>
      </div>

      {/* Sidebar Mini Widget */}
      <div className="lg:col-span-4 space-y-6">
        <div className={`p-5 rounded-2rem border transition-colors ${bgCard}`}>
          <span className="text-xl">⚡</span>
          <h3 className={`text-sm font-extrabold mt-1 mb-2 ${titleColor}`}>
            Instant Informative Generator
          </h3>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
            Try converting your inputs using the widget pre-configured to <strong>{widgetFormat}</strong>. Run, verify, and use instantly!
          </p>

          <div className="space-y-3">
            <input 
              id="widgetInputVal"
              type="text"
              defaultValue={widgetPlaceholder}
              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border outline-none ${
                isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            />
            <button
              onClick={() => {
                const val = (document.getElementById("widgetInputVal") as HTMLInputElement)?.value || widgetPlaceholder;
                handleWidgetDownload(val);
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase rounded-lg cursor-pointer"
            >
              Download Test Barcode
            </button>
          </div>
        </div>

        {/* Quick specs card */}
        <div className={`p-5 rounded-2rem border transition-colors ${bgCard}`}>
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${titleColor}`}>
            📋 Quick Parameters Sheet
          </h3>
          <div className="text-[10px] space-y-1 text-slate-400 font-semibold leading-relaxed">
            <p>📍 Category: Open source free tool</p>
            <p>🌐 Security: Local browser rendering</p>
            <p>💾 Sizing: Scalable multiplier (1x - 5x)</p>
            <p>🏁 Availability: 24/7 Global Point-of-Sale</p>
          </div>
        </div>
      </div>
    </div>
  );
};
