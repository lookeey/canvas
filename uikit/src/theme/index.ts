import { extendTheme } from '@chakra-ui/react'
import dark from './colors/dark'
import light from './colors/light'
import components from './components'

export const theme = (mode: 'dark' | 'light') =>
  extendTheme({
    colors: mode === 'dark' ? dark : light,
    components,
    fonts: {
      heading: 'Goldman',
      body: 'Saira Semi Condensed'
    },
    styles: {
      global: {
        body: {
          bg: mode === 'dark' ? 'bg' : 'light.500'
        }
      }
    },
    fontSizes: {},
    fontWeights: {},
    lineHeights: {},
    config: {
      initialColorMode: 'mode',
      useSystemColorMode: false
    }
  })
