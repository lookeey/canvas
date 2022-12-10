import 'styled-components'
import { theme } from './config/theme'

export type ThemeType = ReturnType<typeof theme>

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ThemeType {}
}

export {}
