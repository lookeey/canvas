import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { getContract } from "../../config/contracts";
import { ChainId } from "../providers/WagmiProvider";

const Balances = () => {
  const chainId = useChainId() as ChainId;
  const { address } = useAccount();

  const { data: inkBalance } = useBalance({
    token: getContract("ink", chainId).address,
    address,
  });
  const { data: hueBalance } = useBalance({
    token: getContract("hue", chainId).address,
    address,
  });
  return (
    <Card boxShadow={"lg"}>
      <CardHeader>
        <Heading size={"md"}>Your Balances</Heading>
      </CardHeader>
      <CardBody>
        <Grid templateColumns={"auto 1fr"} columnGap={4} rowGap={3}>
          <GridItem>
            <Flex align={"center"} gap={"3"}>
              <Image src={"/ink_logo.png"} h={10} borderRadius={"full"} />
              <Text fontWeight={"bold"}>Ink</Text>
            </Flex>
          </GridItem>
          <GridItem as={Flex} align={"center"}>
            <Text>{inkBalance?.formatted}</Text>
          </GridItem>

          <GridItem>
            <Flex align={"center"} gap={"3"}>
              <Image src={"/hue_logo.png"} h={10} borderRadius={"full"} />
              <Text fontWeight={"bold"}>Hue</Text>
            </Flex>
          </GridItem>
          <GridItem as={Flex} align={"center"}>
            <Text>{hueBalance?.formatted}</Text>
          </GridItem>
        </Grid>
        <VStack spacing={4} align={"flex-start"}></VStack>
      </CardBody>
    </Card>
  );
};

export default Balances;
