import { either } from "fp-ts";
import produce from "immer";
import * as t from "io-ts";
import { NextApiRequest, NextApiResponse } from "next";
import { defaultOptions, Shape } from "src/shared";

type Format = "topojson" | "svg";

export const formatExtensions = {
  topojson: "json",
  svg: "svg",
} as Record<Format, string>;

export const formatContentTypes = {
  topojson: "application/json",
  svg: "image/svg+xml",
} as Record<Format, string>;

const Query = t.type({
  format: t.union([t.undefined, t.literal("topojson"), t.literal("svg")]),
  year: t.union([t.undefined, t.string]),
  shapes: t.union([t.undefined, t.string]),
  simplify: t.union([t.undefined, t.string]),
  download: t.union([t.undefined, t.string]),
});

export const parseOptions = (req: NextApiRequest, res: NextApiResponse) => {
  const query = either.getOrElseW<unknown, undefined>(() => undefined)(
    Query.decode(req.query)
  );

  if (!query) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Failed to decode query");
    return;
  }

  if (!query.shapes) {
    res.setHeader("Content-Type", "text/plain");
    res.status(204).send("0");
    return;
  }

  const options = produce(defaultOptions, (draft) => {
    if (query.year) {
      draft.year = query.year;
    }
    if (query.format) {
      draft.format = query.format;
    }
    if (query.shapes) {
      draft.shapes = new Set<Shape>(query.shapes.split(",") as $FixMe);
    }
  });

  return options;
};

export function initMiddleware(middleware: $FixMe) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: unknown) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const truthy = <T>(x: T): x is Exclude<T, undefined | null> => {
  return Boolean(x);
};

export const makeMapshaperStyleCommands = (
  shapeStyles: Record<
    string,
    null | {
      fill?: string;
      stroke?: string;
    }
  >
) => {
  return Object.entries(shapeStyles)
    .map(([shapeName, style]) => {
      if (style === null) {
        return style;
      }
      return `-style target='${shapeName}' ${Object.entries(style)
        .map(([propName, propValue]) => {
          return `${propName}='${propValue}'`;
        })
        .join(" ")}`;
    })
    .filter(truthy);
};

const getShapeZIndex = (shape: string) => {
  if (shape.includes("country")) {
    return 3;
  } else if (shape.includes("cantons")) {
    return 2;
  } else if (shape.includes("lakes")) {
    return 1;
  }
  return 0;
};

export const shapeIndexComparator = (a: string, b: string) => {
  const za = getShapeZIndex(a);
  const zb = getShapeZIndex(b);
  return za === zb ? 0 : za < zb ? -1 : 1;
};