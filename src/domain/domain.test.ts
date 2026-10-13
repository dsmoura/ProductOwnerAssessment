import { describe, expect, it } from 'vitest'
import { readSheet } from 'read-excel-file/node'
import { DOMAIN_IDS, NEW_SKILLS, SHEET_SKILLS, SKILLS, sheetLabel } from './skills'
import { biggestChanges, levelFor, tierAverage, type Scores } from './scoring'
import { parseAppData, sampleData } from './data'
import { parseAssessmentRows } from './importXlsx'

const ORIGINAL = 'Self-Assessment para Product Owners© - DionatanMoura.com.xlsx'

describe('catalogue', () => {
  it('keeps 45 of the 58 skills of the original spreadsheet and has unique ids', () => {
    expect(SHEET_SKILLS).toHaveLength(45)
    expect(new Set(SKILLS.map((s) => s.id)).size).toBe(SKILLS.length)
  })

  it('has essential and advanced skills in every area', () => {
    for (const d of DOMAIN_IDS) {
      expect(SKILLS.some((s) => s.domain === d && s.tier === 'E')).toBe(true)
      expect(SKILLS.some((s) => s.domain === d && s.tier === 'A')).toBe(true)
    }
  })

  it('lists each area as one block, in area order, with essentials before advanced', () => {
    const areas = SKILLS.map((s) => s.domain).filter((d, i, all) => d !== all[i - 1])
    expect(areas).toEqual([...DOMAIN_IDS])
    for (const d of DOMAIN_IDS) {
      const tiers = SKILLS.filter((s) => s.domain === d).map((s) => s.tier).join('')
      expect(tiers).toMatch(/^E+A+$/)
    }
  })

  it('matches every spreadsheet skill name, and no added skill collides with a spreadsheet row', async () => {
    const rows = await readSheet(ORIGINAL, '1. Assessment')
    const names = rows.map((r) => r[1]).filter((v): v is string => typeof v === 'string')
    for (const sk of SHEET_SKILLS) expect(names).toContain(sheetLabel(sk))
    for (const sk of NEW_SKILLS) expect(names).not.toContain(sk.name.pt)
  })
})

describe('scoring', () => {
  it('averages a tier and ignores unrated skills', () => {
    const scores: Scores = { 'agile-manifesto': 8, scrum: 4, 'design-sprint': 10 }
    expect(tierAverage(scores, 'E')).toBe(6)
    expect(tierAverage(scores, 'A')).toBe(10)
    expect(tierAverage({}, 'E')).toBeNull()
  })

  it('maps scores to behavioural anchors', () => {
    expect(levelFor(0).title.en).toBe('Unfamiliar')
    expect(levelFor(6).title.en).toBe('Apply with support')
    expect(levelFor(10).title.en).toBe('Apply with mastery')
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
    expect(parsed?.assessments).toEqual([{ id: 'x', date: '2026-01-02', scores: { mvp: 7 } }])
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
