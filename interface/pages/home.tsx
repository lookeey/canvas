import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import Layout from "../components/layout";
import Seo from "../components/seo";
import { Logo } from "canvas-uikit";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import HeroBackground from "components/HeroBackground";
import LeavePageAnimation from "components/LeavePageAnimation";
import { useRouter } from "next/router";
import splashes from "../config/splashes";
import { TypeAnimation } from "react-type-animation";

// const utmParameters = `?utm_source=starter&utm_medium=start-page&utm_campaign=default-starter`

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
      <Flex
        position="relative"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        minH="80vh"
        mt={"-72px"}
        w={"100%"}
      >
        <HeroBackground />
        <Logo w={["80%", null, "40%"]} margin={"1rem"} />
        <Heading textAlign={"center"} fontFamily={"body"} my={3} px={2} size={"md"} fontWeight="regular">
          <TypeAnimation
            sequence={typeof splash === "string" ? [splash] : splash}
            cursor={true}
            repeat={0}
          />
        </Heading>
        <Button
          style={{ cursor: "pointer", maxWidth: "800px" }}
          size="xl"
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
      </Flex>
    </Layout>
  );
};

export const Head = () => <Seo title="Home" />;

export default IndexPage;
