import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader, Divider,
  Flex,
  Grid,
  GridItem,
  Heading, IconButton, Link, Table, Tbody, Td,
  Text, Th,
  Tooltip, Tr
} from "@chakra-ui/react";
import BalanceInput from "../input/BalanceInput";
import { getContract } from "../../config/contracts";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import links from "../../config/links";
import React from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { ChainId } from "../providers/WagmiProvider";
import { useForm } from "react-hook-form";

interface IFormInputs {
  amount: bigint;
}

const Stake = () => {
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm<IFormInputs>();

  const onSubmit = (data: IFormInputs) => {}

  return (
    <Card boxShadow={"lg"} w={"100%"} alignSelf={"flex-start"}>
      <CardHeader>
        <Heading size={"md"}>Stake</Heading>
        <Text>
          Stake Hue to earn <b>Ink</b> passively
        </Text>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns={["1fr", null, null, "repeat(2, 1fr)"]} gap={4}>
            <GridItem as={Flex} direction={"column"} gap={4}>
              <BalanceInput
                name={"amount"}
                label={"Amount"}
                address={address ?? "0x0"}
                token={getContract("hue", chainId).address}
                spender={"0x0"}
                value={0n}
                setValue={setValue}
                trigger={trigger}
                control={control}
              />
              <Button size={"lg"} w={"100%"} fontFamily={"heading"} isDisabled={Boolean(errors.amount)}>
                Stake {errors.amount?.message}
              </Button>
            </GridItem>
            <GridItem>
              <Box
                border={"1px solid"}
                borderColor={"gray.700"}
                borderRadius={"md"}
                p={3}
              >
                <Heading fontFamily={"body"} size={"sm"}>
                  Estimated Results
                  <Tooltip
                    label={
                      <>
                        Click and learn more about Ink emissions in the{" "}
                        <Link>Documentation.</Link>
                      </>
                    }
                  >
                    <IconButton
                      aria-label={"Learn more about Ink emissions"}
                      size={"xs"}
                      mx={1}
                      icon={<InfoOutlineIcon />}
                      variant={"ghost"}
                      as={Link}
                      href={links.gitbook}
                      isExternal
                    />
                  </Tooltip>
                </Heading>
                <Divider py={1} />
                <Table
                  size={"sm"}
                  sx={{
                    th: {
                      w: 0,
                      whiteSpace: "nowrap",
                      py: 1,
                      px: 1,
                    },
                  }}
                >
                  <Tbody>
                    <Tr>
                      <Th>1 Week</Th>
                      <Td>20 Ink</Td>
                    </Tr>
                    <Tr>
                      <Th>1 Month</Th>
                      <Td>80 Ink</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </GridItem>
          </Grid>
        </form>
      </CardBody>
    </Card>
  );
}

export default Stake;