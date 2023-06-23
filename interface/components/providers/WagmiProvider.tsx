import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { fantom, fantomTestnet } from "viem/chains";
import { publicProvider } from "@wagmi/core/providers/public";
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const { chains, publicClient } = configureChains(
  process.env.NODE_ENV === "production" ? [fantom] : [fantomTestnet, fantom],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: '5937bd05bd536cc31860be9bd55ed1b2',
      },
    })
  ],
});

export type ChainId = (typeof chains)[number]["id"];

const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}

export default WagmiProvider;