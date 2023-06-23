import Canvas_ABI from "./abi/Canvas_ABI";
import { erc20ABI } from "wagmi";
import { Address } from "viem";
import { ChainId } from "components/providers/WagmiProvider";

const contracts = {
  canvas: {
    address: {
      4002: "0x524fD6bd03Ab2b4E0151cE3cB2eD7Ce0C5C3905C",
      250: "0x0"
    },
    abi: Canvas_ABI
  },
  hue: {
    address: {
      4002: "0x732CC2d7f7D4cD6b2Fa17D4deB4d9Beb858d4aC8",
      250: "0x0"
    },
    abi: erc20ABI
  },
  ink: {
    address: {
      4002: "0xA40C8CAc761e4777646c7552832f885fc715EC6A",
      250: "0x0"
    },
    abi: erc20ABI
  }
} satisfies {
  [key: string]: {
    address: {
      [key: number]: Address
    };
    abi: any;
  }
}

export function getContract<T1 extends keyof typeof contracts, T2 extends ChainId>(name: T1, chainId: T2) {
  return {
    address: contracts[name].address[chainId],
    abi: contracts[name].abi
  } as {
    address: typeof contracts[T1]["address"][T2];
    abi: typeof contracts[T1]["abi"];
  }
}

export default contracts;