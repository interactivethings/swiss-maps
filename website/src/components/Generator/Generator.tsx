import { Preview } from "@/components/Preview";
import * as React from "react";
import { Options, Shape } from "src/shared";
import * as TUI from "theme-ui";
import { useImmer } from "use-immer";
import Panel from "./internal/Panel";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = TUI.Box;

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

interface State {
  options: Options;
}

function Generator(props: Props, ref: any) {
  const { ...rest } = props;

  const [state, mutate] = useImmer<State>({
    options: {
      format: "topojson",
      projection: "wgs84",
      year: 2020,
      shapes: new Set(["switzerland"] as Array<Shape>),
    },
  });

  return (
    <Root
      ref={ref}
      sx={{ bg: "#F9F9F9", height: 1200, position: "relative" }}
      {...rest}
    >
      <Panel />
      <Preview options={state.options} />
    </Root>
  );
}

export default React.forwardRef(Generator);
