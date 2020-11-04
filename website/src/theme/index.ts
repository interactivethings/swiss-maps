import { palette } from "./colors";

const fluid = (
  prop: string,
  min: number,
  max: number,
  f: (n: number) => unknown
) => ({
  [prop]: [f(min), f((min + max) / 2), f(max)],
});

const px = (n: number): string => `${n}px`;
const tracking = (n: number): string => `${n / 100}em`;

export default {
  colors: {
    palette,

    text: palette.blue["900"],
    background: "#FFFFFF",
  },

  fonts: {
    body: "CircularXX, sans-serif",
    heading: "CircularXX, sans-serif",
  },
  fontWeights: {
    bold: 700,
    medium: 500,
    book: "normal",
  },

  sizes: {
    narrow: 835,
    wide: 1280,
  },

  radii: {
    regular: "4px",
  },

  styles: {
    root: {
      fontFamily: "body",
    },
    hr: {
      color: "palette.monochrome.400",
    },
    a: {
      color: "palette.yellow.800",
      textDecoration: "none",

      "&:hover": {
        color: "palette.yellow.700",
      },
    },
  },

  /**
   *
   * ~~~ Layout ~~~
   *
   *     0px - 0
   *    16px - 1
   *    24px - 2
   *    32px - 3
   *    48px - 4
   *    64px - 5
   *    96px - 6
   *   160px - 7
   *
   * ~~~ Component ~~~
   *
   *     0px - 0
   *     2px - 1
   *     4px - 2
   *     8px - 3
   *    12px - 4
   *    16px - 5
   *    20px - 6
   *    24px - 7
   */
  space: {
    layout: [0, 16, 24, 32, 48, 64, 96, 160],
    component: [0, 2, 4, 8, 12, 16, 20],
  },

  text: {
    display1: {
      fontWeight: "bold",
      ...fluid("fontSize", 38, 65, px),
      ...fluid("lineHeight", 44, 65, px),
      ...fluid("letterSpacing", -1, -1, tracking),
      fontFeatureSettings: '"ss02"',
    },
    display2: {
      fontWeight: "book",
      ...fluid("fontSize", 34, 55, px),
      ...fluid("lineHeight", 42, 65, px),
      ...fluid("letterSpacing", -1, -2, tracking),
      fontFeatureSettings: '"ss02"',
    },
    heading1: {
      fontWeight: "bold",
      ...fluid("fontSize", 30, 48, px),
      ...fluid("lineHeight", 36, 48, px),
      ...fluid("letterSpacing", 0, -1, tracking),
      fontFeatureSettings: '"ss02"',
    },
    heading2: {
      fontWeight: "bold",
      ...fluid("fontSize", 20, 30, px),
      ...fluid("lineHeight", 28, 35, px),
      ...fluid("letterSpacing", 0, -1, tracking),
      fontFeatureSettings: '"ss02"',
    },
    heading3: {
      fontWeight: "bold",
      ...fluid("fontSize", 18, 24, px),
      ...fluid("lineHeight", 24, 32, px),
      ...fluid("letterSpacing", -0.5, -0.5, tracking),
      fontFeatureSettings: '"ss02"',
    },
    heading4: {
      fontWeight: "bold",
      ...fluid("fontSize", 16, 18, px),
      ...fluid("lineHeight", 22, 24, px),
      ...fluid("letterSpacing", 0, -0.25, tracking),
      fontFeatureSettings: '"ss02"',
    },
    heading5: {
      fontWeight: "medium",
      ...fluid("fontSize", 16, 18, px),
      ...fluid("lineHeight", 22, 24, px),
      ...fluid("letterSpacing", 0, -0.25, tracking),
      fontFeatureSettings: '"ss02"',
    },
    body1: {
      fontWeight: "book",
      ...fluid("fontSize", 18, 24, px),
      ...fluid("lineHeight", 26, 36, px),
    },
    body2: {
      fontWeight: "book",
      ...fluid("fontSize", 16, 18, px),
      ...fluid("lineHeight", 26, 28, px),
    },
    body3: {
      fontWeight: "book",
      ...fluid("fontSize", 14, 16, px),
      ...fluid("lineHeight", 20, 26, px),
    },
    body4: {
      fontWeight: "book",
      ...fluid("fontSize", 12, 14, px),
      ...fluid("lineHeight", 16, 20, px),
    },
  },

  buttons: {
    icon: {
      width: 56,
      height: 56,
      borderRadius: "50%",
      color: "white",
      bg: "palette.monochrome.400",
      cursor: "pointer",
      border: "1px solid transparent",
      outline: "1px solid transparent",

      "&:hover": {
        bg: "palette.yellow.700",
      },
      "&:focus:not(.focus-visible)": {
        outline: "none",
      },
      "&.focus-visible": {
        borderRadius: "50px",
        outline: "none",
        boxShadow:
          "rgba(255,153,0,1) 0px 0px 0px 1px, rgba(255,153,0,0.3) 0px 0px 0px 4px",
      },
      "&:focus-visible": {
        borderRadius: "50px",
        outline: "none",
        boxShadow:
          "rgba(255,153,0,1) 0px 0px 0px 1px, rgba(255,153,0,0.3) 0px 0px 0px 4px",
      },
    },
    activeIcon: {
      variant: "buttons.icon",
      bg: "palette.yellow.700",
      cursor: "inherit",
      border: "1px solid transparent",
      outline: "1px solid transparent",

      "&:focus:not(.focus-visible)": {
        outline: "none",
      },
      "&.focus-visible": {
        borderRadius: "50px",
        outline: "none",
        boxShadow:
          "rgba(255,153,0,1) 0px 0px 0px 1px, rgba(255,153,0,0.3) 0px 0px 0px 4px",
      },
      "&:focus-visible": {
        borderRadius: "50px",
        outline: "none",
        boxShadow:
          "rgba(255,153,0,1) 0px 0px 0px 1px, rgba(255,153,0,0.3) 0px 0px 0px 4px",
      },
    },
    form: {
      fontFamily: "inherit",
      cursor: "pointer",
      whiteSpace: "nowrap",

      color: "white",
      bg: "palette.blue.800",
      borderRadius: "regular",

      textDecoration: "none",

      height: "56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 24px",

      "&[disabled]": {
        cursor: "initial",
        bg: "palette.blue.600",
      },

      "&:hover:not([disabled])": {
        bg: "palette.yellow.700",
      },
    },

    link: {
      variant: "styles.a",
      fontFamily: "inherit",
      cursor: "pointer",
      background: "none",
      border: "none",
    },
  },

  links: {
    inactive: {
      variant: "styles.a",
      cursor: "default",
      "&:hover": {
        color: undefined,
      },
    },
    primary: {
      cursor: "pointer",
      whiteSpace: "nowrap",

      color: "white",
      bg: "palette.blue.800",
      borderRadius: "regular",

      textDecoration: "none",

      height: "56px",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",

      "&:hover": {
        bg: "palette.yellow.700",
      },
    },
    secondary: {
      cursor: "pointer",
      whiteSpace: "nowrap",

      color: "text",
      bg: "transparent",

      borderRadius: "regular",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "palette.blue.900",

      textDecoration: "none",

      height: "56px",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",

      "&:hover": {
        borderColor: "palette.yellow.700",
        color: "palette.yellow.700",
      },
    },
    tertiary: {
      cursor: "pointer",
      whiteSpace: "nowrap",

      color: "white",
      bg: "palette.blue.600",

      borderRadius: "50px",
      mx: "component.2",

      textDecoration: "none",
      fontWeight: "book",

      height: "36px",
      width: "36px",
      padding: "0 2px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      "&:hover": {
        bg: "palette.blue.500",
      },
    },

    heading2: {
      variant: "text.heading2",
    },
    heading5: {
      variant: "text.heading5",
    },
  },

  forms: {
    label: {
      fontWeight: "bold",
      color: "black",
    },
    input: {
      px: "component.4",
      py: "component.3",
      color: "black",
      borderColor: "palette.monochrome.500",

      /* text.body2 */
      fontFamily: "inherit",
      fontWeight: "book",
      ...fluid("fontSize", 16, 18, px),
      ...fluid("lineHeight", 26, 28, px),
    },
  },
};
