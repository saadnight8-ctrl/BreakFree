import { useLanguage, tx } from '../i18n'
import { Link } from 'react-router'

const STEPS = [
  { icon: '🔎', title: 'Start with a trusted service', hi: 'भरोसेमंद सेवा से शुरुआत करें', body: 'Look for a government hospital, de-addiction centre, doctor, or counsellor.', bodyHi: 'किसी सरकारी अस्पताल, de-addiction centre, डॉक्टर या counsellor से शुरुआत करें।' },
  { icon: '📞', title: 'Call before you go', hi: 'जाने से पहले कॉल करें', body: 'Ask about timings, what support they provide, and whether an appointment is needed.', bodyHi: 'समय, उपलब्ध सहायता और appointment की जरूरत के बारे में पहले पूछें।' },
  { icon: '👥', title: 'Take someone with you', hi: 'किसी को साथ ले जाएँ', body: 'A trusted adult, friend, or family member can make the first visit feel easier.', bodyHi: 'भरोसेमंद बड़ा, दोस्त या परिवार का सदस्य पहली मुलाकात को आसान बना सकता है।' },
  { icon: '🚨', title: 'If it is an emergency', hi: 'अगर यह emergency है', body: 'Do not wait for an appointment. Call 112 or go to the nearest emergency department.', bodyHi: 'appointment का इंतजार न करें। 112 पर कॉल करें या नजदीकी emergency department जाएँ।' },
]

export default function Directions() {
  const { language } = useLanguage()
  return <div className="min-h-screen pt-16">
    <section className="py-20 bg-[#0d1e36] relative overflow-hidden bf-hero">
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <p className="text-[#1a9e8a] text-xs font-semibold uppercase tracking-widest mb-4">{tx('Finding support', 'मदद तक पहुँचना', language)}</p>
        <h1 className="text-5xl md:text-6xl font-black text-[#f0ede6] leading-tight mb-5" style={{ fontFamily: 'var(--font-display)' }}>{tx('Not sure where to start?', 'समझ नहीं आ रहा कहाँ से शुरू करें?', language)}</h1>
        <p className="text-[#8fa3bc] text-lg leading-relaxed">{tx('You do not need the perfect place or the perfect words. Start with one call or one conversation.', 'आपको perfect जगह या perfect शब्दों की जरूरत नहीं है। एक कॉल या एक बातचीत से शुरुआत करें।', language)}</p>
      </div>
    </section>
    <section className="py-16 bg-[#0a1628]">
      <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-5">
        {STEPS.map((step, i) => <div key={step.title} className="bf-card rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4"><div className="w-11 h-11 rounded-xl bg-[#1a9e8a]/15 border border-[#1a9e8a]/30 flex items-center justify-center text-lg">{step.icon}</div><div><span className="text-[#1a9e8a] text-xs font-bold">0{i + 1}</span><h2 className="text-[#f0ede6] font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>{language === 'hi' ? step.hi : step.title}</h2></div></div>
          <p className="text-[#8fa3bc] text-sm leading-relaxed">{language === 'hi' ? step.bodyHi : step.body}</p>
        </div>)}
      </div>
    </section>
    <section className="py-16 bg-[#0d1e36]">
      <div className="max-w-2xl mx-auto px-6 text-center"><div className="bf-card rounded-2xl p-8">
        <p className="text-[#e8a020] text-xs font-semibold uppercase tracking-widest mb-4">{tx('Keep it simple', 'इसे आसान रखें', language)}</p>
        <h2 className="text-3xl font-black text-[#f0ede6] mb-4" style={{ fontFamily: 'var(--font-display)' }}>{tx('One conversation can be the start.', 'एक बातचीत शुरुआत बन सकती है।', language)}</h2>
        <p className="text-[#8fa3bc] text-sm leading-relaxed mb-6">{tx('For drug-de-addiction support in India, BreakFree lists 14446 as a starting point. Check the official source for current details.', 'भारत में drug-de-addiction support के लिए BreakFree 14446 को शुरुआती संपर्क के रूप में बताता है। नवीनतम जानकारी के लिए official source देखें।', language)}</p>
        <a href="tel:14446" className="inline-flex items-center gap-2 bg-[#1a9e8a] hover:bg-[#158a78] text-white font-semibold px-7 py-3 rounded-full transition-all">{tx('Call 14446', '14446 पर कॉल करें', language)} →</a>
        <Link to="/help" className="ml-2 inline-flex items-center gap-2 border border-[#1e3050] hover:border-[#1a9e8a]/50 text-[#c8d8e8] px-7 py-3 rounded-full text-sm transition-all">{tx('More support', 'और सहायता', language)}</Link>
      </div></div>
    </section>
  </div>
}
