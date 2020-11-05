import { Preview } from "@/components/Preview";
import * as React from "react";
import { Shape } from "src/shared";
import { useImmer } from "use-immer";
import { Provider, State } from "./context";
import Panel from "./internal/Panel";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = "div";

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Generator(props: Props, ref: any) {
  const { ...rest } = props;

  const [state, mutate] = useImmer<State>({
    options: {
      format: "topojson",
      projection: "wgs84",
      year: 2020,
      shapes: new Set(["switzerland", "cantons", "lakes"] as Array<Shape>),
    },
  });

  return (
    <Provider value={{ state, mutate }}>
      <Root
        ref={ref}
        style={{ backgroundColor: "#F9F9F9", height: 1200, position: "relative" }}
        {...rest}
      >
        <Panel />
        <Preview options={state.options} />
      </Root>
    </Provider>
  );
}

export default React.forwardRef(Generator);
