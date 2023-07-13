import {
  Text,
  Button,
  chakra,
  ChakraComponent,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Divider,
  Box,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { useConnect } from "wagmi";
import Metamask from "public/mm.svg";
import WalletConnect from "public/wallet-connect.svg";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ConnectorIconComponent = ChakraComponent<"svg", { name: string }>;

const ConnectorIcon: ConnectorIconComponent = ({ name, ...props }) => {
  let Icon;
  switch (name) {
    case "WalletConnect":
      Icon = WalletConnect;
      break;
    default:
      Icon = Metamask;
  }
  let ChakraIcon = chakra(Icon);
  return <ChakraIcon h={"32px"} {...props} />;
};

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose }) => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect({ onSuccess: onClose });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            {connectors.map((connector) => {
              const c = connector;
              return (
                <Button
                  key={c.name}
                  variant="outline"
                  size={"lg"}
                  onClick={() => connect({ connector })}
                  isDisabled={isLoading}
                >
                  <Flex
                    w={"32px"}
                    flexShrink={0}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    {pendingConnector?.name === c.name ? (
                      <Spinner />
                    ) : (
                      <ConnectorIcon name={c.name} flexShrink={0} />
                    )}
                  </Flex>
                  <Divider orientation={"vertical"} mx={6} h={"75%"} />

                  <Text w={"100%"} p={1} textAlign={"center"}>
                    {c.name}
                  </Text>
                </Button>
              );
            })}
          </Stack>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default ConnectModal;
