import { Link } from 'react-router'
import { useState, type FormEvent } from 'react'
import { useLanguage, tx } from '../i18n'

const STATS = [
  { number: '7.5 Cr', label: 'Indians with drug use disorders' },
  { number: '18', label: 'Avg age of first drug use' },
  { number: '93%', label: 'Recovery rate with support' },
  { number: '14 Lakh', label: 'Quit successfully each year' },
]

const FEATURES = [
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
  to: '/next-step',
  icon: (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M5 14h14M14 8l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="6" cy="14" r="2" fill="currentColor"/>
  </svg>
  ),
  title: 'Next Step',
  desc: 'Pick what is closest to your situation and get a clear place to start.',
  color: '#60a5fa',
  bg: 'rgba(96,165,250,0.1)',
  border: 'rgba(96,165,250,0.25)',
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
  {
  to: '/contact',
  icon: (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="4" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 9l10 7 10-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
  ),
  title: 'Contact Us',
  desc: 'Have a question about the project? Send us a message.',
  color: '#60a5fa',
  bg: 'rgba(96,165,250,0.1)',
  border: 'rgba(96,165,250,0.25)',
  },
]

const FEATURE_HI = [
  { title: 'सवाल-जवाब', desc: 'लत, रिकवरी और मदद के बारे में आसान जवाब।' },
  { title: 'अगला कदम', desc: 'अपनी स्थिति चुनें और एक साफ अगला कदम पाएं।' },
  { title: 'मदद और सहायता', desc: 'हेल्पलाइन, काउंसलिंग, पीयर सपोर्ट और दूसरे विकल्प देखें।' },
  { title: 'स्ट्रीक और रिवॉर्ड्स', desc: 'अपने दिनों की प्रगति देखें और महत्वपूर्ण पड़ाव दर्ज करें।' },
  { title: 'संकट सहायता', desc: 'आपातकालीन नंबर और संकट की स्थिति में जरूरी कदम देखें।' },
  { title: 'पीयर सपोर्ट', desc: 'बात करने के लिए लोग और सपोर्ट ग्रुप खोजें।' },
  { title: 'संपर्क करें', desc: 'प्रोजेक्ट के बारे में सवाल है? हमें संदेश भेजें।' },
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

const TESTIMONIALS = [
  {
  name: 'Rohan M., 22',
  city: 'Bihar',
  quote: 'Before I quit, most of my day revolved around using. Once I got help, I started showing up to college again, sleeping better, and making plans instead of putting everything off.',
  avatar: 'RM',
  },
  {
  name: 'Priya K., 19',
  city: 'Maharashtra',
  quote: 'Quitting did not magically fix my life. What changed was that I stopped hiding so much from my family, had more energy, and started enjoying ordinary days again.',
  avatar: 'PK',
  },
  {
  name: 'Arjun S., 25',
  city: 'Telangana',
  quote: 'I did not realise how much time and money I was losing until I stopped. I got back into football and slowly started talking to friends I had pushed away.',
  avatar: 'AS',
  },
  {
  name: 'Kabir R., 21',
  city: 'Delhi',
  quote: 'I was worried that quitting would mean losing all my friends. I ended up meeting people who were into other things, and my weekends finally feel normal again.',
  avatar: 'KR',
  },
  {
  name: 'Meera S., 24',
  city: 'Karnataka',
  quote: 'The changes were small at first. I was eating with my family again, going for walks, and waking up feeling less exhausted. I started appreciating normal stuff.',
  avatar: 'MS',
  },
  {
  name: 'Dev A., 27',
  city: 'Maharashtra',
  quote: 'I had to rebuild a lot after quitting. I got more serious about work, started saving money, and slowly earned trust back at home. I still have rough days, but I know what to do when they come.',
  avatar: 'DA',
  },
]

export default function Home() {
  const { language } = useLanguage()
  const [pledgeName, setPledgeName] = useState('')
  const [pledged, setPledged] = useState(false)
  const [testimonialPage, setTestimonialPage] = useState(0)

  const testimonialPages = [
  TESTIMONIALS.slice(0, 3),
  TESTIMONIALS.slice(3, 6),
  ]

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
    <div className="inline-flex items-center gap-2 bg-[#1a9e8a]/15 border border-[#1a9e8a]/30 rounded-full px-4 py-1.5 mb-8">
      <div className="w-2 h-2 rounded-full bg-[#1a9e8a] animate-pulse" />
    </div>

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
      <p className="text-[#c8d8e8] text-sm leading-snug">{language === 'hi' ? ['ड्रग उपयोग विकार वाले भारतीय', 'ड्रग का पहली बार उपयोग करने की औसत उम्र', 'सहायता के साथ रिकवरी दर', 'हर साल सफलतापूर्वक छोड़ने वाले'][i] : s.label}</p>
      </div>
    ))}
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
      className={`group relative bf-card bf-shine bg-[#111f3a] rounded-2xl p-7 ${i === 6 ? 'lg:col-start-2' : ''}`}
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
      {language === 'hi' ? FEATURE_HI[i].title : f.title}
      </h3>
      <p className="text-[#8fa3bc] text-sm leading-relaxed mb-5">{language === 'hi' ? FEATURE_HI[i].desc : f.desc}</p>
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
      {language === 'hi' ? STEP_HI[i].title : s.title}
      </h3>
      <p className="text-[#8fa3bc] text-sm leading-relaxed">{language === 'hi' ? STEP_HI[i].body : s.body}</p>
      </div>
    ))}
    </div>
    </div>
  </section>

  {/* ── TESTIMONIALS ── */}
  <section className="py-24 bg-[#0d1e36]">
    <div className="max-w-7xl mx-auto px-6">
    <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
    <div>
      <p className="text-[#1a9e8a] text-xs font-semibold uppercase tracking-widest mb-4">{tx('Stories from recovery', 'रिकवरी की कहानियाँ', language)}</p>
      <p className="text-[#8fa3bc] text-xs mb-4">{tx('Example stories written for this school project.', 'इस स्कूल प्रोजेक्ट के लिए लिखी गई उदाहरण कहानियाँ।', language)}</p>
      <h2
      className="text-4xl md:text-5xl font-black text-[#f0ede6] leading-tight"
      style={{ fontFamily: 'var(--font-display)' }}
      >
      {tx('What changed for them.', 'उनकी जिंदगी में क्या बदला।', language)}<br />
      <em className="not-italic text-[#1a9e8a]">{tx('One day at a time.', 'एक-एक दिन आगे।', language)}</em>
      </h2>
    </div>
    <div className="flex items-center gap-3">
      <Link
      to="/help"
      className="text-[#8fa3bc] hover:text-[#f0ede6] text-sm border border-[#1e3050] hover:border-[#1a9e8a]/40 px-5 py-2.5 rounded-full transition-all duration-200"
      >
      {tx('Find support', 'मदद पाएं', language)} →
      </Link>
      <button
      type="button"
      aria-label="Show more recovery stories"
      onClick={() => setTestimonialPage((page) => (page + 1) % testimonialPages.length)}
      className="w-8 h-8 rounded-full border border-[#1e3050] text-[#8fa3bc] hover:text-[#f0ede6] hover:border-[#1a9e8a]/50 hover:bg-[#1a9e8a]/10 transition-all duration-200 flex items-center justify-center text-sm"
      >
      →
      </button>
    </div>
    </div>

    <div className="overflow-hidden">
    <div
      className="flex transition-transform duration-500 ease-out"
      style={{ transform: `translateX(-${testimonialPage * 100}%)` }}
    >
      {testimonialPages.map((page, pageIndex) => (
      <div key={pageIndex} className="min-w-full grid md:grid-cols-3 gap-6 px-0.5">
      {page.map((t, i) => (
        <div key={i} className="bf-card bg-[#111f3a] border border-[#1e3050] rounded-2xl p-7 hover:border-[#1a9e8a]/30 transition-all duration-300 hover:-translate-y-1">
        <svg className="text-[#1a9e8a] mb-5" width="28" height="20" viewBox="0 0 28 20" fill="currentColor">
        <path d="M0 20V12C0 5.333 3.333 1.333 10 0l1.5 2.5C8.833 3.5 7.333 5.5 7 8.5h5V20H0zm16 0V12c0-6.667 3.333-10.667 10-12l1.5 2.5c-2.667 1-4.167 3-4.5 6h5V20H16z"/>
        </svg>
        <p className="text-[#c8d8e8] text-sm leading-relaxed italic mb-6">"{t.quote}"</p>
        <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1a9e8a]/15 border border-[#1a9e8a]/30 text-[#1a9e8a] flex items-center justify-center text-xs font-bold">
          {t.avatar}
        </div>
        <div>
          <div className="text-[#f0ede6] font-semibold text-sm">{t.name}</div>
          <div className="text-[#8fa3bc] text-xs">{t.city}</div>
        </div>
        </div>
        </div>
      ))}
      </div>
      ))}
    </div>
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
