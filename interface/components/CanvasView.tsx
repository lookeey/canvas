"use client";

import useCanvasControls from "hooks/useControls";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import { emptyImage } from "utils/drawChunk";
import { bi, range } from "utils/chunk";
import { XYPos } from "utils/types";
import useChunksData from "../hooks/useChunksData";
import { CHUNK_SIZE } from "../config/chunk";
import getGradientForFrame from "../utils/gradientAnim";

const Canvas = styled.canvas`
  image-rendering: pixelated;
`;

const Coordinates = styled.div`
  position: fixed;
  left: 2rem;
  bottom: 2rem;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.bg}cc;
  border-radius: 4px;
  
`;

export interface CanvasViewProps {}

const CanvasView: React.FC<CanvasViewProps> = (props: CanvasViewProps) => {
  const ref = useRef<HTMLCanvasElement>(null);

  const { zoom, centerPos, mousePos } = useCanvasControls(ref);

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
        x: bi((-centerPos.x - pixelViewSize.width / 2) / CHUNK_SIZE),
        y: bi((-centerPos.y - pixelViewSize.height / 2) / CHUNK_SIZE),
      },
      {
        x: bi((-centerPos.x + pixelViewSize.width / 2) / CHUNK_SIZE + 2),
        y: bi((-centerPos.y + pixelViewSize.height / 2) / CHUNK_SIZE + 2),
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
    console.log(firstChunk.x);
    return chunks;
  }, [firstChunk.x, firstChunk.y, lastChunk.x, lastChunk.y]);

  useEffect(() => {
    let ctx = ref.current.getContext("2d", { alpha: false });
    let lastRAF = 0;
    ctx.imageSmoothingEnabled = false;

    function draw() {
      if (ref.current) {
        ctx.clearRect(0, 0, ref.current.width, ref.current.height);
      }

      let offsetX = (ctx.canvas.width / (2 * zoom) + centerPos.x) % CHUNK_SIZE;
      let offsetY = (ctx.canvas.height / (2 * zoom) + centerPos.y) % CHUNK_SIZE;

      let offsetXPositive = offsetX >= 0 ? 1n : 0n;
      let offsetYPositive = offsetY >= 0 ? 1n : 0n;

      chunksInView.forEach((chunk) => {
        ctx.scale(zoom, zoom);
        ctx.drawImage(
          chunksData?.get(`${chunk.x}.${chunk.y}`) ?? emptyImage,
          Number(chunk.x - firstChunk.x - offsetXPositive) * CHUNK_SIZE +
            offsetX,
          Number(chunk.y - firstChunk.y - offsetYPositive) * CHUNK_SIZE +
            offsetY
        );
        ctx.resetTransform();
      });

      ctx.fillStyle = "red";

      ctx.lineWidth = zoom >= 24 ? 5 / zoom : 2 / zoom;

      ctx.scale(zoom, zoom);
      let colors = getGradientForFrame(performance.now());

      let pixelOffset = {
        x: (ctx.canvas.width / (2 * zoom) + centerPos.x) % 1,
        y: (ctx.canvas.height / (2 * zoom) + centerPos.y) % 1,
      };

      pixelOffset.x = pixelOffset.x >= 0 ? pixelOffset.x : 1 + pixelOffset.x;
      pixelOffset.y = pixelOffset.y >= 0 ? pixelOffset.y : 1 + pixelOffset.y;

      let posX =
        Math.floor((mousePos.x - pixelOffset.x * zoom) / zoom) + pixelOffset.x;
      let posY =
        Math.floor((mousePos.y - pixelOffset.y * zoom) / zoom) + pixelOffset.y;

      let grad = ctx.createLinearGradient(posX, posY, posX + 1, posY + 1);
      grad.addColorStop(0, `rgb(${colors[0].join(",")})`);
      grad.addColorStop(1, `rgb(${colors[1].join(",")})`);

      ctx.strokeStyle = grad;
      ctx.strokeRect(posX, posY, 1, 1);
      ctx.resetTransform();

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
  ]);

  return (
    <>
      <Canvas width={windowSize.w} height={windowSize.h} ref={ref}>
        canvas
      </Canvas>
      <Coordinates>
        x: {Math.floor(centerPos.x).toLocaleString()}, y: {Math.floor(centerPos.y).toLocaleString()}
      </Coordinates>
    </>
  );
};
export default dynamic(() => Promise.resolve(CanvasView), {
  ssr: false,
});
