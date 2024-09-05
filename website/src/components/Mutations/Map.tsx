import { GeoJsonLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import React, { ComponentProps } from "react";
import { useGeoData } from "src/domain/geodata";
import { MapController } from "@deck.gl/core";

export const LINE_COLOR = [100, 100, 100, 127] as const;

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
    <DeckGL controller={MapController} {...props}>
      {geoData.municipalities && (
        <GeoJsonLayer
          id="municipalities"
          data={geoData.municipalities}
          pickable={false}
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
              ? [0, 255, 0, 100]
              : highlightedMunicipalities.removed.includes(d.properties.id)
              ? [255, 0, 0, 100]
              : [255, 255, 255];
          }}
        />
      )}
    </DeckGL>
  );
};

export default MutationsMap;
