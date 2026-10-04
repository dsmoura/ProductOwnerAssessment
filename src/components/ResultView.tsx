import { useState } from 'react'
import type { Assessment } from '../domain/data'
import { DOMAIN_IDS, DOMAINS, SKILLS } from '../domain/skills'
import {
  domainAverage,
  essentialGaps,
  focusPlan,
  levelFor,
  nextLevel,
  profileFor,
  ratedCount,
  tierAverage,
} from '../domain/scoring'
import { useI18n } from '../i18n'
import { downloadBlob } from '../lib/download'
import { renderShareCard } from '../lib/shareCard'
import { Radar } from './Radar'
import { Delta, scoreColor } from './ui'

type Props = { current: Assessment; previous?: Assessment; onRate: () => void }

// Within each area, essentials come before advanced skills; the stable sort keeps catalogue order inside a tier.
const ESSENTIALS_FIRST = [...SKILLS].sort((a, b) => Number(a.tier === 'A') - Number(b.tier === 'A'))

export function ResultView({ current, previous, onRate }: Props) {
  const i18n = useI18n()
  const { t, l, formatScore, formatDate } = i18n
  const [busy, setBusy] = useState(false)
  const sc = current.scores
  const ps = previous?.scores
  const rated = ratedCount(sc)

  if (!rated) {
    return (
      <section className="panel">
        <h2>{t.result.emptyTitle}</h2>
        <p className="note">{t.result.emptyBody}</p>
        <div>
          <button className="btn primary" type="button" onClick={onRate}>
            {t.result.rateNow}
          </button>
        </div>
      </section>
    )
  }

  const profile = profileFor(sc)
  const eAvg = tierAverage(sc, 'E')
  const aAvg = tierAverage(sc, 'A')
  const strong = SKILLS.filter((s) => sc[s.id] >= 7).length
  const gaps = essentialGaps(sc)
  const focus = focusPlan(sc)

  async function shareCard() {
    setBusy(true)
    try {
      const blob = await renderShareCard(sc, current.date, i18n)
      downloadBlob(blob, `po-self-assessment-${current.date}.png`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="summary">
        <div className="tile profile">
          <span className="eyebrow">{t.result.profile}</span>
          <span className="big">
            {profile.forming || !profile.strongest ? t.result.inFormation : l(DOMAINS[profile.strongest].profile)}
          </span>
          <span className="sub">
            {profile.forming || !profile.strongest
              ? t.result.formingBody
              : t.result.profileBody(l(DOMAINS[profile.strongest].name), profile.weakest ? l(DOMAINS[profile.weakest].name) : '–')}
          </span>
        </div>
        <div className="tile">
          <span className="eyebrow">{t.tierShort.E}</span>
          <span className="big num">{formatScore(eAvg)}</span>
          <Delta now={eAvg} before={ps && tierAverage(ps, 'E')} />
        </div>
        <div className="tile">
          <span className="eyebrow">{t.tierShort.A}</span>
          <span className="big num">{formatScore(aAvg)}</span>
          <Delta now={aAvg} before={ps && tierAverage(ps, 'A')} />
        </div>
        <div className="tile">
          <span className="eyebrow">{t.result.autonomous}</span>
          <span className="big num">
            {strong}
            <span className="sub"> / {rated}</span>
          </span>
          <span className="sub">{rated < SKILLS.length ? t.result.unrated(SKILLS.length - rated) : t.result.allRated}</span>
        </div>
      </div>

      <div className="split">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>{t.result.mapTitle}</h2>
              <p className="note">{t.result.mapNote(formatDate(current.date))}</p>
            </div>
            <button className="btn" type="button" onClick={shareCard} disabled={busy}>
              {t.result.shareCard}
            </button>
          </div>
          <div className="radar-box">
            <Radar scores={sc} previous={ps} />
          </div>
          <div className="legend">
            <span>
              <i style={{ background: 'var(--accent)' }} />
              {formatDate(current.date)}
            </span>
            {previous && (
              <span>
                <i style={{ background: 'var(--prev)' }} />
                {formatDate(previous.date)}
              </span>
            )}
          </div>
        </section>

        <section className="panel">
          <div>
            <h2>{t.result.focusTitle}</h2>
            <p className="note">{gaps ? t.result.focusGaps(gaps) : focus.length ? t.result.focusNoGaps : t.result.focusDone}</p>
          </div>
          <ol className="focus">
            {focus.map((s) => {
              const v = sc[s.id]
              const lvl = levelFor(v)
              return (
                <li key={s.id}>
                  <span className="score" style={{ background: scoreColor(v) }}>
                    {v}
                  </span>
                  <h3>
                    {l(s.name)}
                    <span className="tag">{t.tag[s.tier]}</span>
                  </h3>
                  <span className="step">{t.result.fromTo(l(lvl.title), l(nextLevel(lvl).title))}</span>
                  <span className="act">{l(lvl.action)}</span>
                </li>
              )
            })}
          </ol>
        </section>
      </div>

      <section className="panel">
        <div>
          <h2>{t.result.allTitle}</h2>
          <p className="note">{t.result.allNote}</p>
        </div>
        <div className="map">
          {DOMAIN_IDS.map((d) => (
            <div className="domain" key={d}>
              <div className="domain-head">
                <h3>{l(DOMAINS[d].name)}</h3>
                <span className="num">{formatScore(domainAverage(sc, d))}</span>
              </div>
              {ESSENTIALS_FIRST.filter((s) => s.domain === d).map((s) => {
                const v = sc[s.id]
                const pv = ps?.[s.id]
                const diff = v !== undefined && pv !== undefined ? v - pv : 0
                return (
                  <div className="row" key={s.id}>
                    <span className="nm">
                      {l(s.name)}
                      {s.tier === 'A' && <span className="tag">A</span>}
                    </span>
                    <span className="bar">
                      <span style={{ width: `${(v ?? 0) * 10}%`, background: scoreColor(v) }} />
                      {pv !== undefined && <b style={{ left: `calc(${pv * 10}% - 1px)` }} />}
                    </span>
                    <span className="v num">{v ?? '–'}</span>
                    <span className={`delta ${diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat'}`}>
                      {diff ? `${diff > 0 ? '+' : ''}${diff}` : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
