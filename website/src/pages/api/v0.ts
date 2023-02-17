import Cors from "cors";
import { enableMapSet } from "immer";
import { NextApiRequest, NextApiResponse } from "next";
import * as path from "path";
import {
  formatContentTypes,
  formatExtensions,
  initMiddleware,
  parseOptions,
} from "./_utils";
import { generate } from "./_generate";

/**
 * Difference from `generate` api
 * - suppport svg styling (the default is fill all with black)
 */

enableMapSet();

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
  })
);

const truthy = <T>(x: T): x is Exclude<T, undefined | null> => {
  return Boolean(x);
};

const makeMapshaperStyleCommands = (
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

const shapeIndexComparator = (a: string, b: string) => {
  const za = getShapeZIndex(a);
  const zb = getShapeZIndex(b);
  return za === zb ? 0 : za < zb ? -1 : 1;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await cors(req, res);

    const { query } = req;
    const options = parseOptions(req, res)!;
    const { format, shapes, year } = options;

    if (!formatExtensions[format]) {
      res.status(500).json({ message: `Unsupported format ${format}` });
    }

    const cwd = process.cwd();
    const shpFilenames = [...options.shapes]
      .map((shapeName) => {
        return path.join(cwd, "public", "swiss-maps", year, `${shapeName}.shp`);
      })
      .sort(shapeIndexComparator);

    const hasCantons = shapes.has("cantons");
    const hasMunicipalities = shapes.has("municipalities");
    const hasLakes = shapes.has("lakes");

    const shapeStyles = {
      country: {
        fill: hasCantons || hasMunicipalities ? "transparent" : "#eee",
        stroke: "#111",
      },
      lakes: hasLakes
        ? {
            fill: "#a1d0f7",
          }
        : null,
      cantons: hasCantons
        ? {
            fill: hasMunicipalities ? "transparent" : "#eee",
            stroke: "#666",
          }
        : null,
      municipalities: hasMunicipalities
        ? {
            fill: "#eee",
            stroke: hasCantons ? "#bbb" : "#666",
          }
        : null,
    };

    const styleCommands = makeMapshaperStyleCommands(shapeStyles);

    const output = await generate({
      ...options,
      year,
      shapes: [...shapes],
      mapshaperCommands: [
        ...styleCommands,
        `-o output.${format} format=${format} target=*`,
      ],
    });

    if (query.download !== undefined) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="swiss-maps.${formatExtensions[format]}"`
      );
    }
    res.setHeader("Content-Type", formatContentTypes[format]);
    res.status(200).send(output);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal error" });
  }
}
