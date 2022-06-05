declare type $FixMe = any;

declare module "mapshaper";

declare module "@deck.gl/core" {
  export class MapController {}
  export class FlyToInterpolator {}
  export class WebMercatorViewport {
    constructor(viewState: $FixMe);
    project(lonlat: [number, number]): [number, number];
    unproject(xy: [number, number]): [number, number];
    fitBounds(
      bbox: [[number, number], [number, number]],
      options?: {
        padding?: number;
        offset?: [number, number];
      }
    ): {
      zoom: number;
      longitude: number;
      latitude: number;
    };
  }
}

declare module "@deck.gl/layers" {
  export const GeoJsonLayer: $FixMe;
  export const LineLayer: $FixMe;
  export const PathLayer: $FixMe;
}

declare module "@deck.gl/react" {
  export const DeckGL: $FixMe;
  export default DeckGL;
}