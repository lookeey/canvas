import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys)

const baseStyle = definePartsStyle({
  container: {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'bgAlpha.400',
    borderRadius: 'md'
  },
  header: {
    paddingBottom: '0'
  }
})

const Card = defineMultiStyleConfig({ baseStyle })

export default Card
