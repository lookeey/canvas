/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import React, { PropsWithChildren } from "react";

import Header from "./header";
import { Box, Flex, Spacer } from "@chakra-ui/react";

const Layout: React.FC<PropsWithChildren<any>> = ({ children }) => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minH="100vh"
      w={"100%"}
    >
      <Header /* siteTitle={data.site.siteMetadata?.title || `Title`} */ />
        {children}
      <Spacer/>
        <Box as={"footer"} textAlign={"center"} padding="2">
          © {new Date().getFullYear()} &middot; Built with Next.JS &middot; This
          site uses one (1) cookie.

        </Box>

    </Flex>
  );
};

export default Layout;
