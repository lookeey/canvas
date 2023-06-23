import React from "react";
import Layout from "../components/layout/layout";
import Seo from "../components/layout/seo";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
} from "@chakra-ui/react";
import Buy from "../components/dashboard/Buy";
import Balances from "../components/dashboard/Balances";
import Stake from "components/dashboard/Stake";
import YourStakes from "../components/dashboard/YourStakes";

const Dashboard = () => {
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
      <Flex
        w={"100%"}
        maxW={"container.xl"}
        direction={"column"}
        px={8}
        mt={4}
        gap={6}
      >
        <Heading>Dashboard</Heading>
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
    </Layout>
  );
};

export default Dashboard;
