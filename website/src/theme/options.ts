import shadows from "./shadows";
import * as colors from "./colors";
import { FontStyleOptions } from "@mui/material/styles/createTypography";

const fontStyleOptions: FontStyleOptions = {
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
};

export default {
  palette: {
    primary: {
      main: colors.palette.purple[500],
    },

    text: {
      primary: colors.palette.blue[900],
    },

    background: {
      default: "#fff",
    },
  },

  typography: {
    fontFamily: ["CircularXX", "sans-serif"].join(","),

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
      fontSize: "40px",
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
      fontSize: "24px",
      lineHeight: 1.5, // 36px
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
      fontWeight: fontStyleOptions.fontWeightMedium,
    },
    body2: {
      fontSize: "14px",
      lineHeight: 1.42, // 20px
      fontWeight: fontStyleOptions.fontWeightMedium,
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
  },

  shadows: ["none", ...shadows],

  overrides: {
    MuiOutlinedInput: {
      inputMarginDense: {
        paddingTop: 10,
      },
    },
  },

  props: {
    MuiTextField: {
      variant: "outlined",
    },
  },
} as const;
