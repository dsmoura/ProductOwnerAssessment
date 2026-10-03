import { DOMAIN_IDS, LEVELS, SKILLS, type DomainId, type Level, type Skill, type Tier } from './skills'

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

export function nextLevel(level: Level): Level {
  return LEVELS[Math.min(LEVELS.indexOf(level) + 1, LEVELS.length - 1)]
}

export type Profile = {
  strongest: DomainId | null
  weakest: DomainId | null
  /** True while the overall average is below 3: too early to name a strength. */
  forming: boolean
}

export function profileFor(scores: Scores): Profile {
  const ranked = DOMAIN_IDS.map((d) => [d, domainAverage(scores, d)] as const)
    .filter((x): x is readonly [DomainId, number] => x[1] !== null)
    .sort((a, b) => b[1] - a[1])
  const overall = average(scores, () => true)
  return {
    strongest: ranked[0]?.[0] ?? null,
    weakest: ranked.length > 1 ? ranked[ranked.length - 1][0] : null,
    forming: overall !== null && overall < 3,
  }
}

/**
 * Skills to work on next. Anything below 7 (not yet autonomous) comes first, essentials before
 * differentials; within a group the lowest score wins. Skills at 9–10 are never suggested.
 */
export function focusPlan(scores: Scores, count = 3): Skill[] {
  const bucket = (sk: Skill) => (scores[sk.id] >= 7 ? 2 : sk.tier === 'E' ? 0 : 1)
  return SKILLS.filter((sk) => typeof scores[sk.id] === 'number' && scores[sk.id] < 9)
    .sort((a, b) => bucket(a) - bucket(b) || scores[a.id] - scores[b.id])
    .slice(0, count)
}

export const essentialGaps = (scores: Scores) =>
  SKILLS.filter((sk) => sk.tier === 'E' && typeof scores[sk.id] === 'number' && scores[sk.id] < 5).length

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
