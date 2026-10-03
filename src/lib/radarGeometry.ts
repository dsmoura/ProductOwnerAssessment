export type RadarGeometry = { cx: number; cy: number; r: number }

export function axisPoint(i: number, n: number, value: number, g: RadarGeometry): [number, number] {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n
  return [g.cx + Math.cos(angle) * g.r * (value / 10), g.cy + Math.sin(angle) * g.r * (value / 10)]
}

/** Breaks an area name into at most two lines: at " & " when present, otherwise at the space nearest the middle. */
export function splitLabel(text: string): string[] {
  const amp = text.indexOf(' & ')
  if (amp > 0) return [text.slice(0, amp + 2), text.slice(amp + 3)]
  if (text.length <= 14) return [text]
  const mid = text.length / 2
  let best = -1
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i
  }
  return best < 0 ? [text] : [text.slice(0, best), text.slice(best + 1)]
}

export type LabelLayout = { x: number; firstBaseline: number; anchor: 'start' | 'middle' | 'end'; lines: string[] }

export function labelLayout(i: number, n: number, text: string, g: RadarGeometry, lineHeight: number, offset = 1.13): LabelLayout {
  const [x, y] = axisPoint(i, n, 10 * offset, g)
  const lines = splitLabel(text)
  const dx = x - g.cx
  const dy = y - g.cy
  const anchor = Math.abs(dx) < g.r * 0.1 ? 'middle' : dx > 0 ? 'start' : 'end'
  const block = (lines.length - 1) * lineHeight
  const firstBaseline =
    dy < -g.r * 0.3 ? y - block : dy > g.r * 0.3 ? y + lineHeight * 0.8 : y - block / 2 + lineHeight * 0.35
  return { x, firstBaseline, anchor, lines }
}
