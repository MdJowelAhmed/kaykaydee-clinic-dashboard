import type { ExerciseEntry } from './types'

const CATEGORIES = ['MSK', 'Cardio', 'Rehab', 'Strength', 'Flexibility']
const DESCRIPTIONS: Record<string, string> = {
  SLR: 'Straight Leg Raise',
  QSET: 'Quad Set',
  HS: 'Hamstring Stretch',
  CKC: 'Closed Kinetic Chain step-up',
  BR: 'Bridge with hold',
}

const SHORT_CODES = ['SLR', 'QSET', 'HS', 'CKC', 'BR', 'SLR', 'QSET']

function buildRow(index: number): ExerciseEntry {
  const code = SHORT_CODES[index % SHORT_CODES.length]
  return {
    id: `ex-${index + 1}`,
    exerciseName: code,
    categoryName: CATEGORIES[index % CATEGORIES.length],
    description: DESCRIPTIONS[code] ?? 'Therapeutic exercise',
    enabled: index % 3 !== 0,
  }
}

export const INITIAL_EXERCISES: ExerciseEntry[] = Array.from({ length: 150 }, (_, i) =>
  buildRow(i)
)

export const EXERCISE_ENABLE_FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'enabled', label: 'Enabled' },
  { value: 'disabled', label: 'Disabled' },
]

export function getCategoryOptionsFromExercises(entries: ExerciseEntry[]) {
  const uniq = [...new Set(entries.map((e) => e.categoryName))].sort()
  return [{ value: 'all', label: 'Category' }, ...uniq.map((c) => ({ value: c, label: c }))]
}
