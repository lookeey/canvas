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
  return <>{children}</>;
};

export default Seo;
