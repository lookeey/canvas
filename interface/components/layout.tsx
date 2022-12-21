/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import React, { PropsWithChildren } from "react";

import Header from "./header";

const Layout: React.FC<PropsWithChildren<any>> = ({ children }) => {
  return (
    <>
      <Header /* siteTitle={data.site.siteMetadata?.title || `Title`} */ />
      <div>
        <main>{children}</main>
        <footer style={{ textAlign: "center" }}>
          © {new Date().getFullYear()} &middot; Built with Next.JS &middot; This
          site uses one (1) cookie.
        </footer>
      </div>
    </>
  );
};

export default Layout;
