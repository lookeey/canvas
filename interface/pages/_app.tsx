import { theme } from "canvas-uikit";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import graphClient from "utils/apolloClient";
import { ChakraProvider } from "@chakra-ui/react";
import { fantom, fantomTestnet } from "viem/chains";
import { publicProvider } from '@wagmi/core/providers/public'
import { configureChains, createConfig, WagmiConfig } from "wagmi";

const {
  chains,
  publicClient
} = configureChains(process.env.NODE_ENV === "production" ? [fantom] : [fantomTestnet, fantom],
  [publicProvider()]
  )

export type ChainId = typeof chains[number]["id"];

const config = createConfig({
  autoConnect: true,
  publicClient
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme("dark")}>
      <ApolloProvider client={graphClient}>
        <WagmiConfig config={config}>
          <Component {...pageProps} />
        </WagmiConfig>
      </ApolloProvider>
    </ChakraProvider>
  );
}
