import { ResetCSS, theme } from "canvas-uikit";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme("dark")}>
      <ResetCSS />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
