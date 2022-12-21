"use client";

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
  const [centerPos, setCenterPos] = useState({ x: 20, y: 20 });
  const [zoom, setZoom] = useState(1);
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

  const [dragging, setDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let canvas = ref.current;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setLastMousePos({ x: e.clientX, y: e.clientY });
      setDragging(true);
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
    };

    const handleMove = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (dragging) {
        setCenterPos({
          x: centerPos.x + (e.clientX - lastMousePos.x) / zoom,
          y: centerPos.y + (e.clientY - lastMousePos.y) / zoom,
        });
        setLastMousePos({
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMove);
    };
  }, [
    centerPos.x,
    centerPos.y,
    dragging,
    lastMousePos.x,
    lastMousePos.y,
    zoom,
  ]);

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
        x: Math.floor((centerPos.x - pixelViewSize.width / 2) / 64 - 1),
        y: Math.floor((centerPos.y - pixelViewSize.height / 2) / 64 - 1),
      };
      let lastChunk = {
        x: Math.floor((centerPos.x + pixelViewSize.width / 2) / 64 + 1),
        y: Math.floor((centerPos.y + pixelViewSize.height / 2) / 64 + 1),
      };

      let chunksInView: { x: number; y: number }[] = [];
      range(firstChunk.x, lastChunk.x).forEach((x) => {
        range(firstChunk.y, lastChunk.y).forEach((y) => {
          chunksInView.push({ x, y });
        });
      });

      let offsetX = centerPos.x % (64 * zoom);
      let offsetY = centerPos.y % (64 * zoom);

      chunksInView.forEach((chunk) => {
        ctx.scale(zoom, zoom);
        ctx.drawImage(
          emptyImage,
          round((chunk.x - firstChunk.x - 1) * 64 + offsetX),
          round((chunk.y - firstChunk.y - 1) * 64 + offsetY)
        );
        ctx.resetTransform();
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
