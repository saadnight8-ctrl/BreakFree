import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { useLanguage, tx } from '../i18n'

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
  pattern: string
  duration: string
  reason: string
  timing: string
  trigger: string
  goal: string
  challenge: string
  support: string
}

const TOTAL_STEPS = 11

const choices = {
  forWho: [
    { id: 'me', en: 'This is for me', hi: 'यह मेरे लिए है' },
    { id: 'someone', en: 'I am helping someone I care about', hi: 'मैं किसी अपने की मदद कर रहा/रही हूँ' },
  ],
  substance: [
    { id: 'opioids', en: 'Opioids', hi: 'ओपिओइड्स', hint: 'The plan will put qualified treatment support first.', hintHi: 'Plan में qualified treatment support को पहले रखा जाएगा।' },
    { id: 'stimulants', en: 'Stimulants', hi: 'स्टिमुलेंट्स', hint: 'The plan will pay attention to routine, sleep and stress.', hintHi: 'Plan routine, sleep और stress पर भी ध्यान देगा।' },
    { id: 'cannabis', en: 'Cannabis', hi: 'कैनाबिस', hint: 'The plan will focus on routines, triggers and support.', hintHi: 'Plan routines, triggers और support पर focus करेगा।' },
    { id: 'alcohol', en: 'Alcohol', hi: 'अल्कोहल', hint: 'Regular or heavy use can need medical guidance when changing use.', hintHi: 'Regular या heavy use में बदलाव के लिए medical guidance की जरूरत हो सकती है।' },
    { id: 'sedatives', en: 'Sedatives / anti-anxiety drugs', hi: 'सेडेटिव / एंटी-एंग्जायटी दवाएँ', hint: 'Major changes after regular use should be guided by a doctor.', hintHi: 'Regular use के बाद बड़े बदलाव doctor की guidance में होने चाहिए।' },
    { id: 'nicotine', en: 'Nicotine / tobacco', hi: 'निकोटीन / तंबाकू', hint: 'The plan will focus on your strongest trigger and quit preparation.', hintHi: 'Plan strongest trigger और quit preparation पर focus करेगा।' },
    { id: 'multiple', en: 'More than one / other', hi: 'एक से अधिक / अन्य', hint: 'A full picture helps a professional choose safer support.', hintHi: 'पूरी picture professional को safer support चुनने में मदद करती है।' },
    { id: 'prefer-not', en: 'Prefer not to say', hi: 'बताना पसंद नहीं', hint: 'That is okay. The plan will stay broad and support-focused.', hintHi: 'ठीक है। Plan broad और support-focused रहेगा।' },
  ],
  amount: [
    { id: 'one', en: 'One use / one occasion', hi: 'एक बार / एक occasion' },
    { id: 'few', en: 'A few uses in a day or session', hi: 'एक दिन या session में कुछ बार' },
    { id: 'several', en: 'Several uses / hard to keep track', hi: 'कई बार / track करना मुश्किल' },
    { id: 'varies', en: 'It varies a lot', hi: 'बहुत बदलता रहता है' },
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
    { id: 'curiosity', en: 'Curiosity, boredom, or trying it out', hi: 'curiosity, boredom या बस try करने की वजह से' },
    { id: 'other', en: 'Something else / not sure', hi: 'कुछ और / पक्का नहीं पता' },
  ],
  timing: [
    { id: 'morning', en: 'Morning / before the day starts', hi: 'सुबह / दिन शुरू होने से पहले' },
    { id: 'school-work', en: 'Around school or work', hi: 'स्कूल या काम के आसपास' },
    { id: 'after-school', en: 'After school / work', hi: 'स्कूल / काम के बाद' },
    { id: 'evening', en: 'Evening / late night', hi: 'शाम / देर रात' },
    { id: 'social', en: 'Mostly when I am with certain people', hi: 'ज्यादातर कुछ लोगों के साथ' },
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
  support: [
    { id: 'trusted', en: 'A trusted adult, friend, or family member', hi: 'भरोसेमंद बड़े, दोस्त या परिवार का सदस्य' },
    { id: 'professional', en: 'A doctor or counsellor', hi: 'डॉक्टर या काउंसलर' },
    { id: 'helpline', en: 'A helpline or support service', hi: 'हेल्पलाइन या सपोर्ट सर्विस' },
    { id: 'none', en: 'I do not have anyone yet', hi: 'अभी मेरे पास कोई नहीं है' },
  ],
}

const emptyAnswers: Answers = {
  forWho: '', substance: '', amount: '', pattern: '', duration: '', reason: '', timing: '', trigger: '', goal: '', challenge: '', support: '',
}

const questionMeta: LangText[] = [
  { en: 'Who', hi: 'कौन' },
  { en: 'Substance', hi: 'Substance' },
  { en: 'Typical amount', hi: 'आमतौर पर कितना' },
  { en: 'Pattern', hi: 'Pattern' },
  { en: 'Duration', hi: 'अवधि' },
  { en: 'Reason', hi: 'वजह' },
  { en: 'Hardest time', hi: 'मुश्किल समय' },
  { en: 'Trigger', hi: 'Trigger' },
  { en: 'Goal', hi: 'Goal' },
  { en: 'Challenge', hi: 'Challenge' },
  { en: 'Support', hi: 'Support' },
]

function choiceLabel(group: Choice[], id: string, language: 'en' | 'hi') {
  return group.find(item => item.id === id)?.[language] ?? ''
}

function L(en: string, hi: string): LangText {
  return { en, hi }
}

function buildPlan(a: Answers) {
  const items: PlanItem[] = []
  const focus: LangText[] = []
  const helping = a.forWho === 'someone'
  const { substance, pattern, amount, duration, reason, timing, trigger, goal, challenge, support } = a
  const frequent = pattern === 'most-days'
  const regularOrLong = frequent || duration === 'six-months' || duration === 'year-plus'
  const needsClinicalFirst = ['alcohol', 'sedatives', 'opioids', 'multiple'].includes(substance)

  if (substance) {
    focus.push(L(`Substance: ${choiceLabel(choices.substance, substance, 'en')}`, `Substance: ${choiceLabel(choices.substance, substance, 'hi')}`))
  }
  if (amount) focus.push(L(`Typical amount: ${choiceLabel(choices.amount, amount, 'en')}`, `आमतौर पर: ${choiceLabel(choices.amount, amount, 'hi')}`))
  if (pattern) focus.push(L(`Pattern: ${choiceLabel(choices.pattern, pattern, 'en')}`, `Pattern: ${choiceLabel(choices.pattern, pattern, 'hi')}`))
  if (reason) focus.push(L(`Why: ${choiceLabel(choices.reason, reason, 'en')}`, `वजह: ${choiceLabel(choices.reason, reason, 'hi')}`))
  if (timing) focus.push(L(`Hardest time: ${choiceLabel(choices.timing, timing, 'en')}`, `मुश्किल समय: ${choiceLabel(choices.timing, timing, 'hi')}`))
  if (trigger) focus.push(L(`Main trigger: ${choiceLabel(choices.trigger, trigger, 'en')}`, `मुख्य trigger: ${choiceLabel(choices.trigger, trigger, 'hi')}`))

  // Step 1: the first real-world action.
  if (helping) {
    items.push({
      number: '01', timing: L('TODAY', 'आज'), tone: 'blue',
      title: L('Have one calm conversation — without trying to fix everything.', 'एक शांत बातचीत करें — बिना सब कुछ एक साथ ठीक करने की कोशिश के।'),
      body: L('You are here to support someone else. The first move is to understand what they are willing to do, then help them reach the right support.', 'आप किसी और की मदद करने के लिए यहाँ हैं। पहला कदम है उनकी बात समझना और फिर उन्हें सही support तक पहुँचने में मदद करना।'),
      steps: [
        L('Pick a private, calm moment — not during an argument or when they are intoxicated.', 'शांत और private समय चुनें — argument या intoxication के दौरान नहीं।'),
        L('Say what you have noticed, then ask what kind of help they would actually accept.', 'जो आपने notice किया है वह कहें, फिर पूछें कि वे किस तरह की मदद लेने के लिए तैयार हैं।'),
        L('If the situation feels beyond you, bring in a trusted adult or professional instead of carrying it alone.', 'अगर situation आपकी capacity से बाहर लगे, तो trusted adult या professional को शामिल करें।'),
      ],
      action: L('Try: “I care about you. What would make getting help easier?”', 'कह सकते हैं: “मुझे आपकी परवाह है। मदद लेना आसान बनाने के लिए मैं क्या कर सकता/सकती हूँ?”'),
    })
  } else if (needsClinicalFirst || regularOrLong || support === 'professional' || support === 'helpline') {
    items.push({
      number: '01', timing: L('TODAY', 'आज'), tone: 'teal',
      title: L('Turn your answers into one real support contact.', 'अपने answers को एक real support contact में बदलें।'),
      body: L('Your pattern, amount, duration or substance makes professional guidance especially important. The goal is not to create a medical treatment plan here — it is to make the first conversation easier.', 'आपके pattern, amount, duration या substance के कारण professional guidance ज्यादा important हो सकती है। यहाँ medical treatment plan बनाना goal नहीं है — first conversation आसान बनाना है।'),
      steps: [
        L(`Contact a doctor, counsellor, helpline or qualified service and say you use ${choiceLabel(choices.substance, substance, 'en').toLowerCase()}.`, `Doctor, counsellor, helpline या qualified service से contact करके बताएं कि आप ${choiceLabel(choices.substance, substance, 'hi')} use करते हैं।`),
        L(`Tell them the pattern (${choiceLabel(choices.pattern, pattern, 'en').toLowerCase()}) and the rough amount pattern you picked (${choiceLabel(choices.amount, amount, 'en').toLowerCase()}).`, `Pattern (${choiceLabel(choices.pattern, pattern, 'hi')}) और amount pattern (${choiceLabel(choices.amount, amount, 'hi')}) भी बताएं।`),
        L(`Tell them your goal: ${choiceLabel(choices.goal, goal, 'en').toLowerCase()}. Ask what the safest next step is for your situation.`, `अपना goal बताएं: ${choiceLabel(choices.goal, goal, 'hi')}. पूछें कि आपकी situation में safest next step क्या है।`),
      ],
      action: L('Concrete move: make the call, send the message, or ask a trusted person to sit with you while you do it.', 'Concrete move: call करें, message भेजें या किसी trusted person को अपने साथ बैठाकर यह करें।'),
    })
  } else {
    items.push({
      number: '01', timing: L('TODAY', 'आज'), tone: 'teal',
      title: L('Tell one person the exact part you want to change.', 'एक person को वही exact बात बताएं जिसे आप बदलना चाहते हैं।'),
      body: L('Your plan works better when one real person knows what you are trying to do — especially around the time or trigger you picked.', 'Plan तब ज्यादा workable होता है जब किसी real person को पता हो कि आप क्या बदलना चाहते हैं — खासकर आपके चुने हुए time या trigger के बारे में।'),
      steps: [
        L(`Pick one trusted person and say: “I want to change my ${choiceLabel(choices.substance, substance, 'en').toLowerCase()} use.”`, `एक trusted person चुनें और कहें: “मैं अपना ${choiceLabel(choices.substance, substance, 'hi')} use बदलना चाहता/चाहती हूँ।”`),
        L(`Tell them your hardest window is ${choiceLabel(choices.timing, timing, 'en').toLowerCase()} and your main trigger is ${choiceLabel(choices.trigger, trigger, 'en').toLowerCase()}.`, `उन्हें बताएं कि आपका hardest window ${choiceLabel(choices.timing, timing, 'hi')} है और main trigger ${choiceLabel(choices.trigger, trigger, 'hi')} है।`),
        L('Ask for one simple check-in: a message, short call, or meeting at that time.', 'एक simple check-in माँगें: message, short call या उसी समय मिलना।'),
      ],
      action: L('Message: “I am trying to change my use. Can you check in with me this week?”', 'Message: “मैं अपना use बदलने की कोशिश कर रहा/रही हूँ। क्या आप इस हफ्ते मेरा check-in कर सकते हैं?”'),
    })
  }

  // Step 2: route based on substance and pattern.
  if (substance === 'alcohol' || substance === 'sedatives') {
    items.push({
      number: '02', timing: L('SAFETY FIRST', 'पहले safety'), tone: 'amber',
      title: L('Do not turn this into a solo withdrawal plan.', 'इसे अकेले withdrawal plan में मत बदलें।'),
      body: L('Regular or heavy alcohol or sedative use can sometimes make sudden stopping unsafe. A clinician should guide major changes rather than a website telling you how to manage withdrawal.', 'Regular या heavy alcohol या sedative use में अचानक रोकना कभी-कभी unsafe हो सकता है। बड़े बदलाव clinician की guidance में होने चाहिए, website से withdrawal manage नहीं करना चाहिए।'),
      steps: [
        L('Tell a clinician exactly what you picked in this survey: substance, pattern, amount pattern and duration.', 'Clinician को survey के substance, pattern, amount pattern और duration वाले answers बताएं।'),
        L('Ask what level of support is appropriate for you before you change your use.', 'Use बदलने से पहले पूछें कि आपके लिए किस level का support सही है।'),
        L('Use the Crisis Help page if you feel physically unwell or unsafe and need urgent help.', 'अगर physically unwell या unsafe feel हो तो Crisis Help page से urgent help लें।'),
      ],
      action: L('The concrete step here is a qualified assessment — not a do-it-yourself taper or detox.', 'यहाँ concrete step qualified assessment है — do-it-yourself taper या detox नहीं।'),
    })
  } else if (substance === 'opioids') {
    items.push({
      number: '02', timing: L('TREATMENT', 'TREATMENT'), tone: 'purple',
      title: L('Ask for an actual treatment conversation.', 'Actual treatment conversation के लिए जाएँ।'),
      body: L('Because you selected opioids, the plan puts qualified care ahead of self-designed instructions. Bring the whole pattern to a doctor or addiction-treatment service.', 'आपने opioids चुना है, इसलिए plan self-designed instructions के बजाय qualified care को पहले रखता है। पूरी pattern doctor या addiction-treatment service को बताएं।'),
      steps: [
        L('Take this plan with you or show the clinician the answers you gave here.', 'यह plan साथ ले जाएँ या clinician को अपने answers दिखाएँ।'),
        L('Tell them what you want to change and how long the pattern has been happening.', 'उन्हें बताएं कि आप क्या बदलना चाहते हैं और pattern कब से चल रहा है।'),
        L('Ask about evidence-based treatment and what support is available in your area.', 'Evidence-based treatment और available support के बारे में पूछें।'),
      ],
      action: L('Concrete move: request one assessment instead of trying to solve this from the website.', 'Concrete move: website से सब solve करने के बजाय one assessment request करें।'),
    })
  } else if (substance === 'nicotine') {
    const dateLine = goal === 'stop'
      ? L('Choose a quit date within the next 7 days.', 'अगले 7 दिनों में quit date चुनें।')
      : L('Choose a change date within the next 7 days.', 'अगले 7 दिनों में change date चुनें।')
    items.push({
      number: '02', timing: L('PREPARE', 'तैयारी'), tone: 'purple',
      title: L(goal === 'stop' ? 'Set a quit date you can actually protect.' : 'Set a change date and make it visible.', goal === 'stop' ? 'ऐसी quit date चुनें जिसे आप सच में protect कर सकें।' : 'एक change date चुनें और उसे visible बनाएं।'),
      body: dateLine,
      steps: [
        L('Write the date in your calendar and tell your support person.', 'Date calendar में लिखें और support person को बताएं।'),
        L('Before that date, clear nicotine/tobacco from the spaces where you usually use it.', 'उस date से पहले उन spaces से nicotine/tobacco हटाएँ जहाँ आप आमतौर पर use करते हैं।'),
        L(`Plan one replacement for your strongest time: ${choiceLabel(choices.timing, timing, 'en').toLowerCase()}.`, `अपने strongest time के लिए एक replacement तय करें: ${choiceLabel(choices.timing, timing, 'hi')}.`),
      ],
      action: L('Concrete move: put the date and your strongest trigger in your phone notes today.', 'Concrete move: आज date और strongest trigger phone notes में लिखें।'),
    })
  } else if (substance === 'multiple') {
    items.push({
      number: '02', timing: L('FULL PICTURE', 'पूरी picture'), tone: 'purple',
      title: L('Bring the whole picture to one professional.', 'पूरी picture एक professional तक ले जाएँ।'),
      body: L('When more than one substance is involved, advice can change depending on the combination and pattern. Do not try to manage each substance with separate internet tips.', 'जब एक से ज्यादा substances involved हों, combination और pattern के हिसाब से support बदल सकता है। हर substance के लिए अलग internet tips से manage करने की कोशिश न करें।'),
      steps: [
        L('Make a private note of the substances involved so you do not forget any of them during the conversation.', 'Involved substances की private note बना लें ताकि conversation में कुछ छूटे नहीं।'),
        L('Show the professional this survey result and explain which one feels hardest to control.', 'Professional को survey result दिखाएँ और बताएं कि किसे control करना सबसे मुश्किल लगता है।'),
        L('Ask for one joined plan instead of trying to solve everything at once.', 'सब कुछ एक साथ solve करने के बजाय one joined plan माँगें।'),
      ],
      action: L('Concrete move: book or request one assessment where you can be fully honest.', 'Concrete move: एक assessment book/request करें जहाँ आप पूरी honesty से बता सकें।'),
    })
  } else if (regularOrLong || amount === 'several') {
    items.push({
      number: '02', timing: L('STRUCTURE', 'STRUCTURE'), tone: 'blue',
      title: L('Make the first 7 days about structure, not perfection.', 'पहले 7 दिन perfection के बजाय structure पर रखें।'),
      body: L(`You selected ${choiceLabel(choices.pattern, pattern, 'en').toLowerCase()} and ${choiceLabel(choices.amount, amount, 'en').toLowerCase()}. That is why this plan gives you more structure and a real support check-in.`, `आपने ${choiceLabel(choices.pattern, pattern, 'hi')} और ${choiceLabel(choices.amount, amount, 'hi')} चुना। इसलिए plan में structure और support check-in ज्यादा रखा गया है।`),
      steps: [
        L('Choose one wake-up time and one sleep target you can realistically keep for 7 days.', 'एक wake-up time और sleep target चुनें जिसे 7 दिन realistically रख सकें।'),
        L('Put your hardest time and trigger into your calendar so you see the plan before that moment.', 'Hardest time और trigger calendar में डालें ताकि उस moment से पहले plan दिखे।'),
        L('Schedule one support contact within the next 48 hours.', 'अगले 48 घंटे में एक support contact schedule करें।'),
      ],
      action: L('Concrete move: schedule the support contact before you leave this page.', 'Concrete move: page छोड़ने से पहले support contact schedule करें।'),
    })
  } else {
    items.push({
      number: '02', timing: L('SETUP', 'तैयारी'), tone: 'blue',
      title: L('Change one part of the routine that surrounds the use.', 'Use के आसपास की routine का एक हिस्सा बदलें।'),
      body: L(`Your answers point to ${choiceLabel(choices.trigger, trigger, 'en').toLowerCase()} as a repeatable cue. You do not have to redesign your whole life; change one link in the chain.`, `आपके answers में ${choiceLabel(choices.trigger, trigger, 'hi')} एक repeatable cue है। पूरी life redesign करने की जरूरत नहीं — chain की एक link बदलें।`),
      steps: [
        L('Name the place, person or situation you want to make different for the next 7 days.', 'अगले 7 दिनों के लिए वह place, person या situation तय करें जिसे बदलना है।'),
        L('Decide what you will do instead before the situation starts.', 'Situation शुरू होने से पहले तय करें कि उसके बजाय क्या करेंगे।'),
        L('Tell one support person what you are trying to change.', 'एक support person को बताएं कि आप क्या बदलने की कोशिश कर रहे हैं।'),
      ],
      action: L('Concrete move: write one “Before → After” change, e.g. “At my usual trigger time → I go to a different space.”', 'Concrete move: एक “पहले → बाद” change लिखें, जैसे “usual trigger time → मैं दूसरी जगह चला/चली जाता/जाती हूँ।”'),
    })
  }

  // Step 3: why they use.
  const reasonSteps: Record<string, { title: LangText; body: LangText; steps: LangText[]; action: LangText; tone: Tone }> = {
    stress: {
      title: L('Build a response for stress before stress peaks.', 'Stress peak होने से पहले उसका response तय करें।'),
      body: L('You picked stress or difficult emotions as the reason. So your plan needs an alternative that is ready before the feeling becomes overwhelming.', 'आपने stress या difficult emotions को reason चुना। इसलिए alternative feeling बहुत बढ़ने से पहले ready होना चाहिए।'),
      steps: [
        L('Choose one 10-minute reset: step outside, shower, music, slow breathing, journaling, or message your support person.', 'एक 10-minute reset चुनें: बाहर जाना, shower, music, slow breathing, journaling या support person को message।'),
        L('Use the same reset every time this trigger appears so it becomes easier to remember.', 'हर बार same trigger पर वही reset use करें ताकि याद रखना आसान हो।'),
        L('After 10 minutes, decide the next safe step — contact, walk, activity, or professional support.', '10 मिनट बाद next safe step तय करें — contact, walk, activity या professional support।'),
      ],
      action: L('Fill in: “When stress spikes, for 10 minutes I will ____.”', 'पूरा करें: “जब stress बढ़ेगा, 10 मिनट के लिए मैं ____ करूँगा/करूँगी।”'), tone: 'amber',
    },
    escape: {
      title: L('Replace the “switch off” moment, not just the substance.', '“Switch off” वाले moment को replace करें, सिर्फ substance को नहीं।'),
      body: L('You told us the point is escaping or feeling different. The plan therefore gives that moment a replacement activity with a clear beginning and end.', 'आपने बताया कि goal escape या अलग महसूस करना है। इसलिए उस moment के लिए clear beginning और end वाली replacement activity रखी गई है।'),
      steps: [
        L('Pick one short activity you can start immediately: shower, walk, music, game, drawing, journaling or talking to someone.', 'एक short activity चुनें जिसे तुरंत शुरू कर सकें: shower, walk, music, game, drawing, journaling या किसी से बात।'),
        L('Set a 10-minute timer and stay with that activity until the timer ends.', '10-minute timer लगाएँ और timer खत्म होने तक उसी activity में रहें।'),
        L('If the urge is still there, move to your support person or a professional support option instead of staying stuck alone.', 'Urge रहे तो support person या professional support की ओर जाएँ, अकेले stuck न रहें।'),
      ],
      action: L('Make one “switch-off without substances” note on your phone with your chosen activity.', 'Phone में “switch-off without substances” note बनाकर अपनी activity लिखें।'), tone: 'amber',
    },
    sleep: {
      title: L('Treat sleep as a separate problem worth support.', 'Sleep को अलग problem की तरह support दें।'),
      body: L('You picked sleep or calming down as the reason. Rather than using a substance as the sleep strategy, make the sleep problem part of the support conversation.', 'आपने sleep या calming को reason चुना। Substance को sleep strategy बनाने के बजाय sleep problem को support conversation का हिस्सा बनाएं।'),
      steps: [
        L('Write down the nights or situations when sleep is hardest.', 'लिखें कि किन nights या situations में sleep सबसे मुश्किल होती है।'),
        L('Keep one simple wind-down routine for 30 minutes before bed: lower lights, put the phone away, quiet activity, same order.', 'Bed से 30 मिनट पहले simple wind-down रखें: lights कम, phone दूर, quiet activity, same order।'),
        L('Tell a doctor/counsellor that sleep is part of why you use so the underlying problem is not ignored.', 'Doctor/counsellor को बताएं कि sleep use की वजह है ताकि underlying problem ignore न हो।'),
      ],
      action: L('Concrete move: choose your 30-minute wind-down start time for tonight.', 'Concrete move: आज रात 30-minute wind-down का start time तय करें।'), tone: 'blue',
    },
    focus: {
      title: L('Do not make the substance your study or performance tool.', 'Substance को study या performance tool मत बनाएं।'),
      body: L('You picked focus, energy or performance as the reason. Your plan therefore separates the performance problem from the substance use.', 'आपने focus, energy या performance reason चुना। इसलिए plan performance problem और substance use को अलग रखता है।'),
      steps: [
        L('Write the exact performance problem: focus, staying awake, finishing work, or confidence.', 'Exact performance problem लिखें: focus, जागे रहना, work finish करना या confidence।'),
        L('Choose one non-drug routine to test for 7 days: fixed work blocks, movement breaks, food/water, sleep routine, or teacher/counsellor support.', '7 दिन के लिए एक non-drug routine चुनें: fixed work blocks, movement breaks, food/water, sleep routine या teacher/counsellor support।'),
        L('Tell a professional why you were using so the support addresses the actual pressure.', 'Professional को बताएं कि आप क्यों use करते थे ताकि support actual pressure को address करे।'),
      ],
      action: L('Concrete move: write the performance problem in one sentence before you sleep tonight.', 'Concrete move: आज रात सोने से पहले performance problem एक sentence में लिखें।'), tone: 'blue',
    },
    social: {
      title: L('Prepare your line before the social trigger arrives.', 'Social trigger आने से पहले अपनी line तैयार रखें।'),
      body: L('You picked friends, parties or fitting in. A useful plan gives you an exit and a sentence, so you do not have to invent one under pressure.', 'आपने friends, parties या fitting in चुना। Useful plan में exit और एक sentence पहले से तय रहता है।'),
      steps: [
        L('Pick one sentence you can repeat: “I am taking a break from this.”', 'एक sentence तय करें: “I am taking a break from this.”'),
        L('Decide how you will leave the situation if pressure keeps going: call a support person, go to a safe place, or leave with someone you trust.', 'अगर pressure बना रहे तो exit तय रखें: support person को call करें, safe place जाएँ या trusted person के साथ निकलें।'),
        L('Tell one person beforehand what you are trying to change.', 'पहले से एक person को बताएं कि आप क्या बदलने की कोशिश कर रहे हैं।'),
      ],
      action: L('Concrete move: save your one-line response in your phone.', 'Concrete move: अपनी one-line response phone में save करें।'), tone: 'purple',
    },
    pain: {
      title: L('Get the pain problem into the plan.', 'Pain problem को plan में लाएँ।'),
      body: L('You selected physical pain. The right next step is to address the pain with qualified care rather than building a drug-use workaround on your own.', 'आपने physical pain चुना। सही next step qualified care के साथ pain address करना है, खुद drug-use workaround बनाना नहीं।'),
      steps: [
        L('Write where the pain is and when it is hardest, without adding identifying details.', 'Pain कहाँ है और कब सबसे ज्यादा होता है, इतना लिखें — identifying details नहीं।'),
        L('Tell a doctor/counsellor that pain is part of why you use.', 'Doctor/counsellor को बताएं कि pain use की वजह है।'),
        L('Ask for a plan that addresses both the pain and the substance use together.', 'ऐसा plan माँगें जो pain और substance use दोनों को साथ address करे।'),
      ],
      action: L('Concrete move: make the pain/support appointment or ask someone trusted to help you make it.', 'Concrete move: pain/support appointment करें या trusted person से मदद लें।'), tone: 'amber',
    },
  }

  if (reasonSteps[reason]) {
    const r = reasonSteps[reason]
    items.push({ number: '03', timing: L('YOUR WHY', 'आपकी वजह'), ...r })
  } else {
    items.push({
      number: '03', timing: L('YOUR WHY', 'आपकी वजह'), tone: 'amber',
      title: L('Name what the use is doing for you — then solve that part too.', 'Use आपके लिए क्या कर रहा है, उसे नाम दें — फिर उस हिस्से को भी address करें।'),
      body: L(`You selected ${choiceLabel(choices.reason, reason, 'en').toLowerCase()}. Keep that reason visible because changing the habit is easier when the underlying problem is also getting attention.`, `आपने ${choiceLabel(choices.reason, reason, 'hi')} चुना। इस reason को visible रखें क्योंकि underlying problem पर भी ध्यान देने से change ज्यादा workable होता है।`),
      steps: [
        L('Write one sentence: “I usually reach for this when ____.”', 'एक sentence लिखें: “मैं आमतौर पर इसे तब चुनता/चुनती हूँ जब ____।”'),
        L('Choose one safer response you can try for 10 minutes when that situation appears.', 'उस situation पर 10 मिनट के लिए एक safer response चुनें।'),
        L('If the reason keeps coming back, take that exact sentence to a doctor/counsellor or trusted adult.', 'अगर वही reason बार-बार आता है, वही sentence doctor/counsellor या trusted adult को दिखाएँ।'),
      ],
      action: L('Concrete move: finish the sentence before you leave this page.', 'Concrete move: page छोड़ने से पहले sentence पूरा करें।'),
    })
  }

  // Step 4: exact difficult window + trigger.
  let windowSteps: LangText[]
  let windowTitle: LangText
  let windowBody: LangText
  let windowAction: LangText
  let windowTone: Tone = 'purple'
  if (timing === 'social' || trigger === 'friends') {
    windowTitle = L('Create an exit plan for the people and places that pull you back.', 'उन लोगों और जगहों के लिए exit plan बनाएं जो आपको वापस खींचते हैं।')
    windowBody = L(`Your hardest time is ${choiceLabel(choices.timing, timing, 'en').toLowerCase()} and the main trigger is ${choiceLabel(choices.trigger, trigger, 'en').toLowerCase()}.`, `आपका hardest time ${choiceLabel(choices.timing, timing, 'hi')} है और main trigger ${choiceLabel(choices.trigger, trigger, 'hi')} है।`)
    windowSteps = [
      L('Decide where you will go if pressure starts — a family area, friend’s place, school support room, or another safe place.', 'Pressure बढ़े तो कहाँ जाना है तय करें — family area, friend’s place, school support room या कोई safe place।'),
      L('Tell one person before the difficult window starts so you are not making the plan under pressure.', 'Difficult window शुरू होने से पहले एक person को बता दें।'),
      L('Keep your one-line exit sentence ready and leave early rather than waiting until the pressure is at its highest.', 'One-line exit sentence ready रखें और pressure highest होने से पहले निकलें।'),
    ]
    windowAction = L('Concrete move: write the safe place + support person + exit line in one note.', 'Concrete move: safe place + support person + exit line एक note में लिखें।')
  } else if (timing === 'evening' || timing === 'alone' || trigger === 'alone') {
    windowTitle = L('Change what happens in the first 30 minutes of your hardest time.', 'आपके hardest time के पहले 30 minutes को बदलें।')
    windowBody = L(`You chose ${choiceLabel(choices.timing, timing, 'en').toLowerCase()} and ${choiceLabel(choices.trigger, trigger, 'en').toLowerCase()} as your main pattern.`, `आपने ${choiceLabel(choices.timing, timing, 'hi')} और ${choiceLabel(choices.trigger, trigger, 'hi')} चुना है।`)
    windowSteps = [
      L('Move to a shared or safer space before the difficult window begins.', 'Difficult window शुरू होने से पहले shared या safer space में जाएँ।'),
      L('Start one planned activity immediately: music, shower, walk, gaming with friends, reading, or messaging support.', 'तुरंत एक planned activity शुरू करें: music, shower, walk, friends के साथ gaming, reading या support message।'),
      L('Set a 10-minute check-in reminder. When it rings, decide whether you need another 10 minutes or human support.', '10-minute check-in reminder लगाएँ। Ring होने पर decide करें कि next 10 minutes चाहिए या human support।'),
    ]
    windowAction = L('Concrete move: set that reminder now for your chosen difficult time.', 'Concrete move: chosen difficult time के लिए reminder अभी लगाएँ।')
  } else if (timing === 'school-work' || timing === 'after-school') {
    windowTitle = L('Build a clean transition between school/work and the rest of the day.', 'School/work और बाकी दिन के बीच clean transition बनाएं।')
    windowBody = L(`You chose ${choiceLabel(choices.timing, timing, 'en').toLowerCase()} as the hardest window. The plan gives that transition a job instead of leaving it empty.`, `आपने ${choiceLabel(choices.timing, timing, 'hi')} को hardest window चुना। इसलिए उस transition के लिए एक clear activity रखी गई है।`)
    windowSteps = [
      L('Decide where you will go immediately after school/work.', 'School/work के बाद तुरंत कहाँ जाना है तय करें।'),
      L('Add one structured activity to the first 30–60 minutes: sport, food, shower, study space, family time, or a support check-in.', 'पहले 30–60 minutes में एक structured activity रखें: sport, food, shower, study space, family time या support check-in।'),
      L('Do not leave the highest-risk part of the transition completely unplanned.', 'Transition के highest-risk part को completely unplanned न छोड़ें।'),
    ]
    windowAction = L('Concrete move: put the first 30 minutes after school/work into your calendar.', 'Concrete move: school/work के बाद first 30 minutes calendar में डालें।')
    windowTone = 'blue'
  } else {
    windowTitle = L('Use a universal “when this happens, I will…” plan.', 'एक universal “जब यह होगा, मैं…” plan रखें।')
    windowBody = L(`Your trigger is ${choiceLabel(choices.trigger, trigger, 'en').toLowerCase()}. Because it can vary, your response needs to work in more than one setting.`, `आपका trigger ${choiceLabel(choices.trigger, trigger, 'hi')} है। इसलिए response को कई settings में काम करना चाहिए।`)
    windowSteps = [
      L('Pause and move away from the situation for 10 minutes.', 'Pause करें और situation से 10 minutes के लिए थोड़ा दूर जाएँ।'),
      L('Use one prepared reset: breathing, water, shower, walk, music, journaling, or contacting support.', 'एक prepared reset use करें: breathing, पानी, shower, walk, music, journaling या support contact।'),
      L('If the urge stays strong or you feel unsafe, move to human/professional help instead of trying to handle it alone.', 'Urge strong रहे या unsafe feel हो तो human/professional help लें।'),
    ]
    windowAction = L('Concrete move: choose your one universal reset and name it in your phone.', 'Concrete move: अपना universal reset चुनें और phone में नाम से save करें।')
  }
  items.push({ number: '04', timing: L('YOUR WINDOW', 'आपका window'), title: windowTitle, body: windowBody, steps: windowSteps, action: windowAction, tone: windowTone })

  // Step 5: challenge-specific action.
  if (challenge === 'urges') {
    items.push({
      number: '05', timing: L('WHEN THE URGE HITS', 'जब urge आए'), tone: 'red',
      title: L('Run the same 10-minute sequence every time.', 'हर बार same 10-minute sequence चलाएँ।'),
      body: L('You named urges/cravings as the biggest challenge. The point is to make your first response automatic rather than deciding from scratch each time.', 'आपने urges/cravings को biggest challenge चुना। लक्ष्य है first response को automatic बनाना, हर बार scratch से decision न लेना।'),
      steps: [
        L('Minute 0–2: leave the trigger or change rooms/places.', 'Minute 0–2: trigger से दूर जाएँ या room/place बदलें।'),
        L('Minute 2–7: use your chosen reset — walk, shower, music, breathing, journaling, or message support.', 'Minute 2–7: chosen reset करें — walk, shower, music, breathing, journaling या support message।'),
        L('Minute 7–10: contact the person/service you picked and decide your next safe action.', 'Minute 7–10: चुने हुए person/service को contact करें और next safe action तय करें।'),
      ],
      action: L('Save this 10-minute sequence as a phone note called “WHEN IT HITS”.', 'इसे “WHEN IT HITS” नाम की phone note में save करें।'),
    })
  } else if (challenge === 'people') {
    items.push({
      number: '05', timing: L('ENVIRONMENT', 'ENVIRONMENT'), tone: 'purple',
      title: L('Change one person/place/routine before it changes you.', 'एक person/place/routine पहले बदलें, इससे पहले कि वह आपको बदल दे।'),
      body: L('Your biggest challenge is the environment around you, so the plan focuses on one practical change rather than “be stronger”.', 'आपकी biggest challenge आसपास का environment है, इसलिए plan “stronger बनो” के बजाय one practical change पर focus करता है।'),
      steps: [
        L('Circle one recurring place, person or routine connected with use.', 'Use से जुड़ा one recurring place, person या routine चुनें।'),
        L('Decide the exact change for 7 days: avoid the place, shorten the time there, go with a different person, or switch routines.', '7 दिनों के लिए exact change तय करें: place avoid करना, वहाँ कम समय रहना, अलग person के साथ जाना या routine बदलना।'),
        L('Tell one support person so you are not the only one holding the boundary.', 'एक support person को बताएं ताकि boundary सिर्फ आप अकेले न संभालें।'),
      ],
      action: L('Concrete move: write the one boundary in one sentence.', 'Concrete move: one boundary एक sentence में लिखें।'),
    })
  } else if (challenge === 'sleep') {
    items.push({
      number: '05', timing: L('ROUTINE', 'ROUTINE'), tone: 'blue',
      title: L('Give the day a predictable landing point.', 'दिन को एक predictable landing point दें।'),
      body: L('You picked sleep and routine as the main challenge. The plan therefore gives the end of the day a repeatable sequence.', 'आपने sleep और routine को main challenge चुना। इसलिए दिन के end को repeatable sequence दिया गया है।'),
      steps: [
        L('Choose a regular wind-down start time.', 'एक regular wind-down start time चुनें।'),
        L('Keep the order the same: lower stimulation, simple activity, prepare for bed, lights down.', 'Order same रखें: stimulation कम, simple activity, bed preparation, lights down।'),
        L('If sleep is the reason you use, bring the sleep problem to a qualified professional.', 'अगर sleep use की वजह है, तो sleep problem qualified professional तक ले जाएँ।'),
      ],
      action: L('Concrete move: set the wind-down reminder tonight.', 'Concrete move: आज रात wind-down reminder लगाएँ।'),
    })
  } else if (challenge === 'pressure') {
    items.push({
      number: '05', timing: L('PRESSURE PLAN', 'PRESSURE PLAN'), tone: 'amber',
      title: L('Give pressure a person and a place to go.', 'Pressure के लिए एक person और एक place तय करें।'),
      body: L('Family, school or work pressure was your biggest challenge. The plan therefore adds support before pressure peaks.', 'Family, school या work pressure biggest challenge है। इसलिए plan pressure peak होने से पहले support जोड़ता है।'),
      steps: [
        L('Name the pressure you expect: one situation, not your whole life.', 'Expected pressure का one situation चुनें — पूरी life नहीं।'),
        L('Choose the person you will contact when it happens.', 'उस moment पर किस person को contact करना है चुनें।'),
        L('Prepare one sentence: “I am having a rough day and I need you to stay on the phone with me for a few minutes.”', 'एक sentence तैयार रखें: “आज मुश्किल है और मुझे कुछ मिनट आपके साथ बात करनी है।”'),
      ],
      action: L('Concrete move: save that person and sentence before the next difficult day.', 'Concrete move: अगले difficult day से पहले person और sentence save करें।'),
    })
  } else if (challenge === 'alone') {
    items.push({
      number: '05', timing: L('CONNECTION', 'CONNECTION'), tone: 'blue',
      title: L('Make the difficult moment less private.', 'Difficult moment को कम private बनाएं।'),
      body: L('Feeling alone is your main challenge. The answer is not to force yourself to feel different; it is to make contact easier.', 'Feeling alone आपका main challenge है। Answer खुद को force करना नहीं, contact को आसान बनाना है।'),
      steps: [
        L('Pick one person you can message without explaining everything.', 'एक ऐसा person चुनें जिसे बिना पूरी explanation के message कर सकें।'),
        L('Choose a time for one regular check-in this week.', 'इस हफ्ते एक regular check-in का time तय करें।'),
        L('Use the contact when the difficult window starts, not only after the urge gets intense.', 'Contact difficult window शुरू होते ही करें, urge बहुत intense होने के बाद नहीं।'),
      ],
      action: L('Concrete move: send “Can you check in with me tonight?” to your chosen person.', 'Concrete move: chosen person को “Can you check in with me tonight?” भेजें।'),
    })
  } else {
    items.push({
      number: '05', timing: L('KEEP IT REPEATABLE', 'REPEATABLE रखें'), tone: 'teal',
      title: L('Pick one small action you can repeat for 7 days.', 'एक छोटा action चुनें जिसे 7 दिन repeat कर सकें।'),
      body: L(`Your biggest challenge is ${choiceLabel(choices.challenge, challenge, 'en').toLowerCase()}. A repeatable action beats a perfect plan you never use.`, `आपकी biggest challenge ${choiceLabel(choices.challenge, challenge, 'hi')} है। Repeatable action उस perfect plan से बेहतर है जिसे use ही न करें।`),
      steps: [
        L('Choose one action from this plan.', 'इस plan में से एक action चुनें।'),
        L('Attach it to a real moment in your day.', 'उसे दिन के एक real moment से जोड़ें।'),
        L('Mark it as done for 7 days without treating missed days as failure.', '7 दिन तक done mark करें; missed day को failure न समझें।'),
      ],
      action: L('Concrete move: put the action in your calendar now.', 'Concrete move: action अभी calendar में डालें।'),
    })
  }

  // Step 6: goal + support finish line.
  if (goal === 'started' || pattern === 'stopped') {
    items.push({
      number: '06', timing: L('PROTECT PROGRESS', 'PROGRESS बचाएँ'), tone: 'teal',
      title: L('Protect what is already working.', 'जो काम कर रहा है, उसे protect करें।'),
      body: L('You told us you have already started changing or stopped recently. The plan therefore focuses on keeping support close and learning from difficult moments instead of chasing perfection.', 'आपने बताया कि change शुरू हो चुका है या आपने हाल में stop किया है। इसलिए plan support close रखने और difficult moments से सीखने पर focus करता है।'),
      steps: [
        L('Write one thing that has helped you stay on track so far.', 'एक चीज़ लिखें जिसने अब तक track पर रहने में मदद की।'),
        L('Tell your support person which part of the day still feels hardest.', 'Support person को बताएं कि दिन का कौन सा हिस्सा अभी भी hardest है।'),
        L('Plan your next check-in before the current motivation fades.', 'Current motivation कम होने से पहले next check-in plan करें।'),
      ],
      action: L('Concrete move: schedule your next check-in before you close this page.', 'Concrete move: page close करने से पहले next check-in schedule करें।'),
    })
  } else if (goal === 'not-sure') {
    items.push({
      number: '06', timing: L('NO PRESSURE', 'कोई pressure नहीं'), tone: 'blue',
      title: L('Your next goal can be clarity.', 'आपका next goal clarity हो सकता है।'),
      body: L('You are thinking about change, not promising everything today. That is enough to make one honest next move.', 'आप change के बारे में सोच रहे हैं; आज सब promise करना जरूरी नहीं। एक honest next move काफी है।'),
      steps: [
        L('Choose one conversation you are willing to have this week.', 'इस हफ्ते एक ऐसी conversation चुनें जिसके लिए आप ready हैं।'),
        L('Show that person the answers that matter most to you.', 'उस person को अपने important answers दिखाएँ।'),
        L('After the conversation, decide whether the next step is support, a quit/change date, or simply learning more.', 'Conversation के बाद तय करें कि next step support, quit/change date या और information है।'),
      ],
      action: L('Concrete move: book one conversation this week — no bigger promise required.', 'Concrete move: इस हफ्ते one conversation book करें — इससे बड़ा promise जरूरी नहीं।'),
    })
  } else if (goal === 'support-someone') {
    items.push({
      number: '06', timing: L('SHARE THE LOAD', 'जिम्मेदारी बाँटें'), tone: 'blue',
      title: L('Support them without becoming the whole support system.', 'Support दें, लेकिन पूरी support system अकेले न बनें।'),
      body: L('You are helping someone else. Good support includes boundaries, professional help and another person who can step in when needed.', 'आप किसी और की मदद कर रहे हैं। Good support में boundaries, professional help और जरूरत पड़ने पर दूसरा person शामिल होता है।'),
      steps: [
        L('Keep one clear role: listen, encourage, help them reach support.', 'अपना role clear रखें: सुनना, encourage करना, support तक पहुँचने में मदद।'),
        L('Choose another trusted person or service you can involve.', 'एक और trusted person या service चुनें जिसे involve कर सकें।'),
        L('If there is immediate danger, use emergency support instead of trying to manage the situation privately.', 'Immediate danger में emergency support लें, situation को privately manage करने की कोशिश न करें।'),
      ],
      action: L('Concrete move: decide who the second support person is.', 'Concrete move: second support person तय करें।'),
    })
  }

  const title = goal === 'started'
    ? L('Protect the progress you have already started.', 'जो progress शुरू हो चुकी है, उसे protect करें।')
    : goal === 'not-sure'
      ? L('You do not need a perfect answer to take a real step.', 'Real step लेने के लिए perfect answer की जरूरत नहीं।')
      : helping
        ? L('A support plan built around the situation you described.', 'आपकी बताई situation के आसपास बनाया गया support plan।')
        : L('A plan built from your actual answers.', 'आपके actual answers से बना plan।')

  const intro = helping
    ? L('This is a practical starting point, not a diagnosis. It turns the details you shared into concrete things you can do next.', 'यह practical starting point है, diagnosis नहीं। आपके answers को concrete next steps में बदला गया है।')
    : L(`You told us about ${choiceLabel(choices.substance, substance, 'en').toLowerCase()}, how your use usually looks, why it happens, when it is hardest, and what you want to change. That is what shaped these steps.`, `आपने ${choiceLabel(choices.substance, substance, 'hi')}, use का pattern, वजह, मुश्किल समय और अपना goal बताया। इन्हीं details से ये steps बने हैं।`)

  return { title, intro, items: items.slice(0, 6), focus: focus.slice(0, 7) }
}

export default function PersonalPlan() {
  const { language } = useLanguage()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)
  const questionRef = useRef<HTMLDivElement>(null)
  const previousStep = useRef(0)

  useEffect(() => {
    if (step !== previousStep.current && !submitted) {
      window.requestAnimationFrame(() => {
        questionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
    previousStep.current = step
  }, [step, submitted])

  const progress = ((step + 1) / TOTAL_STEPS) * 100
  const plan = useMemo(() => buildPlan(answers), [answers])
  const keyOrder = ['forWho', 'substance', 'amount', 'pattern', 'duration', 'reason', 'timing', 'trigger', 'goal', 'challenge', 'support'] as const
  const currentKey = keyOrder[step]
  const canContinue = Boolean(answers[currentKey])

  function update(key: keyof Answers, value: string) {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  function next() {
    if (!canContinue) return
    if (step === TOTAL_STEPS - 1) {
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setStep(value => value + 1)
  }

  function back() {
    if (step === 0) return
    setStep(value => value - 1)
  }

  function restart() {
    setAnswers(emptyAnswers)
    setStep(0)
    setSubmitted(false)
    setCopied(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function copyPlan() {
    const lines = [plan.title.en, '', ...plan.items.flatMap(item => [
      `${item.number}. ${item.title.en}`,
      item.body.en,
      ...item.steps.map((s, i) => `${i + 1}. ${s.en}`),
    ])]
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // The plan stays visible even when clipboard access is blocked.
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-16">
        <section className="relative overflow-hidden py-20 md:py-24 bg-[#0d1e36] bf-hero">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(26,158,138,.13), transparent 38%), radial-gradient(circle at 85% 15%, rgba(167,139,250,.12), transparent 35%)' }} />
          <div className="max-w-6xl mx-auto px-6 relative">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#54d5bf]/25 bg-[#1a9e8a]/10 px-4 py-2 text-[#54d5bf] text-[11px] font-black uppercase tracking-[0.2em] mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#54d5bf]" /> {tx('Personalised plan ready', 'Personalised plan तैयार है', language)}
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-[#f0ede6] leading-[0.92] mb-6" style={{ fontFamily: 'var(--font-display)' }}>{plan.title[language]}</h1>
                <p className="text-[#aebed0] text-lg leading-relaxed max-w-2xl">{plan.intro[language]}</p>
              </div>
              <div className="lg:w-[330px] rounded-3xl border border-[#526985]/35 bg-[#111f3a]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,.24)]">
                <p className="text-[#8fa3bc] text-[10px] uppercase tracking-[0.2em] font-black mb-3">{tx('Why these steps', 'ये steps क्यों', language)}</p>
                <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
                  {plan.focus.map((item, i) => <div key={i} className="rounded-xl border border-[#1e3050] bg-[#0d1e36] px-3 py-2.5 text-sm text-[#dbe5ef]">{item[language]}</div>)}
                </div>
                <div className="mt-4 pt-4 border-t border-[#1e3050] flex items-center justify-between text-xs text-[#7489a2]">
                  <span>{tx('12 answers used', '12 answers का इस्तेमाल', language)}</span>
                  <span className="text-[#54d5bf] font-bold">{tx('Built for your situation', 'आपकी situation के लिए built', language)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 bg-[#0a1628]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-[#1a9e8a] text-[11px] uppercase tracking-[0.2em] font-black mb-2">{tx('Your plan', 'आपका plan', language)}</p>
                <h2 className="text-3xl md:text-4xl font-black text-[#f0ede6]" style={{ fontFamily: 'var(--font-display)' }}>{tx('Concrete steps. Built around you.', 'Concrete steps. आपके हिसाब से।', language)}</h2>
              </div>
              <button type="button" onClick={copyPlan} className={`self-start md:self-auto rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${copied ? 'border-[#1a9e8a]/45 bg-[#1a9e8a]/10 text-[#54d5bf]' : 'border-[#1e3050] bg-[#111f3a] text-[#c8d8e8] hover:border-[#54d5bf]/35 hover:text-white'}`}>{copied ? tx('Copied ✓', 'Copy हो गया ✓', language) : tx('Copy plan', 'Plan copy करें', language)}</button>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-7 items-start">
              <div className="space-y-4">
                {plan.items.map(item => <PlanCard key={item.number} item={item} language={language} />)}
              </div>

              <aside className="space-y-4 lg:sticky lg:top-24">
                <div className="bf-card rounded-3xl border border-[#a78bfa]/25 bg-[#a78bfa]/7 p-7">
                  <p className="text-[#a78bfa] text-[10px] uppercase tracking-[0.2em] font-black mb-3">{tx('Start here', 'यहाँ से शुरू करें', language)}</p>
                  <h3 className="text-2xl md:text-3xl font-black text-[#f0ede6] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                    {answers.support === 'professional' || answers.support === 'helpline' || answers.support === 'none'
                      ? tx('Make the support contact.', 'Support contact बनाएं।', language)
                      : answers.forWho === 'someone'
                        ? tx('Start the conversation.', 'बातचीत शुरू करें।', language)
                        : tx('Pick one action today.', 'आज एक action चुनें।', language)}
                  </h3>
                  <p className="text-[#9fb0c6] text-sm leading-relaxed">{tx('Do the first step only. The rest of the plan is here when you are ready for it.', 'पहले सिर्फ एक step करें। बाकी plan आपके लिए यहीं है।', language)}</p>
                  <div className="mt-6 grid gap-3">
                    <Link to="/help" className="block text-center bg-[#1a9e8a] hover:bg-[#158a78] text-white font-bold rounded-xl px-5 py-3.5 transition-all">{tx('Find support', 'मदद देखें', language)} →</Link>
                    <Link to="/streak" className="block text-center border border-[#1e3050] bg-[#0d1e36] hover:border-[#a78bfa]/40 text-[#c8d8e8] font-semibold rounded-xl px-5 py-3.5 transition-all">{tx('Track progress', 'Progress track करें', language)} →</Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#60a5fa]/20 bg-[#60a5fa]/6 p-5">
                  <p className="text-[#c8d8e8] text-sm leading-relaxed"><span className="text-[#60a5fa] font-bold">{tx('One important thing:', 'एक जरूरी बात:', language)}</span>{' '}{answers.forWho === 'me' ? tx('If you are under 18, involving a trusted adult can make it safer and easier to follow this plan.', 'अगर आपकी उम्र 18 साल से कम है, तो trusted adult को शामिल करना plan को safer और easier बना सकता है।', language) : tx('This plan is a starting point. Professional support can adapt it to the person’s full situation.', 'यह starting point है। Professional support पूरी situation देखकर इसे adapt कर सकता है।', language)}</p>
                </div>

                <div className="rounded-2xl border border-[#e8a020]/25 bg-[#e8a020]/7 p-5">
                  <p className="text-[#d8c38f] text-sm leading-relaxed"><span className="text-[#e8a020] font-bold">{tx('Not a diagnosis:', 'Diagnosis नहीं:', language)}</span>{' '}{tx('This page does not diagnose addiction, predict withdrawal, or replace professional care. For urgent medical danger in India, call 112.', 'यह page diagnosis, withdrawal prediction या professional care की जगह नहीं है। भारत में urgent medical danger के लिए 112 पर call करें।', language)}</p>
                </div>

                <button onClick={restart} className="w-full rounded-xl border border-transparent py-2 text-sm font-semibold text-[#7086a0] hover:text-[#f0ede6] transition-colors">{tx('Build a new plan', 'नया plan बनाएं', language)}</button>
              </aside>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const renderQuestion = () => {
    switch (step) {
      case 0:
        return <Question title={tx('Who are you filling this in for?', 'आप यह plan किसके लिए भर रहे हैं?', language)} subtitle={tx('Keep it anonymous. You don’t need to enter a name, address or anything that identifies you.', 'इसे anonymous रखें। Name, address या कोई identifying detail देने की जरूरत नहीं है।', language)}><ChoiceGrid value={answers.forWho} options={choices.forWho} language={language} onChange={value => update('forWho', value)} /></Question>
      case 1:
        return <Question title={tx('What are you trying to change?', 'आप क्या बदलना चाहते हैं?', language)} subtitle={tx('This helps us decide which parts of your plan need the most attention.', 'इससे हमें पता चलता है कि आपके plan में किस हिस्से पर ज्यादा ध्यान देना है।', language)}><ChoiceGrid value={answers.substance} options={choices.substance} language={language} onChange={value => update('substance', value)} /></Question>
      case 2:
        return <Question title={tx(`On a usual day, what does your ${choiceLabel(choices.substance, answers.substance, 'en').toLowerCase()} use look like?`, `आपके ${choiceLabel(choices.substance, answers.substance, 'hi')} use का usual day कैसा लगता है?`, language)} subtitle={tx('You don’t need an exact number. Just pick the option that feels closest.', 'Exact number जरूरी नहीं। जो option सबसे close लगे, वही चुनें।', language)}><ChoiceGrid value={answers.amount} options={choices.amount} language={language} onChange={value => update('amount', value)} /></Question>
      case 3:
        return <Question title={tx('How often has this been happening lately?', 'हाल में यह कितनी बार हुआ है?', language)} subtitle={tx('This tells us how much structure and support to put near the front of your plan.', 'इससे पता चलता है कि plan में कितनी structure और support शुरुआत में चाहिए।', language)}><ChoiceGrid value={answers.pattern} options={choices.pattern} language={language} onChange={value => update('pattern', value)} /></Question>
      case 4:
        return <Question title={tx('How long has this been part of your routine?', 'यह आपकी routine का हिस्सा कब से है?', language)} subtitle={tx('A rough answer is enough. You don’t need exact dates.', 'Rough answer काफी है। Exact dates की जरूरत नहीं।', language)}><ChoiceGrid value={answers.duration} options={choices.duration} language={language} onChange={value => update('duration', value)} /></Question>
      case 5:
        return <Question title={tx('What usually makes you use it?', 'आप आमतौर पर इसका इस्तेमाल क्यों करते हैं?', language)} subtitle={tx('Pick the reason that feels most true right now. We’ll use it to shape the plan.', 'अभी सबसे बड़ा reason चुनें। वही reason आपके plan का हिस्सा बनेगा।', language)}><ChoiceGrid value={answers.reason} options={choices.reason} language={language} onChange={value => update('reason', value)} /></Question>
      case 6:
        return <Question title={tx('When is it hardest to stay away?', 'दूर रहना सबसे मुश्किल कब होता है?', language)} subtitle={tx('We’ll use this to make one part of the plan fit that time of day.', 'इस answer से plan का एक हिस्सा उसी मुश्किल समय के हिसाब से बनेगा।', language)}><ChoiceGrid value={answers.timing} options={choices.timing} language={language} onChange={value => update('timing', value)} /></Question>
      case 7:
        return <Question title={tx('What usually sets it off?', 'आमतौर पर इसे trigger क्या करता है?', language)} subtitle={tx('Pick the trigger you notice most. We’ll build an “if this happens, then…” response around it.', 'वह trigger चुनें जो सबसे ज्यादा notice होता है। हम उसी के लिए “अगर यह हुआ, तो…” response बनाएँगे।', language)}><ChoiceGrid value={answers.trigger} options={choices.trigger} language={language} onChange={value => update('trigger', value)} /></Question>
      case 8:
        return <Question title={tx('What do you want to change first?', 'आप सबसे पहले क्या बदलना चाहते हैं?', language)} subtitle={tx('Pick the answer that actually feels true for you right now. There’s no ‘correct’ choice.', 'जो अभी सच में सही लगता है, वही चुनें। यहाँ कोई ‘correct’ answer नहीं है।', language)}><ChoiceGrid value={answers.goal} options={choices.goal} language={language} onChange={value => update('goal', value)} /></Question>
      case 9:
        return <Question title={tx('What do you think will make this hardest?', 'आपके हिसाब से सबसे मुश्किल क्या होगा?', language)} subtitle={tx('This gives the plan one specific problem to work on instead of trying to fix everything at once.', 'इससे plan में एक specific problem पर काम किया जाएगा, सब कुछ एक साथ नहीं।', language)}><ChoiceGrid value={answers.challenge} options={choices.challenge} language={language} onChange={value => update('challenge', value)} /></Question>
      case 10:
        return <Question title={tx('Who could make this a little easier?', 'कौन आपके लिए यह थोड़ा आसान बना सकता है?', language)} subtitle={tx('You only need one person to start. And if that’s nobody yet, that’s okay too.', 'शुरुआत के लिए एक person काफी है। अगर अभी कोई नहीं है, वह भी ठीक है।', language)}><ChoiceGrid value={answers.support} options={choices.support} language={language} onChange={value => update('support', value)} /></Question>
    }
  }

  const current = questionMeta[step][language]

  return (
    <div className="min-h-screen pt-16">
      <section className="py-14 md:py-18 bg-[#0d1e36] relative overflow-hidden bf-hero">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 16% 28%, rgba(26,158,138,.13), transparent 40%), radial-gradient(circle at 84% 10%, rgba(167,139,250,.10), transparent 35%)' }} />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1a9e8a]/30 bg-[#1a9e8a]/10 px-3.5 py-2 text-[#54d5bf] text-[11px] font-black uppercase tracking-[0.2em] mb-5">
                <span className="w-2 h-2 rounded-full bg-[#54d5bf]" /> {tx('Personal Plan', 'Personal Plan', language)}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-[#f0ede6] leading-[0.95]" style={{ fontFamily: 'var(--font-display)' }}>{tx('Tell us what is actually going on. We will turn it into a plan.', 'आपकी situation क्या है, वह बताइए। हम उसे एक plan में बदलेंगे।', language)}</h1>
              <p className="mt-4 text-[#aebed0] text-base max-w-2xl leading-relaxed">{tx('11 quick questions. We use the substance, typical amount pattern, frequency, duration, reason, hardest time, trigger, goal, challenge and support you choose to shape the result.', '11 quick questions। Substance, typical amount, frequency, duration, reason, hardest time, trigger, goal, challenge और support के answers result को shape करेंगे।', language)}</p>
            </div>
            <div className="lg:w-[320px] rounded-3xl border border-[#526985]/30 bg-[#111f3a]/85 p-6 shadow-[0_20px_70px_rgba(0,0,0,.18)]">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] font-black text-[#8fa3bc] mb-3"><span>{current}</span><span>{step + 1}/{TOTAL_STEPS}</span></div>
              <div className="h-2 rounded-full bg-[#0b1830] border border-[#1e3050] overflow-hidden"><div className="h-full bg-gradient-to-r from-[#1a9e8a] via-[#54d5bf] to-[#a78bfa] transition-all duration-500" style={{ width: `${progress}%` }} /></div>
              <div className="mt-4 flex justify-between gap-1">
                {questionMeta.map((_, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${index < step ? 'bg-[#1a9e8a]' : index === step ? 'bg-[#a78bfa]' : 'bg-[#213552]'}`} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">
            <div ref={questionRef} className="bf-card scroll-mt-24 rounded-3xl p-7 md:p-10 border border-[#526985]/30 bg-[#111f3a] shadow-[0_25px_80px_rgba(0,0,0,.2)]">
              {renderQuestion()}
              <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-[#1e3050]">
                <button type="button" onClick={back} disabled={step === 0} className="text-[#8fa3bc] hover:text-[#f0ede6] text-sm font-bold disabled:opacity-30 disabled:pointer-events-none transition-colors">← {tx('Back', 'पीछे', language)}</button>
                <button type="button" onClick={next} disabled={!canContinue} className="bg-[#1a9e8a] hover:bg-[#158a78] disabled:opacity-35 text-white font-black px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(26,158,138,.14)]">{step === TOTAL_STEPS - 1 ? tx('Build my plan', 'मेरा plan बनाएं', language) : tx('Continue', 'आगे', language)} →</button>
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <div className="rounded-3xl border border-[#1e3050] bg-[#0d1e36]/80 p-6">
                <p className="text-[#a78bfa] text-[10px] uppercase tracking-[0.2em] font-black mb-3">{tx('Your plan is taking shape', 'आपका plan बन रहा है', language)}</p>
                {answers.substance || answers.amount || answers.pattern || answers.reason || answers.timing || answers.trigger ? (
                  <div className="space-y-2 text-sm">
                    {answers.substance && <MiniSelection label={tx('Substance', 'Substance', language)} value={choiceLabel(choices.substance, answers.substance, language)} />}
                    {answers.amount && <MiniSelection label={tx('Typical amount', 'आमतौर पर', language)} value={choiceLabel(choices.amount, answers.amount, language)} />}
                    {answers.pattern && <MiniSelection label={tx('Pattern', 'Pattern', language)} value={choiceLabel(choices.pattern, answers.pattern, language)} />}
                    {answers.reason && <MiniSelection label={tx('Why', 'वजह', language)} value={choiceLabel(choices.reason, answers.reason, language)} />}
                    {answers.timing && <MiniSelection label={tx('Hardest time', 'मुश्किल समय', language)} value={choiceLabel(choices.timing, answers.timing, language)} />}
                    {answers.trigger && <MiniSelection label={tx('Trigger', 'Trigger', language)} value={choiceLabel(choices.trigger, answers.trigger, language)} />}
                  </div>
                ) : <p className="text-[#7086a0] text-sm leading-relaxed">{tx('Start answering. This space will show the choices that are actually shaping your plan.', 'Answer देना शुरू करें। यह panel वही details दिखाएगा जो आपके plan को बदल रही हैं।', language)}</p>}
              </div>
              <div className="rounded-2xl border border-[#1e3050] bg-[#111f3a]/70 p-5">
                <p className="text-[#c8d8e8] text-xs leading-relaxed"><span className="font-bold text-[#f0ede6]">{tx('No profile needed.', 'Profile की जरूरत नहीं।', language)}</span> {tx('Your answers stay in this browser page. Do not enter names, addresses or identifying details.', 'आपके answers इसी browser page पर रहते हैं। Names, addresses या identifying details न डालें।', language)}</p>
              </div>
              <div className="rounded-2xl border border-[#a78bfa]/15 bg-[#a78bfa]/5 p-5">
                <p className="text-[#d8d2f1] text-xs leading-relaxed">{tx('The result gives practical next steps, not a diagnosis. For substance-specific treatment or withdrawal questions, a qualified professional should guide the decision.', 'Result practical next steps देता है, diagnosis नहीं। Substance-specific treatment या withdrawal questions में qualified professional को guide करना चाहिए।', language)}</p>
              </div>
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

  return (
    <article className={`group rounded-2xl border ${tone.line} bg-[#111f3a] p-6 md:p-7 shadow-[0_14px_40px_rgba(0,0,0,.12)] transition-all duration-300 hover:-translate-y-0.5`}>
      <div className="flex gap-4">
        <div className={`relative w-11 h-11 shrink-0 rounded-2xl border border-[#31445f] bg-[#0d1e36] flex items-center justify-center font-black text-xs ${tone.num}`}><span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${tone.dot}`} />{item.number}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2"><span className={`text-[10px] uppercase tracking-[0.2em] font-black ${tone.tag}`}>{item.timing[language]}</span></div>
          <h3 className="text-xl md:text-2xl font-black text-[#f0ede6] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{item.title[language]}</h3>
          <p className="text-[#b0bfd0] text-sm md:text-base leading-relaxed">{item.body[language]}</p>
          <div className="mt-5 grid gap-2.5">
            {item.steps.map((step, index) => (
              <div key={index} className="flex gap-3 rounded-xl border border-[#1e3050] bg-[#0d1e36]/65 px-4 py-3">
                <span className="w-6 h-6 rounded-full bg-[#162640] border border-[#31445f] flex items-center justify-center text-[10px] font-black text-[#9fb0c6] shrink-0">{index + 1}</span>
                <p className="text-[#c8d8e8] text-sm leading-relaxed">{step[language]}</p>
              </div>
            ))}
          </div>
          {item.action && <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${tone.action}`}>{item.action[language]}</div>}
        </div>
      </div>
    </article>
  )
}

function ChoiceGrid({ value, options, language, onChange, dangerId }: { value: string; options: Choice[]; language: 'en' | 'hi'; onChange: (value: string) => void; dangerId?: string }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {options.map(option => {
        const active = value === option.id
        const danger = option.id === dangerId
        const hint = language === 'hi' ? option.hintHi : option.hint
        return (
          <button key={option.id} type="button" onClick={() => onChange(option.id)} aria-pressed={active} className={`text-left rounded-2xl border p-5 transition-all duration-200 group ${active ? (danger ? 'border-red-500/50 bg-red-500/10 shadow-[0_0_28px_rgba(239,68,68,.08)]' : 'border-[#1a9e8a]/55 bg-[#1a9e8a]/10 shadow-[0_0_28px_rgba(26,158,138,.08)]') : 'border-[#1e3050] bg-[#0d1e36] hover:border-[#7a8ea5]/35 hover:-translate-y-0.5'}`}>
            <div className="flex items-start gap-4">
              <div className={`w-5 h-5 mt-0.5 shrink-0 rounded-full border flex items-center justify-center ${active ? (danger ? 'border-red-400 bg-red-500' : 'border-[#54d5bf] bg-[#1a9e8a]') : 'border-[#657b96] group-hover:border-[#aebed0]'}`}>
                {active && <span className="w-2 h-2 rounded-full bg-[#0d1e36]" />}
              </div>
              <div className="min-w-0"><div className="text-[#f0ede6] font-bold text-sm leading-relaxed">{option[language]}</div>{hint && <div className="text-[#7086a0] text-xs leading-relaxed mt-1.5">{hint}</div>}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
