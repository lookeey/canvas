import { ResetCSS, theme } from "canvas-uikit";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import graphClient from "utils/apolloClient";
import { ChakraProvider } from "@chakra-ui/react";
import { fantomTestnet } from "viem/chains";
import { createPublicClient, http } from "viem";
import { createConfig, WagmiConfig } from "wagmi";

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    transport: http(),
    chain: fantomTestnet
  })
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme("dark")}>
      <ApolloProvider client={graphClient}>
        <WagmiConfig config={config}>
          <Component {...pageProps} />
          <ResetCSS />
        </WagmiConfig>
      </ApolloProvider>
    </ChakraProvider>
  );
}
