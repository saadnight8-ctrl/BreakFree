import { Link } from 'react-router'
import { useLanguage, tx } from '../i18n'

export default function NotFound() {
  const { language } = useLanguage()
  return <div className="min-h-screen pt-16 flex items-center justify-center px-6"><div className="text-center">
    <div className="text-8xl font-black text-[#1e3050] mb-4" style={{ fontFamily: 'var(--font-display)' }}>404</div>
    <h1 className="text-3xl font-black text-[#f0ede6] mb-3" style={{ fontFamily: 'var(--font-display)' }}>{tx('That page is not here', 'यह पेज यहाँ नहीं है', language)}</h1>
    <p className="text-[#8fa3bc] text-sm mb-8">{tx('Looks like that link does not point anywhere.', 'लगता है यह लिंक कहीं नहीं जा रहा।', language)}</p>
    <Link to="/" className="inline-flex items-center gap-2 bg-[#1a9e8a] hover:bg-[#158a78] text-white font-semibold px-6 py-3 rounded-full text-sm transition-all">← {tx('Back home', 'होम पर जाएँ', language)}</Link>
  </div></div>
}
