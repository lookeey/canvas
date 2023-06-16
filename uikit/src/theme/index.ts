import { extendTheme } from '@chakra-ui/react'
import dark from './colors/dark'
import light from './colors/light'
import components from './components'
import shared from './colors/shared'

export const theme = (mode: 'dark' | 'light') =>
  extendTheme({
    colors: {
      ...(mode === 'dark' ? dark : light),
      ...shared
    },
    components,
    fonts: {
      heading: 'Goldman',
      body: 'Saira Semi Condensed'
    },
    styles: {
      global: {
        html: {
          fontSize: '20px'
        },
        body: {
          bg: mode === 'dark' ? 'bg' : 'light.500'
        }
      }
    },
    fontSizes: {},
    fontWeights: {},
    lineHeights: {},
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false
    }
  })
