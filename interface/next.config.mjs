import withTM from "next-transpile-modules"
import _withNextBundleAnalyzer from 'next-bundle-analyzer'

let nextConfig = {
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: [{ loader: '@svgr/webpack', options: { ref: true } }],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
}

// const withNextBundleAnalyzer = _withNextBundleAnalyzer({})
// nextConfig = withNextBundleAnalyzer(nextConfig)

export default withTM(['canvas-uikit'])(nextConfig)