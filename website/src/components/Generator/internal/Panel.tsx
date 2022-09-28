import * as MUI from "@material-ui/core";
import * as React from "react";
import {
  SupportedColorSchema,
  SUPPORTED_COLOR_LIST
} from "src/domain/color-schema";
import { useContext } from "../context";
import ShapeOption from "./ShapeOption";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = MUI.Paper;

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Panel(props: Props) {
  const classes = useStyles();

  const { ...rest } = props;

  const { state, mutate } = useContext();

  const [simplify, setSimplify] = React.useState(state.options.simplify);

  return (
    <Root elevation={4} className={classes.root} {...rest}>
      {/* <div style={{ marginBottom: 32 }}>
          <MUI.Typography variant="h3">Region</MUI.Typography>
          <MUI.TextField
            fullWidth
            select
            defaultValue="country"
            size="small"
          >
            <MUI.MenuItem value={"country"}>Switzerland</MUI.MenuItem>
          </MUI.TextField>
        </div> */}

      <div className={classes.section}>
        <MUI.Typography variant="h3">Shapes</MUI.Typography>

        <ShapeOption shape="country" label="Switzerland" />
        <ShapeOption shape="cantons" label="Cantons" />
        <ShapeOption shape="municipalities" label="Municipalities" />
        <ShapeOption shape="lakes" label="Lakes" />
      </div>

      {/* Projection */}
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
              control={<MUI.Radio id="wgs84" color="primary" />}
              label="WGS 84"
            />
          </div>

          <div>
            <MUI.FormControlLabel
              style={{ display: "flex" }}
              value="cartesian"
              control={<MUI.Radio id="wgs84" color="primary" />}
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

      {/* Simplification */}
      <div className={classes.section}>
        <MUI.Typography variant="h3">Simplification</MUI.Typography>

        <MUI.Typography variant="body2" color="textSecondary">
          Move the slider to the right to simplify the shapes. This will remove
          detail but also decrease the file size.
        </MUI.Typography>

        <div style={{ marginTop: 8 }}>
          <MUI.Slider
            step={1}
            min={0}
            max={100}
            marks={[
              { value: 0, label: "0" },
              { value: 100, label: "100" },
            ]}
            value={simplify}
            onChange={(_, value) => {
              if (typeof value === "number") {
                mutate((draft) => {
                  setSimplify(value);
                });
              }
            }}
            onChangeCommitted={(_, value) => {
              if (typeof value === "number") {
                mutate((draft) => {
                  setSimplify(value);
                  draft.options.simplify = value;
                });
              }
            }}
          />
        </div>
      </div>

      <div className={classes.section}>
        <MUI.Typography variant="h3">Options</MUI.Typography>

        <div>
          <MUI.FormControlLabel
            control={
              <MUI.Checkbox
                color="primary"
                checked={state.options.withName}
                onChange={(event) => {
                  mutate((draft) => {
                    draft.options.withName = event.currentTarget.checked;
                  });
                }}
              />
            }
            label="Include names"
          />
        </div>
      </div>

      {/* Coloring */}
      <div className={classes.section}>
        <MUI.Typography variant="h3">Color</MUI.Typography>
        <MUI.TextField
          fullWidth
          select
          value={state.options.color}
          onChange={(ev) => {
            mutate((draft) => {
              draft.options.color = ev.target.value as SupportedColorSchema;
            });
          }}
          size="small"
        >
          {SUPPORTED_COLOR_LIST.map((x, i) => (
            <MUI.MenuItem key={i} value={`${x}`}>
              {x}
            </MUI.MenuItem>
          ))}
        </MUI.TextField>
      </div>

      {/* Year */}
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
          {[
            2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
            2021, 2022,
          ]
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
      padding: theme.spacing(5),
      margin: theme.spacing(5, 0, 5, 5),
      width: 400,
      display: "flex",
      flexDirection: "column",
      zIndex: 1,
      borderRadius: 8,
      overflowY: "scroll",
      maxHeight: 700,
      [theme.breakpoints.down("sm")]: {
        width: "auto",
        margin: theme.spacing(2),
      },
    },

    section: {
      marginBottom: theme.spacing(4),

      "& > h3": {
        marginBottom: theme.spacing(0.5),
      },
    },
  }),
  { name: "XuiGenerator:Panel" }
);

export default Panel;
