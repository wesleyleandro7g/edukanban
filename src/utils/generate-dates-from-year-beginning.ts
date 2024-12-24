import dayjs from 'dayjs'
import weekOfWear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfWear)

type TimeRange = 'day' | 'week' | 'month'

export function generateDatesFromYearBeginning(range: TimeRange) {
  const firstDayOfTheYear = dayjs().startOf('year')
  const firstWeekOfTheYear = dayjs().startOf('day').day(0).week(1)

  const today = new Date()

  const dates = []

  let compareDate = range === 'week' ? firstWeekOfTheYear : firstDayOfTheYear

  while (compareDate.isBefore(today)) {
    dates.push(compareDate.toDate())
    compareDate = compareDate.add(1, range)
  }

  return dates
}
