import Cors from "cors";
import { enableMapSet } from "immer";
import { NextApiRequest, NextApiResponse } from "next";
import * as path from "path";
import { generate } from "./_generate";
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await cors(req, res);

    const { query } = req;
    const options = parseOptions(req, res)!;

    const { format, year, shapes } = options;
    const cwd = process.cwd();

    const output = await generate({
      ...options,
      year,
      shapes: [...shapes],
      mapshaperCommands: [
        `-o output.${format} format=${format} drop-table id-field=id target=*`,
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
