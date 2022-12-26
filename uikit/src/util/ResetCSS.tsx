import { css, Global, useTheme } from '@emotion/react'
import React from 'react'

const ResetCSS: React.FC = () => {
  const theme = useTheme()
  return (
    <Global
      styles={css`
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
          background-color: ${theme.bg};
          color: ${theme.text};
          margin: 0;
          font-family: 'Saira Semi Condensed', Arial, sans-serif;
        }
      `}
    />
  )
}

export default ResetCSS
