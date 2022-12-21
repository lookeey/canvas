import SnappyJS from "snappyjs";

type ChunkData = string;

const fromHexString = (hexString: string) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

function byteToColor(byte: number) {
  switch (byte) {
    case 0:
      return [233, 200, 200, 255];
    default:
      return [122, 124, 231, 212];
  }
}

export default function uncompress(chunkData: ChunkData) {
  let rawData = SnappyJS.uncompress(fromHexString(chunkData));
  let data = Uint8Array.from(rawData);

  let imageData = new Uint8ClampedArray(64 * 64 * 4);
  data.forEach((byte, idx) => {
    imageData.set(byteToColor(byte), idx * 4);
  });

  return Uint8ClampedArray.from(rawData);
}

const AA = Uint8ClampedArray.from(
  Array(64 * 64 * 4)
    .fill(0xff)
    .map((n, idx) =>
      idx + (1 % 4) === 0 ? 255 : Math.floor(255 * (idx / (64 * 64 * 4)))
    )
);

let emptyImage;

if (typeof window !== "undefined") {
  createImageBitmap(
    new ImageData(
      AA, // Uint8ClampedArray.from(Array(64 * 64 * 4).fill(0xff)),
      64,
      64
    )
  ).then((img) => (emptyImage = img));
}

export { emptyImage };
