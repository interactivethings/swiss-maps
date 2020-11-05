import { generateClassName } from "@/theme";
import { ServerStyleSheets } from "@material-ui/core/styles";
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import * as React from "react";

export default class extends Document {
  static getInitialProps = async (ctx: DocumentContext) => {
    const sheets = new ServerStyleSheets({
      serverGenerateClassName: generateClassName,
    });

    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
      ],
    };
  };

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
