import { useI18n } from '../i18n'

export const scoreColor = (v: number | null | undefined) =>
  v === null || v === undefined ? 'var(--line)' : v < 5 ? 'var(--low)' : v < 7 ? 'var(--mid)' : 'var(--high)'

export function Delta({ now, before, suffix = true }: { now: number | null; before: number | null | undefined; suffix?: boolean }) {
  const { t, formatScore } = useI18n()
  if (now === null || before === null || before === undefined) {
    return suffix ? <span className="delta flat">{t.noComparison}</span> : null
  }
  const d = now - before
  const cls = d > 0.05 ? 'up' : d < -0.05 ? 'down' : 'flat'
  return (
    <span className={`delta ${cls}`}>
      {d > 0 ? '+' : ''}
      {formatScore(d)}
      {suffix && ` ${t.vsPrevious}`}
    </span>
  )
}
