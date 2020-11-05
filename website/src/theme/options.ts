import { createMuiTheme } from "@material-ui/core";
import createPalette from "@material-ui/core/styles/createPalette";
import createTypography, {
  FontStyleOptions,
} from "@material-ui/core/styles/createTypography";
import shadows from "./shadows";
import * as colors from "./colors";

const t = createMuiTheme({});

const fontFamily = "CircularXX,  sans-serif";

const palette = createPalette({
  primary: {
    main: colors.palette.purple[500],
  },

  background: {
    default: "#fff",
  },
});

const fontStyleOptions: FontStyleOptions = {
  fontFamily,

  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
};

const typography = createTypography(palette, {
  ...fontStyleOptions,

  display1: {
    fontSize: "65px",
    lineHeight: 1,
    fontWeight: fontStyleOptions.fontWeightBold,
    letterSpacing: -1,
    fontFeatureSettings: '"ss02"',
  },
  display2: {
    fontSize: "55px",
    lineHeight: 1.18, // 65px
    fontWeight: fontStyleOptions.fontWeightBold,
    letterSpacing: -2,
    fontFeatureSettings: '"ss02"',
  },

  h1: {
    fontSize: "48px",
    lineHeight: 1,
    fontWeight: fontStyleOptions.fontWeightBold,
    letterSpacing: 0.3,
    fontFeatureSettings: '"ss02"',
  },
  h2: {
    fontSize: "30px",
    lineHeight: 1.16, // 35px
    fontWeight: fontStyleOptions.fontWeightBold,
    letterSpacing: -1,
    fontFeatureSettings: '"ss02"',
  },
  h3: {
    fontSize: "24px",
    lineHeight: 1.33, // 32px
    fontWeight: fontStyleOptions.fontWeightBold,
    letterSpacing: -0.5,
    fontFeatureSettings: '"ss02"',
  },
  h4: {
    fontSize: "18px",
    lineHeight: 1.33, // 24px
    fontWeight: fontStyleOptions.fontWeightBold,
    fontFeatureSettings: '"ss02"',
  },
  h5: {
    fontSize: "18px",
    lineHeight: 1.33, // 24px
    fontWeight: fontStyleOptions.fontWeightMedium,
    letterSpacing: -0.25,
    fontFeatureSettings: '"ss02"',
  },
  h6: {
    fontSize: "0",
  },

  subtitle1: {
    fontSize: "16px",
    lineHeight: 1.5, // 24px
    fontWeight: fontStyleOptions.fontWeightMedium,
    fontFeatureSettings: '"ss02"',
  },
  subtitle2: {
    fontSize: "14px",
    lineHeight: 1.43, // 20px
    fontWeight: fontStyleOptions.fontWeightMedium,
    fontFeatureSettings: '"ss02"',
  },

  body1: {
    fontSize: "16px",
    lineHeight: 1.5, // 24px
    fontWeight: fontStyleOptions.fontWeightRegular,
  },
  body2: {
    fontSize: "14px",
    lineHeight: 1.43, // 20px
    fontWeight: fontStyleOptions.fontWeightRegular,
  },

  button: {
    textTransform: "none",
  },

  caption: {
    fontSize: "14px",
    lineHeight: 1.29, // 18px
    fontWeight: fontStyleOptions.fontWeightRegular,
  },

  overline: {
    fontSize: "12px",
    lineHeight: 1.33, // 16px
    fontWeight: fontStyleOptions.fontWeightMedium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export default {
  palette,

  typography,

  shadows: ["none", ...shadows],

  overrides: {
    MuiFormControlLabel: {
      label: {
        ...typography.subtitle1,
      },
    },
  },

  props: {
    MuiTextField: {
      variant: "outlined",
    },
  },
} as const;
