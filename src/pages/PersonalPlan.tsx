import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { useLanguage, tx, translateHindi } from '../i18n'

type LangText = { en: string; hi: string }
type Choice = { id: string; en: string; hi: string; hint?: string; hintHi?: string }
type Tone = 'teal' | 'purple' | 'amber' | 'red' | 'blue'

type PlanItem = {
  number: string
  timing: LangText
  title: LangText
  body: LangText
  steps: LangText[]
  action?: LangText
  tone?: Tone
}

type Answers = {
  forWho: string
  substance: string
  amount: string
  amountDetail: string
  pattern: string
  duration: string
  reason: string
  timing: string
  trigger: string
  goal: string
  challenge: string
  impact: string
  support: string
}

type SavedState = {
  answers: Answers
  step: number
  submitted: boolean
  savedAt: string
}

const STORAGE_KEY = 'breakfree-personal-plan-v4'
const TOTAL_STEPS = 12

const choices = {
  forWho: [
    { id: 'me', en: 'This is for me', hi: 'यह मेरे लिए है' },
    { id: 'someone', en: 'I am helping someone I care about', hi: 'मैं किसी अपने की मदद कर रहा/रही हूँ' },
  ],
  substance: [
    { id: 'opioids', en: 'Opioids', hi: 'ओपिओइड्स', hint: 'The plan puts qualified treatment support ahead of DIY instructions.', hintHi: 'Plan DIY instructions के बजाय qualified treatment support को पहले रखता है।' },
    { id: 'stimulants', en: 'Stimulants', hi: 'स्टिमुलेंट्स', hint: 'Routine, sleep, triggers and professional support will shape the plan.', hintHi: 'Routine, sleep, triggers और professional support plan को shape करेंगे।' },
    { id: 'cannabis', en: 'Cannabis', hi: 'कैनाबिस', hint: 'The plan will focus on routines, triggers and support.', hintHi: 'Plan routines, triggers और support पर focus करेगा।' },
    { id: 'alcohol', en: 'Alcohol', hi: 'अल्कोहल', hint: 'Regular or heavy use can make medical guidance important when changing use.', hintHi: 'Regular या heavy use में बदलाव के लिए medical guidance important हो सकती है।' },
    { id: 'sedatives', en: 'Sedatives / anti-anxiety drugs', hi: 'सेडेटिव / एंटी-एंग्जायटी दवाएँ', hint: 'Abrupt changes after regular use should be discussed with a clinician.', hintHi: 'Regular use के बाद abrupt changes clinician से discuss करने चाहिए।' },
    { id: 'nicotine', en: 'Nicotine / tobacco', hi: 'निकोटीन / तंबाकू', hint: 'The plan will focus on preparation and your strongest trigger.', hintHi: 'Plan preparation और strongest trigger पर focus करेगा।' },
    { id: 'multiple', en: 'More than one / other', hi: 'एक से अधिक / अन्य', hint: 'A professional can help make sense of the full pattern safely.', hintHi: 'Professional पूरी pattern को safely समझने में मदद कर सकता है।' },
    { id: 'prefer-not', en: 'Prefer not to say', hi: 'बताना पसंद नहीं', hint: 'That is okay. The plan stays support-focused.', hintHi: 'ठीक है। Plan support-focused रहेगा।' },
  ],
  amount: [
    { id: 'one', en: 'Usually one occasion', hi: 'आमतौर पर एक occasion' },
    { id: 'few', en: 'A few occasions / uses', hi: 'कुछ occasions / uses' },
    { id: 'several', en: 'Several / hard to keep track', hi: 'कई बार / track करना मुश्किल' },
    { id: 'varies', en: 'It changes a lot', hi: 'बहुत बदलता रहता है' },
    { id: 'prefer-not', en: 'Prefer not to say', hi: 'बताना पसंद नहीं' },
  ],
  pattern: [
    { id: 'most-days', en: 'Most days', hi: 'ज्यादातर दिन' },
    { id: 'weekly', en: 'About once a week', hi: 'लगभग हफ्ते में एक बार' },
    { id: 'occasional', en: 'Occasionally', hi: 'कभी-कभी' },
    { id: 'stopped', en: 'I have stopped recently', hi: 'मैंने हाल में रोक दिया है' },
    { id: 'unsure', en: 'I am not sure', hi: 'मुझे पक्का नहीं पता' },
  ],
  duration: [
    { id: 'under-week', en: 'Less than a week', hi: 'एक हफ्ते से कम' },
    { id: 'weeks-months', en: 'A few weeks to a few months', hi: 'कुछ हफ्तों से कुछ महीनों तक' },
    { id: 'six-months', en: 'Around 6–12 months', hi: 'लगभग 6–12 महीने' },
    { id: 'year-plus', en: 'More than a year', hi: 'एक साल से ज्यादा' },
    { id: 'unsure', en: 'I am not sure', hi: 'मुझे पक्का नहीं पता' },
  ],
  reason: [
    { id: 'stress', en: 'To handle stress or difficult emotions', hi: 'तनाव या मुश्किल emotions संभालने के लिए' },
    { id: 'escape', en: 'To escape, switch off, or feel different', hi: 'सब कुछ भूलने, switch off होने या अलग महसूस करने के लिए' },
    { id: 'sleep', en: 'For sleep or to calm down', hi: 'नींद या शांत होने के लिए' },
    { id: 'focus', en: 'For focus, energy, or performance', hi: 'focus, energy या performance के लिए' },
    { id: 'social', en: 'Because of friends, parties, or fitting in', hi: 'दोस्तों, parties या fit in होने की वजह से' },
    { id: 'pain', en: 'To cope with physical pain', hi: 'शारीरिक pain संभालने के लिए' },
    { id: 'habit', en: 'It became a habit or feels hard to control', hi: 'यह habit बन गया या control करना मुश्किल लगता है' },
    { id: 'curiosity', en: 'Curiosity or boredom', hi: 'curiosity या boredom' },
    { id: 'other', en: 'Something else / not sure', hi: 'कुछ और / पक्का नहीं पता' },
  ],
  timing: [
    { id: 'morning', en: 'Morning / before the day starts', hi: 'सुबह / दिन शुरू होने से पहले' },
    { id: 'school-work', en: 'Around school or work', hi: 'स्कूल या काम के आसपास' },
    { id: 'after-school', en: 'After school / work', hi: 'स्कूल / काम के बाद' },
    { id: 'evening', en: 'Evening / late night', hi: 'शाम / देर रात' },
    { id: 'social', en: 'Mostly with certain people', hi: 'ज्यादातर कुछ लोगों के साथ' },
    { id: 'random', en: 'It can happen at any time', hi: 'किसी भी समय हो सकता है' },
    { id: 'unsure', en: 'I am not sure', hi: 'मुझे पक्का नहीं पता' },
  ],
  trigger: [
    { id: 'friends', en: 'Certain friends, places, or parties', hi: 'कुछ दोस्त, जगहें या parties' },
    { id: 'stressful', en: 'Stress, arguments, or bad news', hi: 'stress, arguments या bad news' },
    { id: 'bored', en: 'Boredom or having nothing to do', hi: 'boredom या कुछ करने को न होना' },
    { id: 'alone', en: 'Being alone or feeling isolated', hi: 'अकेले होना या isolated महसूस करना' },
    { id: 'routine', en: 'A familiar routine or place', hi: 'कोई familiar routine या जगह' },
    { id: 'pain', en: 'Physical discomfort or pain', hi: 'physical discomfort या pain' },
    { id: 'mixed', en: 'It changes depending on the day', hi: 'हर दिन अलग होता है' },
    { id: 'unsure', en: 'I am not sure yet', hi: 'अभी पक्का नहीं पता' },
  ],
  goal: [
    { id: 'stop', en: 'I want to stop', hi: 'मैं छोड़ना चाहता/चाहती हूँ' },
    { id: 'not-sure', en: 'I am thinking about changing', hi: 'मैं बदलाव के बारे में सोच रहा/रही हूँ' },
    { id: 'started', en: 'I have already started changing', hi: 'मैं बदलाव शुरू कर चुका/चुकी हूँ' },
    { id: 'support-someone', en: 'I want to help someone else', hi: 'मैं किसी और की मदद करना चाहता/चाहती हूँ' },
  ],
  challenge: [
    { id: 'urges', en: 'Urges or cravings', hi: 'urge या craving' },
    { id: 'stress', en: 'Stress or difficult emotions', hi: 'तनाव या मुश्किल emotions' },
    { id: 'people', en: 'People, places, or routines around me', hi: 'आसपास के लोग, जगहें या routines' },
    { id: 'sleep', en: 'Sleep and daily routine', hi: 'नींद और रोज़ की routine' },
    { id: 'pressure', en: 'Family, school, or work pressure', hi: 'परिवार, स्कूल या काम का pressure' },
    { id: 'alone', en: 'Feeling alone', hi: 'अकेलापन' },
  ],
  impact: [
    { id: 'sleep', en: 'Sleep', hi: 'नींद' },
    { id: 'school-work', en: 'School / work', hi: 'स्कूल / काम' },
    { id: 'money', en: 'Money / spending', hi: 'पैसे / spending' },
    { id: 'relationships', en: 'Relationships', hi: 'relationships' },
    { id: 'health', en: 'Physical or mental health', hi: 'physical या mental health' },
    { id: 'none', en: 'Nothing obvious yet', hi: 'अभी कुछ obvious नहीं' },
    { id: 'unsure', en: 'I am not sure', hi: 'मुझे पक्का नहीं पता' },
  ],
  support: [
    { id: 'trusted', en: 'A trusted adult, friend, or family member', hi: 'भरोसेमंद बड़े, दोस्त या परिवार का सदस्य' },
    { id: 'professional', en: 'A doctor or counsellor', hi: 'डॉक्टर या काउंसलर' },
    { id: 'helpline', en: 'A helpline or support service', hi: 'हेल्पलाइन या सपोर्ट सर्विस' },
    { id: 'none', en: 'I do not have anyone yet', hi: 'अभी मेरे पास कोई नहीं है' },
  ],
}

const emptyAnswers: Answers = {
  forWho: '', substance: '', amount: '', amountDetail: '', pattern: '', duration: '', reason: '', timing: '', trigger: '', goal: '', challenge: '', impact: '', support: '',
}

const questionMeta: LangText[] = [
  { en: 'Who', hi: 'कौन' },
  { en: 'Substance', hi: 'Substance' },
  { en: 'Typical amount', hi: 'आमतौर पर कितना' },
  { en: 'Pattern', hi: 'Pattern' },
  { en: 'Duration', hi: 'अवधि' },
  { en: 'Why', hi: 'वजह' },
  { en: 'Hardest time', hi: 'मुश्किल समय' },
  { en: 'Trigger', hi: 'Trigger' },
  { en: 'Goal', hi: 'Goal' },
  { en: 'Challenge', hi: 'Challenge' },
  { en: 'Impact', hi: 'असर' },
  { en: 'Support', hi: 'Support' },
]

function L(en: string, hi: string): LangText { return { en, hi: translateHindi(hi) } }

function choiceLabel(group: Choice[], id: string, language: 'en' | 'hi') {
  const value = group.find(item => item.id === id)?.[language] ?? ''
  return language === 'hi' ? translateHindi(value) : value
}

function loadSavedState(): SavedState {
  if (typeof window === 'undefined') return { answers: emptyAnswers, step: 0, submitted: false, savedAt: '' }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { answers: emptyAnswers, step: 0, submitted: false, savedAt: '' }
    const parsed = JSON.parse(raw) as Partial<SavedState>
    return {
      answers: { ...emptyAnswers, ...(parsed.answers ?? {}) },
      step: Math.min(Math.max(Number(parsed.step ?? 0), 0), TOTAL_STEPS - 1),
      submitted: Boolean(parsed.submitted),
      savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : '',
    }
  } catch {
    return { answers: emptyAnswers, step: 0, submitted: false, savedAt: '' }
  }
}

function humanNow(iso: string, language: 'en' | 'hi') {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', { hour: 'numeric', minute: '2-digit' }).format(new Date(iso))
  } catch {
    return ''
  }
}

function buildPlan(a: Answers) {
  const items: PlanItem[] = []
  const focus: LangText[] = []
  const helping = a.forWho === 'someone'
  const substance = choiceLabel(choices.substance, a.substance, 'en')
  const pattern = choiceLabel(choices.pattern, a.pattern, 'en')
  const amount = choiceLabel(choices.amount, a.amount, 'en')
  const reason = choiceLabel(choices.reason, a.reason, 'en')
  const timing = choiceLabel(choices.timing, a.timing, 'en')
  const trigger = choiceLabel(choices.trigger, a.trigger, 'en')
  const goal = choiceLabel(choices.goal, a.goal, 'en')
  const challenge = choiceLabel(choices.challenge, a.challenge, 'en')
  const impact = choiceLabel(choices.impact, a.impact, 'en')
  const support = choiceLabel(choices.support, a.support, 'en')

  const medicalRiskSubstance = ['alcohol', 'sedatives', 'opioids', 'multiple'].includes(a.substance)
  const higherSupportSignal = a.pattern === 'most-days' || a.amount === 'several' || a.amount === 'varies' || a.duration === 'six-months' || a.duration === 'year-plus'

  const focusPairs: Array<[string, string]> = [
    ['Substance', substance], ['Typical amount', amount], ['Pattern', pattern], ['Duration', choiceLabel(choices.duration, a.duration, 'en')],
    ['Why', reason], ['Hardest time', timing], ['Trigger', trigger], ['Goal', goal], ['Challenge', challenge], ['Impact', impact], ['Support', support],
  ]
  focusPairs.forEach(([label, value]) => { if (value) focus.push(L(`${label}: ${value}`, `${label}: ${value}`)) })
  if (a.amountDetail.trim()) focus.push(L('You added a rough amount note for your own record.', 'आपने अपने record के लिए rough amount note जोड़ा है।'))

  // 01 — first move: personalised to substance, goal, pattern, duration and support.
  if (helping) {
    items.push({
      number: '01', timing: L('TODAY', 'आज'), tone: 'blue',
      title: L(`Start with the kind of help ${substance || 'they'} need`, `${substance || 'उन्हें'} किस तरह की मदद चाहिए, वहीं से शुरू करें`),
      body: L(`You are helping someone else, so your first job is not to run the recovery for them. Your answers point to ${pattern || 'their current pattern'} and a goal of ${goal.toLowerCase() || 'change'}.`, `आप किसी और की मदद कर रहे हैं, इसलिए पूरी recovery अपने हाथ में लेना goal नहीं है। आपके answers ${pattern || 'current pattern'} और ${goal.toLowerCase() || 'change'} की ओर इशारा करते हैं।`),
      steps: [
        L('Pick a calm time and ask what kind of help they are actually ready to accept.', 'शांत समय चुनें और पूछें कि वे किस तरह की मदद लेने के लिए तैयार हैं।'),
        L(`Use the exact details from this plan: ${timing.toLowerCase() || 'their hardest time'} and ${trigger.toLowerCase() || 'their main trigger'}.`, `Plan की exact details use करें: ${timing || 'उनका मुश्किल समय'} और ${trigger || 'उनका main trigger'}।`),
        L(a.support === 'professional' || a.support === 'helpline' ? 'Help them make the support contact rather than promising to manage it yourself.' : 'Agree on one check-in this week and keep the responsibility with the person changing their use.', a.support === 'professional' || a.support === 'helpline' ? 'Support contact बनाने में मदद करें, लेकिन खुद पूरी situation manage करने का promise न करें।' : 'इस हफ्ते एक check-in तय करें और responsibility उसी person के पास रखें जो change कर रहा है।'),
      ],
      action: L('Say: “I am not here to judge you. I am here to help with the next step you choose.”', 'कहें: “मैं judge करने नहीं आया/आई। मैं उस next step में मदद करना चाहता/चाहती हूँ जो तुम choose करो।”'),
    })
  } else if (medicalRiskSubstance && (higherSupportSignal || a.substance === 'opioids')) {
    items.push({
      number: '01', timing: L('FIRST MOVE', 'पहला कदम'), tone: 'amber',
      title: L(`Make a professional plan before making a big change to ${substance.toLowerCase()}`, `${substance} में बड़ा बदलाव करने से पहले professional plan बनाएं`),
      body: L(`Your answers show ${pattern.toLowerCase() || 'a current pattern'}, ${amount.toLowerCase() || 'a reported amount pattern'} and ${choiceLabel(choices.duration, a.duration, 'en').toLowerCase() || 'a duration you reported'}. For this substance, especially with regular or longer-term use, a clinician should guide major changes.`, `आपके answers में ${pattern.toLowerCase() || 'current pattern'}, ${amount.toLowerCase() || 'amount pattern'} और ${choiceLabel(choices.duration, a.duration, 'hi').toLowerCase() || 'आपकी बताई duration'} है। इस substance में, खासकर regular या longer-term use के साथ, बड़े बदलाव clinician guide करें।`),
      steps: [
        L('Write down the substance, your usual amount pattern, how often it happens and how long it has been going on.', 'Substance, usual amount pattern, कितनी बार और कब से चल रहा है — ये चार चीज़ें लिखें।'),
        L('Show those details to a doctor, counsellor or qualified treatment service and ask what the safest next step is for your situation.', 'ये details doctor, counsellor या qualified treatment service को दिखाकर पूछें कि आपकी situation में safest next step क्या है।'),
        L('Do not use this website to calculate a taper, detox or medication change. Let a professional build that part.', 'Website से taper, detox या medication change calculate न करें। वह हिस्सा professional के साथ तय करें।'),
      ],
      action: L('Concrete move: make the support contact before changing the routine on your own.', 'Concrete move: routine खुद बदलने से पहले support contact बनाएं।'),
    })
  } else if (a.substance === 'nicotine' && a.goal === 'stop') {
    items.push({
      number: '01', timing: L('TODAY', 'आज'), tone: 'teal',
      title: L('Pick a quit date and protect it', 'Quit date चुनें और उसे protect करें'),
      body: L(`Because you chose nicotine, want to stop, and described ${pattern.toLowerCase() || 'your recent pattern'}, this plan starts with a date rather than a vague promise.`, `आपने nicotine चुना, stop करना चुना और ${pattern.toLowerCase() || 'अपना recent pattern'} बताया। इसलिए plan vague promise के बजाय एक date से शुरू होता है।`),
      steps: [
        L('Choose one date within the next 7 days and put it in your phone calendar.', 'अगले 7 दिनों में एक date चुनें और phone calendar में डालें।'),
        L(`Write your hardest window — ${timing.toLowerCase() || 'your hardest time'} — directly under that date.`, `अपना hardest window — ${timing.toLowerCase() || 'मुश्किल समय'} — उसी date के नीचे लिखें।`),
        L('Before that date, clear the products or reminders from the places where you usually use.', 'उस date से पहले उन जगहों से products या reminders हटाएँ जहाँ आप आमतौर पर use करते हैं।'),
      ],
      action: L('Concrete move: set the date before leaving this page.', 'Concrete move: page छोड़ने से पहले date set करें।'),
    })
  } else {
    items.push({
      number: '01', timing: L('TODAY', 'आज'), tone: 'teal',
      title: L('Turn your goal into one protected action', 'अपने goal को एक protected action में बदलें'),
      body: L(`You chose ${goal.toLowerCase() || 'change'}. Your first step is built around the pattern you reported: ${pattern.toLowerCase() || 'not sure yet'}, with ${choiceLabel(choices.duration, a.duration, 'en').toLowerCase() || 'an unclear duration'}.`, `आपने ${goal.toLowerCase() || 'change'} चुना। पहला step आपके pattern ${choiceLabel(choices.pattern, a.pattern, 'hi').toLowerCase() || 'not sure'} और duration ${choiceLabel(choices.duration, a.duration, 'hi').toLowerCase() || 'unclear'} के हिसाब से बना है।`),
      steps: [
        L(`Choose the next 24-hour action that matches your goal: ${a.goal === 'started' ? 'protect the change you already made' : 'prepare for your first change day'}.`, `अगले 24 घंटे का action goal से match करें: ${a.goal === 'started' ? 'जो change शुरू हो चुका है उसे protect करें' : 'पहले change day की तैयारी करें'}।`),
        L(`Put your hardest window — ${timing.toLowerCase() || 'the time you picked'} — into your calendar as a protected planning block.`, `आपके hardest window — ${timing.toLowerCase() || 'चुना हुआ समय'} — को calendar में planning block बनाएं।`),
        L(a.support === 'none' ? 'Use the Help & Support page to choose one professional or service contact.' : 'Set one support check-in during the week you described, not only after things get difficult.', a.support === 'none' ? 'Help & Support page से एक professional या service contact चुनें।' : 'आपके बताए week में एक support check-in तय करें — सिर्फ problem बढ़ने के बाद नहीं।'),
      ],
      action: L('Concrete move: finish one small setup task today, then stop. The point is to make tomorrow easier.', 'Concrete move: आज एक छोटा setup task पूरा करें, फिर stop करें। Goal है कल को आसान बनाना।'),
    })
  }

  // 02 — exact hardest window + trigger.
  const timingLine = timing || 'your hardest time'
  const triggerLine = trigger || 'your main trigger'
  const triggerSteps: Record<string, LangText[]> = {
    friends: [
      L('Before the situation, save one line: “I am taking a break from this.”', 'Situation से पहले एक line save करें: “I am taking a break from this.”'),
      L('Choose your exit before you arrive: a different room, a ride home, or another safe place.', 'पहले से exit तय करें: दूसरी room, घर जाने का तरीका या दूसरी safe जगह।'),
      L('Message your support person when you leave the trigger, not only if the urge becomes intense.', 'Trigger से निकलते ही support person को message करें, सिर्फ urge intense होने पर नहीं।'),
    ],
    stressful: [
      L('When the argument, bad news or stress starts, step away from the immediate situation for 10 minutes.', 'Argument, bad news या stress शुरू होते ही 10 मिनट के लिए immediate situation से दूर जाएँ।'),
      L('Start your chosen 10-minute reset: slow breathing, a shower, a walk, music or writing.', 'अपना 10-minute reset शुरू करें: slow breathing, shower, walk, music या writing।'),
      L('After 10 minutes, contact the person or service you chose instead of returning straight to the old routine.', '10 मिनट बाद चुने person या service को contact करें, सीधे पुरानी routine में वापस न जाएँ।'),
    ],
    bored: [
      L('Choose a 30-minute activity before the boring window starts and put it in your calendar.', 'Boring window शुरू होने से पहले 30-minute activity चुनें और calendar में डालें।'),
      L('Start it immediately when the window arrives — do not wait until you feel motivated.', 'Window आते ही activity शुरू करें — motivation का wait न करें।'),
      L('When 30 minutes ends, check your urge and decide the next safe activity or support contact.', '30 मिनट बाद urge check करें और next safe activity या support contact तय करें।'),
    ],
    alone: [
      L('Move to a shared, safe place before the difficult period begins.', 'Difficult period शुरू होने से पहले किसी shared, safe place पर जाएँ।'),
      L('Send your support person one simple message so the contact happens before the urge peaks.', 'Urge peak होने से पहले support person को एक simple message भेजें।'),
      L('If no person is available, use the Help & Support option on BreakFree rather than staying isolated.', 'अगर कोई person available नहीं है, तो isolated रहने के बजाय BreakFree का Help & Support option use करें।'),
    ],
    routine: [
      L('Change one part of the routine that usually leads into use: place, route, order or activity.', 'Routine का एक हिस्सा बदलें: place, route, order या activity।'),
      L(`Make the replacement happen specifically at ${timingLine.toLowerCase()}.`, `${timingLine} पर replacement specifically करें।`),
      L('Repeat the same change for 7 days so the new routine becomes easier to remember.', 'इसी change को 7 दिन repeat करें ताकि नई routine याद रखना आसान हो।'),
    ],
    pain: [
      L('Write when the discomfort is worst and what you were doing at that time.', 'Discomfort कब worst है और उस समय आप क्या कर रहे थे, लिखें।'),
      L('Bring that note to a doctor or counsellor and explain that pain is part of your use pattern.', 'यह note doctor या counsellor को दिखाकर बताएं कि pain use pattern का हिस्सा है।'),
      L('Ask for one plan that addresses the pain and the substance use together.', 'ऐसा plan माँगें जो pain और substance use दोनों को साथ address करे।'),
    ],
    mixed: [
      L('Pick the trigger you notice most often and use that as your first “if this happens, then…” rule.', 'जो trigger सबसे ज्यादा notice होता है, उसे first “अगर यह हुआ, तो…” rule बनाएं।'),
      L('Write the rule in one sentence and keep it on your phone.', 'Rule एक sentence में लिखें और phone में रखें।'),
      L('Review the rule after 7 days and change only the part that did not work.', '7 दिन बाद rule review करें और सिर्फ वही हिस्सा बदलें जो काम नहीं किया।'),
    ],
  }
  const triggerKey = trigger && triggerSteps[ a.trigger ] ? a.trigger : 'mixed'
  items.push({
    number: '02', timing: L('AT THE HARD PART', 'मुश्किल समय पर'), tone: 'purple',
    title: L(`Your ${timingLine.toLowerCase()} plan for ${triggerLine.toLowerCase()}`, `${timingLine} के लिए ${triggerLine.toLowerCase()} plan`),
    body: L(`Instead of “stay away,” this gives you a sequence to follow at the exact time and trigger you picked.`, `“दूर रहो” जैसी vague advice के बजाय, यह आपके चुने time और trigger के लिए एक sequence देता है।`),
    steps: triggerSteps[triggerKey],
    action: L(`Set one reminder 30 minutes before ${timingLine.toLowerCase()}: “BreakFree plan — ${triggerLine.toLowerCase()}.”`, `${timingLine} से 30 मिनट पहले reminder लगाएँ: “BreakFree plan — ${triggerLine}.”`),
  })

  // 03 — the reason changes the replacement.
  const reasonPlans: Record<string, { title: LangText; body: LangText; steps: LangText[]; action: LangText; tone: Tone }> = {
    stress: {
      title: L('Replace the stress response', 'Stress response को replace करें'),
      body: L('You said stress or difficult emotions are part of why you use. The plan therefore gives that moment a ready-made 10-minute response.', 'आपने stress या difficult emotions को reason बताया। इसलिए उस moment के लिए ready-made 10-minute response रखा गया है।'),
      steps: [L('Name the feeling in one word: stressed, angry, overwhelmed, or low.', 'Feeling को एक word में name करें: stressed, angry, overwhelmed या low।'), L('Do one 10-minute reset and stay with it until the timer ends.', 'एक 10-minute reset करें और timer खत्म होने तक उसी में रहें।'), L('After 10 minutes, use your chosen support contact if the difficult feeling is still pushing you toward use.', '10 मिनट बाद भी feeling use की ओर push करे तो chosen support contact use करें।')],
      action: L('Phone note: “When stress spikes → 10 minutes away → reset → support.”', 'Phone note: “Stress बढ़े → 10 minutes दूर → reset → support.”'), tone: 'amber',
    },
    escape: {
      title: L('Build a real “switch-off” option', 'Real “switch-off” option बनाएं'),
      body: L('You are looking for an escape or a different feeling. Your replacement needs to start quickly and have a clear end.', 'आप escape या अलग feeling चाहते हैं। Replacement जल्दी शुरू हो और उसका clear end हो।'),
      steps: [L('Pick one 15-minute activity you genuinely like and can start without preparation.', 'एक 15-minute activity चुनें जो आपको सच में पसंद हो और बिना preparation शुरू हो सके।'), L(`Start it during ${timingLine.toLowerCase()}, before the trigger has had time to build.` , `${timingLine} में उसे शुरू करें, trigger build होने से पहले।`), L('When it ends, choose the next safe step: stay with the activity, contact support, or leave the trigger.', 'Activity खत्म होने पर next safe step चुनें: activity continue, support contact या trigger से निकलना।')],
      action: L('Make a one-tap phone shortcut to your “switch-off” activity.', 'अपनी “switch-off” activity के लिए one-tap phone shortcut बनाएं।'), tone: 'amber',
    },
    sleep: {
      title: L('Separate sleep from the substance', 'Sleep को substance से अलग करें'),
      body: L('You picked sleep or calming down as a reason. The plan treats the sleep problem as something worth discussing, not something to solve with drug-use instructions.', 'आपने sleep या calming down को reason चुना। Plan sleep problem को support conversation का हिस्सा बनाता है, drug-use instructions का नहीं।'),
      steps: [L('Pick a fixed 30-minute wind-down start time for the next 7 nights.', 'अगली 7 nights के लिए fixed 30-minute wind-down start time चुनें।'), L('Use the same order each night: lower lights, phone away, quiet activity, bed.', 'हर night same order रखें: lights कम, phone दूर, quiet activity, bed।'), L('Tell a doctor or counsellor that sleep is part of why you use so the underlying problem is addressed.', 'Doctor या counsellor को बताएं कि sleep use की वजह है ताकि underlying problem address हो।')],
      action: L('Concrete move: choose tonight’s wind-down start time now.', 'Concrete move: आज रात का wind-down start time अभी चुनें।'), tone: 'blue',
    },
    focus: {
      title: L('Solve the performance problem separately', 'Performance problem को अलग solve करें'),
      body: L('You connected use with focus, energy or performance. The plan tackles the actual performance problem instead of making the substance part of the solution.', 'आपने use को focus, energy या performance से जोड़ा। Plan actual performance problem को अलग address करता है।'),
      steps: [L('Write the exact problem: starting work, staying awake, concentrating, finishing, or confidence.', 'Exact problem लिखें: work start करना, awake रहना, concentrate करना, finish करना या confidence।'), L('Run one 25-minute work block with a 5-minute movement break, then repeat once if needed.', 'एक 25-minute work block करें, फिर 5-minute movement break लें; जरूरत हो तो एक बार repeat करें।'), L('If the performance problem keeps pushing you toward use, bring that exact problem to a doctor, counsellor or school/work support person.', 'Performance problem बार-बार use की ओर push करे तो उसे doctor, counsellor या school/work support person को बताएं।')],
      action: L('Concrete move: write the one-sentence performance problem before the next work block.', 'Concrete move: अगले work block से पहले one-sentence performance problem लिखें।'), tone: 'blue',
    },
    social: {
      title: L('Plan for the pressure, not just the substance', 'Substance ही नहीं, pressure का plan बनाएं'),
      body: L('Your answer points to friends, parties or fitting in. A concrete exit is more useful than a promise to “be stronger.”', 'आपके answer में friends, parties या fitting in आया। “Strong रहो” कहने के बजाय concrete exit ज्यादा useful है।'),
      steps: [L('Save one line you can repeat without explaining yourself: “I am taking a break from this.”', 'एक line save करें: “I am taking a break from this.”'), L('Choose your exit before the event: who you will leave with, where you will go, and who you will message.', 'Event से पहले exit तय करें: किसके साथ निकलेंगे, कहाँ जाएंगे और किसे message करेंगे।'), L('Use the line once; if pressure continues, leave instead of debating.', 'Line एक बार कहें; pressure जारी रहे तो debate करने के बजाय निकलें।')],
      action: L('Put the sentence + exit contact in a note called “Social plan.”', 'Sentence + exit contact को “Social plan” नाम की note में रखें।'), tone: 'purple',
    },
    pain: {
      title: L('Put the pain into the treatment conversation', 'Pain को treatment conversation में लाएं'),
      body: L('Because pain is part of the reason, a plan that only says “stop” misses the problem you are trying to solve.', 'Pain reason का हिस्सा है, इसलिए सिर्फ “stop” कहना उस problem को miss करता है जिसे आप solve करने की कोशिश कर रहे हैं।'),
      steps: [L('Write where the pain is and when it is worst.', 'Pain कहाँ है और कब worst होता है, लिखें।'), L('Make one appointment or support contact and say that pain is part of your use pattern.', 'एक appointment या support contact बनाएं और बताएं कि pain use pattern का हिस्सा है।'), L('Ask for a plan that deals with both the pain and substance use.', 'ऐसा plan माँगें जो pain और substance use दोनों को address करे।')],
      action: L('Concrete move: book the appointment or ask someone to sit with you while you make it.', 'Concrete move: appointment book करें या किसी trusted person को साथ बैठाकर यह करें।'), tone: 'amber',
    },
    habit: {
      title: L('Break one link in the habit chain', 'Habit chain की एक link तोड़ें'),
      body: L('You said it feels habitual or hard to control. That makes the routine around the use as important as the intention to change.', 'आपने बताया कि यह habitual है या control करना मुश्किल है। इसलिए routine का एक हिस्सा change करना important है।'),
      steps: [L(`Pick the first routine step that happens before ${triggerLine.toLowerCase()}.`, `${triggerLine} से पहले होने वाला पहला routine step चुनें।`), L('Change only that link for 7 days — a different place, route, activity or person.', '7 दिनों के लिए सिर्फ वही link बदलें — अलग place, route, activity या person।'), L('Mark each day you completed the new routine so you can see whether the cue is weakening.', 'हर दिन नई routine complete होने पर mark करें ताकि cue के बदलने का पता चले।')],
      action: L('Concrete move: write “Old link → New link” in your phone notes.', 'Concrete move: phone में “Old link → New link” लिखें।'), tone: 'purple',
    },
    curiosity: {
      title: L('Give boredom or curiosity somewhere else to go', 'Boredom या curiosity को दूसरी जगह दें'),
      body: L('You said boredom or curiosity plays a role, so the plan gives you a ready activity before that moment arrives.', 'आपने boredom या curiosity को reason बताया, इसलिए plan उस moment से पहले ready activity देता है।'),
      steps: [L('Choose three activities that each take 10–30 minutes.', 'तीन activities चुनें जो 10–30 minutes की हों।'), L(`Put one of them directly into your ${timingLine.toLowerCase()} window.`, `${timingLine} window में इनमें से एक activity directly डालें।`), L('When the urge to experiment appears, start the activity first and revisit the decision later.', 'Experiment करने का urge आए तो पहले activity शुरू करें और decision बाद में revisit करें।')],
      action: L('Keep the three activities in one phone note called “Instead.”', 'तीनों activities को “Instead” नाम की phone note में रखें।'), tone: 'teal',
    },
    other: {
      title: L('Give the real reason a place in the plan', 'Real reason को plan में जगह दें'),
      body: L('You did not choose a standard reason, so the safest useful move is to write your own reason in plain words and make the next step match it.', 'आपने standard reason नहीं चुना। इसलिए useful move है अपनी reason को simple words में लिखना और next step को उसी से match करना।'),
      steps: [L('Finish this sentence: “I reach for it when I need ____.”', 'यह sentence पूरा करें: “जब मुझे ____ चाहिए होता है, तब मैं use की ओर जाता/जाती हूँ।”'), L('Pick one safe way to get that need met without using.', 'उस need को बिना use किए पूरा करने का एक safe तरीका चुनें।'), L('Bring the sentence to a professional if you are unsure what the underlying problem is.', 'Underlying problem clear न हो तो यह sentence professional को दिखाएं।')],
      action: L('Concrete move: write your one-sentence reason before the next trigger.', 'Concrete move: अगले trigger से पहले one-sentence reason लिखें।'), tone: 'blue',
    },
  }
  const r = reasonPlans[a.reason] ?? reasonPlans.other
  items.push({ number: '03', timing: L('WHY IT HAPPENS', 'क्यों होता है'), title: r.title, body: r.body, steps: r.steps, action: r.action, tone: r.tone })

  // 04 — challenge branch.
  const challengePlans: Record<string, PlanItem> = {
    urges: {
      number: '04', timing: L('WHEN THE URGE HITS', 'जब urge आए'), tone: 'purple',
      title: L('Use a 10-minute urge protocol', '10-minute urge protocol use करें'),
      body: L(`Your biggest challenge is urges/cravings, so the plan gives you a sequence instead of a motivational sentence.`, `आपकी biggest challenge urge/craving है, इसलिए plan motivation के बजाय sequence देता है।`),
      steps: [L('Start a 10-minute timer and move away from the place or people linked to the trigger.', '10-minute timer लगाएं और trigger से जुड़ी जगह या लोगों से दूर जाएँ।'), L('Use the replacement you chose for your reason: reset, activity, social exit, or support.', 'Reason के लिए चुना replacement use करें: reset, activity, social exit या support।'), L('When the timer ends, check the urge again and use your support contact if it is still pushing you toward use.', 'Timer खत्म होने पर urge फिर check करें; अभी भी use की ओर push करे तो support contact use करें।')],
    },
    stress: {
      number: '04', timing: L('WHEN PRESSURE BUILDS', 'जब pressure बढ़े'), tone: 'amber',
      title: L('Catch the stress earlier', 'Stress को पहले catch करें'),
      body: L(`Your challenge is stress, and your main trigger is ${trigger.toLowerCase() || 'still unclear'}. The plan moves your response earlier.`, `आपकी challenge stress है और main trigger ${trigger.toLowerCase() || 'अभी unclear'} है। Plan response को पहले शुरू करता है।`),
      steps: [L('Notice the first sign: raised voice, racing thoughts, tight chest, irritability, or shutting down.', 'First sign notice करें: raised voice, racing thoughts, tight chest, irritability या shutting down।'), L('Leave the immediate trigger for 10 minutes and do your reset.', 'Immediate trigger से 10 मिनट दूर जाएँ और reset करें।'), L('Return only after the 10 minutes are over; if the feeling is still too strong, use support instead.', '10 मिनट पूरे होने के बाद ही वापस आएँ; feeling बहुत strong हो तो support use करें।')],
    },
    people: {
      number: '04', timing: L('AROUND PEOPLE', 'लोगों के बीच'), tone: 'purple',
      title: L('Make a people plan', 'People plan बनाएं'),
      body: L(`Your biggest challenge is the people/place/routine around you, so the plan gives you an exit and a backup.`, `आपकी biggest challenge आसपास के people/place/routine हैं, इसलिए plan exit और backup देता है।`),
      steps: [L('Choose one person you can leave with or call.', 'एक person चुनें जिसके साथ निकल सकें या जिसे call कर सकें।'), L('Decide the sentence you will use before pressure starts.', 'Pressure शुरू होने से पहले sentence तय करें।'), L('If the pressure stays high, leave the situation rather than trying to win the argument.', 'Pressure high रहे तो argument जीतने की कोशिश के बजाय situation छोड़ दें।')],
    },
    sleep: {
      number: '04', timing: L('DAILY ROUTINE', 'रोज़ की routine'), tone: 'blue',
      title: L('Make sleep predictable', 'Sleep को predictable बनाएं'),
      body: L('Your challenge is sleep/routine, so consistency matters more than trying a new solution every night.', 'आपकी challenge sleep/routine है, इसलिए हर night नया solution try करने के बजाय consistency important है।'),
      steps: [L('Use the same wind-down start time for 7 nights.', '7 nights तक same wind-down start time रखें।'), L('Keep the final 30 minutes low-stimulation and repeat the same order.', 'आखिरी 30 minutes low-stimulation रखें और same order repeat करें।'), L('If sleep remains a major reason for use, bring that exact problem to professional support.', 'Sleep use की major reason बनी रहे तो exact problem professional support को बताएं।')],
    },
    pressure: {
      number: '04', timing: L('PRESSURE MOMENT', 'Pressure moment'), tone: 'amber',
      title: L('Shrink the pressure into one next task', 'Pressure को एक next task में छोटा करें'),
      body: L('You picked family, school or work pressure. A smaller next task is easier to act on than trying to fix everything at once.', 'आपने family, school या work pressure चुना। एक छोटा next task एक साथ सब fix करने से easier होता है।'),
      steps: [L('Write the one task creating the most pressure right now.', 'अभी सबसे ज्यादा pressure देने वाला one task लिखें।'), L('Set a 15-minute timer and work only on the first part.', '15-minute timer लगाएं और सिर्फ first part पर काम करें।'), L('After 15 minutes, take a 5-minute break and decide whether to repeat or ask for help.', '15 मिनट बाद 5-minute break लें और repeat या help लेने का फैसला करें।')],
    },
    alone: {
      number: '04', timing: L('WHEN YOU FEEL ALONE', 'जब अकेला महसूस हो'), tone: 'teal',
      title: L('Move toward contact before the urge peaks', 'Urge peak होने से पहले contact की ओर जाएँ'),
      body: L('Your challenge is feeling alone. This plan makes contact a scheduled action, not a last resort.', 'आपकी challenge अकेलापन है। Plan contact को last resort नहीं, scheduled action बनाता है।'),
      steps: [L('Choose one safe person or service and save the contact.', 'एक safe person या service चुनकर contact save करें।'), L(`Schedule the check-in around ${timingLine.toLowerCase()}.`, `${timingLine} के आसपास check-in schedule करें।`), L('When the difficult period starts, make the contact before you are overwhelmed.', 'Difficult period शुरू होते ही contact करें, overwhelmed होने का wait न करें।')],
    },
  }
  items.push(challengePlans[a.challenge] ?? {
    number: '04', timing: L('YOUR CHALLENGE', 'आपकी challenge'), tone: 'blue',
    title: L('Make the hardest part specific', 'सबसे मुश्किल हिस्से को specific बनाएं'),
    body: L('You have not picked a standard challenge, so use the part of your answers you trust most and make one if-then rule.', 'आपने standard challenge नहीं चुना, इसलिए अपने सबसे clear answer से one if-then rule बनाएं।'),
    steps: [L(`Write: “If ${triggerLine.toLowerCase()} happens at ${timingLine.toLowerCase()}, then I will leave the trigger and start my replacement.”`, `लिखें: “अगर ${triggerLine.toLowerCase()} ${timingLine.toLowerCase()} पर हुआ, तो मैं trigger से हटकर replacement शुरू करूँगा/करूँगी।”`), L('Put that sentence somewhere you will see before the difficult window.', 'Sentence को ऐसी जगह रखें जहाँ difficult window से पहले दिखे।'), L('Review it after a week and keep the version that was easiest to follow.', 'एक हफ्ते बाद review करें और जो version सबसे easy था वही रखें।')],
  })

  // 05 — impact branch.
  const impactPlans: Record<string, PlanItem> = {
    sleep: { number: '05', timing: L('PROTECT SLEEP', 'SLEEP बचाएँ'), tone: 'blue', title: L('Measure the part of sleep you want back', 'Sleep के उस हिस्से को measure करें जिसे आप वापस चाहते हैं'), body: L('You said sleep is where you feel the impact. The plan makes that visible without asking for perfect tracking.', 'आपने कहा कि असर sleep पर है। Plan इसे simple तरीके से visible बनाता है।'), steps: [L('For 7 days, note the time you start your wind-down and the time you get into bed.', '7 days तक wind-down start और bed time note करें।'), L('Circle the nights where your chosen trigger happened.', 'जिन nights पर chosen trigger हुआ उन्हें circle करें।'), L('Bring the pattern to your support person or clinician rather than guessing what is causing it.', 'Pattern support person या clinician को दिखाएं, खुद cause guess न करें।')] },
    'school-work': { number: '05', timing: L('PROTECT YOUR DAY', 'दिन protect करें'), tone: 'teal', title: L('Protect one reliable school/work block', 'एक reliable school/work block protect करें'), body: L('You said school or work is taking the hit. One protected block gives you a measurable win without expecting a perfect day.', 'आपने कहा कि school या work पर असर है। एक protected block measurable win देता है।'), steps: [L('Choose one 25-minute block you can protect each day.', 'हर दिन एक 25-minute block चुनें।'), L('Start it during the time of day when you are least likely to be pulled into the trigger.', 'ऐसा time चुनें जब trigger में जाने की संभावना कम हो।'), L('After the block, mark whether you completed it — not how productive you felt.', 'Block के बाद सिर्फ completed mark करें — productivity judge न करें।')] },
    money: { number: '05', timing: L('REDUCE THE DAMAGE', 'असर कम करें'), tone: 'amber', title: L('Make the money impact visible', 'Money impact को visible बनाएं'), body: L('You said money/spending is being affected. You do not need perfect accounting — you need a clear picture you can act on.', 'आपने कहा कि पैसे/spending पर असर है। Perfect accounting नहीं, clear picture चाहिए।'), steps: [L('For the next 7 days, write down the spending pressure you notice in simple terms.', 'अगले 7 days spending pressure simple words में note करें।'), L('At the end of the week, circle one area you want help changing.', 'हफ्ते के end पर एक area circle करें जिसे बदलने में help चाहिए।'), L('Bring that one area into your support conversation instead of keeping it vague.', 'उस one area को support conversation में रखें, vague न छोड़ें।')] },
    relationships: { number: '05', timing: L('REPAIR ONE THING', 'एक चीज़ repair करें'), tone: 'purple', title: L('Choose one relationship to protect', 'एक relationship को protect करें'), body: L('You said relationships are being affected. You only need one repair action at a time.', 'आपने कहा कि relationships पर असर है। एक समय में एक repair action काफी है।'), steps: [L('Pick one person who matters and choose a calm moment to speak.', 'एक important person चुनें और calm moment चुनें।'), L('Use one honest sentence about what you are trying to change.', 'जो change करना चाहते हैं उसके बारे में एक honest sentence कहें।'), L('Ask what one practical boundary or check-in would make this week easier.', 'पूछें कि एक practical boundary या check-in इस week को easier बना सकता है।')] },
    health: { number: '05', timing: L('HEALTH CHECK', 'HEALTH CHECK'), tone: 'amber', title: L('Put the health impact in front of a professional', 'Health impact को professional तक ले जाएँ'), body: L('You selected physical or mental health as the part being affected. That deserves direct support, not a guess from a website.', 'आपने physical या mental health को affected part चुना। यह direct support deserve करता है।'), steps: [L('Write the main health issue in one sentence.', 'Main health issue एक sentence में लिखें।'), L('Tell a doctor or counsellor that substance use is part of the picture.', 'Doctor या counsellor को बताएं कि substance use picture का हिस्सा है।'), L('Ask what support should happen first and what needs follow-up.', 'पूछें कि पहले कौन सा support चाहिए और follow-up क्या होगा।')] },
    none: { number: '05', timing: L('KEEP IT EARLY', 'जल्दी act करें'), tone: 'teal', title: L('Use the fact that you caught it early', 'आपने जल्दी notice किया — इसका use करें'), body: L('You have not noticed a clear life impact yet. That makes this a good moment to build a plan before the problem gets bigger.', 'आपने अभी clear life impact notice नहीं किया। यह plan जल्दी बनाने का अच्छा moment है।'), steps: [L('Pick one area you want to protect: sleep, school/work, relationships, health or routine.', 'एक area चुनें जिसे protect करना है: sleep, school/work, relationships, health या routine।'), L('Write one sign that would tell you the situation is getting worse.', 'एक sign लिखें जो बताए कि situation worse हो रही है।'), L('Review that sign after 7 days rather than waiting for a crisis.', 'Crisis का wait करने के बजाय 7 days बाद sign review करें।')] },
    unsure: { number: '05', timing: L('FIND THE SIGNAL', 'SIGNAL देखें'), tone: 'blue', title: L('Find what is changing first', 'पहले देखें क्या बदल रहा है'), body: L('You are not sure about the impact yet. The plan uses a short observation window instead of guessing.', 'आप impact को लेकर sure नहीं हैं। Plan guessing के बजाय short observation window use करता है।'), steps: [L('For 7 days, note one thing each day that was easier or harder because of the pattern you described.', '7 days तक रोज़ एक thing note करें जो pattern की वजह से easy या harder लगी।'), L('Look for the area that repeats most.', 'जो area सबसे ज्यादा repeat हो उसे देखें।'), L('Bring that area into the next support conversation.', 'उस area को next support conversation में रखें।')] },
  }
  items.push(impactPlans[a.impact] ?? impactPlans.unsure)

  // 06 — amount/pattern/duration as a tracking and support intensity plan.
  const trackingTitle = a.pattern === 'stopped'
    ? L('Protect the change you already made', 'जो change शुरू हो चुका है उसे protect करें')
    : a.pattern === 'most-days' || a.amount === 'several'
      ? L('Use a closer 7-day check-in', '7-day check-in को closer रखें')
      : L('Use a simple 7-day pattern check', 'Simple 7-day pattern check करें')
  const trackingSteps = a.pattern === 'stopped'
    ? [
        L('Write down what time of day still feels hardest, even if the change is going well.', 'Change अच्छा चल रहा हो तब भी दिन का कौन सा time hardest है, note करें।'),
        L('Keep the support contact you selected active during that window.', 'उस window में selected support contact active रखें।'),
        L('Treat a difficult day as information: note the trigger and adjust the plan instead of starting from zero.', 'Difficult day को information मानें: trigger note करें और plan adjust करें, zero से start न करें।'),
      ]
    : [
        L('For 7 days, note the time, the trigger, and whether you followed your replacement plan.', '7 days तक time, trigger और replacement plan follow हुआ या नहीं, note करें।'),
        L(a.amountDetail.trim() ? 'Keep your rough amount note private and show it only to a professional if you want it included in care.' : 'If you are unsure about the amount, keep the description rough — the goal is a useful pattern, not perfect counting.', a.amountDetail.trim() ? 'Rough amount note private रखें और care में include करना हो तो professional को दिखाएँ।' : 'Amount पर sure न हों तो rough description रखें — goal useful pattern है, perfect counting नहीं।'),
        L('At day 7, compare what happened around your chosen time and trigger before deciding the next adjustment.', 'Day 7 पर chosen time और trigger के आसपास क्या हुआ compare करें, फिर next adjustment तय करें।'),
      ]
  items.push({ number: '06', timing: L('7 DAYS', '7 दिन'), tone: 'teal', title: trackingTitle, body: L(`Your amount pattern, ${pattern.toLowerCase() || 'current pattern'}, and ${choiceLabel(choices.duration, a.duration, 'en').toLowerCase() || 'duration'} tell us how tightly to track the next week.`, `Amount pattern, ${choiceLabel(choices.pattern, a.pattern, 'hi').toLowerCase() || 'pattern'} और ${choiceLabel(choices.duration, a.duration, 'hi').toLowerCase() || 'duration'} के हिसाब से next week की tracking तय की गई है।`), steps: trackingSteps, action: L('Concrete move: create one phone note called “BreakFree — 7 day check.”', 'Concrete move: “BreakFree — 7 day check” नाम की phone note बनाएं।') })

  // 07 — support branch, every support answer changes the finish.
  if (a.support === 'trusted') {
    items.push({ number: '07', timing: L('SUPPORT', 'SUPPORT'), tone: 'blue', title: L('Give one person a clear job', 'एक person को clear job दें'), body: L('You already have someone you trust. Make the support specific so it is easier for both of you.', 'आपके पास trusted person है। Support specific रखें ताकि दोनों के लिए आसान हो।'), steps: [L(`Tell them your hardest window is ${timingLine.toLowerCase()}.`, `उन्हें बताएं कि आपका hardest window ${timingLine} है।`), L(`Tell them your main trigger is ${triggerLine.toLowerCase()}.`, `उन्हें बताएं कि main trigger ${triggerLine} है।`), L('Ask for one check-in at that time for the next 7 days.', 'अगले 7 days के लिए उस time पर एक check-in माँगें।')], action: L('Send: “Can you check in with me around my hard time this week?”', 'भेजें: “क्या आप इस हफ्ते मेरे hard time के आसपास check-in कर सकते हैं?”') })
  } else if (a.support === 'professional') {
    items.push({ number: '07', timing: L('SUPPORT', 'SUPPORT'), tone: 'teal', title: L('Make the professional conversation easy to start', 'Professional conversation शुरू करना आसान बनाएं'), body: L('You chose a doctor or counsellor. Use the answers you already gave instead of trying to explain the whole story from memory.', 'आपने doctor या counsellor चुना। पूरी story memory से explain करने के बजाय अपने answers use करें।'), steps: [L(`Start with the substance: ${substance.toLowerCase() || 'the substance you selected'}.`, `Substance से शुरू करें: ${choiceLabel(choices.substance, a.substance, 'hi').toLowerCase() || 'आपने जो substance चुना'}।`), L(`Give the pattern and duration: ${pattern.toLowerCase() || 'your pattern'} + ${choiceLabel(choices.duration, a.duration, 'en').toLowerCase() || 'your duration'}.`, `Pattern और duration बताएं: ${choiceLabel(choices.pattern, a.pattern, 'hi').toLowerCase() || 'pattern'} + ${choiceLabel(choices.duration, a.duration, 'hi').toLowerCase() || 'duration'}।`), L(`Add the reason and hardest window: ${reason.toLowerCase() || 'why you use'} + ${timingLine.toLowerCase()}.`, `Reason और hardest window बताएं: ${choiceLabel(choices.reason, a.reason, 'hi').toLowerCase() || 'वजह'} + ${choiceLabel(choices.timing, a.timing, 'hi').toLowerCase()}।`)], action: L('Concrete move: show the clinician the “Why these steps” section of this result.', 'Concrete move: clinician को इस result का “Why these steps” section दिखाएँ।') })
  } else if (a.support === 'helpline') {
    items.push({ number: '07', timing: L('SUPPORT', 'SUPPORT'), tone: 'teal', title: L('Use the service you already chose', 'जो service चुनी है वही use करें'), body: L('You already chose a support service, so the plan makes that contact the next concrete step.', 'आपने support service चुनी है, इसलिए plan उस contact को next concrete step बनाता है।'), steps: [L('Open the support option and choose the service that fits your situation.', 'Support option खोलें और अपनी situation के लिए fitting service चुनें।'), L('Have your substance, pattern, duration and biggest challenge written down first.', 'Substance, pattern, duration और biggest challenge पहले लिखकर रखें।'), L('Ask what the safest next step is for your exact situation.', 'पूछें कि आपकी exact situation में safest next step क्या है।')], action: L('Concrete move: make the contact before the end of the day.', 'Concrete move: दिन खत्म होने से पहले contact करें।') })
  } else {
    items.push({ number: '07', timing: L('SUPPORT', 'SUPPORT'), tone: 'purple', title: L('Build a support route from scratch', 'Support route zero से बनाएं'), body: L('You said you do not have anyone yet. That changes the plan: the first support step is a service, not a perfect personal relationship.', 'आपने कहा कि अभी कोई नहीं है। इसलिए first support step service होगी, perfect personal relationship नहीं।'), steps: [L('Open BreakFree Help & Support and choose one professional or service option.', 'BreakFree Help & Support खोलें और एक professional या service option चुनें।'), L('Write down your substance, pattern, reason and hardest time before making contact.', 'Contact से पहले substance, pattern, reason और hardest time लिखें।'), L('Use the first conversation to ask what support fits your situation — you do not need to solve everything in one call.', 'पहली conversation में पूछें कि आपकी situation के लिए कौन सा support fit है — एक call में सब solve करना जरूरी नहीं।')], action: L('Concrete move: choose the service first; explanation comes second.', 'Concrete move: पहले service चुनें; explanation बाद में।') })
  }

  // 08 — final goal-specific checkpoint.
  if (a.goal === 'started' || a.pattern === 'stopped') {
    items.push({ number: '08', timing: L('NEXT CHECK-IN', 'NEXT CHECK-IN'), tone: 'teal', title: L('Protect what is already working', 'जो काम कर रहा है उसे protect करें'), body: L('You are already changing or recently stopped. The next milestone is not perfection — it is keeping the plan available when a hard day arrives.', 'आप पहले से change कर रहे हैं या हाल में stop किया है। Next milestone perfection नहीं, hard day पर plan available रखना है।'), steps: [L('Keep your hardest-time reminder active for 7 more days.', 'Hardest-time reminder को 7 और days active रखें।'), L('Keep the same support contact in place instead of waiting until things get difficult.', 'Same support contact रखें; problem बढ़ने का wait न करें।'), L('At day 7, write one sentence: “The trigger that still needs work is ____.”', 'Day 7 पर एक sentence लिखें: “जिस trigger पर अभी काम चाहिए वह ____ है।”')], action: L('Concrete move: schedule the day-7 review now.', 'Concrete move: day-7 review अभी schedule करें।') })
  } else if (a.goal === 'not-sure') {
    items.push({ number: '08', timing: L('THIS WEEK', 'इस हफ्ते'), tone: 'blue', title: L('Let your next goal be clarity', 'आपका next goal clarity हो सकता है'), body: L('You are considering change, not promising everything today. The plan respects that and makes the next conversation concrete.', 'आप change के बारे में सोच रहे हैं, आज सब promise नहीं कर रहे। Plan उसी को respect करता है।'), steps: [L('Pick one support conversation from this plan.', 'Plan से एक support conversation चुनें।'), L('Take the answers you gave about reason, trigger and impact into that conversation.', 'Reason, trigger और impact वाले answers conversation में ले जाएँ।'), L('After that conversation, choose your next goal: stop, change, or keep learning.', 'Conversation के बाद next goal चुनें: stop, change या और learn करना।')], action: L('Concrete move: put the conversation in your calendar this week.', 'Concrete move: इस हफ्ते conversation calendar में डालें।') })
  } else {
    items.push({ number: '08', timing: L('REVIEW', 'REVIEW'), tone: 'teal', title: L('Make the plan better after 7 days', '7 days बाद plan को बेहतर बनाएं'), body: L('This first plan is based on what you told us today. Your next version should be based on what actually happened.', 'यह first plan आज के answers पर बना है। Next version इस बात पर बने कि actually क्या हुआ।'), steps: [L('Look back at your trigger, hardest time and biggest challenge.', 'Trigger, hardest time और biggest challenge को फिर देखें।'), L('Keep the step that was easiest to follow and change the step that was hardest.', 'जो step easy था उसे रखें और जो hardest था उसे बदलें।'), L('Build a new plan from the updated answers instead of starting from zero.', 'Updated answers से नया plan बनाएं; zero से start न करें।')], action: L('Concrete move: return to BreakFree after 7 days and use “Reset plan” only when you are ready to rebuild it.', 'Concrete move: 7 days बाद वापस आएँ और ready होने पर ही “Reset plan” use करें।') })
  }

  const title = a.goal === 'started'
    ? L('Protect the progress you have already started.', 'जो progress शुरू हो चुकी है, उसे protect करें।')
    : a.goal === 'not-sure'
      ? L('A plan for the next step — not a perfect promise.', 'Next step के लिए plan — perfect promise नहीं।')
      : helping
        ? L('A support plan built around the person you described.', 'आपने जिस person की situation बताई, उसके आसपास बना support plan।')
        : L('A plan built from your answers — not a generic checklist.', 'आपके answers से बना plan — generic checklist नहीं।')

  const intro = helping
    ? L(`You gave us the situation, pattern, reason, trigger, challenge and support options. The steps below use those details to decide what should happen first, next and after that.`, `आपने situation, pattern, reason, trigger, challenge और support बताया। नीचे के steps इन्हीं details से तय होते हैं।`)
    : L(`You told us the substance, amount pattern, frequency, duration, reason, hardest time, trigger, goal, challenge, impact and support situation. Those answers are the ingredients for this plan.`, `आपने substance, amount pattern, frequency, duration, reason, hardest time, trigger, goal, challenge, impact और support situation बताया। इन्हीं answers से यह plan बना है।`)

  return { title, intro, items: items.slice(0, 8), focus }
}

export default function PersonalPlan() {
  const { language } = useLanguage()
  const [saved, setSaved] = useState<SavedState>(() => loadSavedState())
  const [copied, setCopied] = useState(false)
  const questionRef = useRef<HTMLDivElement>(null)
  const previousStep = useRef(saved.step)

  const { answers, step, submitted, savedAt } = saved
  const plan = useMemo(() => buildPlan(answers), [answers])
  const keyOrder = ['forWho', 'substance', 'amount', 'pattern', 'duration', 'reason', 'timing', 'trigger', 'goal', 'challenge', 'impact', 'support'] as const
  const currentKey = keyOrder[Math.min(step, keyOrder.length - 1)]
  const canContinue = Boolean(answers[currentKey])
  const progress = ((step + 1) / TOTAL_STEPS) * 100

  useEffect(() => {
    const next: SavedState = { ...saved, savedAt: new Date().toISOString() }
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* localStorage can be blocked */ }
  }, [saved])

  useEffect(() => {
    if (step !== previousStep.current && !submitted) {
      window.requestAnimationFrame(() => questionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
    previousStep.current = step
  }, [step, submitted])

  function update(key: keyof Answers, value: string) {
    setSaved(prev => ({ ...prev, answers: { ...prev.answers, [key]: value } }))
  }

  function next() {
    if (!canContinue) return
    if (step === TOTAL_STEPS - 1) {
      setSaved(prev => ({ ...prev, submitted: true, step: TOTAL_STEPS - 1 }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setSaved(prev => ({ ...prev, step: prev.step + 1 }))
  }

  function back() {
    if (step === 0) return
    setSaved(prev => ({ ...prev, step: prev.step - 1 }))
  }

  function resetPlan() {
    try { window.localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    setSaved({ answers: emptyAnswers, step: 0, submitted: false, savedAt: '' })
    setCopied(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function copyPlan() {
    const lines = [plan.title.en, '', 'Built from: ', ...plan.focus.map(x => `• ${x.en}`), '', ...plan.items.flatMap(item => [
      `${item.number}. ${item.title.en}`,
      item.body.en,
      ...item.steps.map((s, i) => `${i + 1}. ${s.en}`),
      item.action?.en ? `Action: ${item.action.en}` : '',
      '',
    ])]
    try {
      await navigator.clipboard.writeText(lines.filter(Boolean).join('\n'))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch { /* visible plan stays available */ }
  }

  const renderQuestion = () => {
    const helping = answers.forWho === 'someone'
    const actor = {
      en: {
        subject: helping ? 'they' : 'you',
        possessive: helping ? 'their' : 'your',
        object: helping ? 'them' : 'you',
        verb: helping ? 'do' : 'do',
        beVerb: helping ? 'are' : 'are',
      },
      hi: { subject: helping ? 'वे' : 'आप', possessive: helping ? 'उनकी' : 'आपकी', object: helping ? 'उन्हें' : 'आपको' },
    }
    switch (step) {
      case 0:
        return <Question title={tx('Who are you filling this in for?', 'आप यह plan किसके लिए भर रहे हैं?', language)} subtitle={tx('Keep it anonymous. No names, addresses or identifying details needed.', 'इसे anonymous रखें। Name, address या identifying details देने की जरूरत नहीं है।', language)}><ChoiceGrid value={answers.forWho} options={choices.forWho} language={language} onChange={v => update('forWho', v)} /></Question>
      case 1:
        return <Question title={tx(helping ? 'Which substance do they use?' : 'Which substance do you use?', helping ? 'वे कौन सा substance use करते हैं?' : 'आप कौन सा substance use करते हैं?', language)} subtitle={tx(helping ? 'Pick the substance or category that best matches their situation.' : 'Pick the substance or category that best matches your situation.', helping ? 'उनकी situation के हिसाब से सबसे सही substance या category चुनें।' : 'अपनी situation के हिसाब से सबसे सही substance या category चुनें।', language)}><ChoiceGrid value={answers.substance} options={choices.substance} language={language} onChange={v => update('substance', v)} /></Question>
      case 2:
        return <Question title={tx(`How much do ${actor.en.subject} usually use on one day or occasion?`, `${actor.hi.possessive} एक दिन या occasion में आमतौर पर कितना use ${helping ? 'करते हैं' : 'करते हैं'}?`, language)} subtitle={tx(helping ? 'A rough description of their usual amount is enough. Add a note only if it helps you describe the pattern.' : 'A rough description is enough. Add a private note only if it helps you remember the usual amount or number of occasions.', helping ? 'उनके usual amount का rough description काफी है। Note तभी जोड़ें जब pattern बताने में मदद मिले।' : 'Rough description काफी है। चाहें तो private note में usual amount या occasions लिख सकते हैं।', language)}><ChoiceGrid value={answers.amount} options={choices.amount} language={language} onChange={v => update('amount', v)} /><div className="mt-4"><label className="block text-[11px] font-black uppercase tracking-[0.18em] text-[#8094ad] mb-2">{tx('Optional rough note', 'Optional rough note', language)}</label><textarea value={answers.amountDetail} onChange={e => update('amountDetail', e.target.value.slice(0, 160))} rows={3} placeholder={tx(helping ? 'Example: their rough amount or occasions' : 'Example: your rough amount or number of occasions', helping ? 'Example: उनका rough amount या number of occasions' : 'Example: आपका rough amount या number of occasions', language)} className="w-full resize-none rounded-2xl border border-[#1e3050] bg-[#0d1e36] px-4 py-3 text-sm text-[#f0ede6] placeholder:text-[#596e88] outline-none focus:border-[#54d5bf]/55 focus:ring-2 focus:ring-[#1a9e8a]/10 transition-all" /></div></Question>
      case 3:
        return <Question title={tx(helping ? 'How often has this been happening for them lately?' : 'How often has this been happening for you lately?', helping ? 'हाल में उनके साथ यह कितनी बार हुआ है?' : 'हाल में आपके साथ यह कितनी बार हुआ है?', language)} subtitle={tx(helping ? 'This changes how much structure their first week of the plan needs.' : 'This changes how much structure your first week of the plan needs.', helping ? 'इससे तय होगा कि उनके first week में कितनी structure चाहिए।' : 'इससे तय होगा कि आपके first week में कितनी structure चाहिए।', language)}><ChoiceGrid value={answers.pattern} options={choices.pattern} language={language} onChange={v => update('pattern', v)} /></Question>
      case 4:
        return <Question title={tx(`How long has this been part of ${actor.en.possessive} routine?`, `यह ${actor.hi.possessive} routine का हिस्सा कब से है?`, language)} subtitle={tx('A rough time range is enough — no exact dates needed.', 'Rough time range काफी है — exact dates की जरूरत नहीं।', language)}><ChoiceGrid value={answers.duration} options={choices.duration} language={language} onChange={v => update('duration', v)} /></Question>
      case 5:
        return <Question title={tx(`What do ${actor.en.subject} usually want from it?`, `${actor.hi.subject} आमतौर पर इससे क्या चाहते ${helping ? 'हैं' : 'हैं'}?`, language)} subtitle={tx(helping ? 'This answer changes the replacement steps in their plan.' : 'This answer changes the replacement steps in your plan.', helping ? 'यह answer उनके plan के replacement steps बदलता है।' : 'यह answer आपके plan के replacement steps बदलता है।', language)}><ChoiceGrid value={answers.reason} options={choices.reason} language={language} onChange={v => update('reason', v)} /></Question>
      case 6:
        return <Question title={tx(`When is it hardest for ${actor.en.object} to stay away?`, `${actor.hi.object} इससे दूर रहना सबसे मुश्किल कब होता है?`, language)} subtitle={tx(`We will build one action that appears before ${actor.en.possessive} difficult window starts.`, `${actor.hi.possessive} difficult window शुरू होने से पहले एक action तैयार करेंगे।`, language)}><ChoiceGrid value={answers.timing} options={choices.timing} language={language} onChange={v => update('timing', v)} /></Question>
      case 7:
        return <Question title={tx(`What usually sets it off for ${actor.en.object}?`, `${actor.hi.object} के लिए इसे आमतौर पर trigger क्या करता है?`, language)} subtitle={tx(helping ? 'Pick the trigger that shows up most often for them. Their plan will use it directly.' : 'Pick the trigger you notice most. Your plan will use it directly.', helping ? 'उनके लिए जो trigger सबसे ज्यादा आता है, वही चुनें। Plan उसे directly use करेगा।' : 'जो trigger सबसे ज्यादा notice होता है, वही चुनें। Plan उसे directly use करेगा।', language)}><ChoiceGrid value={answers.trigger} options={choices.trigger} language={language} onChange={v => update('trigger', v)} /></Question>
      case 8:
        return <Question title={tx(`What do ${actor.en.subject} want to change first?`, `${actor.hi.subject} सबसे पहले क्या बदलना चाहते ${helping ? 'हैं' : 'हैं'}?`, language)} subtitle={tx(helping ? 'There is no “perfect” answer. Pick what is actually true for them right now.' : 'There is no “perfect” answer. Pick what is actually true for you right now.', helping ? '“Perfect” answer नहीं है। अभी उनके लिए जो सच में सही लगता है, वही चुनें।' : '“Perfect” answer नहीं है। जो अभी आपके लिए सच में सही लगता है, वही चुनें।', language)}><ChoiceGrid value={answers.goal} options={choices.goal} language={language} onChange={v => update('goal', v)} /></Question>
      case 9:
        return <Question title={tx(`What will probably be hardest for ${actor.en.object}?`, `${actor.hi.object} के लिए सबसे मुश्किल क्या होगा?`, language)} subtitle={tx(helping ? 'This answer changes what the plan tells them to do in the difficult moment.' : 'This answer changes what the plan tells you to do in the difficult moment.', helping ? 'यह answer difficult moment में plan के steps बदलता है।' : 'यह answer difficult moment में plan के steps बदलता है।', language)}><ChoiceGrid value={answers.challenge} options={choices.challenge} language={language} onChange={v => update('challenge', v)} /></Question>
      case 10:
        return <Question title={tx(`What part of ${actor.en.possessive} life is it affecting most?`, `${actor.hi.possessive} life का कौन सा हिस्सा सबसे ज्यादा affect हो रहा है?`, language)} subtitle={tx(helping ? 'Pick the area you most want to protect for them while they work on this.' : 'Pick the area you most want to protect while you work on this.', helping ? 'वह area चुनें जिसे आप उनके लिए सबसे ज्यादा protect करना चाहते हैं।' : 'जिस area को आप सबसे ज्यादा protect करना चाहते हैं, उसे चुनें।', language)}><ChoiceGrid value={answers.impact} options={choices.impact} language={language} onChange={v => update('impact', v)} /></Question>
      case 11:
        return <Question title={tx(`What support do ${actor.en.subject} have right now?`, `${actor.hi.subject} के पास अभी कौन सा support है?`, language)} subtitle={tx(helping ? 'This changes the final part of their plan so it fits what they actually have.' : 'This changes the final part of your plan so it fits what you actually have.', helping ? 'इससे plan का final part उनके real support के हिसाब से बनेगा।' : 'इससे plan का final part आपकी real support situation के हिसाब से बनेगा।', language)}><ChoiceGrid value={answers.support} options={choices.support} language={language} onChange={v => update('support', v)} /></Question>
      default:
        return null
    }
  }

  const currentRaw = questionMeta[Math.min(step, questionMeta.length - 1)][language]
  const current = language === 'hi' ? translateHindi(currentRaw) : currentRaw

  if (submitted) {
    return (
      <div className="min-h-screen pt-16">
        <section className="relative overflow-hidden py-16 md:py-20 bg-[#0d1e36] bf-hero">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(26,158,138,.13), transparent 34%), radial-gradient(circle at 86% 18%, rgba(167,139,250,.11), transparent 32%)' }} />
          <div className="max-w-6xl mx-auto px-6 relative">
            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#54d5bf]/25 bg-[#1a9e8a]/10 px-4 py-2 text-[#54d5bf] text-[11px] font-black uppercase tracking-[0.2em] mb-5"><span className="w-2 h-2 rounded-full bg-[#54d5bf]" /> {tx(answers.forWho === 'someone' ? 'Plan built from their situation' : 'Plan built from your answers', answers.forWho === 'someone' ? 'उनकी situation से plan बना' : 'आपके answers से plan बना', language)}</div>
                <h1 className="text-4xl md:text-6xl font-black text-[#f0ede6] leading-[0.95] mb-5" style={{ fontFamily: 'var(--font-display)' }}>{language === 'hi' ? translateHindi(plan.title.hi) : plan.title.en}</h1>
                <p className="text-[#aebed0] text-lg leading-relaxed max-w-3xl">{language === 'hi' ? translateHindi(plan.intro.hi) : plan.intro.en}</p>
              </div>
              <div className="xl:w-[350px] rounded-3xl border border-[#526985]/35 bg-[#111f3a]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,.24)]">
                <div className="flex items-center justify-between mb-3"><p className="text-[#8fa3bc] text-[10px] uppercase tracking-[0.2em] font-black">{tx('Saved on this device', 'इस device पर saved', language)}</p><span className="w-2 h-2 rounded-full bg-[#54d5bf] shadow-[0_0_14px_rgba(84,213,191,.5)]" /></div>
                <p className="text-[#dce7f2] text-sm">{savedAt ? tx(`Last saved at ${humanNow(savedAt, language)}. It will stay here until you reset it.`, `Last saved ${humanNow(savedAt, language)} पर। Reset करने तक यहीं रहेगा।`, language) : tx('Saved locally in this browser.', 'इस browser में locally saved है।', language)}</p>
                <button type="button" onClick={resetPlan} className="mt-4 text-xs font-bold text-[#8fa3bc] hover:text-white transition-colors">{tx('Reset saved plan', 'Saved plan reset करें', language)}</button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14 bg-[#0a1628]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid xl:grid-cols-[1.25fr_.75fr] gap-7 items-start">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                  <div><p className="text-[#1a9e8a] text-[11px] uppercase tracking-[0.2em] font-black mb-2">{tx('YOUR PLAN', 'आपका PLAN', language)}</p><h2 className="text-3xl md:text-4xl font-black text-[#f0ede6]" style={{ fontFamily: 'var(--font-display)' }}>{tx('Concrete steps, in your order.', 'Concrete steps, आपके order में।', language)}</h2></div>
                  <button type="button" onClick={copyPlan} className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${copied ? 'border-[#1a9e8a]/45 bg-[#1a9e8a]/10 text-[#54d5bf]' : 'border-[#1e3050] bg-[#111f3a] text-[#c8d8e8] hover:border-[#54d5bf]/35 hover:text-white'}`}>{copied ? tx('Copied ✓', 'Copy हो गया ✓', language) : tx('Copy plan', 'Plan copy करें', language)}</button>
                </div>
                <div className="space-y-4">{plan.items.map(item => <PlanCard key={item.number} item={item} language={language} />)}</div>
              </div>

              <aside className="space-y-4 xl:sticky xl:top-24">
                <div className="rounded-3xl border border-[#a78bfa]/25 bg-[#a78bfa]/7 p-6 md:p-7">
                  <p className="text-[#a78bfa] text-[10px] uppercase tracking-[0.2em] font-black mb-3">{tx('WHY YOUR PLAN LOOKS LIKE THIS', 'आपका PLAN ऐसा क्यों है', language)}</p>
                  <div className="space-y-2 max-h-[360px] overflow-auto pr-1">{plan.focus.map((item, i) => <div key={i} className="rounded-xl border border-[#1e3050] bg-[#0d1e36] px-3 py-2.5 text-sm text-[#dbe5ef]">{language === 'hi' ? translateHindi(item.hi) : item.en}</div>)}</div>
                  <div className="mt-4 pt-4 border-t border-[#1e3050] flex items-center justify-between gap-4 text-xs"><span className="text-[#7489a2]">{tx('12 planning answers', '12 planning answers', language)}</span><span className="text-[#54d5bf] font-bold">{tx(answers.forWho === 'someone' ? 'Built around their answers' : 'Built around your answers', answers.forWho === 'someone' ? 'उनके answers के हिसाब से' : 'आपके answers के हिसाब से', language)}</span></div>
                </div>

                <div className="rounded-3xl border border-[#1e3050] bg-[#111f3a]/80 p-6">
                  <p className="text-[#54d5bf] text-[10px] uppercase tracking-[0.2em] font-black mb-3">{tx('START HERE', 'यहाँ से शुरू करें', language)}</p>
                  <h3 className="text-2xl font-black text-[#f0ede6] mb-3" style={{ fontFamily: 'var(--font-display)' }}>{tx('Do only Step 01 today.', 'आज सिर्फ Step 01 करें।', language)}</h3>
                  <p className="text-[#9fb0c6] text-sm leading-relaxed mb-5">{tx('The rest is saved here. You do not have to do everything at once.', 'बाकी यहीं saved है। सब कुछ एक साथ करने की जरूरत नहीं।', language)}</p>
                  <div className="grid gap-3"><Link to="/help" className="block text-center bg-[#1a9e8a] hover:bg-[#158a78] text-white font-bold rounded-xl px-5 py-3.5 transition-all">{tx('Find support', 'मदद देखें', language)} →</Link><Link to="/streak" className="block text-center border border-[#1e3050] bg-[#0d1e36] hover:border-[#a78bfa]/40 text-[#c8d8e8] font-semibold rounded-xl px-5 py-3.5 transition-all">{tx('Track progress', 'Progress track करें', language)} →</Link></div>
                </div>

                <div className="rounded-2xl border border-[#e8a020]/25 bg-[#e8a020]/7 p-5">
                  <p className="text-[#d8c38f] text-sm leading-relaxed"><span className="text-[#e8a020] font-bold">{tx('Important:', 'जरूरी:', language)}</span>{' '}{tx('This is a practical planning tool, not a diagnosis. Alcohol or sedative withdrawal can require medical guidance, and opioid or multi-substance use should be discussed with a qualified professional.', 'यह practical planning tool है, diagnosis नहीं। Alcohol या sedative withdrawal में medical guidance की जरूरत हो सकती है, और opioid या multi-substance use qualified professional से discuss करना चाहिए।', language)}</p>
                </div>

                <button type="button" onClick={resetPlan} className="w-full rounded-xl border border-transparent py-2 text-sm font-semibold text-[#7086a0] hover:text-[#f0ede6] transition-colors">{tx('Reset and build a new plan', 'Reset करके नया plan बनाएं', language)}</button>
              </aside>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-[#0a1628]">
      <section className="relative overflow-hidden py-14 md:py-18 bg-[#0d1e36] bf-hero">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(26,158,138,.11), transparent 35%), radial-gradient(circle at 86% 18%, rgba(167,139,250,.10), transparent 30%)' }} />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-7">
            <div className="max-w-3xl"><div className="inline-flex items-center gap-2 rounded-full border border-[#54d5bf]/20 bg-[#1a9e8a]/8 px-4 py-2 text-[#54d5bf] text-[10px] font-black uppercase tracking-[0.2em] mb-5"><span className="w-2 h-2 rounded-full bg-[#54d5bf]" /> {tx('Personal plan', 'Personal plan', language)}</div><h1 className="text-4xl md:text-6xl font-black text-[#f0ede6] leading-[0.95] mb-4" style={{ fontFamily: 'var(--font-display)' }}>{tx('Let’s build a plan that actually fits.', 'ऐसा plan बनाते हैं जो सच में fit हो।', language)}</h1><p className="text-[#9fb0c6] text-base md:text-lg leading-relaxed max-w-2xl">{tx('The questions are simple. The result changes with your answers — your substance, pattern, reason, trigger, challenge, impact and support.', 'Questions simple हैं। Result आपके answers के साथ बदलता है — substance, pattern, reason, trigger, challenge, impact और support के हिसाब से।', language)}</p></div>
            <div className="lg:w-[380px] rounded-3xl border border-[#526985]/30 bg-[#111f3a]/85 p-5 shadow-[0_20px_70px_rgba(0,0,0,.18)]">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] font-black text-[#8fa3bc] mb-3"><span>{current}</span><span>{step + 1}/{TOTAL_STEPS - 1}</span></div>
              <div className="h-2 rounded-full bg-[#0b1830] border border-[#1e3050] overflow-hidden"><div className="h-full bg-gradient-to-r from-[#1a9e8a] via-[#54d5bf] to-[#a78bfa] transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} /></div>
              <div className="mt-4 flex gap-1">{questionMeta.map((_, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${index < step ? 'bg-[#1a9e8a]' : index === step ? 'bg-[#a78bfa]' : 'bg-[#213552]'}`} />)}</div>
              <div className="mt-4 flex items-center justify-between gap-4"><p className="text-[#c6d3df] text-xs">{tx('Saved automatically on this device.', 'इस device पर automatically saved है।', language)}</p><button type="button" onClick={resetPlan} className="text-xs font-bold text-[#7086a0] hover:text-white">{tx('Reset', 'Reset', language)}</button></div>
            </div>
          </div>
        </div>
      </section>

      {savedAt && step > 0 && <div className="max-w-6xl mx-auto px-6 pt-6"><div className="rounded-2xl border border-[#54d5bf]/15 bg-[#54d5bf]/5 px-4 py-3 text-sm text-[#bfeee6]">{tx(`Welcome back. Your progress is saved here, so you are back at question ${step + 1}.`, `Welcome back. Progress saved है, इसलिए आप question ${step + 1} पर वापस हैं।`, language)}</div></div>}

      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
            <div ref={questionRef} className="scroll-mt-24 rounded-3xl p-7 md:p-10 border border-[#526985]/30 bg-[#111f3a] shadow-[0_25px_80px_rgba(0,0,0,.2)]">
              {renderQuestion()}
              <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-[#1e3050]">
                <button type="button" onClick={back} disabled={step === 0} className="text-[#8fa3bc] hover:text-[#f0ede6] text-sm font-bold disabled:opacity-30 disabled:pointer-events-none transition-colors">← {tx('Back', 'पीछे', language)}</button>
                <button type="button" onClick={next} disabled={!canContinue} className="bg-[#1a9e8a] hover:bg-[#158a78] disabled:opacity-35 text-white font-black px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(26,158,138,.14)]">{step === TOTAL_STEPS - 1 ? tx('Build my plan', 'मेरा plan बनाएं', language) : tx('Continue', 'आगे', language)} →</button>
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <div className="rounded-3xl border border-[#1e3050] bg-[#0d1e36]/80 p-6">
                <p className="text-[#a78bfa] text-[10px] uppercase tracking-[0.2em] font-black mb-3">{tx(answers.forWho === 'someone' ? 'This changes their plan' : 'This changes your plan', answers.forWho === 'someone' ? 'यह उनका plan बदलता है' : 'यह plan बदलता है', language)}</p>
                {answers.substance || answers.amount || answers.pattern || answers.duration || answers.reason || answers.timing || answers.trigger || answers.goal || answers.challenge || answers.impact || answers.support ? <div className="space-y-2 text-sm">
                  {answers.substance && <MiniSelection label={tx('Substance', 'Substance', language)} value={choiceLabel(choices.substance, answers.substance, language)} />}
                  {answers.amount && <MiniSelection label={tx('Typical amount', 'आमतौर पर', language)} value={choiceLabel(choices.amount, answers.amount, language)} />}
                  {answers.pattern && <MiniSelection label={tx('Pattern', 'Pattern', language)} value={choiceLabel(choices.pattern, answers.pattern, language)} />}
                  {answers.duration && <MiniSelection label={tx('Duration', 'अवधि', language)} value={choiceLabel(choices.duration, answers.duration, language)} />}
                  {answers.reason && <MiniSelection label={tx('Why', 'वजह', language)} value={choiceLabel(choices.reason, answers.reason, language)} />}
                  {answers.timing && <MiniSelection label={tx('Hardest time', 'मुश्किल समय', language)} value={choiceLabel(choices.timing, answers.timing, language)} />}
                  {answers.trigger && <MiniSelection label={tx('Trigger', 'Trigger', language)} value={choiceLabel(choices.trigger, answers.trigger, language)} />}
                  {answers.goal && <MiniSelection label={tx('Goal', 'Goal', language)} value={choiceLabel(choices.goal, answers.goal, language)} />}
                  {answers.challenge && <MiniSelection label={tx('Challenge', 'Challenge', language)} value={choiceLabel(choices.challenge, answers.challenge, language)} />}
                  {answers.impact && <MiniSelection label={tx('Impact', 'असर', language)} value={choiceLabel(choices.impact, answers.impact, language)} />}
                  {answers.support && <MiniSelection label={tx('Support', 'Support', language)} value={choiceLabel(choices.support, answers.support, language)} />}
                </div> : <p className="text-[#7086a0] text-sm leading-relaxed">{tx('Start answering. The plan panel will update as you go.', 'Answer देना शुरू करें। Plan panel भी साथ में update होगा।', language)}</p>}
              </div>
              <div className="rounded-2xl border border-[#1e3050] bg-[#111f3a]/70 p-5"><p className="text-[#c8d8e8] text-xs leading-relaxed"><span className="font-bold text-[#f0ede6]">{tx('Private by design.', 'Private by design.', language)}</span> {tx('Your answers stay in this browser unless you reset them. Do not enter names, addresses or identifying details.', 'Answers इसी browser में रहते हैं जब तक आप reset न करें। Names, addresses या identifying details न डालें।', language)}</p></div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}

function Question({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <div><h2 className="text-3xl md:text-4xl font-black text-[#f0ede6] leading-tight mb-3" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2><p className="text-[#8fa3bc] text-sm md:text-base leading-relaxed mb-7 max-w-2xl">{subtitle}</p>{children}</div>
}

function MiniSelection({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-[#1e3050] bg-[#111f3a] px-3 py-2.5"><p className="text-[#6f849d] text-[9px] uppercase tracking-[0.15em] font-black mb-1">{label}</p><p className="text-[#dbe5ef] font-semibold leading-snug">{value}</p></div>
}

function PlanCard({ item, language }: { item: PlanItem; language: 'en' | 'hi' }) {
  const tone = {
    teal: { line: 'border-[#1a9e8a]/35', dot: 'bg-[#1a9e8a]', num: 'text-[#54d5bf]', tag: 'text-[#54d5bf]', action: 'border-[#1a9e8a]/20 bg-[#1a9e8a]/6 text-[#bfeee6]' },
    purple: { line: 'border-[#a78bfa]/30', dot: 'bg-[#a78bfa]', num: 'text-[#c6b9fa]', tag: 'text-[#c6b9fa]', action: 'border-[#a78bfa]/20 bg-[#a78bfa]/6 text-[#ded7fa]' },
    amber: { line: 'border-[#e8a020]/30', dot: 'bg-[#e8a020]', num: 'text-[#f4c56d]', tag: 'text-[#f4c56d]', action: 'border-[#e8a020]/20 bg-[#e8a020]/6 text-[#f3dfb2]' },
    red: { line: 'border-red-500/25', dot: 'bg-red-500', num: 'text-red-300', tag: 'text-red-300', action: 'border-red-500/20 bg-red-500/6 text-red-200' },
    blue: { line: 'border-[#60a5fa]/30', dot: 'bg-[#60a5fa]', num: 'text-[#93c5fd]', tag: 'text-[#93c5fd]', action: 'border-[#60a5fa]/20 bg-[#60a5fa]/6 text-[#cfe4ff]' },
  }[item.tone ?? 'teal']

  return <article className={`group rounded-2xl border ${tone.line} bg-[#111f3a] p-6 md:p-7 shadow-[0_14px_40px_rgba(0,0,0,.12)] transition-all duration-300 hover:-translate-y-0.5`}><div className="flex gap-4"><div className={`relative w-11 h-11 shrink-0 rounded-2xl border border-[#31445f] bg-[#0d1e36] flex items-center justify-center font-black text-xs ${tone.num}`}><span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${tone.dot}`} />{item.number}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2 mb-2"><span className={`text-[10px] uppercase tracking-[0.2em] font-black ${tone.tag}`}>{language === 'hi' ? translateHindi(item.timing.hi) : item.timing.en}</span></div><h3 className="text-xl md:text-2xl font-black text-[#f0ede6] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{language === 'hi' ? translateHindi(item.title.hi) : item.title.en}</h3><p className="text-[#b0bfd0] text-sm md:text-base leading-relaxed">{language === 'hi' ? translateHindi(item.body.hi) : item.body.en}</p><div className="mt-5 grid gap-2.5">{item.steps.map((s, index) => <div key={index} className="flex gap-3 rounded-xl border border-[#1e3050] bg-[#0d1e36]/65 px-4 py-3"><span className="w-6 h-6 rounded-full bg-[#162640] border border-[#31445f] flex items-center justify-center text-[10px] font-black text-[#9fb0c6] shrink-0">{index + 1}</span><p className="text-[#c8d8e8] text-sm leading-relaxed">{language === 'hi' ? translateHindi(s.hi) : s.en}</p></div>)}</div>{item.action && <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${tone.action}`}>{language === 'hi' ? translateHindi(item.action.hi) : item.action.en}</div>}</div></div></article>
}

function ChoiceGrid({ value, options, language, onChange }: { value: string; options: Choice[]; language: 'en' | 'hi'; onChange: (value: string) => void }) {
  return <div className="grid sm:grid-cols-2 gap-3">{options.map(option => { const active = value === option.id; const hintRaw = language === 'hi' ? (option.hintHi ?? '') : (option.hint ?? '')
  const hint = language === 'hi' ? translateHindi(hintRaw) : hintRaw; return <button key={option.id} type="button" onClick={() => onChange(option.id)} aria-pressed={active} className={`text-left rounded-2xl border p-5 transition-all duration-200 group ${active ? 'border-[#1a9e8a]/55 bg-[#1a9e8a]/10 shadow-[0_0_28px_rgba(26,158,138,.08)]' : 'border-[#1e3050] bg-[#0d1e36] hover:border-[#7a8ea5]/35 hover:-translate-y-0.5'}`}><div className="flex items-start gap-4"><div className={`w-5 h-5 mt-0.5 shrink-0 rounded-full border flex items-center justify-center ${active ? 'border-[#54d5bf] bg-[#1a9e8a]' : 'border-[#657b96] group-hover:border-[#aebed0]'}`}>{active && <span className="w-2 h-2 rounded-full bg-[#0d1e36]" />}</div><div className="min-w-0"><div className="text-[#f0ede6] font-bold text-sm leading-relaxed">{language === 'hi' ? translateHindi(option.hi) : option.en}</div>{hint && <div className="text-[#7086a0] text-xs leading-relaxed mt-1.5">{hint}</div>}</div></div></button> })}</div>
}
