import React, { PropsWithChildren } from "react";

import Header from "./header";
import {  Flex,  Link, Spacer } from "@chakra-ui/react";
import { BsDiscord, BsTwitter } from "react-icons/bs";
import { SiGitbook } from "react-icons/si";

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
            <Link href={"https://discord.gg/Z5mZ6EYerr"} isExternal>
              <BsDiscord/>
            </Link>
            <Link href={"https://twitter.com/0xc4nvas"} isExternal>
              <BsTwitter/>
            </Link>
            <Link href={"https://canvas-2.gitbook.io/docs"} isExternal>
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
