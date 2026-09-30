import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Language = 'en' | 'hi'

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = window.localStorage.getItem('breakfree-language')
    return saved === 'hi' ? 'hi' : 'en'
  })

  const setLanguage = (next: Language) => {
    setLanguageState(next)
    window.localStorage.setItem('breakfree-language', next)
    document.documentElement.lang = next === 'hi' ? 'hi-IN' : 'en'
  }

  useEffect(() => {
    document.documentElement.lang = language === 'hi' ? 'hi-IN' : 'en'
  }, [language])

  const value = useMemo(() => ({ language, setLanguage }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}

export const copy = {
  nav: {
    en: { home: 'Home', next: 'Next Step', faq: 'FAQ', help: 'Help & Support', streak: 'Streak & Rewards', contact: 'Contact', crisis: 'Crisis Help', bibliography: 'Bibliography', directions: 'Directions', toggle: 'हिंदी' },
    hi: { home: 'होम', next: 'अगला कदम', faq: 'सवाल-जवाब', help: 'मदद और सहायता', streak: 'स्ट्रीक और रिवॉर्ड्स', contact: 'संपर्क', crisis: 'तुरंत मदद', bibliography: 'स्रोत', directions: 'सहायता पाने का तरीका', toggle: 'EN' },
  },
  footer: {
    en: { blurb: 'A school project made to make drug information easier to understand and help people find support.', pages: 'Pages', emergency: 'Emergency', drugHelpline: 'National Drug Helpline', icall: 'iCall TISS', emergencyServices: 'Emergency services', footerNote: 'Learn something useful. Ask for help when you need it.' },
    hi: { blurb: 'ड्रग्स से जुड़ी जानकारी को आसान भाषा में समझाने और मदद तक पहुँचने में सहायता करने के लिए बनाया गया स्कूल प्रोजेक्ट।', pages: 'पेज', emergency: 'आपातकाल', drugHelpline: 'राष्ट्रीय ड्रग हेल्पलाइन', icall: 'iCall TISS', emergencyServices: 'आपातकालीन सेवाएँ', footerNote: 'काम की जानकारी सीखें। जरूरत हो तो मदद माँगें।' },
  },
  common: {
    en: { explore: 'Explore', call: 'Tap to call →', contact: 'Contact Us →', call14446: 'Call 14446 →' },
    hi: { explore: 'देखें', call: 'कॉल करने के लिए टैप करें →', contact: 'संपर्क करें →', call14446: '14446 पर कॉल करें →' },
  },
} as const

export function tx<T extends string>(en: T, hi: string, language: Language) {
  return language === 'hi' ? hi : en
}
