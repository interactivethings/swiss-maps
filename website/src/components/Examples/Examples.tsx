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
          Electricity Price Website
        </MUI.Card>
        <MUI.Card className={classes.card} elevation={4}>
          Covid-19 Dashboard
        </MUI.Card>
      </div>
    </Root>
  );
}

const useStyles = MUI.makeStyles(
  (theme) => ({
    root: {
      padding: theme.spacing(20, 3),
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
  }),
  { name: "XuiExamples" }
);

export default React.forwardRef(Examples);
