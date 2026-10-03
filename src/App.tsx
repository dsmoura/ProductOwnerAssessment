import { useEffect, useState } from 'react'
import {
  blankAssessment,
  byDate,
  currentOf,
  loadData,
  previousOf,
  sampleData,
  saveData,
  type AppData,
  type Assessment,
} from './domain/data'
import { useI18n, type Locale } from './i18n'
import { ResultView } from './components/ResultView'
import { RateView } from './components/RateView'
import { HistoryView } from './components/HistoryView'
import { DataView } from './components/DataView'

type Tab = 'result' | 'rate' | 'history' | 'data'
const TABS: Tab[] = ['result', 'rate', 'history', 'data']

const tabFromHash = (): Tab => {
  const hash = location.hash.slice(1) as Tab
  return TABS.includes(hash) ? hash : 'result'
}

export default function App() {
  const { t, locale, setLocale, formatDate } = useI18n()
  const [data, setData] = useState<AppData>(() => loadData() ?? sampleData())
  const [tab, setTabState] = useState<Tab>(tabFromHash)

  useEffect(() => saveData(data), [data])

  useEffect(() => {
    const onHash = () => setTabState(tabFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function setTab(next: Tab) {
    setTabState(next)
    history.replaceState(null, '', next === 'result' ? location.pathname : `#${next}`)
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

  function setNote(skillId: string, note: string) {
    updateCurrent((a) => {
      const notes = { ...a.notes }
      if (note.trim()) notes[skillId] = note
      else delete notes[skillId]
      return { ...a, notes }
    })
  }

  function newAssessment() {
    const fresh = blankAssessment()
    setData((d) => ({
      version: 1,
      assessments: d.isSample ? [fresh] : [...d.assessments, fresh],
      currentId: fresh.id,
      isSample: false,
    }))
    setTab('rate')
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
          <h1>{t.appTitle}</h1>
        </div>
        <div className="controls">
          <div className="lang" role="group" aria-label={t.language}>
            {(['pt', 'en'] as Locale[]).map((lc) => (
              <button key={lc} type="button" aria-pressed={locale === lc} onClick={() => setLocale(lc)}>
                {lc.toUpperCase()}
              </button>
            ))}
          </div>
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
          <button className="btn primary" type="button" onClick={newAssessment}>
            {t.newAssessment}
          </button>
        </div>
      </header>

      {data.isSample && (
        <div className="banner">
          <span>{t.sampleBanner}</span>
          <button className="btn" type="button" onClick={newAssessment}>
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
            aria-selected={tab === id}
            aria-controls="tab-panel"
            onClick={() => setTab(id)}
          >
            {t.tabs[id]}
          </button>
        ))}
      </nav>

      <main id="tab-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="view">
        {tab === 'result' && <ResultView current={current} previous={previous} onRate={() => setTab('rate')} />}
        {tab === 'rate' && (
          <RateView
            current={current}
            previous={previous}
            onScore={setScore}
            onNote={setNote}
            onDate={(date) => updateCurrent((a) => ({ ...a, date }))}
            onDone={() => setTab('result')}
          />
        )}
        {tab === 'history' && <HistoryView assessments={data.assessments} current={current} />}
        {tab === 'data' && (
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

      <footer>{t.footer}</footer>
    </div>
  )
}
