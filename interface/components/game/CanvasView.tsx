"use client";

import useCanvasControls from "hooks/useControls";
import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import { Box, Button, ButtonGroup, chakra, Flex, IconButton, Image, Stack, VStack } from "@chakra-ui/react";
import ColorPicker from "./ColorPicker";
import usePlacePixels, {
  useAllowance,
  useApproveCanvas,
} from "../../hooks/usePixelActions";
import { useAccount, useBalance, useChainId } from "wagmi";
import useWindowSize from "../../hooks/useWindowSize";
import useRenderCanvas from "../../hooks/useRenderCanvas";
import { getContract } from "../../config/contracts";
import { ChainId } from "components/providers/WagmiProvider";
import ConnectButton from "../ConnectButton";
import { Link } from "@chakra-ui/next-js";
import { Logo } from "canvas-uikit";
import { SettingsIcon } from "@chakra-ui/icons";

const Canvas = styled.canvas`
  image-rendering: pixelated;
  overflow: hidden;
`;

export interface CanvasViewProps {}

const CanvasView: React.FC<CanvasViewProps> = (props: CanvasViewProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { address } = useAccount();
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

  const HomeButton = () => (
    <Link href={"/home"}>
      <Logo show={"logo"}/>
    </Link>
  )

  return (
    <>
      <style>
        {`
        body {
          overflow: hidden;
        }
        `}
      </style>

      <Canvas width={windowSize.w} height={windowSize.h} ref={ref}>
        canvas
      </Canvas>
      <Box
        position="absolute"
        top={3}
        left={3}
      >
        <VStack
          padding={2}
          bg={"gray.100"}
          boxShadow="xl"
          color={"gray.700"}
          borderRadius="md"
          display={[null, "none", "flex"]}
        >
          <IconButton as={Link} href={"/home"} aria-label={"Home"} icon={<Logo height="6" show={"logo"} />}/>
          <IconButton icon={<SettingsIcon/>} aria-label={"Settings"}/>
        </VStack>
      </Box>
      <Flex
        direction={"column"}
        gap={"2"}
        position="absolute"
            bottom={["unset", null, 8]}
            top={[3, null, "unset"]}
            left={[3, null, 8]}>
        <Box
          padding={2}
          minWidth={32}
          borderRadius="md"
          bg={"gray.100"}
          boxShadow="xl"
          color={"gray.700"}
        >
          <chakra.b display={"inline-block"} w={"4"}>
            x
          </chakra.b>
          {hoveredPixel.x.toLocaleString()}, <br />
          <chakra.b display={"inline-block"} w={"4"}>
            y
          </chakra.b>
          {hoveredPixel.y.toLocaleString()}
        </Box>
        <VStack
          padding={2}
          bg={"gray.100"}
          boxShadow="xl"
          color={"gray.700"}
          borderRadius="md"
          display={["flex", null, "none"]}
          alignSelf={"flex-start"}
        >
          <IconButton as={Link} href={"/home"} aria-label={"Home"} icon={<Logo height="6" show={"logo"} />}/>
          <IconButton icon={<SettingsIcon/>} aria-label={"Settings"}/>
        </VStack>
      </Flex>

      <Stack
        position={"absolute"}
        top={3}
        right={3}
        gap={2}
        direction={"column"}
        sx={{ "> *": { alignSelf: "flex-end" } }}
      >
        <ConnectButton/>
        {selectedPixels.length > 0 && (
          <>
            <Box
              bg={"gray.200"}
              color={"gray.800"}
              py={"1"}
              px={"2"}
              borderRadius="sm"
              textAlign={"end"}
              flexGrow={"0"}
              boxShadow={"lg"}
            >
              <chakra.b>{selectedPixels.length}</chakra.b> pixel
              {selectedPixels.length > 1 ? "s" : ""} selected
            </Box>
            <Button onClick={() => clearPixels()}>Clear Pixels</Button>
            {(balance?.value ?? 0n) < necessaryInk ? (
              <Button onClick={() => approveTransaction.write?.()}>
                Get Ink
              </Button>
            ) : (allowance.data ?? 0n) > BigInt(selectedPixels.length) ? (
              <Button onClick={() => approveTransaction.write?.()}>
                Approve Ink
              </Button>
            ) : (
              <Button onClick={() => transaction.write?.()}>
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
