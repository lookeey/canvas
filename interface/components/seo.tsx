/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react";

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
    <>
      <title>{title}</title>
      <meta property="og:title" content="Opera Canvas" />
      <meta property="og:site_name" content="0xcanvas" />
      <meta property="og:url" content="0xcanvas.com" />
      <meta
        property="og:description"
        content="A virtually infinite canvas on the blockchain."
      />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/banner.png" />

      {children}
    </>
  );
};

export default Seo;
