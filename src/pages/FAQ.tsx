import { useState } from 'react'
import { useLanguage, tx, translateHindi } from '../i18n'

const FAQS = [
  {
    category: { en: 'About addiction', hi: 'लत के बारे में' },
    items: [
      { q: { en: 'Is addiction a disease or a choice?', hi: 'क्या लत एक बीमारी है या चुनाव?' }, a: { en: 'Addiction is a health condition involving changes in the brain and behaviour. A person may choose to use a substance, but repeated use can make stopping much harder. Treating addiction as a health issue rather than a moral failure can make it easier to seek help.', hi: 'लत एक स्वास्थ्य स्थिति है जिसमें दिमाग और व्यवहार में बदलाव शामिल हो सकते हैं। कोई व्यक्ति शुरुआत में नशे की चीज का उपयोग चुन सकता है, लेकिन बार-बार उपयोग के बाद छोड़ना ज्यादा मुश्किल हो सकता है। लत को नैतिक असफलता के बजाय स्वास्थ्य से जुड़ी समस्या मानना मदद लेने को आसान बना सकता है।' } },
      { q: { en: 'What makes something addictive?', hi: 'किसी चीज को नशे की लत लगाने वाला क्या बनाता है?' }, a: { en: 'Some substances strongly affect the brain’s reward system. Over time, repeated use can change how the brain responds to the substance, which can contribute to cravings and dependence.', hi: 'कुछ नशीले पदार्थ दिमाग के reward system पर गहरा असर डालते हैं। समय के साथ बार-बार उपयोग से दिमाग की प्रतिक्रिया बदल सकती है, जिससे craving और dependence जैसी समस्याएँ हो सकती हैं।' } },
      { q: { en: 'Can someone become addicted after one use?', hi: 'क्या एक बार उपयोग से भी लत लग सकती है?' }, a: { en: 'There is no guaranteed number of uses that causes addiction. Risk depends on the substance, the person, and their circumstances. Avoiding drugs is the safest option.', hi: 'ऐसी कोई तय संख्या नहीं है कि कितनी बार उपयोग करने से लत जरूर लग जाएगी। जोखिम पदार्थ, व्यक्ति और उसकी परिस्थितियों पर निर्भर करता है। ड्रग्स से दूर रहना सबसे सुरक्षित विकल्प है।' } },
      { q: { en: 'Are some people more likely to develop addiction?', hi: 'क्या कुछ लोगों में लत का जोखिम ज्यादा होता है?' }, a: { en: 'Yes. Genetics, stress, early exposure, surroundings, and other personal factors can affect risk.', hi: 'हाँ। आनुवंशिकता, तनाव, कम उम्र में संपर्क, आसपास का माहौल और अन्य व्यक्तिगत कारण जोखिम को प्रभावित कर सकते हैं।' } },
    ],
  },
  {
    category: { en: 'Recovery & treatment', hi: 'रिकवरी और इलाज' },
    items: [
      { q: { en: 'Can people recover from addiction?', hi: 'क्या लोग लत से रिकवर कर सकते हैं?' }, a: { en: 'Yes. Many people recover and build stable, healthy lives. Recovery can take time, and some people benefit from ongoing support. A setback does not erase the progress already made.', hi: 'हाँ। बहुत से लोग रिकवर करके स्थिर और स्वस्थ जीवन बनाते हैं। रिकवरी में समय लग सकता है और कुछ लोगों को लंबे समय तक सहायता मिल सकती है। एक मुश्किल दौर पहले की पूरी प्रगति को मिटा नहीं देता।' } },
      { q: { en: 'Where can I get help in India?', hi: 'भारत में मदद कहाँ मिल सकती है?' }, a: { en: 'Depending on the situation, help can include a doctor, de-addiction centre, counsellor, rehabilitation service, peer group, or helpline. See Help & Support for starting points.', hi: 'स्थिति के अनुसार डॉक्टर, de-addiction centre, counsellor, rehabilitation service, peer group या helpline से मदद ली जा सकती है। शुरुआत के लिए Help & Support पेज देखें।' } },
      { q: { en: 'How long does recovery take?', hi: 'रिकवरी में कितना समय लगता है?' }, a: { en: 'There is no single timetable. Physical withdrawal, emotional recovery, and rebuilding routines can all move at different speeds. Some people need short-term support and others benefit from help for longer.', hi: 'इसका कोई एक तय समय नहीं है। शारीरिक withdrawal, भावनात्मक रिकवरी और नई दिनचर्या बनाना अलग-अलग गति से हो सकते हैं। कुछ लोगों को थोड़े समय की मदद चाहिए होती है और कुछ को ज्यादा समय तक सहायता मिल सकती है।' } },
      { q: { en: 'What if someone I know starts using again?', hi: 'अगर कोई परिचित फिर से उपयोग शुरू कर दे तो?' }, a: { en: 'Stay calm, avoid shame, and encourage them to reconnect with professional support. If there is an immediate medical emergency, call 112.', hi: 'शांत रहें, शर्मिंदा करने से बचें और उन्हें पेशेवर सहायता से दोबारा जुड़ने के लिए कहें। अगर तुरंत मेडिकल इमरजेंसी हो, तो 112 पर कॉल करें।' } },
    ],
  },
  {
    category: { en: 'About BreakFree', hi: 'BreakFree के बारे में' },
    items: [
      { q: { en: 'What is BreakFree?', hi: 'BreakFree क्या है?' }, a: { en: 'BreakFree is a student project about drug awareness, recovery support, and finding the next useful step.', hi: 'BreakFree ड्रग जागरूकता, रिकवरी सपोर्ट और अगले काम के कदम तक पहुँचने के बारे में एक छात्र प्रोजेक्ट है।' } },
      { q: { en: 'Who is it for?', hi: 'यह किसके लिए है?' }, a: { en: 'It can help someone looking for information, someone seeking support, or a friend or family member trying to help.', hi: 'यह जानकारी खोजने वाले व्यक्ति, मदद चाहने वाले व्यक्ति या किसी दोस्त/परिवार के सदस्य की मदद करने की कोशिश कर रहे व्यक्ति के लिए उपयोगी हो सकता है।' } },
    ],
  },
]

export default function FAQ() {
  const { language } = useLanguage()
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="min-h-screen pt-16">
      <section className="py-20 bg-[#0d1e36] relative overflow-hidden bf-hero">
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <p className="text-[#1a9e8a] text-xs font-semibold uppercase tracking-widest mb-4">{tx('Quick answers', 'जल्दी जवाब', language)}</p>
          <h1 className="text-5xl md:text-6xl font-black text-[#f0ede6] leading-tight mb-5" style={{ fontFamily: 'var(--font-display)' }}>
            {tx('Questions people ask', 'लोग अक्सर पूछते हैं', language)}
          </h1>
          <p className="text-[#8fa3bc] text-lg leading-relaxed">{tx('Straightforward answers about drugs, recovery, and getting help.', 'ड्रग्स, रिकवरी और मदद पाने के बारे में आसान जवाब।', language)}</p>
        </div>
      </section>

      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-3xl mx-auto px-6 space-y-14">
          {FAQS.map(section => {
            const category = language === 'hi' ? translateHindi(section.category.hi) : section.category.en
            return (
              <div key={section.category.en}>
                <h2 className="text-xl font-black text-[#e8a020] mb-6 flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
                  <span className="flex-1 h-px bg-[#e8a020]/20" />{category}<span className="flex-1 h-px bg-[#e8a020]/20" />
                </h2>
                <div className="space-y-3">
                  {section.items.map((item, i) => {
                    const key = `${section.category.en}-${i}`
                    const isOpen = open === key
                    return (
                      <div key={key} className={`bf-card bg-[#111f3a] border rounded-xl overflow-hidden ${isOpen ? 'border-[#1a9e8a]/50' : 'border-[#1e3050]'}`}>
                        <button className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left" onClick={() => setOpen(isOpen ? null : key)} aria-expanded={isOpen}>
                          <span className="font-semibold text-[#f0ede6] text-sm leading-snug">{language === 'hi' ? translateHindi(item.q.hi) : item.q.en}</span>
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 mt-0.5 text-[#8fa3bc] transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            <path d="M4 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        {isOpen && <div className="px-6 pb-5"><p className="text-[#8fa3bc] text-sm leading-relaxed">{language === 'hi' ? translateHindi(item.a.hi) : item.a.en}</p></div>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <div className="max-w-3xl mx-auto px-6 mt-16">
          <div className="bf-card rounded-2xl p-8 text-center">
            <p className="text-[#c8d8e8] text-sm mb-4">{tx('Still unsure about something?', 'फिर भी कुछ समझ नहीं आया?', language)}</p>
            <a href="/help" className="inline-flex items-center gap-2 bg-[#1a9e8a] hover:bg-[#158a78] text-white font-semibold px-7 py-3 rounded-full transition-all text-sm">{tx('Help & Support', 'मदद और सहायता', language)} →</a>
          </div>
        </div>
      </section>
    </div>
  )
}
