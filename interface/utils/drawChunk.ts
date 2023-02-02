import palettes from "config/palettes";
import SnappyJS from "snappyjs";

type ChunkData = string;

export const fromHexString = (hexString: string) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

function byteToColor(byte: number) {
  let color = palettes.default[byte];
  return [...color, 255];
}

export default function uncompress(chunkData: ChunkData) {
  let rawData = SnappyJS.uncompress(fromHexString(chunkData));
  let data = Uint8Array.from(rawData);

  let imageData = new Uint8ClampedArray(64 * 64 * 4);
  data.forEach((byte, idx) => {
    imageData.set(byteToColor(byte), idx * 4);
  });

  return Uint8ClampedArray.from(imageData);
}

let emptyImage;

if (typeof window !== "undefined") {
  createImageBitmap(
    new ImageData(Uint8ClampedArray.from(Array(64 * 64 * 4).fill(0xff)), 64, 64)
  ).then((img) => (emptyImage = img));
}

export function hexToImageData(hex: string) {
  return createImageBitmap(new ImageData(uncompress(hex.slice(2)), 64, 64));
}

export { emptyImage };
