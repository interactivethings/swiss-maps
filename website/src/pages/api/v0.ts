import Cors from "cors";
import { either } from "fp-ts";
import { promises as fs } from "fs";
import { enableMapSet, produce } from "immer";
import * as t from "io-ts";
import * as mapshaper from "mapshaper";
import { NextApiRequest, NextApiResponse } from "next";
import * as path from "path";
import { defaultOptions, Shape } from "src/shared";

/**
 * Difference from `generate` api
 * - suppport svg styling (the default is fill all with black)
 */

enableMapSet();

function initMiddleware(middleware: $FixMe) {
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

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
  })
);

const Query = t.type({
  format: t.union([t.undefined, t.literal("topojson"), t.literal("svg")]),
  year: t.union([t.undefined, t.string]),
  shapes: t.union([t.undefined, t.string]),
  simplify: t.union([t.undefined, t.string]),
  download: t.union([t.undefined, t.string]),
});

const generate = async ({
  format,
  shapes,
  year,
  simplify
}: {
  format: 'topojson' | 'svg'
  shapes: Set<string>,
  year: string,
  simplify: number
}) => {
  const input = await (async () => {
    const props = [...shapes].flatMap((shape) => {
      return ["shp", "dbf", "prj"].map(
        async (ext) =>
          [
            `${shape}.${ext}`,
            await fs.readFile(
              path.join(
                process.cwd(),
                "public/swiss-maps",
                year,
                `${shape}.${ext}`
              )
            ),
          ] as const
      );
    });
    return Object.fromEntries(await Promise.all(props));
  })();

  const inputFiles = [...shapes].map((shape) => `${shape}.shp`).join(" ");

  const commands = [
    `-i ${inputFiles} combine-files string-fields=*`,
    simplify ? `-simplify ${simplify} keep-shapes` : "",
    "-clean",
    `-proj ${format === "topojson" ? "wgs84" : "somerc"}`,
    // svg coloring, otherwise is all bblack
    shapes.has("cantons")
      ? `-style fill='#e6e6e6' stroke='#999' target='cantons'`
      : "",
    shapes.has("lakes") ? `-style fill='#a1d0f7' target='lakes'` : "",
    `-o output.${format} format=${format} target=*`,
  ].join("\n");

  console.log("### Mapshaper commands ###");
  console.log(commands);

  const output = await mapshaper.applyCommands(commands, input);

  return format === 'topojson' ? output['output.topojson'] : output['output.svg']
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await cors(req, res);

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
    const { format } = options;
    const output = await generate(options)

    switch (format) {
      case "topojson": {
        if (query.download !== undefined) {
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="swiss-maps.json"`
          );
        }

        res.setHeader("Content-Type", "application/json");
        res.status(200).send(output);
        break;
      }

      case "svg": {
        res.setHeader("Content-Type", "image/svg+xml");

        if (query.download !== undefined) {
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="swiss-maps.svg"`
          );
        }
        res.status(200).send(output);
        break;
      }
      default:
        res.status(500).json({ message: "Unsupported format" });
        break;
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal error" });
  }
}
