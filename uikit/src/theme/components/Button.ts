import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system'
import { mode } from '@chakra-ui/theme-tools'

const baseStyle = defineStyle({
  lineHeight: '1.2',
  borderRadius: 'base',
  fontWeight: 'semibold',
  transitionProperty: 'common',
  transitionDuration: 'normal',
  _focusVisible: {
    boxShadow: 'outline'
  },
  _disabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  _hover: {
    _disabled: {
      bg: 'initial'
    }
  }
})

const variantOutline = defineStyle((props) => {
  const { colorScheme: c } = props
  const borderColor = mode(`gray.200`, `whiteAlpha.300`)(props)
  return {
    border: '1px solid',
    borderColor: c === 'gray' ? borderColor : 'currentColor',
    '.chakra-button__group[data-attached][data-orientation=horizontal] > &:not(:last-of-type)':
      { marginEnd: '-1px' },
    '.chakra-button__group[data-attached][data-orientation=vertical] > &:not(:last-of-type)':
      { marginBottom: '-1px' }
  }
})

type AccessibleColor = {
  bg?: string
  color?: string
  hoverBg?: string
  activeBg?: string
}

/** Accessible color overrides for less accessible colors. */
const accessibleColorMap: { [key: string]: AccessibleColor } = {
  yellow: {
    bg: 'yellow.400',
    color: 'black',
    hoverBg: 'yellow.500',
    activeBg: 'yellow.600'
  },
  cyan: {
    bg: 'cyan.400',
    color: 'black',
    hoverBg: 'cyan.500',
    activeBg: 'cyan.600'
  }
}

const variantSolid = defineStyle((props) => {
  const { colorScheme: c } = props

  if (c === 'gray') {
    const bg = 'gray2'

    return {
      bg,
      _hover: {
        bg: 'gray3',
        _disabled: {
          bg
        }
      },
      _active: { bg: 'gray3' }
    }
  }

  const {
    bg = `${c}.500`,
    color = 'white',
    hoverBg = `${c}.600`,
    activeBg = `${c}.700`
  } = accessibleColorMap[c] ?? {}

  const background = mode(bg, `${c}.200`)(props)

  return {
    bg: background,
    color: mode(color, `gray.800`)(props),
    _hover: {
      bg: mode(hoverBg, `${c}.300`)(props),
      _disabled: {
        bg: background
      }
    },
    _active: { bg: mode(activeBg, `${c}.400`)(props) }
  }
})

const variantLink = defineStyle((props) => {
  const { colorScheme: c } = props
  return {
    padding: 0,
    height: 'auto',
    lineHeight: 'normal',
    verticalAlign: 'baseline',
    color: mode(`${c}.500`, `${c}.200`)(props),
    _hover: {
      textDecoration: 'underline',
      _disabled: {
        textDecoration: 'none'
      }
    },
    _active: {
      color: mode(`${c}.700`, `${c}.500`)(props)
    }
  }
})

const variantUnstyled = defineStyle({
  bg: 'none',
  color: 'inherit',
  display: 'inline',
  lineHeight: 'inherit',
  m: '0',
  p: '0'
})

const variants = {
  outline: variantOutline,
  solid: variantSolid,
  link: variantLink,
  unstyled: variantUnstyled
}

const sizes = {
  xl: defineStyle({
    h: '14',
    minW: '14',
    fontSize: 'xl',
    px: '6',
    fontFamily: 'heading'
  }),
  lg: defineStyle({
    h: '12',
    minW: '12',
    fontSize: 'lg',
    px: '6'
  }),
  md: defineStyle({
    h: '10',
    minW: '10',
    fontSize: 'md',
    px: '4'
  }),
  sm: defineStyle({
    h: '8',
    minW: '8',
    fontSize: 'sm',
    px: '3'
  }),
  xs: defineStyle({
    h: '6',
    minW: '6',
    fontSize: 'xs',
    px: '2'
  })
}

const Button = defineStyleConfig({
  baseStyle,
  variants,
  sizes,
  defaultProps: {
    variant: 'solid',
    size: 'md',
    colorScheme: 'gray'
  }
})

export default Button
