import { byDate, type Assessment } from '../domain/data'
import { DOMAIN_IDS, DOMAINS } from '../domain/skills'
import { biggestChanges, domainAverage, tierAverage, type Change } from '../domain/scoring'
import { useI18n } from '../i18n'
import { Delta } from './ui'

const W = 900
const H = 300
const PAD = { l: 40, r: 60, t: 16, b: 40 }

function TrendChart({ list }: { list: Assessment[] }) {
  const { t, formatScore, formatDate } = useI18n()
  const x = (i: number) => PAD.l + (list.length === 1 ? 0 : (i * (W - PAD.l - PAD.r)) / (list.length - 1))
  const y = (v: number) => PAD.t + (1 - v / 10) * (H - PAD.t - PAD.b)
  const series = [
    { key: 'E' as const, cls: 'series-e', label: t.tierShort.E },
    { key: 'D' as const, cls: 'series-d', label: t.tierShort.D },
  ]
  // Thin out date labels so they never overlap.
  const every = Math.ceil(list.length / 6)

  return (
    <div className="chart-box">
      <svg className="trend" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.history.chartLabel}>
        {[0, 2, 4, 6, 8, 10].map((v) => (
          <g key={v}>
            <line className="grid" x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} />
            <text className="axis-label" x={PAD.l - 8} y={y(v) + 4} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        {list.map((a, i) =>
          i % every === 0 || i === list.length - 1 ? (
            <text
              key={a.id}
              className="axis-label"
              x={x(i)}
              y={H - 12}
              textAnchor={i === 0 ? 'start' : i === list.length - 1 ? 'end' : 'middle'}
            >
              {formatDate(a.date)}
            </text>
          ) : null,
        )}
        {series.map((s) => {
          const pts = list.map((a, i) => [i, tierAverage(a.scores, s.key)] as const).filter((p) => p[1] !== null)
          if (!pts.length) return null
          const last = pts[pts.length - 1]
          return (
            <g key={s.key} className={s.cls}>
              <polyline points={pts.map(([i, v]) => `${x(i)},${y(v!)}`).join(' ')} />
              {pts.map(([i, v]) => (
                <circle key={i} cx={x(i)} cy={y(v!)} r={4} />
              ))}
              <text className="end-label" x={x(last[0]) + 9} y={y(last[1]!) + 4}>
                {formatScore(last[1])}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="legend">
        {series.map((s) => (
          <span key={s.key}>
            <i className={`swatch ${s.cls}`} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function ChangeList({ title, items }: { title: string; items: Change[] }) {
  const { t, l } = useI18n()
  return (
    <div className="changes">
      <h3>{title}</h3>
      {items.length ? (
        <ul>
          {items.map((c) => (
            <li key={c.skill.id}>
              <span>{l(c.skill.name)}</span>
              <span className="num note">
                {c.from} → {c.to}
              </span>
              <span className={`delta ${c.diff > 0 ? 'up' : 'down'}`}>
                {c.diff > 0 ? '+' : ''}
                {c.diff}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="note">{t.history.none}</p>
      )}
    </div>
  )
}

export function HistoryView({ assessments, current }: { assessments: Assessment[]; current: Assessment }) {
  const { t, l, formatScore, formatDate } = useI18n()
  const list = byDate(assessments).filter((a) => a.date <= current.date)

  if (list.length < 2) {
    return (
      <section className="panel">
        <h2>{t.history.title}</h2>
        <p className="note">{t.history.needTwo}</p>
      </section>
    )
  }

  const first = list[0]
  const { gains, drops } = biggestChanges(first.scores, current.scores)

  return (
    <>
      <section className="panel">
        <div>
          <h2>{t.history.title}</h2>
          <p className="note">{t.history.since(formatDate(first.date), formatDate(current.date))}</p>
        </div>
        <TrendChart list={list} />
      </section>
      <div className="split">
        <section className="panel">
          <h2>{t.history.byArea}</h2>
          <div className="table-box">
            <table className="area-table">
              <thead>
                <tr>
                  <th scope="col">{t.history.area}</th>
                  <th scope="col" className="num">
                    {formatDate(first.date)}
                  </th>
                  <th scope="col" className="num">
                    {formatDate(current.date)}
                  </th>
                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                {DOMAIN_IDS.map((d) => {
                  const a = domainAverage(first.scores, d)
                  const b = domainAverage(current.scores, d)
                  return (
                    <tr key={d}>
                      <th scope="row">{l(DOMAINS[d].name)}</th>
                      <td className="num">{formatScore(a)}</td>
                      <td className="num">{formatScore(b)}</td>
                      <td>
                        <Delta now={b} before={a} suffix={false} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
        <section className="panel">
          <ChangeList title={t.history.gains} items={gains} />
          <ChangeList title={t.history.drops} items={drops} />
        </section>
      </div>
    </>
  )
}
