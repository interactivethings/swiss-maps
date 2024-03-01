import * as qs from "querystring";
import { SupportedColorSchema } from "./domain/color-schema";

export type Shape =
  | "country"
  | "cantons"
  | "districts"
  | "municipalities"
  | "lakes";

/**
 * These options correspond to what the user can tweak in the Generator Panel.
 * This acts as the input into the Preview, and is also used as input for the
 * API that generates the TopoJSON or SVG.
 */
export interface Options {
  format: "topojson" | "svg";
  projection: "wgs84" | "cartesian";
  dimensions: { width: number; height: number };
  year: string;
  simplify: number;
  shapes: Set<Shape>;
  color: SupportedColorSchema;
  withName: boolean;
}

export const defaultOptions: Options = {
  format: "topojson",
  projection: "wgs84",
  dimensions: { width: 900, height: 600 },
  year: "2024",
  simplify: 0,
  shapes: new Set<Shape>(["country", "cantons", "lakes"]),
  color: "default",
  withName: true,
};

/**
 * Returns the URL to the TopoJSON file, used in the Preview component
 * to render the map in the browser.
 */
export function previewSourceUrl(options: Options, version = "generate"): string {
  const { projection, year, shapes, simplify } = options;

  return `/api/${version}?${qs.encode({
    format: "topojson",
    projection,
    year,
    simplify: `${100 - simplify}%`,
    shapes: [...shapes.values()].join(","),
  })}`;
}

/**
 * Returns an URL where the user can download the map. These URLs are used by
 * the Download TopoJSON / SVG buttons.
 */
 export function downloadUrl(options: Options, version = "generate"): string {
  const { format, projection, dimensions, year, shapes, simplify } = options;

  return `/api/${version}?${qs.encode({
    format,
    projection,
    width: dimensions.width,
    height: dimensions.height,
    year,
    simplify: `${100 - simplify}%`,
    shapes: [...shapes.values()].join(","),
    download: "",
  })}`;
}
