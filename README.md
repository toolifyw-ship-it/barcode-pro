# Barcoder Pro - Free Barcode & QR Code Generator

A professional, high-performance, and privacy-first online barcode and QR code generator built using **React 19**, **Vite**, and **Tailwind CSS**. All barcode and QR code rendering is performed 100% client-side in the user's browser, ensuring absolute data security and privacy.

## Features

- **10+ Supported Formats:** Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF, QR Code, PDF417, DataMatrix, and Aztec.
- **Bulk Barcode Generator:** Generate, download, and manage multiple barcodes in a single batch, with options to export as a multi-page PDF document.
- **Privacy-First Architecture:** No data is sent to external servers; everything is rendered locally using high-performance HTML5 canvas elements.
- **High Customization:** Modify colors, dimensions, add text badges, frames, and center logos on QR codes.
- **Modern Responsive Design:** Optimized layout with touch-friendly controls across smartphones, tablets, laptops, and desktop screens.
- **Interactive Scanner:** Built-in local browser scanner for decoding barcodes and QR codes from a webcam stream or static files.

## Technical Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide React
- **Rendering Engines:** `jsbarcode`, `bwip-js`, `qrcode`
- **PDF Generation:** `jspdf`

## Getting Started

### Prerequisites

- Node.js (version 20 or higher recommended)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build the production package:
   ```bash
   npm run build
   ```

## License

This project is open-source and free to use for personal and commercial ventures.
