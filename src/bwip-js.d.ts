declare module 'bwip-js' {
  export function toCanvas(
    canvas: string | HTMLCanvasElement | null,
    options: {
      bcid: string;
      text: string;
      scale?: number;
      height?: number;
      includetext?: boolean;
      textxalign?: "left" | "center" | "right";
      backgroundcolor?: string;
      barcolor?: string;
      padding?: number;
    }
  ): void;
}
