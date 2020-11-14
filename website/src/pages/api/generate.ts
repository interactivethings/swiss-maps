import Cors from "cors";
import { either } from "fp-ts";
import { enableMapSet, produce } from "immer";
import * as t from "io-ts";
import * as mapshaper from "mapshaper";
import { NextApiRequest, NextApiResponse } from "next";
import * as path from "path";
import { defaultOptions } from "src/shared";
import { promises as fs } from "fs";

enableMapSet();

async function get(url: string) {
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((ab) => Buffer.from(ab));
}

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
  year: t.union([t.undefined, t.string]),
  shapes: t.union([t.undefined, t.string]),
  download: t.union([t.undefined, t.string]),
});

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

    const options = produce(defaultOptions, (draft) => {
      draft.shapes = new Set([
        ...(draft.shapes?.values() ?? []),
        ...(query.shapes?.split(",") ?? ([] as $FixMe)),
      ]);

      if (query.year) {
        draft.year = query.year;
      }
    });
    const { year, shapes } = options;

    const input = await (async () => {
      const props = [...(shapes?.values() ?? [])].flatMap((shape) => {
        return ["shp", "dbf", "prj"].map(
          async (ext) =>
            [
              `${shape}.${ext}`,
              await fs.readFile(
                path.join(
                  process.cwd(),
                  "node_modules",
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

    const inputFiles = [...shapes].map((shape) => `${shape}.shp`).join(" ");

    const commands = [
      `-i ${inputFiles} combine-files string-fields=*`,
      "-clean",
      // `-rename-layers ${shp.join(",")}`,
      "-proj wgs84",
      "-o format=topojson drop-table id-field=id",
    ].join("\n");

    console.log("### Mapshaper commands ###");
    console.log(commands);

    const output = await mapshaper.applyCommands(commands, input);

    if (query.download !== undefined) {
      res.setHeader("Content-Disposition", `attachment; filename="topo.json"`);
    }

    res.statusCode = 200;
    res.json(output["output.json"]);
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.json({ message: "Internal error" });
  }
}
