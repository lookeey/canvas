const React = require('react')

export default function Decorator(Story) {
  return React.createElement(ThemeProvider, {
    theme: theme('dark'),
    children: React.createElement(Story)
  })
}
