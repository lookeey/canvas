export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  themes: {
    default: 'twitter',
    list: [
      { name: 'light', class: 'theme-twt', color: '#f1f1f1' },
      { name: 'dark', class: 'theme-fb', color: '#202020' }
    ],
    Decorator: function Decorator(props) {
      const { children, themeName } = props;
      return (
        <ThemeProvider theme={theme(themeName)}>
          <ResetCSS />
          <p> aaa</p>
          {children}
        </ThemeProvider>
      );
    }
  },
}

import ThemeProvider from "styled-components"
import theme from "../src/config/theme"
import ResetCSS from "../src/util/ResetCSS"

import { addDecorator } from '@storybook/react'; // <- or your storybook framework
import { withThemes } from 'storybook-addon-themes/react'; // <- or your storybook framework

addDecorator(withThemes);