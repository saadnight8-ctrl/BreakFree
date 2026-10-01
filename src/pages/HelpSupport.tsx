import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { useLanguage, tx } from '../i18n'

const HELPLINES = [
  { name: 'National Drug Helpline', hi: 'राष्ट्रीय ड्रग हेल्पलाइन', number: '14446', detail: 'Drug support helpline', detailHi: 'ड्रग सहायता हेल्पलाइन', color: '#1a9e8a' },
  { name: 'iCall · TISS', hi: 'iCall · TISS', number: '022-25521111', detail: 'Counselling support', detailHi: 'काउंसलिंग सहायता', color: '#e8a020' },
  { name: 'Vandrevala Foundation', hi: 'Vandrevala Foundation', number: '9999666555', detail: 'Mental health support', detailHi: 'मानसिक स्वास्थ्य सहायता', color: '#1a9e8a' },
  { name: 'NIMHANS Bengaluru', hi: 'NIMHANS Bengaluru', number: '080-46110007', detail: 'Mental health support', detailHi: 'मानसिक स्वास्थ्य सहायता', color: '#e8a020' },
  { name: 'Snehi Helpline', hi: 'Snehi Helpline', number: '9582208181', detail: 'Someone to talk to', detailHi: 'बात करने के लिए सहायता', color: '#1a9e8a' },
  { name: 'Emergency services', hi: 'आपातकालीन सेवाएँ', number: '112', detail: 'For immediate emergencies', detailHi: 'तुरंत आपातकाल में', color: '#f87171' },
]

const RESOURCES = [
  { title: 'AIIMS NDDTC', desc: 'A specialist treatment centre in New Delhi.', descHi: 'नई दिल्ली में विशेषज्ञ उपचार केंद्र।', location: 'New Delhi', icon: '🏥' },
  { title: 'TISS iCall', desc: 'A counselling service with trained professionals.', descHi: 'प्रशिक्षित professionals से काउंसलिंग सेवा।', location: 'Mumbai · Remote support', locHi: 'मुंबई · रिमोट सपोर्ट', icon: '🧠' },
  { title: 'Alcoholics Anonymous India', desc: 'Peer-led meetings for people seeking help with drinking.', descHi: 'शराब से जुड़ी समस्या में मदद चाहने वालों के लिए peer meetings।', location: 'Pan-India', locHi: 'पूरे भारत में', icon: '🤝' },
  { title: 'Narcotics Anonymous India', desc: 'Peer support for people working through drug recovery.', descHi: 'ड्रग रिकवरी के लिए peer support meetings।', location: 'Pan-India + Online', locHi: 'पूरे भारत में + ऑनलाइन', icon: '🌿' },
  { title: 'Tulasi Healthcare', desc: 'A Delhi-NCR provider offering mental health and rehabilitation care.', descHi: 'दिल्ली-NCR में मानसिक स्वास्थ्य और rehabilitation care।', location: 'Delhi NCR', locHi: 'दिल्ली NCR', icon: '🌅' },
]

const PEER_TIPS = [
  { title: 'Listen without judgment', hi: 'बिना जज किए सुनें', body: 'Give them a chance to talk. You do not need to solve everything in one conversation.', bodyHi: 'उन्हें बात करने का मौका दें। एक ही बातचीत में सब कुछ हल करना जरूरी नहीं है।' },
  { title: 'Use “I” statements', hi: '“मैं” वाले वाक्य इस्तेमाल करें', body: '“I’m worried about you” keeps the focus on your concern instead of blaming them.', bodyHi: '“मुझे तुम्हारी चिंता है” कहने से ध्यान आरोप लगाने के बजाय आपकी चिंता पर रहता है।' },
  { title: 'Offer one specific help', hi: 'एक साफ मदद ऑफर करें', body: 'Offer something practical, like going with them to a counsellor or making a call together.', bodyHi: 'जैसे किसी counsellor के पास साथ जाना या मिलकर कॉल करना जैसी practical मदद दें।' },
  { title: 'Stay connected', hi: 'जुड़े रहें', body: 'Set healthy boundaries, but do not disappear. Professional support can help with the hard parts.', bodyHi: 'Healthy boundaries रखें, लेकिन पूरी तरह गायब न हों। मुश्किल हिस्सों में professional support मदद कर सकता है।' },
]

export default function HelpSupport() {
  const { language } = useLanguage()
  return (
    <div className="min-h-screen pt-16">
      <section className="py-20 bg-[#0d1e36] relative overflow-hidden bf-hero">
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <p className="text-[#e8a020] text-xs font-semibold uppercase tracking-widest mb-4">{tx('You do not have to handle this alone', 'आपको यह अकेले संभालना जरूरी नहीं है', language)}</p>
          <h1 className="text-5xl md:text-6xl font-black text-[#f0ede6] leading-tight mb-5" style={{ fontFamily: 'var(--font-display)' }}>{tx('Help & Support', 'मदद और सहायता', language)}</h1>
          <p className="text-[#8fa3bc] text-lg leading-relaxed">{tx('Find a person, service, or resource that can help with the next step.', 'ऐसा व्यक्ति, सेवा या resource खोजें जो अगले कदम में मदद कर सके।', language)}</p>
        </div>
      </section>

      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between gap-5 mb-10 flex-wrap">
            <div>
              <p className="text-[#1a9e8a] text-xs uppercase tracking-[0.22em] font-bold mb-2">{tx('Talk to someone', 'किसी से बात करें', language)}</p>
              <h2 className="text-3xl md:text-4xl font-black text-[#f0ede6]" style={{ fontFamily: 'var(--font-display)' }}>{tx('Useful numbers in India', 'भारत में काम के नंबर', language)}</h2>
            </div>
            <Link to="/personal-plan" className="text-[#8fa3bc] hover:text-white text-sm border border-[#1e3050] hover:border-[#1a9e8a]/40 rounded-full px-5 py-2.5 transition-all">{tx('Want a plan built for you?', 'अपने लिए plan बनवाना है?', language)} →</Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HELPLINES.map(h => (
              <a key={h.number} href={`tel:${h.number.replace(/-/g, '')}`} className="group bf-card rounded-2xl px-6 py-5" style={{ ['--accent' as string]: h.color } as CSSProperties}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[#f0ede6] font-semibold text-sm mb-1">{language === 'hi' ? h.hi : h.name}</div>
                    <div className="text-[#8fa3bc] text-xs">{language === 'hi' ? h.detailHi : h.detail}</div>
                  </div>
                  <span className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black" style={{ color: h.color, background: `${h.color}15`, border: `1px solid ${h.color}35` }}>↗</span>
                </div>
                <div className="mt-5 text-2xl font-black" style={{ fontFamily: 'var(--font-display)', color: h.color }}>{h.number}</div>
                <div className="text-[#8fa3bc] text-xs mt-1 group-hover:text-[#f0ede6] transition-colors">{tx('Tap to call', 'कॉल करने के लिए टैप करें', language)} →</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d1e36]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[#a78bfa] text-xs uppercase tracking-[0.22em] font-bold mb-3">{tx('Places to start', 'जहाँ से शुरुआत कर सकते हैं', language)}</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#f0ede6]" style={{ fontFamily: 'var(--font-display)' }}>{tx('Support is not one-size-fits-all', 'हर व्यक्ति के लिए मदद एक जैसी नहीं होती', language)}</h2>
            <p className="text-[#8fa3bc] text-sm max-w-2xl mx-auto mt-3">{tx('Different people need different kinds of support. These are examples of services and groups to research.', 'अलग लोगों को अलग तरह की मदद चाहिए हो सकती है। ये कुछ services और groups के उदाहरण हैं जिनके बारे में जानकारी ली जा सकती है।', language)}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {RESOURCES.map(r => (
              <div key={r.title} className="bf-card rounded-2xl p-6">
                <div className="text-3xl mb-4">{r.icon}</div>
                <h3 className="text-[#f0ede6] font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>{r.title}</h3>
                <p className="text-[#a78bfa] text-xs mb-3">{language === 'hi' ? (r.locHi ?? r.location) : r.location}</p>
                <p className="text-[#c8d8e8] text-sm leading-relaxed">{language === 'hi' ? r.descHi : r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-11">
            <p className="text-[#1a9e8a] text-xs font-semibold uppercase tracking-widest mb-4">{tx('For friends & family', 'दोस्तों और परिवार के लिए', language)}</p>
            <h2 className="text-3xl font-black text-[#f0ede6]" style={{ fontFamily: 'var(--font-display)' }}>{tx('How you can help a friend', 'किसी दोस्त की मदद कैसे करें', language)}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {PEER_TIPS.map((tip, i) => (
              <div key={tip.title} className="bf-card rounded-2xl p-6">
                <div className="w-8 h-8 rounded-full bg-[#1a9e8a]/15 border border-[#1a9e8a]/30 flex items-center justify-center mb-4 text-[#1a9e8a] text-sm font-bold">{i + 1}</div>
                <h3 className="text-[#f0ede6] font-bold mb-2 text-sm">{language === 'hi' ? tip.hi : tip.title}</h3>
                <p className="text-[#8fa3bc] text-sm leading-relaxed">{language === 'hi' ? tip.bodyHi : tip.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
