import ConnectModal from "./ConnectModal";
import React from "react";
import {
  Button,
  ButtonProps, forwardRef,
  useDisclosure
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import AccountModal from "./AccountModal";

const ConnectButton: React.FC<ButtonProps> = forwardRef((props, ref) => {
  const { address, isConnected } = useAccount();
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      {isConnected ? (
        <AccountModal isOpen={isOpen} onClose={onClose} />
      ) : (
        <ConnectModal isOpen={isOpen} onClose={onClose} />
      )}
      <Button {...props} onClick={onOpen} ref={ref}>
        {isConnected
          ? `${address?.slice(0, 4)}...${address?.slice(-3)}`
          : "Connect"}
      </Button>
    </>
  );
});

export default ConnectButton;
