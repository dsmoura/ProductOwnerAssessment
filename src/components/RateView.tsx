import { useEffect, useState } from 'react'
import type { Assessment } from '../domain/data'
import { DOMAIN_IDS, DOMAINS, LEVELS, SKILLS, SKILLS_ESSENTIALS_FIRST, type Tier } from '../domain/skills'
import { levelFor, ratedCount, type Scores } from '../domain/scoring'
import { useI18n } from '../i18n'

type Props = {
  current: Assessment
  previous?: Assessment
  onScore: (skillId: string, value: number | null) => void
  onDate: (date: string) => void
  onDone: () => void
}

const SCALE = Array.from({ length: 11 }, (_, i) => i)

const skillsOf = (i: number) => SKILLS_ESSENTIALS_FIRST.filter((s) => s.domain === DOMAIN_IDS[i])

/** 'done' when every skill of the area has a score, 'partial' when some do. */
function areaState(scores: Scores, i: number): 'done' | 'partial' | 'todo' {
  const list = skillsOf(i)
  const n = list.filter((s) => scores[s.id] !== undefined).length
  return n === list.length ? 'done' : n ? 'partial' : 'todo'
}

export function RateView({ current, previous, onScore, onDate, onDone }: Props) {
  const { t, l } = useI18n()
  const sc = current.scores
  // Resume at the first area that still has unrated skills.
  const [step, setStepState] = useState(() => Math.max(0, DOMAIN_IDS.findIndex((_, i) => areaState(sc, i) !== 'done')))
  const rated = ratedCount(sc)
  const last = step === DOMAIN_IDS.length - 1
  const domain = DOMAINS[DOMAIN_IDS[step]]

  // Keep the current area's chip visible when the stepper scrolls sideways (phones).
  useEffect(() => {
    document.querySelector('.stepper [aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [step])

  function setStep(next: number) {
    setStepState(next)
    window.scrollTo(0, 0)
  }

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
        </div>
        <div className="controls grow">
          <span className="num note">{t.rate.progress(rated, SKILLS.length)}</span>
          <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={SKILLS.length} aria-valuenow={rated}>
            <span style={{ width: `${(rated / SKILLS.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <nav className="stepper" aria-label={t.rate.areasLabel}>
        {DOMAIN_IDS.map((d, i) => (
          <button
            key={d}
            type="button"
            className={areaState(sc, i)}
            aria-current={i === step ? 'step' : undefined}
            onClick={() => setStep(i)}
          >
            <span className="num" aria-hidden="true">
              {areaState(sc, i) === 'done' ? '✓' : i + 1}
            </span>
            <span className="label">{l(DOMAINS[d].name)}</span>
          </button>
        ))}
      </nav>

      <section className="tier">
        <div>
          <span className="eyebrow">{t.rate.stepOf(step + 1, DOMAIN_IDS.length)}</span>
          <h2>{l(domain.name)}</h2>
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
        {(['E', 'A'] as Tier[]).map((tier) => {
          const list = skillsOf(step).filter((s) => s.tier === tier)
          if (!list.length) return null
          return (
            <div className="tier-group" key={tier}>
              <h3 className="tier-head">
                {t.tag[tier]}
                <span className="num">{list.filter((s) => sc[s.id] !== undefined).length}/{list.length}</span>
              </h3>
              {list.map((s) => {
                const v = sc[s.id]
                const pv = previous?.scores[s.id]
                const name = l(s.name)
                return (
                  <div className="item" key={s.id}>
                    <div className="item-text">
                      <h4>{name}</h4>
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
                  </div>
                )
              })}
            </div>
          )
        })}
      </section>

      <div className="wizard-nav">
        <button className="btn" type="button" onClick={() => setStep(step - 1)} disabled={step === 0}>
          ← {t.rate.back}
        </button>
        <div className="controls">
          {!last && rated > 0 && (
            <button className="btn skip" type="button" onClick={onDone}>
              {t.rate.seeResult}
            </button>
          )}
          {last ? (
            <button className="btn primary" type="button" onClick={onDone} disabled={!rated}>
              {t.rate.seeResult} →
            </button>
          ) : (
            <button className="btn primary" type="button" onClick={() => setStep(step + 1)}>
              {t.rate.next(l(DOMAINS[DOMAIN_IDS[step + 1]].name))} →
            </button>
          )}
        </div>
      </div>
    </>
  )
}
