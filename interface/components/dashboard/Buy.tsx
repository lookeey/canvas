import { Card, CardBody, CardHeader, Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import links from "../../config/links";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import React from "react";

const Buy = () => (
  <Card boxShadow={"lg"}>
    <CardHeader>
      <Heading size={"md"}>Buy</Heading>
    </CardHeader>
    <CardBody>
      <Flex direction={"column"} gap={4}>
        <Flex align={"center"} gap={"3"} as={Link} href={links.buyInk} isExternal>
          <Image src={"/ink-spooky.png"} h={10} borderRadius={"full"} />
          <Text><b>Ink</b> | SpookySwap <ExternalLinkIcon/></Text>
        </Flex>
        <Flex align={"center"} gap={"3"} as={Link} href={links.buyHue} isExternal>
          <Image src={"/hue-spooky.png"} h={10} borderRadius={"full"} />
          <Text><b>Hue</b> | SpookySwap <ExternalLinkIcon/></Text>
        </Flex>
      </Flex>
    </CardBody>
  </Card>
);

export default Buy