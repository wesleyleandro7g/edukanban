const infractionRanges = [
  { min: 1, max: 5, score: 0.2 },
  { min: 6, max: 10, score: 0.3 },
  { min: 11, max: 15, score: 0.4 },
  { min: 16, max: Infinity, score: 0.5 },
]

export function computeInfractionScore(code: string, studentsAmount: number) {
  const infractionType = code[0]
  const [{ score }] = infractionRanges.filter(
    ({ min, max }) => min <= studentsAmount && max >= studentsAmount,
  )

  return infractionType === 'G'
    ? 20
    : infractionType === 'M'
    ? score
    : score * 2 || 0
}
