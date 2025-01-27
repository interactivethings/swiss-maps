import { ThemeProvider } from "@/theme";
import { enableMapSet } from "immer";
import { AppProps } from "next/app";
import * as React from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

enableMapSet();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false
    },
  },
});

function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
