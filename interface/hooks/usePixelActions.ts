import { useChainId, useContractWrite, usePrepareContractWrite } from "wagmi";
import contracts, { getContract } from "../config/contracts";
import Canvas_ABI from "../config/abi/Canvas_ABI";
import { ChainId } from "../pages/_app";

export const useApproveCanvas = (amount: bigint) => {
  const chainId = useChainId() as ChainId

  const { config } = usePrepareContractWrite({
    ...getContract("ink", chainId),
    functionName: "approve",
    args: [contracts.canvas.address[chainId], amount],
    enabled: true
  })

  return useContractWrite(config)
}

const usePlacePixels = (pixels: {x: bigint, y: bigint, color: bigint}[]) => {
  const chainId = useChainId() as ChainId;

  const { config: configMultiple } = usePrepareContractWrite({
    ...getContract("canvas", chainId),
    functionName: "setMultiplePixels",
    args: [pixels.map(p => p.x), pixels.map(p => p.y), pixels.map(p => p.color)],
    enabled: pixels.length > 1
  })

  const { config: configSingle } = usePrepareContractWrite({
    ...getContract("canvas", chainId),
    functionName: "setPixel",
    args: [pixels[0]?.x ?? 0, pixels[0]?.y  ?? 0, pixels[0]?.color ?? 0n],
    enabled: pixels.length === 1
  })

  const sendSinglePixel = useContractWrite(configSingle)
  const sendMultiplePixels = useContractWrite(configMultiple)

  return pixels.length > 1 ? sendMultiplePixels : sendSinglePixel
}

export default usePlacePixels