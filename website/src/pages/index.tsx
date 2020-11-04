import { Generator } from "@/components/Generator";
import { Header } from "@/components/Header";
import theme from "@/theme";
import { enableMapSet } from "immer";
import * as TUI from "theme-ui";

enableMapSet();

export default function Page() {
  return (
    <TUI.ThemeProvider theme={theme}>
      <Header />
      <Generator />
    </TUI.ThemeProvider>
  );
}
