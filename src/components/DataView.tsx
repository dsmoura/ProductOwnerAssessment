import { useState, type ChangeEvent } from 'react'
import { parseAppData, todayISO, type AppData, type Assessment } from '../domain/data'
import { importXlsxFile } from '../domain/importXlsx'
import { useI18n } from '../i18n'
import { downloadBlob } from '../lib/download'

type Props = {
  data: AppData
  current: Assessment
  onReplace: (data: AppData) => void
  onAddAssessments: (list: Assessment[]) => void
  onDelete: (id: string) => void
  onLoadSample: () => void
}

type Message = { kind: 'ok' | 'error'; text: string }

export function DataView({ data, current, onReplace, onAddAssessments, onDelete, onLoadSample }: Props) {
  const { t, formatDate } = useI18n()
  const [message, setMessage] = useState<Message | null>(null)
  const [pendingRestore, setPendingRestore] = useState<AppData | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [confirmingSample, setConfirmingSample] = useState(false)

  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    downloadBlob(blob, `po-self-assessment-backup-${todayISO()}.json`)
  }

  async function pickJson(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const parsed = parseAppData(JSON.parse(await file.text()))
      if (!parsed) throw new Error('invalid')
      setPendingRestore({ ...parsed, isSample: false })
      setMessage(null)
    } catch {
      setMessage({ kind: 'error', text: t.data.importError })
    }
  }

  async function pickXlsx(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const { assessments } = await importXlsxFile(file)
      if (assessments.length) onAddAssessments(assessments)
      setMessage({ kind: assessments.length ? 'ok' : 'error', text: assessments.length ? t.data.imported(assessments.length) : t.data.importedNone })
    } catch {
      setMessage({ kind: 'error', text: t.data.importError })
    }
  }

  return (
    <>
      {message && (
        <div className={`banner ${message.kind === 'error' ? 'banner-error' : ''}`} role="status">
          <span>{message.text}</span>
        </div>
      )}

      <div className="split">
        <section className="panel">
          <h2>{t.data.importXlsxTitle}</h2>
          <p className="note">{t.data.importXlsxBody}</p>
          <div>
            <label className="btn primary file-btn">
              {t.data.importXlsx}
              <input id="import-xlsx" type="file" accept=".xlsx" onChange={pickXlsx} />
            </label>
          </div>
        </section>

        <section className="panel">
          <h2>{t.data.backupTitle}</h2>
          <p className="note">{t.data.localNote}</p>
          <div className="controls">
            <button className="btn" type="button" onClick={exportJson}>
              {t.data.exportJson}
            </button>
            <label className="btn file-btn">
              {t.data.importJson}
              <input id="import-json" type="file" accept=".json,application/json" onChange={pickJson} />
            </label>
          </div>
          {pendingRestore && (
            <div className="confirm">
              <span>{t.data.confirmRestore(pendingRestore.assessments.length)}</span>
              <div className="controls">
                <button
                  className="btn danger"
                  type="button"
                  onClick={() => {
                    onReplace(pendingRestore)
                    setPendingRestore(null)
                    setMessage({ kind: 'ok', text: t.data.restored })
                  }}
                >
                  {t.data.restore}
                </button>
                <button className="btn" type="button" onClick={() => setPendingRestore(null)}>
                  {t.data.cancel}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="split">
        <section className="panel">
          <h2>{t.data.manageTitle}</h2>
          <p className="note">{formatDate(current.date)}</p>
          {confirmingDelete ? (
            <div className="controls">
              <button
                className="btn danger"
                type="button"
                onClick={() => {
                  onDelete(current.id)
                  setConfirmingDelete(false)
                  setMessage({ kind: 'ok', text: t.data.deleted })
                }}
              >
                {t.data.confirmDelete}
              </button>
              <button className="btn" type="button" onClick={() => setConfirmingDelete(false)}>
                {t.data.cancel}
              </button>
            </div>
          ) : (
            <div>
              <button className="btn" type="button" onClick={() => setConfirmingDelete(true)}>
                {t.data.deleteAssessment}
              </button>
            </div>
          )}
        </section>
        {!data.isSample && (
          <section className="panel">
            <h2>{t.data.loadSample}</h2>
            <p className="note">{t.data.sampleNote}</p>
            {confirmingSample ? (
              <div className="controls">
                <button
                  className="btn danger"
                  type="button"
                  onClick={() => {
                    onLoadSample()
                    setConfirmingSample(false)
                  }}
                >
                  {t.data.restore}
                </button>
                <button className="btn" type="button" onClick={() => setConfirmingSample(false)}>
                  {t.data.cancel}
                </button>
              </div>
            ) : (
              <div>
                <button className="btn" type="button" onClick={() => setConfirmingSample(true)}>
                  {t.data.loadSample}
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  )
}
