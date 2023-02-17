import Cors from "cors";
import { either } from "fp-ts";
import { promises as fs } from "fs";
import { enableMapSet, produce } from "immer";
import * as t from "io-ts";
import * as mapshaper from "mapshaper";
import { NextApiRequest, NextApiResponse } from "next";
import * as path from "path";
import { defaultOptions, Shape } from "src/shared";
import {
  formatContentTypes,
  formatExtensions,
  initMiddleware,
  parseOptions,
} from "./_utils";

enableMapSet();

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
  })
);

const generateFromShapefiles = async ({
  format,
  year,
  shapes,
  simplify
} : {
  format: 'topojson' | 'svg',
  year: string,
  shapes: string[]
  simplify?: number, 
}) => {

    const input = await (async () => {
      const props = shapes.flatMap((shape) => {
        return ["shp", "dbf", "prj"].map(
          async (ext) =>
            [
              `${shape}.${ext}`,
              await fs.readFile(
                path.join(
                  process.cwd(),
                  "public",
                  "swiss-maps",
                  year,
                  `${shape}.${ext}`
                )
              ),
            ] as const
        );
      });
      return Object.fromEntries(await Promise.all(props));
    })();

    const inputFiles = shapes.map((shape) => `${shape}.shp`).join(" ");

  const commands = [
    `-i ${inputFiles} combine-files string-fields=*`,
    // `-rename-layers ${shp.join(",")}`,
    simplify ? `-simplify ${simplify} keep-shapes` : "",
    "-clean",
    `-proj ${format === "topojson" ? "wgs84" : "somerc"}`,
    `-o output.${format} format=${format} drop-table id-field=id`,
  ].join("\n");

  console.log("### Mapshaper commands ###");
  console.log(commands);

  const output = await mapshaper.applyCommands(commands, input);

  return format === "topojson"
    ? output["output.topojson"]
    : output["output.svg"];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await cors(req, res);

    const { query } = req;
    const options = parseOptions(req, res)!;

    const { format, year } = options;

    const output = await generateFromShapefiles({
      ...options,
      shapes: [...options.shapes]
    })

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
