import React, { PropsWithChildren } from "react";

import Header from "./header";
import {  Flex,  Link, Spacer } from "@chakra-ui/react";
import { BsDiscord, BsTwitter } from "react-icons/bs";
import { SiGitbook } from "react-icons/si";
import links from "../../config/links";

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
        <Flex as={"footer"} textAlign={"center"} padding="2" direction={"column"} alignItems={"center"}>
          <Flex my={"2"} gap={"5"} sx={{
            svg: {
              fontSize: "2.5rem"}
          }}>
            <Link href={links.discord} isExternal>
              <BsDiscord/>
            </Link>
            <Link href={links.twitter} isExternal>
              <BsTwitter/>
            </Link>
            <Link href={links.gitbook} isExternal>
              <SiGitbook/>
            </Link>

          </Flex>
          © {new Date().getFullYear()} &middot; This
          site uses one (1) cookie.

        </Flex>

    </Flex>
  );
};

export default Layout;
