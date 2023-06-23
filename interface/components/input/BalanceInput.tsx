import { BigNumber } from "ethers";
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  forwardRef,
  Input,
  InputGroup,
  InputLeftAddon,
  InputProps,
  InputRightElement,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { Address, erc20ABI, useBalance, useContractRead } from "wagmi";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import BNFormat from "../BNFormat";
import BigIntSlider from "./BigIntSlider";
import { MaxUint256, min, parseValue } from "../../utils/bigint";
import { formatUnits, parseUnits } from "viem";
import { Control, FieldValues, useController } from "react-hook-form";
import PercentOptions from "./PercentOptions";
import { QuickSelectProps } from "./types";

export const ERROR_OVER_BALANCE = "overBalance";
export const ERROR_OVER_ALLOWANCE = "overAllowance";
export const ERROR_OVER_MAX = "overMax";

interface BaseBalanceProps {
  address: Address;
  token: Address;
  spender: Address;
  label?: string;
  name: string;
  control: Control<any, any>;
  trigger: (name: any) => any;
  max?: bigint;
  showBalance?: boolean;
}

type NoHelpers = { [K in keyof QuickSelectProps]: undefined}

type BalanceInputProps = BaseBalanceProps & (NoHelpers | QuickSelectProps);

const BalanceInput = forwardRef(
  (
    {
      address,
      token,
      spender,
      label,
      name,
      control,
      trigger,
      max,
      showBalance = true,
      ...props
    }: BalanceInputProps,
    ref
  ) => {
    const showSlider = (props.setValue && props.showSlider) ?? true;
    const showQuickSelect =
      (props.setValue && props.showQuickSelect) ?? true;
    const showMax = (props.setValue && props.showMax) || (props.setValue && !showQuickSelect)

    const { data: balance } = useBalance({
      address,
      token,
      enabled: Boolean(address),
    });

    const { data: allowance } = useContractRead({
      abi: erc20ABI,
      address: token,
      functionName: "allowance",
      args: [address, spender],
    });

    const validate = {
      [ERROR_OVER_BALANCE]: (v: `${number}`) =>
        parseValue(v ?? "0", balance?.decimals || 0) <= (balance?.value ?? 0n),
      [ERROR_OVER_ALLOWANCE]: (v: `${number}`) =>
        parseValue(v ?? "0", balance?.decimals || 0) <= (balance?.value ?? 0n),
      [ERROR_OVER_MAX]: (v: `${number}`) =>
        max ? parseValue(v ?? "0", balance?.decimals || 0) <= max : true,
    };

    const { field } = useController({
      name,
      control,
      rules: { validate },
      defaultValue: "",
    });
    const { value } = field;
    const amount = parseValue(value, balance?.decimals || 0);

    const isOverBalance = amount > (balance?.value ?? 0n);
    const isOverAllowance = amount > (allowance ?? 0n);
    const isOverMax = max ? amount > max : false;

    const maxLtBal = max === undefined ? false : max < (balance?.value ?? 0n);
    const maxAmount = maxLtBal ? max : balance?.value ?? 0n;

    // @ts-ignore
    return (
      <FormControl isInvalid={isOverBalance}>
        <Stack>
          <Flex gap="2">
            <InputGroup>
              <InputLeftAddon>{balance?.symbol || "Amount"}</InputLeftAddon>
              <Input
                {...field}
                placeholder="0.0"
                overflow="hidden"
                onChange={(e) => {
                  // allow commas and dots for decimals & only allow input up to the token's number of decimals
                  let regex = new RegExp(
                    `^\\d+[,.]?\\d{0,${balance?.decimals || 0}}$`
                  );
                  if (regex.test(e.target.value) || e.target.value === "") {
                    field.onChange(e.target.value);
                    trigger(name);
                  }
                }}
              />

              {(balance?.value ?? 0n) > (allowance ?? 0n) && (
                <InputRightElement>
                  <Tooltip
                    label={`Current Allowance: ${formatUnits(
                      balance?.value ?? 0n,
                      balance?.decimals ?? 18
                    )}`}
                  >
                    <InfoOutlineIcon ml={1} color="gray.500" />
                  </Tooltip>
                </InputRightElement>
              )}
              {!isOverMax && !isOverBalance && isOverAllowance && (
                <InputRightElement>
                  <Tooltip
                    label={
                      <>
                        Increase allowance to proceed.
                        <br />
                        Current allowance:{" "}
                        {formatUnits(allowance ?? 0n, balance?.decimals ?? 18)}
                      </>
                    }
                  >
                    <InfoOutlineIcon ml={1} color="yellow.500" />
                  </Tooltip>
                </InputRightElement>
              )}
              {!isOverMax && isOverBalance && (
                <InputRightElement>
                  <Tooltip label={"The amount is greater than your balance"}>
                    <InfoOutlineIcon ml={1} color="red.500" />
                  </Tooltip>
                </InputRightElement>
              )}
              {isOverMax && (
                <InputRightElement>
                  <Tooltip label={"The amount is greater than the max"}>
                    <InfoOutlineIcon ml={1} color="red.500" />
                  </Tooltip>
                </InputRightElement>
              )}
            </InputGroup>
            {props.setValue && showMax && (
              <Button
                variant="outline"
                onClick={() => {
                  balance // @ts-ignore
                    ? props.setValue(name, balance.formatted, {
                        shouldValidate: true,
                      })
                    : () => null;
                }}
              >
                Max
              </Button>
            )}
          </Flex>
          {showBalance && (
            <FormHelperText>
              {maxLtBal ? "Balance" : "Max"}:{" "}
              <BNFormat
                value={maxAmount}
                decimals={balance?.decimals || 0}
                displayDecimals={4}
              />
            </FormHelperText>
          )}

          {props.setValue && showQuickSelect && (
            <PercentOptions
              setValue={props.setValue}
              name={name}
              max={min(balance?.value || 0n, max ?? MaxUint256)}
              decimals={balance?.decimals || 0}
              percentages={props.showMax ? [25, 50, 75] : undefined}
            />
          )}
          {props.setValue && showSlider && (
            <BigIntSlider
              setValue={props.setValue}
              name={name}
              value={parseValue(value || "0", balance?.decimals || 0)}
              decimals={balance?.decimals || 0}
              max={min(balance?.value || 0n, max ?? MaxUint256)}
            />
          )}
        </Stack>
      </FormControl>
    );
  }
);

export default BalanceInput;
