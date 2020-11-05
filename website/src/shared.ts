export type Shape =
  | "switzerland"
  | "cantons"
  | "districts"
  | "municipalities"
  | "lakes";

export interface Options {
  format: "topojson" | "svg";
  projection: "wgs84" | "cartesian";
  dimensions: { width: number; height: number };
  year: string;
  shapes: Set<Shape>;
}

export const defaultOptions: Options = {
  format: "topojson",
  projection: "wgs84",
  dimensions: { width: 900, height: 600 },
  year: "2020",
  shapes: new Set<Shape>(["switzerland", "cantons", "lakes"]),
};
