import React, { useState } from "react";
import styled from "@emotion/styled";

import Layout from "../components/layout";
import Seo from "../components/seo";
import { Logo, Button } from "canvas-uikit";
import HeroBackground from "components/HeroBackground";
import LeavePageAnimation from "components/LeavePageAnimation";
import { useRouter } from "next/router";

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
  return (
    <Layout>
      <LeavePageAnimation show={show} />
      <Hero>
        <HeroBackground />
        <Logo width="40%" style={{ margin: "1rem" }} />
        <h1>A big wall. For you.</h1>
        <Button
          size="xl"
          as="a"
          style={{ cursor: "pointer", maxWidth: "800px" }}
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
