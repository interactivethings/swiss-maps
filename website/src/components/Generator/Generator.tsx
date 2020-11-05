import dynamic from "next/dynamic";
import * as React from "react";
import { defaultOptions } from "src/shared";
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
    options: defaultOptions
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
          justifyContent: "space-between",
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
