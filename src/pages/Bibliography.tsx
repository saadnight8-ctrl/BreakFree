import { useLanguage, tx } from '../i18n'

const SOURCES = [
  {
    title: 'World Health Organization (WHO) — Mental Health, Brain Health and Substance Use',
    url: 'https://www.who.int/teams/mental-health-and-substance-use/treatment-care',
    usedFor: 'Used for the general information about substance use disorders, treatment, recovery support, and the idea that people should be able to access evidence-based care.'
  },
  {
    title: 'WHO & UNODC — International Standards for the Treatment of Drug Use Disorders',
    url: 'https://www.who.int/publications-detail-redirect/international-standards-for-the-treatment-of-drug-use-disorders',
    usedFor: 'Used for information about treatment, rehabilitation, support services, stigma, and the need for care to be adapted to different people.'
  },
  {
    title: 'United Nations Office on Drugs and Crime (UNODC) — World Drug Report 2026',
    url: 'https://data.unodc.org/wdr2026search',
    usedFor: 'Used as a background source for the worldwide picture of drug use and treatment. It also helped us check that recovery and treatment information was not based only on personal opinion.'
  },
  {
    title: 'Government of India — Department of Social Justice & Empowerment',
    url: 'https://socialjustice.gov.in/common/47564',
    usedFor: 'Source for India-specific information about drug demand reduction, Nasha Mukt Bharat Abhiyaan, and the National Drug De-Addiction Helpline (14446).'
  },
  {
    title: 'National Drug Use Survey (NDUS 2025) — NDDTC, AIIMS & Ministry of Social Justice and Empowerment',
    url: 'https://ndusindia.in/reports/',
    usedFor: 'Used to check the current status of India’s national substance-use survey. The NDUS 2025 field survey is in progress, so the latest published national prevalence estimates shown on the homepage are from the 2018 survey, published in 2019.'
  },
  {
    title: 'Government of India — National Action Plan for Drug Demand Reduction',
    url: 'https://socialjustice.gov.in/schemes/42/archive',
    usedFor: 'Used for information about government drug-demand-reduction programmes, counselling, rehabilitation and awareness work in India.'
  },
  {
    title: 'Government of India / PIB — Raju: From Substance Dependency to Stability',
    url: 'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2309207&lang=1&reg=3',
    usedFor: 'Source for the recovery story about Raju, including treatment, counselling, follow-up support, employment and rebuilding stability.'
  },
  {
    title: 'Government of India / PIB — Rahul Llowang: Recovery and Self-Reliance',
    url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2309673&lang=2&reg=48',
    usedFor: 'Source for the recovery story about Rahul Llowang and the role of treatment, counselling, rehabilitation and support in his move towards self-employment and financial independence.'
  },
  {
    title: 'Government of India / PIB — Sajjad: Recovery and Sporting Reintegration',
    url: 'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2313416&lang=1&reg=3',
    usedFor: 'Source for the recovery story about Sajjad, including treatment, counselling, skills support, return to sport and peer encouragement.'
  },
  {
    title: 'Government of India / PIB — Rajveer: Recovery and Family Support',
    url: 'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2314024&lang=1&reg=3',
    usedFor: 'Source for the recovery story about Rajveer and the role of professional care and family support in rebuilding daily life and livelihood.'
  },
  {
    title: 'Government of India / PIB — Garry: Recovery, Self-Reliance and Social Reintegration',
    url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2307588&lang=2&reg=48',
    usedFor: 'Source for the recovery story about Garry and the role of counselling, family support, rehabilitation and follow-up in rebuilding a stable and productive life.'
  },
  {
    title: 'Government of India / PIB — Karan: Addiction to Recovery and Stability',
    url: 'https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2315990&lang=1&reg=3',
    usedFor: 'Source for the recovery story about Karan and the role of treatment, counselling, family support and after-care in rebuilding stability and work.'
  },

  {
    title: 'Government of India — Emergency Response Support System (112)',
    url: 'https://112.gov.in/',
    usedFor: 'Source for the emergency number 112 and the information about India’s unified emergency response system.'
  },
  {
    title: 'AIIMS — National Drug Dependence Treatment Centre (NDDTC)',
    url: 'https://www.aiims.edu/index.php/en/departments-and-centers/specialty-centers?id=414',
    usedFor: 'Used for information about NDDTC and the kinds of treatment and support available through a specialist drug-dependence treatment centre.'
  },
  {
    title: 'iCALL — Tata Institute of Social Sciences',
    url: 'https://icallhelpline.org/',
    usedFor: 'Source for the iCALL counselling service and its official contact information.'
  },
  {
    title: 'NIMHANS — National Institute of Mental Health and Neuro Sciences',
    url: 'https://www.nimhans.ac.in/',
    usedFor: 'Used as a source for NIMHANS and its mental-health services. The website also provides information about Tele-MANAS.'
  },
  {
    title: 'Vandrevala Foundation — Free Mental Health Counselling',
    url: 'https://www.vandrevalafoundation.com/free-counseling',
    usedFor: 'Source for the Vandrevala Foundation counselling service and its current free helpline contact details.'
  },
  {
    title: 'Snehi — Crisis Intervention Helpline',
    url: 'https://snehi.org.in/crisis-intervention-helpline/',
    usedFor: 'Source for the Snehi counselling service, helpline number and service timings.'
  },
  {
    title: 'Alcoholics Anonymous General Service Office India',
    url: 'https://www.aagsoindia.org/',
    usedFor: 'Source for the description of Alcoholics Anonymous as a peer fellowship for people who want help with drinking.'
  },
  {
    title: 'Narcotics Anonymous India',
    url: 'https://naindia.in/',
    usedFor: 'Source for the description of NA as a peer fellowship for people recovering from drug problems and for information about meetings in India.'
  },
  {
    title: 'Tulasi Healthcare',
    url: 'https://www.tulasihealthcare.com/',
    usedFor: 'Source for the basic description of Tulasi Healthcare as a Delhi-NCR psychiatric and rehabilitation provider that offers addiction-related care.'
  },
]

export default function Bibliography() {
  const { language } = useLanguage()
  return (
    <div className="min-h-screen pt-16">
      <section className="py-20 bg-[#0d1e36] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(26,158,138,0.10) 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <p className="text-[#1a9e8a] text-xs font-semibold uppercase tracking-widest mb-4">{tx('For our school project', 'हमारे स्कूल प्रोजेक्ट के लिए', language)}</p>
          <h1 className="text-5xl md:text-6xl font-black text-[#f0ede6] leading-tight mb-5" style={{ fontFamily: 'var(--font-display)' }}>
            {tx('Bibliography', 'स्रोत', language)}
          </h1>
          <p className="text-[#8fa3bc] text-lg leading-relaxed">
            {tx('These are the websites and organisations we used to check the information on BreakFree, including the official sources for the recovery stories shown on the homepage.', 'ये वे वेबसाइट और संस्थाएँ हैं जिनसे हमने BreakFree की जानकारी को चेक किया, जिसमें homepage पर दिखाई गई recovery stories के official sources भी शामिल हैं।', language)}
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-5">
            {SOURCES.map((source, index) => (
              <article key={source.url} className="bf-card bg-[#111f3a] border border-[#1e3050] rounded-2xl p-6 md:p-7">
                <div className="flex gap-4">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-[#1a9e8a]/15 border border-[#1a9e8a]/30 flex items-center justify-center text-[#1a9e8a] text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[#f0ede6] font-bold text-base leading-snug mb-2">{source.title}</h2>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1a9e8a] hover:underline text-xs break-all"
                    >
                      {source.url}
                    </a>
                    <p className="text-[#8fa3bc] text-sm leading-relaxed mt-3">
                      <span className="text-[#c8d8e8] font-medium">{tx('Used for:', 'किसके लिए इस्तेमाल किया:', language)}</span> {source.usedFor}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="text-[#657b96] text-xs leading-relaxed mt-8 text-center">
            {tx('Sources were checked while preparing the website. Information and helpline details can change, so the official source should be checked for the latest details.', 'वेबसाइट बनाते समय sources चेक किए गए थे। जानकारी और helpline details बदल सकती हैं, इसलिए latest details के लिए official source देखें।', language)}
          </p>
        </div>
      </section>
    </div>
  )
}
