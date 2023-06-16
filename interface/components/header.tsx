import React from "react";
import { Logo } from "canvas-uikit";
import { Box, List, ListItem } from "@chakra-ui/react";
import ConnectButton from "./ConnectButton";
import { Link } from "@chakra-ui/next-js";

const Header: React.FC<{}> = ({}) => (
  <Box
    as="header"
    position="sticky"
    top="0"
    display="flex"
    justifyContent="center"
    height="72px"
    width="100%"
    zIndex="100"
  >
    <Box
      display="flex"
      width="100%"
      maxWidth="1600px"
      height="100%"
      justifyContent="space-between"
      alignItems="center"
      padding="0 24px"
    >
        <Link href={"/home"}>
          <Box display={["none", "block"]}>
            <Logo height="48px" show={"full"}/>
          </Box>
          <Box display={["block", "none"]}>
            <Logo height="48px" show={"logo"} />
          </Box>
        </Link>


      <List
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        margin="0"
        padding="0"
        listStyleType="none"
        gap={2}
      >
        <ConnectButton />
      </List>
    </Box>
  </Box>
);

export default Header;
