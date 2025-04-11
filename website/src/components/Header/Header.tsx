import * as MUI from "@mui/material";
import Link from "next/link";
import * as React from "react";
import { styled } from "@mui/material/styles";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = styled("div", {
  name: "SwissMaps-Header",
  slot: "root",
})(() => ({
  position: "relative",
}));

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Header(props: Props, ref: any) {
  const { ...rest } = props;

  return (
    <Root ref={ref} {...rest}>
      <Pattern>
        <img src="/pattern.svg" />
        <div />
      </Pattern>

      <Container>
        <div>
          <Link href="/" passHref legacyBehavior>
            <MUI.Link variant="h1" color="primary" underline="none">
              Swiss Maps Generator
            </MUI.Link>
          </Link>
          <MUI.Typography
            variant="body1"
            color="primary"
            style={{ marginTop: 4 }}
          >
            A free tool to generate TopoJSON or SVG from Swisstopo geodata.
          </MUI.Typography>
        </div>

        <Nav>
          <NavItem href="/#examples" variant="h4" color="textPrimary">
            Examples
          </NavItem>
          <NavItem href="/docs" variant="h4" color="textPrimary">
            Documentation
          </NavItem>
          <NavItem
            href="https://github.com/interactivethings/swiss-maps"
            target="_blank"
            variant="h4"
            color="textPrimary"
          >
            GitHub
          </NavItem>
        </Nav>
      </Container>
    </Root>
  );
}

const Pattern = styled("div", {
  name: "SwissMaps-Header",
  slot: "pattern",
})(() => ({
  zIndex: -1,
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.5,
  overflow: "hidden",

  "& img": {
    display: "block",
    width: "100%",
  },

  "& div": {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)",
  },
}));

const Container = styled("div", {
  name: "SwissMaps-Header",
  slot: "container",
})(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "50px 60px",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    padding: theme.spacing(4),
    alignItems: "flex-start",
  },
}));

const Nav = styled("nav", {
  name: "SwissMaps-Header",
  slot: "nav",
})(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(3),
}));

const NavItem = styled(MUI.Link, {
  name: "SwissMaps-Header",
  slot: "navItem",
})(({ theme }) => ({
  padding: theme.spacing(2, 0),
  textDecoration: "none",
}));

export default React.forwardRef(Header);
