export type Shape =
  | "switzerland"
  | "cantons"
  | "districts"
  | "municipalities"
  | "lakes";

export interface Options {
  format?: "topojson" | "svg";
  projection?: "wgs84" | "cartesian";
  dimensions: { width: number; height: number };
  year?: string;
  shapes?: Set<Shape>;
}
