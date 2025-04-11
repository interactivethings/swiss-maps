import * as React from "react";
import * as MUI from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = styled("div", {
  name: "SwissMaps-Examples",
  slot: "root",
})(({ theme }) => ({
  padding: theme.spacing(15, 3),
}));

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Examples(props: Props, ref: any) {
  const { ...rest } = props;

  return (
    <Root ref={ref} id="examples" {...rest}>
      <div style={{ textAlign: "center" }}>
        <MUI.Typography variant="subtitle1" color="primary">
          Examples
        </MUI.Typography>
        <MUI.Typography variant="h1" component="h2">
          Made with Swiss Maps
        </MUI.Typography>
      </div>

      <Cards>
        <Card elevation={4}>
          <MUI.CardMedia>
            <iframe
              style={{ display: "block" }}
              width="100%"
              height="340"
              frameBorder="0"
              src="https://observablehq.com/embed/@werehamster/swiss-map?cell=map"
            />
          </MUI.CardMedia>
        </Card>
        <Card elevation={4}>
          <MUI.CardMedia>
            <iframe
              style={{ display: "block" }}
              width="100%"
              height="340"
              frameBorder="0"
              src="https://observablehq.com/embed/@werehamster/switzerland-cantons?cell=map"
            />
          </MUI.CardMedia>
        </Card>
        <Card elevation={4}>
          <MUI.CardMedia>
            <iframe
              style={{ display: "block" }}
              width="100%"
              height="340"
              frameBorder="0"
              src="https://observablehq.com/embed/@echoyangyang/swiss-electricity-tariff?cells=chart"
            />
          </MUI.CardMedia>
        </Card>
        <Card elevation={4}>
          <img
            src="/screenshot-mutations.jpg"
            width="100%"
            alt="Screenshot of mutations tool"
          />
          <CardFooter>
            <CardAuthor>InteractiveThings</CardAuthor>
            <CardTitle href="/mutations">Municipalities change audit</CardTitle>
          </CardFooter>
        </Card>
      </Cards>
    </Root>
  );
}

const Cards = styled("div", {
  name: "SwissMaps-Examples",
  slot: "cards",
})(({ theme }) => ({
  margin: theme.spacing(5, 0),
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "16px",
}));

const Card = styled(MUI.Card, {
  name: "SwissMaps-Examples",
  slot: "card",
})(() => ({
  width: 424,
}));

const CardFooter = styled("div", {
  name: "SwissMaps-Examples",
  slot: "cardFooter",
})(({ theme }) => ({
  backgroundColor: "white",
  borderTop: "1px solid #f0f0f0",
  padding: theme.spacing(1, 2),
  color: "black",
}));

const CardAuthor = styled(MUI.Typography, {
  name: "SwissMaps-Examples",
  slot: "cardAuthor",
})(() => ({
  fontSize: "13px",
  fontWeight: "bold",
  display: "inline",
  marginRight: "0.375rem",
}));

const CardTitle = styled(MUI.Link, {
  name: "SwissMaps-Examples",
  slot: "cardTitle",
})(() => ({
  fontSize: "13px",
  display: "inline",
  fontWeight: "normal",
  textDecoration: "none",

  "&:active, &:visited": {
    color: "black",
  },
}));

export default React.forwardRef(Examples);
