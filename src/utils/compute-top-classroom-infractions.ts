import { Infraction } from '../models'

interface TopInfractionWithStudents {
  [infractionCode: string]: {
    students: {
      id: string
      percentage: number
    }[]
  }
}

export function computeTopClassroomInfractions(
  infractions: Infraction[],
  n: number,
): TopInfractionWithStudents {
  const frequency: { [key: string]: number } = {}

  infractions.forEach((infraction) => {
    if (frequency[infraction.code]) {
      frequency[infraction.code]++
    } else {
      frequency[infraction.code] = 1
    }
  })

  const sortedFrequency = Object.entries(frequency).sort(
    ([, a], [, b]) => b - a,
  )

  const topInfractions = sortedFrequency
    .slice(0, n)
    .reduce<TopInfractionWithStudents>((acc, [key]) => {
      const studentsIds = infractions
        .filter((infraction) => infraction.code === key)
        .flatMap((infraction) => infraction.students_id)
      const frequency: { [key: string]: number } = {}

      studentsIds.forEach((studentId) => {
        if (frequency[studentId]) {
          frequency[studentId]++
        } else {
          frequency[studentId] = 1
        }
      })

      const studentsWithPercentage = Object.entries(frequency).map(
        ([studentId, count]) => ({
          id: studentId,
          percentage: (count / studentsIds.length) * 100,
        }),
      )

      acc[key] = { students: studentsWithPercentage }

      return acc
    }, {})

  return topInfractions
}
