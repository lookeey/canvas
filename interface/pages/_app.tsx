import { theme } from "canvas-uikit";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import NextNProgress from "nextjs-progressbar";
import dynamic from "next/dynamic";

const WagmiProvider = dynamic(() => import("../components/WagmiProvider"), {
  ssr: false,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme("dark")}>
      <WagmiProvider>
        <NextNProgress
          color="#29D"
          startPosition={0.3}
          stopDelayMs={200}
          height={2}
          showOnShallow={false}
          options={{ showSpinner: false }}
        />
        <Component {...pageProps} />
      </WagmiProvider>
    </ChakraProvider>
  );
}
