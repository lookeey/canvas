const secondsToReadable = (seconds: number, long?: boolean): string => {
  const units = [
    { name: 'year', value: 31536000 },
    { name: 'month', value: 2592000 },
    { name: 'day', value: 86400 },
    { name: 'hour', value: 3600 },
    { name: 'minute', value: 60 },
  ]
  const result: string[] = []
  for (const unit of units) {
    const value = Math.floor(seconds / unit.value)
    if (value > 0) {
      result.push(`${value} ${long ? unit.name : unit.name[0]}${value > 1 ? 's' : ''}`)
      seconds -= value * unit.value
    }
  }
  if (result.length === 0) {
    return '0 seconds'
  }
  if (long) {
    return result.join(', ')
  }
  return result[0]
}

export default secondsToReadable;