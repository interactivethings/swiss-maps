import * as React from "react";
import * as MUI from "@mui/material";
import * as colors from "src/theme/colors";
import * as Icons from "@/icons";
import { styled } from "@mui/material/styles";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = styled("div", {
  name: "SwissMaps-Footer",
  slot: "root",
})(({ theme }) => ({
  padding: theme.spacing(5, 7.5),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(5, 2, 2),
  },
}));

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Footer(props: Props, ref: any) {
  const { ...rest } = props;

  return (
    <Root ref={ref} {...rest}>
      <Bar>
        <Left>
          <Icons.InteractiveThingsBrandmark40 />

          <MUI.Typography
            variant="body1"
            style={{ marginLeft: 16, marginRight: "auto" }}
          >
            Swiss Maps is created by Interactive Things.
          </MUI.Typography>
        </Left>

        <Right>
          <Website href="https://www.interactivethings.com/">
            Visit Website
          </Website>

          <Social
            aria-label="Interactive Things on Facebook"
            href="https://facebook.com/interactivethings/"
          >
            <Icons.Facebook24 />
          </Social>

          <Social
            aria-label="Interactive Things on Twitter"
            href="https://twitter.com/ixt"
          >
            <Icons.Twitter24 />
          </Social>

          <Social
            aria-label="Interactive Things on Instagram"
            href="https://instagram.com/interactivethings/"
          >
            <Icons.Instagram24 />
          </Social>
        </Right>
      </Bar>

      <Copyright>
        Copyright © 2020 Interactive Things All rights reserved.
      </Copyright>
    </Root>
  );
}

const Bar = styled("div", {
  name: "SwissMaps-Footer",
  slot: "bar",
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: colors.palette.blue[900],
  color: theme.palette.common.white,

  minHeight: theme.spacing(8),
  padding: theme.spacing(0, 3),

  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    padding: theme.spacing(3),
  },
}));

const Left = styled("div", {
  name: "SwissMaps-Footer",
  slot: "left",
})(() => ({
  display: "flex",
  alignItems: "center",
}));

const Right = styled("div", {
  name: "SwissMaps-Footer",
  slot: "right",
})(() => ({
  display: "flex",
  alignItems: "center",
}));

const Website = styled(MUI.Link, {
  name: "SwissMaps-Footer",
  slot: "website",
})(({ theme }) => ({
  borderRadius: "20px",
  height: "40px",
  padding: theme.spacing(0, 3),

  cursor: "pointer",
  whiteSpace: "nowrap",

  color: "white",
  backgroundColor: colors.palette.blue[600],

  marginRight: theme.spacing(1),

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "&:hover": {
    backgroundColor: colors.palette.blue[500],
    textDecoration: "none",
  },
}));

const Social = styled(MUI.Link, {
  name: "SwissMaps-Footer",
  slot: "social",
})(({ theme }) => ({
  cursor: "pointer",
  whiteSpace: "nowrap",

  color: "white",
  backgroundColor: colors.palette.blue[600],

  borderRadius: "50%",
  marginLeft: theme.spacing(2),

  height: "36px",
  width: "36px",
  padding: "0 2px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "&:hover": {
    backgroundColor: colors.palette.blue[500],
    textDecoration: "none",
  },
}));

const Copyright = styled("div", {
  name: "SwissMaps-Footer",
  slot: "copyright",
})(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(3),
}));

export default React.forwardRef(Footer);
