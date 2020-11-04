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
      <div>Swiss Maps</div>

      <div>
        <h1>Generate TopoJSON from Swisstopo geodata </h1>
        <div>A free tool to generate TopoJSON from Swisstopo geodata</div>
      </div>
    </Root>
  );
}

export default React.forwardRef(Header);
