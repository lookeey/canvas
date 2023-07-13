import React from "react";
import Layout from "../components/layout/layout";
import Seo from "../components/layout/seo";
import {
  Box, Card, CardBody, CardHeader, Text,
  Flex,
  Grid,
  GridItem,
  Heading, CardFooter
} from "@chakra-ui/react";
import Buy from "../components/dashboard/Buy";
import Balances from "../components/dashboard/Balances";
import Stake from "components/dashboard/Stake";
import YourStakes from "../components/dashboard/YourStakes";
import { useAccount } from "wagmi";
import ConnectButton from "../components/ConnectButton";

const Dashboard = () => {
  const {isConnected} = useAccount();
  return (
    <Layout>
      <Seo title="Dashboard" />
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
      {isConnected ? (
        <Flex
          w={"100%"}
          maxW={"container.xl"}
          direction={"column"}
          px={[2, null, 8]}
          mt={4}
          gap={6}
        >
          <Heading ml={[4, null]}>Dashboard</Heading>
          <Grid templateColumns={["repeat(3, 1fr)"]} gap={6}>
            <GridItem as={Flex} colSpan={[3, null, 1]} direction={"column"} gap={6}>
              <Balances />
              <Box
                display={["none", null, "block"]}
              >
                <Buy/>
              </Box>
            </GridItem>
            <GridItem as={Flex} colSpan={[3, null, 2]} direction={"column"} gap={6}>
              <Stake />
              <YourStakes/>
            </GridItem>
            <Box
              display={["block", null, "none"]}
            >
              <Buy />
            </Box>
          </Grid>
        </Flex>
        ) : (
        <Flex
          w={"100%"}
          maxW={"container.xl"}
          minH={"70vh"}
          align={"center"}
          justify={"center"}
          px={[2, null, 8]}
          mt={4}
          gap={6}
        >
          <Card maxW={"container.md"}>
            <CardHeader>
              <Heading size={"md"} fontFamily={"body"}>Connect your wallet to continue</Heading>
            </CardHeader>
            <CardFooter>
              <ConnectButton size={"xl"} w={"100%"}/>
            </CardFooter>
          </Card>
        </Flex>
        )}

    </Layout>
  );
};

export default Dashboard;
