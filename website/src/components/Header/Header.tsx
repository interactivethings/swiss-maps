import * as MUI from "@material-ui/core";
import * as React from "react";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = "div";

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Header(props: Props, ref: any) {
  const { ...rest } = props;

  return (
    <Root ref={ref} {...rest}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "50px 70px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#9958B3",
              position: "relative",
              top: 10,
              marginRight: 20,
            }}
          />
          <MUI.Typography variant="h1">Swiss Maps</MUI.Typography>
        </div>

        <div>
          <MUI.Link
            variant="h4"
            color="textPrimary"
            style={{ padding: "10px 30px" }}
          >
            Generator
          </MUI.Link>
          <MUI.Link
            variant="h4"
            color="textPrimary"
            style={{ padding: "10px 30px" }}
          >
            Gallery
          </MUI.Link>
          <MUI.Link
            variant="h4"
            color="textPrimary"
            style={{ padding: "10px 30px" }}
          >
            Credits
          </MUI.Link>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 40, marginBottom: 80 }}>
        <MUI.Typography
          component="h1"
          variant="h1"
          style={{ maxWidth: 800, margin: "0 auto" }}
        >
          Generate TopoJSON from Swisstopo geodata
        </MUI.Typography>

        <MUI.Typography variant="body1" style={{ marginTop: 20 }}>
          A free tool to generate TopoJSON from Swisstopo geodata
        </MUI.Typography>
      </div>
    </Root>
  );
}

export default React.forwardRef(Header);
