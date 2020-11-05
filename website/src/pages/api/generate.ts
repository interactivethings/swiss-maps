import Cors from "cors";
import { either } from "fp-ts";
import { enableMapSet, produce } from "immer";
import * as t from "io-ts";
import * as mapshaper from "mapshaper";
import { NextApiRequest, NextApiResponse } from "next";
import { defaultOptions, Shape } from "src/shared";

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
  format: t.union([t.undefined, t.literal("topojson"), t.literal("svg")]),
  year: t.union([t.undefined, t.string]),
  shapes: t.union([t.undefined, t.string]),
  simplify: t.union([t.undefined, t.string]),
  download: t.union([t.undefined, t.string]),
});

const VERSION = "4.0.0-canary.3";

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
      if (query.shapes) {
        draft.shapes = new Set<Shape>(
          (query.shapes?.split(",") ?? []) as $FixMe
        );
      }
    });
    const { format, year, shapes } = options;
    // console.log(year, shapes);

    const input = await (async () => {
      const shapeToKey: Record<Shape, string> = {
        switzerland: "l",
        cantons: "k",
        districts: "k", // FIXME: districts not available as shapefiles in the swiss-maps package yet.
        municipalities: "g",
        lakes: "s",
      };

      const props = [...(shapes?.values() ?? [])].flatMap((shape) => {
        const key = shapeToKey[shape];

        return ["shp", "dbf", "prj"].map(
          async (ext) =>
            [
              `${shape}.${ext}`,
              await get(
                // fs.readFile(path.resolve("swiss-maps/shapefile/…"))
                `https://unpkg.com/swiss-maps@${VERSION}/shapefile/${year}/${key}.${ext}`
              ),
            ] as const
        );
      });

      return Object.fromEntries(await Promise.all(props));
    })();

    await new Promise((resolve, reject) => {
      const shp = [...options.shapes.values()];

      const format = query.format ?? "topojson";

      mapshaper.applyCommands(
        [
          `-i ${shp.map(
            (x) => `${x}.shp`
          )} combine-files string-fields=* encoding=utf8`,
          "-clean",
          query.simplify ? `-simplify ${query.simplify} keep-shapes` : "",
          `-proj ${format === "topojson" ? "wgs84" : "somerc"}`,
          `-o output.${format} format=${format} drop-table id-field=GMDNR,KTNR,GMDE,KT`,
        ].join(" "),
        input,
        (err: unknown, output: $FixMe) => {
          if (err) {
            reject(err);
          } else {
            res.statusCode = 200;

            if (format === "topojson") {
              res.setHeader("Content-Type", "application/json");

              if (query.download !== undefined) {
                res.setHeader(
                  "Content-Disposition",
                  `attachment; filename="swiss-maps.json"`
                );
              }

              res.end(output["output.topojson"]);
            } else if (format === "svg") {
              res.setHeader("Content-Type", "image/svg+xml");

              if (query.download !== undefined) {
                res.setHeader(
                  "Content-Disposition",
                  `attachment; filename="swiss-maps.svg"`
                );
              }

              res.end(output["output.svg"]);
            } else {
              res.statusCode = 500;
              res.end("Error");
            }

            resolve();
          }
        }
      );
    });
  } catch (e) {
    console.log(e);
  }
}
