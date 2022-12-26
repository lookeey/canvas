import { ResetCSS, theme } from "canvas-uikit";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { Provider } from "react-redux";
import store from "state";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme("dark")}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
      <ResetCSS />
    </ThemeProvider>
  );
}
