module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
      }
    },
    "storybook-addon-themes",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/react"
}