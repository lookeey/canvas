import palettes from "config/palettes";
import pako from "pako";
import { CHUNK_SIZE as CHUNK_SIZE_bigint } from "../config/chunk";

let CHUNK_SIZE = Number(CHUNK_SIZE_bigint);

let emptyImage: ImageBitmap;
let arr = new Uint8ClampedArray((CHUNK_SIZE + 1) **2 * 4);
arr.fill(255)

let gridSource = ' \
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> \
              <defs> \
                  <pattern id="smallGrid" width="1" height="1" patternUnits="userSpaceOnUse"> \
                      <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#cccccc" stroke-width="0.08" /> \
                  </pattern> \
              </defs> \
              <rect width="100%" height="100%" fill="url(#smallGrid)" /> \
          </svg>';
export let gridImg: HTMLImageElement;

if (typeof window !== "undefined") {
  gridImg = new Image();
  let DOMURL = window.URL;
  createImageBitmap(
    new ImageData(arr, (CHUNK_SIZE + 1), (CHUNK_SIZE + 1))
  ).then((img) => (emptyImage = img));

  let svg = new Blob([gridSource], {type: 'image/svg+xml;charset=utf-8'});
  gridImg.src = DOMURL.createObjectURL(svg);
}

export function byteToColor(byte: number) {
  let color = palettes.default[byte] || [0, 0, 0]
  return [...color, 255];
}

export function applyPixels(compressedData: Uint8Array, pixels: { [key: string]: number }) {
  let data = pako.inflate(compressedData);
  Object.entries(pixels).forEach(([key, value]) => {
    let [x, y] = key.split(".").map((n) => Number(n));
    let idx = (y * (CHUNK_SIZE) + x);
    console.log(value, idx)
    data.set([value], idx);
  });
  return pako.deflate(data);
}

// repeats pixels at the borders of a chunk, so that there are no gaps between chunks in firefox
export function uint8ArrayToImageData(rawData: Uint8Array) {
  let data = pako.inflate(rawData);
  let imageData = new Uint8ClampedArray((CHUNK_SIZE + 1) ** 2 * 4);
  for (let i = 0; i < CHUNK_SIZE; i++) {
    for (let j = 0; j < CHUNK_SIZE; j++) {
      let index = ((i * (CHUNK_SIZE + 1)) + j) * 4;
      imageData.set(byteToColor(data[((i * (CHUNK_SIZE)) + j)]), index);
    }
    let offsetPixelIndex = ((i * (CHUNK_SIZE + 1)) + CHUNK_SIZE);
    imageData.set(byteToColor(data[offsetPixelIndex]), offsetPixelIndex * 4);
  }
  let lastRowIndex = (CHUNK_SIZE) ** 2 * 4;
  imageData = imageData.copyWithin(
    lastRowIndex + CHUNK_SIZE * 4 + 4,
    lastRowIndex,
    lastRowIndex + CHUNK_SIZE * 4
  )
  return createImageBitmap(new ImageData(imageData, (CHUNK_SIZE + 1), (CHUNK_SIZE + 1)));
}

export { emptyImage };
