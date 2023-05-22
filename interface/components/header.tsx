import Link from "next/link";
import React from "react";
import { Logo } from "canvas-uikit";
import { Box, List, ListItem } from "@chakra-ui/react";

const links = [
  {
    label: "Docs",
    href: "https://canvas-2.gitbook.io/docs",
  },
  {
    label: "Discord",
    href: "https://discord.gg/Z5mZ6EYerr",
  },

  {
    label: "Twitter",
    href: "https://twitter.com/0xc4nvas",
  },
];

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
      <Logo height="48px" />
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
        {links.map(({ label, href }, idx) => (
          <ListItem key={idx}>
            <Link href={href}>{label}</Link>
          </ListItem>
        ))}
      </List>
    </Box>
  </Box>
);

export default Header;
