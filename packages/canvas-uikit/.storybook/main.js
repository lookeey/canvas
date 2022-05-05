const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const svelteConfig = import ('../svelte.config.js').then(module => module);
const path = require('path')

module.exports = {
  webpackFinal: async (config) => {
    const svelteLoader = config.module.rules.find((r) => r.loader && r.loader.includes("svelte-loader"),)
    svelteLoader.options.preprocess = require("svelte-preprocess")({
      scss: {
        includePaths: [path.resolve(__dirname, '../src')],
        loadPaths: [path.resolve(__dirname, '../src')]
      }
    })

    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin(
        {extensions: config.resolve.extensions}
      ),
    ];

    return config
  },
  "stories": [
    "../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx|svelte)"
  ],
  "addons": [
    "@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-svelte-csf", "storybook-addon-themes"
  ],
  "framework": "@storybook/svelte",
  "svelteOptions": {
    "preprocess": svelteConfig.preprocess
  }
}
