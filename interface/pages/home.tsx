import React, { useMemo, useState } from "react";
import Layout from "../components/layout/layout";
import Seo from "../components/layout/seo";
import { Logo } from "canvas-uikit";
import { Button, Divider, Flex, Heading, HStack, Stack, StackDivider, VStack } from "@chakra-ui/react";
import HeroBackground from "components/home/HeroBackground";
import { useRouter } from "next/router";
import splashes from "../config/splashes";
import { TypeAnimation } from "react-type-animation";
import dynamic from "next/dynamic";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import { useAccount } from "wagmi";

// const utmParameters = `?utm_source=starter&utm_medium=start-page&utm_campaign=default-starter`

const DynamicAnimation = dynamic(() => import("components/home/LeavePageAnimation"), {
  loading: () => <div />,
})

const IndexPage = () => {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const splash = useMemo(
    () => splashes[Math.floor(Math.random() * splashes.length)],
    []
  );
  const {isConnected} = useAccount();
  return (
    <Layout>
      <Seo title="Home" />
      <DynamicAnimation show={show} />
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
        <HStack mt={2} divider={<StackDivider />}>
          <Button
            style={{ cursor: "pointer", maxWidth: "800px" }}
            size="xl"
            onClick={() => {
              setShow(true);
              setTimeout(() => {
                router.push("/");
              }, 2500);
            }}
          >
            Play
          </Button>
          {isConnected && (<Button variant={"outline"} size="xl" rightIcon={<ArrowForwardIcon/>} as={Link} href={"/dashboard"}>Dashboard</Button>)}

        </HStack>
      </Flex>
    </Layout>
  );
};

export default IndexPage;
