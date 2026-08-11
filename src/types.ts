export enum BarcodeType {
  CODE128 = "CODE128",
  CODE39 = "CODE39",
  EAN13 = "EAN13",
  EAN8 = "EAN8",
  UPC = "UPC",
  ITF = "ITF",
  QR = "QR",
  PDF417 = "PDF417",
  DATAMATRIX = "DATAMATRIX",
  AZTEC = "AZTEC"
}

export interface BarcodeTypeConfig {
  id: BarcodeType;
  name: string;
  category: "1D Linear" | "2D Matrix";
  placeholder: string;
  description: string;
  standards: string;
  allowedChars: string;
  validate: (val: string) => { isValid: boolean; error?: string; processed: string };
}

export interface GeneratorOptions {
  scale: number;
  height: number;
  displayValue: boolean;
  lineColor: string;
  backgroundColor: string;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  margin: number;
}

export interface SavedCode {
  id: string;
  data: string;
  type: BarcodeType;
  timestamp: string;
  options: GeneratorOptions;
}

export interface UserReview {
  rating: number;
  comment: string;
  timestamp: string;
}
