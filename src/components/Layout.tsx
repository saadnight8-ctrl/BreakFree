import { Outlet, NavLink, useLocation } from 'react-router'
import { useState, useEffect } from 'react'
import { copy, useLanguage } from '../i18n'
import BrandLogo from './BrandLogo'

export default function Layout() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { language, setLanguage } = useLanguage()
  const c = copy.nav[language]
  const f = copy.footer[language]

  const nav = [
    { label: c.home, to: '/' },
    { label: c.plan, to: '/personal-plan' },
    { label: c.faq, to: '/faq' },
    { label: c.help, to: '/help' },
    { label: c.streak, to: '/streak' },
    { label: c.contact, to: '/contact' },
  ]

  const footerPages = [
    ...nav,
    { label: c.directions, to: '/directions' },
    { label: c.crisis, to: '/crisis' },
    { label: c.bibliography, to: '/bibliography' },
    { label: c.about, to: '/about' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: 'var(--font-body)', background: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      <div className="bf-ambient bf-ambient-a" aria-hidden="true" />
      <div className="bf-ambient bf-ambient-b" aria-hidden="true" />
      <div className="bf-grid" aria-hidden="true" />

      <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1a9e8a]/70 to-transparent" />
      </div>

      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          borderBottom: scrolled ? '1px solid rgba(83,108,139,0.28)' : '1px solid transparent',
          background: scrolled ? 'rgba(6,14,28,0.84)' : 'rgba(10,22,40,0.16)',
          backdropFilter: 'blur(20px)',
          boxShadow: scrolled ? '0 14px 34px rgba(0,0,0,0.18)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-6 h-16 flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-2.5 group shrink-0" aria-label="BreakFree home">
            <BrandLogo compact className="group-hover:scale-[1.04] transition-transform duration-200" />
          </NavLink>

          <div className="hidden lg:flex items-center gap-0.5 min-w-0">
            {nav.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) => `px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 whitespace-nowrap ${isActive ? (n.to === '/personal-plan' ? 'bg-[#a78bfa]/15 text-[#d6ccff] ring-1 ring-[#a78bfa]/20' : 'bg-[#1a9e8a]/15 text-[#54d5bf] shadow-[0_0_24px_rgba(26,158,138,0.08)]') : (n.to === '/personal-plan' ? 'text-[#c7bfff] hover:text-white hover:bg-[#a78bfa]/10' : 'text-[#8fa3bc] hover:text-[#f0ede6] hover:bg-white/5')}`}
              >
                {n.label}
              </NavLink>
            ))}
            <NavLink
              to="/crisis"
              className="ml-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-[0_0_22px_rgba(220,38,38,0.22)] hover:shadow-[0_0_30px_rgba(220,38,38,0.35)]"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {c.crisis}
            </NavLink>
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="ml-2 px-3 py-2 rounded-full border border-[#1e3050] bg-[#111f3a]/70 text-[#c8d8e8] text-xs font-bold hover:border-[#1a9e8a]/50 hover:text-white transition-all"
              aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
            >
              {c.toggle}
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-3 py-1.5 rounded-full border border-[#1e3050] bg-[#111f3a]/70 text-[#c8d8e8] text-xs font-bold"
            >
              {c.toggle}
            </button>
            <button
              className="text-[#8fa3bc] hover:text-white p-2"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                {menuOpen
                  ? <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  : <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-[#0b1830]/95 backdrop-blur-xl border-t border-[#1e3050] px-5 py-4 flex flex-col gap-1 shadow-2xl">
            {nav.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) => `px-4 py-2.5 rounded-lg text-sm font-medium ${isActive ? 'bg-[#1a9e8a]/15 text-[#54d5bf]' : 'text-[#c8d8e8]'}`}
              >
                {n.label}
              </NavLink>
            ))}
            <NavLink
              to="/crisis"
              className="mt-2 bg-red-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {c.crisis}
            </NavLink>
          </div>
        )}
      </nav>

      <main className="relative z-10">
        <Outlet />
      </main>

      <footer className="relative z-10 bg-[#060e1c]/90 backdrop-blur-xl border-t border-[#1e3050] py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <BrandLogo />
                <span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] text-[#667b95]">One step at a time</span>
              </div>
              <p className="text-[#8fa3bc] text-sm leading-relaxed max-w-xs">{f.blurb}</p>
              <div className="mt-5 inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-xs font-semibold">{f.drugHelpline}: 14446</span>
              </div>
            </div>
            <div>
              <h4 className="text-[#f0ede6] font-semibold text-sm mb-4">{f.pages}</h4>
              <div className="flex flex-col gap-2">
                {footerPages.map(n => (
                  <NavLink key={n.to} to={n.to} className="text-[#8fa3bc] hover:text-[#f0ede6] text-sm transition-colors">
                    {n.label}
                  </NavLink>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[#f0ede6] font-semibold text-sm mb-4">{f.emergency}</h4>
              <div className="flex flex-col gap-3 text-sm">
                <div><div className="text-[#f0ede6] font-medium">{f.drugHelpline}</div><a href="tel:14446" className="text-[#1a9e8a] font-bold hover:underline">14446</a></div>
                <div><div className="text-[#f0ede6] font-medium">{f.icall}</div><a href="tel:022-25521111" className="text-[#e8a020] font-bold hover:underline">022-25521111</a></div>
                <div><div className="text-[#f0ede6] font-medium">{f.emergencyServices}</div><a href="tel:100" className="text-red-400 font-bold hover:underline">100</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-[#1e3050] pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#8fa3bc]">
            <span>© 2026 BreakFree School Project. All rights reserved.</span>
            <span>🇮🇳 {f.footerNote}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
