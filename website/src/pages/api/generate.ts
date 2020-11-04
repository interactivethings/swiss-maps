import { NextApiRequest, NextApiResponse } from "next";
import * as mapshaper from "mapshaper";

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
    "input.shp": await get(
      "https://storage.googleapis.com/swiss-maps/2020/g1l20.shp"
    ),
    "input.dbf": await get(
      "https://storage.googleapis.com/swiss-maps/2020/g1l20.dbf"
    ),
    "input.prj": await get(
      "https://storage.googleapis.com/swiss-maps/2020/g1l20.prj"
    ),
  };

  mapshaper.applyCommands(
    "-i input.shp string-fields=* encoding=utf8 -clean -rename-layers switzerland -proj wgs84 -simplify 50% -o format=topojson drop-table id-field=GMDNR,KTNR,GMDE,KT",
    input,
    (err, output) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(output["input.json"]);
    }
  );
}
