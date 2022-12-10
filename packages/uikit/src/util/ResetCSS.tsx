import { createGlobalStyle } from 'styled-components'

const ResetCSS = createGlobalStyle`
  html {
    font-size: 120%;
  }
  * {
    box-sizing: border-box;
  }
  a {
    color: inherit;
  }
  body {
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    margin: 0;
    font-family: 'Saira Semi Condensed', Arial, sans-serif;
  }
`

export default ResetCSS
