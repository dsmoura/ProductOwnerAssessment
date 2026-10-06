import { useEffect, useState } from 'react'
import {
  blankAssessment,
  byDate,
  currentOf,
  loadData,
  previousOf,
  sampleData,
  saveData,
  todayISO,
  type AppData,
  type Assessment,
} from './domain/data'
import { ratedCount } from './domain/scoring'
import { useI18n, type Locale } from './i18n'
import { HomeView } from './components/HomeView'
import { ResultView } from './components/ResultView'
import { RateView } from './components/RateView'
import { HistoryView } from './components/HistoryView'
import { DataView } from './components/DataView'

type Tab = 'result' | 'rate' | 'history' | 'data'
type Screen = 'home' | Tab
const TABS: Tab[] = ['result', 'rate', 'history', 'data']

const screenFromHash = (): Screen => {
  const hash = location.hash.slice(1) as Tab
  return TABS.includes(hash) ? hash : 'home'
}

export default function App() {
  const { t, locale, setLocale, formatDate } = useI18n()
  const [data, setData] = useState<AppData>(() => loadData() ?? sampleData())
  const [screen, setScreen] = useState<Screen>(screenFromHash)

  useEffect(() => saveData(data), [data])

  // pushState gives every screen its own history entry, so the browser Back button walks the flow.
  useEffect(() => {
    const onPop = () => setScreen(screenFromHash())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function go(next: Screen) {
    if (next !== screen) history.pushState(null, '', next === 'home' ? location.pathname : `#${next}`)
    setScreen(next)
    window.scrollTo(0, 0)
  }

  const current = currentOf(data) ?? data.assessments[0]
  const previous = previousOf(data, current)

  const updateCurrent = (fn: (a: Assessment) => Assessment) =>
    setData((d) => ({ ...d, assessments: d.assessments.map((a) => (a.id === current.id ? fn(a) : a)) }))

  function setScore(skillId: string, value: number | null) {
    updateCurrent((a) => {
      const scores = { ...a.scores }
      if (value === null) delete scores[skillId]
      else scores[skillId] = value
      return { ...a, scores }
    })
  }

  /** Opens the rating flow on a fresh assessment, reusing the latest one if nothing in it was rated yet. */
  function startAssessment() {
    setData((d) => {
      const latest = byDate(d.assessments).at(-1)
      if (!d.isSample && latest && !ratedCount(latest.scores)) {
        return {
          ...d,
          assessments: d.assessments.map((a) => (a.id === latest.id ? { ...a, date: todayISO() } : a)),
          currentId: latest.id,
        }
      }
      const fresh = blankAssessment()
      return { version: 1, assessments: d.isSample ? [fresh] : [...d.assessments, fresh], currentId: fresh.id, isSample: false }
    })
    go('rate')
  }

  function addAssessments(list: Assessment[]) {
    setData((d) => ({
      version: 1,
      assessments: d.isSample ? list : [...d.assessments, ...list],
      currentId: byDate(list).at(-1)?.id,
      isSample: false,
    }))
  }

  function deleteAssessment(id: string) {
    setData((d) => {
      const rest = d.assessments.filter((a) => a.id !== id)
      return { ...d, assessments: rest.length ? rest : [blankAssessment()], currentId: undefined }
    })
  }

  const ordered = byDate(data.assessments).reverse()

  return (
    <div className="wrap">
      <header className="app-header">
        <div>
          <div className="eyebrow">{t.by}</div>
          <h1>
            {screen === 'home' ? (
              t.appTitle
            ) : (
              <a
                className="home-link"
                href="./"
                title={t.backToHome}
                onClick={(e) => {
                  e.preventDefault()
                  go('home')
                }}
              >
                {t.appTitle}
              </a>
            )}
          </h1>
        </div>
        <div className="controls">
          <div className="lang" role="group" aria-label={t.language}>
            {(['pt', 'en'] as Locale[]).map((lc) => (
              <button key={lc} type="button" aria-pressed={locale === lc} onClick={() => setLocale(lc)}>
                {lc.toUpperCase()}
              </button>
            ))}
          </div>
          {screen !== 'home' && (
            <>
              <label className="eyebrow" htmlFor="assessment-pick">
                {t.assessment}
              </label>
              <select
                id="assessment-pick"
                value={current.id}
                onChange={(e) => setData((d) => ({ ...d, currentId: e.target.value }))}
              >
                {ordered.map((a) => (
                  <option key={a.id} value={a.id}>
                    {formatDate(a.date)}
                  </option>
                ))}
              </select>
              <button className="btn primary" type="button" onClick={startAssessment}>
                {t.newAssessment}
              </button>
            </>
          )}
        </div>
      </header>

      {screen === 'home' ? (
        <main className="view">
          <HomeView
            data={data}
            onStart={startAssessment}
            onContinue={() => go('rate')}
            onResults={() => go('result')}
            onExample={() => {
              setData(sampleData())
              go('result')
            }}
            onImport={() => go('data')}
          />
        </main>
      ) : (
        <>
          {data.isSample && (
            <div className="banner">
              <span>{t.sampleBanner}</span>
              <button className="btn" type="button" onClick={startAssessment}>
                {t.startOwn}
              </button>
            </div>
          )}

          <nav className="tabs" role="tablist">
            {TABS.map((id) => (
              <button
                key={id}
                id={`tab-${id}`}
                className="tab"
                role="tab"
                type="button"
                aria-selected={screen === id}
                aria-controls="tab-panel"
                onClick={() => go(id)}
              >
                {t.tabs[id]}
              </button>
            ))}
          </nav>

          <main id="tab-panel" role="tabpanel" aria-labelledby={`tab-${screen}`} className="view">
            {screen === 'result' && <ResultView data={data} current={current} previous={previous} onRate={() => go('rate')} />}
            {screen === 'rate' && (
              <RateView
                key={current.id}
                current={current}
                previous={previous}
                onScore={setScore}
                onDate={(date) => updateCurrent((a) => ({ ...a, date }))}
                onDone={() => go('result')}
              />
            )}
            {screen === 'history' && <HistoryView assessments={data.assessments} current={current} />}
            {screen === 'data' && (
              <DataView
                data={data}
                current={current}
                onReplace={setData}
                onAddAssessments={addAssessments}
                onDelete={deleteAssessment}
                onLoadSample={() => setData(sampleData())}
              />
            )}
          </main>
        </>
      )}

      <footer>{t.footer}</footer>
    </div>
  )
}
