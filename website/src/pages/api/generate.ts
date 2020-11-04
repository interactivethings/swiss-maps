import * as mapshaper from "mapshaper";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  async function get(url: string) {
    return fetch(url)
      .then((res) => res.arrayBuffer())
      .then((ab) => Buffer.from(ab));
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
    "-i switzerland.shp cantons.shp lakes.shp combine-files string-fields=* encoding=utf8 -clean -rename-layers switzerland,cantons,lakes -proj wgs84 -simplify 50% -o format=topojson drop-table id-field=GMDNR,KTNR,GMDE,KT",
    input,
    (err, output) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(output["output.json"]);
    }
  );
}
