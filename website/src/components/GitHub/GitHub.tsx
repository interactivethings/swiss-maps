import * as React from "react";
import * as MUI from "@mui/material";
import * as colors from "src/theme/colors";
import { GitHub as IcGitHub } from "react-feather";
import { styled } from "@mui/material/styles";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = styled("div", {
  name: "SwissMaps-GitHub",
  slot: "root",
})(({ theme }) => ({
  backgroundColor: colors.palette.purple[100],
  padding: theme.spacing(10, 5),
  textAlign: "center",
}));

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function GitHub(props: Props, ref: any) {
  const { ...rest } = props;

  return (
    <Root ref={ref} {...rest}>
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

export default React.forwardRef(GitHub);
