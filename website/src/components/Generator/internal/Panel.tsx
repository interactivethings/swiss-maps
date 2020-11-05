import * as MUI from "@material-ui/core";
import * as qs from "querystring";
import * as React from "react";
import { Shape } from "src/shared";
import { useContext } from "../context";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = MUI.Paper;

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Panel(props: Props) {
  const { ...rest } = props;

  const { state, mutate } = useContext();

  return (
    <Root
      elevation={4}
      style={{
        position: "absolute",
        top: 40,
        left: 40,
        width: 400,
        display: "flex",
        flexDirection: "column",
        height: 1000,
        zIndex: 1,
        borderRadius: 8,
      }}
      {...rest}
    >
      <div style={{ padding: "50px 40px 40px" }}>
        <div style={{ marginBottom: 32 }}>
          <MUI.Typography variant="h3">Region</MUI.Typography>
          <MUI.TextField
            fullWidth
            select
            defaultValue="switzerland"
            size="small"
          >
            <MUI.MenuItem value={"switzerland"}>Switzerland</MUI.MenuItem>
          </MUI.TextField>
        </div>

        <div style={{ marginBottom: 32 }}>
          <MUI.Typography variant="h3">Shapes</MUI.Typography>

          <div>
            <MUI.FormControlLabel
              control={
                <MUI.Checkbox
                  color="primary"
                  checked={state.options.shapes?.has("switzerland")}
                  onChange={(event) => {
                    mutate((draft) => {
                      const shapes = draft.options?.shapes ?? new Set<Shape>();
                      if (event.currentTarget.checked) {
                        shapes.add("switzerland");
                      } else {
                        shapes.delete("switzerland");
                      }
                      draft.options.shapes = shapes;
                    });
                  }}
                />
              }
              label="Switzerland"
            />
          </div>

          <div>
            <MUI.FormControlLabel
              control={
                <MUI.Checkbox
                  color="primary"
                  checked={state.options.shapes?.has("cantons")}
                  onChange={(event) => {
                    mutate((draft) => {
                      const shapes = draft.options?.shapes ?? new Set<Shape>();
                      if (event.currentTarget.checked) {
                        shapes.add("cantons");
                      } else {
                        shapes.delete("cantons");
                      }
                      draft.options.shapes = shapes;
                    });
                  }}
                />
              }
              label="Cantons"
            />
          </div>

          <div>
            <MUI.FormControlLabel
              control={
                <MUI.Checkbox
                  color="primary"
                  checked={state.options.shapes?.has("districts")}
                  onChange={(event) => {
                    mutate((draft) => {
                      const shapes = draft.options?.shapes ?? new Set<Shape>();
                      if (event.currentTarget.checked) {
                        shapes.add("districts");
                      } else {
                        shapes.delete("districts");
                      }
                      draft.options.shapes = shapes;
                    });
                  }}
                />
              }
              label="Districts"
            />
          </div>

          <div>
            <MUI.FormControlLabel
              control={
                <MUI.Checkbox
                  color="primary"
                  checked={state.options.shapes?.has("municipalities")}
                  onChange={(event) => {
                    mutate((draft) => {
                      const shapes = draft.options?.shapes ?? new Set<Shape>();
                      if (event.currentTarget.checked) {
                        shapes.add("municipalities");
                      } else {
                        shapes.delete("municipalities");
                      }
                      draft.options.shapes = shapes;
                    });
                  }}
                />
              }
              label="Municipalities"
            />
          </div>

          <div>
            <MUI.FormControlLabel
              control={
                <MUI.Checkbox
                  color="primary"
                  checked={state.options.shapes?.has("lakes")}
                  onChange={(event) => {
                    mutate((draft) => {
                      const shapes = draft.options?.shapes ?? new Set<Shape>();
                      if (event.currentTarget.checked) {
                        shapes.add("lakes");
                      } else {
                        shapes.delete("lakes");
                      }
                      draft.options.shapes = shapes;
                    });
                  }}
                />
              }
              label="Lakes"
            />
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <MUI.Typography variant="h3">Projection</MUI.Typography>

          <div>
            <MUI.FormControlLabel
              control={<MUI.Radio color="primary" />}
              label="WGS 84"
            />
          </div>

          <div>
            <MUI.FormControlLabel
              control={<MUI.Radio color="primary" />}
              label="Cartesian"
            />
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <MUI.Typography variant="h3">Options</MUI.Typography>

          <div>
            <MUI.FormControlLabel
              control={<MUI.Checkbox color="primary" />}
              label="Include names"
            />
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <MUI.Typography variant="h3">Year</MUI.Typography>
          <MUI.TextField
            fullWidth
            select
            value={state.options.year}
            onChange={(ev) => {
              mutate((draft) => {
                draft.options.year = ev.target.value;
              });
            }}
            size="small"
          >
            {[2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]
              .reverse()
              .map((year) => (
                <MUI.MenuItem key={year} value={`${year}`}>
                  {year}
                </MUI.MenuItem>
              ))}
          </MUI.TextField>
        </div>
      </div>

      <div style={{ marginTop: "auto", background: "#e8daee", padding: 40 }}>
        <MUI.Typography variant="h5" color="primary">
          Download map
        </MUI.Typography>

        <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
          <MUI.Button
            component="a"
            download
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            href={(() => {
              const { shapes, projection, ...q } = state.options;
              return `/api/generate?${qs.encode({
                ...q,
                shapes: [...(shapes?.values() ?? [])].join(","),
                download: "",
              })}`;
            })()}
          >
            TopoJSON
          </MUI.Button>
          <MUI.Button
            disabled
            fullWidth
            size="large"
            variant="contained"
            color="primary"
          >
            SVG
          </MUI.Button>
        </div>
      </div>
    </Root>
  );
}

export default Panel;
