import { useEffect, useMemo, useState } from 'react'
import { useLanguage, tx } from '../i18n'

const MILESTONES = [
  { days: 1, badge: '🌱', title: 'Day One', hi: 'पहला दिन', desc: 'You started.', descHi: 'आपने शुरुआत की।' },
  { days: 7, badge: '🔥', title: 'One Week', hi: 'एक हफ्ता', desc: 'A full week of progress.', descHi: 'एक पूरे हफ्ते की प्रगति।' },
  { days: 30, badge: '⭐', title: 'One Month', hi: 'एक महीना', desc: 'A month of showing up.', descHi: 'एक महीने की लगातार प्रगति।' },
  { days: 60, badge: '🦋', title: 'Two Months', hi: 'दो महीने', desc: 'You kept the change going.', descHi: 'आपने बदलाव को जारी रखा।' },
  { days: 90, badge: '🏆', title: 'Three Months', hi: 'तीन महीने', desc: 'A major milestone.', descHi: 'एक बड़ा पड़ाव।' },
  { days: 180, badge: '🌟', title: 'Six Months', hi: 'छह महीने', desc: 'Half a year of progress.', descHi: 'छह महीनों की प्रगति।' },
  { days: 365, badge: '👑', title: 'One Year', hi: 'एक साल', desc: 'A full year of progress.', descHi: 'एक पूरे साल की प्रगति।' },
]

export default function StreakRewards() {
  const { language } = useLanguage()
  const [startDate, setStartDate] = useState('')
  const [manualDays, setManualDays] = useState('')
  const [currentDays, setCurrentDays] = useState(0)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const savedStart = window.localStorage.getItem('breakfree-streak-start') ?? ''
      const savedDays = window.localStorage.getItem('breakfree-streak-days') ?? ''
      setStartDate(savedStart)
      setManualDays(savedDays)
    } catch {
      // Storage can be blocked in some browser modes. The page still works.
    }
  }, [])

  useEffect(() => {
    if (!startDate) return
    const date = new Date(`${startDate}T00:00:00`)
    if (Number.isNaN(date.getTime())) return
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const diff = Math.floor((todayStart.getTime() - date.getTime()) / 86400000)
    setCurrentDays(Math.max(0, diff))
  }, [startDate])

  useEffect(() => {
    if (!startDate && manualDays !== '') {
      const parsed = Number(manualDays)
      setCurrentDays(Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0)
    }
  }, [manualDays, startDate])

  const earned = useMemo(() => MILESTONES.filter(m => currentDays >= m.days), [currentDays])
  const next = useMemo(() => MILESTONES.find(m => currentDays < m.days), [currentDays])
  const progressToNext = next
    ? Math.min(100, Math.max(0, ((currentDays - (MILESTONES[MILESTONES.indexOf(next) - 1]?.days ?? 0)) / (next.days - (MILESTONES[MILESTONES.indexOf(next) - 1]?.days ?? 0))) * 100))
    : 100

  function saveProgress() {
    try {
      if (startDate) {
        window.localStorage.setItem('breakfree-streak-start', startDate)
        window.localStorage.removeItem('breakfree-streak-days')
      } else {
        const cleaned = String(Math.max(0, Math.floor(Number(manualDays) || 0)))
        window.localStorage.setItem('breakfree-streak-days', cleaned)
        window.localStorage.removeItem('breakfree-streak-start')
        setManualDays(cleaned)
        setCurrentDays(Number(cleaned))
      }
      setSaved(true)
      window.setTimeout(() => setSaved(false), 1800)
    } catch {
      setSaved(false)
    }
  }

  function startToday() {
    const today = new Date()
    const value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    setStartDate(value)
    setManualDays('')
    try { window.localStorage.setItem('breakfree-streak-start', value) } catch { /* no-op */ }
  }

  function resetTracker() {
    setStartDate('')
    setManualDays('')
    setCurrentDays(0)
    try {
      window.localStorage.removeItem('breakfree-streak-start')
      window.localStorage.removeItem('breakfree-streak-days')
    } catch { /* no-op */ }
  }

  const ring = 2 * Math.PI * 54
  const dash = ring * (Math.min(currentDays / 365, 1))

  return (
    <div className="min-h-screen pt-16">
      <section className="relative overflow-hidden py-24 bg-[#0b1830] bf-hero">
        <div className="max-w-5xl mx-auto px-6 relative">
          <p className="text-[#a78bfa] text-xs font-semibold uppercase tracking-[0.24em] mb-5">{tx('Make progress visible', 'अपनी प्रगति को दिखने लायक बनाएं', language)}</p>
          <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-[#f0ede6] leading-[0.92] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                {tx('Your streak.', 'आपकी स्ट्रीक।', language)}<br />
                <span className="text-[#a78bfa]">{tx('Your milestones.', 'आपकी उपलब्धियाँ।', language)}</span>
              </h1>
              <p className="text-[#8fa3bc] text-lg leading-relaxed max-w-xl">
                {tx('This tracker is optional. Use it as a simple way to notice progress. Your data stays in this browser on this device.', 'यह ट्रैकर वैकल्पिक है। इसे प्रगति देखने के आसान तरीके की तरह इस्तेमाल करें। आपका डेटा इसी डिवाइस के इस ब्राउज़र में सेव रहता है।', language)}
              </p>
            </div>
            <div className="bf-card rounded-3xl p-7 flex items-center gap-6 bg-[#111f3a]/90">
              <div className="relative w-32 h-32 shrink-0">
                <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
                  <circle cx="64" cy="64" r="54" stroke="#1e3050" strokeWidth="10" fill="none" />
                  <circle cx="64" cy="64" r="54" stroke="#a78bfa" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${dash} ${ring}`} className="transition-all duration-700" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[#f0ede6]" style={{ fontFamily: 'var(--font-display)' }}>{currentDays}</span>
                  <span className="text-[10px] text-[#8fa3bc] uppercase tracking-widest">{tx('days', 'दिन', language)}</span>
                </div>
              </div>
              <div>
                <p className="text-[#a78bfa] text-xs uppercase tracking-widest font-bold mb-2">{tx('Current streak', 'वर्तमान स्ट्रीक', language)}</p>
                <h2 className="text-2xl font-black text-[#f0ede6] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{next ? (language === 'hi' ? `${next.hi} तक` : `Next: ${next.title}`) : tx('All milestones reached', 'सभी उपलब्धियाँ हासिल', language)}</h2>
                <p className="text-[#8fa3bc] text-sm leading-relaxed">{next ? tx(`${next.days - currentDays} days to go`, `${next.days - currentDays} दिन बाकी`, language) : tx('Keep going at your own pace.', 'अपनी गति से आगे बढ़ते रहें।', language)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bf-card rounded-3xl p-7 md:p-9">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-7">
              <div>
                <p className="text-[#1a9e8a] text-xs uppercase tracking-[0.2em] font-bold mb-2">{tx('Set your tracker', 'अपना ट्रैकर सेट करें', language)}</p>
                <h2 className="text-3xl font-black text-[#f0ede6]" style={{ fontFamily: 'var(--font-display)' }}>{tx('Start from a date or enter your days', 'तारीख से शुरू करें या दिनों की संख्या डालें', language)}</h2>
              </div>
              <button onClick={startToday} type="button" className="text-sm font-semibold text-[#1a9e8a] hover:text-[#54d5bf] transition-colors">{tx('Start today →', 'आज से शुरू करें →', language)}</button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <label className="block">
                <span className="block text-[#c8d8e8] text-sm font-medium mb-2">{tx('Start date', 'शुरुआत की तारीख', language)}</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => { setStartDate(e.target.value); setManualDays('') }}
                  className="w-full bg-[#0d1e36] border border-[#1e3050] focus:border-[#a78bfa] text-[#f0ede6] rounded-xl px-5 py-3 outline-none transition-all text-sm"
                />
              </label>
              <label className="block">
                <span className="block text-[#c8d8e8] text-sm font-medium mb-2">{tx('Or enter current days', 'या अभी के दिन डालें', language)}</span>
                <input
                  type="number"
                  min="0"
                  value={manualDays}
                  onChange={e => { setManualDays(e.target.value); setStartDate('') }}
                  placeholder="e.g. 45"
                  className="w-full bg-[#0d1e36] border border-[#1e3050] focus:border-[#a78bfa] text-[#f0ede6] placeholder-[#657b96] rounded-xl px-5 py-3 outline-none transition-all text-sm"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button onClick={saveProgress} type="button" className="bg-[#1a9e8a] hover:bg-[#158a78] text-white font-semibold px-6 py-3 rounded-full text-sm transition-all hover:-translate-y-0.5">
                {saved ? tx('Saved ✓', 'सेव हो गया ✓', language) : tx('Save my progress', 'मेरी प्रगति सेव करें', language)}
              </button>
              <button onClick={resetTracker} type="button" className="text-[#8fa3bc] hover:text-[#f0ede6] text-sm px-4 py-3 transition-colors">{tx('Reset', 'रीसेट', language)}</button>
              <span className="text-[#657b96] text-xs">{tx('Saved locally • no account needed', 'लोकल सेव • अकाउंट की जरूरत नहीं', language)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d1e36]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-end justify-between gap-5 mb-9">
            <div>
              <p className="text-[#e8a020] text-xs uppercase tracking-[0.2em] font-bold mb-2">{tx('Rewards', 'रिवॉर्ड्स', language)}</p>
              <h2 className="text-3xl md:text-4xl font-black text-[#f0ede6]" style={{ fontFamily: 'var(--font-display)' }}>{tx('Milestones worth noticing', 'ऐसी उपलब्धियाँ जिन्हें नोटिस करना अच्छा है', language)}</h2>
            </div>
            <div className="text-right text-sm text-[#8fa3bc]">{earned.length}/{MILESTONES.length} {tx('unlocked', 'अनलॉक', language)}</div>
          </div>

          {next && (
            <div className="mb-7 rounded-2xl border border-[#a78bfa]/25 bg-[#a78bfa]/8 p-5">
              <div className="flex justify-between gap-4 text-xs mb-2">
                <span className="text-[#c8d8e8] font-semibold">{tx('Progress to next milestone', 'अगली उपलब्धि तक प्रगति', language)}</span>
                <span className="text-[#a78bfa] font-bold">{Math.round(progressToNext)}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#111f3a] overflow-hidden"><div className="h-full rounded-full bg-[#a78bfa] transition-all duration-700" style={{ width: `${progressToNext}%` }} /></div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MILESTONES.map(m => {
              const isEarned = currentDays >= m.days
              return (
                <div key={m.days} className={`bf-card rounded-2xl p-6 ${isEarned ? 'border-[#a78bfa]/35 bg-[#a78bfa]/8' : 'opacity-60'}`}>
                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-4xl ${isEarned ? '' : 'grayscale'}`}>{m.badge}</span>
                    <span className="text-xs font-bold text-[#8fa3bc]">{m.days} {tx('days', 'दिन', language)}</span>
                  </div>
                  <h3 className="text-[#f0ede6] font-black mb-1" style={{ fontFamily: 'var(--font-display)' }}>{language === 'hi' ? m.hi : m.title}</h3>
                  <p className="text-[#8fa3bc] text-sm">{language === 'hi' ? m.descHi : m.desc}</p>
                  <div className="mt-5 text-xs font-bold" style={{ color: isEarned ? '#a78bfa' : '#657b96' }}>{isEarned ? tx('UNLOCKED ✓', 'अनलॉक ✓', language) : tx('LOCKED', 'लॉक्ड', language)}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#0a1628]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bf-card rounded-3xl p-8">
            <p className="text-[#8fa3bc] text-sm leading-relaxed">
              {tx('A streak is a tool, not a test. A difficult day does not erase everything you have learned or done. Professional support can still be useful at any point.', 'स्ट्रीक एक टूल है, परीक्षा नहीं। एक मुश्किल दिन आपकी पूरी मेहनत को मिटा नहीं देता। किसी भी समय पेशेवर सहायता लेना उपयोगी हो सकता है।', language)}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
