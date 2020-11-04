export type Shape =
  | "switzerland"
  | "cantons"
  | "districts"
  | "municipalities"
  | "lakes";

export interface Options {
  format?: "topojson" | "svg";
  projection?: "wgs84" | { type: "cartesian"; width: number; height: number };
  year?: number;
  shapes?: Set<Shape>;
  simplification?: number;
}
