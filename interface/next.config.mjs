import withTM from "next-transpile-modules"
import _withNextBundleAnalyzer from 'next-bundle-analyzer'

let nextConfig = {}

// const withNextBundleAnalyzer = _withNextBundleAnalyzer({})
// nextConfig = withNextBundleAnalyzer(nextConfig)

export default withTM(['canvas-uikit'])(nextConfig)