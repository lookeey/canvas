import light from './light'
import dark from './dark'

const colors = (mode: 'dark' | 'light') => {
  const theme = mode === 'dark' ? dark : light
  return {
    ...theme,
    gray: {
      '50': '#F3F3F2',
      '100': '#DCDCDA',
      '200': '#C6C6C3',
      '300': '#AFAFAC',
      '400': '#999994',
      '500': '#82827D',
      '600': '#686864',
      '700': '#4E4E4B',
      '800': '#343432',
      '900': '#1A1A19'
    },
    bgAlpha: {
      '100': theme.bg + 'F2',
      '200': theme.bg + 'DA',
      '300': theme.bg + 'C3',
      '400': theme.bg + 'AC',
      '500': theme.bg + '95',
      '600': theme.bg + '7D',
      '700': theme.bg + '66',
      '800': theme.bg + '4E',
      '900': theme.bg + '37'
    }
  }
}

export default colors
