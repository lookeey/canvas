import { XYPos } from "../utils/types";
import { useEffect, useRef, useState } from "react";
import { CappedMap } from "../utils/sortedMap";
import { range } from "../utils/chunk";
import { base64ToImageData, emptyImage, uint8ArrayToImageData } from "../utils/drawChunk";

const CACHE_INV_TIME = 10000

async function queryChunk(pos: XYPos): Promise<Uint8Array | null> {
  const res = await fetch(
    `http://localhost:8081/${pos.x.toString()}.${pos.y.toString()}.chunk`,
    {
      method: "GET",
      cache: "no-store"
    }
  );
  if (res.status === 200) {
    return new Uint8Array(await res.arrayBuffer());
  }
  return null;
}

function useChunkData(firstChunk: XYPos, lastChunk: XYPos) {
  const [chunksInView, setChunksInView] = useState<XYPos[]>([]);
  const [chunksToFetch, setChunksToFetch] = useState<XYPos[]>([]);
  const chunkDataCache = useRef<CappedMap<string, Uint8Array>>(null);
  const chunkIsLoading = useRef<{ [key: string]: boolean }>({});
  const imageDataCache = useRef<CappedMap<string, ImageBitmap>>(null);
  const lastCacheTime = useRef<CappedMap<string, number>>(null);

  useEffect(() => {
    chunkDataCache.current = new CappedMap<string, Uint8Array>(4096);
    imageDataCache.current = new CappedMap<string, ImageBitmap>(4096);
    lastCacheTime.current = new CappedMap<string, number>(4096);
  }, []);

  const [chunkImageData, setChunkImageData] = useState<{
    [key: string]: ImageBitmap;
  }>({});
  const [cacheIter, setCacheIter] = useState(0);

  useEffect(() => {
    let chunks = [];
    range(firstChunk.x - 1n, lastChunk.x + 1n).forEach((x) => {
      range(firstChunk.y - 1n, lastChunk.y + 1n).forEach((y) => {
        chunks.push({ x, y });
      });
    });
    setChunksInView(chunks);
  }, [firstChunk.x, firstChunk.y, lastChunk.x, lastChunk.y]);

  useEffect(() => {
    chunksInView.forEach((chunk) => {
      setTimeout(() => {
        setChunksToFetch((toFetch) =>
          toFetch.includes(chunk) && chunksInView.includes(chunk)
            ? toFetch
            : toFetch.concat([chunk])
        );
      }, 400);
    });
    setChunksToFetch((toFetch) =>
      toFetch.filter((chunk) => chunksInView.includes(chunk))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunksInView[0]?.x, chunksInView[0]?.y]);

  useEffect(() => {
    chunksToFetch.forEach((chunk) => {
      let chunkKey = `${chunk.x}.${chunk.y}`;
      if (
        !chunkDataCache.current.get(chunkKey) &&
        !chunkIsLoading.current?.[chunkKey] &&
        Date.now() - (lastCacheTime.current?.get(chunkKey) ?? 0) > CACHE_INV_TIME
      ) {
        chunkIsLoading.current[chunkKey] = true;
        queryChunk(chunk).then((data) => {
          lastCacheTime.current.push(chunkKey, Date.now());
          chunkDataCache.current.push(chunkKey, data);
          setCacheIter((iter) => iter + 1);
          delete chunkIsLoading.current[chunkKey];
        });
        setCacheIter((iter) => iter + 1);
      }
    });
  }, [chunksToFetch]);

  useEffect(() => {
    let dataCache = chunkDataCache.current;
    range(firstChunk.x, lastChunk.x).forEach((x) => {
      range(firstChunk.y, lastChunk.y).forEach((y) => {
        let chunkKey = `${x}.${y}`;
        let data = dataCache.get(chunkKey);
        if (data && !imageDataCache.current.get(chunkKey)) {
            console.log(data)
          uint8ArrayToImageData(data).then((img) => {
            imageDataCache.current.push(chunkKey, img);
          });
        }
      });
    });
    /*setChunkImageData(
            chunksInView.map((chunk) => {
                let chunkKey = `${chunk.x}.${chunk.y}`;
                let data = chunkDataCache.current.get(chunkKey);
                if (data) {
                    return base64ToImageData(data);
                }
                return emptyImage;
            })
        );*/
  }, [cacheIter, firstChunk.x, firstChunk.y, lastChunk.x, lastChunk.y]);

  return imageDataCache.current;
}

export default useChunkData;
