import * as MUI from "@mui/material";
import * as React from "react";
import { Download } from "react-feather";
import { downloadUrl } from "src/shared";
import { useContext } from "../context";
import { domDataUrlDownload } from "../domain/dom";
import { makeStyles } from '@mui/styles';

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = "div";

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {
  deckRef: any;
}

function Export(props: Props) {
  const classes = useStyles();

  const { deckRef, ...rest } = props;

  const { state } = useContext();

  function exportCanvas() {
    const deck = deckRef.current?.deck;

    deck.redraw(true);
    const canvas = deck.canvas as HTMLCanvasElement;
    const dataURL = canvas.toDataURL();
    // const dataURL = canvas.toDataURL("image/jpeg", 1.0);
    domDataUrlDownload(dataURL, `swiss-map-${Date.now()}.png`);
  }

  return (
    <Root className={classes.root} {...rest}>
      <MUI.Button
        component="a"
        download
        size="large"
        variant="contained"
        color="primary"
        href={downloadUrl({ ...state.options, format: "topojson" }, "v0")}
        startIcon={<Download />}
      >
        TopoJSON
      </MUI.Button>

      <MUI.Button
        disabled={state.options.projection !== "cartesian"}
        size="large"
        variant="contained"
        color="primary"
        href={downloadUrl({ ...state.options, format: "svg" }, "v0")}
        startIcon={<Download />}
      >
        SVG
      </MUI.Button>

      <MUI.Button
        size="large"
        variant="contained"
        color="primary"
        startIcon={<Download />}
        onClick={exportCanvas}
      >
        PNG
      </MUI.Button>
    </Root>
  );
}

const useStyles = makeStyles(
  (theme) => ({
    root: {
      position: "sticky",
      bottom: 40,
      marginBottom: theme.spacing(5),
      justifyContent: "flex-end",

      display: "flex",
      flexWrap: "nowrap",
      gap: "24px",
      zIndex: theme.zIndex.tooltip,
    },
  }),
  { name: "XuiGenerator:Export" }
);

export default Export;
