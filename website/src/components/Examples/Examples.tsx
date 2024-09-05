import * as React from "react";
import * as MUI from "@material-ui/core";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = "div";

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Examples(props: Props, ref: any) {
  const classes = useStyles();

  const { ...rest } = props;

  return (
    <Root ref={ref} id="examples" className={classes.root} {...rest}>
      <div style={{ textAlign: "center" }}>
        <MUI.Typography variant="subtitle1" color="primary">
          Examples
        </MUI.Typography>
        <MUI.Typography variant="h1" component="h2">
          Made with Swiss Maps
        </MUI.Typography>
      </div>

      <div className={classes.cards}>
        <MUI.Card className={classes.card} elevation={4}>
          <MUI.CardMedia>
            <iframe
              style={{ display: "block" }}
              width="100%"
              height="340"
              frameBorder="0"
              src="https://observablehq.com/embed/@werehamster/swiss-map?cell=map"
            />
          </MUI.CardMedia>
        </MUI.Card>
        <MUI.Card className={classes.card} elevation={4}>
          <MUI.CardMedia>
            <iframe
              style={{ display: "block" }}
              width="100%"
              height="340"
              frameBorder="0"
              src="https://observablehq.com/embed/@werehamster/switzerland-cantons?cell=map"
            />
          </MUI.CardMedia>
        </MUI.Card>
        <MUI.Card className={classes.card} elevation={4}>
          <MUI.CardMedia>
            <iframe
              style={{ display: "block" }}
              width="100%"
              height="340"
              frameBorder="0"
              src="https://observablehq.com/embed/@echoyangyang/swiss-electricity-tariff?cells=chart"
            />
          </MUI.CardMedia>
        </MUI.Card>
        <MUI.Card className={classes.card} elevation={4}>
          <img
            src="/screenshot-mutations.jpg"
            width="100%"
            alt="Screenshot of mutations tool"
          />
          <MUI.Box className={classes.cardFooter}>
            <MUI.Typography className={classes.cardAuthor}>
              InteractiveThings
            </MUI.Typography>
            <MUI.Link className={classes.cardTitle} href="/mutations">
              Municipalities change audit
            </MUI.Link>
          </MUI.Box>
        </MUI.Card>
      </div>
    </Root>
  );
}

const useStyles = MUI.makeStyles(
  (theme) => ({
    root: {
      padding: theme.spacing(15, 3),
    },

    cards: {
      margin: theme.spacing(5, 0),
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "16px",
    },

    card: {
      width: 424,
    },

    cardFooter: {
      backgroundColor: "white",
      borderTop: "1px solid #f0f0f0",
      padding: theme.spacing(1, 2),
      color: "black",
    },

    cardAuthor: {
      fontSize: "13px",
      fontWeight: "bold",
      display: "inline",
      marginRight: "0.375rem",
    },

    cardTitle: {
      fontSize: "13px",
      display: "inline",
      fontWeight: "normal",

      "&:active, &:visited": {
        color: "black",
      },
    },
  }),
  { name: "XuiExamples" }
);

export default React.forwardRef(Examples);
