import { useLanguage, tx, translateHindi } from '../i18n'

const WARNING_SIGNS = [
  { en: 'Sudden mood changes', hi: 'अचानक मूड में बदलाव', level: 'Watch' },
  { en: 'Pulling away from friends or family', hi: 'दोस्तों या परिवार से दूर होना', level: 'Watch' },
  { en: 'Repeatedly missing important commitments', hi: 'जरूरी जिम्मेदारियों से बार-बार चूकना', level: 'Concern' },
  { en: 'Finding drug-use items', hi: 'ड्रग उपयोग से जुड़ी चीजें मिलना', level: 'Concern' },
  { en: 'Serious financial problems linked to use', hi: 'उपयोग से जुड़ी गंभीर आर्थिक परेशानी', level: 'Act' },
  { en: 'Immediate medical danger', hi: 'तुरंत मेडिकल खतरा', level: 'Emergency' },
  { en: 'Unconscious or unresponsive', hi: 'बेहोश या प्रतिक्रिया न देना', level: 'Emergency' },
]

const OVERDOSE = [
  { step: '1', title: 'Call 112 immediately', titleHi: 'तुरंत 112 पर कॉल करें', body: 'Tell the operator you suspect a drug-related medical emergency and follow their instructions.', bodyHi: 'ऑपरेटर को बताएं कि ड्रग से जुड़ी मेडिकल इमरजेंसी का शक है और उनके निर्देश मानें।' },
  { step: '2', title: 'Stay with the person', titleHi: 'व्यक्ति के साथ रहें', body: 'Keep the person under observation and follow the emergency operator’s instructions while help is coming.', bodyHi: 'मदद आने तक व्यक्ति पर नजर रखें और आपातकालीन ऑपरेटर के निर्देशों का पालन करें।' },
  { step: '3', title: 'Do not leave them alone', titleHi: 'उन्हें अकेला न छोड़ें', body: 'Stay nearby and tell the operator about any change in breathing or responsiveness.', bodyHi: 'पास रहें और सांस या प्रतिक्रिया में किसी बदलाव के बारे में ऑपरेटर को बताएं।' },
  { step: '4', title: 'Tell medics what you know', titleHi: 'मेडिक्स को जो पता है बताएं', body: 'Give responders accurate information about what happened. Getting medical help quickly matters most.', bodyHi: 'जो हुआ उसकी सही जानकारी responders को दें। सबसे जरूरी बात है जल्दी मेडिकल मदद लेना।' },
]

export default function CrisisManagement() {
  const { language } = useLanguage()
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    Watch: { bg: 'rgba(232,160,32,.10)', text: '#e8a020', border: 'rgba(232,160,32,.30)' },
    Concern: { bg: 'rgba(248,113,113,.10)', text: '#fca5a5', border: 'rgba(248,113,113,.30)' },
    Act: { bg: 'rgba(248,113,113,.16)', text: '#f87171', border: 'rgba(248,113,113,.45)' },
    Emergency: { bg: 'rgba(220,38,38,.18)', text: '#ef4444', border: 'rgba(220,38,38,.55)' },
  }
  return (
    <div className="min-h-screen pt-16">
      <div className="bg-red-600 px-6 py-3 text-center shadow-[0_0_30px_rgba(220,38,38,.16)]">
        <p className="text-white text-sm font-semibold">🚨 {tx('Immediate danger? Call', 'तुरंत खतरा है? कॉल करें', language)} <a href="tel:112" className="underline font-black">112</a> {tx('or', 'या', language)} <a href="tel:14446" className="underline font-black">14446</a>.</p>
      </div>

      <section className="py-20 bg-[#0d1e36] relative overflow-hidden bf-hero">
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <p className="text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">{tx('For urgent situations', 'तुरंत मदद वाली स्थिति के लिए', language)}</p>
          <h1 className="text-5xl md:text-6xl font-black text-[#f0ede6] leading-tight mb-5" style={{ fontFamily: 'var(--font-display)' }}>{tx('Crisis Help', 'तुरंत मदद', language)}</h1>
          <p className="text-[#8fa3bc] text-lg leading-relaxed">{tx('When something feels urgent, getting professional help quickly is the priority.', 'जब स्थिति बहुत जरूरी हो, तो जल्दी professional help लेना सबसे जरूरी है।', language)}</p>
        </div>
      </section>

      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-end justify-between gap-5 mb-9 flex-wrap">
            <div>
              <p className="text-red-400 text-xs font-semibold uppercase tracking-widest mb-2">{tx('What to watch for', 'किन संकेतों पर ध्यान दें', language)}</p>
              <h2 className="text-3xl font-black text-[#f0ede6]" style={{ fontFamily: 'var(--font-display)' }}>{tx('Warning signs', 'चेतावनी के संकेत', language)}</h2>
            </div>
            <a href="tel:112" className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-all hover:-translate-y-0.5">112 →</a>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {WARNING_SIGNS.map(w => {
              const c = colors[w.level]
              return <div key={w.en} className="flex items-center justify-between gap-4 rounded-xl px-5 py-4" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                <span className="text-[#f0ede6] text-sm font-medium">{language === 'hi' ? translateHindi(w.hi) : w.en}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full shrink-0" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>{w.level}</span>
              </div>
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d1e36]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-9">
            <p className="text-red-400 text-xs uppercase tracking-[.22em] font-bold mb-2">{tx('Emergency response', 'आपातकालीन प्रतिक्रिया', language)}</p>
            <h2 className="text-3xl font-black text-[#f0ede6]" style={{ fontFamily: 'var(--font-display)' }}>{tx('If you suspect an overdose', 'अगर overdose का शक हो', language)}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {OVERDOSE.map(s => <div key={s.step} className="bf-card rounded-2xl p-6 border-red-500/20">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center mb-4 text-red-400 font-black">{s.step}</div>
              <h3 className="text-[#f0ede6] font-bold mb-2">{language === 'hi' ? translateHindi(s.titleHi) : s.title}</h3>
              <p className="text-[#8fa3bc] text-sm leading-relaxed">{language === 'hi' ? translateHindi(s.bodyHi) : s.body}</p>
            </div>)}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#0a1628]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bf-card rounded-3xl p-8 border-red-500/20">
            <p className="text-[#c8d8e8] text-sm leading-relaxed mb-5">{tx('For an immediate emergency, call 112. For drug-related support in India, the project lists 14446. Official numbers and services can change, so check the official source for the latest details.', 'तुरंत emergency में 112 पर कॉल करें। भारत में ड्रग से जुड़ी सहायता के लिए प्रोजेक्ट में 14446 दिया गया है। नंबर और सेवाएँ बदल सकती हैं, इसलिए नवीनतम जानकारी के लिए official source देखें।', language)}</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <a href="tel:112" className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-full text-sm transition-all">112</a>
              <a href="tel:14446" className="bg-[#1a9e8a] hover:bg-[#158a78] text-white font-bold px-6 py-3 rounded-full text-sm transition-all">14446</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
