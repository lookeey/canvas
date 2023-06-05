import palettes from "config/palettes";
import pako from "pako";
import {atob} from "next/dist/compiled/@edge-runtime/primitives/encoding";
import { CHUNK_SIZE as CHUNK_SIZE_bigint } from "../config/chunk";

let CHUNK_SIZE = Number(CHUNK_SIZE_bigint);

let emptyImage: ImageBitmap;

let arr = new Uint8ClampedArray((CHUNK_SIZE) * (CHUNK_SIZE) * 4);
  arr.set([12, 230, 1, 255, 12, 230, 1, 255, 12, 230, 1, 255, 12, 230, 1, 255, 12, 230, 1, 255,12, 230, 1, 255, 12, 230, 1, 255, 12, 230, 1, 255, 12, 230, 1, 255, 12, 230, 1, 255, 12, 230, 1, 255, ], 0);

if (typeof window !== "undefined") {
  createImageBitmap(
    new ImageData(arr, (CHUNK_SIZE), (CHUNK_SIZE))
  ).then((img) => (emptyImage = img));
}

export function byteToColor(byte: number) {
  let color = palettes.default[byte] || [0, 0, 0]
  return [...color, 255];
}

function stringToBinary(str: string) {
  let bytes = new Uint8Array(str.length);
  for (var i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}

export function base64ToImageData(source: string) {
  let rawData = stringToBinary(atob(source));
  let data = pako.inflate(rawData);
  let imageData = new Uint8ClampedArray(CHUNK_SIZE * CHUNK_SIZE * 4);
  data.forEach((byte, idx) => {
    imageData.set(byteToColor(byte), idx * 4);
  });
  return createImageBitmap(new ImageData(imageData, CHUNK_SIZE, CHUNK_SIZE));
}

export function uint8ArrayToImageData(rawData: Uint8Array) {
  let data = pako.inflate(rawData);
  let imageData = new Uint8ClampedArray(CHUNK_SIZE * CHUNK_SIZE * 4);
  data.forEach((byte, idx) => {
    imageData.set(byteToColor(byte), idx * 4);
  });
  return createImageBitmap(new ImageData(imageData, CHUNK_SIZE, CHUNK_SIZE));
}

export { emptyImage };
