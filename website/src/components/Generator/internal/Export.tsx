import * as MUI from "@material-ui/core";
import * as React from "react";
import { Download } from "react-feather";
import { downloadUrl } from "src/shared";
import { useContext } from "../context";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = "div";

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Export(props: Props) {
  const classes = useStyles();

  const { ...rest } = props;

  const { state, mutate } = useContext();

  return (
    <Root className={classes.root} {...rest}>
      <MUI.Button
        component="a"
        download
        size="large"
        variant="contained"
        color="primary"
        href={downloadUrl({ ...state.options, format: "topojson" })}
        startIcon={<Download />}
      >
        TopoJSON
      </MUI.Button>
      <MUI.Button
        disabled={state.options.projection !== "cartesian"}
        size="large"
        variant="contained"
        color="primary"
        href={downloadUrl({ ...state.options, format: "svg" })}
        startIcon={<Download />}
      >
        SVG
      </MUI.Button>
    </Root>
  );
}

const useStyles = MUI.makeStyles(
  (theme) => ({
    root: {
      position: "sticky",
      bottom: 40,
      margin: theme.spacing(5),
      alignSelf: "flex-end",

      display: "flex",
      flexWrap: "nowrap",
      gap: "24px",
    },
  }),
  { name: "XuiGenerator:Export" }
);

export default Export;
