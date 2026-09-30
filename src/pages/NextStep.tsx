import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useLanguage, tx } from '../i18n'

const OPTIONS = [
  {
    id: 'learn', icon: '◈', color: '#60a5fa',
    en: { title: 'I want to understand', desc: 'Get clear, no-jargon information first.' },
    hi: { title: 'मैं समझना चाहता/चाहती हूँ', desc: 'पहले आसान और साफ जानकारी देखें।' },
    actions: {
      en: ['Read the FAQ for quick answers.', 'Check the basics of addiction and recovery.', 'Save the support page for later.'],
      hi: ['जल्दी जवाबों के लिए FAQ देखें।', 'लत और रिकवरी की बुनियादी जानकारी पढ़ें।', 'सपोर्ट पेज को बाद के लिए सेव करें।'],
    },
    links: [{ en: 'Open FAQ', hi: 'FAQ खोलें', to: '/faq' }, { en: 'Find support', hi: 'सहायता देखें', to: '/help' }],
  },
  {
    id: 'support', icon: '✦', color: '#1a9e8a',
    en: { title: 'I need support', desc: 'Find a person or service to talk to.' },
    hi: { title: 'मुझे मदद चाहिए', desc: 'किसी भरोसेमंद व्यक्ति या सेवा से जुड़ें।' },
    actions: {
      en: ['Call a support service and explain what is going on.', 'Ask a trusted adult or friend to stay with you.', 'Use the support directory to find a next contact.'],
      hi: ['किसी सपोर्ट सेवा पर कॉल करके स्थिति बताएं।', 'किसी भरोसेमंद बड़े या दोस्त से साथ रहने को कहें।', 'सपोर्ट डायरेक्टरी से अगला संपर्क चुनें।'],
    },
    links: [{ en: 'Get support', hi: 'सहायता पाएं', to: '/help' }, { en: 'Call 14446', hi: '14446 पर कॉल करें', to: 'tel:14446' }],
  },
  {
    id: 'friend', icon: '◎', color: '#e8a020',
    en: { title: 'I am worried about a friend', desc: 'Learn how to be supportive without judging them.' },
    hi: { title: 'मुझे दोस्त की चिंता है', desc: 'बिना जज किए किसी दोस्त का साथ देना सीखें।' },
    actions: {
      en: ['Start with a calm, private conversation.', 'Listen more than you lecture.', 'Help them connect with professional support.'],
      hi: ['शांत और निजी बातचीत से शुरुआत करें।', 'समझाने से ज्यादा सुनने की कोशिश करें।', 'उन्हें पेशेवर सहायता तक पहुँचने में मदद करें।'],
    },
    links: [{ en: 'See ways to help', hi: 'मदद के तरीके देखें', to: '/help' }, { en: 'Read FAQ', hi: 'FAQ पढ़ें', to: '/faq' }],
  },
  {
    id: 'progress', icon: '↗', color: '#a78bfa',
    en: { title: 'I am tracking my progress', desc: 'Use a private, on-device streak tracker.' },
    hi: { title: 'मैं अपनी प्रगति देख रहा/रही हूँ', desc: 'अपने डिवाइस पर निजी स्ट्रीक ट्रैकर इस्तेमाल करें।' },
    actions: {
      en: ['Set a start date or enter your current days.', 'See milestone badges as your streak grows.', 'Your tracker stays in this browser using local storage.'],
      hi: ['शुरुआत की तारीख या अपने दिनों की संख्या सेट करें।', 'स्ट्रीक बढ़ने पर मिलestone badges देखें।', 'ट्रैकर इस ब्राउज़र में local storage से सेव रहता है।'],
    },
    links: [{ en: 'Open Streaks', hi: 'स्ट्रीक खोलें', to: '/streak' }],
  },
  {
    id: 'urgent', icon: '!', color: '#f87171',
    en: { title: 'This is urgent', desc: 'Someone may be in immediate danger.' },
    hi: { title: 'यह बहुत जरूरी है', desc: 'किसी की जान या सुरक्षा को तुरंत खतरा हो सकता है।' },
    actions: {
      en: ['Call emergency services (112) immediately.', 'Stay with the person and follow the operator’s instructions.', 'Use the crisis page for quick emergency contacts.'],
      hi: ['तुरंत आपातकालीन सेवा (112) पर कॉल करें।', 'व्यक्ति के साथ रहें और ऑपरेटर के निर्देश मानें।', 'जल्दी संपर्क नंबर देखने के लिए संकट सहायता पेज खोलें।'],
    },
    links: [{ en: 'Crisis help', hi: 'तुरंत मदद', to: '/crisis' }, { en: 'Call 112', hi: '112 पर कॉल करें', to: 'tel:112' }],
  },
]

export default function NextStep() {
  const { language } = useLanguage()
  const [selected, setSelected] = useState('support')
  const option = useMemo(() => OPTIONS.find(item => item.id === selected) ?? OPTIONS[1], [selected])
  const copy = option[language]
  const actions = option.actions[language]
  const links = option.links

  return (
    <div className="min-h-screen pt-16">
      <section className="relative overflow-hidden py-24 md:py-28 bg-[#0b1830] bf-hero">
        <div className="bf-orbit bf-orbit-one" aria-hidden="true" />
        <div className="bf-orbit bf-orbit-two" aria-hidden="true" />
        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="max-w-3xl">
            <p className="text-[#1a9e8a] text-xs font-semibold uppercase tracking-[0.24em] mb-5">{tx('Find a clear next step', 'अगला आसान कदम चुनें', language)}</p>
            <h1 className="text-5xl md:text-7xl font-black text-[#f0ede6] leading-[0.95] mb-7" style={{ fontFamily: 'var(--font-display)' }}>
              {tx('Start where you are.', 'जहाँ हो, वहीं से शुरू करो।', language)}<br />
              <span className="text-[#1a9e8a]">{tx('We will take it from there.', 'आगे का रास्ता यहाँ मिलेगा।', language)}</span>
            </h1>
            <p className="text-[#8fa3bc] text-lg leading-relaxed max-w-2xl">
              {tx('You do not need the perfect answer. Pick what feels closest, and BreakFree will point you toward a practical next move.', 'आपको अभी सब कुछ समझने की जरूरत नहीं है। जो स्थिति सबसे करीब लगे, उसे चुनें और BreakFree आपको अगला काम का कदम दिखाएगा।', language)}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
            <div className="grid sm:grid-cols-2 gap-4">
              {OPTIONS.map(item => {
                const active = item.id === selected
                const text = item[language]
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelected(item.id)}
                    className={`text-left bf-card p-6 rounded-2xl group ${active ? 'bf-card-active' : ''}`}
                    style={{ ['--accent' as string]: item.color }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black" style={{ color: item.color, background: `${item.color}15`, border: `1px solid ${item.color}35` }}>{item.icon}</span>
                      <span className="text-[#657b96] group-hover:text-[#f0ede6] transition-colors">↗</span>
                    </div>
                    <h2 className="text-[#f0ede6] font-black text-lg mb-2" style={{ fontFamily: 'var(--font-display)' }}>{text.title}</h2>
                    <p className="text-[#8fa3bc] text-sm leading-relaxed">{text.desc}</p>
                  </button>
                )
              })}
            </div>

            <div className="bf-card rounded-3xl p-7 md:p-9 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: option.color, boxShadow: `0 0 18px ${option.color}` }} />
                <p className="text-[#8fa3bc] text-xs uppercase tracking-[0.2em] font-semibold">{tx('Your next move', 'आपका अगला कदम', language)}</p>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#f0ede6] mb-3" style={{ fontFamily: 'var(--font-display)' }}>{copy.title}</h2>
              <p className="text-[#8fa3bc] text-sm leading-relaxed mb-7">{copy.desc}</p>

              <div className="space-y-3 mb-8">
                {actions.map((action, index) => (
                  <div key={action} className="flex gap-3 rounded-xl bg-[#0d1e36] border border-[#1e3050] p-4">
                    <span className="text-xs font-black mt-0.5" style={{ color: option.color }}>0{index + 1}</span>
                    <p className="text-[#c8d8e8] text-sm leading-relaxed">{action}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {links.map(link => link.to.startsWith('tel:') ? (
                  <a key={link.to} href={link.to} className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm text-[#0a1628]" style={{ background: option.color }}>
                    {language === 'hi' ? link.hi : link.en}
                  </a>
                ) : (
                  <Link key={link.to} to={link.to} className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm bg-[#1a9e8a] text-white hover:bg-[#158a78] transition-colors">
                    {language === 'hi' ? link.hi : link.en} →
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-5 border-t border-[#1e3050]">
                <p className="text-[#657b96] text-xs leading-relaxed">
                  {tx('This page is a starting point, not a diagnosis or a substitute for professional care. In an emergency, use 112.', 'यह पेज सिर्फ शुरुआत के लिए है; यह किसी बीमारी का निदान या पेशेवर इलाज का विकल्प नहीं है। आपातकाल में 112 का इस्तेमाल करें।', language)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0d1e36]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[#e8a020] text-xs font-semibold uppercase tracking-[0.22em] mb-4">{tx('No perfect moment required', 'परफेक्ट समय का इंतजार मत करो', language)}</p>
          <h2 className="text-4xl md:text-5xl font-black text-[#f0ede6] mb-5" style={{ fontFamily: 'var(--font-display)' }}>
            {tx('One useful step is enough for today.', 'आज के लिए एक काम का कदम ही काफी है।', language)}
          </h2>
          <Link to="/help" className="inline-flex items-center gap-2 bg-[#f0ede6] text-[#0a1628] hover:bg-white font-bold px-7 py-3.5 rounded-full transition-all hover:scale-[1.02]">
            {tx('See support options', 'सहायता के विकल्प देखें', language)} →
          </Link>
        </div>
      </section>
    </div>
  )
}
