import * as React from "react";
import * as TUI from "theme-ui";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = TUI.Box;

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Panel(props: Props) {
  const { ...rest } = props;

  return (
    <Root
      sx={{
        position: "absolute",
        top: 40,
        left: 40,
        width: 400,
        background: "white",
        boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.05)",
        padding: "45px",
      }}
      {...rest}
    >
      <TUI.Text variant="heading4">Options</TUI.Text>
    </Root>
  );
}

export default Panel;
