import { createPublicClient, http } from "viem";
import { ChainId } from "components/WagmiProvider";
import { fantom, fantomTestnet } from "viem/chains";

const tracingApiClient = (chainId: ChainId) => createPublicClient({
  chain: chainId === 250 ? fantom : fantomTestnet,
  transport: http(chainId === 250 ? "https://rpcapi-tracing.fantom.network/" : "https://rpcapi-tracing.testnet.fantom.network/"),
})

export default tracingApiClient