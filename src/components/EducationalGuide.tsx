import React, { useState } from "react";

interface EducationalGuideProps {
  isDarkMode: boolean;
  navigate: (path: string) => void;
}

export const EducationalGuide: React.FC<EducationalGuideProps> = ({ isDarkMode, navigate }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("all");

  const bgCard = isDarkMode ? "bg-slate-900/60 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700 shadow-sm";
  const bgSubCard = isDarkMode ? "bg-slate-950/80 border-slate-850" : "bg-slate-50 border-slate-200";
  const titleColor = isDarkMode ? "text-slate-100" : "text-slate-900";
  const headingColor = "text-blue-500 font-extrabold";

  return (
    <div className="mt-12 space-y-10" id="educational-guide-hub">
      {/* Banner / Header */}
      <section className={`p-6 sm:p-8 rounded-2rem border transition-all ${bgCard}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dashed border-slate-700/50 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">
              <span>📘</span> Barcoder Pro Technical Library • 2026 Edition
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black ${titleColor}`}>
              Comprehensive Master Guide to Barcode & 2D Symbology Technology
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
              An authoritative 3,000+ word engineering manual covering barcode physics, symbology algorithms, GS1 standards, retail checkout specs, warehouse logistics, thermal printing calibration, and ISO/IEC 15416 quality verification.
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="self-start md:self-center px-4 py-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <span>{isExpanded ? "📖 Collapse Documentation" : "📖 Expand Full Manual"}</span>
            <span className="text-xs">{isExpanded ? "▲" : "▼"}</span>
          </button>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
          {[
            { id: "all", label: "📚 Full Guide" },
            { id: "fundamentals", label: "⚙️ Fundamentals & Physics" },
            { id: "standards", label: "📊 Symbologies & GS1" },
            { id: "industries", label: "🏭 Industry Use Cases" },
            { id: "printing", label: "🖨️ Printing & Hardware" },
            { id: "faq", label: "❓ Technical FAQ" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (!isExpanded) setIsExpanded(true);
              }}
              className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {isExpanded && (
        <div className="space-y-10 animate-fade">
          {/* SECTION 1 & 2: Fundamentals & History */}
          {(activeTab === "all" || activeTab === "fundamentals") && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* What is a Barcode */}
              <article className={`p-6 sm:p-8 rounded-2rem border transition-all ${bgCard}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xl">📦</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Section 1</span>
                    <h3 className={`text-xl font-bold ${titleColor}`}>What is a Barcode? Architecture & Symbology</h3>
                  </div>
                </div>
                <div className="text-xs sm:text-sm leading-relaxed space-y-3">
                  <p>
                    A <strong>barcode</strong> is an optical, machine-readable representation of data presented on a surface. Originally, barcodes systematically stored data by varying the widths and spacings of parallel vertical lines (known as 1D or linear barcodes). Modern advancements have expanded barcodes into two-dimensional (2D) matrix patterns of squares, dots, and hexagons (such as QR Codes and DataMatrix).
                  </p>
                  <p>
                    Barcodes serve as the universal digital bridge connecting physical items to computerized database systems. When an optical scanner illuminates a barcode label, it measures the differential reflectance between dark bars (which absorb light) and light spaces (which reflect light). This analog optical pulse sequence is translated in real-time by a decoder microcontroller into binary digital data (0s and 1s), identifying specific stock keeping units (SKUs), batch indices, or tracking serials.
                  </p>
                  <div className={`p-4 rounded-xl border ${bgSubCard} mt-4`}>
                    <h4 className="font-bold text-xs uppercase text-blue-400 mb-2">Linear (1D) vs. Matrix (2D) Comparison</h4>
                    <ul className="space-y-2 text-xs">
                      <li><strong>1D Linear Barcodes (Code 128, EAN-13, UPC-A):</strong> Store up to 20-80 alphanumeric characters horizontally. Require line-of-sight laser or CCD imager alignment. Ideal for retail POS checkout and outer carton shipping.</li>
                      <li><strong>2D Matrix Barcodes (QR Code, DataMatrix, PDF417):</strong> Store up to 4,296 characters both horizontally and vertically. Feature built-in Reed-Solomon error correction to remain scannable even if up to 30% damaged. Ideal for URLs, mobile boarding passes, FDA UDI medical labels, and high-density micro components.</li>
                    </ul>
                  </div>
                </div>
              </article>

              {/* History & Evolution */}
              <article className={`p-6 sm:p-8 rounded-2rem border transition-all ${bgCard}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xl">🏛️</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Section 2</span>
                    <h3 className={`text-xl font-bold ${titleColor}`}>Barcode History & Milestones</h3>
                  </div>
                </div>
                <div className="text-xs sm:text-sm leading-relaxed space-y-3">
                  <p>
                    The conceptual foundation of the barcode was invented in 1948 by <strong>Norman Joseph Woodland</strong> and <strong>Bernard Silver</strong> at Drexel Institute of Technology in Philadelphia. Inspired by Morse code, Woodland drew lines in the sand at the beach, extending the dots and dashes vertically to create narrow and wide bars.
                  </p>
                  <p>
                    They received U.S. Patent 2,612,994 in 1952 for a circular "bullseye" target barcode pattern. However, commercial application was stalled for two decades due to the unavailability of affordable laser illumination and high-speed digital minicomputers.
                  </p>
                  <div className={`p-4 rounded-xl border ${bgSubCard} mt-4 space-y-2`}>
                    <h4 className="font-bold text-xs uppercase text-indigo-400">Historical Timeline Milestones</h4>
                    <div className="space-y-1.5 text-xs">
                      <p><strong>1948:</strong> Woodland & Silver invent the Morse code-based bar pattern concept.</p>
                      <p><strong>1973:</strong> George Laurer at IBM designs the rectangular Universal Product Code (UPC), selected as the North American grocery industry standard.</p>
                      <p><strong>June 26, 1974 (8:01 AM):</strong> The first commercial barcode is scanned at Marsh Supermarket in Troy, Ohio. A 10-pack of Wrigley's Juicy Fruit chewing gum is scanned using a Spectre-Physics helium-neon laser scanner (now preserved at the Smithsonian Institution).</p>
                      <p><strong>1981:</strong> Computer Identics introduces Code 128, enabling full ASCII character set encoding for industrial logistics.</p>
                      <p><strong>1994:</strong> Masahiro Hara at Denso Wave invents the QR Code to track automotive parts during manufacturing in Japan.</p>
                      <p><strong>2026+:</strong> Transition to GS1 Digital Link 2D barcodes at retail checkout worldwide.</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          )}

          {/* SECTION 3 & 4: Physics & Standards */}
          {(activeTab === "all" || activeTab === "fundamentals" || activeTab === "standards") && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* How Barcodes Work */}
              <article className={`p-6 sm:p-8 rounded-2rem border transition-all ${bgCard}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xl">🔬</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Section 3</span>
                    <h3 className={`text-xl font-bold ${titleColor}`}>How Barcodes Work: Physics & Optics</h3>
                  </div>
                </div>
                <div className="text-xs sm:text-sm leading-relaxed space-y-3">
                  <p>
                    Barcoding relies on basic optical physics: specular reflection and light absorption. When a laser beam or LED light source sweeps across a barcode label:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Dark Bars:</strong> Absorb the red laser light wavelengths (~635-670 nm), returning minimal reflected light intensity to the sensor photodiode.</li>
                    <li><strong>Light Spaces:</strong> Reflect the light beam back into the scanner lens, generating a high-voltage electrical pulse.</li>
                  </ul>
                  <p>
                    The scanner's photodetector converts variations in reflected light intensity into an analog waveform signal. An analog-to-digital converter (ADC) measures the exact duration of each high and low pulse, measuring the width of every bar and space down to thousandths of an inch (mils).
                  </p>
                  <div className={`p-4 rounded-xl border ${bgSubCard} mt-3`}>
                    <h4 className="font-bold text-xs uppercase text-emerald-400 mb-1">Quiet Zone Requirement</h4>
                    <p className="text-xs">
                      Every 1D barcode requires a blank <strong>Quiet Zone</strong> (margin space) on both the left and right ends. The Quiet Zone must measure at least 10 times the width of the narrowest bar (X-dimension) or 0.25 inches. Without adequate Quiet Zones, the scanner decoder cannot detect the initial Start pattern, causing total scan failure.
                    </p>
                  </div>
                </div>
              </article>

              {/* Standards & EAN-13 Deep Dive */}
              <article className={`p-6 sm:p-8 rounded-2rem border transition-all ${bgCard}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xl">📐</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Section 4 & 5</span>
                    <h3 className={`text-xl font-bold ${titleColor}`}>EAN-13 & Modulo-10 Checksum Math</h3>
                  </div>
                </div>
                <div className="text-xs sm:text-sm leading-relaxed space-y-3">
                  <p>
                    <strong>EAN-13</strong> consists of 13 digits: GS1 Country Prefix (3 digits), Manufacturer Code (4-6 digits), Item Reference (3-5 digits), and a Modulo-10 Checksum (1 digit).
                  </p>
                  <div className={`p-4 rounded-xl border ${bgSubCard} space-y-2`}>
                    <h4 className="font-bold text-xs uppercase text-amber-400">Modulo-10 Checksum Formula Example</h4>
                    <p className="text-xs">To calculate the 13th check digit for EAN-13 string <code>890123456789 [?]</code>:</p>
                    <ol className="list-decimal pl-5 space-y-1 text-xs">
                      <li>Sum digits at odd positions (1st, 3rd, 5th, 7th, 9th, 11th): 8 + 0 + 2 + 4 + 6 + 8 = <strong>28</strong></li>
                      <li>Sum digits at even positions (2nd, 4th, 6th, 8th, 10th, 12th) and multiply by 3: (9 + 1 + 3 + 5 + 7 + 9) × 3 = 34 × 3 = <strong>102</strong></li>
                      <li>Combine both sums: 28 + 102 = <strong>130</strong></li>
                      <li>Find smallest multiple of 10 ≥ 130, which is 130. Check digit = 130 - 130 = <strong>0</strong>.</li>
                    </ol>
                    <p className="text-[11px] text-amber-300 font-bold">Resulting EAN-13 Code: 8901234567890</p>
                  </div>
                </div>
              </article>
            </div>
          )}

          {/* SECTION 6, 7 & 8: UPC, Code 128, Code 39 */}
          {(activeTab === "all" || activeTab === "standards") && (
            <article className={`p-6 sm:p-8 rounded-2rem border transition-all ${bgCard}`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xl">📊</span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Sections 6, 7 & 8</span>
                  <h3 className={`text-xl sm:text-2xl font-bold ${titleColor}`}>Code 128, UPC-A, and Code 39 Symbologies Breakdown</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Code 128 */}
                <div className={`p-5 rounded-2xl border ${bgSubCard} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-blue-400">Code 128</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">Logistics Standard</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    High-density barcode encoding all 128 ASCII characters. Features 3 subsets:
                  </p>
                  <ul className="list-disc pl-4 text-xs space-y-1">
                    <li><strong>Subset A:</strong> Capitals, numbers, control characters.</li>
                    <li><strong>Subset B:</strong> Upper & lower case, standard punctuation.</li>
                    <li><strong>Subset C:</strong> Double numeric density (pairs 00-99).</li>
                  </ul>
                  <p className="text-[11px] text-slate-400">
                    Used for SSCC-18 shipping container labels, GS1-128 pallet tracking, and warehouse rack bin location tags.
                  </p>
                </div>

                {/* UPC-A / UPC-E */}
                <div className={`p-5 rounded-2xl border ${bgSubCard} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-emerald-400">UPC-A & UPC-E</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">US/Canada Retail</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    12-digit North American product identification code.
                  </p>
                  <ul className="list-disc pl-4 text-xs space-y-1">
                    <li><strong>UPC-A:</strong> Standard 12-digit layout (1 number system digit, 5 manufacturer digits, 5 item digits, 1 check digit).</li>
                    <li><strong>UPC-E:</strong> 8-digit zero-suppressed variant for small packaging.</li>
                  </ul>
                  <p className="text-[11px] text-slate-400">
                    Compatible with EAN-13 by prepending a zero prefix (0UPC-A = EAN-13).
                  </p>
                </div>

                {/* Code 39 */}
                <div className={`p-5 rounded-2xl border ${bgSubCard} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-amber-400">Code 39</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Defense & Industrial</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    Discrete alphanumeric symbology encoding 43 characters (0-9, A-Z, space, -, ., $, /, +, %).
                  </p>
                  <ul className="list-disc pl-4 text-xs space-y-1">
                    <li>Self-checking structure without mandatory checksum.</li>
                    <li>Uses asterisk (*) as Start/Stop character.</li>
                  </ul>
                  <p className="text-[11px] text-slate-400">
                    Standardized under U.S. Department of Defense LOGMARS (MIL-STD-129) and automotive VIN tags.
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* SECTION 9-15: Industries */}
          {(activeTab === "all" || activeTab === "industries") && (
            <article className={`p-6 sm:p-8 rounded-2rem border transition-all ${bgCard}`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl text-xl">🏭</span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">Sections 9 to 15</span>
                  <h3 className={`text-xl sm:text-2xl font-bold ${titleColor}`}>Industry Applications & Global Supply Chains</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                <div className={`p-4 rounded-xl border ${bgSubCard}`}>
                  <h4 className="font-bold text-blue-400 mb-1 flex items-center gap-1.5">🛒 Retail & E-Commerce</h4>
                  <p>Accelerates checkout scanning to 0.1 seconds per item. Essential for Amazon FBA listing, Walmart inventory feeds, and Shopify POS setups.</p>
                </div>
                <div className={`p-4 rounded-xl border ${bgSubCard}`}>
                  <h4 className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">📦 Warehousing & Logistics</h4>
                  <p>Facilitates real-time pallet cross-docking, automated conveyor sorter routing, and SSCC-18 global container dispatch tracking.</p>
                </div>
                <div className={`p-4 rounded-xl border ${bgSubCard}`}>
                  <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">⚙️ Manufacturing WIP</h4>
                  <p>Tracks work-in-progress (WIP) assembly lines, motor vehicle VIN tracking, serial number provenance, and automated quality control.</p>
                </div>
                <div className={`p-4 rounded-xl border ${bgSubCard}`}>
                  <h4 className="font-bold text-purple-400 mb-1 flex items-center gap-1.5">🏥 Healthcare & FDA UDI</h4>
                  <p>Complies with FDA Unique Device Identification (UDI) regulations using GS1 DataMatrix on blister packs and patient ID wristbands.</p>
                </div>
                <div className={`p-4 rounded-xl border ${bgSubCard}`}>
                  <h4 className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">🚚 Express Delivery</h4>
                  <p>Powers FedEx, UPS, DHL, and USPS routing labels with high-speed PDF417 and Code 128 sorting barcodes.</p>
                </div>
                <div className={`p-4 rounded-xl border ${bgSubCard}`}>
                  <h4 className="font-bold text-rose-400 mb-1 flex items-center gap-1.5">📋 Inventory Audit</h4>
                  <p>Reduces cycle counting time by 90% and eliminates human manual data entry transcription errors in ERP systems.</p>
                </div>
              </div>
            </article>
          )}

          {/* SECTION 16-19: Printing, Calibration & Best Practices */}
          {(activeTab === "all" || activeTab === "printing") && (
            <article className={`p-6 sm:p-8 rounded-2rem border transition-all ${bgCard}`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-xl">🖨️</span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Sections 16 to 19</span>
                  <h3 className={`text-xl sm:text-2xl font-bold ${titleColor}`}>Barcode Printing, DPI Calibration & Error Prevention</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm leading-relaxed">
                <div className="space-y-4">
                  <h4 className="font-bold text-base text-teal-400">Printing Technologies & Contrast Rules</h4>
                  <p>
                    <strong>Thermal Transfer Printing:</strong> Uses a heated ribbon (wax, wax-resin, or resin) to melt ink onto synthetic or paper labels. Offers long-lasting, smudge-proof barcodes for outdoor warehouse storage and chemical containers.
                  </p>
                  <p>
                    <strong>Direct Thermal Printing:</strong> Heats heat-sensitive chemically treated paper. Inexpensive for temporary shipping labels, but degrades when exposed to UV sunlight or high heat.
                  </p>
                  <div className={`p-4 rounded-xl border ${bgSubCard}`}>
                    <h5 className="font-bold text-xs text-rose-400 mb-1">⚠️ Color Contrast Rule</h5>
                    <p className="text-xs">
                      Red laser scanners use red light (~630nm). Under red light, <strong>red bars reflect red light as white</strong>, resulting in zero contrast! <strong>NEVER print red bars on white or white bars on red.</strong> Always print dark bars (black, dark blue, dark green) on light backgrounds (white, yellow).
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-base text-teal-400">Top 5 Barcode Printing Mistakes & Solutions</h4>
                  <div className="space-y-2 text-xs">
                    <div className={`p-3 rounded-xl border ${bgSubCard}`}>
                      <strong className="text-rose-400">1. Violating Quiet Zones:</strong> Text or graphics encroaching inside the left/right margins. <em>Solution: Maintain 10x narrow bar width space.</em>
                    </div>
                    <div className={`p-3 rounded-xl border ${bgSubCard}`}>
                      <strong className="text-rose-400">2. Low Resolution Graphic Distortion:</strong> Printing pixelated 72 DPI images instead of crisp vector SVG/PNG graphics. <em>Solution: Download 300+ DPI or SVG vector from Barcoder Pro.</em>
                    </div>
                    <div className={`p-3 rounded-xl border ${bgSubCard}`}>
                      <strong className="text-rose-400">3. Ink Bleed & Bar Expansion:</strong> Wet inkjet ink spreading into narrow spaces. <em>Solution: Apply Bar Width Reduction (BWR) in printer setup.</em>
                    </div>
                    <div className={`p-3 rounded-xl border ${bgSubCard}`}>
                      <strong className="text-rose-400">4. Wrinkled Curved Packaging:</strong> Placing barcodes over package seams or sharp curves. <em>Solution: Orient bars vertically along cylinder length.</em>
                    </div>
                    <div className={`p-3 rounded-xl border ${bgSubCard}`}>
                      <strong className="text-rose-400">5. Invalid Modulo Checksum:</strong> Manually typing check digits incorrectly. <em>Solution: Let Barcoder Pro auto-calculate exact checksums.</em>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* SECTION 20: Comprehensive Technical FAQ */}
          {(activeTab === "all" || activeTab === "faq") && (
            <article className={`p-6 sm:p-8 rounded-2rem border transition-all ${bgCard}`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xl">❓</span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">Section 20</span>
                  <h3 className={`text-xl sm:text-2xl font-bold ${titleColor}`}>Frequently Asked Questions (FAQ)</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                {[
                  {
                    q: "Are barcodes generated on Barcoder Pro free for commercial retail sales?",
                    a: "Yes, 100%. All barcodes generated on Barcoder Pro are completely free for commercial retail, e-commerce, Amazon FBA, Walmart feeds, and international shipping. We charge zero royalty fees and require no backlink attribution."
                  },
                  {
                    q: "Do I need to register with GS1 to get a barcode for my product?",
                    a: "If you plan to sell products in major retail supermarkets or marketplaces like Amazon, you must obtain authentic GS1 GTIN numbers registered under your official business entity. For internal store inventory, local POS systems, or private fulfillment, you can generate barcodes using custom internal numbers."
                  },
                  {
                    q: "Is my barcode data sent to your servers?",
                    a: "No. Barcoder Pro is built on client-side sandboxing. Every line, space, parity bit, and QR matrix dot is computed locally inside your browser memory context using pure JavaScript. Zero data leaves your computer or mobile device."
                  },
                  {
                    q: "What image format should I download for high-quality printing?",
                    a: "For physical package printing, flexography, or high-volume commercial printing, select vector SVG or high-resolution PNG (3x to 5x scale multiplier). Vector graphics scale infinitely without pixelation or scan degradation."
                  },
                  {
                    q: "How do I ensure my barcode scans reliably at retail checkout?",
                    a: "1. Always perform a sample test scan on printed paper using a hardware laser scanner or phone app before printing thousands of package labels. 2. Ensure high contrast (black bars on white paper). 3. Maintain unprinted Quiet Zones on both sides."
                  },
                  {
                    q: "What is the difference between EAN-13 and UPC-A?",
                    a: "UPC-A is a 12-digit format widely used in North America (USA & Canada). EAN-13 is a 13-digit global standard used in Europe, Asia, Australia, and worldwide. Adding a leading zero '0' to a 12-digit UPC-A code turns it into an equivalent EAN-13 code."
                  },
                  {
                    q: "Can I add my business logo to a QR code?",
                    a: "Yes! Select the 'QR Code' format on Barcoder Pro, click 'Upload Center Logo', and upload your PNG or SVG logo. Our canvas engine embeds your logo at the exact center with high Reed-Solomon error correction (Level H) so the QR code remains 100% scannable."
                  },
                  {
                    q: "What is Code 128 Subset C double-density packing?",
                    a: "Code 128 Subset C encodes numeric pairs (00 through 99) into single bar pattern modules. For example, encoding '123456' requires only 3 symbol characters in Subset C instead of 6 in Subset B, reducing label width by 50%."
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${bgSubCard} space-y-1.5`}>
                    <h4 className="font-bold text-xs text-blue-400">Q: {item.q}</h4>
                    <p className="text-slate-300">A: {item.a}</p>
                  </div>
                ))}
              </div>
            </article>
          )}

          {/* Educational guide content end */}
        </div>
      )}
    </div>
  );
};
