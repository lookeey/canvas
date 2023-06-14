import React, { useEffect, useMemo, useState } from "react";
import { CHUNK_SIZE } from "../config/chunk";
import { byteToColor, emptyImage, gridImg } from "../utils/drawChunk";
import getGradientForFrame from "../utils/gradientAnim";
import { bi, floorDiv, range } from "../utils/bigint";
import useChunksData from "./useChunksData";
import { XYPos } from "../utils/types";

const useRenderCanvas = ({
  ref,
  zoom,
  centerPos,
  centerPosOffset,
  mousePos,
  selectedPixels
}: {
  ref: React.RefObject<HTMLCanvasElement>;
  zoom: number;
  centerPos: XYPos;
  centerPosOffset: XYPos<number>;
  mousePos: XYPos<number>;
  selectedPixels: (XYPos & {color: bigint})[];
}) => {
  const [firstChunk, lastChunk] = useMemo(() => {
    let pixelViewSize = {
      width: window.innerWidth / zoom,
      height: window.innerHeight / zoom,
    };
    return [
      {
        x: floorDiv(
          ((centerPos.x) - bi(pixelViewSize.width) / 2n) - 1n,
          (CHUNK_SIZE)
        ),
        y: floorDiv(
          ((centerPos.y) - bi(pixelViewSize.height ) / 2n) -1n,
          (CHUNK_SIZE)
        ),
      },
      {
        x: (
          ((centerPos.x) + bi(pixelViewSize.width) / 2n) / (CHUNK_SIZE)
        ),
        y: (
          ((centerPos.y) + bi(pixelViewSize.height) / 2n) / (CHUNK_SIZE)
        ),
      },
    ];
  }, [centerPos.x, centerPos.y, zoom]);

  const chunksData = useChunksData(firstChunk, lastChunk);

  const chunksInView = useMemo(() => {
    let chunks: XYPos[] = [];
    range(firstChunk.x -1n, lastChunk.x).forEach((x) => {
      range(firstChunk.y -1n, lastChunk.y).forEach((y) => {
        chunks.push({ x, y });
      });
    });
    return chunks;
  }, [firstChunk.x, firstChunk.y, lastChunk.x, lastChunk.y]);

  useEffect(() => {
    // @ts-ignore
    let ctx = ref.current.getContext("2d", {
      alpha: false,
    }) as CanvasRenderingContext2D;
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
          (ctx.canvas.width / (2 * zoom) - Number(centerPos.x % CHUNK_SIZE)) % Number(CHUNK_SIZE);
        let offsetY =
          (ctx.canvas.height / (2 * zoom) - Number(centerPos.y % CHUNK_SIZE)) % Number(CHUNK_SIZE);

        let offsetXPositive = offsetX > 0 ? 1 : 0;
        let offsetYPositive = offsetY > 0 ? 1 : 0;

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

        ctx.lineWidth = zoom >= 12 ? 5 / zoom : 2 / zoom;
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
          );
        });

        const positions = pixelsInView.map((pixel) => {
          return {
            x:
              Math.floor(
                ((Number(pixel.x - centerPos.x) + centerPosOffset.x) * zoom +
                  ctx.canvas.width / 2) /
                  zoom
              ) + pixelOffset.x,
            y:
              Math.floor(
                ((Number(pixel.y - centerPos.y) + centerPosOffset.y) * zoom +
                  ctx.canvas.height / 2) /
                  zoom
              ) + pixelOffset.y,
          };
        });

        positions.forEach((pos, idx) => {
          ctx.lineWidth = 6 / zoom;
          ctx.strokeRect(pos.x, pos.y, 1, 1);
        });

        positions.forEach((pos, idx) => {
          ctx.fillStyle = `rgba(${byteToColor(
            Number(pixelsInView[idx].color)
          ).join(",")})`;
          ctx.strokeStyle = `rgba(${byteToColor(
            Number(pixelsInView[idx].color)
          ).join(",")})`;
          ctx.lineWidth = 0.5 / zoom;
          ctx.fillRect(pos.x, pos.y, 1, 1);
          ctx.strokeRect(pos.x, pos.y, 1, 1);
        });

        ctx.resetTransform();
      }

      const drawGrid = function () {
        if (zoom < 8) return;
        ctx.scale(zoom, zoom);
        let x =
          Math.floor(ctx.canvas.width / 2 / zoom) -
          Math.floor(ctx.canvas.width / 2) +
          pixelOffset.x;
        let y =
          Math.floor(ctx.canvas.height / 2 / zoom) -
          Math.floor(ctx.canvas.height / 2) +
          pixelOffset.y;
        ctx.drawImage(gridImg, x, y);
        ctx.resetTransform();
      };

      drawChunks();
      drawGrid();
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
    centerPosOffset.x,
    centerPosOffset.y,
  ]);
};

export default useRenderCanvas