import * as MUI from "@mui/material";
import { createTheme } from "@mui/material";
import * as React from "react";
import createGenerateClassName from "./createGenerateClassName";
import options from "./options";
import { StylesProvider } from "@mui/styles";

declare module "@mui/material/styles/createTypography" {
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
    <StylesProvider generateClassName={generateClassName}>
      <MUI.ThemeProvider theme={theme}>
        <MUI.CssBaseline />
        {children}
      </MUI.ThemeProvider>
    </StylesProvider>
  );
};

import { Theme, TypographyStyle } from "@mui/material/styles";

declare module "@mui/styles" {
  interface DefaultTheme extends Theme {}
}
