import React from "react";
import Head from "next/head";
import { withRouter, Router } from "next/router";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TWITTER,
  SITE_URL,
} from "src/domain/constants";

export interface MetaProps {
  title?: string;
  description?: string;
  image?: string;
}

const HeadMeta = withRouter(
  ({
    title = SITE_NAME,
    description = SITE_DESCRIPTION,
    image = "/logo-og.png",
    router,
    children,
  }: MetaProps & { router: Router; children?: React.ReactNode }) => (
    <Head>
      {/* DEFAULT */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {title != null && <title key="title">{title}</title>}
      {description != null && (
        <meta name="description" key="description" content={description} />
      )}

      {/* OPEN GRAPH */}
      <meta property="og:type" key="og:type" content="website" />
      <meta
        property="og:url"
        key="og:url"
        content={`${SITE_URL}${router.pathname}`}
      />
      {title != null && (
        <meta property="og:title" content={title} key="og:title" />
      )}
      {description != null && (
        <meta
          property="og:description"
          key="og:description"
          content={description}
        />
      )}
      <meta
        property="og:image"
        key="og:image"
        content={`${SITE_URL}${image}`}
      />

      {/* TWITTER */}
      <meta
        name="twitter:card"
        key="twitter:card"
        content="summary_large_image"
      />
      <meta name="twitter:site" key="twitter:site" content={SITE_TWITTER} />
      <meta
        name="twitter:creator"
        key="twitter:creator"
        content={SITE_TWITTER}
      />
      {title != null && (
        <meta name="twitter:title" key="twitter:title" content={title} />
      )}
      {description != null && (
        <meta
          name="twitter:description"
          key="twitter:description"
          content={description}
        />
      )}
      <meta
        name="twitter:image"
        key="twitter:image"
        content={`${SITE_URL}${image}`}
      />
      {children}
    </Head>
  )
);

export default HeadMeta;
