import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Link,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import BalanceInput from "../input/BalanceInput";
import { getContract } from "../../config/contracts";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import links from "../../config/links";
import React, { useEffect, useState } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { ChainId } from "../providers/WagmiProvider";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "canvas-uikit";

interface IFormInputs {
  amount: bigint;
  date: Date;
  lock: boolean;
  lockMax: boolean;
}

const maxLockupPeriod = 60 * 60 * 24 * 30 * 6;
const day = 60 * 60 * 24;

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

  const onSubmit = (data: IFormInputs) => {};

  const [maxLockup, setMaxLockup] = useState(Date.now() + maxLockupPeriod);

  useEffect(() => {
    const interval = setInterval(() => {
      setMaxLockup(Date.now() + maxLockupPeriod);
    });

    return () => {
      clearInterval(interval);
    };
  }, []);

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
              <Button
                size={"lg"}
                w={"100%"}
                fontFamily={"heading"}
                isDisabled={Boolean(errors.amount)}
              >
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
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <>
                      <Flex justify="space-between" align="center" mb={2}>
                        <Checkbox fontWeight='bold'>Lock until:</Checkbox>

                        <DatePicker
                          onDateSelected={(date) => field.onChange(date.date)}
                          selected={field.value}
                          isDisabled={true}
                        />
                      </Flex>

                      <Flex gap={4} align='center'>
                        <Text fontSize='xs'>months</Text>
                        <Slider
                          mt={4}
                          mb={6}
                          min={0}
                          max={maxLockupPeriod}
                          step={day}
                          onChange={(val) => {
                            field.onChange(new Date(Date.now() + val * 1000));
                            if (val === maxLockupPeriod) null;
                          }}
                        >
                          {/*<SliderMark value={0} mr={1} mt={2} fontSize='xs' textAlign='center' whiteSpace="nowrap">
                          months
                        </SliderMark>*/}
                          {[1, 2, 3, 4, 5, 6].map((month) => (
                            <SliderMark value={30 * day * month} transform='translateX(-50%)' mr={1} mt={2} fontSize='xs' textAlign='center' whiteSpace="nowrap" key={month}>
                              {month}<br/>
                            </SliderMark>
                          ))}
                          <SliderTrack height="2px" bg="blue2">
                            <SliderFilledTrack bg="blue1" />
                          </SliderTrack>
                          <SliderThumb bg="blue2" />
                        </Slider>
                      </Flex>
                      <Flex justify="flex-end" align="center" mb={2}>
                        <Checkbox>Max lockup</Checkbox>
                      </Flex>
                    </>
                  )}
                />
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
};

export default Stake;
