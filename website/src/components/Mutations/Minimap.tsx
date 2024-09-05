import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { useGeoData } from "src/domain/geodata";

const Minimap = ({
  viewState,
  extentViewState,
}: {
  viewState: { longitude: number; latitude: number; zoom: number };
  extentViewState: { longitude: number; latitude: number; zoom: number };
}) => {
  const { data: geoDataMinimap } = useGeoData({
    year: "2022",
    format: "topojson",
    simplify: 0.02,
    shapes: new Set(["country"]),
    projection: "wgs84",
    color: "default",
    dimensions: { width: 800, height: 600 },
    withName: false,
  });

  return (
    <DeckGL initialViewState={viewState} controller={false}>
      <GeoJsonLayer
        pickable={false}
        stroked={true}
        filled={true}
        getFillColor={[100, 100, 100, 50]}
        extruded={false}
        id="minimap"
        data={geoDataMinimap.country}
      />
      <ScatterplotLayer
        id="window"
        stroked
        filled
        getRadius={() => 10000}
        getPosition={(d) => d.coordinates}
        getFillColor={[0, 0, 255, 50]}
        getLineColor={[0, 0, 0]}
        getLineWidth={10}
        data={[
          {
            coordinates: [extentViewState.longitude, extentViewState.latitude],
          },
        ]}
      />
    </DeckGL>
  );
};

export default Minimap;
