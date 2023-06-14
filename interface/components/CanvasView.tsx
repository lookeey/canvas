"use client";

import useCanvasControls from "hooks/useControls";
import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import { Box, Button, chakra, Flex, Stack } from "@chakra-ui/react";
import ColorPicker from "./ColorPicker";
import usePlacePixels, {
  useAllowance,
  useApproveCanvas,
} from "../hooks/usePixelActions";
import { useAccount, useBalance, useChainId } from "wagmi";
import ConnectModal from "./ConnectModal";
import useWindowSize from "../hooks/useWindowSize";
import useRenderCanvas from "../hooks/useRenderCanvas";
import contracts, { getContract } from "../config/contracts";
import { ChainId } from "../pages/_app";

const Canvas = styled.canvas`
  image-rendering: pixelated;
  overflow: hidden;
`;

export interface CanvasViewProps {}

const CanvasView: React.FC<CanvasViewProps> = (props: CanvasViewProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { address, isConnected } = useAccount();
  const [modalOpen, setModalOpen] = useState(false);
  const chainId = useChainId() as ChainId;

  const windowSize = useWindowSize();

  const {
    setSelectedColor,
    selectedPixels,
    selectedColor,
    hoveredPixel,
    clearPixels,
    ...positions
  } = useCanvasControls(ref);

  useRenderCanvas({ ref, selectedPixels, ...positions });

  const { data: balance } = useBalance({
    address,
    token: getContract("ink", chainId).address,
  });
  const allowance = useAllowance({
    address: address ?? "0x0",
    token: getContract("ink", chainId).address,
    spender: getContract("canvas", chainId).address,
  });

  const approveTransaction = useApproveCanvas(100n ** 18n);
  const transaction = usePlacePixels(selectedPixels);

  const necessaryInk = BigInt(selectedPixels.length) * 10n ** 18n;

  return (
    <>
      <style>
        {`
        body {
          overflow: hidden;
        }
        `}
      </style>
      <ConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Canvas width={windowSize.w} height={windowSize.h} ref={ref}>
        canvas
      </Canvas>
      <Box
        bg={"blackAlpha.800"}
        position="absolute"
        bottom={8}
        left={8}
        padding={2}
        minWidth={32}
        borderRadius="md"
      >
        <chakra.b display={"inline-block"} w={"24px"}>
          x
        </chakra.b>
        {hoveredPixel.x.toLocaleString()}, <br />
        <chakra.b display={"inline-block"} w={"24px"}>
          y
        </chakra.b>
        {hoveredPixel.y.toLocaleString()}
      </Box>
      <Stack
        position={"absolute"}
        top={3}
        right={3}
        gap={2}
        direction={"column"}
        sx={{ "*": { alignSelf: "flex-end" } }}
      >
        <Button onClick={() => setModalOpen(true)}>
          {isConnected
            ? `${address?.slice(0, 4)}...${address?.slice(-3)}`
            : "Connect"}
        </Button>
        {selectedPixels.length > 0 && (
          <>
            <Box
              bg={"white"}
              color={"gray.700"}
              py={"1"}
              px={"2"}
              borderRadius="md"
              textAlign={"end"}
              flexGrow={"0"}
            >
              <chakra.b>{selectedPixels.length}</chakra.b> pixels selected
            </Box>
            <Button size={"sm"} onClick={() => clearPixels()}>
              Clear Pixels
            </Button>
            {(balance?.value ?? 0n) < necessaryInk ? (
              <Button size={"sm"} onClick={() => approveTransaction.write?.()}>
                Get Ink
              </Button>
            ) : (allowance.data ?? 0n) > BigInt(selectedPixels.length) ? (
              <Button size={"sm"} onClick={() => approveTransaction.write?.()}>
                Approve Ink
              </Button>
            ) : (
              <Button size={"sm"} onClick={() => transaction.write?.()}>
                Paint Pixels
              </Button>
            )}
          </>
        )}
      </Stack>
      <ColorPicker selectedColor={selectedColor} onSelect={setSelectedColor} />
    </>
  );
};
export default dynamic(() => Promise.resolve(CanvasView), {
  ssr: false,
});
