/**
 * Barcoder Pro - Enterprise Input Sanitization Library
 * Strict Whitelist-Based Architecture to Prevent XSS, Injection, and Buffer Overflow Attacks
 * in Client-Side Barcode & QR Code Rendering Engines.
 */

// Allowed URL schemes for QR codes and 2D barcodes
const ALLOWED_URL_SCHEMES = new Set([
  "http:",
  "https:",
  "mailto:",
  "tel:",
  "sms:",
  "geo:",
  "wifi:",
  "facetime:",
  "market:",
]);

// Dangerous XSS injection signatures and pseudo-protocols
const XSS_PATTERNS = [
  /javascript\s*:/i,
  /data\s*:\s*text\/html/i,
  /data\s*:\s*image\/svg\+xml/i,
  /vbscript\s*:/i,
  /<script[\s\S]*?>[\s\S]*?<\/script>/i,
  /<iframe[\s\S]*?>/i,
  /<embed[\s\S]*?>/i,
  /<object[\s\S]*?>/i,
  /on\w+\s*=/i, // onload=, onerror=, onclick= etc.
  /document\s*\.\s*(cookie|location|domain)/i,
  /window\s*\.\s*(location|open|navigate)/i,
  /<svg[\s\S]*?<script/i,
];

// Dangerous Unicode BIDI override and hidden control character ranges
const DANGEROUS_UNICODE_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;

/**
 * Escapes HTML characters using strict whitelist substitution.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== "string") return "";
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&#x60;",
  };
  return str.replace(/[&<>"'/`]/g, (char) => htmlEscapes[char] || char);
}

/**
 * Strips dangerous hidden control characters, null bytes, and BIDI directional overrides.
 */
export function stripDangerousCharacters(input: string): string {
  if (typeof input !== "string") return "";
  return input.replace(DANGEROUS_UNICODE_CHARS, "");
}

/**
 * Checks if a string contains any known XSS payload patterns.
 */
export function containsXssPayload(input: string): boolean {
  if (typeof input !== "string") return false;
  return XSS_PATTERNS.some((pattern) => pattern.test(input));
}

export interface SanitizationResult {
  sanitized: string;
  isSafe: boolean;
  isValidForFormat: boolean;
  threatDetected?: string;
  errorMessage?: string;
}

/**
 * Validates and sanitizes barcode/QR code data according to strict format whitelists.
 * Prevents SVG/DOM script injection while maintaining full standard barcode compliance.
 *
 * @param input Raw user input string
 * @param format Target barcode format (e.g., 'CODE128', 'EAN13', 'QR', etc.)
 * @returns Sanitized string and validation metrics
 */
export function sanitizeBarcodeInput(input: string, format: string = "CODE128"): SanitizationResult {
  if (typeof input !== "string") {
    return {
      sanitized: "",
      isSafe: true,
      isValidForFormat: true,
    };
  }

  // 1. Strip dangerous unicode and null bytes first
  let cleaned = stripDangerousCharacters(input);
  let threatDetected: string | undefined;

  // 2. Check for XSS vectors
  if (containsXssPayload(cleaned)) {
    threatDetected = "Potential XSS script/event payload neutralized";
    // Disarm pseudo-protocols and script tags safely
    cleaned = cleaned
      .replace(/javascript\s*:/gi, "blocked-javascript:")
      .replace(/vbscript\s*:/gi, "blocked-vbscript:")
      .replace(/data\s*:\s*text\/html/gi, "blocked-data-html:")
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<[\s\S]*?>/g, "")
      .replace(/on\w+\s*=/gi, "blocked-handler=");
  }

  // Maximum character cap to prevent DoS buffer overflows in canvas renders
  const MAX_INPUT_LENGTH = 4096;
  if (cleaned.length > MAX_INPUT_LENGTH) {
    cleaned = cleaned.substring(0, MAX_INPUT_LENGTH);
  }

  const fmt = (format || "").toUpperCase();

  // 3. Format-specific strict whitelist enforcement
  let isValidForFormat = true;
  let errorMessage: string | undefined;

  switch (fmt) {
    // Strictly numeric 0-9
    case "EAN13":
    case "EAN8":
    case "UPC":
    case "UPCA":
    case "UPCE":
    case "ITF":
    case "MSI":
    case "PHARMACODE":
    case "POSTNET": {
      const numericOnly = cleaned.replace(/[^0-9]/g, "");
      if (numericOnly !== cleaned) {
        isValidForFormat = false;
        errorMessage = "Only digits (0-9) are allowed for this numeric format.";
      }
      cleaned = numericOnly;
      break;
    }

    // Code 39: Standard uppercase, digits, and specific symbols: - . $ / + % SPACE
    case "CODE39": {
      const upper = cleaned.toUpperCase();
      const code39Whitelisted = upper.replace(/[^0-9A-Z\-\.\ \$\/\+\%]/g, "");
      if (code39Whitelisted !== upper) {
        isValidForFormat = false;
        errorMessage = "Allowed characters: 0-9, A-Z, space, and symbols (- . $ / + %)";
      }
      cleaned = code39Whitelisted;
      break;
    }

    // Code 93: Standard alphanumeric and symbols
    case "CODE93": {
      const upper = cleaned.toUpperCase();
      const code93Whitelisted = upper.replace(/[^0-9A-Z\-\.\ \$\/\+\%]/g, "");
      if (code93Whitelisted !== upper) {
        isValidForFormat = false;
      }
      cleaned = code93Whitelisted;
      break;
    }

    // Codabar: 0-9 and - $ : / . + with start/stop characters A, B, C, D
    case "CODABAR": {
      const upper = cleaned.toUpperCase();
      const codabarWhitelisted = upper.replace(/[^0-9A-D\-\$\:\/\.\+]/g, "");
      if (codabarWhitelisted !== upper) {
        isValidForFormat = false;
        errorMessage = "Allowed characters: 0-9, A-D, and symbols (- $ : / . +)";
      }
      cleaned = codabarWhitelisted;
      break;
    }

    // Code 128: Standard printable ASCII (0x20 to 0x7E)
    case "CODE128":
    case "GS1_128":
    case "ISBN": {
      // Whitelist only printable ASCII characters; strip control or non-printable chars
      const asciiPrintable = cleaned.replace(/[^\x20-\x7E]/g, "");
      if (asciiPrintable !== cleaned) {
        isValidForFormat = false;
      }
      cleaned = asciiPrintable;
      break;
    }

    // 2D Codes: QR, PDF417, DataMatrix, Aztec
    case "QR":
    case "PDF417":
    case "DATAMATRIX":
    case "AZTEC": {
      // Validate URLs if the string starts with a protocol
      const trimmed = cleaned.trim();
      const protocolMatch = trimmed.match(/^([a-zA-Z0-9+.-]+:)/);
      if (protocolMatch) {
        const protocol = protocolMatch[1].toLowerCase();
        if (!ALLOWED_URL_SCHEMES.has(protocol)) {
          threatDetected = `Blocked unpermitted URI protocol: ${protocol}`;
          cleaned = `https://${trimmed.replace(/^[^:]+:\/\//, "")}`;
        }
      }
      break;
    }

    default: {
      // Fallback: standard printable characters, no null or control chars
      cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, "");
      break;
    }
  }

  return {
    sanitized: cleaned,
    isSafe: !threatDetected,
    isValidForFormat,
    threatDetected,
    errorMessage,
  };
}

/**
 * Sanitizes multi-line bulk input rows using the strict whitelist.
 */
export function sanitizeBulkInput(rawText: string, format: string): string[] {
  if (typeof rawText !== "string") return [];
  const lines = rawText.split(/\r?\n/);
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const { sanitized } = sanitizeBarcodeInput(trimmed, format);
    if (sanitized) {
      result.push(sanitized);
    }
  }

  return result;
}
