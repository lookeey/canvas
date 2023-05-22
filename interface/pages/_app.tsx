import { ResetCSS, theme } from "../../uikit";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@emotion/react";
import { ApolloProvider } from "@apollo/client";
import graphClient from "utils/apolloClient";
import { ChakraProvider } from "@chakra-ui/react";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme("dark")}>
      <ChakraProvider>
        <ApolloProvider client={graphClient}>
          <Component {...pageProps} />
          <ResetCSS />
        </ApolloProvider>
      </ChakraProvider>

    </ThemeProvider>
  );
}
