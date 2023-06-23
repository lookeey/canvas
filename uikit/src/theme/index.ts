import { extendTheme } from '@chakra-ui/react'
import components from './components'
import typography from './typography'
import colors from './colors'

export const theme = (mode: 'dark' | 'light') =>
  extendTheme({
    ...typography,
    colors: colors(mode),
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
