import {
  Alert, AlertDescription, AlertIcon,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useConnect } from "wagmi";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            {
              connectors.map((connector) => {
                const c = connector as any
                return (
                  <Button
                    key={c.name}
                    onClick={() => connect({connector})}
                    isLoading={isLoading}
                    disabled={isConnecting}
                  >
                    {c.name}
                  </Button>
                )
              })
            }
          </Stack>
        </ModalBody>
        <ModalFooter/>
      </ModalContent>
    </Modal>
  );
}

export default ConnectModal