import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import { GeoDataFeature, useGeoData } from "src/domain/geodata";
import {
  MunicipalityMigrationData,
  MunicipalityMigrationDataItem,
} from "src/domain/municipality-migrations";
import * as turf from "@turf/turf";
import { FlyToInterpolator } from "@deck.gl/core";
import { parse } from "path";
import { useQuery } from "@tanstack/react-query";
import { GeoJsonLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";

const MutationsMap = dynamic(() => import("../components/Mutations/Map"), {
  ssr: false,
});
const MutationsMinimap = dynamic(
  () => import("../components/Mutations/Minimap"),
  {
    ssr: false,
  },
);

const INITIAL_VIEW_STATE = {
  latitude: 46.8182,
  longitude: 8.2275,
  zoom: 7,
  maxZoom: 16,
  minZoom: 2,
  pitch: 0,
  bearing: 0,
  transitionInterpolator: new FlyToInterpolator(),
  transitionDuration: 1000,
};

export default function Page() {
  const [year1, setYear1] = useState("2022");
  const [year2, setYear2] = useState("2024");
  const { data: groupedMutations } = useQuery({
    queryKey: ["mutations", year1, year2],
    queryFn: async () => {
      const mutations = (await (
        await fetch(`/api/mutations?from=01.01.${year1}&to=01.01.${year2}`)
      ).json()) as MunicipalityMigrationData;
      console.log({ mutations });
      return mutations;
    },
  });
  const [migrationItem, setMigrationItem] =
    useState<MunicipalityMigrationDataItem>();

  const handleMutationSelect = (parsed: MunicipalityMigrationDataItem) => {
    setMigrationItem(parsed);
  };

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const geoDataYears = useMemo(() => {
    if (!migrationItem) {
      return [year1, year2] as const;
    } else {
      const year = Number(migrationItem.year);
      return [year - 1, year] as const;
    }
  }, [migrationItem, year1, year2]);

  const { data: geoData1 } = useGeoData({
    year: `${geoDataYears[0]}`,
    format: "topojson",
    simplify: 0.02,
    shapes: new Set(["municipalities"]),
    projection: "wgs84",
    color: "default",
    dimensions: { width: 800, height: 600 },
    withName: false,
  });

  const { data: geoData2 } = useGeoData({
    year: `${geoDataYears[1]}`,
    format: "topojson",
    simplify: 0.02,
    shapes: new Set(["municipalities"]),
    projection: "wgs84",
    color: "default",
    dimensions: { width: 800, height: 600 },
    withName: false,
  });

  useEffect(() => {
    const { added = [], removed = [] } = migrationItem ?? {};
    const all = [...added, ...removed].map((x) => x.ofsNumber);
    const findFeature = (x: GeoDataFeature) => all.includes(x.properties?.id);
    const municipality =
      geoData1.municipalities?.features.find(findFeature) ??
      geoData2.municipalities?.features.find(findFeature);
    if (municipality) {
      const mbbox = turf.center(municipality);
      setViewState((prev) => ({
        ...prev,
        longitude: mbbox.geometry.coordinates[0],
        latitude: mbbox.geometry.coordinates[1],
        zoom: 9,

        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 300,
      }));
    } else {
      console.log("Cannot find municipality", municipality, migrationItem);
    }
  }, [migrationItem, geoData1, geoData2]);

  const highlightedMunicipalities = {
    added: migrationItem?.added.map((x) => x.ofsNumber) ?? [],
    removed: migrationItem?.removed.map((x) => x.ofsNumber) ?? [],
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns="300px 1fr"
      height="100vh"
      overflow="hidden"
    >
      <Box
        component={List}
        sx={{
          overflow: "scroll",
          height: "100%",
          borderRight: "1px solid #ccc",
          p: 1,
        }}
        onKeyDown={(ev) => {
          if (!groupedMutations) {
            return;
          }
          const index = migrationItem
            ? groupedMutations.indexOf(migrationItem)
            : -1;
          if (ev.key === "ArrowDown" && index < groupedMutations.length - 1) {
            ev.preventDefault();
            handleMutationSelect(groupedMutations[index + 1]);
          }
          if (ev.key === "ArrowUp" && index > 0) {
            ev.preventDefault();
            handleMutationSelect(groupedMutations[index - 1]);
          }
        }}
      >
        <Box sx={{ p: 1 }}>
          <Box
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              /** @ts-ignore */
              gap: "0.5rem",
              borderBottom: "1px solid #ccc",
            }}
          >
            <TextField
              label="From:"
              variant="outlined"
              value={year1}
              onChange={(e) => setYear1(e.target.value)}
              size="small"
            />
            <TextField
              label="To:"
              variant="outlined"
              value={year2}
              size="small"
              onChange={(e) => setYear2(e.target.value)}
            />
          </Box>
        </Box>
        {(groupedMutations ?? []).map((parsed, index) => {
          const selected = migrationItem === parsed;
          return (
            <ListItem
              key={index}
              onClick={() => handleMutationSelect(parsed)}
              ref={
                selected
                  ? (node) => node?.scrollIntoView({ behavior: "smooth" })
                  : undefined
              }
            >
              <ListItemText
                primary={
                  <>
                    <Typography variant="overline">
                      {parsed.migrationNumber}
                    </Typography>
                    <br />
                    <Typography variant="inherit">{parsed.label}</Typography>
                  </>
                }
                secondary={`${parsed.year}${
                  parsed.type ? ` - ${parsed.type?.toLowerCase()}` : ""
                }`}
              />
            </ListItem>
          );
        })}
      </Box>
      <Box sx={{ p: 2 }}>
        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr"
          columnGap="1rem"
          height="100%"
        >
          <div>
            <Typography variant="h5">{geoDataYears[0]}</Typography>
            <Box
              height="calc(100% - 2rem)"
              position="relative"
              border="1px solid #ccc"
            >
              <MutationsMap
                viewState={viewState}
                geoData={geoData1}
                onViewStateChange={({ viewState }: { viewState: $FixMe }) =>
                  setViewState(viewState)
                }
                highlightedMunicipalities={highlightedMunicipalities}
              />
            </Box>
          </div>
          <div>
            <Typography variant="h5">{geoDataYears[1]}</Typography>
            <Box
              height="calc(100% - 2rem)"
              position="relative"
              border="1px solid #ccc"
            >
              <MutationsMap
                geoData={geoData2}
                viewState={viewState}
                highlightedMunicipalities={highlightedMunicipalities}
              />
            </Box>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              right: "1.5rem",
              width: 220,
              height: 180,
              border: "1px solid #ccc",
              backgroundColor: "rgba(255, 255, 255, 1)",
            }}
          >
            <MutationsMinimap
              extentViewState={viewState}
              viewState={{
                /** Switzerland */
                latitude: 46.8182,
                longitude: 8.2275,
                zoom: 5,
              }}
            />
          </div>
        </Box>
      </Box>
    </Box>
  );
}
