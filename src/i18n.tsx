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


const hindiPhraseMap: Array<[string, string]> = [
  ['I am taking a break from this.', 'मैं इससे कुछ समय के लिए दूरी बना रहा/रही हूँ।'],
  ['Personal Plan', 'व्यक्तिगत योजना'],
  ['Personal plan', 'व्यक्तिगत योजना'],
  ['Streak & Rewards', 'लगातार प्रगति और इनाम'],
  ['Help & Support', 'मदद और सहायता'],
  ['Main Feature', 'मुख्य सुविधा'],
  ['main feature', 'मुख्य सुविधा'],
  ['main tool', 'मुख्य साधन'],
  ['Main tool', 'मुख्य साधन'],
  ['Plan built from their situation', 'उनकी स्थिति के आधार पर योजना बनी'],
  ['Plan built from your answers', 'आपके जवाबों के आधार पर योजना बनी'],
  ['YOUR PLAN', 'आपकी योजना'],
  ['START HERE', 'यहाँ से शुरू करें'],
  ['WHY YOUR PLAN LOOKS LIKE THIS', 'आपकी योजना ऐसी क्यों है'],
  ['Reset saved plan', 'सहेजी हुई योजना रीसेट करें'],
  ['Reset and build a new plan', 'रीसेट करके नई योजना बनाएँ'],
  ['Build my plan', 'मेरी योजना बनाएँ'],
  ['Build My Plan', 'मेरी योजना बनाएँ'],
  ['Build a plan', 'योजना बनाएँ'],
  ['Copy plan', 'योजना की प्रतिलिपि बनाएँ'],
  ['Copied ✓', 'प्रतिलिपि बन गई ✓'],
  ['Track progress', 'प्रगति देखें'],
  ['Find support', 'मदद ढूँढें'],
  ['Save my progress', 'मेरी प्रगति सहेजें'],
  ['Saved ✓', 'सहेजा गया ✓'],
  ['Saved on this device', 'इस डिवाइस पर सहेजा गया'],
  ['Saved locally in this browser.', 'इस ब्राउज़र में स्थानीय रूप से सहेजा गया है।'],
  ['Saved automatically on this device.', 'यह डिवाइस इसे अपने-आप सहेजता है।'],
  ['Want a plan built for you?', 'अपने लिए योजना बनवानी है?'],
  ['Tap a reward below to explore it', 'नीचे दिए इनाम को दबाकर उसे देखें'],
  ['Tap a milestone. Unlock the moment.', 'किसी पड़ाव को दबाएँ। उस उपलब्धि को देखें।'],
  ['Tap reveal to open your badge and the small challenge attached to it.', 'देखने के लिए दबाएँ, फिर अपना बैज और उससे जुड़ी छोटी चुनौती खोलें।'],
  ['Pick one. There is no score, no streak to protect, and no “wrong” answer.', 'एक चुनें। कोई अंक नहीं हैं, किसी लगातार प्रगति को बचाने की जरूरत नहीं है और कोई “गलत” जवाब नहीं है।'],
  ['Current streak', 'वर्तमान लगातार सिलसिला'],
  ['Progress to next milestone', 'अगले पड़ाव तक प्रगति'],
  ['Tap to reveal', 'देखने के लिए दबाएँ'],
  ['Reward unlocked', 'इनाम खुल गया'],
  ['Reward revealed', 'इनाम खुल गया'],
  ['REWARD REVEALED ✓', 'इनाम खुल गया ✓'],
  ['TAP TO REVEAL', 'देखने के लिए दबाएँ'],
  ['LOCKED', 'बंद'],
  ['Read the source story →', 'स्रोत कहानी पढ़ें →'],
  ['Government of India source', 'भारत सरकार का स्रोत'],
  ['Show more recovery stories', 'और रिकवरी कहानियाँ दिखाएँ'],
  ['Quick answers', 'जल्दी जवाब'],
]

const hindiWordMap: Record<string, string> = {
  plan: 'योजना', Plan: 'योजना', plans: 'योजनाएँ', Plans: 'योजनाएँ',
  support: 'सहायता', Support: 'सहायता', use: 'उपयोग', Use: 'उपयोग', using: 'उपयोग करना',
  substance: 'पदार्थ', Substance: 'पदार्थ', trigger: 'ट्रिगर', Trigger: 'ट्रिगर', triggers: 'ट्रिगर',
  pattern: 'पैटर्न', Pattern: 'पैटर्न', situation: 'स्थिति', situations: 'स्थितियाँ',
  reason: 'वजह', Reason: 'वजह', challenge: 'चुनौती', Challenge: 'चुनौती', goal: 'लक्ष्य', Goal: 'लक्ष्य',
  amount: 'मात्रा', amounts: 'मात्राएँ', duration: 'अवधि', detail: 'विवरण', details: 'विवरण',
  answer: 'जवाब', answers: 'जवाब', Answer: 'जवाब', Answers: 'जवाब', question: 'सवाल', questions: 'सवाल',
  choice: 'विकल्प', choices: 'विकल्प', option: 'विकल्प', options: 'विकल्प',
  step: 'कदम', steps: 'कदम', Step: 'कदम', next: 'अगला', Next: 'अगला', first: 'पहला', final: 'अंतिम',
  contact: 'संपर्क', Contact: 'संपर्क', help: 'मदद', Help: 'मदद', service: 'सेवा', services: 'सेवाएँ',
  resource: 'संसाधन', resources: 'संसाधन', professional: 'विशेषज्ञ', professionals: 'विशेषज्ञ', qualified: 'योग्य',
  doctor: 'डॉक्टर', Doctor: 'डॉक्टर', counsellor: 'परामर्शदाता', counsellors: 'परामर्शदाता', clinician: 'चिकित्सक', clinicians: 'चिकित्सक',
  treatment: 'उपचार', Treatment: 'उपचार', medical: 'चिकित्सकीय', guidance: 'मार्गदर्शन', rehabilitation: 'पुनर्वास',
  counselling: 'परामर्श', care: 'देखभाल', psychological: 'मनोवैज्ञानिक', appointment: 'मुलाकात', appointments: 'मुलाकातें',
  recovery: 'रिकवरी', Recovery: 'रिकवरी', impact: 'असर', Impact: 'असर', health: 'स्वास्थ्य', Health: 'स्वास्थ्य',
  physical: 'शारीरिक', mental: 'मानसिक', sleep: 'नींद', Sleep: 'नींद', work: 'काम', Work: 'काम', school: 'स्कूल', School: 'स्कूल',
  family: 'परिवार', friends: 'दोस्त', friend: 'दोस्त', people: 'लोग', person: 'व्यक्ति', party: 'पार्टी', parties: 'पार्टियाँ',
  stress: 'तनाव', Stress: 'तनाव', pressure: 'दबाव', Pressure: 'दबाव', emotions: 'भावनाएँ', emotion: 'भावना', pain: 'दर्द', Pain: 'दर्द',
  habit: 'आदत', control: 'नियंत्रण', curiosity: 'जिज्ञासा', boredom: 'ऊब', focus: 'ध्यान', energy: 'ऊर्जा', performance: 'प्रदर्शन',
  spending: 'खर्च', relationships: 'रिश्ते', relationship: 'रिश्ता', routine: 'दिनचर्या', routines: 'दिनचर्याएँ',
  urge: 'तीव्र इच्छा', urges: 'तीव्र इच्छाएँ', craving: 'तलब', cravings: 'तलब', discomfort: 'असुविधा', isolated: 'अलग-थलग',
  difficult: 'मुश्किल', Difficult: 'मुश्किल', hardest: 'सबसे कठिन', hard: 'मुश्किल', easy: 'आसान', easier: 'आसान',
  perfect: 'सही', Perfect: 'सही', simple: 'सरल', Simple: 'सरल', clear: 'स्पष्ट', Clear: 'स्पष्ट', specific: 'विशिष्ट',
  concrete: 'ठोस', Concrete: 'ठोस', practical: 'व्यावहारिक', important: 'महत्वपूर्ण', Important: 'ज़रूरी', actual: 'वास्तविक', real: 'वास्तविक', Real: 'वास्तविक',
  usual: 'आमतौर पर', current: 'वर्तमान', Current: 'वर्तमान', regular: 'नियमित', Regular: 'नियमित', rough: 'अनुमानित', Rough: 'अनुमानित',
  exact: 'सटीक', safe: 'सुरक्षित', safest: 'सबसे सुरक्षित', start: 'शुरू', Start: 'शुरू', starting: 'शुरुआत',
  changed: 'बदला', change: 'बदलाव', changing: 'बदलाव करना', stop: 'छोड़ना', stopped: 'छोड़ दिया', learn: 'सीखना',
  save: 'सहेजना', saved: 'सहेजा गया', Saved: 'सहेजा गया', reset: 'रीसेट', Reset: 'रीसेट', build: 'बनाना', Build: 'बनाना',
  browser: 'ब्राउज़र', device: 'डिवाइस', local: 'स्थानीय', locally: 'स्थानीय रूप से', automatically: 'अपने-आप',
  progress: 'प्रगति', Progress: 'प्रगति', reward: 'इनाम', rewards: 'इनाम', Reward: 'इनाम', Rewards: 'इनाम',
  streak: 'लगातार सिलसिला', Streak: 'लगातार सिलसिला', milestone: 'पड़ाव', milestones: 'पड़ाव', unlocked: 'खुला', Unlocked: 'खुला',
  unlock: 'खोलना', review: 'समीक्षा', Review: 'समीक्षा', check: 'जाँच', Check: 'जाँच',
  date: 'तारीख', days: 'दिन', day: 'दिन', weeks: 'सप्ताह', week: 'सप्ताह', nights: 'रातें', night: 'रात',
  morning: 'सुबह', evening: 'शाम', today: 'आज', tomorrow: 'कल', calendar: 'कैलेंडर', timer: 'टाइमर',
  minute: 'मिनट', minutes: 'मिनट', hour: 'घंटा', hours: 'घंटे', phone: 'फ़ोन', message: 'संदेश', messages: 'संदेश',
  conversation: 'बातचीत', event: 'कार्यक्रम', activity: 'गतिविधि', activities: 'गतिविधियाँ', window: 'समयावधि', period: 'अवधि',
  action: 'कदम', move: 'कदम', movement: 'गतिविधि', order: 'क्रम', sequence: 'क्रम', replace: 'बदलें', replacement: 'विकल्प',
  protect: 'सुरक्षित रखें', protected: 'सुरक्षित', choose: 'चुनें', chosen: 'चुना हुआ', selected: 'चयनित', available: 'उपलब्ध',
  same: 'एक ही', different: 'अलग', notice: 'ध्यान दें', noticed: 'ध्यान दिया', wait: 'इंतज़ार', waiting: 'इंतज़ार',
  solve: 'हल करें', problem: 'समस्या', underlying: 'मूल', address: 'संबोधित करें', discuss: 'चर्चा करें', discussion: 'बातचीत',
  standard: 'सामान्य', generic: 'सामान्य', useful: 'उपयोगी', vague: 'अस्पष्ट', visible: 'दिखाई देने वाला', information: 'जानकारी',
  idea: 'विचार', ideas: 'विचार', basics: 'बुनियादी बातें', basic: 'बुनियादी', topic: 'विषय', student: 'छात्र', students: 'छात्र',
  team: 'टीम', site: 'साइट', website: 'वेबसाइट', page: 'पेज', pages: 'पेज', design: 'डिज़ाइन', development: 'विकास', interaction: 'इंटरैक्शन', interactions: 'इंटरैक्शन',
  feature: 'सुविधा', features: 'सुविधाएँ', online: 'ऑनलाइन', publish: 'प्रकाशित', published: 'प्रकाशित', report: 'रिपोर्ट', expected: 'अपेक्षित', national: 'राष्ट्रीय', survey: 'सर्वेक्षण',
  government: 'सरकार', Government: 'सरकार', ministry: 'मंत्रालय', Ministry: 'मंत्रालय', official: 'आधिकारिक', source: 'स्रोत', sources: 'स्रोत',
  peer: 'समान अनुभव वाले लोग', group: 'समूह', groups: 'समूह', meeting: 'बैठक', meetings: 'बैठकें', emergency: 'आपातकाल', Emergency: 'आपातकाल', responders: 'आपातकालीन सहायता कर्मी', department: 'विभाग',
  overdose: 'ओवरडोज़', instructions: 'निर्देश', instruction: 'निर्देश', abrupt: 'अचानक', heavy: 'अधिक मात्रा में', safely: 'सुरक्षित रूप से',
  preparation: 'तैयारी', prepare: 'तैयार करें', strongest: 'सबसे मजबूत', consistency: 'नियमितता', predictable: 'निश्चित', motivation: 'प्रेरणा',
  confidence: 'आत्मविश्वास', stability: 'स्थिरता', financial: 'आर्थिक', independence: 'आत्मनिर्भरता', 'self-employed': 'स्वरोज़गार', 'self-reliance': 'आत्मनिर्भरता',
  'full-time': 'पूर्णकालिक', healthier: 'अधिक स्वस्थ', 'substance-free': 'नशा-मुक्त', sports: 'खेल', skills: 'कौशल', training: 'प्रशिक्षण', 'follow-up': 'बाद की सहायता', 'after-care': 'बाद की देखभाल',
  continued: 'जारी', journey: 'यात्रा', connection: 'जुड़ाव', trust: 'विश्वास', business: 'व्यवसाय', purpose: 'उद्देश्य', future: 'भविष्य',
  assignment: 'असाइनमेंट', mostly: 'अधिकतर', buttons: 'बटन', logic: 'तर्क', readable: 'आसानी से पढ़ने योग्य', textbook: 'पाठ्यपुस्तक', lecture: 'भाषण', guilt: 'अपराधबोध', fear: 'डर',
  parent: 'माता-पिता', adult: 'वयस्क', privacy: 'निजता', anonymous: 'गुमनाम', identifying: 'पहचान बताने वाला', names: 'नाम', addresses: 'पते',
  often: 'अक्सर', recently: 'हाल में', occasionally: 'कभी-कभी', sure: 'पक्का', unsure: 'अनिश्चित', random: 'किसी भी समय', social: 'सामाजिक',
  fitting: 'घुलने-मिलने', words: 'शब्द', word: 'शब्द', line: 'वाक्य', sentence: 'वाक्य', exit: 'निकलने का तरीका', wait: 'इंतज़ार',
  reason: 'वजह', result: 'परिणाम', results: 'परिणाम', current: 'वर्तमान', main: 'मुख्य', details: 'विवरण', personal: 'व्यक्तिगत', proper: 'उचित',
  'low-stimulation': 'कम उत्तेजना', 'wind-down': 'सोने की तैयारी', 'switch-off': 'मन शांत करना', 'support-focused': 'सहायता-केंद्रित', 'real': 'वास्तविक',
  'one-sentence': 'एक वाक्य', 'one-tap': 'एक टैप', '5-minute': '5-मिनट', '10-minute': '10-मिनट', '15-minute': '15-मिनट', '25-minute': '25-मिनट', '30-minute': '30-मिनट', '7-day': '7-दिन',
  'de-addiction': 'नशा-मुक्ति', 'de-addiction centre': 'नशा-मुक्ति केंद्र', 'drug-de-addiction': 'नशा-मुक्ति',
}

export function translateHindi(value: string) {
  if (!value) return value
  let out = value
  for (const [from, to] of hindiPhraseMap) out = out.split(from).join(to)
  const protectedNames = ['BreakFree', 'JITAI', 'Anvesh', 'Bharat', 'iCall', 'TISS', 'NIMHANS', 'Bengaluru', 'Vandrevala', 'Foundation', 'Snehi', 'IRCA', 'NAPDDR', 'ROSHANI']
  const slots: string[] = []
  for (const name of protectedNames) { out = out.split(name).join(`__BRAND_${slots.length}__`); slots.push(name) }
  for (const [from, to] of Object.entries(hindiWordMap).sort((a,b) => b[0].length - a[0].length)) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    out = out.replace(new RegExp(`(?<![A-Za-z])${escaped}(?![A-Za-z])`, 'g'), to)
  }
  slots.forEach((name, i) => { out = out.split(`__BRAND_${i}__`).join(name) })
  return out
}

export const copy = {
  nav: {
    en: { home: 'Home', plan: 'My Plan', faq: 'FAQ', help: 'Help & Support', streak: 'Streak & Rewards', crisis: 'Crisis Help', bibliography: 'Bibliography', directions: 'Directions', about: 'About Us', toggle: 'हिंदी' },
    hi: { home: 'होम', plan: 'मेरी योजना', faq: 'अक्सर पूछे जाने वाले सवाल', help: 'मदद और सहायता', streak: 'लगातार प्रगति और इनाम', crisis: 'तुरंत मदद', bibliography: 'स्रोत', directions: 'सहायता पाने का तरीका', about: 'हमारे बारे में', toggle: 'अंग्रेज़ी' },
  },
  footer: {
    en: { blurb: 'A school project made to make drug information easier to understand and help people find support.', pages: 'Pages', emergency: 'Emergency', drugHelpline: 'National Drug Helpline', icall: 'iCall TISS', emergencyServices: 'Emergency services', footerNote: 'Learn something useful. Ask for help when you need it.' },
    hi: { blurb: 'ड्रग्स से जुड़ी जानकारी को आसान भाषा में समझाने और मदद तक पहुँचने में सहायता करने के लिए बनाया गया स्कूल प्रोजेक्ट।', pages: 'पेज', emergency: 'आपातकाल', drugHelpline: 'राष्ट्रीय ड्रग हेल्पलाइन', icall: 'iCall TISS', emergencyServices: 'आपातकालीन सेवाएँ', footerNote: 'काम की जानकारी सीखें। जरूरत हो तो मदद माँगें।' },
  },
  common: {
    en: { explore: 'Explore', call: 'Tap to call →', call14446: 'Call 14446 →' },
    hi: { explore: 'देखें', call: 'कॉल करने के लिए टैप करें →', call14446: '14446 पर कॉल करें →' },
  },
} as const

export function tx<T extends string>(en: T, hi: string, language: Language) {
  return language === 'hi' ? translateHindi(hi) : en
}
