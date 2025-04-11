import * as MUI from "@mui/material";
import * as React from "react";
import { Shape } from "src/shared";
import * as colors from "src/theme/colors";
import { useContext } from "../context";
import { styled } from "@mui/material/styles";

const Root = styled("div", {
  name: "SwissMaps-Generator-ShareOption",
  slot: "root",
})(({ theme }) => ({
  margin: theme.spacing(0, -1),
  padding: theme.spacing(0, 1),
  borderRadius: theme.shape.borderRadius,

  "&:hover": {
    backgroundColor: colors.palette.purple[50],
  },
}));

export default function ShapeOption({
  shape,
  label,
}: {
  shape: Shape;
  label: React.ReactNode;
}) {
  const { state, mutate } = useContext();

  return (
    <Root
      onMouseEnter={() => {
        mutate((draft) => {
          draft.highlightedShape = shape;
        });
      }}
      onMouseLeave={() => {
        mutate((draft) => {
          draft.highlightedShape = undefined;
        });
      }}
    >
      <MUI.FormControlLabel
        style={{ display: "flex" }}
        control={
          <MUI.Checkbox
            id={shape}
            color="primary"
            checked={state.options.shapes.has(shape)}
            onChange={(event) => {
              const { checked } = event.currentTarget;
              mutate((draft) => {
                if (checked) {
                  draft.options.shapes.add(shape);
                } else {
                  draft.options.shapes.delete(shape);
                }
              });
            }}
          />
        }
        label={label}
      />
    </Root>
  );
}
