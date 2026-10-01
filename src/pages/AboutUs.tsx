import { Link } from 'react-router'
import BrandLogo from '../components/BrandLogo'
import { useLanguage, tx } from '../i18n'

const team = [
  {
    initials: 'S',
    name: 'Saad',
    role: 'Design & user experience',
    hiRole: 'Design और user experience',
    blurb: 'I worked mostly on the design and tried to keep the site clear and easy to use, without making it feel like a school assignment.',
    hiBlurb: 'मैंने mostly design पर काम किया और कोशिश की कि site clear और easy-to-use रहे, लेकिन school assignment जैसी न लगे।',
    tone: '#a78bfa',
  },
  {
    initials: 'J',
    name: 'Jagrav',
    role: 'Development & interaction',
    hiRole: 'Development और interaction',
    blurb: 'I helped turn our ideas into working pages, buttons, interactions and the logic behind the features.',
    hiBlurb: 'मैंने ideas को working pages, buttons, interactions और features की logic में बदलने में help की।',
    tone: '#1a9e8a',
  },
  {
    initials: 'Y',
    name: 'Yadhuveer',
    role: 'Research & content',
    hiRole: 'Research और content',
    blurb: 'I worked on the research and tried to keep the information simple, readable and backed by sources.',
    hiBlurb: 'मैंने research पर काम किया और कोशिश की कि information simple, readable और sources पर based रहे।',
    tone: '#60a5fa',
  },
]

export default function AboutUs() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen pt-16">
      <section className="relative overflow-hidden py-24 md:py-28 bg-[#0b1830] bf-hero">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 18% 28%, rgba(26,158,138,.11), transparent 38%), radial-gradient(circle at 84% 12%, rgba(167,139,250,.12), transparent 35%)' }} />
        <div className="max-w-5xl mx-auto px-6 text-center relative">
          <div className="flex justify-center mb-9">
            <div className="rounded-3xl border border-white/10 bg-black/20 px-7 py-6 shadow-[0_0_70px_rgba(167,139,250,.11)]">
              <BrandLogo className="h-20 md:h-24" />
            </div>
          </div>
          <p className="text-[#a78bfa] text-[11px] font-black uppercase tracking-[0.24em] mb-4">{tx('Behind BreakFree', 'BreakFree के पीछे', language)}</p>
          <h1 className="text-5xl md:text-7xl font-black text-[#f0ede6] leading-[0.92] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            {tx('We wanted to make something people could actually use.', 'हम कुछ ऐसा बनाना चाहते थे जिसे लोग सच में use कर सकें।', language)}
          </h1>
          <p className="text-[#aebed0] text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            {tx('BreakFree started as an Anvesh Bharat school project. Once we got into the topic, we didn’t want to stop at a poster, presentation or a page full of facts. We kept asking ourselves: what would actually be useful to someone who needs help?', 'BreakFree की शुरुआत Anvesh Bharat के school project से हुई। Topic में जाने के बाद हमें लगा कि final result सिर्फ poster, presentation या facts की list नहीं होना चाहिए। हम बार-बार सोचते रहे: किसी को सच में help चाहिए हो, तो उसके लिए क्या useful होगा?', language)}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#0a1628] bf-section-edge">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-7 items-start">
            <article className="bf-card rounded-3xl p-7 md:p-10 border border-[#526985]/30 bg-[#111f3a]">
              <div className="flex items-center justify-between gap-4 mb-7">
                <p className="text-[#1a9e8a] text-[10px] font-black uppercase tracking-[0.22em]">{tx('The idea', 'विचार', language)}</p>
                <span className="rounded-full border border-[#1e3050] bg-[#0d1e36] px-3 py-1.5 text-[10px] font-bold text-[#71869f]">ANVESH BHARAT</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#f0ede6] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                {tx('We didn’t want to make a website that just tells people, ‘Don’t do drugs.’ We wanted to make the next step easier to find.', 'हम सिर्फ यह बताने वाली website नहीं बनाना चाहते थे कि ‘drugs मत करो।’ हम अगला सही कदम ढूँढना आसान बनाना चाहते थे।', language)}
              </h2>
              <div className="space-y-4 text-[#b8c6d5] text-base md:text-lg leading-relaxed">
                <p>{tx('We’re Saad, Jagrav and Yadhuveer — three students working on Anvesh Bharat. While researching this topic, we noticed something pretty simple: there can be a lot of information online, but when someone is actually struggling, it can still be hard to know what to do next.', 'हम Saad, Jagrav और Yadhuveer हैं — Anvesh Bharat पर काम करने वाले तीन students। इस topic पर research करते हुए हमें एक simple चीज़ notice हुई: online information बहुत हो सकती है, फिर भी जब कोई सच में struggle कर रहा हो तो next step समझना मुश्किल हो सकता है।', language)}</p>
                <p>{tx('That is where BreakFree came from. We tried to make one place where someone can understand the basics, answer a few questions without giving away personal details, get a plan that matches what they told us, find real support resources and track progress if they want to.', 'यहीं से BreakFree का idea आया। हमने एक ऐसी जगह बनाने की कोशिश की जहाँ कोई basics समझ सके, personal details दिए बिना कुछ questions answer कर सके, अपने answers के हिसाब से plan पाए, real support resources देख सके और चाहे तो अपनी progress track कर सके।', language)}</p>
                <p>{tx('We’re still students, not doctors or counsellors, so we’re not pretending a website can fix addiction. Our aim is smaller and more practical: make the first step feel less confusing and help people find the support that already exists.', 'हम students हैं, doctors या counsellors नहीं, इसलिए हम यह pretend नहीं कर रहे कि website addiction solve कर सकती है। हमारा aim simple है: पहला step कम confusing बनाना और people को उस support तक पहुँचने में help करना जो already मौजूद है।', language)}</p>
              </div>
            </article>

            <div className="space-y-4">
              <div className="rounded-3xl border border-[#a78bfa]/22 bg-[#a78bfa]/6 p-7">
                <div className="flex items-center justify-between mb-5"><span className="text-2xl text-[#c6b9fa]">01</span><span className="text-[#a78bfa] text-[10px] uppercase tracking-[0.2em] font-black">{tx('What we kept coming back to', 'जिस बात पर हम बार-बार लौटे', language)}</span></div>
                <h3 className="text-2xl font-black text-[#f0ede6] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{tx('Don’t lecture people.', 'Lecture जैसा न लगे।', language)}</h3>
                <p className="text-[#8fa3bc] text-sm leading-relaxed">{tx('We didn’t want fear or guilt to be the whole message. We wanted the site to sound like a person helping, not a textbook talking at you.', 'हम नहीं चाहते थे कि पूरा message डर या guilt पर टिका हो। Website को ऐसा रखना था जैसे कोई इंसान help कर रहा हो, textbook lecture नहीं दे रहा।', language)}</p>
              </div>
              <div className="rounded-3xl border border-[#1a9e8a]/22 bg-[#1a9e8a]/6 p-7">
                <div className="flex items-center justify-between mb-5"><span className="text-2xl text-[#54d5bf]">02</span><span className="text-[#54d5bf] text-[10px] uppercase tracking-[0.2em] font-black">{tx('What we kept coming back to', 'जिस बात पर हम बार-बार लौटे', language)}</span></div>
                <h3 className="text-2xl font-black text-[#f0ede6] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{tx('Make it useful.', 'इसे useful बनाना।', language)}</h3>
                <p className="text-[#8fa3bc] text-sm leading-relaxed">{tx('A good-looking page is nice, but it should still answer the simple question: ‘Okay, what do I do next?’', 'Pretty page अच्छी है, लेकिन आखिर में simple सवाल का answer मिलना चाहिए: ‘अब क्या करूँ?’', language)}</p>
              </div>
              <div className="rounded-3xl border border-[#60a5fa]/22 bg-[#60a5fa]/6 p-7">
                <div className="flex items-center justify-between mb-5"><span className="text-2xl text-[#93c5fd]">03</span><span className="text-[#60a5fa] text-[10px] uppercase tracking-[0.2em] font-black">{tx('What we kept coming back to', 'जिस बात पर हम बार-बार लौटे', language)}</span></div>
                <h3 className="text-2xl font-black text-[#f0ede6] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{tx('Treat people like people.', 'लोगों को इंसान की तरह देखें।', language)}</h3>
                <p className="text-[#8fa3bc] text-sm leading-relaxed">{tx('Everyone’s situation is different. A student, a parent and a working adult might need very different kinds of support, so we tried not to make one generic answer fit everyone.', 'हर व्यक्ति की situation अलग हो सकती है। Student, parent या working adult को अलग तरह की support चाहिए हो सकती है, इसलिए हमने सबके लिए एक ही generic answer नहीं रखा।', language)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#0d1e36]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.22em] mb-2">{tx('Meet the team', 'हमारी team', language)}</p>
              <h2 className="text-3xl md:text-5xl font-black text-[#f0ede6]" style={{ fontFamily: 'var(--font-display)' }}>{tx('Three students. One idea we cared about.', 'तीन students। एक idea जिसे हमने seriously लिया।', language)}</h2>
            </div>
            <span className="hidden md:block text-[#667b95] text-xs">{tx('We split the work, then built it together.', 'हमने काम बाँटा, फिर सब कुछ साथ में जोड़ा।', language)}</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {team.map(person => (
              <article key={person.name} className="group rounded-3xl border border-[#526985]/25 bg-[#111f3a] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#7b91aa]/40">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black border" style={{ color: person.tone, borderColor: `${person.tone}33`, background: `${person.tone}10` }}>{person.initials}</div>
                  <div><h3 className="text-xl font-black text-[#f0ede6]">{person.name}</h3><p className="text-[#8095ad] text-xs font-semibold">{language === 'hi' ? person.hiRole : person.role}</p></div>
                </div>
                <p className="text-[#9eafc2] text-sm leading-relaxed">{language === 'hi' ? person.hiBlurb : person.blurb}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-[#1e3050] bg-[#111f3a]/75 p-7">
              <p className="text-[#1a9e8a] text-[10px] uppercase tracking-[0.2em] font-black mb-3">{tx('What we built', 'हमने क्या बनाया', language)}</p>
              <h3 className="text-2xl font-black text-[#f0ede6] mb-3" style={{ fontFamily: 'var(--font-display)' }}>{tx('What we actually built.', 'हमने सच में क्या बनाया।', language)}</h3>
              <p className="text-[#8fa3bc] text-sm leading-relaxed">{tx('Personal Plan, Streak & Rewards, support resources, bilingual content and a source-backed library — all in one place.', 'Personal Plan, Streak & Rewards, support resources, bilingual content और source-backed library — सब एक जगह।', language)}</p>
            </div>
            <div className="rounded-3xl border border-[#1e3050] bg-[#111f3a]/75 p-7">
              <p className="text-[#a78bfa] text-[10px] uppercase tracking-[0.2em] font-black mb-3">{tx('What we learned', 'हमने क्या सीखा', language)}</p>
              <h3 className="text-2xl font-black text-[#f0ede6] mb-3" style={{ fontFamily: 'var(--font-display)' }}>{tx('We learned that design changes the way a message feels.', 'हमने सीखा कि design से message का feel बदल जाता है।', language)}</h3>
              <p className="text-[#8fa3bc] text-sm leading-relaxed">{tx('This topic can feel heavy. So while building the site, we kept asking whether a page felt clear, respectful and easy to stay on. Small design choices mattered more than we expected.', 'यह topic heavy हो सकता है। इसलिए हम बार-बार देखते रहे कि page clear, respectful और easy-to-use लग रहा है या नहीं। Small design choices हमने जितना सोचा था उससे ज्यादा important निकले।', language)}</p>
            </div>
            <div className="rounded-3xl border border-[#1e3050] bg-[#111f3a]/75 p-7">
              <p className="text-[#60a5fa] text-[10px] uppercase tracking-[0.2em] font-black mb-3">{tx('Where we want to go', 'हम आगे क्या चाहते हैं', language)}</p>
              <h3 className="text-2xl font-black text-[#f0ede6] mb-3" style={{ fontFamily: 'var(--font-display)' }}>{tx('We’d rather keep improving than just add more.', 'More जोड़ने से बेहतर है useful चीज़ें बेहतर करना।', language)}</h3>
              <p className="text-[#8fa3bc] text-sm leading-relaxed">{tx('We know this is still a student project, and there is a lot we could improve. But that is part of the point. We’d rather make the useful parts better than add features just to make the website bigger.', 'हमें पता है कि यह अभी भी student project है और इसे और बेहतर किया जा सकता है। लेकिन यही point है। Website को बस बड़ा बनाने के बजाय हम useful parts को बेहतर करना चाहते हैं।', language)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d1e36]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl border border-[#a78bfa]/25 bg-[#a78bfa]/7 flex items-center justify-center text-[#c6b9fa] text-2xl mb-5">→</div>
          <h2 className="text-3xl md:text-5xl font-black text-[#f0ede6] mb-4" style={{ fontFamily: 'var(--font-display)' }}>{tx('We hope the next step feels a little easier.', 'हमें उम्मीद है कि अगला कदम थोड़ा आसान लगे।', language)}</h2>
          <p className="text-[#8fa3bc] leading-relaxed mb-7">{tx('That’s really why we made BreakFree. You don’t have to figure everything out at once. Start with one useful step, then take the next one.', 'यही BreakFree बनाने की वजह है। सब कुछ एक साथ figure out करना जरूरी नहीं। एक useful step से शुरू करें, फिर अगला लें।', language)}</p>
          <Link to="/personal-plan" className="inline-flex items-center gap-2 bg-[#1a9e8a] hover:bg-[#158a78] text-white font-black rounded-xl px-6 py-3.5 transition-all hover:-translate-y-0.5 shadow-[0_12px_32px_rgba(26,158,138,.14)]">{tx('Build a plan', 'Plan बनाएं', language)} →</Link>
        </div>
      </section>
    </div>
  )
}
