import React from "react";
import { Logo } from "canvas-uikit";
import { Box, List, ListItem } from "@chakra-ui/react";
import ConnectButton from "../ConnectButton";
import { Link } from "@chakra-ui/next-js";
import useScrollY from "../../hooks/useScrollY";

const breakpoint = 20;

const Header: React.FC<{}> = ({}) => {
  const scrollY = useScrollY();
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      display="flex"
      justifyContent="center"
      height="72px"
      width="100%"
      zIndex="100"
      bg={scrollY > breakpoint ? "bgAlpha.200" : "transparent"}
      backdropFilter={scrollY > breakpoint ? "blur(6px)" : "none"}
      boxShadow={
        scrollY > breakpoint ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none"
      }
      transition="all 0.2s"
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
          <Box display={["none", null, "block"]}>
            <Logo height="48px" show={"full"} />
          </Box>
          <Box display={["block", null, "none"]}>
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
};

export default Header;
