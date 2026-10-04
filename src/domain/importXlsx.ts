import { SKILLS } from './skills'
import { newId, type Assessment } from './data'
import type { Scores } from './scoring'

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

const SKILL_BY_NAME = new Map(SKILLS.map((sk) => [normalize(sk.name.pt), sk.id]))

const toISODate = (d: Date) => d.toISOString().slice(0, 10)

export type XlsxImport = { assessments: Assessment[]; emptyColumns: number }

/**
 * Reads rows from sheet "1. Assessment" of the original spreadsheet. The first row holding date
 * cells is the header: each date column becomes one assessment. Rows are matched to skills by
 * their Portuguese name, so the importer tolerates moved rows and extra columns.
 * Columns where every score is 0 are the untouched template and are skipped.
 */
export function parseAssessmentRows(rows: unknown[][]): XlsxImport {
  const headerRow = rows.find((row) => row.some((cell) => cell instanceof Date))
  if (!headerRow) return { assessments: [], emptyColumns: 0 }

  const columns = headerRow.flatMap((cell, col) =>
    cell instanceof Date && !Number.isNaN(cell.getTime()) ? [{ col, date: toISODate(cell), scores: {} as Scores }] : [],
  )

  for (const row of rows) {
    const label = row.find((cell): cell is string => typeof cell === 'string' && SKILL_BY_NAME.has(normalize(cell)))
    if (!label) continue
    const skillId = SKILL_BY_NAME.get(normalize(label))!
    for (const c of columns) {
      const v = row[c.col]
      if (typeof v === 'number' && Number.isFinite(v)) c.scores[skillId] = Math.max(0, Math.min(10, Math.round(v)))
    }
  }

  const filled = columns.filter((c) => Object.values(c.scores).some((v) => v > 0))
  return {
    assessments: filled.map((c) => ({ id: newId(), date: c.date, scores: c.scores })),
    emptyColumns: columns.length - filled.length,
  }
}

export async function importXlsxFile(file: File): Promise<XlsxImport> {
  const { readSheet } = await import('read-excel-file/browser')
  let rows: unknown[][]
  try {
    rows = await readSheet(file, '1. Assessment')
  } catch {
    rows = await readSheet(file, 1)
  }
  return parseAssessmentRows(rows)
}
