import { SKILLS, SKILL_IDS } from './skills'
import type { Scores } from './scoring'

export type Assessment = {
  id: string
  /** ISO date, YYYY-MM-DD */
  date: string
  scores: Scores
  /** Optional evidence per skill ("when did I last apply this?") */
  notes: Record<string, string>
}

export type AppData = {
  version: 1
  assessments: Assessment[]
  currentId?: string
  /** True while the user is looking at the built-in example data. */
  isSample?: boolean
}

const STORAGE_KEY = 'po-self-assessment:v1'
const MAX_NOTE = 500

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

export const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const byDate = (list: Assessment[]) => [...list].sort((a, b) => a.date.localeCompare(b.date))

export function currentOf(data: AppData): Assessment | undefined {
  return data.assessments.find((a) => a.id === data.currentId) ?? byDate(data.assessments).at(-1)
}

export function previousOf(data: AppData, assessment: Assessment): Assessment | undefined {
  const sorted = byDate(data.assessments)
  const i = sorted.findIndex((a) => a.id === assessment.id)
  return i > 0 ? sorted[i - 1] : undefined
}

export const blankAssessment = (date = todayISO()): Assessment => ({ id: newId(), date, scores: {}, notes: {} })

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

/** Validates untrusted JSON (localStorage or a backup file). Unknown skills and out-of-range scores are dropped. */
export function parseAppData(raw: unknown): AppData | null {
  if (!isRecord(raw) || !Array.isArray(raw.assessments)) return null
  const assessments = raw.assessments.flatMap((a): Assessment[] => {
    if (!isRecord(a) || typeof a.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(a.date)) return []
    const scores: Scores = {}
    for (const [k, v] of Object.entries(isRecord(a.scores) ? a.scores : {})) {
      if (SKILL_IDS.has(k) && typeof v === 'number' && v >= 0 && v <= 10) scores[k] = Math.round(v)
    }
    const notes: Record<string, string> = {}
    for (const [k, v] of Object.entries(isRecord(a.notes) ? a.notes : {})) {
      if (SKILL_IDS.has(k) && typeof v === 'string' && v.trim()) notes[k] = v.slice(0, MAX_NOTE)
    }
    return [{ id: typeof a.id === 'string' && a.id ? a.id : newId(), date: a.date, scores, notes }]
  })
  if (!assessments.length) return null
  const currentId = assessments.some((a) => a.id === raw.currentId) ? (raw.currentId as string) : undefined
  return { version: 1, assessments, currentId, isSample: raw.isSample === true }
}

export function loadData(): AppData | null {
  try {
    const text = localStorage.getItem(STORAGE_KEY)
    return text ? parseAppData(JSON.parse(text)) : null
  } catch {
    return null
  }
}

export function saveData(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage full or blocked (private mode): the app keeps working in memory.
  }
}

/** Two example assessments six months apart, so a first-time visitor sees what the app produces. */
export function sampleData(): AppData {
  let seed = 7
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
  const base: Record<string, number> = {
    agile: 7, strategy: 5, backlog: 7, discovery: 4, people: 6, business: 3, change: 2, delivery: 4,
  }
  const first: Scores = {}
  const second: Scores = {}
  for (const sk of SKILLS) {
    const v = Math.max(0, Math.min(10, Math.round(base[sk.domain] + (rnd() * 4 - 2))))
    first[sk.id] = v
    second[sk.id] = Math.min(10, v + (rnd() < 0.45 ? Math.ceil(rnd() * 2) : 0))
  }
  return {
    version: 1,
    isSample: true,
    currentId: 'sample-2',
    assessments: [
      { id: 'sample-1', date: '2026-03-12', scores: first, notes: {} },
      {
        id: 'sample-2',
        date: '2026-09-18',
        scores: second,
        notes: { 'backlog-prioritization': 'Conduzi a priorização do trimestre com WSJF junto aos stakeholders.' },
      },
    ],
  }
}
