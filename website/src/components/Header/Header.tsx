import * as React from "react";
import * as TUI from "theme-ui";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = "div";

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Header(props: Props, ref: any) {
  const { ...rest } = props;

  return (
    <Root ref={ref} {...rest}>
      <TUI.Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "50px 70px",
        }}
      >
        <TUI.Box sx={{ display: "flex", alignItems: "baseline" }}>
          <TUI.Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#9958B3",
              position: "relative",
              top: 10,
              marginRight: 20,
            }}
          />
          <TUI.Text variant="heading1">Swiss Maps</TUI.Text>
        </TUI.Box>

        <TUI.Box>
          <TUI.Link sx={{ padding: "10px 30px" }}>Generator</TUI.Link>
          <TUI.Link sx={{ padding: "10px 30px" }}>Gallery</TUI.Link>
          <TUI.Link sx={{ padding: "10px 30px" }}>Credits</TUI.Link>
        </TUI.Box>
      </TUI.Box>

      <TUI.Box sx={{ textAlign: "center", mt: 40, mb: 80 }}>
        <TUI.Text
          as="h1"
          variant="display1"
          sx={{ maxWidth: 800, margin: "0 auto" }}
        >
          Generate TopoJSON from Swisstopo geodata
        </TUI.Text>

        <TUI.Text variant="body1" sx={{ mt: 20 }}>
          A free tool to generate TopoJSON from Swisstopo geodata
        </TUI.Text>
      </TUI.Box>
    </Root>
  );
}

export default React.forwardRef(Header);
