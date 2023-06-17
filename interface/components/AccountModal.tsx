import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import { useAccount, useDisconnect } from "wagmi";
import React from "react";
import { Link } from "@chakra-ui/next-js";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const AccountModal = ({ isOpen, onClose }: {
  isOpen: boolean,
  onClose: () => void,
}) => {
  const {address } = useAccount();
  const { disconnect } = useDisconnect()
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>
          <Heading size={"lg"}>Your Account</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <b>Address: {address}</b>
          <br/>
          <Link href={"/dashboard"}>Go to Dashboard <ArrowForwardIcon/></Link>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => disconnect()}>Disconnect</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AccountModal