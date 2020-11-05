import * as MUI from "@material-ui/core";
import * as qs from "querystring";
import * as React from "react";
import { Shape } from "src/shared";
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
        href={(() => {
          const { shapes, projection, ...q } = state.options;
          return `/api/generate?${qs.encode({
            ...q,
            shapes: [...(shapes?.values() ?? [])].join(","),
            download: "",
          })}`;
        })()}
      >
        TopoJSON
      </MUI.Button>
      <MUI.Button disabled size="large" variant="contained" color="primary">
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
