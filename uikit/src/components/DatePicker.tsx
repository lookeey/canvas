import React from 'react'
import {
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text
} from '@chakra-ui/react'
import { useDayzed, RenderProps, Props } from 'dayzed'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import Monospace from './Monospace'

const monthNamesShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]
const weekdayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Calendar: React.FC<RenderProps> = ({
  calendars,
  getBackProps,
  getForwardProps,
  getDateProps
}) => {
  if (calendars.length) {
    return (
      <Card
        as={Flex}
        color='text'
        maxW='80'
        padding='2'
        gap={1}
        direction='column'
        bg='transparent'
        backdropFilter='none'
      >
        {calendars.map((calendar) => (
          <>
            <Flex justify='space-between' align='center'>
              <IconButton
                aria-label='Back'
                size='sm'
                variant='outline'
                icon={<ChevronLeftIcon />}
                {...getBackProps({ calendars })}
              >
                Back
              </IconButton>
              <Text>
                {monthNamesShort[calendar.month]} {calendar.year}
              </Text>
              <IconButton
                aria-label='Next'
                size='sm'
                variant='outline'
                icon={<ChevronRightIcon />}
                {...getForwardProps({ calendars })}
              />
            </Flex>

            <Box key={`${calendar.month}${calendar.year}`} w='100%'>
              {weekdayNamesShort.map((weekday) => (
                <Text
                  key={`${calendar.month}${calendar.year}${weekday}`}
                  display='inline-block'
                  w='calc(100% / 7)'
                  border='none'
                  bg='transparent'
                  textAlign='center'
                  fontSize='sm'
                >
                  {weekday}
                </Text>
              ))}
              {calendar.weeks.map((week, weekIndex) =>
                week.map((dateObj, index) => {
                  const key = `${calendar.month}${calendar.year}${weekIndex}${index}`
                  if (!dateObj) {
                    return (
                      <Box
                        key={key}
                        w='calc(100% / 7)'
                        style={{
                          display: 'inline-block',
                          border: 'none',
                          background: 'transparent'
                        }}
                      />
                    )
                  }
                  const { date, selected, selectable } = dateObj
                  return (
                    <Box
                      key={key}
                      w='calc(100% / 7)'
                      display='inline-block'
                      p='2px'
                      border='none'
                    >
                      <Button
                        size='sm'
                        border={selected ? '2px' : '0'}
                        borderColor={selected ? 'blue1' : 'transparent'}
                        bg='blackAlpha.500'
                        _hover={{ bg: 'gray3', color: 'text' }}
                        color='gray3'
                        w='100%'
                        {...getDateProps({ dateObj })}
                      >
                        {selectable ? date.getDate() : 'X'}
                      </Button>
                    </Box>
                  )
                })
              )}
            </Box>
          </>
        ))}
      </Card>
    )
  }
  return null
}

const DatePicker: React.FC<Props & { helpText: string; isDisabled: boolean }> = (
  props
) => {
  const dayzedData = useDayzed(props)
  return (
    <Popover>
      <PopoverTrigger>
        <Button isDisabled={props.isDisabled}>
          {props?.selected && props?.selected instanceof Date ? (
            <Monospace>{props.selected.toLocaleDateString()}</Monospace>
          ) : (
            'Choose Date'
          )}
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          backdropFilter='blur(10px)'
          backgroundColor='bgAlpha.300'
        >
          <PopoverArrow bgColor='transparent' />
          <PopoverCloseButton />
          <PopoverHeader>{props.helpText ?? 'Choose a date'}</PopoverHeader>
          <Calendar {...dayzedData} />
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export default DatePicker
