import styled from '@emotion/styled'

export interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
}

const Button = styled.button<ButtonProps>`
  font-family: ${({ theme }) => theme.displayFont};
  font-weight: 600;
  border: none;
  border-radius: 3px;
  padding: 8px;
  font-size: 12pt;
  transition: 200ms background-color;

  ${({ variant, theme }) =>
    variant === 'primary'
      ? `
          background-color: ${theme.gray3};
          color: ${theme.bg};

          &:hover {
            background-color: ${theme.gray2};
          }

          &:active {
            background-color: ${theme.gray1};
          }
        `
      : `
          background-color: ${theme.bg};
          color: ${theme.gray2};
          box-shadow: inset 0 0 0 2px ${theme.gray2};

          &:hover {
            background-color: ${theme.gray2}44;
          }

          &:active {
            background-color: ${theme.gray2}aa;
          }
        `}

  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `
          padding: 4px;
          font-size: 12px;
          font-family: inherit;`
      default:
      case 'md':
        return `
          padding: 8px;
          font-size: 14px;
          font-family: inherit;`
      case 'lg':
        return `
          padding: 10px;
          font-size: 18px;`
      case 'xl':
        return `
          padding: 12px;
          font-size: 24px;`
    }
  }}
`
Button.defaultProps = {
  size: 'md',
  variant: 'primary'
}

export default Button
