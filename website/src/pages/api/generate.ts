import { either } from "fp-ts";
import * as t from "io-ts";
import * as mapshaper from "mapshaper";
import { NextApiRequest, NextApiResponse } from "next";

async function get(url: string) {
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((ab) => Buffer.from(ab));
}

const Query = t.type({
  year: t.union([t.undefined, t.string]),
  shapes: t.union([
    t.undefined,
    t.array(
      t.union([
        t.literal("switzerland"),
        t.literal("cantons"),
        t.literal("districts"),
        t.literal("municipalities"),
        t.literal("lakes"),
      ])
    ),
  ]),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const query = either.getOrElseW<unknown, undefined>(() => undefined)(
      Query.decode(req.query)
    );

    if (!query) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("Failed to decode query");
      return;
    }

    const input = {
      // switzerland
      "switzerland.shp": await get(
        "https://storage.googleapis.com/swiss-maps/2020/g1l20.shp"
      ),
      "switzerland.dbf": await get(
        "https://storage.googleapis.com/swiss-maps/2020/g1l20.dbf"
      ),
      "switzerland.prj": await get(
        "https://storage.googleapis.com/swiss-maps/2020/g1l20.prj"
      ),

      "cantons.shp": await get(
        "https://storage.googleapis.com/swiss-maps/2020/g1k20.shp"
      ),
      "cantons.dbf": await get(
        "https://storage.googleapis.com/swiss-maps/2020/g1k20.dbf"
      ),
      "cantons.prj": await get(
        "https://storage.googleapis.com/swiss-maps/2020/g1k20.prj"
      ),

      "municipalities.shp": await get(
        "https://storage.googleapis.com/swiss-maps/2020/g1g20.shp"
      ),
      "municipalities.dbf": await get(
        "https://storage.googleapis.com/swiss-maps/2020/g1g20.dbf"
      ),
      "municipalities.prj": await get(
        "https://storage.googleapis.com/swiss-maps/2020/g1g20.prj"
      ),

      "lakes.shp": await get(
        "https://storage.googleapis.com/swiss-maps/2020/g1s20.shp"
      ),
      "lakes.dbf": await get(
        "https://storage.googleapis.com/swiss-maps/2020/g1s20.dbf"
      ),
      "lakes.prj": await get(
        "https://storage.googleapis.com/swiss-maps/2020/g1s20.prj"
      ),
    };

    mapshaper.applyCommands(
      "-i switzerland.shp cantons.shp municipalities.shp lakes.shp combine-files string-fields=* encoding=utf8 -clean -rename-layers switzerland,cantons,municipalities,lakes -proj wgs84 -o format=topojson drop-table id-field=GMDNR,KTNR,GMDE,KT",
      input,
      (err, output) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(output["output.json"]);
      }
    );
  } catch {
    // ???
  }
}
