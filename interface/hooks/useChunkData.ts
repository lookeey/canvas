import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useEffect, useMemo, useRef, useState } from "react";
import graphClient from "utils/apolloClient";
import { chunkBlockForChunk, getChunkId, range } from "utils/chunk";
import { emptyImage, fromHexString, hexToImageData } from "utils/drawChunk";
import { CappedMap } from "utils/sortedMap";
import { XYPos } from "utils/types";

async function queryChunkBlock(
  block: XYPos
): Promise<{ [key: string]: { data: string } }> {
  let chunks = [];
  let firstChunk = { x: block.x - 3n, y: block.y + 3n };
  let lastChunk = { x: block.x + 2n, y: block.y - 2n };

  range(firstChunk.x, lastChunk.x).forEach((x) => {
    range(firstChunk.y, lastChunk.y).forEach((y) => {
      chunks.push({ x, y });
    });
  });

  let chunkQueries = chunks.map(
    (chunk) =>
      `chunk_${getChunkId(chunk)}: chunk(id: "0x${getChunkId(chunk).toString(
        16
      )}") {
      data
    }`
  );

  let query = gql(`
    query {
      ${chunkQueries.join("\n")}
    }
  `);

  let res: { data: { [key: string]: string } } = await graphClient.query({
    query,
  });

  let chunkData = Object.entries(res.data).map(([chunkName, data]) => {
    return [chunkName, data ?? null];
  });

  return Object.fromEntries(chunkData);
}

/**
 * @param firstChunk: first chunk in viewport, top left corner
 * @param lastChunk: last chunk in viewport, bottom right corner
 * @returns non-reactive block ImageData object for viewport
 */
function useChunkData(firstChunk: XYPos, lastChunk: XYPos) {
  const [blocksInView, setBlocksInView] = useState([]);
  const [blocksToFetch, setBlocksToFetch] = useState([]);
  const chunkDataCache =
    useRef<CappedMap<string, { [key: string]: { data: string } }>>(null);
  const blockIsLoading = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    chunkDataCache.current = new CappedMap<
      string,
      { [key: string]: { data: string } }
    >(4096);
  }, []);

  const [chunkImageData, setChunkImageData] = useState<{
    [key: string]: ImageData;
  }>({});
  const [cacheIter, setCacheIter] = useState(0);

  useEffect(() => {
    let blocks = [];
    range(
      chunkBlockForChunk(firstChunk.x) - 1n,
      chunkBlockForChunk(lastChunk.x) + 1n
    ).forEach((x) => {
      range(
        chunkBlockForChunk(firstChunk.y) - 1n,
        chunkBlockForChunk(lastChunk.y) + 1n
      ).forEach((y) => {
        blocks.push({ x, y });
      });
    });
    setBlocksInView(blocks);
  }, [firstChunk.x, firstChunk.y, lastChunk.x, lastChunk.y]);

  useEffect(() => {
    blocksInView.forEach((block) => {
      setTimeout(() => {
        setBlocksToFetch((toFetch) =>
          toFetch.includes(block) && blocksInView.includes(block)
            ? toFetch
            : toFetch.concat([block])
        );
      }, 400);
    });
    setBlocksToFetch((toFetch) =>
      toFetch.filter((block) => blocksInView.includes(block))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocksInView[0]?.x, blocksInView[0]?.y]);

  useEffect(() => {
    blocksToFetch.forEach((block) => {
      let blockKey = `${block.x}.${block.y}`;
      if (
        !chunkDataCache.current.get(blockKey) &&
        !blockIsLoading.current?.[blockKey]
      ) {
        blockIsLoading.current[blockKey] = true;
        queryChunkBlock(block)
          .then((data) => {
            chunkDataCache.current.push(blockKey, data);
          })
          .finally(() => {
            blockIsLoading.current[blockKey] = false;
          });
        setCacheIter((cache) => cache + 1);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocksToFetch.length]);

  useEffect(() => {
    let imageData = {};
    let dataCache = chunkDataCache.current;

    range(firstChunk.x, lastChunk.x).forEach((x) => {
      range(firstChunk.y, lastChunk.y).forEach((y) => {
        let blockKey = `${chunkBlockForChunk(x)}.${chunkBlockForChunk(y)}`;
        let hexData =
          dataCache.get(blockKey)?.[`chunk_${getChunkId({ x, y })}`];
        if (hexData) {
          hexToImageData(hexData.data).then((image) => {
            imageData[`${x}.${y}`] = image;
          });
        } else {
          imageData[`${x}.${y}`] = emptyImage;
        }
      });
    });

    setChunkImageData(imageData);
  }, [cacheIter, firstChunk.x, firstChunk.y, lastChunk.x, lastChunk.y]);

  return chunkImageData;
}

export default useChunkData;
