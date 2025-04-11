import dynamic from "next/dynamic";
import * as React from "react";
import { defaultOptions } from "src/shared";
import { useImmer } from "use-immer";
import { Provider, State } from "./context";
import Export from "./internal/Export";
import Panel from "./internal/Panel";
import Stats from "./internal/Stats";
import { styled } from "@mui/material/styles";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = styled("div", {
  name: "SwissMaps-Generator",
  slot: "root",
})(() => ({
  backgroundColor: "#F9F9F9",
  position: "relative",
  contain: "content",
  width: "100%",
}));

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
      <Root ref={ref} id="generator" {...rest}>
        <Container>
          <Panel />
          <Right>
            <Preview deckRef={deckRef} />
            <Export
              deckRef={deckRef}
              style={{ marginTop: "-80px", marginRight: "40px" }}
            />
          </Right>
        </Container>
        <Stats />
      </Root>
    </Provider>
  );
}

const Container = styled("div", {
  name: "SwissMaps-Generator",
  slot: "container",
})(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    "& $right": {
      minHeight: "800px",
    },
  },
}));

const Right = styled("div", {
  name: "SwissMaps-Generator",
  slot: "right",
})(() => ({
  flex: 1,
  position: "relative",
  display: "flex",
  flexDirection: "column",
}));

export default React.forwardRef(Generator);
