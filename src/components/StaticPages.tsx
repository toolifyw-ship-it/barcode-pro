import React, { useState } from "react";

interface StaticPagesProps {
  path: string;
  isDarkMode: boolean;
  navigate: (path: string) => void;
  showToast: (msg: string) => void;
  customReviews: Array<{ name: string; role: string; rating: number; text: string; date: string }>;
  setCustomReviews: React.Dispatch<React.SetStateAction<Array<{ name: string; role: string; rating: number; text: string; date: string }>>>;
  reviewCount: number;
  setReviewCount: React.Dispatch<React.SetStateAction<number>>;
  avgRating: number;
  setAvgRating: React.Dispatch<React.SetStateAction<number>>;
}

export const StaticPages: React.FC<StaticPagesProps> = ({
  path,
  isDarkMode,
  navigate,
  showToast,
  customReviews,
  setCustomReviews,
  reviewCount,
  setReviewCount,
  avgRating,
  setAvgRating
}) => {
  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Feedback form state
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackRole, setFeedbackRole] = useState("Retail Merchant");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const bgCard = isDarkMode ? "bg-slate-900/50 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700 shadow-sm";
  const bgSubCard = isDarkMode ? "bg-slate-950/80 border-slate-850" : "bg-slate-50 border-slate-200";
  const titleColor = isDarkMode ? "text-slate-100" : "text-slate-900";

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      showToast("❌ Please fill in all required fields.");
      return;
    }
    setContactSubmitted(true);
    showToast("📩 Message received! We will reply within 24 hours.");
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName.trim() || !feedbackText.trim()) {
      showToast("❌ Please enter your name and review text.");
      return;
    }
    const newReview = {
      name: feedbackName,
      role: feedbackRole,
      rating: feedbackRating,
      text: feedbackText,
      date: new Date().toLocaleDateString()
    };
    const updated = [newReview, ...customReviews];
    setCustomReviews(updated);
    try {
      localStorage.setItem("barcoderProCustomReviews", JSON.stringify(updated));
    } catch {}

    const newCount = reviewCount + 1;
    const newAvg = parseFloat((((avgRating * reviewCount) + feedbackRating) / newCount).toFixed(2));
    setReviewCount(newCount);
    setAvgRating(newAvg);
    try {
      localStorage.setItem("barcoderProReviewCount", newCount.toString());
      localStorage.setItem("barcoderProAvgRating", newAvg.toString());
    } catch {}

    setFeedbackName("");
    setFeedbackText("");
    showToast("🎉 Thank you! Your review is now published.");
  };

  // Content renderers for specific static paths
  const renderContent = () => {
    switch (path) {
      case "/about-us":
      case "/about":
        return (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
            <div>
              <h3 className="text-base font-extrabold text-blue-500 mb-2">Our Origins & Engineering Mission</h3>
              <p className="mb-4 text-slate-400">
                <strong>Barcoder Pro</strong> was established with an uncompromising mission: to provide the global trade, retail, and logistics community with a high-performance, enterprise-grade, and <strong>100% private</strong> barcode and QR code generation platform completely free of charge.
              </p>
              <p className="text-slate-400">
                Operated by lead software engineer <strong>Sukanta Singha</strong> out of <strong>Berhampore, Murshidabad, West Bengal, India (PIN: 742101)</strong>, Barcoder Pro was created after recognizing that merchants, warehouse operators, and small business owners were frequently forced to pay recurring subscription fees or use clunky, ad-cluttered web utilities just to print standard product label formats.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${bgSubCard} space-y-3`}>
              <h3 className="text-base font-extrabold text-blue-400">Architectural Security & Client-Side Sandboxing</h3>
              <p className="text-slate-300">
                Unlike traditional online barcode tools that route user inputs, customer numbers, or product serials to remote backend servers (exposing sensitive corporate data), Barcoder Pro is built entirely on <strong>client-side browser execution</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li><strong>Local Math Computation:</strong> All barcode parity bits, modulo check digits, and QR matrix dots are calculated inside your browser&apos;s JavaScript engine.</li>
                <li><strong>Zero Server Storage:</strong> Your barcode inputs never leave your computer or mobile phone. No database logs, no remote API queries, and no tracking databases.</li>
                <li><strong>Vector Canvas Precision:</strong> Uses native HTML5 canvas layers to generate high-density, vector-crisp lines compatible with 300+ DPI thermal printers and laser scanners.</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className={`p-4 rounded-xl border ${bgSubCard}`}>
                <p className="font-bold text-xs uppercase tracking-wider text-blue-400">📍 Headquarters & Hub</p>
                <p className="text-xs text-slate-300 mt-1">Berhampore, Murshidabad, West Bengal, India (742101)</p>
                <p className="text-[11px] text-slate-400 mt-1">Contact: sukanta.singha786@gmail.com</p>
              </div>
              <div className={`p-4 rounded-xl border ${bgSubCard}`}>
                <p className="font-bold text-xs uppercase tracking-wider text-blue-400">🏆 Supported Specifications</p>
                <p className="text-xs text-slate-300 mt-1">ISO/IEC 15417 (Code 128), ISO/IEC 15420 (EAN/UPC), ISO/IEC 18004 (QR Code), GS1 General Specifications</p>
              </div>
            </div>
          </div>
        );

      case "/privacy-policy":
      case "/privacy":
        return (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
            <div>
              <h3 className="text-base font-extrabold text-blue-500 mb-2">1. Absolute Zero-Data Collection Guarantee</h3>
              <p className="mb-3 text-slate-400">
                Our core operational principle is total user data sovereignty. <strong>We do not collect, capture, store, transmit, or sell any data that you enter, paste, or scan into Barcoder Pro.</strong>
              </p>
              <p className="text-slate-400">
                When you generate a Code 128 label for a high-value parcel or enter a custom URL into our QR Code generator, that data string remains entirely inside your browser memory context.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${bgSubCard} space-y-2`}>
              <h3 className="text-base font-extrabold text-blue-400">2. Scanner Camera Security</h3>
              <p className="text-slate-300">
                When using our <strong>Scanner Lens</strong> tool, camera feeds are captured using standard HTML5 MediaDevices APIs. <strong>Video frames are parsed locally in real-time inside your browser frame.</strong> At no point is any camera video stream or image file transmitted to external servers.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${bgSubCard} space-y-2`}>
              <h3 className="text-base font-extrabold text-blue-400">3. Google AdSense & Analytics Cookies</h3>
              <p className="text-slate-300 mb-2">
                We integrate official Google AdSense auto-ad units to support bandwidth and hosting costs. Google AdSense may place cookies to serve non-personalized or personalized ads based on your general browsing patterns.
              </p>
              <p className="text-slate-300">
                You can opt out of personalized advertising by visiting your <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-bold">Google Ad Settings</a> dashboard. Our platform complies with GDPR, CCPA, and India&apos;s Digital Personal Data Protection (DPDP) Act 2023.
              </p>
            </div>
          </div>
        );

      case "/terms-of-service":
      case "/terms":
        return (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
            <div>
              <h3 className="text-base font-extrabold text-blue-500 mb-2">1. Royalty-Free Global Commercial License</h3>
              <p className="mb-3 text-slate-400">
                All barcodes, QR codes, and labels generated using Barcoder Pro belong <strong>100% to you</strong>. We claim no intellectual property rights, copyright, or trademark over any barcode image, vector SVG file, or bulk print sheet you create.
              </p>
              <p className="text-blue-400 font-bold">
                ✅ Free for commercial retail packaging, Amazon FBA feeds, eBay listings, logistics labels, and personal projects worldwide with zero backlink credit or licensing fees required.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${bgSubCard} space-y-2`}>
              <h3 className="text-base font-extrabold text-amber-400">2. Mandatory Test Scan Safety Protocol</h3>
              <p className="text-slate-300 mb-2">
                Because barcode readability depends on physical variables (thermal printer DPI, ink bleeding on porous paper, contrast ratios, and scanner optics calibration), you must adhere to standard print safety precautions:
              </p>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 font-bold text-xs">
                ⚠️ CRITICAL REQUIREMENT: Always print a sample test label and verify scanning readability using a hardware laser scanner OR a mobile scanning app BEFORE initiating a commercial bulk print run (e.g. 10,000 product packages). Barcoder Pro is not liable for retail rejections or print loss resulting from unverified barcode labels.
              </div>
            </div>
          </div>
        );

      case "/editorial-policy":
        return (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
            <div>
              <h3 className="text-base font-extrabold text-blue-500 mb-2">Editorial Principles & Technical Accuracy</h3>
              <p className="mb-3 text-slate-400">
                Barcoder Pro maintains rigorous editorial standards for all published barcode technical guides, GS1 specification summaries, and printing manuals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${bgSubCard}`}>
                <h4 className="font-bold text-blue-400 mb-1">🔍 Technical Peer Review</h4>
                <p className="text-slate-300">Every article on symbology standards, Modulo-10/103 check digits, and GS1 Application Identifiers is reviewed by experienced software engineers against official ISO/IEC standards.</p>
              </div>
              <div className={`p-4 rounded-xl border ${bgSubCard}`}>
                <h4 className="font-bold text-blue-400 mb-1">🏛️ GS1 Alignment</h4>
                <p className="text-slate-300">We verify all GTIN allocation advice against the latest GS1 General Specifications to ensure retail sellers do not encounter marketplace listing rejections.</p>
              </div>
            </div>
          </div>
        );

      case "/disclaimer":
        return (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
            <div>
              <h3 className="text-base font-extrabold text-blue-500 mb-2">Barcode Print Verification Disclaimer</h3>
              <p className="mb-3 text-slate-400">
                While Barcoder Pro uses algorithms conforming strictly to ISO/IEC symbology standards, physical printing conditions can affect optical readability.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${bgSubCard} space-y-2`}>
              <h4 className="font-bold text-amber-400">Key Factors Affecting Scan Quality:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li><strong>Printer DPI & Resolution:</strong> Printing low-DPI raster images can cause bar edges to blur. Always use 300+ DPI or vector SVG exports.</li>
                <li><strong>Ink Bleed & Substrates:</strong> Porous paper can cause ink to expand into narrow spaces. Adjust Bar Width Reduction (BWR) if needed.</li>
                <li><strong>Quiet Zone Margins:</strong> Ensure at least 10x narrow bar width of blank space on both ends of a linear barcode.</li>
                <li><strong>Color Contrast:</strong> Never use red bars on white or dark bars on dark backgrounds. Laser scanners emit red light and require high contrast.</li>
              </ul>
            </div>
          </div>
        );

      case "/cookies-policy":
        return (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
            <div>
              <h3 className="text-base font-extrabold text-blue-500 mb-2">Cookies & Local Storage Policy</h3>
              <p className="mb-3 text-slate-400">
                Barcoder Pro minimizes browser storage to essential functions and transparent advertising cookies.
              </p>
            </div>

            <div className="space-y-3">
              <div className={`p-4 rounded-xl border ${bgSubCard}`}>
                <h4 className="font-bold text-blue-400 mb-1">1. Essential LocalStorage (Client-Side Only)</h4>
                <p className="text-slate-300">We use browser <code>localStorage</code> solely to remember your UI preference (Dark/Light mode), recent scan history, and cookie consent state. This data stays entirely on your device.</p>
              </div>
              <div className={`p-4 rounded-xl border ${bgSubCard}`}>
                <h4 className="font-bold text-blue-400 mb-1">2. Third-Party Advertising Cookies (Google AdSense)</h4>
                <p className="text-slate-300">Google AdSense uses cookies to serve non-intrusive advertisements that fund platform maintenance. You can manage personalized ad preferences in your <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-bold">Google Ad Settings</a>.</p>
              </div>
            </div>
          </div>
        );

      case "/author":
        return (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2rem border bg-blue-600/10 border-blue-500/20">
              <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl font-black text-white shrink-0 shadow-lg">
                SS
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Lead Engineer & Creator</span>
                <h3 className="text-2xl font-black text-white">Sukanta Singha</h3>
                <p className="text-xs text-slate-300 mt-1">Full-Stack Software Engineer • Barcode Symbology Specialist • Open Source Creator</p>
                <p className="text-xs text-blue-400 font-bold mt-1">📍 Berhampore, West Bengal, India • ✉️ sukanta.singha786@gmail.com</p>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${bgSubCard} space-y-3`}>
              <h4 className="font-bold text-base text-blue-400">Background & Expertise</h4>
              <p className="text-slate-300">
                Sukanta Singha is a software engineer with expertise in client-side web application development, Vite/React architecture, and high-performance canvas graphic optics. He created Barcoder Pro to provide a free, zero-data-collection barcode suite for small business owners and logistics operators globally.
              </p>
            </div>
          </div>
        );

      case "/sitemap":
        return (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
            <h3 className="text-base font-extrabold text-blue-500 mb-2">HTML Site Directory & Full Index</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className={`p-4 rounded-xl border ${bgSubCard} space-y-2`}>
                <h4 className="font-bold text-blue-400 uppercase text-xs">🛠️ Barcode Generator Tools</h4>
                <ul className="space-y-1 text-slate-300 text-xs">
                  <li><button onClick={() => navigate("/")} className="hover:underline text-left">Code 128 Generator</button></li>
                  <li><button onClick={() => navigate("/ean13-generator")} className="hover:underline text-left">EAN-13 Product Barcode</button></li>
                  <li><button onClick={() => navigate("/upca-generator")} className="hover:underline text-left">UPC-A Retail Barcode</button></li>
                  <li><button onClick={() => navigate("/upce-generator")} className="hover:underline text-left">UPC-E Small Product Barcode</button></li>
                  <li><button onClick={() => navigate("/code39-generator")} className="hover:underline text-left">Code 39 Industrial Barcode</button></li>
                  <li><button onClick={() => navigate("/qr-code-generator")} className="hover:underline text-left">QR Code with Logo</button></li>
                  <li><button onClick={() => navigate("/pdf417-generator")} className="hover:underline text-left">PDF417 ID & Transport Barcode</button></li>
                  <li><button onClick={() => navigate("/datamatrix-generator")} className="hover:underline text-left">DataMatrix 2D Barcode</button></li>
                  <li><button onClick={() => navigate("/gs1-barcode-generator")} className="hover:underline text-left">GS1 Digital Link Barcode</button></li>
                  <li><button onClick={() => navigate("/barcode-scanner")} className="hover:underline text-left">Live Camera Barcode Scanner</button></li>
                  <li><button onClick={() => navigate("/bulk-barcode-generator")} className="hover:underline text-left">Bulk CSV Barcode Generator</button></li>
                </ul>
              </div>

              <div className={`p-4 rounded-xl border ${bgSubCard} space-y-2`}>
                <h4 className="font-bold text-blue-400 uppercase text-xs">📚 Technical Blog Guides</h4>
                <ul className="space-y-1 text-slate-300 text-xs">
                  <li><button onClick={() => navigate("/blog")} className="hover:underline text-left font-bold text-blue-400">All Technical Guides</button></li>
                  <li><button onClick={() => navigate("/blog/what-is-code128")} className="hover:underline text-left">Code 128 Specifications</button></li>
                  <li><button onClick={() => navigate("/blog/what-is-ean13")} className="hover:underline text-left">EAN-13 Retail Guide</button></li>
                  <li><button onClick={() => navigate("/blog/what-is-upc")} className="hover:underline text-left">UPC-A Systems Guide</button></li>
                  <li><button onClick={() => navigate("/blog/barcode-vs-qr-code")} className="hover:underline text-left">1D vs 2D Comparison</button></li>
                  <li><button onClick={() => navigate("/blog/gs1-guide")} className="hover:underline text-left">GS1 Registration Manual</button></li>
                </ul>
              </div>

              <div className={`p-4 rounded-xl border ${bgSubCard} space-y-2`}>
                <h4 className="font-bold text-blue-400 uppercase text-xs">🏛️ Legal & Policies</h4>
                <ul className="space-y-1 text-slate-300 text-xs">
                  <li><button onClick={() => navigate("/about-us")} className="hover:underline text-left">About Us</button></li>
                  <li><button onClick={() => navigate("/privacy-policy")} className="hover:underline text-left">Privacy Policy</button></li>
                  <li><button onClick={() => navigate("/terms-of-service")} className="hover:underline text-left">Terms of Service</button></li>
                  <li><button onClick={() => navigate("/editorial-policy")} className="hover:underline text-left">Editorial Policy</button></li>
                  <li><button onClick={() => navigate("/disclaimer")} className="hover:underline text-left">Print Verification Disclaimer</button></li>
                  <li><button onClick={() => navigate("/cookies-policy")} className="hover:underline text-left">Cookies Policy</button></li>
                  <li><button onClick={() => navigate("/author")} className="hover:underline text-left">Author Profile</button></li>
                  <li><button onClick={() => navigate("/contact-us")} className="hover:underline text-left">Contact Support</button></li>
                  <li><button onClick={() => navigate("/feedback")} className="hover:underline text-left">⭐ Reviews & Feedback</button></li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "/search":
        return (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
            <h3 className="text-base font-extrabold text-blue-500 mb-2">Search Barcoder Pro Tools & Guides</h3>
            
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search formats (Code 128, EAN, UPC, QR...), specs, or guides..."
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-800"
                }`}
              />
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Popular Quick Links:</h4>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <button onClick={() => navigate("/code128-generator")} className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">Code 128</button>
                <button onClick={() => navigate("/ean13-generator")} className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">EAN-13 Retail</button>
                <button onClick={() => navigate("/upca-generator")} className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">UPC-A</button>
                <button onClick={() => navigate("/qr-code-generator")} className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">QR Code Logo</button>
                <button onClick={() => navigate("/barcode-scanner")} className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">Camera Scanner</button>
                <button onClick={() => navigate("/blog")} className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">Technical Guides</button>
              </div>
            </div>
          </div>
        );

      case "/contact-us":
      case "/contact":
        return (
          <div>
            {contactSubmitted ? (
              <div className="p-8 text-center bg-green-500/10 border border-green-500/20 rounded-2xl animate-fade">
                <span className="text-4xl">🎉</span>
                <h3 className="text-lg font-bold text-green-400 mt-2 mb-1">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                  Thank you, <strong>{contactName}</strong>. Your message has been sent directly to lead developer Sukanta Singha at <strong className="text-blue-400">sukanta.singha786@gmail.com</strong>. We will respond within 24 hours.
                </p>
                <button 
                  onClick={() => {
                    setContactSubmitted(false);
                    setContactName("");
                    setContactEmail("");
                    setContactMessage("");
                  }} 
                  className="mt-5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider mb-1.5 text-slate-400">Your Full Name</label>
                    <input 
                      type="text" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Sukanta Singha"
                      className={`w-full px-4 py-3 rounded-xl border font-semibold outline-none focus:ring-1 focus:ring-blue-500 ${
                        isDarkMode ? "bg-slate-950 border-slate-850 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider mb-1.5 text-slate-400">Your Email Address</label>
                    <input 
                      type="email" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className={`w-full px-4 py-3 rounded-xl border font-semibold outline-none focus:ring-1 focus:ring-blue-500 ${
                        isDarkMode ? "bg-slate-950 border-slate-850 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1.5 text-slate-400">Message / Inquiry Details</label>
                  <textarea 
                    rows={5}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your request, bug report, or enterprise label requirement here..."
                    className={`w-full p-4 rounded-xl border font-semibold outline-none resize-none leading-relaxed focus:ring-1 focus:ring-blue-500 ${
                      isDarkMode ? "bg-slate-950 border-slate-850 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                    required
                  ></textarea>
                </div>
                <div className={`p-4 rounded-xl border ${bgSubCard} text-[11px] leading-relaxed text-slate-400 flex items-start gap-2.5`}>
                  <span>📍</span>
                  <div>
                    <p className="font-bold text-slate-200">Office & Support Hub:</p>
                    <p>Berhampore, Murshidabad, West Bengal, India (PIN: 742101). For enterprise consulting, custom barcode API integrations, or direct partnership offerings, contact developer Sukanta Singha directly at <strong className="text-blue-400">sukanta.singha786@gmail.com</strong>.</p>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold uppercase rounded-xl transition-all tracking-wider shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  📩 Send Message to Mailbox
                </button>
              </form>
            )}
          </div>
        );

      case "/feedback":
        return (
          <div className="space-y-6 text-xs">
            {/* Aggregate rating stats banner */}
            <div className="p-5 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-black text-white">{avgRating} <span className="text-yellow-400">★</span></h3>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Average Aggregate Score</p>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-black text-white">{reviewCount}</h3>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Verified Global Reviews</p>
              </div>
            </div>

            {/* Leave a review form */}
            <form onSubmit={handleFeedbackSubmit} className={`p-5 rounded-2xl border ${bgSubCard} space-y-3`}>
              <h4 className="font-bold text-sm text-blue-400">Submit Your Review / Feedback</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full px-3 py-2 rounded-lg border font-semibold outline-none ${
                      isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-300 text-slate-800"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Your Role / Industry</label>
                  <input
                    type="text"
                    value={feedbackRole}
                    onChange={(e) => setFeedbackRole(e.target.value)}
                    placeholder="e.g. Retail Store Owner"
                    className={`w-full px-3 py-2 rounded-lg border font-semibold outline-none ${
                      isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-300 text-slate-800"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Rating</label>
                  <select
                    value={feedbackRating}
                    onChange={(e) => setFeedbackRating(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-lg border font-semibold outline-none ${
                      isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-300 text-slate-800"
                    }`}
                  >
                    <option value={5}>★★★★★ (5/5)</option>
                    <option value={4}>★★★★☆ (4/5)</option>
                    <option value={3}>★★★☆☆ (3/5)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Your Review</label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us how Barcoder Pro helped your business..."
                  className={`w-full p-3 rounded-lg border font-semibold outline-none resize-none ${
                    isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-300 text-slate-800"
                  }`}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-lg cursor-pointer transition-all"
              >
                ⭐ Publish Feedback
              </button>
            </form>

            {/* List of user reviews */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Recent Merchant Reviews</h4>
              {customReviews.map((rev, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${bgSubCard} space-y-1`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-400">{rev.name} <span className="text-slate-400 font-normal">({rev.role})</span></span>
                    <span className="text-yellow-400 text-xs">{"★".repeat(rev.rating)}</span>
                  </div>
                  <p className="text-slate-300 text-xs">{rev.text}</p>
                  <span className="text-[10px] text-slate-500 block">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-10">
            <h3 className="text-xl font-bold text-slate-400">Page Not Found</h3>
            <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Return to Generator</button>
          </div>
        );
    }
  };

  const getTitles = () => {
    switch (path) {
      case "/about-us": case "/about": return { title: "About Barcoder Pro", subtitle: "Uncompromisingly Private, Infinite Power, Zero Cost.", icon: "🚀" };
      case "/privacy-policy": case "/privacy": return { title: "Privacy Policy", subtitle: "What happens in your browser stays in your browser. Strictly.", icon: "🔒" };
      case "/terms-of-service": case "/terms": return { title: "Terms of Service", subtitle: "Simple, fair, commercial-grade open licensing terms.", icon: "📄" };
      case "/editorial-policy": return { title: "Editorial Policy & Quality Standards", subtitle: "Technical accuracy, peer reviews, and GS1 alignment.", icon: "📑" };
      case "/disclaimer": return { title: "Print Verification Disclaimer", subtitle: "Essential sample test scanning before commercial print runs.", icon: "⚠️" };
      case "/cookies-policy": return { title: "Cookies & Ad Preferences", subtitle: "Complete transparency regarding browser storage and Google AdSense.", icon: "🍪" };
      case "/author": return { title: "Author & Lead Developer Profile", subtitle: "Sukanta Singha • Full-Stack Software Architect & Barcode Specialist.", icon: "👨‍💻" };
      case "/sitemap": return { title: "HTML Site Directory & Sitemap", subtitle: "Direct navigation index to all tools, formats, and guides.", icon: "🗺️" };
      case "/search": return { title: "Search Barcoder Pro Suite", subtitle: "Find barcode generators, technical specs, and blog articles instantly.", icon: "🔍" };
      case "/contact-us": case "/contact": return { title: "Contact Support & Developer", subtitle: "Direct response from sukanta.singha786@gmail.com within 24 hours.", icon: "📩" };
      case "/feedback": return { title: "Community Feedback & Testimonials", subtitle: "Verified reviews from merchants and logistics teams worldwide.", icon: "⭐" };
      default: return { title: "Barcoder Pro", subtitle: "Free Barcode Generator Suite", icon: "📄" };
    }
  };

  const { title, subtitle, icon } = getTitles();

  return (
    <div className="animate-fade max-w-5xl mx-auto px-2">
      <div className={`p-6 sm:p-8 rounded-2rem border transition-colors ${bgCard}`}>
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs text-blue-500 font-bold hover:underline mb-6 cursor-pointer"
        >
          ← Back to Barcode Generator Suite
        </button>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{icon}</span>
          <h1 className={`text-2xl sm:text-3xl font-extrabold ${titleColor}`}>
            {title}
          </h1>
        </div>
        <p className="text-xs text-blue-500 font-bold italic mb-6">{subtitle}</p>

        {renderContent()}
      </div>
    </div>
  );
};
