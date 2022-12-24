"use client";

import useCanvasControls from "hooks/useControls";
import range from "lodash/range";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { emptyImage } from "utils/drawChunk";
import type { XYPos } from "utils/types";

function round(n: number) {
  return (n + 0.5) << 0;
}

const Canvas = styled.canvas`
  image-rendering: pixelated;
`;

export interface CanvasViewProps {}

const CanvasView: React.FC<CanvasViewProps> = (props: CanvasViewProps) => {
  const ref = useRef<HTMLCanvasElement>(null);

  const { zoom, centerPos } = useCanvasControls(ref);

  const [windowSize, setWindowSize] = useState({
    w: window?.innerWidth ?? 0,
    h: window?.innerHeight ?? 0,
  });

  const chunksData = useRef<{ [key: number]: { [key: number]: ImageData } }>(
    {}
  );

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowSize({
        w: window?.innerWidth ?? 0,
        h: window?.innerHeight ?? 0,
      });
    });
  }, []);

  useEffect(() => {
    let ctx = ref.current.getContext("2d", { alpha: false });
    let lastRAF = 0;
    ctx.imageSmoothingEnabled = false;

    function draw() {
      if (ref.current) {
        ctx.clearRect(0, 0, ref.current.width, ref.current.height);
      }

      let pixelViewSize = {
        width: window.innerWidth / zoom,
        height: window.innerHeight / zoom,
      };
      let firstChunk = {
        x: Math.floor((centerPos.x - pixelViewSize.width / 2) / 64),
        y: Math.floor((centerPos.y - pixelViewSize.height / 2) / 64),
      };
      let lastChunk = {
        x: Math.floor((centerPos.x + pixelViewSize.width / 2) / 64 + 2),
        y: Math.floor((centerPos.y + pixelViewSize.height / 2) / 64 + 2),
      };

      let offsetX = (ctx.canvas.width / (2 * zoom) + centerPos.x) % 64;
      let offsetY = (ctx.canvas.height / (2 * zoom) + centerPos.y) % 64;

      range(firstChunk.x, lastChunk.x).forEach((x) => {
        range(firstChunk.y, lastChunk.y).forEach((y) => {
          ctx.scale(zoom, zoom);
          ctx.drawImage(
            emptyImage,
            (x - firstChunk.x - 1) * 64 + offsetX,
            (y - firstChunk.y - 1) * 64 + offsetY
          );
          ctx.resetTransform();
        });
      });

      lastRAF = window.requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.cancelAnimationFrame(lastRAF);
    };
  }, [centerPos.x, centerPos.y, zoom]);

  return (
    <Canvas width={windowSize.w} height={windowSize.h} ref={ref}>
      canvas
    </Canvas>
  );
};
export default dynamic(() => Promise.resolve(CanvasView), {
  ssr: false,
});
