import { Link } from 'react-router'
import { useState, type FormEvent } from 'react'
import { useLanguage, tx, translateHindi } from '../i18n'
import BrandLogo from '../components/BrandLogo'

const STATS = [
  { number: '7+ Cr', label: 'People affected by substance use disorder in India', labelHi: 'भारत में substance use disorder से प्रभावित लोग' },
  { number: '1.2 Cr', label: 'Children affected by substance use disorder', labelHi: 'substance use disorder से प्रभावित बच्चे' },
  { number: '58 Lakh', label: 'Women affected by substance use disorder', labelHi: 'substance use disorder से प्रभावित महिलाएं' },
  { number: '28.29 Lakh', label: 'People treated and rehabilitated through government-supported services', labelHi: 'सरकारी सहायता वाली सेवाओं से treatment और rehabilitation पाने वाले लोग' },
]

const FEATURES = [
  {
  to: '/personal-plan',
  icon: (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M7 5h14v18H7z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 10h8M10 14h8M10 18h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 9h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
  ),
  title: 'Personal Plan',
  desc: 'The main BreakFree tool: answer detailed questions and get a plan built around your situation.',
  color: '#a78bfa',
  bg: 'rgba(167,139,250,0.1)',
  border: 'rgba(167,139,250,0.25)',
  },
  {
  to: '/faq',
  icon: (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11 11a3 3 0 0 1 6 0c0 2-3 3-3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="14" cy="20" r="1" fill="currentColor"/>
  </svg>
  ),
  title: "FAQ's",
  desc: 'Straightforward answers about addiction, recovery, and getting help.',
  color: '#1a9e8a',
  bg: 'rgba(26,158,138,0.1)',
  border: 'rgba(26,158,138,0.25)',
  },
  {
  to: '/help',
  icon: (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 4C8.477 4 4 8.477 4 14s4.477 10 10 10 10-4.477 10-10S19.523 4 14 4z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 14s1 3 4 3 4-3 4-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="11" cy="11" r="1" fill="currentColor"/>
    <circle cx="17" cy="11" r="1" fill="currentColor"/>
  </svg>
  ),
  title: 'Help & Support',
  desc: 'Find helplines, counselling options, peer groups, and other places to start.',
  color: '#e8a020',
  bg: 'rgba(232,160,32,0.1)',
  border: 'rgba(232,160,32,0.25)',
  },
  {
  to: '/streak',
  icon: (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 4l2.5 7h7l-5.5 4 2 7-6-4-6 4 2-7L4 11h7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
  ),
  title: 'Streak & Rewards',
  desc: 'Keep track of your days and mark the milestones that matter to you.',
  color: '#a78bfa',
  bg: 'rgba(167,139,250,0.1)',
  border: 'rgba(167,139,250,0.25)',
  },
  {
  to: '/crisis',
  icon: (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 5v10M14 19v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.5 23.5l9.5-19 9.5 19H4.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
  ),
  title: 'Crisis Management',
  desc: 'Find emergency numbers and simple steps for a crisis or relapse.',
  color: '#f87171',
  bg: 'rgba(248,113,113,0.1)',
  border: 'rgba(248,113,113,0.25)',
  },
  {
  to: '/help',
  icon: (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M7 14a7 7 0 0 1 14 0v7H7v-7z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 21v2M18 21v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="14" cy="7" r="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
  ),
  title: 'Peer Support Groups',
  desc: 'Find people you can talk to and support groups where you do not have to explain everything alone.',
  color: '#34d399',
  bg: 'rgba(52,211,153,0.1)',
  border: 'rgba(52,211,153,0.25)',
  },
]

const FEATURE_HI = [
  { title: 'Personal Plan', desc: 'BreakFree का main tool: detailed answers दें और अपनी situation के हिसाब से plan पाएं।' },
  { title: 'सवाल-जवाब', desc: 'लत, रिकवरी और मदद के बारे में आसान जवाब।' },
  { title: 'मदद और सहायता', desc: 'हेल्पलाइन, काउंसलिंग, पीयर सपोर्ट और दूसरे विकल्प देखें।' },
  { title: 'स्ट्रीक और रिवॉर्ड्स', desc: 'अपने दिनों की प्रगति देखें और महत्वपूर्ण पड़ाव दर्ज करें।' },
  { title: 'संकट सहायता', desc: 'आपातकालीन नंबर और संकट की स्थिति में जरूरी कदम देखें।' },
  { title: 'पीयर सपोर्ट', desc: 'बात करने के लिए लोग और सपोर्ट ग्रुप खोजें।' },
]

const STEP_HI = [
  { title: 'स्थिति स्वीकार करें', body: 'जो हो रहा है उसे ईमानदारी से देखना शुरुआत हो सकती है।' },
  { title: 'किसी तक पहुँचें', body: 'किसी भरोसेमंद व्यक्ति, हेल्पलाइन या पेशेवर सहायता से बात करें।' },
  { title: 'अपनी प्रगति देखें', body: 'अगर ट्रैक करना मदद करता है, तो स्ट्रीक पेज पर अपने पड़ाव देखें।' },
  { title: 'जुड़े रहें', body: 'कुछ दिन आसान होंगे और कुछ मुश्किल। मदद करने वाले लोगों को पास रखें।' },
]

const STEPS = [
  {
  num: '01',
  title: 'Acknowledge',
  body: 'You do not have to pretend everything is fine. Being honest about what is going on is a good place to start.',
  },
  {
  num: '02',
  title: 'Reach Out',
  body: 'Talk to someone you trust, call a helpline, or look for professional support. You do not have to handle it by yourself.',
  },
  {
  num: '03',
  title: 'Build Your Streak',
  body: 'If tracking your days helps you, use the streak page to see your progress and mark milestones.',
  },
  {
  num: '04',
  title: 'Stay Connected',
  body: 'Some days will be easier than others. Keep the people and support that help you close by.',
  },
]

const RECOVERY_STORIES = [
  {
    name: 'Raju',
    meta: '23 · Ahmedabad, Gujarat',
    source: 'Government of India · Ministry of Social Justice & Empowerment',
    url: 'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2309207&lang=1&reg=3',
    title: 'From instability to a steadier life',
    body: 'Raju received treatment, individual and family counselling, rehabilitation support and follow-up care through an IRCA in Ahmedabad. The Government of India reports that he is now working full-time and rebuilding confidence, stability and financial independence.',
    hiName: 'राजू',
    hiMeta: '23 · अहमदाबाद, गुजरात',
    hiTitle: 'अस्थिरता से एक स्थिर जीवन की ओर',
    hiBody: 'राजू ने अहमदाबाद के एक IRCA में treatment, individual और family counselling, rehabilitation और follow-up support लिया। भारत सरकार के अनुसार, वह अब full-time काम कर रहे हैं और confidence, stability और financial independence फिर से बना रहे हैं।',
  },
  {
    name: 'Rahul Llowang',
    meta: '27 · Tirap, Arunachal Pradesh',
    source: 'Government of India · Ministry of Social Justice & Empowerment',
    url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2309673&lang=2&reg=48',
    title: 'Treatment helped him move towards self-reliance',
    body: 'After receiving treatment, counselling and rehabilitation support through a District De-Addiction Centre under NAPDDR, Rahul began rebuilding his confidence and future. The Government reports that he is now self-employed and moving towards greater financial independence.',
    hiName: 'राहुल लोवांग',
    hiMeta: '27 · तिरप, अरुणाचल प्रदेश',
    hiTitle: 'मदद ने उन्हें self-reliance की ओर बढ़ने में मदद की',
    hiBody: 'NAPDDR के तहत District De-Addiction Centre में treatment, counselling और rehabilitation मिलने के बाद राहुल ने अपने confidence और future को फिर से बनाना शुरू किया। भारत सरकार के अनुसार, वह अब self-employed हैं और अधिक financial independence की ओर बढ़ रहे हैं।',
  },
  {
    name: 'Sajjad',
    meta: '25 · Budgam, Jammu & Kashmir',
    source: 'Government of India · Ministry of Social Justice & Empowerment',
    url: 'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2313416&lang=1&reg=3',
    title: 'Back to sport, work and purpose',
    body: 'Sajjad received medical care, counselling, psychological support, skills training, sports reintegration and follow-up support at a District De-Addiction Centre. The Government reports that he resumed sporting activities and now encourages other young people to seek help.',
    hiName: 'सज्जाद',
    hiMeta: '25 · बडगाम, जम्मू-कश्मीर',
    hiTitle: 'खेल, काम और एक उद्देश्य की ओर वापसी',
    hiBody: 'सज्जाद ने District De-Addiction Centre में medical care, counselling, psychological support, skills training, sports reintegration और follow-up support लिया। भारत सरकार के अनुसार, उन्होंने खेल में वापसी की और अब दूसरे युवाओं को मदद लेने के लिए encourage करते हैं।',
  },
  {
    name: 'Rajveer',
    meta: '28 · Darbhanga, Bihar',
    source: 'Government of India · Ministry of Social Justice & Empowerment',
    url: 'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2314024&lang=1&reg=3',
    title: 'Support helped rebuild daily life and family connection',
    body: 'Rajveer received professional treatment, counselling and family support at ROSHANI IRCA. The Government reports that he is living with his family and has started a small business with their support, while continuing towards a healthier, substance-free life.',
    hiName: 'राजवीर',
    hiMeta: '28 · दरभंगा, बिहार',
    hiTitle: 'मदद से रोज़मर्रा की ज़िंदगी और family connection फिर बना',
    hiBody: 'राजवीर ने ROSHANI IRCA में professional treatment, counselling और family support लिया। भारत सरकार के अनुसार, वह अब अपने परिवार के साथ रह रहे हैं और उनके support से एक छोटा business शुरू किया है, साथ ही एक healthier, substance-free life की ओर बढ़ रहे हैं।',
  },
  {
    name: 'Garry',
    meta: '27 · Tseminyu, Nagaland',
    source: 'Government of India · Ministry of Social Justice & Empowerment',
    url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2307588&lang=2&reg=48',
    title: 'A second chance became a new direction',
    body: 'Garry received counselling, psychological support, rehabilitation, family support and continued follow-up through a District De-Addiction Centre. The Government reports that he is maintaining sobriety, is self-employed and is rebuilding his place in his community.',
    hiName: 'गैरी',
    hiMeta: '27 · त्सेमिन्यु, नागालैंड',
    hiTitle: 'एक दूसरा मौका, एक नई दिशा',
    hiBody: 'गैरी ने District De-Addiction Centre के जरिए counselling, psychological support, rehabilitation, family support और regular follow-up लिया। भारत सरकार के अनुसार, वह sobriety बनाए हुए हैं, self-employed हैं और अपने community में फिर से जुड़ रहे हैं।',
  },
  {
    name: 'Karan',
    meta: '28 · Uttar Dinajpur, West Bengal',
    source: 'Government of India · Ministry of Social Justice & Empowerment',
    url: 'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2315990&lang=1&reg=3',
    title: 'Steady support helped restore trust and stability',
    body: 'Karan received treatment, counselling, family support and continued after-care at a District De-Addiction Centre. The Government reports that he is now doing regular work, improving his financial stability and continuing his recovery journey.',
    hiName: 'करण',
    hiMeta: '28 · उत्तर दिनाजपुर, पश्चिम बंगाल',
    hiTitle: 'लगातार support से trust और stability वापस आई',
    hiBody: 'करण ने District De-Addiction Centre में treatment, counselling, family support और continued after-care लिया। भारत सरकार के अनुसार, वह अब regular work कर रहे हैं, financial stability सुधार रहे हैं और recovery journey जारी रखे हुए हैं।',
  },
]



export default function Home() {
  const { language } = useLanguage()
  const [pledgeName, setPledgeName] = useState('')
  const [pledged, setPledged] = useState(false)
  const [storyPage, setStoryPage] = useState(0)

  const storyPages = [RECOVERY_STORIES.slice(0, 3), RECOVERY_STORIES.slice(3, 6)]

  function handlePledge(e: FormEvent) {
  e.preventDefault()
  if (pledgeName.trim()) setPledged(true)
  }

  return (
  <>
  {/* ── HERO ── */}
  <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16 bf-hero">
    <div className="absolute inset-0">
    <img
    src="https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=1600&h=900&fit=crop&auto=format"
    alt="Youth walking toward light"
    className="w-full h-full object-cover opacity-15"
    />
    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a1628 0%, rgba(10,22,40,0.95) 60%, #0d2438 100%)' }} />
    </div>
    <div className="absolute top-40 right-0 w-96 h-96 rounded-full bg-[#1a9e8a]/8 blur-3xl pointer-events-none" />
    <div className="absolute bottom-20 left-0 w-96 h-96 rounded-full bg-[#e8a020]/6 blur-3xl pointer-events-none" />

    <div className="relative max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-16 items-center">
    <div>
    <div className="text-[#8fa3bc] text-xs font-semibold tracking-[0.18em] uppercase mb-8">
      JITAI <span className="text-[#6f839d] tracking-normal normal-case font-medium">(Just in Time Adaption Initiative)</span>
    </div>

    <BrandLogo className="h-14 md:h-16 w-auto mb-7 opacity-95" />

    <h1
      className="text-6xl lg:text-8xl font-black leading-[0.9] mb-6"
      style={{ fontFamily: 'var(--font-display)', color: '#f0ede6' }}
    >
      {tx('Break', 'ब्रेक', language)}<br />
      <em className="not-italic" style={{ color: '#1a9e8a' }}>{tx('Free.', 'फ्री।', language)}</em><br />
    </h1>

    <p className="text-lg text-[#8fa3bc] leading-relaxed mb-10 max-w-lg">
      {tx('A place to learn, find support, and take things one day at a time.', 'सीखने, मदद पाने और एक-एक दिन आगे बढ़ने की जगह।', language)}
      <strong className="text-[#f0ede6]"> {tx('You do not need to figure everything out today.', 'आपको आज सब कुछ समझने की जरूरत नहीं है।', language)}</strong>
    </p>

    <div className="flex flex-wrap gap-4">
      <Link
      to="/personal-plan"
      className="inline-flex items-center gap-2 bg-[#a78bfa] hover:bg-[#b39cff] text-[#0a1628] font-bold px-6 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#a78bfa]/25 hover:-translate-y-0.5 text-sm"
      >
      {tx('Build My Plan', 'मेरा Plan बनाएं', language)} →
      </Link>
      <Link
      to="/crisis"
      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-red-600/30 hover:-translate-y-0.5 text-sm"
      >
      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
      {tx('Crisis Help', 'तुरंत मदद', language)}
      </Link>
      <Link
      to="/streak"
      className="inline-flex items-center gap-2 bg-[#1a9e8a] hover:bg-[#158a78] text-white font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#1a9e8a]/30 hover:-translate-y-0.5 text-sm"
      >
      {tx('Track Your Days', 'अपनी प्रगति देखें', language)} →
      </Link>
      <Link
      to="/help"
      className="inline-flex items-center gap-2 border border-[#1e3050] hover:border-[#1a9e8a]/50 text-[#c8d8e8] hover:text-white font-medium px-6 py-3.5 rounded-full transition-all duration-200 text-sm"
      >
      {tx('Get Support', 'मदद पाएं', language)}
      </Link>
    </div>
    <p className="mt-7 text-sm text-[#8fa3bc] max-w-md italic">“{tx('You do not have to have everything figured out. You just have to start.', 'आपको सब कुछ समझना जरूरी नहीं है। बस शुरुआत करनी है।', language)}”</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 gap-4">
    {STATS.map((s, i) => (
      <div
      key={i}
      className="bf-card bg-[#111f3a]/80 border border-[#1e3050] rounded-2xl p-6 hover:border-[#1a9e8a]/30 transition-colors duration-300"
      >
      <div
      className="text-4xl font-black mb-1"
      style={{ fontFamily: 'var(--font-display)', color: i % 2 === 0 ? '#1a9e8a' : '#e8a020' }}
      >
      {s.number}
      </div>
      <p className="text-[#c8d8e8] text-sm leading-snug">{language === 'hi' ? translateHindi(s.labelHi) : s.label}</p>
      </div>
    ))}
    </div>
    <div className="mt-4 col-span-2 text-center">
      <p className="text-[#6f839d] text-[11px] leading-relaxed max-w-xl mx-auto">
        {tx('Sources: Government of India National Survey (2018; report 2019) and Ministry updates through 2026.', 'स्रोत: भारत सरकार का National Survey (2018; report 2019) और 2026 तक के Ministry updates।', language)}
      </p>
      <a href="https://socialjustice.gov.in/common/47564" target="_blank" rel="noreferrer" className="inline-block mt-2 text-[#54d5bf] hover:text-white text-[11px] underline underline-offset-2">
        {tx('Government of India source', 'भारत सरकार का source', language)} ↗
      </a>
    </div>
    </div>

    <div className="relative flex justify-center pb-10">
    <div className="flex flex-col items-center gap-1 text-[#8fa3bc]">
    <span className="text-xs tracking-widest uppercase">{tx('Explore', 'देखें', language)}</span>
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="animate-bounce">
      <path d="M8 2v12M4 10l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    </div>
    </div>
  </section>

  {/* ── PERSONAL PLAN TEASER ── */}
  <section className="py-8 bg-[#0a1628] bf-section-edge">
    <div className="max-w-7xl mx-auto px-6">
      <Link to="/personal-plan" className="group block rounded-3xl border border-[#a78bfa]/25 bg-gradient-to-r from-[#151633] via-[#111f3a] to-[#0d1e36] p-6 md:p-7 hover:border-[#a78bfa]/55 hover:shadow-[0_22px_60px_rgba(0,0,0,.24),0_0_34px_rgba(167,139,250,.08)] transition-all duration-300 hover:-translate-y-1 bf-shine">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#a78bfa]/12 border border-[#a78bfa]/25 flex items-center justify-center text-[#a78bfa] text-xl">✦</div>
            <div>
              <p className="text-[#a78bfa] text-xs uppercase tracking-[0.2em] font-bold mb-1">{tx('Personal Plan · Main Feature', 'Personal Plan · Main Feature', language)}</p>
              <h2 className="text-xl md:text-2xl font-black text-[#f0ede6]" style={{ fontFamily: 'var(--font-display)' }}>{tx('The main BreakFree tool — built from what you actually tell us.', 'BreakFree का main tool — आपके बताए details के आधार पर।', language)}</h2>
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center gap-2 text-[#c8d8e8] group-hover:text-white text-sm font-bold border border-[#1e3050] group-hover:border-[#a78bfa]/40 rounded-full px-5 py-3 transition-all">{tx('Build my plan', 'मेरा plan बनाएं', language)} <span className="transition-transform group-hover:translate-x-1">→</span></span>
        </div>
      </Link>
    </div>
  </section>

  {/* ── FEATURES GRID ── */}
  <section className="py-24 bg-[#0d1e36]">
    <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
    <p className="text-[#1a9e8a] text-xs font-semibold uppercase tracking-widest mb-4">{tx('What you can use', 'क्या-क्या इस्तेमाल कर सकते हैं', language)}</p>
    <h2
      className="text-4xl md:text-5xl font-black text-[#f0ede6] leading-tight"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {tx('Start here', 'यहाँ से शुरू करें', language)}
    </h2>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {FEATURES.map((f, i) => (
      <Link
      key={i}
      to={f.to}
      className={`group relative bf-card bf-shine bg-[#111f3a] rounded-2xl p-7 ${i === 0 ? 'lg:col-span-2' : ''}`}
      style={{
      border: `1px solid ${f.border}`,
      }}
      >
      <div
      className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
      style={{ background: f.bg, color: f.color }}
      >
      {f.icon}
      </div>
      <h3
      className="text-lg font-bold text-[#f0ede6] mb-2"
      style={{ fontFamily: 'var(--font-display)' }}
      >
      {language === 'hi' ? translateHindi(FEATURE_HI[i].title) : f.title}
      </h3>
      <p className="text-[#8fa3bc] text-sm leading-relaxed mb-5">{language === 'hi' ? translateHindi(FEATURE_HI[i].desc) : f.desc}</p>
      <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: f.color }}>
      {tx('Explore', 'देखें', language)}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-200 group-hover:translate-x-1">
        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      </div>
      </Link>
    ))}
    </div>
    </div>
  </section>

  {/* ── HOW IT WORKS ── */}
  <section className="py-24 bg-[#0a1628]">
    <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
    <p className="text-[#e8a020] text-xs font-semibold uppercase tracking-widest mb-4">{tx('If you are ready to make a change', 'अगर आप बदलाव के लिए तैयार हैं', language)}</p>
    <h2
      className="text-4xl md:text-5xl font-black text-[#f0ede6] leading-tight"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {tx('A simple place to start', 'शुरुआत की आसान जगह', language)}
    </h2>
    </div>

    <div className="grid md:grid-cols-4 gap-6 relative">
    {/* connector line */}
    <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#1a9e8a]/20 via-[#1a9e8a]/60 to-[#1a9e8a]/20" />

    {STEPS.map((s, i) => (
      <div key={i} className="relative flex flex-col items-center text-center md:items-start md:text-left">
      <div className="relative z-10 w-20 h-20 rounded-2xl bg-[#111f3a] border border-[#1a9e8a]/30 flex flex-col items-center justify-center mb-6 hover:border-[#1a9e8a]/70 transition-colors duration-200">
      <span className="text-[#1a9e8a] text-xs font-mono font-bold tracking-widest">{s.num}</span>
      </div>
      <h3
      className="text-lg font-bold text-[#f0ede6] mb-2"
      style={{ fontFamily: 'var(--font-display)' }}
      >
      {language === 'hi' ? translateHindi(STEP_HI[i].title) : s.title}
      </h3>
      <p className="text-[#8fa3bc] text-sm leading-relaxed">{language === 'hi' ? translateHindi(STEP_HI[i].body) : s.body}</p>
      </div>
    ))}
    </div>
    </div>
  </section>

  {/* ── RECOVERY STORIES ── */}
  <section className="py-24 bg-[#0d1e36]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
        <div>
          <p className="text-[#1a9e8a] text-xs font-semibold uppercase tracking-widest mb-4">{tx('Real recovery stories', 'वास्तविक रिकवरी की कहानियाँ', language)}</p>
          <h2 className="text-4xl md:text-5xl font-black text-[#f0ede6] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {tx('Recovery can look different for everyone.', 'हर व्यक्ति की recovery अलग दिख सकती है।', language)}<br />
            <em className="not-italic text-[#1a9e8a]">{tx('But support matters.', 'लेकिन support मायने रखता है।', language)}</em>
          </h2>
          <p className="text-[#8fa3bc] text-sm md:text-base leading-relaxed max-w-2xl mt-5">
            {tx('These stories are based on recovery beneficiaries reported by India’s Ministry of Social Justice & Empowerment. Names are shown as reported, with some changed for confidentiality.', 'ये कहानियाँ भारत के Ministry of Social Justice & Empowerment द्वारा रिपोर्ट किए गए recovery beneficiaries पर आधारित हैं। गोपनीयता के लिए कुछ नाम बदले गए हैं।', language)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={tx('Show more recovery stories', 'और recovery stories दिखाएँ', language)}
            onClick={() => setStoryPage((page) => (page + 1) % storyPages.length)}
            className="w-9 h-9 rounded-full border border-[#1e3050] text-[#8fa3bc] hover:text-[#f0ede6] hover:border-[#1a9e8a]/50 hover:bg-[#1a9e8a]/10 transition-all duration-200 flex items-center justify-center text-sm"
          >
            →
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${storyPage * 100}%)` }}>
          {storyPages.map((page, pageIndex) => (
            <div key={pageIndex} className="min-w-full grid md:grid-cols-3 gap-6 px-0.5">
              {page.map((story) => (
                <article key={story.name} className="bf-card bg-[#111f3a] border border-[#1e3050] rounded-2xl p-7 hover:border-[#1a9e8a]/40 transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div>
                      <p className="text-[#a78bfa] text-xs font-bold uppercase tracking-widest mb-1">{tx(story.name, story.hiName, language)}</p>
                      <p className="text-[#657b96] text-xs">{tx(story.meta, story.hiMeta, language)}</p>
                    </div>
                    <span className="shrink-0 w-9 h-9 rounded-xl bg-[#1a9e8a]/10 border border-[#1a9e8a]/20 flex items-center justify-center text-[#1a9e8a]">↗</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#f0ede6] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                    {tx(story.title, story.hiTitle, language)}
                  </h3>
                  <p className="text-[#8fa3bc] text-sm leading-relaxed flex-1">{tx(story.body, story.hiBody, language)}</p>
                  <div className="mt-6 pt-5 border-t border-[#1e3050]">
                    <p className="text-[#657b96] text-[11px] leading-relaxed mb-3">{tx(story.source, 'भारत सरकार · सामाजिक न्याय और अधिकारिता मंत्रालय', language)}</p>
                    <a href={story.url} target="_blank" rel="noreferrer" className="text-[#1a9e8a] hover:underline text-xs font-semibold">{tx('Read the source story →', 'Source story पढ़ें →', language)}</a>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-7" aria-hidden="true">
        {storyPages.map((_, index) => (
          <button key={index} type="button" onClick={() => setStoryPage(index)} className={`h-1.5 rounded-full transition-all ${index === storyPage ? 'w-8 bg-[#1a9e8a]' : 'w-2 bg-[#1e3050]'}`} />
        ))}
      </div>
    </div>
  </section>

  {/* ── PLEDGE BANNER ── */}
  <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d2438 0%, #0a1628 50%, #0d1a2e 100%)' }}>
    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 60% 50%, rgba(26,158,138,0.1) 0%, transparent 65%)' }} />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#1a9e8a]/30 to-transparent" />

    <div className="relative max-w-2xl mx-auto px-6 text-center">
    <p className="text-[#1a9e8a] text-xs font-semibold uppercase tracking-widest mb-4">{tx('Your choice', 'आपका फैसला', language)}</p>
    <h2
    className="text-4xl md:text-6xl font-black text-[#f0ede6] leading-tight mb-6"
    style={{ fontFamily: 'var(--font-display)' }}
    >
    {tx('Make a personal pledge', 'एक निजी संकल्प लें', language)}
    </h2>
    <p className="text-[#8fa3bc] leading-relaxed mb-10">
    {tx('If this matters to you, write your name down and make the pledge for yourself.', 'अगर यह आपके लिए मायने रखता है, अपना नाम लिखें और अपने लिए यह संकल्प लें।', language)}
    </p>

    {!pledged ? (
    <form onSubmit={handlePledge} className="space-y-4">
      <div className="bg-[#111f3a] border border-[#1e3050] rounded-xl p-6 text-left mb-6">
      <p className="text-[#c8d8e8] text-sm leading-relaxed italic">
      "I, <span className="text-[#e8a020] font-semibold">{pledgeName || '[Your Name]'}</span>, want to stay away from drugs and look after my health. If I need help, I will ask for it."
      </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
      <input
      type="text"
      value={pledgeName}
      onChange={e => setPledgeName(e.target.value)}
      placeholder="{tx('Enter your full name', 'अपना पूरा नाम लिखें', language)}"
      required
      className="flex-1 bg-[#111f3a] border border-[#1e3050] focus:border-[#1a9e8a] text-[#f0ede6] placeholder-[#8fa3bc] rounded-xl px-5 py-3.5 outline-none transition-colors duration-200 text-sm"
      />
      <button
      type="submit"
      className="bg-[#1a9e8a] hover:bg-[#158a78] text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#1a9e8a]/30 text-sm whitespace-nowrap"
      >
      {tx('I Pledge', 'मैं संकल्प लेता/लेती हूँ', language)} →
      </button>
      </div>
    </form>
    ) : (
    <div className="bg-[#111f3a] border border-[#1a9e8a]/40 rounded-2xl p-10 text-center">
      <div className="text-5xl mb-4">🌿</div>
      <h3 className="text-2xl font-black text-[#1a9e8a] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
      Thanks, {pledgeName}!
      </h3>
      <p className="text-[#c8d8e8] text-sm mb-6">Your pledge is saved on this page. If you want more support, you can check the resources or streak page.</p>
      <div className="flex justify-center gap-4 flex-wrap">
      <Link to="/streak" className="bg-[#1a9e8a]/20 border border-[#1a9e8a]/40 text-[#1a9e8a] hover:bg-[#1a9e8a]/30 font-medium px-6 py-2.5 rounded-full text-sm transition-colors duration-200">
      {tx('Track Your Days', 'अपनी प्रगति देखें', language)} →
      </Link>
      <button onClick={() => { setPledged(false); setPledgeName('') }} className="text-[#8fa3bc] hover:text-[#f0ede6] text-sm underline">
      {tx('Pledge Again', 'फिर से संकल्प लें', language)}
      </button>
      </div>
    </div>
    )}
    </div>
  </section>
  </>
  )
}
