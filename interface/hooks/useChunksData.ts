import { XYPos } from "../utils/types";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { CappedMap } from "../utils/sortedMap";
import { range } from "../utils/chunk";
import { applyPixels, emptyImage, uint8ArrayToImageData } from "../utils/drawChunk";
import { watchContractEvent } from "viem/contract";
import tracingApiClient from "../utils/tracingApiClient";
import { useChainId } from "wagmi";
import { ChainId } from "../pages/_app";
import { getContract } from "../config/contracts";
import { CHUNK_SIZE } from "../config/chunk";

const CACHE_INV_TIME = 10000;

async function queryChunk(pos: XYPos): Promise<Uint8Array | null> {
  const res = await fetch(
    `https://araras.b-cdn.net//${pos.x.toString()}.${pos.y.toString()}.chunk`,
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
  const chunkDataCache = useRef<CappedMap<string, Uint8Array> | null>(null) as React.MutableRefObject<CappedMap<string, Uint8Array>>;
  const chunkIsLoading = useRef<{ [key: string]: boolean }>({});
  const eventPixelCache = useRef<CappedMap<string, {[key: string]: number}> | null>(null) as React.MutableRefObject<CappedMap<string, {[key: string]: number}>>;
  const imageDataCache = useRef<CappedMap<string, ImageBitmap> | null>(null) as React.MutableRefObject<CappedMap<string, ImageBitmap>>;
  const lastCacheTime = useRef<CappedMap<string, number> | null>(null) as React.MutableRefObject<CappedMap<string, number>>;
  const hasUpdated = useRef<{[key: string]: boolean}>({ });

  useEffect(() => {
    chunkDataCache.current = new CappedMap(4096);
    imageDataCache.current = new CappedMap(4096);
    lastCacheTime.current = new CappedMap(4096);
    eventPixelCache.current = new CappedMap(8192);
  }, []);

  const chainId = useChainId() as ChainId;
  const [cacheIter, setCacheIter] = useState(0);


  useEffect(() => {
    let chunks: XYPos[] = [];
    range(firstChunk.x, lastChunk.x).forEach((x) => {
      range(firstChunk.y, lastChunk.y).forEach((y) => {
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
        !chunkDataCache.current?.get(chunkKey) &&
        !chunkIsLoading.current?.[chunkKey] &&
        Date.now() - (lastCacheTime.current?.get(chunkKey) ?? 0) > CACHE_INV_TIME
      ) {
        chunkIsLoading.current[chunkKey] = true;
        queryChunk(chunk).then((data) => {
          lastCacheTime.current.push(chunkKey, Date.now());
          if (data) {
            chunkDataCache.current.push(chunkKey, data);
          }
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
        if (data && (!imageDataCache.current.get(chunkKey) || hasUpdated.current[chunkKey])) {
          if (eventPixelCache.current.get(chunkKey)) {
            data = applyPixels(data, eventPixelCache.current.get(chunkKey) ?? {});
          }
          uint8ArrayToImageData(data).then((img) => {
            imageDataCache.current.push(chunkKey, img);
          });
          hasUpdated.current[chunkKey] = false;
        }
      });
    });
    let currentPixels = eventPixelCache.current.get("0.0") ?? {};
  }, [cacheIter, firstChunk.x, firstChunk.y, lastChunk.x, lastChunk.y]);

  useEffect(() => {
    tracingApiClient(chainId).watchContractEvent({
      ...getContract("canvas", chainId),
      eventName: "PixelPlaced",
      onLogs: (logs) => {
        logs.forEach((log) => {
          let x = log.args.x ?? 0n;
          let y = log.args.y ?? 0n;
          let chunkX = x / CHUNK_SIZE;
          let chunkY = y / CHUNK_SIZE;
          let chunkKey = `${chunkX}.${chunkY}`;

          let currentPixels = eventPixelCache.current.get(chunkKey) ?? {};

          eventPixelCache.current.push(chunkKey, {
            ...currentPixels,
            [`${x % CHUNK_SIZE}.${y % CHUNK_SIZE}`]: Number(log.args?.colorId) ?? 0
          })
          hasUpdated.current[chunkKey] = true;
        });
        setCacheIter((iter) => iter + 1)
      }
    })
  }, [chainId])

  return imageDataCache.current;
}

export default useChunkData;
