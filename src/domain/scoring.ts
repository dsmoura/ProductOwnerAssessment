import { LEVELS, SKILLS, type DomainId, type Level, type Skill, type Tier } from './skills'

export type Scores = Record<string, number>

export function average(scores: Scores, include: (skill: Skill) => boolean): number | null {
  const values = SKILLS.filter(include)
    .map((sk) => scores[sk.id])
    .filter((v): v is number => typeof v === 'number')
  return values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : null
}

export const tierAverage = (scores: Scores, tier: Tier) => average(scores, (sk) => sk.tier === tier)
export const domainAverage = (scores: Scores, domain: DomainId) => average(scores, (sk) => sk.domain === domain)

export const ratedCount = (scores: Scores) => SKILLS.filter((sk) => typeof scores[sk.id] === 'number').length

export function levelFor(value: number): Level {
  return LEVELS.find((l) => value >= l.min && value <= l.max) ?? LEVELS[0]
}

export type Change = { skill: Skill; from: number; to: number; diff: number }

export function biggestChanges(from: Scores, to: Scores, count = 5): { gains: Change[]; drops: Change[] } {
  const changes = SKILLS.flatMap((skill) => {
    const a = from[skill.id]
    const b = to[skill.id]
    return typeof a === 'number' && typeof b === 'number' && a !== b ? [{ skill, from: a, to: b, diff: b - a }] : []
  })
  return {
    gains: changes.filter((c) => c.diff > 0).sort((a, b) => b.diff - a.diff).slice(0, count),
    drops: changes.filter((c) => c.diff < 0).sort((a, b) => a.diff - b.diff).slice(0, count),
  }
}
