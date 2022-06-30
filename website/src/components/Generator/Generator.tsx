import dynamic from "next/dynamic";
import * as React from "react";
import { defaultOptions } from "src/shared";
import { useImmer } from "use-immer";
import { Provider, State } from "./context";
import Export from "./internal/Export";
import Panel from "./internal/Panel";
import Stats from "./internal/Stats";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = "div";

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

const Preview = dynamic(() => import("./internal/WrappedPreview"), {
  ssr: false,
});

function Generator(props: Props, ref: any) {
  const { ...rest } = props;
  const deckRef = React.useRef<any>(null);

  const [state, mutate] = useImmer<State>({
    options: defaultOptions,
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
        <Preview deckRef={deckRef} />
        <Panel />
        <Export deckRef={deckRef} />
        <Stats />
      </Root>
    </Provider>
  );
}

export default React.forwardRef(Generator);
