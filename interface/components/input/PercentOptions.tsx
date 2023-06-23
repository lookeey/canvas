import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import { QuickSelectProps } from "./types";
import { formatUnits } from "viem";

const PercentOptions: React.FC<{
  setValue: QuickSelectProps["setValue"];
  name: string;
  max: bigint;
  decimals: number;
  percentages?: number[];
}> = ({ setValue, name, max, decimals, percentages = [25, 50, 75, 100] }) => {
  return (
    <Flex
      gap="2"
      sx={{
        "> *": {
          flexGrow: "1",
          flexBasis: "0",
        },
      }}
    >
      {percentages.map((p, idx) => (
        <Button
          key={idx}
          variant="outline"
          colorScheme="gray"
          color="gray.400"
          size="sm"
          onClick={() => setValue(
            name,
            formatUnits(max * BigInt(p) / 100n, decimals),
            {
              shouldValidate: true,
            }
          )}
        >
          {p}%
        </Button>
      ))}
    </Flex>
  );
};

export default PercentOptions;