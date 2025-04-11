import * as MUI from "@mui/material";
import { createTheme } from "@mui/material";
import * as React from "react";
import options from "./options";

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

const theme = createTheme(options);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MUI.ThemeProvider theme={theme}>
      <MUI.CssBaseline />
      {children}
    </MUI.ThemeProvider>
  );
};
