import { Button } from '@chakra-ui/react'
import { Meta } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
    variant: {
      options: ['solid', 'outline', 'ghost', 'link', 'unstyled'],
      control: {
        type: 'select'
      }
    }
  }
}

export default meta

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = {
  args: {
    variant: 'solid',
    children: 'Button'
  }
}

export const Secondary = {
  args: {
    variant: 'solid',
    children: 'Button'
  }
}

export const Large = {
  args: { variant: 'solid', size: 'lg', children: 'Button' }
}

export const Small = {
  args: { variant: 'solid', size: 'sm', children: 'Button' }
}
