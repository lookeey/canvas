import { addParameters } from "@storybook/svelte"

addParameters(
  {
    actions: {
      argTypesRegex: "^on[A-Z].*"
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    themes: {
      default: 'light',
      list: [
        {
          name: 'light',
          class: 'light',
          color: '#f1f1f1'
        },
        {
          name: 'dark',
          class: 'dark',
          color: '#202020'
        }],
    },
  }
  
)