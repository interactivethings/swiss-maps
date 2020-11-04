import { Generator } from "@/components/Generator";
import { Header } from "@/components/Header";
import theme from "@/theme";
import * as TUI from "theme-ui";

export default function Page() {
  return (
    <TUI.ThemeProvider theme={theme}>
    <div>
      <Header />
      <Generator />
    </div>
    </TUI.ThemeProvider>
  );
}
