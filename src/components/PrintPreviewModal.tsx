import React, { useState, useEffect, useRef, useCallback } from "react";
import jsPDF from "jspdf";

export interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  barcodeCanvas: HTMLCanvasElement | null;
  currentType: string;
  userInput: string;
  displayValue: boolean;
  foregroundColor: string;
  backgroundColor: string;
  showToast: (msg: string) => void;
}

interface GridPreset {
  id: string;
  name: string;
  cols: number;
  rows: number;
  labelWidthMm: number;
  labelHeightMm: number;
  marginMm: number;
  gapMm: number;
}

const GRID_PRESETS: GridPreset[] = [
  { id: "standard_24", name: "Standard 24-Up (3x8 Grid)", cols: 3, rows: 8, labelWidthMm: 64, labelHeightMm: 33.9, marginMm: 10, gapMm: 2 },
  { id: "avery_5160", name: "Avery 5160 (3x10 Grid, 30 Labels)", cols: 3, rows: 10, labelWidthMm: 66.7, labelHeightMm: 25.4, marginMm: 12, gapMm: 3 },
  { id: "large_10", name: "Large Shipping (2x5 Grid, 10 Labels)", cols: 2, rows: 5, labelWidthMm: 101.6, labelHeightMm: 50.8, marginMm: 12, gapMm: 4 },
  { id: "small_40", name: "Small Stickers (4x10 Grid, 40 Labels)", cols: 4, rows: 10, labelWidthMm: 45, labelHeightMm: 25, marginMm: 10, gapMm: 2 },
  { id: "retail_14", name: "Retail Shelf (2x7 Grid, 14 Labels)", cols: 2, rows: 7, labelWidthMm: 95, labelHeightMm: 38, marginMm: 12, gapMm: 3 },
  { id: "single_center", name: "Single Large Center (1x1 Inspection)", cols: 1, rows: 1, labelWidthMm: 180, labelHeightMm: 100, marginMm: 20, gapMm: 0 },
  { id: "custom", name: "Custom Manual Grid Layout", cols: 3, rows: 8, labelWidthMm: 64, labelHeightMm: 34, marginMm: 10, gapMm: 2 },
];

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  barcodeCanvas,
  currentType,
  userInput,
  displayValue,
  foregroundColor,
  backgroundColor,
  showToast,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("standard_24");
  const [cols, setCols] = useState<number>(3);
  const [rows, setRows] = useState<number>(8);
  const [copies, setCopies] = useState<number>(24);
  const [showGridLines, setShowGridLines] = useState<boolean>(true);
  const [showMargins, setShowMargins] = useState<boolean>(true);
  const [showHumanText, setShowHumanText] = useState<boolean>(displayValue);
  const [zoomScale, setZoomScale] = useState<number>(0.65);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // A4 Dimension Constants at 150 DPI (suitable for responsive preview canvas)
  // A4 = 210mm x 297mm. At 150 DPI: 1mm ≈ 5.9055 px
  const A4_WIDTH_PX = 1240;
  const A4_HEIGHT_PX = 1754;

  const totalCells = cols * rows;

  const applyPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = GRID_PRESETS.find((p) => p.id === presetId);
    if (preset && presetId !== "custom") {
      setCols(preset.cols);
      setRows(preset.rows);
      setCopies(preset.cols * preset.rows);
    }
  };

  const drawA4GridCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high-res canvas buffer
    canvas.width = A4_WIDTH_PX;
    canvas.height = A4_HEIGHT_PX;

    // 1. Draw Clean White A4 Sheet Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, A4_WIDTH_PX, A4_HEIGHT_PX);

    // 2. Margins (10mm ≈ 59px default)
    const marginPx = Math.round(A4_WIDTH_PX * 0.05); // ~62px
    const printableWidth = A4_WIDTH_PX - marginPx * 2;
    const printableHeight = A4_HEIGHT_PX - marginPx * 2;

    if (showMargins) {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.35)"; // subtle blue margin guide
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(marginPx, marginPx, printableWidth, printableHeight);
      ctx.setLineDash([]);

      // Top header annotation
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
      ctx.fillText(`A4 Sheet Grid: ${cols} cols × ${rows} rows • Printable Area: 210 × 297 mm • Copies: ${copies}/${totalCells}`, marginPx + 4, marginPx - 16);
    }

    // 3. Grid Cell Dimensions
    const gapPx = cols > 1 ? 14 : 0;
    const cellWidth = (printableWidth - gapPx * (cols - 1)) / cols;
    const cellHeight = (printableHeight - gapPx * (rows - 1)) / rows;

    // Check if barcode source canvas is ready
    let barcodeImg: HTMLImageElement | null = null;
    if (barcodeCanvas) {
      try {
        const dataUrl = barcodeCanvas.toDataURL("image/png");
        barcodeImg = new Image();
        barcodeImg.src = dataUrl;
      } catch (err) {
        console.warn("Barcode canvas image extraction error:", err);
      }
    }

    const renderCells = () => {
      let cellIndex = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = marginPx + c * (cellWidth + gapPx);
          const y = marginPx + r * (cellHeight + gapPx);

          // Draw label outline / sticker perforation cut lines
          if (showGridLines) {
            ctx.strokeStyle = "#cbd5e1";
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(x, y, cellWidth, cellHeight);
            ctx.setLineDash([]);
          }

          // If this cell has a barcode copy
          if (cellIndex < copies) {
            // Inner label padding
            const padX = Math.round(cellWidth * 0.06);
            const padY = Math.round(cellHeight * 0.08);
            const contentWidth = cellWidth - padX * 2;
            const contentHeight = cellHeight - padY * 2;

            if (barcodeImg && barcodeImg.complete && barcodeImg.naturalWidth > 0) {
              // Calculate aspect-ratio fit for the barcode
              const imgAspect = barcodeImg.naturalWidth / barcodeImg.naturalHeight;
              let drawW = contentWidth;
              let drawH = drawW / imgAspect;

              const maxAllowedH = showHumanText ? contentHeight - 20 : contentHeight;
              if (drawH > maxAllowedH) {
                drawH = maxAllowedH;
                drawW = drawH * imgAspect;
              }

              const drawX = x + padX + (contentWidth - drawW) / 2;
              const drawY = y + padY + (maxAllowedH - drawH) / 2;

              ctx.drawImage(barcodeImg, drawX, drawY, drawW, drawH);

              // Draw optional human-readable text code under barcode if enabled
              if (showHumanText) {
                ctx.fillStyle = foregroundColor || "#0f172a";
                ctx.font = `bold ${Math.max(11, Math.min(16, Math.round(cellHeight * 0.12)))}px 'JetBrains Mono', monospace`;
                ctx.textAlign = "center";
                ctx.fillText(userInput || "1234567890", x + cellWidth / 2, y + cellHeight - padY + 2);
              }
            } else {
              // Fallback placeholder rendering
              ctx.fillStyle = "#94a3b8";
              ctx.font = "bold 12px monospace";
              ctx.textAlign = "center";
              ctx.fillText(`[ ${currentType}: ${userInput} ]`, x + cellWidth / 2, y + cellHeight / 2);
            }
          } else {
            // Empty sticker indicator
            ctx.fillStyle = "#f8fafc";
            ctx.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);
            ctx.fillStyle = "#cbd5e1";
            ctx.font = "10px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`Empty #${cellIndex + 1}`, x + cellWidth / 2, y + cellHeight / 2);
          }

          cellIndex++;
        }
      }
    };

    if (barcodeImg) {
      if (barcodeImg.complete) {
        renderCells();
      } else {
        barcodeImg.onload = () => {
          renderCells();
        };
      }
    } else {
      renderCells();
    }
  }, [A4_WIDTH_PX, A4_HEIGHT_PX, barcodeCanvas, cols, rows, copies, showGridLines, showMargins, showHumanText, totalCells, foregroundColor, userInput, currentType]);

  useEffect(() => {
    if (isOpen) {
      // Small timeout to ensure DOM & barcode canvas are synced
      const t = setTimeout(() => {
        drawA4GridCanvas();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [isOpen, drawA4GridCanvas]);

  // Handle direct browser print for standard A4
  const handlePrintA4 = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("⚠️ Pop-up blocked! Allow pop-ups to print A4 sheet.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>A4 Print Preview - ${currentType} (${copies} Labels)</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            img {
              width: 210mm;
              height: 297mm;
              display: block;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="A4 Barcode Sheet" onload="window.focus(); window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
    showToast("🖨️ Opening A4 Print Dialog...");
  };

  // Download high-resolution PNG of the A4 sheet
  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `A4_Sheet_${currentType}_${cols}x${rows}_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("✅ Downloaded high-resolution A4 Sheet PNG!");
    } catch {
      showToast("❌ Could not download A4 PNG.");
    }
  };

  // Download printable A4 PDF using jsPDF
  const handleDownloadPdf = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsExporting(true);
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297);
      pdf.save(`A4_Labels_${currentType}_${cols}x${rows}.pdf`);
      showToast("✅ Downloaded ready-to-print A4 PDF document!");
    } catch (err) {
      console.error(err);
      showToast("❌ Could not generate A4 PDF document.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-6xl max-h-[94vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className={`px-4 sm:px-6 py-3.5 border-b flex items-center justify-between gap-3 shrink-0 ${
          isDarkMode ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-slate-50"
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
              👁️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">A4 Sheet Print Preview</h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  Canvas Grid • 210 × 297 mm
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Inspect how your barcodes align on standard A4 sticker paper before sending to physical printer.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 font-bold transition-all cursor-pointer shrink-0"
            aria-label="Close Print Preview"
          >
            ✕
          </button>
        </div>

        {/* MODAL BODY (Sidebar Controls + Canvas Preview Stage) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT CONTROLS SIDEBAR (lg: 4 cols) */}
          <div className={`lg:col-span-4 p-4 sm:p-5 overflow-y-auto space-y-4 border-b lg:border-b-0 lg:border-r ${
            isDarkMode ? "border-slate-800 bg-slate-900/30" : "border-slate-200 bg-slate-50/50"
          }`}>
            {/* Preset Selector */}
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-300">
                A4 Label Template Preset
              </label>
              <select
                value={selectedPresetId}
                onChange={(e) => applyPreset(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold outline-none transition-all cursor-pointer ${
                  isDarkMode ? "bg-slate-900 border-slate-700 text-white focus:border-blue-500" : "bg-white border-slate-300 text-slate-900 focus:border-blue-600"
                }`}
              >
                {GRID_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid Dimensions */}
            <div className={`p-3 rounded-2xl border space-y-3 ${
              isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  Grid Columns & Rows
                </span>
                {selectedPresetId !== "custom" && (
                  <button
                    onClick={() => setSelectedPresetId("custom")}
                    className="text-[10px] font-bold text-indigo-400 hover:underline cursor-pointer"
                  >
                    Custom Grid
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Columns</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={cols}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(8, parseInt(e.target.value) || 1));
                      setCols(val);
                      setSelectedPresetId("custom");
                    }}
                    className={`w-full px-3 py-1.5 rounded-xl border text-xs font-bold font-mono outline-none ${
                      isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Rows</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={rows}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(15, parseInt(e.target.value) || 1));
                      setRows(val);
                      setSelectedPresetId("custom");
                    }}
                    className={`w-full px-3 py-1.5 rounded-xl border text-xs font-bold font-mono outline-none ${
                      isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              {/* Total Copies Slider */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                  <span className="text-slate-400">Barcode Copies</span>
                  <span className="text-blue-400 font-mono">{copies} / {totalCells} Labels</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={totalCells}
                  value={copies}
                  onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Visual Guides Toggles */}
            <div className={`p-3 rounded-2xl border space-y-2.5 ${
              isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Visual Guides & Elements
              </span>

              <label className="flex items-center justify-between text-xs font-semibold cursor-pointer">
                <span>Show Label Perforation Lines</span>
                <input
                  type="checkbox"
                  checked={showGridLines}
                  onChange={(e) => setShowGridLines(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold cursor-pointer">
                <span>Show Printable Margin Guides</span>
                <input
                  type="checkbox"
                  checked={showMargins}
                  onChange={(e) => setShowMargins(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold cursor-pointer">
                <span>Show Human-Readable Code Text</span>
                <input
                  type="checkbox"
                  checked={showHumanText}
                  onChange={(e) => setShowHumanText(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                />
              </label>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handlePrintA4}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 active:scale-95 transition-all cursor-pointer min-h-[44px]"
              >
                <span>🖨️</span>
                <span>Print A4 Sheet Now</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isExporting}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
                >
                  <span>📄</span>
                  <span>Export PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
                >
                  <span>🖼️</span>
                  <span>Save PNG</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT CANVAS PREVIEW STAGE (lg: 8 cols) */}
          <div className="lg:col-span-8 p-3 sm:p-6 flex flex-col items-center justify-start bg-slate-900/90 overflow-y-auto relative min-h-[400px]">
            {/* Zoom & View Controls Toolbar */}
            <div className="sticky top-0 z-10 mb-4 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 flex items-center gap-2 shadow-lg">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Zoom</span>
              <button
                type="button"
                onClick={() => setZoomScale((z) => Math.max(0.35, z - 0.1))}
                className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                title="Zoom Out"
              >
                -
              </button>
              <span className="text-xs font-mono font-bold text-blue-400 min-w-[42px] text-center">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomScale((z) => Math.min(1.0, z + 0.1))}
                className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoomScale(0.65)}
                className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 cursor-pointer"
              >
                Fit
              </button>
            </div>

            {/* A4 Sheet Canvas Wrapper with Realistic Paper Drop Shadow */}
            <div
              className="transition-transform duration-200 origin-top shadow-2xl rounded-sm border border-slate-400/20 bg-white"
              style={{
                transform: `scale(${zoomScale})`,
                width: `${A4_WIDTH_PX}px`,
                height: `${A4_HEIGHT_PX}px`,
                marginBottom: `${-(A4_HEIGHT_PX * (1 - zoomScale))}px`,
                marginRight: `${-(A4_WIDTH_PX * (1 - zoomScale))}px`,
              }}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
                title="A4 Label Grid Preview Canvas"
              />
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className={`px-4 sm:px-6 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs shrink-0 ${
          isDarkMode ? "border-slate-800 bg-slate-900/60 text-slate-400" : "border-slate-200 bg-slate-50 text-slate-600"
        }`}>
          <div className="flex items-center gap-2">
            <span>💡 Tip: Standard A4 sticker sheets (e.g. Avery 5160, 24-Up) print at 100% scale without scaling down in print settings.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-bold hover:bg-slate-800/40 cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
