import ConnectModal from "./ConnectModal";
import React from "react";
import { Button, chakra, Flex, Image, useDisclosure } from "@chakra-ui/react";
import { formatEther } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";
import { getContract } from "../config/contracts";
import { ChainId } from "../pages/_app";
import AccountModal from "./AccountModal";
import { Link } from "@chakra-ui/next-js";

const ConnectButton = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId() as ChainId;
  const { data: balance } = useBalance({
    address,
    token: getContract("ink", chainId).address,
  });
  const {isOpen, onClose, onOpen} = useDisclosure();
  return (
    <>
      {isConnected ? (
        <AccountModal isOpen={isOpen} onClose={onClose} />
      ) : (
        <ConnectModal isOpen={isOpen} onClose={onClose} />
      )}
      <Flex borderRadius="md" align={"center"} bg={"gray3"} boxShadow={"lg"}>
        {isConnected && (
            <Flex as={Link} href={"/ink"} px={2} h={"100%"} align="center">
              <Image src={"./ink_logo.png"} h={6} borderRadius={"full"} />
              <chakra.b ml={2}>
                {formatEther(balance?.value ?? 0n)} ink
              </chakra.b>
            </Flex>
        )}
        <Button  onClick={onOpen}>
          {isConnected
            ? `${address?.slice(0, 4)}...${address?.slice(-3)}`
            : "Connect"}
        </Button>
      </Flex>
    </>
  );
}

export default ConnectButton