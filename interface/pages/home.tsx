import React, { useMemo, useState, forwardRef } from "react";
import Layout from "../components/layout/layout";
import Seo from "../components/layout/seo";
import { Logo } from "canvas-uikit";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack, keyframes,
  Stack,
  StackDivider,
  VStack
} from "@chakra-ui/react";
import HeroBackground from "components/home/HeroBackground";
import { useRouter } from "next/router";
import splashes from "../config/splashes";
import { TypeAnimation } from "react-type-animation";
import dynamic from "next/dynamic";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import { useAccount } from "wagmi";
import _Circle from "public/circle.svg";
import { motion } from "framer-motion";
import HoveringTokens from "../components/home/HoveringTokens";

const Circle = motion(_Circle)

// const utmParameters = `?utm_source=starter&utm_medium=start-page&utm_campaign=default-starter`

const DynamicAnimation = dynamic(
  () => import("components/home/LeavePageAnimation"),
  {
    loading: () => <div />,
  }
);

const IndexPage = () => {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const splash = useMemo(
    () => splashes[Math.floor(Math.random() * splashes.length)],
    []
  );
  const { isConnected } = useAccount();
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
        <Heading
          textAlign={"center"}
          fontFamily={"body"}
          my={3}
          px={2}
          size={"md"}
          fontWeight="regular"
        >
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
          {isConnected && (
            <Button
              variant={"outline"}
              size="xl"
              rightIcon={<ArrowForwardIcon />}
              as={Link}
              href={"/dashboard"}
            >
              Dashboard
            </Button>
          )}
        </HStack>
      </Flex>
      <Flex
        position="relative"
        justifyContent="center"
        alignItems="center"
        minH="50vh"
        w={"100%"}
      >
        <Box zIndex="-1" w="100%" h="100%" position="absolute">
          <Circle
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              height: '70%',
              opacity: "0.20",
            }}
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 8, ease: 'linear', repeat: Infinity
            }}
          />
          <Circle
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              height: '50%',
              opacity: "0.20",
            }}
            animate={{
              rotate: [0, -360]
            }}
            transition={{
              duration: 8, ease: 'linear', repeat: Infinity
            }}
          />
        </Box>
        <Heading textAlign="center" px={6}>
          An infinite artboard
          <br /> on Fantom.
        </Heading>
      </Flex>
      <Flex
        position="relative"
        justifyContent="center"
        alignItems="center"
        minH="50vh"
        w={"100%"}
        style={{
          backgroundImage: "url('/pattern.svg'), url('/bg1.png')"
        }}
        backgroundSize='16px, cover'
        backgroundPosition='center'
      >
        <Grid templateColumns={["1fr", null,"repeat(2, 1fr)"]} maxW='container.lg' alignItems="center">
          <Flex justify='center' mt={[20, null, 0]}>
            <Heading textAlign={["center", null, "left"]}>
          <span style={{ fontWeight: "300" }}>
            Stake or buy, <br />
            and
          </span>{" "}
              place.
            </Heading>
          </Flex>

          <HoveringTokens/>
        </Grid>

      </Flex>
      <Flex
        position="relative"
        justifyContent="center"
        alignItems="center"
        minH="50vh"
        w={"100%"}
      >
        <Heading textAlign='center'>
          An ecosystem
          <br />
          made by you.
        </Heading>
      </Flex>
    </Layout>
  );
};

export default IndexPage;
