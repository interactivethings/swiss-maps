import { promises as fs } from "fs";
import * as mapshaper from "mapshaper";
import * as path from "path";

export const generate = async ({
  format,
  shapes,
  simplify,
  year,
  mapshaperCommands,
}: {
  format: "topojson" | "svg";
  shapes: string[];
  simplify: number;
  mapshaperCommands?: string[];
  year: string;
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
    ...(mapshaperCommands || []),
  ].join("\n");

  console.log("### Mapshaper commands ###");
  console.log(commands);

  const output = await mapshaper.applyCommands(commands, input);

  return format === "topojson"
    ? output["output.topojson"]
    : output["output.svg"];
};
