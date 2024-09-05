import { MapController } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import * as MUI from "@material-ui/core";
import clsx from "clsx";
import * as d3 from "d3";
import * as React from "react";
import { COLOR_SCHEMA_MAP } from "src/domain/color-schema";
import { useImmer } from "use-immer";
import { useContext, Value } from "../context";
import { CH_BBOX, constrainZoom, LINE_COLOR } from "../domain/deck-gl";
import { useGeoData } from "src/domain/geodata";

interface Props {}

// Viewport settings
const INITIAL_VIEW_STATE = {
  latitude: 46.8182,
  longitude: 8.2275,
  zoom: 2,
  maxZoom: 16,
  minZoom: 2,
  pitch: 0,
  bearing: 0,
};

export const Preview = React.forwardRef(({}: Props, deckRef: any) => {
  const classes = useStyles();
  const ctx = useContext();
  const { options } = ctx.state;

  const [state, mutate] = useImmer({
    viewState: INITIAL_VIEW_STATE,
  });

  const query = useGeoData(options);
  const { data: geoData, isFetching } = query;

  /*
  const onViewStateChange = React.useCallback(
    ({ viewState, interactionState }) => {
      mutate((draft) => {
        if (interactionState.inTransition) {
          draft.viewState = viewState;
        } else {
          draft.viewState = constrainZoom(viewState, CH_BBOX);
        }
      });
    },
    []
  );
  */

  const onResize = React.useCallback(
    ({ width, height }: { width: number; height: number }) => {
      mutate((draft) => {
        draft.viewState = constrainZoom(
          { ...draft.viewState, width, height },
          CH_BBOX
        );
      });
    },
    [mutate]
  );

  /**
   * Automatic map coloring
   * See https://observablehq.com/@mbostock/map-coloring
   * */
  const colorIndex = (() => {
    const { cantons, neighbors } = geoData;
    if (!neighbors) {
      return undefined;
    }
    const index = new Int32Array(cantons ? cantons.features.length : 0);
    for (let i = 0; i < index.length; ++i) {
      index[i] = ((d3.max(neighbors[i], (j) => index[j]) as number) + 1) | 0;
    }
    return index;
  })();

  const getColor = React.useMemo(() => {
    const color = COLOR_SCHEMA_MAP[options.color];
    if (!color) return () => "#eee";

    return (
      d3
        .scaleOrdinal<string>()
        // domain is decided by coloring item size
        // currently only support cantons
        // if not exist, a random number 30 is assigned
        .domain([
          "1",
          geoData?.cantons?.features?.length
            ? `${geoData?.cantons?.features?.length}`
            : "30",
        ])
        .range(color)
    );
  }, [options.color, geoData.cantons]);

  return (
    <div className={clsx(classes.root)}>
      {isFetching && (
        <div className={classes.loader}>
          <MUI.Fade in style={{ transitionDelay: "800ms" }}>
            <MUI.CircularProgress variant="indeterminate" size={300} />
          </MUI.Fade>
        </div>
      )}

      <div className={classes.deck}>
        <DeckGL
          ref={deckRef}
          controller={{ type: MapController }}
          viewState={state.viewState}
          // onViewStateChange={onViewStateChange}
          onResize={onResize}
        >
          {options.shapes.has("country") && (
            <GeoJsonLayer
              id="country"
              data={geoData?.country}
              pickable={false}
              stroked={true}
              filled={false}
              extruded={false}
              getLineColor={[0, 0, 0, 255]}
              getRadius={100}
              lineWidthUnits="pixels"
              getLineWidth={1}
              lineMiterLimit={1}
            />
          )}

          {options.shapes.has("cantons") && (
            <GeoJsonLayer
              id="cantons"
              data={geoData.cantons}
              pickable={false}
              stroked={true}
              filled={true}
              getFillColor={(d: any, { index }: { index: number }) => {
                if (!colorIndex) {
                  return [230, 230, 230];
                }
                const c = getColor(String(colorIndex[index]));
                const { r, g, b } = d3.color(c) as d3.RGBColor;
                return [r, g, b];
              }}
              extruded={false}
              lineWidthMinPixels={1.2}
              lineWidthMaxPixels={3.6}
              getLineWidth={200}
              lineMiterLimit={1}
              getLineColor={[120, 120, 120]}
              // update layer when option.color change
              updateTriggers={{ getFillColor: [options.color] }}
            />
          )}

          {geoData.municipalities && options.shapes.has("municipalities") && (
            <GeoJsonLayer
              id="municipalities"
              data={geoData.municipalities}
              pickable={false}
              stroked={true}
              filled={false}
              getFillColor={[230, 230, 230]}
              extruded={false}
              lineWidthMinPixels={0.5}
              lineWidthMaxPixels={1}
              getLineWidth={200}
              lineMiterLimit={1}
              getLineColor={[255, 0, 0, 255]}
            />
          )}

          {options.shapes.has("lakes") && (
            <GeoJsonLayer
              id="lakes"
              data={geoData.lakes}
              pickable={false}
              stroked={true}
              filled={true}
              extruded={false}
              lineWidthMinPixels={0.5}
              lineWidthMaxPixels={1}
              getLineWidth={100}
              getFillColor={[102, 175, 233]}
              getLineColor={LINE_COLOR}
            />
          )}

          {/* City labels */}
          {options.withName && (
            <GeoJsonLayer
              id="city"
              data={geoData?.city}
              pickable={false}
              stroked={true}
              filled={false}
              extruded={false}
              getLineColor={[0, 0, 0, 255]}
              getRadius={100}
              lineWidthUnits="pixels"
              getLineWidth={1}
              lineMiterLimit={1}
              pointType="circle+text"
              getText={(f: any) => f.properties.NAME}
              getTextSize={12}
              getTextPixelOffset={[0, 8]}
              textFontFamily="CircularXX"
              textCharacterSet="auto"
              pointRadiusScale={5}
            />
          )}

          {ctx.state.highlightedShape &&
            options.shapes.has(ctx.state.highlightedShape) &&
            (() => {
              const data = geoData[
                ctx.state.highlightedShape as keyof typeof geoData
              ] as $FixMe;

              if (ctx.state.highlightedShape === "lakes") {
                return (
                  <GeoJsonLayer
                    id="highlight"
                    data={data}
                    pickable={false}
                    stroked={false}
                    filled={true}
                    extruded={false}
                    getFillColor={[107, 61, 125]}
                  />
                );
              } else {
                return (
                  <GeoJsonLayer
                    id="highlight"
                    data={data}
                    pickable={false}
                    stroked={true}
                    filled={false}
                    extruded={false}
                    lineWidthUnits="pixels"
                    getLineWidth={2}
                    getLineColor={[107, 61, 125]}
                  />
                );
              }
            })()}
        </DeckGL>
      </div>
    </div>
  );
});

const useStyles = MUI.makeStyles(
  (theme) => ({
    root: {
      zIndex: 1,
      position: "relative",
      height: "100%",
      flex: 1,
    },
    deck: {
      pointerEvents: "none",
    },
    loader: {
      position: "absolute",
      zIndex: 2,
      top: 0,
      left: -theme.spacing(55),
      paddingLeft: theme.spacing(55),
      right: 0,
      bottom: 0,
      pointerEvents: "none",

      display: "grid",
      placeItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.05)",

      transition: theme.transitions.create("all", {
        duration: theme.transitions.duration.short,
      }),
    },
  }),
  { name: "XuiGenerator:Preview" }
);
