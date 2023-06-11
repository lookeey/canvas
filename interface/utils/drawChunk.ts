import palettes from "config/palettes";
import pako from "pako";
import { CHUNK_SIZE as CHUNK_SIZE_bigint } from "../config/chunk";

let CHUNK_SIZE = Number(CHUNK_SIZE_bigint);

let emptyImage: ImageBitmap;
let arr = new Uint8ClampedArray((CHUNK_SIZE) * (CHUNK_SIZE) * 4);
  arr.fill(255)

let gridSource = ' \
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> \
              <defs> \
                  <pattern id="smallGrid" width="1" height="1" patternUnits="userSpaceOnUse"> \
                      <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.1" /> \
                  </pattern> \
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"> \
                      <rect width="80" height="80" fill="url(#smallGrid)" /> \
                      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="0.2" /> \
                  </pattern> \
              </defs> \
              <rect width="100%" height="100%" fill="url(#smallGrid)" /> \
          </svg>';
export let gridImg: HTMLImageElement;

if (typeof window !== "undefined") {
  gridImg = new Image();
  let DOMURL = window.URL;
  createImageBitmap(
    new ImageData(arr, (CHUNK_SIZE), (CHUNK_SIZE))
  ).then((img) => (emptyImage = img));

  let svg = new Blob([gridSource], {type: 'image/svg+xml;charset=utf-8'});
  gridImg.src = DOMURL.createObjectURL(svg);
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

export function applyPixels(compressedData: Uint8Array, pixels: { [key: string]: number }) {
  let data = pako.inflate(compressedData);
  Object.entries(pixels).forEach(([key, value]) => {
    let [x, y] = key.split(".").map((n) => Number(n));
    let idx = (y * CHUNK_SIZE + x);
    data.set([value], idx);
  });
  return pako.deflate(data);
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
