import { theme } from "canvas-uikit";
import type { AppProps } from "next/app";
import { ChakraProvider, GlobalStyle } from "@chakra-ui/react";
import React from "react";
import NextNProgress from "nextjs-progressbar";
import dynamic from "next/dynamic";
import { TransactionFlowProvider } from "../hooks/useTransactionModal";
import { Global } from "@emotion/react";

const WagmiProvider = dynamic(() => import("../components/providers/WagmiProvider"), {
  ssr: false,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme("dark")}>
      <Global styles={{
        body: {
          overflowY: "scroll",
        },
        "wcm-modal": {
          zIndex: 9999,
          position: "fixed",
        }
      }}/>
      <WagmiProvider>
        <TransactionFlowProvider>
          <NextNProgress
            color="#29D"
            startPosition={0.3}
            stopDelayMs={200}
            height={2}
            showOnShallow={false}
            options={{ showSpinner: false }}
          />
          <Component {...pageProps} />
        </TransactionFlowProvider>

      </WagmiProvider>
    </ChakraProvider>
  );
}
