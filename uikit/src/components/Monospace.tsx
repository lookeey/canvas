import * as React from 'react'
import { Box } from '@chakra-ui/react'
import { useMemo } from 'react'

const Monospace: React.FC<{ children: string }> = ({ children }) => {
  return useMemo(
    () => (
      <>
        {children.split('').map((char, i) => (
          <Box key={i} position='relative'>
            <Box opacity={0} userSelect='none'>
              0
            </Box>
            <Box
              position='absolute'
              top={0}
              left='50%'
              transform='translateX(-50%)'
            >
              {char}
            </Box>
          </Box>
        ))}
      </>
    ),
    [children]
  )
}

export default Monospace
