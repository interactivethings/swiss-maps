import * as MUI from "@material-ui/core";
import * as React from "react";
import { Shape } from "src/shared";
import * as colors from "src/theme/colors";
import { useContext } from "../context";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = MUI.Paper;

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Panel(props: Props) {
  const classes = useStyles();

  const { ...rest } = props;

  const { state, mutate } = useContext();

  return (
    <Root elevation={4} className={classes.root} {...rest}>
      {/* <div style={{ marginBottom: 32 }}>
          <MUI.Typography variant="h3">Region</MUI.Typography>
          <MUI.TextField
            fullWidth
            select
            defaultValue="switzerland"
            size="small"
          >
            <MUI.MenuItem value={"switzerland"}>Switzerland</MUI.MenuItem>
          </MUI.TextField>
        </div> */}

      <div className={classes.section}>
        <MUI.Typography variant="h3">Shapes</MUI.Typography>

        <ShapeOption shape="switzerland" label="Switzerland" />
        <ShapeOption shape="cantons" label="Cantons" />
        <ShapeOption shape="municipalities" label="Municipalities" />
        <ShapeOption shape="lakes" label="Lakes" />
      </div>

      <div className={classes.section}>
        <MUI.Typography variant="h3">Projection</MUI.Typography>

        <MUI.RadioGroup
          name="projection"
          value={state.options.projection}
          onChange={(ev) => {
            mutate((draft) => {
              draft.options.projection = ev.target.value as $FixMe;
            });
          }}
        >
          <div>
            <MUI.FormControlLabel
              style={{ display: "flex" }}
              value="wgs84"
              control={<MUI.Radio color="primary" />}
              label="WGS 84"
            />
          </div>

          <div>
            <MUI.FormControlLabel
              style={{ display: "flex" }}
              value="cartesian"
              control={<MUI.Radio color="primary" />}
              label="Cartesian"
            />

            <div style={{ display: "flex", gap: "16px", marginLeft: 32 }}>
              <MUI.TextField
                size="small"
                disabled={state.options.projection !== "cartesian"}
                InputProps={{
                  startAdornment: (
                    <MUI.InputAdornment position="start">W</MUI.InputAdornment>
                  ),
                }}
                value={state.options.dimensions.width}
                onChange={(ev) => {
                  mutate((draft) => {
                    draft.options.dimensions.width = +ev.currentTarget.value;
                  });
                }}
              />
              <MUI.TextField
                size="small"
                disabled={state.options.projection !== "cartesian"}
                InputProps={{
                  startAdornment: (
                    <MUI.InputAdornment position="start">H</MUI.InputAdornment>
                  ),
                }}
                value={state.options.dimensions.height}
                onChange={(ev) => {
                  mutate((draft) => {
                    draft.options.dimensions.height = +ev.currentTarget.value;
                  });
                }}
              />
            </div>
          </div>
        </MUI.RadioGroup>
      </div>

      <div className={classes.section}>
        <MUI.Typography variant="h3">Options</MUI.Typography>

        <div>
          <MUI.FormControlLabel
          disabled
            control={<MUI.Checkbox color="primary" />}
            label="Include names"
          />
        </div>
      </div>

      <div className={classes.section}>
        <MUI.Typography variant="h3">Year</MUI.Typography>
        <MUI.TextField
          fullWidth
          select
          value={state.options.year}
          onChange={(ev) => {
            mutate((draft) => {
              draft.options.year = ev.target.value;
            });
          }}
          size="small"
        >
          {[2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]
            .reverse()
            .map((year) => (
              <MUI.MenuItem key={year} value={`${year}`}>
                {year}
              </MUI.MenuItem>
            ))}
        </MUI.TextField>
      </div>
    </Root>
  );
}

const useStyles = MUI.makeStyles(
  (theme) => ({
    root: {
      margin: theme.spacing(5),
      padding: theme.spacing(5),
      width: 400,
      display: "flex",
      flexDirection: "column",
      zIndex: 1,
      borderRadius: 8,
    },

    section: {
      marginBottom: theme.spacing(4),

      "& > h3": {
        marginBottom: theme.spacing(0.5),
      },
    },

    shape: {
      margin: theme.spacing(0, -1),
      padding: theme.spacing(0, 1),
      borderRadius: theme.shape.borderRadius,

      "&:hover": {
        backgroundColor: colors.palette.purple[50],
      },
    },
  }),
  { name: "XuiGenerator:Panel" }
);

export default Panel;

function ShapeOption({
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
      className={classes.shape}
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
            color="primary"
            checked={state.options.shapes.has(shape)}
            onChange={(event) => {
              mutate((draft) => {
                if (event.currentTarget.checked) {
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
