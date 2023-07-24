import Canvas_ABI from "./abi/Canvas_ABI";
import { erc20ABI } from "wagmi";
import { Address } from "viem";
import { ChainId } from "components/providers/WagmiProvider";
import InkMaker_ABI from "./abi/InkMaker_ABI";
import { HARDHAT, MAIN, TEST } from "../utils/types";

const contracts = {
  canvas: {
    address: {
      [TEST]: "0x524fD6bd03Ab2b4E0151cE3cB2eD7Ce0C5C3905C",
      [MAIN]: "0x0",
      [HARDHAT]: "0xA40C8CAc761e4777646c7552832f885fc715EC6A"
    },
    abi: Canvas_ABI,
  },
  hue: {
    address: {
      [TEST]: "0x732CC2d7f7D4cD6b2Fa17D4deB4d9Beb858d4aC8",
      [MAIN]: "0x0",
      [HARDHAT]: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
    },
    abi: erc20ABI,
  },
  ink: {
    address: {
      [TEST]: "0xA40C8CAc761e4777646c7552832f885fc715EC6A",
      [MAIN]: "0x0",
      [HARDHAT]: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
    },
    abi: erc20ABI,
  },
  inkMaker: {
    address: {
      [TEST]: "0xA40C8CAc761e4777646c7552832f885fc715EC6A",
      [MAIN]: "0xA40C8CAc761e4777646c7552832f885fc715EC6A",
      [HARDHAT]: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82"
    },
    abi: InkMaker_ABI,
  },
} satisfies {
  [key: string]: {
    address: {
      [key: number]: Address;
    };
    abi: any;
  };
};

export function getContract<
  T1 extends keyof typeof contracts,
  T2 extends ChainId
>(name: T1, chainId: T2) {
  return {
    address: contracts[name].address[chainId],
    abi: contracts[name].abi,
  } as {
    address: (typeof contracts)[T1]["address"][T2];
    abi: (typeof contracts)[T1]["abi"];
  };
}

export default contracts;
