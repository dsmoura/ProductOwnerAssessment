import { jsPDF } from 'jspdf'
import { byDate, previousOf, todayISO, type AppData, type Assessment } from '../domain/data'
import { DOMAIN_IDS, DOMAINS, SKILLS, SKILLS_ESSENTIALS_FIRST } from '../domain/skills'
import {
  biggestChanges,
  domainAverage,
  essentialGaps,
  focusPlan,
  levelFor,
  nextLevel,
  profileFor,
  ratedCount,
  tierAverage,
  type Change,
} from '../domain/scoring'
import { axisPoint, labelLayout } from './radarGeometry'
import type { CardText } from './shareCard'

type RGB = [number, number, number]

// Light theme from styles.css; a PDF is printed on white, so it never follows dark mode.
const C = {
  ink: [20, 35, 43],
  muted: [91, 107, 115],
  line: [220, 227, 230],
  accent: [14, 107, 115],
  accentSoft: [213, 236, 238],
  /** --accent at 16% over white, the radar fill */
  radarFill: [216, 231, 233],
  prev: [154, 169, 176],
  seriesA: [107, 79, 160],
  low: [194, 73, 59],
  mid: [184, 123, 12],
  high: [46, 138, 79],
  white: [255, 255, 255],
} satisfies Record<string, RGB>

const PAGE_W = 210
const PAGE_H = 297
const M = 16
const CW = PAGE_W - 2 * M
const BOTTOM = PAGE_H - 18

// The built-in PDF fonts only cover Latin-1, so typographic punctuation is mapped and anything else dropped.
const LATIN1: Record<string, string> = {
  '“': '"', '”': '"', '„': '"', '‘': "'", '’': "'", '–': '-', '—': '-', '−': '-', '→': '->', '…': '...', '•': '·',
}
const safe = (s: string) => s.replace(/[^\x00-\xff]/g, (ch) => LATIN1[ch] ?? '')

/** Line height in mm for a font size in pt. */
const lh = (size: number) => size * 0.3528 * 1.3

const scoreRGB = (v: number | undefined): RGB => (v === undefined ? C.line : v < 5 ? C.low : v < 7 ? C.mid : C.high)

/** Builds an A4 report with the progress over time and the full results of every assessment, newest first. */
export async function renderPdfReport(data: AppData, txt: CardText): Promise<Blob> {
  const { t, l, formatScore, formatDate } = txt
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  let y = M

  const font = (size: number, style: 'normal' | 'bold' | 'italic' = 'normal', color: RGB = C.ink) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
  }
  const write = (text: string, x: number, yy: number, align: 'left' | 'center' | 'right' = 'left') =>
    doc.text(safe(text), x, yy, { align })
  /** Wraps with the current font; set the font first. */
  const wrap = (text: string, width: number): string[] => doc.splitTextToSize(safe(text), width)
  const ensure = (h: number) => {
    if (y + h > BOTTOM) {
      doc.addPage()
      y = M
    }
  }
  const hline = (x1: number, x2: number, yy: number, color: RGB = C.line) => {
    doc.setDrawColor(...color)
    doc.setLineWidth(0.25)
    doc.line(x1, yy, x2, yy)
  }
  const poly = (pts: [number, number][], style: 'S' | 'F' | 'FD', closed = true) => {
    const deltas = pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]])
    doc.lines(deltas, pts[0][0], pts[0][1], [1, 1], style, closed)
  }
  const eyebrow = (text: string, x: number, yy: number) => {
    font(6.5, 'bold', C.muted)
    doc.setCharSpace(0.25)
    write(text.toUpperCase(), x, yy)
    doc.setCharSpace(0)
  }
  /** Writes wrapped text from the current y and moves y below it. */
  const paragraph = (text: string, size: number, color: RGB = C.muted, x = M, width = CW, style: 'normal' | 'italic' = 'normal') => {
    font(size, style, color)
    for (const line of wrap(text, width)) {
      ensure(lh(size))
      y += lh(size)
      write(line, x, y - lh(size) * 0.25)
    }
  }
  const heading = (text: string, size = 13) => {
    ensure(lh(size) + 12)
    font(size, 'bold')
    y += lh(size)
    write(text, M, y - lh(size) * 0.25)
    y += 1
  }
  const tag = (text: string, x: number, baseline: number) => {
    font(5.5, 'bold', C.muted)
    const w = doc.getTextWidth(text) + 2
    doc.setDrawColor(...C.line)
    doc.setLineWidth(0.25)
    doc.roundedRect(x, baseline - 2.3, w, 3, 0.6, 0.6, 'S')
    write(text, x + 1, baseline - 0.2)
    return w
  }
  const delta = (now: number | null, before: number | null | undefined, suffix: boolean): { text: string; color: RGB } | null => {
    if (now === null || before === null || before === undefined) return suffix ? { text: t.noComparison, color: C.muted } : null
    const d = now - before
    return {
      text: `${d > 0 ? '+' : ''}${formatScore(d)}${suffix ? ` ${t.vsPrevious}` : ''}`,
      color: d > 0.05 ? C.high : d < -0.05 ? C.low : C.muted,
    }
  }

  // ── Cover ─────────────────────────────────────────────
  const all = byDate(data.assessments)
  eyebrow(t.card.eyebrow, M, y + 3)
  y += 6
  font(22, 'bold')
  for (const line of wrap(t.appTitle, CW)) {
    y += lh(22)
    write(line, M, y - lh(22) * 0.25)
  }
  y += 1
  paragraph(t.by, 9)
  paragraph(`${t.pdf.generated(formatDate(todayISO()))} · ${t.pdf.count(all.length)}`, 9)
  if (data.isSample) {
    y += 3
    font(9)
    const lines = wrap(t.sampleBanner, CW - 8)
    const h = lines.length * lh(9) + 5
    doc.setFillColor(...C.accentSoft)
    doc.roundedRect(M, y, CW, h, 2, 2, 'F')
    font(9, 'normal', C.ink)
    lines.forEach((line, i) => write(line, M + 4, y + 2.5 + (i + 0.75) * lh(9)))
    y += h
  }
  y += 6
  hline(M, M + CW, y)
  y += 8

  // ── Progress across all assessments ───────────────────
  if (all.length >= 2) {
    const first = all[0]
    const last = all[all.length - 1]
    heading(t.history.title)
    paragraph(t.history.since(formatDate(first.date), formatDate(last.date)), 8.5)
    y += 3
    trendChart(all)
    y += 6

    heading(t.history.byArea, 11)
    const colFirst = M + CW - 52
    const colLast = M + CW - 24
    font(7.5, 'bold', C.muted)
    y += lh(7.5)
    write(t.history.area, M, y)
    write(formatDate(first.date), colFirst, y, 'right')
    write(formatDate(last.date), colLast, y, 'right')
    y += 1.6
    hline(M, M + CW, y)
    for (const d of DOMAIN_IDS) {
      const a = domainAverage(first.scores, d)
      const b = domainAverage(last.scores, d)
      ensure(5.4)
      y += 5.4
      const base = y - 1.6
      font(8.5)
      write(l(DOMAINS[d].name), M, base)
      write(formatScore(a), colFirst, base, 'right')
      write(formatScore(b), colLast, base, 'right')
      const dl = delta(b, a, false)
      if (dl) {
        font(8.5, 'normal', dl.color)
        write(dl.text, M + CW, base, 'right')
      }
      hline(M, M + CW, y)
    }
    y += 8

    const { gains, drops } = biggestChanges(first.scores, last.scores)
    const colW = (CW - 10) / 2
    const top = y
    const endL = changeList(t.history.gains, gains, M, colW, top)
    const endR = changeList(t.history.drops, drops, M + colW + 10, colW, top)
    y = Math.max(endL, endR)
  }

  // ── One section per assessment ────────────────────────
  for (const a of [...all].reverse()) {
    doc.addPage()
    y = M
    assessmentSection(a, previousOf(data, a))
  }

  y += 10
  paragraph(t.footer, 7)

  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    hline(M, M + CW, PAGE_H - 12)
    font(7, 'normal', C.muted)
    write(`${t.appTitle} · dionatanmoura.com`, M, PAGE_H - 8)
    write(`${i} / ${pages}`, M + CW, PAGE_H - 8, 'right')
  }

  return doc.output('blob')

  // ── Pieces ────────────────────────────────────────────

  function trendChart(list: Assessment[]) {
    const H = 62
    const P = { l: 8, r: 12, t: 3, b: 9 }
    ensure(H + 8)
    const top = y
    const x = (i: number) => M + P.l + (list.length === 1 ? 0 : (i * (CW - P.l - P.r)) / (list.length - 1))
    const yv = (v: number) => top + P.t + (1 - v / 10) * (H - P.t - P.b)
    font(7, 'normal', C.muted)
    for (const v of [0, 2, 4, 6, 8, 10]) {
      hline(M + P.l, M + CW - P.r, yv(v))
      font(7, 'normal', C.muted)
      write(String(v), M + P.l - 2.5, yv(v) + 1, 'right')
    }
    // Thin out date labels so they never overlap.
    const every = Math.ceil(list.length / 6)
    list.forEach((a, i) => {
      if (i % every !== 0 && i !== list.length - 1) return
      write(formatDate(a.date), x(i), top + H - 3, i === 0 ? 'left' : i === list.length - 1 ? 'right' : 'center')
    })
    const series = [
      { key: 'E' as const, color: C.accent, label: t.tierShort.E },
      { key: 'A' as const, color: C.seriesA, label: t.tierShort.A },
    ]
    for (const s of series) {
      const pts = list
        .map((a, i) => [i, tierAverage(a.scores, s.key)] as const)
        .filter((p): p is readonly [number, number] => p[1] !== null)
      if (!pts.length) continue
      doc.setDrawColor(...s.color)
      doc.setFillColor(...s.color)
      doc.setLineWidth(0.7)
      if (pts.length > 1) poly(pts.map(([i, v]) => [x(i), yv(v)]), 'S', false)
      for (const [i, v] of pts) doc.circle(x(i), yv(v), 0.9, 'F')
      const [li, lv] = pts[pts.length - 1]
      font(7.5, 'bold', s.color)
      write(formatScore(lv), x(li) + 2.2, yv(lv) + 1)
    }
    y = top + H + 2
    let lx = M
    for (const s of series) {
      doc.setFillColor(...s.color)
      doc.rect(lx, y + 1.2, 4, 0.9, 'F')
      font(7.5, 'normal', C.muted)
      write(s.label, lx + 5.5, y + 2.2)
      lx += 5.5 + doc.getTextWidth(s.label) + 8
    }
    y += 4
  }

  /** Draws in a fixed column starting at `top`; returns the y where it ends. */
  function changeList(title: string, items: Change[], x: number, w: number, top: number): number {
    let yy = top
    font(10, 'bold')
    yy += lh(10)
    write(title, x, yy - lh(10) * 0.25)
    yy += 1
    if (!items.length) {
      font(8.5, 'normal', C.muted)
      yy += lh(8.5)
      write(t.history.none, x, yy)
      return yy
    }
    for (const c of items) {
      font(8.5)
      const lines = wrap(l(c.skill.name), w - 26)
      lines.forEach((line, i) => write(line, x, yy + (i + 1) * lh(8.5)))
      const base = yy + lh(8.5)
      font(8, 'normal', C.muted)
      write(`${c.from} -> ${c.to}`, x + w - 9, base, 'right')
      font(8, 'bold', c.diff > 0 ? C.high : C.low)
      write(`${c.diff > 0 ? '+' : ''}${c.diff}`, x + w, base, 'right')
      yy += lines.length * lh(8.5) + 1.4
    }
    return yy
  }

  function assessmentSection(a: Assessment, previous: Assessment | undefined) {
    const sc = a.scores
    const ps = previous?.scores
    const rated = ratedCount(sc)

    eyebrow(t.assessment, M, y + 3)
    y += 4
    heading(t.pdf.heading(formatDate(a.date)), 18)
    paragraph(t.rate.progress(rated, SKILLS.length), 8.5)
    y += 5

    if (!rated) {
      paragraph(t.result.emptyTitle, 10, C.ink)
      return
    }

    // Summary tiles
    const gap = 3
    const unit = (CW - 3 * gap) / 4.5
    const widths = [1.5 * unit, unit, unit, unit]
    const profile = profileFor(sc)
    const forming = profile.forming || !profile.strongest
    const title = forming ? t.result.inFormation : l(DOMAINS[profile.strongest!].profile)
    const body = forming
      ? t.result.formingBody
      : t.result.profileBody(l(DOMAINS[profile.strongest!].name), profile.weakest ? l(DOMAINS[profile.weakest].name) : '–')
    font(12, 'bold')
    const titleLines = wrap(title, widths[0] - 8)
    font(7.5)
    const bodyLines = wrap(body, widths[0] - 8)
    const h = Math.max(27, 10 + titleLines.length * lh(12) + bodyLines.length * lh(7.5) + 3)
    ensure(h)
    let tx = M
    const tiles = widths.map((w) => {
      doc.setDrawColor(...C.line)
      doc.setLineWidth(0.3)
      doc.roundedRect(tx, y, w, h, 2, 2, 'S')
      const x = tx + 4
      tx += w + gap
      return x
    })

    eyebrow(t.result.profile, tiles[0], y + 6)
    let py = y + 8
    font(12, 'bold', C.accent)
    for (const line of titleLines) {
      py += lh(12)
      write(line, tiles[0], py - lh(12) * 0.25)
    }
    py += 0.8
    font(7.5, 'normal', C.muted)
    for (const line of bodyLines) {
      py += lh(7.5)
      write(line, tiles[0], py - lh(7.5) * 0.25)
    }

    const stat = (x: number, label: string, value: string, sub: { text: string; color: RGB } | null) => {
      eyebrow(label, x, y + 6)
      font(18, 'normal')
      write(value, x, y + 15)
      if (sub) {
        font(7.5, 'normal', sub.color)
        write(sub.text, x, y + 20.5)
      }
    }
    const eAvg = tierAverage(sc, 'E')
    const aAvg = tierAverage(sc, 'A')
    stat(tiles[1], t.tierShort.E, formatScore(eAvg), delta(eAvg, ps && tierAverage(ps, 'E'), true))
    stat(tiles[2], t.tierShort.A, formatScore(aAvg), delta(aAvg, ps && tierAverage(ps, 'A'), true))
    const strong = SKILLS.filter((s) => sc[s.id] >= 7).length
    stat(tiles[3], t.result.autonomous, String(strong), {
      text: rated < SKILLS.length ? t.result.unrated(SKILLS.length - rated) : t.result.allRated,
      color: C.muted,
    })
    font(18, 'normal')
    const strongW = doc.getTextWidth(String(strong))
    font(9, 'normal', C.muted)
    write(` / ${rated}`, tiles[3] + strongW, y + 15)
    y += h + 9

    // Radar (left) and focus plan (right)
    ensure(96)
    const top = y
    const leftW = 84
    const rightX = M + leftW + 8
    const rightW = CW - leftW - 8

    font(11, 'bold')
    write(t.result.mapTitle, M, top + 4)
    font(7.5, 'normal', C.muted)
    const mapNote = wrap(t.result.mapNote(formatDate(a.date)), leftW)
    mapNote.forEach((line, i) => write(line, M, top + 8 + i * lh(7.5)))
    const r = 24
    const g = { cx: M + leftW / 2, cy: top + 8 + mapNote.length * lh(7.5) + 9 + r, r }
    const n = DOMAIN_IDS.length
    const ring = (values: number[]) => values.map((v, i) => axisPoint(i, n, v, g))
    doc.setDrawColor(...C.line)
    doc.setLineWidth(0.25)
    for (const v of [2, 4, 6, 8, 10]) poly(ring(Array(n).fill(v)), 'S')
    DOMAIN_IDS.forEach((_, i) => {
      const [x, yy] = axisPoint(i, n, 10, g)
      doc.line(g.cx, g.cy, x, yy)
    })
    const cur = ring(DOMAIN_IDS.map((d) => domainAverage(sc, d) ?? 0))
    doc.setFillColor(...C.radarFill)
    doc.setDrawColor(...C.accent)
    doc.setLineWidth(0.5)
    poly(cur, 'FD')
    if (ps) {
      doc.setDrawColor(...C.prev)
      doc.setLineWidth(0.35)
      doc.setLineDashPattern([1.2, 0.9], 0)
      poly(ring(DOMAIN_IDS.map((d) => domainAverage(ps, d) ?? 0)), 'S')
      doc.setLineDashPattern([], 0)
    }
    doc.setFillColor(...C.accent)
    for (const [x, yy] of cur) doc.circle(x, yy, 0.7, 'F')
    font(6.5, 'normal', C.muted)
    DOMAIN_IDS.forEach((d, i) => {
      const lay = labelLayout(i, n, l(DOMAINS[d].name), g, lh(6.5), 1.12)
      const align = lay.anchor === 'middle' ? 'center' : lay.anchor === 'start' ? 'left' : 'right'
      lay.lines.forEach((line, j) => write(line, lay.x, lay.firstBaseline + j * lh(6.5), align))
    })
    let ly = g.cy + r + 15
    let lx = M
    const legend = (color: RGB, label: string, dashed: boolean) => {
      doc.setDrawColor(...color)
      doc.setLineWidth(0.6)
      if (dashed) doc.setLineDashPattern([1.2, 0.9], 0)
      doc.line(lx, ly - 1, lx + 5, ly - 1)
      doc.setLineDashPattern([], 0)
      font(7.5, 'normal', C.muted)
      write(label, lx + 6.5, ly)
      lx += 6.5 + doc.getTextWidth(label) + 7
    }
    legend(C.accent, formatDate(a.date), false)
    if (previous) legend(C.prev, formatDate(previous.date), true)
    const leftEnd = ly + 2

    font(11, 'bold')
    write(t.result.focusTitle, rightX, top + 4)
    const focus = focusPlan(sc)
    const gaps = essentialGaps(sc)
    font(7.5, 'normal', C.muted)
    let ry = top + 8
    for (const line of wrap(gaps ? t.result.focusGaps(gaps) : focus.length ? t.result.focusNoGaps : t.result.focusDone, rightW)) {
      write(line, rightX, ry)
      ry += lh(7.5)
    }
    ry += 3
    const textX = rightX + 12
    const textW = rightW - 12
    focus.forEach((s, idx) => {
      const v = sc[s.id]
      const lvl = levelFor(v)
      const itemTop = ry
      doc.setFillColor(...scoreRGB(v))
      doc.circle(rightX + 4.5, itemTop + 4.5, 4.5, 'F')
      font(9, 'bold', C.white)
      write(String(v), rightX + 4.5, itemTop + 5.6, 'center')

      font(9, 'bold')
      const nameLines = wrap(l(s.name), textW)
      nameLines.forEach((line, i) => write(line, textX, itemTop + 3 + i * lh(9)))
      ry = itemTop + 3 + (nameLines.length - 1) * lh(9)
      const tagX = textX + doc.getTextWidth(nameLines[nameLines.length - 1]) + 2
      tag(t.tag[s.tier], tagX, ry)
      ry += lh(7.5) + 0.6
      font(7.5, 'normal', C.muted)
      for (const line of wrap(t.result.fromTo(l(lvl.title), l(nextLevel(lvl).title)), textW)) {
        write(line, textX, ry)
        ry += lh(7.5)
      }
      font(8, 'normal')
      for (const line of wrap(l(lvl.action), textW)) {
        write(line, textX, ry)
        ry += lh(8)
      }
      ry = Math.max(ry, itemTop + 10)
      if (idx < focus.length - 1) {
        hline(rightX, rightX + rightW, ry)
        ry += 3.5
      }
    })
    y = Math.max(leftEnd, ry) + 10

    // All skills
    heading(t.result.allTitle)
    paragraph(t.result.allNote, 8)
    y += 3
    const barW = 44
    const barX = M + CW - 66
    const nameW = barX - M - 6
    for (const d of DOMAIN_IDS) {
      ensure(18)
      y += 4
      font(10, 'bold')
      write(l(DOMAINS[d].name), M, y)
      font(10, 'normal')
      write(formatScore(domainAverage(sc, d)), M + CW, y, 'right')
      y += 1.8
      hline(M, M + CW, y)
      y += 1.2
      for (const s of SKILLS_ESSENTIALS_FIRST.filter((sk) => sk.domain === d)) {
        const v = sc[s.id]
        const pv = ps?.[s.id]
        font(8.5)
        const lines = wrap(l(s.name), nameW - (s.tier === 'A' ? 7 : 0))
        const rowH = lines.length * lh(8.5) + 1.4
        ensure(rowH)
        const base = y + lh(8.5) * 0.78
        font(8.5)
        lines.forEach((line, i) => write(line, M, base + i * lh(8.5)))
        if (s.tier === 'A') {
          font(8.5)
          tag('A', M + doc.getTextWidth(lines[lines.length - 1]) + 1.5, base + (lines.length - 1) * lh(8.5))
        }
        const barY = base - 1.9
        doc.setFillColor(...C.line)
        doc.roundedRect(barX, barY, barW, 1.8, 0.9, 0.9, 'F')
        if (v) {
          doc.setFillColor(...scoreRGB(v))
          doc.roundedRect(barX, barY, (v / 10) * barW, 1.8, 0.9, 0.9, 'F')
        }
        if (pv !== undefined) {
          doc.setFillColor(...C.prev)
          doc.rect(barX + (pv / 10) * barW - 0.3, barY - 0.9, 0.6, 3.6, 'F')
        }
        font(8.5)
        write(v === undefined ? '–' : String(v), barX + barW + 9, base, 'right')
        const diff = v !== undefined && pv !== undefined ? v - pv : 0
        if (diff) {
          font(8, 'normal', diff > 0 ? C.high : C.low)
          write(`${diff > 0 ? '+' : ''}${diff}`, M + CW, base, 'right')
        }
        y += rowH
      }
      y += 3
    }
  }
}
