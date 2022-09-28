import * as MUI from "@material-ui/core";
import Link from "next/link";
import * as React from "react";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = "div";

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Header(props: Props, ref: any) {
  const classes = useStyles();

  const { ...rest } = props;

  return (
    <Root ref={ref} className={classes.root} {...rest}>
      <div className={classes.pattern}>
        <img src="/pattern.svg" />
        <div />
      </div>

      <div className={classes.constainer}>
        <div>
          <Link href="/" passHref>
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

        <nav className={classes.nav}>
          <MUI.Link
            href="/#examples"
            variant="h4"
            color="textPrimary"
            className={classes.navItem}
          >
            Examples
          </MUI.Link>
          <MUI.Link
            href="/docs"
            variant="h4"
            color="textPrimary"
            className={classes.navItem}
          >
            Documentation
          </MUI.Link>
          <MUI.Link
            href="https://github.com/interactivethings/swiss-maps"
            target="_blank"
            variant="h4"
            color="textPrimary"
            className={classes.navItem}
          >
            GitHub
          </MUI.Link>
        </nav>
      </div>
    </Root>
  );
}

const useStyles = MUI.makeStyles(
  (theme) => ({
    root: {
      position: "relative",
    },

    constainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "50px 60px",
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        padding: theme.spacing(4),
        alignItems: "flex-start",
      },
    },

    nav: {
      display: "flex",
      flexWrap: "wrap",
      gap: theme.spacing(3),
    },
    navItem: {
      padding: theme.spacing(2, 0),
    },

    pattern: {
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
    },

    title: {
      ...theme.typography.display1,
      maxWidth: 800,
      margin: "0 auto",
    },
    subtitle: {
      ...theme.typography.body1,
      marginTop: theme.spacing(3),
    },
  }),
  { name: "XuiHeader" }
);

export default React.forwardRef(Header);
