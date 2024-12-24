import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

import { generateDatesFromYearBeginning } from './generate-dates-from-year-beginning'

dayjs.extend(weekOfYear)

type TimeRange = 'day' | 'week' | 'month'

export function computeClassroomBehavior(
  range: TimeRange,
  infractions: { score: number; date: string }[],
) {
  const dates = generateDatesFromYearBeginning(range)

  const weeklyScores: Record<number, number> = {}
  const classroomBehavior = dates.reduce(
    (acc, date, index) => {
      const currentWeek = dayjs(date).week()

      if (!weeklyScores[currentWeek]) {
        weeklyScores[currentWeek] = 100
      }

      infractions.forEach((infraction) => {
        const infractionDate = dayjs(infraction.date)

        if (infractionDate.isSame(dayjs(date), range)) {
          weeklyScores[currentWeek] -= infraction.score
        }
      })

      acc[index] = weeklyScores[currentWeek]

      return acc
    },
    dates.map(() => 100),
  )

  return classroomBehavior
}

export function computeSchoolBehaviorAvarage(
  range: TimeRange,
  schoolInfractionsByClassroomId: Record<
    string,
    { score: number; date: string }[]
  >,
) {
  const classroomsBehavior: Record<string, number[]> = {}

  for (const classroom_id in schoolInfractionsByClassroomId) {
    const classroomInfractions = schoolInfractionsByClassroomId[classroom_id]

    const classroomBehavior = computeClassroomBehavior(
      range,
      classroomInfractions.map(({ score, date }) => ({ date, score })),
    )

    classroomsBehavior[classroom_id] = classroomBehavior
  }

  const behaviorValues = Object.values(classroomsBehavior)
  const behaviorAverage = behaviorValues[0].map(
    (_, index) =>
      behaviorValues.reduce((acc, curr) => acc + curr[index], 0) /
      behaviorValues.length,
  )

  return behaviorAverage
}
