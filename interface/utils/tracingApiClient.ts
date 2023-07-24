import { createPublicClient, http } from "viem";
import { ChainId } from "components/providers/WagmiProvider";
import { arbitrum, arbitrumGoerli, fantom, fantomTestnet } from "viem/chains";
import { MAIN } from "./types";

const tracingApiClient = (chainId: ChainId) => createPublicClient({
  chain: chainId === MAIN ? arbitrum : arbitrumGoerli,
  transport: http(chainId === MAIN ? "https://arb1.arbitrum.io/rpc" : "https://goerli-rollup.arbitrum.io/rpc"),
})

export default tracingApiClient