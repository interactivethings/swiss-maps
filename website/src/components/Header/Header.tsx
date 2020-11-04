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
      <TUI.Box sx={{ height: 100 }}>Swiss Maps</TUI.Box>

      <TUI.Box sx={{ textAlign: "center" }}>
        <TUI.Text as="h1" variant="display1">
          Generate TopoJSON from Swisstopo geodata
        </TUI.Text>

        <TUI.Text variant="body1" sx={{ mt: 8 }}>
          A free tool to generate TopoJSON from Swisstopo geodata
        </TUI.Text>
      </TUI.Box>
    </Root>
  );
}

export default React.forwardRef(Header);
