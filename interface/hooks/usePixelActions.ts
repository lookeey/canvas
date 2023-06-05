import { useContractWrite, usePrepareContractWrite } from "wagmi";
import contracts from "../config/contracts";
import Canvas_ABI from "../config/abi/Canvas_ABI";

const usePlacePixels = (pixels: {x: bigint, y: bigint, color: bigint}[]) => {
  const contract = {
    address: contracts.canvas.address,
    abi: Canvas_ABI
  }

  const { config: configMultiple } = usePrepareContractWrite({
    address: "0x0",
    abi: Canvas_ABI,
    functionName: "setMultiplePixels",
    args: [pixels.map(p => p.x), pixels.map(p => p.y), pixels.map(p => p.color)],
    enabled: pixels.length > 1
  })

  const { config: configSingle } = usePrepareContractWrite({
    address: "0x0",
    abi: Canvas_ABI,
    functionName: "setPixel",
    args: [pixels[0]?.x ?? 0, pixels[0]?.y  ?? 0, pixels[0]?.color ?? 0n],
    enabled: pixels.length === 1
  })

  const sendSinglePixel = useContractWrite(configSingle)
  const sendMultiplePixels = useContractWrite(configMultiple)

  return pixels.length > 1 ? sendMultiplePixels : sendSinglePixel
}

export default usePlacePixels