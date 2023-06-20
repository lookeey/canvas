import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { fantom, fantomTestnet } from "viem/chains";
import { publicProvider } from "@wagmi/core/providers/public";

const { chains, publicClient } = configureChains(
  process.env.NODE_ENV === "production" ? [fantom] : [fantomTestnet, fantom],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
});

export type ChainId = (typeof chains)[number]["id"];

const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}

export default WagmiProvider;