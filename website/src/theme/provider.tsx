import * as MUI from "@material-ui/core";
import { createTheme } from "@material-ui/core";
import * as React from "react";
import createGenerateClassName from "./createGenerateClassName";
import options from "./options";

declare module "@material-ui/core/styles/createTypography" {
  interface TypographyOptions {
    display1: TypographyStyle;
    display2: TypographyStyle;
  }
  interface Typography {
    display1: TypographyStyle;
    display2: TypographyStyle;
  }
}

const theme = createTheme(options as any);
export const generateClassName = createGenerateClassName();

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MUI.StylesProvider generateClassName={generateClassName}>
      <MUI.ThemeProvider theme={theme}>
        <MUI.CssBaseline />
        {children}
      </MUI.ThemeProvider>
    </MUI.StylesProvider>
  );
};
