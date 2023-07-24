import { Button, ButtonProps, forwardRef, Spinner, Tooltip, Icon } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { UseContractWriteConfig, usePrepareContractWrite } from "wagmi";
import { useTransactionFlow } from "../hooks/useTransactionModal";
import { ImWarning } from "react-icons/im";

interface Web3ButtonProps extends Omit<ButtonProps, "onClick"> {
  preparedTx: ReturnType<typeof usePrepareContractWrite>;
}

const Web3Button = forwardRef<Web3ButtonProps, typeof Button>(({ preparedTx, ...props }, ref) => {
  const sendTx = useTransactionFlow();
  const {isError, isLoading, isFetching, error} = preparedTx;
  const errMessage = useMemo(() => {
    const message = error?.message?.split("\n")?.[0];
    if (message === "An internal error was received.") {
      console.log(error)
      return error?.message.match(/Details: Error: (.*)/)?.[1] || error?.message
    }
    return message
  }, [error?.message])
  const disabled = props.isDisabled || isError || isLoading || isFetching;
  const icon = useMemo(() => {
    if (isError) return <Icon as={ImWarning} boxSize="24px"/>;
    if (isLoading || isFetching) return <Spinner />;
    return props.rightIcon;
  }, [isError, isLoading, isFetching, props.rightIcon]);
  return (
    <Tooltip label={errMessage || ""}>
      <Button
        {...props}
        {...ref}
        onClick={() => sendTx(preparedTx.config as any as UseContractWriteConfig)}
        rightIcon={icon}
        isDisabled={disabled}
      />
    </Tooltip>
  );
});

export default Web3Button;
