import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Table,
  Td,
  Text,
  Th,
  Tr,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import {
  useAccount,
  useChainId,
  useContractRead,
  useContractReads,
} from "wagmi";
import { getContract } from "../../config/contracts";
import { ChainId } from "../providers/WagmiProvider";
import { bi } from "../../utils/bigint";
import InkMaker_ABI from "../../config/abi/InkMaker_ABI";
import { ReadContractReturnType } from "viem";
import BNFormat from "../BNFormat";
import { ChevronDownIcon } from "@chakra-ui/icons";
import secondsToReadable from "../../utils/duration";

type StakeData = ReadContractReturnType<typeof InkMaker_ABI, "stakingInfo">;

const Row = ({
  stakeData,
  isOpen,
  onOpen,
}: {
  stakeData: StakeData;
  isOpen: boolean;
  onOpen: (args: any) => any;
}) => {
  const [
    amount,
    totalShares,
    lockupPeriod,
    lockupTimestamp,
    isWithdrawn,
    unbondTimestamp,
  ] = stakeData || [];
  const readableDuration = useMemo(
    () => secondsToReadable(Number(lockupPeriod)),
    [lockupPeriod]
  );
  const releaseDate = useMemo(
    () =>
      new Date(
        Number(lockupTimestamp) * 1000 + Number(lockupPeriod) * 1000
      ).toLocaleDateString(),
    [lockupTimestamp, lockupPeriod]
  );
  return (
    <React.Fragment>
      <Tr
        sx={{
          Td: {
            borderBottom: isOpen ? "none" : undefined,
          },
        }}
      >
        <Td>
          <Text>
            <BNFormat value={amount} /> HUE
          </Text>
        </Td>
        <Td>
          <Text>
            <BNFormat value={totalShares} />
          </Text>
        </Td>
        <Td>
          <Text>
            {releaseDate}
          </Text>
        </Td>
        <Td>
          <IconButton
            aria-label={"Open Stake"}
            onClick={onOpen}
            variant="ghost"
            icon={
              <ChevronDownIcon
                boxSize={6}
                transform={isOpen ? "rotate(180deg)" : ""}
                transition={"transform 0.1s ease-in-out"}
              />
            }
          />
        </Td>
      </Tr>
      <Tr>
        <Td
          padding={0}
          colSpan={4}
          borderColor={isOpen ? undefined : "transparent"}
          transition={"border-color 0.1s "}
        >
          <Box
            maxHeight={isOpen ? "30vh" : 0}
            overflow="hidden"
            transition={"max-height 0.1s ease-in-out"}
          >
            <Box p={4} pt={2}>
              <Flex justifyContent={"space-between"}>
                <Text>Lockup Period</Text>
                <Text>{readableDuration}</Text>
              </Flex>
            </Box>
          </Box>
        </Td>
      </Tr>
    </React.Fragment>
  );
};

const YourStakes = () => {
  const chainId = useChainId();
  const { address } = useAccount();

  const { data: stakesLength } = useContractRead({
    ...getContract("inkMaker", chainId as ChainId),
    functionName: "getStakesLength",
    args: [address as any],
    watch: true,
  });

  const { data: stakes }: { data: { result: StakeData }[] | undefined } =
    useContractReads({
      contracts: Array.from({ length: Number(stakesLength) }, (_, i) => ({
        ...getContract("inkMaker", chainId as ChainId),
        functionName: "stakingInfo",
        args: [address as any, bi(i)],
      })),
    });

  const [openStake, setOpenStake] = React.useState<number | null>(null);

  if (!stakesLength || !stakes) return null;

  return (
    <Card boxShadow={"lg"} w={"100%"} alignSelf={"flex-start"}>
      <CardHeader>
        <Heading size={"md"}>Your Stakes</Heading>
      </CardHeader>
      <CardBody>
        <Table>
          <Tr>
            <Th>Amount</Th>
            <Th>Effective Shares</Th>
            <Th>Lockup End</Th>
            <Th />
          </Tr>
          {stakes.map((stake, i) => (
            <Row
              key={i}
              stakeData={stake.result}
              isOpen={openStake === i}
              onOpen={() =>
                setOpenStake((openIndex) => (openIndex === i ? null : i))
              }
            />
          ))}
        </Table>
      </CardBody>
    </Card>
  );
};

export default YourStakes;
