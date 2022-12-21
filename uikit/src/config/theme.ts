const themeBase = {
  displayFont: 'Goldman',
  breakpoints: {}
}

const lightTheme = {
  ...themeBase,
  primary: '#101010',
  bg: '#f1f1f1',
  text: '#464646',
  secondary: '#8c8c8c',
  blue1: '#0f45c0',
  blue2: '#0a2e80',
  blue3: '#061b4b',
  gray1: '#555555',
  gray2: '#757575',
  gray3: '#8D8D8D'
}

const darkTheme = {
  ...themeBase,
  primary: '#000000',
  bg: '#202020',
  text: '#eaeaea',
  secondary: '#afafaf',
  blue1: '#0f45c0',
  blue2: '#2a5fda',
  blue3: '#588aff',
  gray1: '#D4D4D4',
  gray2: '#AAAAAA',
  gray3: '#8D8D8D'
}

export function theme(mode: 'dark' | 'light') {
  switch (mode) {
    case 'dark':
      return darkTheme
    default:
      return lightTheme
  }
}
