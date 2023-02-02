import { ResetCSS, theme } from "canvas-uikit";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@emotion/react";
import { ApolloProvider } from "@apollo/client";
import graphClient from "utils/apolloClient";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme("dark")}>
      <ApolloProvider client={graphClient}>
        <Component {...pageProps} />
        <ResetCSS />
      </ApolloProvider>
    </ThemeProvider>
  );
}
