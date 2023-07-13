import React from 'react';
import { theme } from "../src/theme";
import {ChakraProvider} from '@chakra-ui/react';
import {withThemeProvider} from 'storybook-addon-theme-provider';

export const decorators = [withThemeProvider(ChakraProvider)];

export const globals = {
  selectedTheme: 'light',
  themes: [
    { name: 'dark', color: '#202020', themeObject: theme('dark') },
    { name: 'light', color: '#f1f1f1', themeObject: theme('light') },
  ]
}

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  }
}
