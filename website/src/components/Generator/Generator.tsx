import dynamic from "next/dynamic";
import * as React from "react";
import { defaultOptions } from "src/shared";
import { useImmer } from "use-immer";
import { Provider, State } from "./context";
import Export from "./internal/Export";
import Panel from "./internal/Panel";
import Stats from "./internal/Stats";
import * as MUI from "@mui/material";
import { makeStyles } from '@mui/styles';

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
  const classes = useStyles();
  const deckRef = React.useRef<any>(null);

  const [state, mutate] = useImmer<State>({
    options: defaultOptions,
  });

  return (
    <Provider value={{ state, mutate }}>
      <Root ref={ref} id="generator" className={classes.root} {...rest}>
        <div className={classes.container}>
          <Panel />
          <div className={classes.right}>
            <Preview deckRef={deckRef} />
            <Export deckRef={deckRef} style={{ marginTop: "-80px", marginRight: "40px" }} />
          </div>
        </div>
        <Stats />
      </Root>
    </Provider>
  );
}

const useStyles = makeStyles(
  (theme) => ({
    root: {
      backgroundColor: "#F9F9F9",
      position: "relative",
      contain: "content",
      width: "100%",
    },
    container: {
      display: "flex",
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        "& $right": {
          minHeight: "800px",
        },
      },
    },
    right: {
      flex: 1,
      position: "relative",
      display: "flex",
      flexDirection: "column",
    },
  }),
  { name: "XuiGenerator" }
);

export default React.forwardRef(Generator);
