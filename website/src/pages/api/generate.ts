import { NextApiRequest, NextApiResponse } from "next";
import * as path from "path";
import * as fs from "fs";
import * as mapshaper from "mapshaper";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const paths = {
    shp: path.resolve("./public/2020/g1l20.shp"),
    dbf: path.resolve("./public/2020/g1l20.dbf"),
    prj: path.resolve("./public/2020/g1l20.prj"),
  };

  const input = {
    "input.shp": await fs.promises.readFile(paths.shp),
    "input.dbf": await fs.promises.readFile(paths.dbf),
    "input.prj": await fs.promises.readFile(paths.prj, { encoding: "utf8" }),
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
