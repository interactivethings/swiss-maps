import { ThemeProvider } from "@/theme";
import { enableMapSet } from "immer";
import { AppProps } from "next/app";
import * as React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";

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
    <AppCacheProvider {...props}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </AppCacheProvider>
  );
}

export default App;
