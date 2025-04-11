import * as React from "react";
import * as MUI from "@mui/material";
import * as colors from "src/theme/colors";
import { GitHub as IcGitHub } from "react-feather";
import { makeStyles } from '@mui/styles';

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = "div";

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function GitHub(props: Props, ref: any) {
  const classes = useStyles();

  const { ...rest } = props;

  return (
    <Root ref={ref} className={classes.root} {...rest}>
      <IcGitHub width="72" height="72" />
      <MUI.Typography variant="subtitle1">
        Swiss Maps is open source and freely available on GitHub.
      </MUI.Typography>
      <MUI.Button
        component="a"
        href="https://github.com/interactivethings/swiss-maps"
        variant="contained"
        color="primary"
        style={{ marginTop: 20 }}
      >
        See GitHub repo
      </MUI.Button>
    </Root>
  );
}

const useStyles = makeStyles(
  (theme) => ({
    root: {
      backgroundColor: colors.palette.purple[100],
      padding: theme.spacing(10, 5),
      textAlign: "center",
    },
  }),
  { name: "XuiGitHub" }
);

export default React.forwardRef(GitHub);
