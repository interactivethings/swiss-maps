import { ThemeProvider } from "@/theme";
import { enableMapSet } from "immer";
import { AppProps } from "next/app";
import * as React from "react";

enableMapSet();

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default App;
