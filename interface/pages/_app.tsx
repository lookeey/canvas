import { ResetCSS, theme } from "canvas-uikit";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import graphClient from "utils/apolloClient";
import { ChakraProvider } from "@chakra-ui/react";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
      <ChakraProvider theme={theme("dark")}>
        <ApolloProvider client={graphClient}>
          <Component {...pageProps} />
          <ResetCSS />
        </ApolloProvider>
      </ChakraProvider>
  );
}
