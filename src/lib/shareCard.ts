import { DOMAIN_IDS, DOMAINS } from '../domain/skills'
import { domainAverage, profileFor, tierAverage, type Scores } from '../domain/scoring'
import type { Dict } from '../i18n/pt'
import { axisPoint, labelLayout } from './radarGeometry'

type CardText = {
  t: Dict
  l: (text: { pt: string; en: string }) => string
  formatScore: (v: number | null) => string
  formatDate: (iso: string) => string
}

const W = 1200
const H = 630
const C = {
  bg: '#0F3A40',
  ink: '#F2F8F8',
  soft: '#A9D3D7',
  line: 'rgba(242,248,248,0.16)',
  fill: 'rgba(79,193,201,0.32)',
  stroke: '#6FD3DA',
}
const DISPLAY = '"Bricolage Grotesque Variable", "Segoe UI", sans-serif'
const BODY = 'Figtree, "Segoe UI", sans-serif'
const MONO = '"IBM Plex Mono", Consolas, monospace'

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else line = test
  }
  if (line) lines.push(line)
  return lines
}

/** Renders a 1200×630 PNG (LinkedIn/OG size) with the profile, tier averages and the radar. */
export async function renderShareCard(scores: Scores, date: string, txt: CardText): Promise<Blob> {
  await Promise.all([
    document.fonts.load(`700 60px ${DISPLAY}`),
    document.fonts.load(`500 24px ${BODY}`),
    document.fonts.load(`500 72px ${MONO}`),
  ])
  const { t, l, formatScore, formatDate } = txt
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, W, H)

  const profile = profileFor(scores)
  const title = profile.forming || !profile.strongest ? t.result.inFormation : l(DOMAINS[profile.strongest].profile)
  const x0 = 72

  ctx.fillStyle = C.soft
  ctx.font = `600 18px ${BODY}`
  ctx.letterSpacing = '2px'
  ctx.fillText(t.card.eyebrow, x0, 96)
  ctx.letterSpacing = '0px'

  ctx.fillStyle = C.ink
  ctx.font = `700 60px ${DISPLAY}`
  const titleLines = wrap(ctx, title, 540)
  titleLines.forEach((line, i) => ctx.fillText(line, x0, 180 + i * 66))

  let y = 180 + (titleLines.length - 1) * 66 + 52
  if (profile.strongest && !profile.forming) {
    ctx.fillStyle = C.soft
    ctx.font = `500 24px ${BODY}`
    for (const line of wrap(ctx, l(DOMAINS[profile.strongest].name), 540)) {
      ctx.fillText(line, x0, y)
      y += 32
    }
  }

  const stats: [string, number | null][] = [
    [t.card.essentials, tierAverage(scores, 'E')],
    [t.card.advanced, tierAverage(scores, 'A')],
  ]
  stats.forEach(([label, value], i) => {
    const sx = x0 + i * 250
    ctx.fillStyle = C.ink
    ctx.font = `500 72px ${MONO}`
    ctx.fillText(formatScore(value), sx, 470)
    ctx.fillStyle = C.soft
    ctx.font = `500 22px ${BODY}`
    ctx.fillText(label, sx, 506)
  })

  ctx.fillStyle = C.soft
  ctx.font = `500 20px ${BODY}`
  ctx.fillText(`dionatanmoura.com · ${formatDate(date)}`, x0, 572)

  // Radar
  const g = { cx: 915, cy: 320, r: 150 }
  const n = DOMAIN_IDS.length
  const path = (values: number[]) => {
    ctx.beginPath()
    values.forEach((v, i) => {
      const [px, py] = axisPoint(i, n, v, g)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    })
    ctx.closePath()
  }
  ctx.strokeStyle = C.line
  ctx.lineWidth = 1.5
  for (const ring of [2, 4, 6, 8, 10]) {
    path(Array(n).fill(ring))
    ctx.stroke()
  }
  DOMAIN_IDS.forEach((_, i) => {
    const [px, py] = axisPoint(i, n, 10, g)
    ctx.beginPath()
    ctx.moveTo(g.cx, g.cy)
    ctx.lineTo(px, py)
    ctx.stroke()
  })
  path(DOMAIN_IDS.map((d) => domainAverage(scores, d) ?? 0))
  ctx.fillStyle = C.fill
  ctx.fill()
  ctx.strokeStyle = C.stroke
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.fillStyle = C.soft
  ctx.font = `500 16px ${BODY}`
  DOMAIN_IDS.forEach((d, i) => {
    const lay = labelLayout(i, n, l(DOMAINS[d].name), g, 19, 1.12)
    ctx.textAlign = lay.anchor === 'middle' ? 'center' : lay.anchor === 'start' ? 'left' : 'right'
    lay.lines.forEach((line, j) => ctx.fillText(line, lay.x, lay.firstBaseline + j * 19))
  })
  ctx.textAlign = 'left'

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('PNG export failed'))), 'image/png'),
  )
}
