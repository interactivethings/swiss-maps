import * as React from "react";
import { Shape } from "src/shared";
import * as TUI from "theme-ui";
import { useContext } from "../context";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = TUI.Box;

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Panel(props: Props) {
  const { ...rest } = props;

  const { state, mutate } = useContext();

  return (
    <Root
      sx={{
        position: "absolute",
        top: 40,
        left: 40,
        width: 400,
        background: "white",
        boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        height: 1000,
        zIndex: 1,
      }}
      {...rest}
    >
      <TUI.Box sx={{ padding: "45px" }}>
        <TUI.Box sx={{ my: 20 }}>
          <TUI.Text variant="heading2">Region</TUI.Text>
          <TUI.Select defaultValue="Switzerland">
            <option>Switzerland</option>
          </TUI.Select>
        </TUI.Box>

        <TUI.Box sx={{ my: 20 }}>
          <TUI.Text variant="heading2">Shapes</TUI.Text>

          <TUI.Label>
            <TUI.Checkbox
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
            />{" "}
            Switzerland
          </TUI.Label>
          <TUI.Label>
            <TUI.Checkbox
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
            />{" "}
            Cantons
          </TUI.Label>
          <TUI.Label>
            <TUI.Checkbox
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
            />{" "}
            Districts
          </TUI.Label>
          <TUI.Label>
            <TUI.Checkbox
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
            />{" "}
            Municipalities
          </TUI.Label>
          <TUI.Label>
            <TUI.Checkbox
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
            />{" "}
            Lakes
          </TUI.Label>
        </TUI.Box>

        <TUI.Box sx={{ my: 20 }}>
          <TUI.Text variant="heading2">Projection</TUI.Text>

          <TUI.Label>
            <TUI.Radio /> WGS 84
          </TUI.Label>
          <TUI.Label>
            <TUI.Radio /> Cartesian
          </TUI.Label>
        </TUI.Box>

        <TUI.Box sx={{ my: 20 }}>
          <TUI.Text variant="heading2">Options</TUI.Text>

          <TUI.Label>
            <TUI.Checkbox /> Include names
          </TUI.Label>
        </TUI.Box>

        <TUI.Box sx={{ my: 20 }}>
          <TUI.Text variant="heading2">Year</TUI.Text>
          <TUI.Select defaultValue="2020">
            <option>2020</option>
            <option>2019</option>
            <option>2018</option>
            <option>2017</option>
          </TUI.Select>
        </TUI.Box>
      </TUI.Box>

      <TUI.Box
        sx={{ marginTop: "auto", background: "#e8daee", padding: "45px" }}
      >
        <TUI.Text variant="body2">Download map</TUI.Text>

        <TUI.Box sx={{ display: "flex", gap: 20, mt: 20 }}>
          <TUI.Button sx={{ width: "100%" }}>TopoJSON</TUI.Button>
          <TUI.Button sx={{ width: "100%" }}>SVG</TUI.Button>
        </TUI.Box>
      </TUI.Box>
    </Root>
  );
}

export default Panel;
