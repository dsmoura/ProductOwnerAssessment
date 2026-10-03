import { DOMAIN_IDS, DOMAINS } from '../domain/skills'
import { domainAverage, type Scores } from '../domain/scoring'
import { axisPoint, labelLayout } from '../lib/radarGeometry'
import { useI18n } from '../i18n'

const G = { cx: 260, cy: 215, r: 140 }
const LINE = 14
const n = DOMAIN_IDS.length

const polygon = (values: number[]) => values.map((v, i) => axisPoint(i, n, v, G).join(',')).join(' ')

export function Radar({ scores, previous }: { scores: Scores; previous?: Scores }) {
  const { t, l } = useI18n()
  const current = DOMAIN_IDS.map((d) => domainAverage(scores, d) ?? 0)

  return (
    <svg className="radar" viewBox="0 0 520 430" role="img" aria-label={t.result.radarLabel}>
      {[2, 4, 6, 8, 10].map((ring) => (
        <polygon key={ring} className="radar-ring" points={polygon(Array(n).fill(ring))} />
      ))}
      {DOMAIN_IDS.map((d, i) => {
        const [x, y] = axisPoint(i, n, 10, G)
        return <line key={d} className="radar-axis" x1={G.cx} y1={G.cy} x2={x} y2={y} />
      })}
      {[5, 10].map((v) => {
        const [x, y] = axisPoint(0, n, v, G)
        return (
          <text key={v} className="radar-tick" x={x + 5} y={y + 4}>
            {v}
          </text>
        )
      })}
      {previous && <polygon className="radar-prev" points={polygon(DOMAIN_IDS.map((d) => domainAverage(previous, d) ?? 0))} />}
      <polygon className="radar-cur" points={polygon(current)} />
      {current.map((v, i) => {
        const [x, y] = axisPoint(i, n, v, G)
        return <circle key={i} className="radar-dot" cx={x} cy={y} r={4} />
      })}
      {DOMAIN_IDS.map((d, i) => {
        const lay = labelLayout(i, n, l(DOMAINS[d].name), G, LINE)
        return (
          <text key={d} className="radar-label" textAnchor={lay.anchor}>
            {lay.lines.map((line, j) => (
              <tspan key={j} x={lay.x} y={lay.firstBaseline + j * LINE}>
                {line}
              </tspan>
            ))}
          </text>
        )
      })}
    </svg>
  )
}
