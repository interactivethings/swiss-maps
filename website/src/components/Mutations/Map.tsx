import { GeoJsonLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { ComponentProps } from "react";
import { useGeoData } from "src/domain/geodata";
import { MapController } from "@deck.gl/core";
import { color } from "d3";

export const LINE_COLOR = [100, 100, 100, 127] as const;
const createColor = (colorString: string) => {
  const d3Color = color(colorString)!;
  const c = d3Color.rgb();
  return {
    hex: colorString,
    array: [c.r, c.g, c.b, c.opacity * 100] as const,
  };
};

export const REMOVED_COLOR = createColor("#ff0000cc");
export const ADDED_COLOR = createColor("#00ff00cc");

const MutationsMap = ({
  highlightedMunicipalities,
  geoData,
  ...props
}: {
  highlightedMunicipalities: {
    added: number[];
    removed: number[];
  };
  geoData: ReturnType<typeof useGeoData>["data"];
} & ComponentProps<typeof DeckGL>) => {
  return (
    <DeckGL
      controller={MapController}
      getTooltip={({
        object,
      }: {
        object: { properties: { name: string } };
      }) => {
        if (!object) {
          return;
        }
        return "Municipality: " + object.properties.name;
      }}
      {...props}
    >
      {geoData.municipalities && (
        <GeoJsonLayer
          id="municipalities"
          data={geoData.municipalities}
          pickable={true}
          stroked={true}
          filled={true}
          extruded={false}
          lineWidthMinPixels={0.5}
          lineWidthMaxPixels={1}
          getLineWidth={200}
          lineMiterLimit={1}
          updateTriggers={{ getFillColor: highlightedMunicipalities }}
          getLineColor={[30, 30, 30]}
          getFillColor={(d: { properties: { id: number } }) => {
            return highlightedMunicipalities.added.includes(d.properties.id)
              ? ADDED_COLOR.array
              : highlightedMunicipalities.removed.includes(d.properties.id)
              ? REMOVED_COLOR.array
              : [255, 255, 255];
          }}
        />
      )}
    </DeckGL>
  );
};

export default MutationsMap;
