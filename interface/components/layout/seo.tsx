/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react";
import Head from "next/head";

interface SeoProps {
  description?: string;
  title: string;
}

const Seo: React.FC<React.PropsWithChildren<SeoProps>> = ({
  description,
  title,
  children,
}) => {
  return (
    <Head>
      <title>{title} | Canvas</title>
      <meta name="title" content="Opera Canvas" />
      <meta name="description" content="A virtually infinite canvas forever living in the blockchain." />

      <meta property="og:title" content="Opera Canvas" />
      <meta property="og:site_name" content="0xcanvas" />
      <meta property="og:url" content="0xcanvas.com" />
      <meta
        property="og:description"
        content="A virtually infinite canvas on the blockchain."
      />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/banner.png" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://0xc4nvas.com" />
      <meta property="twitter:title" content="Opera Canvas" />
      <meta property="twitter:description" content="A virtually infinite canvas forever living in the blockchain." />
      <meta property="twitter:image" content="/banner.png" />

      {children}
    </Head>
  );
};

export default Seo;
