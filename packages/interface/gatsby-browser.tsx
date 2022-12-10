import { ThemeProvider } from "styled-components"
import { ResetCSS, theme } from "canvas-uikit"
import React from "react"

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme("dark")}>
    <ResetCSS />
    {element}
  </ThemeProvider>
)
