import {
  documentGetInitialProps,
  DocumentHeadTags,
} from "@mui/material-nextjs/v14-pagesRouter";
import { DocumentContext, Head, Html, Main, NextScript } from "next/document";
import * as React from "react";

export default function Document(props: any) {
  return (
    <Html>
      <Head>
        <DocumentHeadTags {...props} />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

(Document as any).getInitialProps = async (ctx: DocumentContext) => {
  return await documentGetInitialProps(ctx);
};
