import React, {
  createContext, useCallback,
  useContext,
  useEffect,
  useReducer,
  useState
} from "react";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text, Portal, Flex } from "@chakra-ui/react";
import { useContractWrite, UseContractWriteConfig } from "wagmi";
import { writeContract } from "@wagmi/core";
import Loader from "../components/Loader";

interface TransactionFlowProps {}

const TransactionFlowContext = createContext<{
  sendTx: (config: UseContractWriteConfig) => Promise<any>
}>({
  sendTx: async () => null,
});

const TransactionFlowProvider: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  const [tx, setTx] = useState<UseContractWriteConfig | null>(null);
  const [confirming, setConfirming] = useState(false);

  const { writeAsync } = useContractWrite(tx || {})

  const sendTx = async (config: UseContractWriteConfig) => {
    setTx(config);
  }

  const runTxFlow = async () => {
    setConfirming(true);
    try {
      const tx = await writeAsync();
      console.log(tx);
      setConfirming(false);
    } catch(e) {

    }
    setConfirming(false)
  }

  useEffect(() => {
    if (!tx) return;
    runTxFlow()
  }, [tx])

  return (
    <>
      <TransactionFlowContext.Provider value={{
        sendTx,
      }}>
        {props.children}
      </TransactionFlowContext.Provider>
      <Portal>
        <Modal isOpen={confirming} onClose={() => null}>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader>
              Confirming Transaction
            </ModalHeader>
            <ModalBody>
              <Text>Confirm this transaction in your wallet.</Text>
              <Text fontWeight="bold" mt={2}>
                Transaction details:
              </Text>
              <Flex w="100%" align="center" justify="center"><Loader margin={8}/></Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Portal>
    </>
  );
};

const useTransactionFlow = () => {
  const send = useContext(TransactionFlowContext);

  return send.sendTx;
};

export { TransactionFlowProvider, useTransactionFlow };