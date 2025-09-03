import { groupBy } from "fp-ts/lib/NonEmptyArray";
import { z } from "zod";

const mutationTypes = {
  1: "INCLUSION",
  2: "FUSION",
};

export const MunicipalityMigrationData = z
  .object({
    ds: z.array(
      z
        .tuple([
          z.number(),
          z.number(),
          z.string(),
          z.number(),
          z.string(),
          z.number(),
          z.string(),
          z.string(),
          z.string(),
        ])
        .transform((val) => ({
          migrationNumber: val[0],
          histNumber: val[1],
          canton: val[2],
          bezirkNumber: val[3],
          bezirkName: val[4],
          ofsNumber: val[5],
          municipalityName: val[6],
          radiationReason: val[7],
          inscriptionReason: val[8],
        }))
    ),
    mutations: z.record(
      z
        .object({
          t: z.number(),
          d: z.string(),
        })
        .transform((val) => ({
          type: val.t,
          date: val.d,
        }))
    ),
  })
  .transform((val) => {
    const ds = val.ds;
    const items = ds.map((row) => {
      const mutation = val.mutations[row.migrationNumber];
      return {
        ...row,
        date: mutation.date,
        year: Number(mutation.date.split(".")[2]),
        type: mutationTypes[mutation.type as keyof typeof mutationTypes],
      };
    });
    const grouped = groupBy<(typeof items)[number]>(
      (x) => `${x.migrationNumber}`
    )(items);
    return Object.entries(grouped).map(([migrationNumber, items]) => {
      const added = items.filter((x) => x.inscriptionReason);
      const removed = items.filter((x) => x.radiationReason);
      return {
        added,
        removed,
        year: items[0].year,
        migrationNumber: Number(migrationNumber),
        type: items[0].type,
      };
    });
  });

export type MunicipalityMigrationData = z.infer<
  typeof MunicipalityMigrationData
>;

export type MunicipalityMigrationDataItem = MunicipalityMigrationData[number];
