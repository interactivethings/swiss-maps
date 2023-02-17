import Cors from "cors";
import { enableMapSet } from "immer";
import { NextApiRequest, NextApiResponse } from "next";
import * as path from "path";
import {
  formatContentTypes,
  formatExtensions,
  initMiddleware,
  makeMapshaperStyleCommands,
  parseOptions,
  shapeIndexComparator,
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
      simplify: query.simplify as string,
      year,
      shapes: [...shapes].sort(shapeIndexComparator),
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
