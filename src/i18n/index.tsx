import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Localized } from '../domain/skills'
import { en } from './en'
import { pt, type Dict } from './pt'

export type Locale = 'pt' | 'en'

type I18n = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: Dict
  /** Picks the current language from a { pt, en } pair. */
  l: (text: Localized) => string
  formatScore: (v: number | null | undefined) => string
  formatDate: (iso: string) => string
}

const KEY = 'po-self-assessment:locale'
const Ctx = createContext<I18n | null>(null)

function initialLocale(): Locale {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'pt' || saved === 'en') return saved
  } catch {
    // ignore
  }
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initialLocale)

  useEffect(() => {
    document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en'
    document.title = (locale === 'pt' ? pt : en).appTitle
    try {
      localStorage.setItem(KEY, locale)
    } catch {
      // ignore
    }
  }, [locale])

  const value = useMemo<I18n>(() => {
    const tag = locale === 'pt' ? 'pt-BR' : 'en-US'
    const num = new Intl.NumberFormat(tag, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    const date = new Intl.DateTimeFormat(tag, { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
    return {
      locale,
      setLocale,
      t: locale === 'pt' ? pt : en,
      l: (text) => text[locale],
      formatScore: (v) => (v === null || v === undefined ? '–' : num.format(v)),
      formatDate: (iso) => date.format(new Date(`${iso}T00:00:00Z`)),
    }
  }, [locale])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
