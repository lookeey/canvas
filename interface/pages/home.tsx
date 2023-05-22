import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import Layout from "../components/layout";
import Seo from "../components/seo";
import { Logo } from "canvas-uikit";
import { Button } from "@chakra-ui/react";
import HeroBackground from "components/HeroBackground";
import LeavePageAnimation from "components/LeavePageAnimation";
import { useRouter } from "next/router";
import splashes from "../config/splashes";
import { TypeAnimation } from "react-type-animation";

// const utmParameters = `?utm_source=starter&utm_medium=start-page&utm_campaign=default-starter`

const Hero = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  min-height: 70vh;
  flex-direction: column;
  align-items: center;
`;

const IndexPage = () => {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const splash = useMemo(
    () => splashes[Math.floor(Math.random() * splashes.length)],
    []
  );
  return (
    <Layout>
      <LeavePageAnimation show={show} />
      <Hero>
        <HeroBackground />
        <Logo width="40%" style={{ margin: "1rem" }} />
        <h1 style={{fontSize: "1.5rem"}}>
          <TypeAnimation
            sequence={typeof splash === "string" ? [splash] : splash}
            cursor={true}
            repeat={0}
          />
        </h1>
        <Button
          style={{ cursor: "pointer", maxWidth: "800px" }}
          isDisabled
          mt="2"
          onClick={() => {
            setShow(true);
            setTimeout(() => {
              router.push("/");
            }, 2500);
          }}
        >
          Play
        </Button>
      </Hero>
    </Layout>
  );
};

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />;

export default IndexPage;
