import { XYPos } from "./types";

export function bi(val: string | number) {
  return typeof val === "number" ? BigInt(Math.floor(val)) : BigInt(val);
}

function sqrt(value: bigint) {
  if (value < 0n) {
    throw "square root of negative numbers is not supported";
  }

  if (value < 2n) {
    return value;
  }

  function newtonIteration(n: bigint, x0: bigint): bigint {
    const x1 = (n / x0 + x0) >> 1n;
    if (x0 === x1 || x0 === x1 - 1n) {
      return x0;
    }
    return newtonIteration(n, x1);
  }

  return newtonIteration(value, 1n);
}

export function range(start: bigint, end: bigint): bigint[] {
  if (start === end) return [start];
  let increment = start < end;
  return [start, ...range(start + (increment ? 1n : -1n), end)];
}

export function chunkBlockForChunk(z: bigint) {
  return (z - 3n) / 6n;
}

export function getChunkId({ x, y }: XYPos) {
  let halfCanvasSize = 2n ** 255n / 64n;
  x = x + halfCanvasSize;
  y = y + halfCanvasSize;

  return x >= y ? x ** 2n + x + y : y ** 2n + x;
}

export function getChunkById(id: bigint) {
  const sqrtId = sqrt(id);
  const squareId = id ** 2n;

  return id - squareId > sqrtId
    ? { x: sqrtId, y: id - squareId - sqrtId }
    : { x: id - squareId, y: sqrtId };
}
