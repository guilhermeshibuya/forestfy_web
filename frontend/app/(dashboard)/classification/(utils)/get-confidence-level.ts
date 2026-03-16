import { ConfidenceLevel } from '../(types)/confidence-level'

export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score < 0.5) return 'low'
  if (score < 0.8) return 'medium'
  return 'high'
}
