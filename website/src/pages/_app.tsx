import { ThemeProvider } from "@/theme";
import { enableMapSet } from "immer";
import { AppProps } from "next/app";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";

enableMapSet();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
  },
});

function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <QueryClientProvider client={queryClient}>
      <AppCacheProvider {...props}>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </AppCacheProvider>
    </QueryClientProvider>
  );
}

export default App;
