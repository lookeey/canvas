import { extendTheme } from '@chakra-ui/react'
import dark from './colors/dark'
import light from './colors/light'
import components from './components'

const theme = (mode: 'dark' | 'light') =>
  extendTheme({
    colors: mode === 'dark' ? dark : light,
    components,
    fonts: {
      heading: 'Goldman',
      body: 'Saira Semi Condensed'
    },
    global: {
      body: {
        bg: mode === 'dark' ? 'dark.500' : 'light.500'
      }
    },
    fontSizes: {},
    fontWeights: {},
    lineHeights: {}
  })

export default theme
