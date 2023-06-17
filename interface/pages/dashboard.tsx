import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import Layout from "../components/layout";
import Seo from "../components/seo";
import {
  Box,
  Button, Card, CardBody, CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading, Image,
  List,
  ListIcon,
  ListItem,
  Text, VStack
} from "@chakra-ui/react";

const IndexPage = () => {
  return (
    <Layout>
      <Seo title="Get Ink" />
      <Box
        opacity={0.3}
        position={"absolute"}
        width={"100%"}
        height={"100%"}
        zIndex={"-2"}
        backgroundImage={"url(/ink_bg.svg)"}
        backgroundSize={"contain"}
        backgroundRepeat={"no-repeat"}
      />

        <Flex
          w={"100%"}
          maxW={"container.xl"}
          direction={"column"}
          px={8}
          mt={4}
          gap={6}
        >
          <Heading>
            Dashboard
          </Heading>
          <Grid
            templateColumns={"repeat(3, 1fr)"}
          >
            <GridItem>
              <Card bg={"bg"}>
                <CardHeader>
                  <Heading size={"md"}>
                    Your Balances
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Grid templateColumns={"auto 1fr"} columnGap={4} rowGap={3}>
                    <GridItem>
                      <Flex align={"center"} gap={"2"}>
                        <Image src={"/ink_logo.png"} h={10} borderRadius={"full"}/>
                        <Text fontWeight={"bold"}>
                          Ink
                        </Text>
                      </Flex>
                    </GridItem>
                    <GridItem as={Flex} align={"center"}>
                      <Text>
                        123.123123
                      </Text>
                    </GridItem>

                    <GridItem>
                      <Flex align={"center"} gap={"2"}>
                        <Image src={"/hue_logo.png"} h={10} borderRadius={"full"}/>
                        <Text fontWeight={"bold"}>
                          Hue
                        </Text>
                      </Flex>
                    </GridItem>
                    <GridItem as={Flex} align={"center"}>
                      <Text>
                        123.123123
                      </Text>
                    </GridItem>
                  </Grid>
                  <VStack spacing={4} align={"flex-start"}>



                  </VStack>

                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </Flex>
    </Layout>
  );
};

export default IndexPage;
