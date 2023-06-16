import { extendTheme } from '@chakra-ui/react'
import dark from './colors/dark'
import light from './colors/light'
import components from './components'
import shared from './colors/shared'
import typography from './typography'

export const theme = (mode: 'dark' | 'light') =>
  extendTheme({
    ...typography,
    colors: {
      ...(mode === 'dark' ? dark : light),
      ...shared
    },
    components,
    styles: {
      global: {
        body: {
          bg: mode === 'dark' ? 'bg' : 'light.500',
          fontSize: 'md'
        }
      }
    },
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false
    }
  })
