import cityData from "public/swiss-city-topo.json";
import { useQuery } from "react-query";
import { previewSourceUrl } from "src/shared";
import * as topojson from "topojson";
import { Value } from "../components/Generator/context";
import { MultiPolygon } from "geojson";
import { Feature, Geometry, GeoJsonProperties } from "geojson";

export type GeoDataFeature = Feature<Geometry, GeoJsonProperties>;

const castFeatures = (d: any) => {
  return d as { features: GeoDataFeature[] };
};

const getGeoData = (json: any) => {
  const geoData = {
    country: json.objects?.country
      ? castFeatures(topojson.feature(json, json.objects.country))
      : undefined,
    cantons: json.objects?.cantons
      ? castFeatures(topojson.feature(json, json.objects.cantons))
      : undefined,
    neighbors: json.objects?.cantons
      ? topojson.neighbors(json.objects.cantons.geometries)
      : undefined,
    municipalities: json.objects?.municipalities
      ? castFeatures(topojson.feature(json, json.objects.municipalities))
      : undefined,
    lakes: json.objects?.lakes
      ? castFeatures(topojson.feature(json, json.objects.lakes))
      : undefined,
    city: cityData
      ? castFeatures(
          topojson.feature(
            cityData as any,
            cityData.objects["swiss-city"] as any
          )
        )
      : undefined,
  };
  return geoData;
};

const fetchGeoData = (options: Value["state"]["options"]) => {
  return fetch(previewSourceUrl(options, "v0"))
    .then((res) => res.json())
    .then((json) => {
      console.log({ json });
      return getGeoData(json);
    });
};

export const useGeoData = (
  options: Omit<Value["state"]["options"], "year"> & {
    year: undefined | string;
  },
  queryOptions?: {
    enabled?: boolean;
  }
) => {
  const query = useQuery({
    queryKey: ["geoData", options.year!, options.simplify, ...options.shapes],
    queryFn: () =>
      options ? fetchGeoData(options as Value["state"]["options"]) : undefined,
    enabled: options && options.year ? queryOptions?.enabled : false,
  });

  return {
    ...query,
    // TODO replace by initialData once react-query is upgraded to v4
    // https://github.com/TanStack/query/discussions/1331#discussioncomment-4802682
    data: query.data ?? {
      country: undefined,
      cantons: undefined,
      neighbors: undefined as Array<number[]> | undefined,
      municipalities: undefined,
      lakes: undefined,
      city: undefined,
    },
  };
};
