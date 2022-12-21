const { ResetCSS } = require('../src/util');

const React = require('react')
const { theme } = require('../src/config/theme')
const { ThemeProvider } = require('styled-components')
const { addDecorator } = require('@storybook/react'); // <- or your storybook framework
const { withThemes } = require('storybook-addon-themes/react'); // <- or your storybook framework

addDecorator(withThemes);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  themes: {
    default: 'light',
    list: [
      { name: 'dark', color: '#202020' },
      { name: 'light', color: '#f1f1f1' },
    ],
    Decorator: function (props) {
      const { children, themeName } = props;
      return React.createElement(ThemeProvider, {
        theme: theme(themeName),
        children: [children, React.createElement(ResetCSS)]
      })
    }
  },
}