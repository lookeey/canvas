import { Button, chakra, Flex, Image } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { formatEther } from "viem";
import React from "react";
import ConnectButton from "../ConnectButton";
import { useAccount, useBalance, useChainId } from "wagmi";
import { ChainId } from "../providers/WagmiProvider";
import { getContract } from "../../config/contracts";

const Account = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId() as ChainId;
  const { data: balance } = useBalance({
    address,
    token: getContract("ink", chainId).address,
  });
  return (
    <Flex borderRadius="md" align={"center"} bg={"gray3"} boxShadow={"lg"}>
      {isConnected && (
        <Flex as={Link} href={"/ink"} px={2} h={"100%"} align="center">
          <Image src={"./ink_logo.png"} h={6} borderRadius={"full"} />
          <chakra.b ml={2}>
            {formatEther(balance?.value ?? 0n)} ink
          </chakra.b>
        </Flex>
      )}
      <ConnectButton/>
    </Flex>
  )
}

export default Account;