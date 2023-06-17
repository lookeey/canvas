import { theme } from "canvas-uikit";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { fantom, fantomTestnet } from "viem/chains";
import { publicProvider } from "@wagmi/core/providers/public";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import React from "react";
import NextNProgress from "nextjs-progressbar";

const { chains, publicClient } = configureChains(
  process.env.NODE_ENV === "production" ? [fantom] : [fantomTestnet, fantom],
  [publicProvider()]
);

export type ChainId = (typeof chains)[number]["id"];

const config = createConfig({
  autoConnect: true,
  publicClient,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme("dark")}>
      <WagmiConfig config={config}>
        <NextNProgress
          color="#29D"
          startPosition={0.3}
          stopDelayMs={200}
          height={2}
          showOnShallow={false}
          options={{ showSpinner: false }}
        />
        <Component {...pageProps} />
      </WagmiConfig>
    </ChakraProvider>
  );
}
