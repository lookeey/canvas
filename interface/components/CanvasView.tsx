"use client";

import useCanvasControls from "hooks/useControls";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import { byteToColor, emptyImage } from "utils/drawChunk";
import { bi, range } from "utils/chunk";
import { XYPos } from "utils/types";
import useChunksData from "../hooks/useChunksData";
import { CHUNK_SIZE } from "../config/chunk";
import getGradientForFrame from "../utils/gradientAnim";
import { Box, Button, chakra, Flex } from "@chakra-ui/react";
import ColorPicker from "./ColorPicker";
import usePlacePixels from "../hooks/usePixelActions";

const Canvas
  = styled.canvas`
  image-rendering: pixelated;
  overflow: hidden;
`;

export interface CanvasViewProps {}

const CanvasView: React.FC<CanvasViewProps> = (props: CanvasViewProps) => {
  const ref = useRef<HTMLCanvasElement>(null);

  const {
    zoom,
    centerPos,
    centerPosOffset,
    mousePos,
    setSelectedColor,
    selectedPixels,
    selectedColor,
    clearPixels
  } = useCanvasControls(ref);

  const transaction = usePlacePixels(selectedPixels)

  const [windowSize, setWindowSize] = useState({
    w: window?.innerWidth ?? 0,
    h: window?.innerHeight ?? 0,
  });

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowSize({
        w: window?.innerWidth ?? 0,
        h: window?.innerHeight ?? 0,
      });
    });
  }, []);

  const [firstChunk, lastChunk] = useMemo(() => {
    let pixelViewSize = {
      width: window.innerWidth / zoom,
      height: window.innerHeight / zoom,
    };
    return [
      {
        x: bi((Number(-centerPos.x)- pixelViewSize.width / 2) / Number(CHUNK_SIZE)),
        y: bi((Number(-centerPos.y) - pixelViewSize.height / 2) / Number(CHUNK_SIZE)),
      },
      {
        x: bi((Number(-centerPos.x) + pixelViewSize.width / 2) / Number(CHUNK_SIZE) + 2),
        y: bi((Number(-centerPos.y) + pixelViewSize.height / 2) / Number(CHUNK_SIZE) + 2),
      },
    ];
  }, [centerPos.x, centerPos.y, zoom]);

  const chunksData = useChunksData(firstChunk, lastChunk);

  const chunksInView = useMemo(() => {
    let chunks: XYPos[] = [];
    range(firstChunk.x, lastChunk.x).forEach((x) => {
      range(firstChunk.y, lastChunk.y).forEach((y) => {
        chunks.push({ x, y });
      });
    });
    return chunks;
  }, [firstChunk.x, firstChunk.y, lastChunk.x, lastChunk.y]);

  useEffect(() => {
    // @ts-ignore
    let ctx = ref.current.getContext("2d", { alpha: false }) as CanvasRenderingContext2D;
    let lastRAF = 0;
    ctx.imageSmoothingEnabled = false;

    function draw() {
      if (ref.current) {
        ctx.clearRect(0, 0, ref.current.width, ref.current.height);
      }

      let pixelOffset = {
        x: (ctx.canvas.width / (2 * zoom) + centerPosOffset.x) % 1,
        y: (ctx.canvas.height / (2 * zoom) + centerPosOffset.y) % 1,
      };

      pixelOffset.x = pixelOffset.x >= 0 ? pixelOffset.x : 1 + pixelOffset.x;
      pixelOffset.y = pixelOffset.y >= 0 ? pixelOffset.y : 1 + pixelOffset.y;

      function drawChunks() {
        let offsetX =
          (ctx.canvas.width / (2 * zoom) + Number(centerPos.x % CHUNK_SIZE)) % Number(CHUNK_SIZE);
        let offsetY =
          (ctx.canvas.height / (2 * zoom) + Number(centerPos.y % CHUNK_SIZE)) % Number(CHUNK_SIZE);

        let offsetXPositive = offsetX >= 0 ? 1 : 0;
        let offsetYPositive = offsetY >= 0 ? 1 : 0;

        chunksInView.forEach((chunk) => {
          ctx.scale(zoom, zoom);
          ctx.drawImage(
            chunksData?.get(`${chunk.x}.${chunk.y}`) ?? emptyImage,
            (Number(chunk.x - firstChunk.x) - offsetXPositive) * Number(CHUNK_SIZE) +
              offsetX + centerPosOffset.x ,
            (Number(chunk.y - firstChunk.y) - offsetYPositive) * Number(CHUNK_SIZE) +
              offsetY + centerPosOffset.y,
          );
          ctx.resetTransform();
        });
      }

      function drawHoveredPixel() {
        let posX =
          Math.floor((mousePos.x - pixelOffset.x * zoom) / zoom) +
          pixelOffset.x;
        let posY =
          Math.floor((mousePos.y - pixelOffset.y * zoom) / zoom) +
          pixelOffset.y;

        let colors = getGradientForFrame(performance.now());
        let grad = ctx.createLinearGradient(posX, posY, posX + 1, posY + 1);
        grad.addColorStop(0, `rgb(${colors[0].join(",")})`);
        grad.addColorStop(1, `rgb(${colors[1].join(",")})`);
        ctx.strokeStyle = grad;

        ctx.lineWidth = zoom >= 24 ? 5 / zoom : 2 / zoom;
        ctx.scale(zoom, zoom);
        ctx.strokeRect(posX, posY, 1, 1);
        ctx.resetTransform();
      }

      function drawSelectedPixels() {
        ctx.scale(zoom, zoom);

        ctx.strokeStyle =
          performance.now() % 1000 > 500 ? "#46ffba" : "#004b45";

        ctx.lineWidth = 6 / zoom;

        const pixelsInView = selectedPixels.filter((pixel) => {
          return (
            pixel.x < centerPos.x + bi((ctx.canvas.width / 2) * zoom) &&
            pixel.x > centerPos.x - bi((ctx.canvas.width / 2) * zoom)
          )
        })

        for (let selectedPixel of pixelsInView) {
          let selectedPos = {
            x:
              Math.floor(
                ((Number(selectedPixel.x + centerPos.x) + centerPosOffset.x) * zoom +
                  ctx.canvas.width / 2) /
                  zoom
              ) + pixelOffset.x,
            y:
              Math.floor(
                ((Number(selectedPixel.y + centerPos.y) + centerPosOffset.y) * zoom +
                  ctx.canvas.height / 2) /
                  zoom
              ) + pixelOffset.y,
          };
          ctx.lineWidth = 6 / zoom;
          ctx.strokeRect(selectedPos.x, selectedPos.y, 1, 1);
        }

        for (let selectedPixel of selectedPixels) {
          let selectedPos = {
            x:
              Math.floor(
                ((Number(selectedPixel.x + centerPos.x) + centerPosOffset.x) * zoom +
                  ctx.canvas.width / 2) /
                  zoom
              ) + pixelOffset.x,
            y:
              Math.floor(
                ((Number(selectedPixel.y + centerPos.y) + centerPosOffset.y) * zoom +
                  ctx.canvas.height / 2) /
                  zoom
              ) + pixelOffset.y,
          };

          ctx.fillStyle = `rgba(${byteToColor(Number(selectedPixel.color)).join(",")})`;
          ctx.strokeStyle = `rgba(${byteToColor(Number(selectedPixel.color)).join(
            ","
          )})`;
          ctx.lineWidth = 0.5 / zoom;
          ctx.fillRect(selectedPos.x, selectedPos.y, 1, 1);
          ctx.strokeRect(selectedPos.x, selectedPos.y, 1, 1);
        }

        ctx.resetTransform();
      }

      drawChunks();
      drawSelectedPixels();
      drawHoveredPixel();

      lastRAF = window.requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.cancelAnimationFrame(lastRAF);
    };
  }, [
    centerPos.x,
    centerPos.y,
    chunksData,
    chunksInView,
    firstChunk.x,
    firstChunk.y,
    zoom,
    mousePos.x,
    mousePos.y,
    selectedPixels.length,
  ]);

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
        bg={"blackAlpha.800"}
        position="absolute"
        bottom={8}
        left={8}
        padding={2}
        minWidth={32}
        borderRadius="md"
      >
        <chakra.b display={"inline-block"} w={"24px"}>x</chakra.b>
        {centerPos.x.toLocaleString()}, <br/>
        <chakra.b display={"inline-block"} w={"24px"}>y</chakra.b>
        {centerPos.y.toLocaleString()}
      </Box>
      <Flex
        position={"absolute"}
        top={3}
        right={3}
        gap={2}
        direction={"column"}
      >
        {selectedPixels.length > 0 && (
          <>
            <Box
              bg={"whiteAlpha.700"}
              color={"gray.700"}
              py={"1"}
              px={"2"}
              minWidth={"40"}
              borderRadius="md"
              textAlign={"end"}
              flexGrow={"0"}
            >
              <chakra.b>{selectedPixels.length}</chakra.b> pixels selected
            </Box>
            <Button size={"sm"} onClick={() => clearPixels()}>Clear Pixels</Button>
            <Button size={"sm"} onClick={() => clearPixels()}>Paint Pixels</Button>
          </>
        )}
      </Flex>
      <ColorPicker selectedColor={selectedColor} onSelect={setSelectedColor} />
    </>
  );
};
export default dynamic(() => Promise.resolve(CanvasView), {
  ssr: false,
});
