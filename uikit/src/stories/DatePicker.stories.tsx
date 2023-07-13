import * as React from 'react'
import { Meta, StoryFn, StoryObj } from '@storybook/react'
import DatePicker from '../components/DatePicker'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof DatePicker> = {
  title: 'Example/DatePicker',
  component: DatePicker,
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

export const Default: StoryObj = {
  render: () => {
    const [date, setDate] = React.useState(new Date())
    return (
      <>
        <DatePicker
          onDateSelected={(date) => {
            setDate(date.date)
          }}
          minDate={new Date(2020, 0, 1)}
          maxDate={new Date(2025, 11, 31)}
          selected={date}
        />
        <br />
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
        Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
        nec, ultricies sed, dolor. <br />
        Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper
        congue, euismod non, mi. <br />
        Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non
        fermentum diam nisl sit amet erat. <br />
        Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium
        a, enim. <br />
        Pellentesque congue. Ut in risus volutpat libero pharetra tempor. <br />
      </>
    )
  }
}

export default meta
