import * as MUI from "@mui/material";
import { createTheme } from "@mui/material";
import * as React from "react";
import options from "./options";
import { StylesProvider, ThemeProvider as TP } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import createGenerateClassName from "./createGenerateClassName";

declare module "@mui/material/styles" {
  interface TypographyVariantsOptions {
    display1: React.CSSProperties;
    display2: React.CSSProperties;
  }
  interface TypographyVariants {
    display1: React.CSSProperties;
    display2: React.CSSProperties;
  }
}

declare module "@mui/styles" {
  interface DefaultTheme extends Theme {}
}

const theme = createTheme(options as any);
const generateClassName = createGenerateClassName();

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <StylesProvider generateClassName={generateClassName}>
      <MUI.ThemeProvider theme={theme}>
        <TP theme={theme}>
          <MUI.CssBaseline />
          {children}
        </TP>
      </MUI.ThemeProvider>
    </StylesProvider>
  );
};
