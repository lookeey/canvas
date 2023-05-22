import styled from "@emotion/styled";
import Link from "next/link";
import React from "react";
import { Logo } from "canvas-uikit";

const Wrapper = styled.header`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: center;
  height: 72px;
  width: 100%;

  .inner {
    display: flex;
    width: 100%;
    max-width: 1600px;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
  }
`;

const LinkList = styled.ul`
  li {
    display: inline-block;
    padding-left: 0.8rem;

    a {
      text-decoration: none;
    }
  }
`;

const links = [
  {
    label: "Docs",
    href: "https://docs.canvass.com",
  },
  {
    label: "Discord",
    href: "https://docs.canvass.com",
  },

  {
    label: "Twitter",
    href: "https://twitter.com/0xc4nvas",
  },
];

const Header: React.FC<{}> = ({}) => (
  <Wrapper>
    <div className="inner">
      <Logo height="48px" />
      <LinkList>
        {links.map(({ label, href }, idx) => (
          <li key={idx}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </LinkList>
    </div>
  </Wrapper>
);

export default Header;
