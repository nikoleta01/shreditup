'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { translations, type Lang, type Translations } from '@/lib/i18n'

type LangContextType = {
  lang: Lang
  t: Translations
  tr: (m: { sk: string; en: string }) => string
  setLang: (l: Lang) => void
}

const LangContext = createContext<LangContextType>({
  lang: 'sk',
  t: translations.sk,
  tr: (m) => m.sk,
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('sk')

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only storage read after mount, avoids hydration mismatch
    if (stored === 'sk' || stored === 'en') setLangState(stored)
  }, [])


  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LangContext.Provider
      value={{ lang, t: translations[lang], tr: (m) => m[lang], setLang }}
    >
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
