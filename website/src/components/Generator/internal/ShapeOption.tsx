import * as MUI from "@mui/material";
import * as React from "react";
import { Shape } from "src/shared";
import * as colors from "src/theme/colors";
import { useContext } from "../context";
import { makeStyles } from '@mui/styles';

export default function ShapeOption({
  shape,
  label,
}: {
  shape: Shape;
  label: React.ReactNode;
}) {
  const classes = useStyles();
  const { state, mutate } = useContext();

  return (
    <div
      className={classes.root}
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
              const { checked } = event.currentTarget
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
    </div>
  );
}

const useStyles = makeStyles(
  (theme) => ({
    root: {
      margin: theme.spacing(0, -1),
      padding: theme.spacing(0, 1),
      borderRadius: theme.shape.borderRadius,

      "&:hover": {
        backgroundColor: colors.palette.purple[50],
      },
    },
  }),
  { name: "XuiGenerator:ShapeOption" }
);
