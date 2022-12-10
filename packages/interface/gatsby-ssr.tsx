/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

import { ThemeProvider } from "styled-components"
import { ResetCSS, theme } from "canvas-uikit"
import React from "react"

export const onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: `en` })
}

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme("dark")}>
    <ResetCSS />
    {element}
  </ThemeProvider>
)
