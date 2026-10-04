import { describe, expect, it } from 'vitest'
import { readSheet } from 'read-excel-file/node'
import { DOMAIN_IDS, NEW_SKILLS, SHEET_SKILLS, SKILLS } from './skills'
import { biggestChanges, essentialGaps, focusPlan, levelFor, profileFor, tierAverage, type Scores } from './scoring'
import { parseAppData, sampleData } from './data'
import { parseAssessmentRows } from './importXlsx'

const ORIGINAL = 'Self-Assessment para Product Owners© - DionatanMoura.com.xlsx'
const allScores = (v: number): Scores => Object.fromEntries(SKILLS.map((sk) => [sk.id, v]))

describe('catalogue', () => {
  it('keeps the 58 skills of the original spreadsheet and has unique ids', () => {
    expect(SHEET_SKILLS).toHaveLength(58)
    expect(new Set(SKILLS.map((s) => s.id)).size).toBe(SKILLS.length)
  })

  it('has essential and advanced skills in every area', () => {
    for (const d of DOMAIN_IDS) {
      expect(SKILLS.some((s) => s.domain === d && s.tier === 'E')).toBe(true)
      expect(SKILLS.some((s) => s.domain === d && s.tier === 'A')).toBe(true)
    }
  })

  it('matches every spreadsheet skill name, and no added skill collides with a spreadsheet row', async () => {
    const rows = await readSheet(ORIGINAL, '1. Assessment')
    const names = rows.map((r) => r[1]).filter((v): v is string => typeof v === 'string')
    for (const sk of SHEET_SKILLS) expect(names).toContain(sk.name.pt)
    for (const sk of NEW_SKILLS) expect(names).not.toContain(sk.name.pt)
  })
})

describe('scoring', () => {
  it('averages a tier and ignores unrated skills', () => {
    const scores: Scores = { 'agile-manifesto': 8, scrum: 4, negotiation: 10 }
    expect(tierAverage(scores, 'E')).toBe(6)
    expect(tierAverage(scores, 'A')).toBe(10)
    expect(tierAverage({}, 'E')).toBeNull()
  })

  it('maps scores to behavioural anchors', () => {
    expect(levelFor(0).title.en).toBe('Unfamiliar')
    expect(levelFor(6).title.en).toBe('Apply with support')
    expect(levelFor(10).title.en).toBe('Teach and influence')
  })

  it('puts low essentials before low advanced skills, and skips 9+', () => {
    const scores: Scores = { ...allScores(9), negotiation: 1, dod: 6, mvp: 4, 'agile-manifesto': 8 }
    expect(focusPlan(scores).map((s) => s.id)).toEqual(['mvp', 'dod', 'negotiation'])
    expect(focusPlan(allScores(10))).toEqual([])
  })

  it('counts essentials below 5 as gaps', () => {
    expect(essentialGaps({ mvp: 4, dod: 5, negotiation: 0 })).toBe(1)
  })

  it('names the strongest area, or "forming" when everything is low', () => {
    const scores = { ...allScores(5), 'user-stories': 10, dor: 10, dod: 10 }
    expect(profileFor(scores)).toMatchObject({ strongest: 'backlog', forming: false })
    expect(profileFor(allScores(1)).forming).toBe(true)
  })

  it('lists the biggest gains and drops', () => {
    const { gains, drops } = biggestChanges({ mvp: 2, dod: 8, ux: 5 }, { mvp: 6, dod: 7, ux: 5 })
    expect(gains.map((c) => [c.skill.id, c.diff])).toEqual([['mvp', 4]])
    expect(drops.map((c) => [c.skill.id, c.diff])).toEqual([['dod', -1]])
  })
})

describe('stored data', () => {
  it('round-trips the sample through JSON', () => {
    const sample = sampleData()
    expect(parseAppData(JSON.parse(JSON.stringify(sample)))).toEqual(sample)
  })

  it('drops unknown skills, bad scores and bad dates', () => {
    const parsed = parseAppData({
      assessments: [
        { id: 'x', date: '2026-01-02', scores: { mvp: 7.4, dod: 11, hacking: 5 }, notes: { mvp: 'ok', nope: 'x' } },
        { id: 'y', date: 'yesterday', scores: {} },
      ],
    })
    expect(parsed?.assessments).toEqual([{ id: 'x', date: '2026-01-02', scores: { mvp: 7 }, notes: { mvp: 'ok' } }])
    expect(parseAppData({ hello: 1 })).toBeNull()
  })
})

describe('xlsx import', () => {
  it('skips the untouched template columns of the original file', async () => {
    const result = parseAssessmentRows(await readSheet(ORIGINAL, '1. Assessment'))
    expect(result.assessments).toHaveLength(0)
    expect(result.emptyColumns).toBe(2)
  })

  it('turns each filled date column into an assessment', () => {
    const rows: unknown[][] = [
      [null, 'Self-Assessment para Product Owners©', new Date('2022-01-26T00:00:00Z'), new Date('2023-02-01T00:00:00Z')],
      [null, 'Conhecimentos Essenciais', '0-10', '0-10'],
      [null, 'Manifesto Ágil', 3, 7.6],
      [null, 'MANIFESTO AGIL extra', 9, 9],
      [null, 'Negociação', 0, 4],
    ]
    const { assessments } = parseAssessmentRows(rows)
    expect(assessments.map((a) => [a.date, a.scores])).toEqual([
      ['2022-01-26', { 'agile-manifesto': 3, negotiation: 0 }],
      ['2023-02-01', { 'agile-manifesto': 8, negotiation: 4 }],
    ])
  })
})
