import dynamic from "next/dynamic";
import * as React from "react";
import { Shape } from "src/shared";
import { useImmer } from "use-immer";
import { Provider, State } from "./context";
import Export from "./internal/Export";
import Panel from "./internal/Panel";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = "div";

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

const Preview = dynamic(() => import("./internal/Preview"), {
  ssr: false,
});

function Generator(props: Props, ref: any) {
  const { ...rest } = props;

  const [state, mutate] = useImmer<State>({
    options: {
      format: "topojson",
      projection: "wgs84",
      year: "2020",
      shapes: new Set(["switzerland", "cantons", "lakes"] as Array<Shape>),
    },
  });

  return (
    <Provider value={{ state, mutate }}>
      <Root
        ref={ref}
        id="generator"
        style={{
          backgroundColor: "#F9F9F9",
          position: "relative",
          contain: "content",
          display: "flex",
          justifyContent: "spece-between",
        }}
        {...rest}
      >
        <Preview />
        <Panel />
        <Export />
      </Root>
    </Provider>
  );
}

export default React.forwardRef(Generator);
