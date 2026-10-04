import { useState } from 'react'
import type { Assessment } from '../domain/data'
import { DOMAIN_IDS, DOMAINS, LEVELS, SKILLS, type Tier } from '../domain/skills'
import { levelFor, ratedCount } from '../domain/scoring'
import { useI18n } from '../i18n'

type Props = {
  current: Assessment
  previous?: Assessment
  onScore: (skillId: string, value: number | null) => void
  onNote: (skillId: string, note: string) => void
  onDate: (date: string) => void
  onDone: () => void
}

const SCALE = Array.from({ length: 11 }, (_, i) => i)

// Skills of the same area sit together inside each tier; the stable sort keeps catalogue order within an area.
const BY_AREA = [...SKILLS].sort((a, b) => DOMAIN_IDS.indexOf(a.domain) - DOMAIN_IDS.indexOf(b.domain))

export function RateView({ current, previous, onScore, onNote, onDate, onDone }: Props) {
  const { t, l } = useI18n()
  const [onlyUnrated, setOnlyUnrated] = useState(false)
  const sc = current.scores
  const rated = ratedCount(sc)
  const visible = (id: string) => !onlyUnrated || sc[id] === undefined

  return (
    <>
      <div className="rate-head">
        <div className="controls">
          <label className="eyebrow" htmlFor="assessment-date">
            {t.rate.date}
          </label>
          <input
            id="assessment-date"
            type="date"
            value={current.date}
            onChange={(e) => e.target.value && onDate(e.target.value)}
          />
          <label className="check">
            <input id="only-unrated" type="checkbox" checked={onlyUnrated} onChange={(e) => setOnlyUnrated(e.target.checked)} />
            {t.rate.onlyUnrated}
          </label>
        </div>
        <div className="controls grow">
          <span className="num note">{t.rate.progress(rated, SKILLS.length)}</span>
          <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={SKILLS.length} aria-valuenow={rated}>
            <span style={{ width: `${(rated / SKILLS.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="scale">
        {LEVELS.map((lv) => (
          <div key={lv.min}>
            <strong>{lv.min === lv.max ? lv.min : `${lv.min}–${lv.max}`}</strong>
            {l(lv.title)}
          </div>
        ))}
      </div>
      <p className="note">{t.rate.clearHint}</p>

      {(['E', 'A'] as Tier[]).map((tier) => (
        <section className="tier" key={tier}>
          <h2>{t.tiers[tier]}</h2>
          {BY_AREA.filter((s) => s.tier === tier && visible(s.id)).map((s) => {
            const v = sc[s.id]
            const pv = previous?.scores[s.id]
            const name = l(s.name)
            return (
              <div className="item" key={s.id}>
                <div className="item-text">
                  <span className="eyebrow">{l(DOMAINS[s.domain].name)}</span>
                  <h3>{name}</h3>
                  <span className="anchor">
                    {v !== undefined ? l(levelFor(v).title) : t.rate.unrated}
                    {pv !== undefined && ` · ${t.rate.before(pv)}`}
                  </span>
                </div>
                <div className="seg" role="group" aria-label={t.rate.scoreFor(name)}>
                  {SCALE.map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={v === n}
                      className={pv === n && v !== n ? 'prev' : undefined}
                      title={pv === n ? t.rate.previousHint : undefined}
                      onClick={() => onScore(s.id, v === n ? null : n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {v !== undefined && v >= 7 && (
                  <label className="evidence">
                    <span>{t.rate.evidenceLabel}</span>
                    <input
                      id={`note-${s.id}`}
                      type="text"
                      maxLength={500}
                      value={current.notes[s.id] ?? ''}
                      placeholder={t.rate.evidencePlaceholder}
                      onChange={(e) => onNote(s.id, e.target.value)}
                    />
                  </label>
                )}
              </div>
            )
          })}
        </section>
      ))}

      {rated === SKILLS.length && (
        <div className="banner">
          <span>{t.rate.allDone}</span>
          <button className="btn primary" type="button" onClick={onDone}>
            {t.rate.seeResult}
          </button>
        </div>
      )}
    </>
  )
}
