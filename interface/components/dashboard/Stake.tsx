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
import React, { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useContractRead,
  usePrepareContractWrite,
} from "wagmi";
import { ChainId } from "../providers/WagmiProvider";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "canvas-uikit";
import { bi, parseValue } from "../../utils/bigint";
import Web3Button from "../Web3Button";
import useTick from "../../hooks/useTick";

interface IFormInputs {
  amount: string;
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
    watch: true,
  });
  const { data: hueBalance } = useBalance({
    token: getContract("hue", chainId).address,
    address,
    watch: true,
  });

  const { data: hueAllowance } = useContractRead({
    ...getContract("hue", chainId),
    functionName: "allowance",
    args: [address ?? "0x0", getContract("inkMaker", chainId).address],
    enabled: Boolean(address),
    watch: true
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    register,
    setValue,
    getValues,
    watch
  } = useForm<IFormInputs>({
    defaultValues: {
      date: new Date(Date.now() + 1000 * day * 30),
    },
  });

  const { amount, date, lock, lockMax } = watch();

  const onSubmit = (data: IFormInputs) => {};

  const [maxLockup, setMaxLockup] = useState(Date.now() + maxLockupPeriod);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMaxLockup(Date.now() + maxLockupPeriod * 1000);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const throttlePrepareTick = useTick(300);

  const stakeArgs = useMemo<[bigint, bigint]>(() => {
    let lockTimestamp = 0n;
    if (lock) {
      lockTimestamp = lockMax
        ? bi(maxLockup)
        : bi((date.valueOf() - Date.now()) / 1000 / day) * bi(day);
    }
    return [parseValue(amount || "0"), lockTimestamp];
  }, [throttlePrepareTick]);

  const approveFullConfig = usePrepareContractWrite({
    ...getContract("hue", chainId),
    functionName: "approve",
    args: [getContract("inkMaker", chainId).address, 2n ** 256n - 1n],
  });

  const approveAmountConfig = usePrepareContractWrite({
    ...getContract("hue", chainId),
    functionName: "approve",
    args: [getContract("inkMaker", chainId).address, stakeArgs[0]],
  });

  const stakeConfig = usePrepareContractWrite({
    ...getContract("inkMaker", chainId),
    functionName: "stake",
    args: stakeArgs,
    enabled: Boolean(hueAllowance) && (hueAllowance ?? 0n) >= stakeArgs[0],
  });

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
                spender={getContract("inkMaker", chainId).address}
                value={0n}
                setValue={setValue}
                trigger={trigger}
                control={control}
              />
              {
                hueAllowance && hueAllowance >= parseValue(amount || "0") ? (
                  <Web3Button
                    preparedTx={stakeConfig}
                    size={"lg"}
                    w={"100%"}
                    fontFamily={"heading"}
                  >
                    Stake
                  </Web3Button>
                ) : (
                  <Flex gap={2}>
                    <Web3Button
                      preparedTx={approveAmountConfig}
                      h={12}
                      w={"100%"}
                      isDisabled={parseValue(amount || "0") === 0n}
                    >
                      Approve
                    </Web3Button>
                    <Web3Button
                      preparedTx={approveFullConfig}
                      h={12}
                      w={"100%"}
                    >
                      Approve Full
                    </Web3Button>
                  </Flex>

                )
              }

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
                        <Checkbox fontWeight="bold" {...register("lock")}>
                          Lock until:
                        </Checkbox>

                        <DatePicker
                          onDateSelected={(date) => field.onChange(date.date)}
                          selected={
                            getValues("lockMax")
                              ? new Date(maxLockup)
                              : field.value
                          }
                          isDisabled={
                            !getValues("lock") || getValues("lockMax")
                          }
                          maxDate={new Date(maxLockup)}
                          helpText={"End date"}
                        />
                      </Flex>

                      <Flex gap={4} align="center">
                        <Slider
                          mt={4}
                          mb={4}
                          min={1}
                          max={maxLockupPeriod}
                          step={day}
                          onChange={(val) => {
                            field.onChange(new Date(Date.now() + val * 1000));
                            if (val === maxLockupPeriod) null;
                          }}
                          isDisabled={
                            !getValues("lock") || getValues("lockMax")
                          }
                          focusThumbOnChange={false}
                          value={
                            getValues("lockMax")
                              ? maxLockupPeriod
                              : (new Date(field.value).valueOf() - Date.now()) /
                                1000
                          }
                          onMouseEnter={() => setShowTooltip(true)}
                          onMouseLeave={() => setShowTooltip(false)}
                        >
                          <SliderTrack height="2px" bg="blue2">
                            <SliderFilledTrack bg="blue1" />
                          </SliderTrack>
                          <Tooltip
                            hasArrow
                            bg="teal.500"
                            color="white"
                            placement="top"
                            isOpen={showTooltip}
                            label={`${Math.floor(
                              (new Date(field.value).valueOf() - Date.now()) /
                                1000 /
                                day +
                                1 ?? 0
                            )} days`}
                          >
                            <SliderThumb bg="blue2" />
                          </Tooltip>
                        </Slider>
                      </Flex>
                      <Flex
                        gap="2"
                        align="center"
                        sx={{
                          "> *": {
                            flexGrow: "1",
                            flexBasis: "0",
                          },
                        }}
                      >
                        <Text
                          fontSize="xs"
                          opacity={lockMax || !lock ? 0.5 : 1}
                        >
                          months
                        </Text>
                        {[1, 2, 3, 4, 5, 6].map((month) => (
                          <Button
                            variant="outline"
                            size="sm"
                            key={month}
                            isDisabled={lockMax || !lock}
                            onClick={() => {
                              field.onChange(
                                new Date(Date.now() + month * 30 * day * 1000)
                              );
                            }}
                          >
                            {month}
                            <br />
                          </Button>
                        ))}
                      </Flex>
                      <Flex justify="flex-end" align="center" my={2}>
                        <Checkbox
                          {...register("lockMax")}
                          isDisabled={!getValues("lock")}
                        >
                          Max lockup
                        </Checkbox>
                      </Flex>
                    </>
                  )}
                />
                {/*<Heading fontFamily={"body"} size={"sm"}>
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
                </Table>*/}
              </Box>
            </GridItem>
          </Grid>
        </form>
      </CardBody>
    </Card>
  );
};

export default Stake;
