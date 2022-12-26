import '@emotion/react'
import { theme } from './config/theme'

export type ThemeType = ReturnType<typeof theme>

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends ThemeType {}
}

export {}
