import * as React from "react";
import * as MUI from "@mui/material";
import * as colors from "src/theme/colors";
import * as Icons from "@/icons";
import { makeStyles } from '@mui/styles';

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = "div";

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Footer(props: Props, ref: any) {
  const classes = useStyles();

  const { ...rest } = props;

  return (
    <Root ref={ref} className={classes.root} {...rest}>
      <div className={classes.bar}>
        <div className={classes.left}>
          <Icons.InteractiveThingsBrandmark40 />

          <MUI.Typography
            variant="body1"
            style={{ marginLeft: 16, marginRight: "auto" }}
          >
            Swiss Maps is created by Interactive Things.
          </MUI.Typography>
        </div>

        <div className={classes.right}>
          <MUI.Link
            className={classes.website}
            href="https://www.interactivethings.com/"
          >
            Visit Website
          </MUI.Link>

          <MUI.Link
            className={classes.social}
            aria-label="Interactive Things on Facebook"
            href="https://facebook.com/interactivethings/"
          >
            <Icons.Facebook24 />
          </MUI.Link>

          <MUI.Link
            className={classes.social}
            aria-label="Interactive Things on Twitter"
            href="https://twitter.com/ixt"
          >
            <Icons.Twitter24 />
          </MUI.Link>

          <MUI.Link
            className={classes.social}
            aria-label="Interactive Things on Instagram"
            href="https://instagram.com/interactivethings/"
          >
            <Icons.Instagram24 />
          </MUI.Link>
        </div>
      </div>

      <div className={classes.copyright}>
        Copyright © 2020 Interactive Things All rights reserved.
      </div>
    </Root>
  );
}

const useStyles = makeStyles(
  (theme) => ({
    root: {
      padding: theme.spacing(5, 7.5),
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(5, 2, 2),
      },
    },

    bar: {
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
    },
    left: {
      display: "flex",
      alignItems: "center",
    },
    right: {
      display: "flex",
      alignItems: "center",
    },
    website: {
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
    },

    social: {
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
    },

    copyright: {
      ...theme.typography.body2,
      color: theme.palette.text.secondary,
      marginTop: theme.spacing(3),
    },
  }),
  { name: "XuiFooter" }
);

export default React.forwardRef(Footer);
