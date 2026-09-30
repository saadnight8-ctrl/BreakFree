import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useLanguage, tx } from '../i18n'

export default function Contact() {
  const { language } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const update = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(f => ({ ...f, [field]: e.target.value }))

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return <div className="min-h-screen pt-16">
    <section className="py-20 bg-[#0d1e36] relative overflow-hidden bf-hero">
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <p className="text-[#60a5fa] text-xs font-semibold uppercase tracking-widest mb-4">{tx('Contact', 'संपर्क', language)}</p>
        <h1 className="text-5xl md:text-6xl font-black text-[#f0ede6] leading-tight mb-5" style={{ fontFamily: 'var(--font-display)' }}>{tx('Talk to us', 'हमसे बात करें', language)}</h1>
        <p className="text-[#8fa3bc] text-lg leading-relaxed">{tx('Got a question about the project? Send us a message.', 'प्रोजेक्ट के बारे में कोई सवाल है? हमें संदेश भेजें।', language)}</p>
      </div>
    </section>
    <section className="py-16 bg-[#0a1628]">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-black text-[#f0ede6] mb-4" style={{ fontFamily: 'var(--font-display)' }}>{tx('Send us a message', 'संदेश भेजें', language)}</h2>
          <p className="text-[#8fa3bc] text-sm leading-relaxed mb-8">{tx('Use the form if something on the site is unclear or you have a project question.', 'अगर साइट पर कुछ साफ नहीं है या प्रोजेक्ट के बारे में सवाल है, तो फॉर्म का इस्तेमाल करें।', language)}</p>
          <div className="mb-7"><p className="text-[#c8d8e8] text-xs font-semibold uppercase tracking-wider mb-2">{tx('Email', 'ईमेल', language)}</p><a href="mailto:saadnight8@gmail.com" className="text-[#60a5fa] hover:underline break-all">saadnight8@gmail.com</a></div>
          <div><p className="text-[#c8d8e8] text-xs font-semibold uppercase tracking-wider mb-2">{tx('Phone', 'फोन', language)}</p><a href="tel:9599763966" className="text-red-400 font-black text-lg hover:underline" style={{ fontFamily: 'var(--font-display)' }}>9599763966</a></div>
        </div>
        <div className="md:col-span-3">
          {!sent ? <form onSubmit={handleSubmit} className="bf-card rounded-2xl p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <label><span className="block text-[#c8d8e8] text-xs font-medium mb-2">{tx('Name', 'नाम', language)}</span><input required value={form.name} onChange={update('name')} placeholder={tx('Your name', 'आपका नाम', language)} className="w-full bg-[#0d1e36] border border-[#1e3050] focus:border-[#1a9e8a] text-[#f0ede6] placeholder-[#657b96] rounded-xl px-4 py-3 outline-none transition-colors text-sm" /></label>
              <label><span className="block text-[#c8d8e8] text-xs font-medium mb-2">{tx('Email', 'ईमेल', language)}</span><input required type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" className="w-full bg-[#0d1e36] border border-[#1e3050] focus:border-[#1a9e8a] text-[#f0ede6] placeholder-[#657b96] rounded-xl px-4 py-3 outline-none transition-colors text-sm" /></label>
            </div>
            <label><span className="block text-[#c8d8e8] text-xs font-medium mb-2">{tx('Subject', 'विषय', language)}</span><select required value={form.subject} onChange={update('subject')} className="w-full bg-[#0d1e36] border border-[#1e3050] focus:border-[#1a9e8a] text-[#f0ede6] rounded-xl px-4 py-3 outline-none transition-colors text-sm"><option value="">{tx('Choose a topic...', 'विषय चुनें...', language)}</option><option>{tx('General question', 'सामान्य सवाल', language)}</option><option>{tx('School collaboration', 'स्कूल सहयोग', language)}</option><option>{tx('Project feedback', 'प्रोजेक्ट फीडबैक', language)}</option><option>{tx('Other', 'अन्य', language)}</option></select></label>
            <label><span className="block text-[#c8d8e8] text-xs font-medium mb-2">{tx('Message', 'संदेश', language)}</span><textarea required rows={5} value={form.message} onChange={update('message')} placeholder={tx('What do you want to ask?', 'आप क्या पूछना चाहते हैं?', language)} className="w-full bg-[#0d1e36] border border-[#1e3050] focus:border-[#1a9e8a] text-[#f0ede6] placeholder-[#657b96] rounded-xl px-4 py-3 outline-none transition-colors text-sm resize-none" /></label>
            <button type="submit" className="w-full bg-[#1a9e8a] hover:bg-[#158a78] text-white font-semibold py-3.5 rounded-xl transition-all hover:-translate-y-0.5 text-sm">{tx('Send message →', 'संदेश भेजें →', language)}</button>
          </form> : <div className="bf-card rounded-2xl p-10 text-center border-[#1a9e8a]/40"><div className="text-5xl mb-5">✓</div><h3 className="text-2xl font-black text-[#1a9e8a] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{tx('Message saved', 'संदेश सेव हो गया', language)}</h3><p className="text-[#c8d8e8] text-sm">{tx('Thanks for getting in touch.', 'संपर्क करने के लिए धन्यवाद।', language)}</p><button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }} className="mt-6 text-[#8fa3bc] hover:text-white text-sm underline">{tx('Send another message', 'एक और संदेश भेजें', language)}</button></div>}
        </div>
      </div>
    </section>
  </div>
}
