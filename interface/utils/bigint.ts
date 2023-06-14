export function bi(val: string | number) {
  return typeof val === "number" ? BigInt(Math.floor(val)) : BigInt(val);
}

export function range(start: bigint, end: bigint): bigint[] {
  if (start === end) return [start];
  let increment = start < end;
  return [start, ...range(start + (increment ? 1n : -1n), end)];
}

export function floorDiv(a: bigint, b: bigint): bigint {
  let result = a / b;
  return a % b < 0 ? result - 1n : result;
}

export function floorMod(a: bigint, b: bigint): bigint {
  return ((a % b) + b) % b;
}