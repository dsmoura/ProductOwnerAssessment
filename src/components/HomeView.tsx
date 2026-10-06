import { useMemo } from 'react'
import { currentOf, sampleData, type AppData } from '../domain/data'
import { SKILLS } from '../domain/skills'
import { ratedCount } from '../domain/scoring'
import { useI18n } from '../i18n'
import { Radar } from './Radar'

type Props = {
  data: AppData
  onStart: () => void
  onContinue: () => void
  onResults: () => void
  onExample: () => void
  onImport: () => void
}

export function HomeView({ data, onStart, onContinue, onResults, onExample, onImport }: Props) {
  const { t, formatDate } = useI18n()
  const demo = useMemo(() => sampleData().assessments[1].scores, [])
  const current = data.isSample ? undefined : currentOf(data)
  const rated = current ? ratedCount(current.scores) : 0

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="lead">{t.home.pitch(SKILLS.length)}</p>
          <div className="controls">
            <button className="btn primary big-btn" type="button" onClick={onStart}>
              {t.home.start}
            </button>
            {current && rated > 0 && rated < SKILLS.length ? (
              <button className="btn big-btn" type="button" onClick={onContinue}>
                {t.home.continue(rated, SKILLS.length)}
              </button>
            ) : current && rated > 0 ? (
              <button className="btn big-btn" type="button" onClick={onResults}>
                {t.home.seeLatest(formatDate(current.date))}
              </button>
            ) : (
              !current && (
                <button className="btn big-btn" type="button" onClick={onExample}>
                  {t.home.seeExample}
                </button>
              )
            )}
          </div>
          <button className="link" type="button" onClick={onImport}>
            {t.home.importLink}
          </button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <Radar scores={demo} />
        </div>
      </section>

      <section className="how">
        <h2>{t.home.howTitle}</h2>
        <ol>
          {t.home.steps.map((s, i) => (
            <li key={s.title} className="panel">
              <span className="how-n num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p className="note">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
