import React from "react";
import Layout from "../components/layout/layout";
import Seo from "../components/layout/seo";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { ArrowForwardIcon, ExternalLinkIcon } from "@chakra-ui/icons";

// const utmParameters = `?utm_source=starter&utm_medium=start-page&utm_campaign=default-starter`

const IndexPage = () => {
  return (
    <Layout>
      <Seo title="Get Ink" />
      <Flex
        position="relative"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        minH="80vh"
        mt={"-72px"}
        w={"100%"}
      >
        <Box
          opacity={0.3}
          position={"absolute"}
          width={"100%"}
          height={"100%"}
          zIndex={"-2"}
          backgroundImage={"url(/ink_bg.svg)"}
          backgroundSize={"contain"}
          backgroundRepeat={"no-repeat"}
          backgroundAttachment={"fixed"}
        />
        <Grid
          templateColumns={"repeat(2, 1fr)"}
          width={"100%"}
          maxW={"container.xl"}
          px={10}
          gap={4}
          mt={16}
        >
          <GridItem
            as={Flex}
            align={"center"}
            justifyContent={"center"}
            colSpan={[2, null, 1]}
          >
            <Heading textAlign={"center"} my={3} px={2} size={"3xl"}>
              Get Ink
            </Heading>
          </GridItem>
          <GridItem
            as={Flex}
            justifyContent={"center"}
            alignItems={"center"}
            minHeight={"36"}
            colSpan={[2, null, 1]}
          >
            <Box width={"100%"} maxW={"sm"}>
              <Text>
                <b>Ink</b> is one of the key components of the ecosystem.
                <br />
                It is used to place pixels on the <b>Canvas</b>.
              </Text>
              <Text mt={"2"}>
                Ink is generated by staking <b>Hue</b> in the{" "}
                <Link href={"/dashboard"} color={"blue.300"} whiteSpace={"nowrap"}>
                  Dashboard <ArrowForwardIcon />
                </Link>
                . The more total Hue is staked, the more Ink is generated each
                day, up to a maximum of 15.000 Ink per day.
              </Text>
            </Box>
          </GridItem>

          <GridItem as={Flex} justifyContent={"center"} colSpan={2}>
            <Box maxW={"container.md"}>
              <Text>
                There are two ways of getting <b>Ink</b>:
              </Text>
              <List ml={"4"}>
                <ListItem>
                  <ListIcon mb={1} as={ExternalLinkIcon} />
                  <Link href={"/mint"} textDecoration={"underline"}>
                    Buying it directly
                  </Link>
                </ListItem>
                <ListItem>
                  <ListIcon mb={1} as={ArrowForwardIcon} />
                  <Link href={"/dashboard"} textDecoration={"underline"}>
                    Staking Hue in the Dashboard to earn Ink passively
                  </Link>
                </ListItem>
              </List>
              <Text>
                You can learn more about Ink and Hue in the{" "}
                <Link
                  href={"https://canvas-2.gitbook.io/docs"}
                  color={"blue.300"}
                  whiteSpace={"nowrap"}
                >
                  Docs <ExternalLinkIcon />
                </Link>
              </Text>
            </Box>
          </GridItem>
        </Grid>
      </Flex>
    </Layout>
  );
};

export default IndexPage;
