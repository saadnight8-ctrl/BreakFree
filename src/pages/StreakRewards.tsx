import { useEffect, useMemo, useState } from 'react'
import { useLanguage, tx, translateHindi } from '../i18n'

const MILESTONES = [
  { days: 1, badge: '🌱', title: 'Day One', hi: 'पहला दिन', desc: 'You decided to begin.', descHi: 'आपने शुरुआत करने का फैसला किया।', reward: 'Starter Badge', rewardHi: 'स्टार्टर बैज', reveal: 'Take 60 seconds to write one reason you want your life to look different.', revealHi: '60 सेकंड लेकर एक कारण लिखें कि आप अपनी ज़िंदगी को अलग क्यों देखना चाहते हैं।' },
  { days: 7, badge: '🔥', title: 'One Week', hi: 'एक हफ्ता', desc: 'Seven days of showing up.', descHi: 'सात दिनों तक लगातार आगे बढ़ना।', reward: 'Momentum Badge', rewardHi: 'मोमेंटम बैज', reveal: 'Pick one person, place or routine that helps you stay on track. Keep it close this week.', revealHi: 'एक व्यक्ति, जगह या रूटीन चुनें जो आपको ट्रैक पर रहने में मदद करे। इस हफ्ते उसे पास रखें।' },
  { days: 30, badge: '⭐', title: 'One Month', hi: 'एक महीना', desc: 'A month of steady progress.', descHi: 'एक महीने की लगातार प्रगति।', reward: 'Commitment Badge', rewardHi: 'कमिटमेंट बैज', reveal: 'Write down one thing that feels different from your first day.', revealHi: 'एक ऐसी चीज़ लिखें जो आपके पहले दिन से अब अलग महसूस होती है।' },
  { days: 60, badge: '🦋', title: 'Two Months', hi: 'दो महीने', desc: 'You kept the change going.', descHi: 'आपने बदलाव को जारी रखा।', reward: 'Reset Badge', rewardHi: 'रीसेट बैज', reveal: 'Choose one healthy routine you want to protect over the next seven days.', revealHi: 'अगले सात दिनों तक एक स्वस्थ रूटीन को बनाए रखने का फैसला करें।' },
  { days: 90, badge: '🏆', title: 'Three Months', hi: 'तीन महीने', desc: 'A major milestone.', descHi: 'एक बड़ा पड़ाव।', reward: 'Milestone Badge', rewardHi: 'माइलस्टोन बैज', reveal: 'Save one sentence about what has helped you keep going.', revealHi: 'एक वाक्य सेव करें कि आगे बढ़ते रहने में किस चीज़ ने मदद की।' },
  { days: 180, badge: '🌟', title: 'Six Months', hi: 'छह महीने', desc: 'Half a year of progress.', descHi: 'छह महीनों की प्रगति।', reward: 'Half-Year Badge', rewardHi: 'हाफ-ईयर बैज', reveal: 'Pick one part of your life you want to keep rebuilding next.', revealHi: 'अपनी ज़िंदगी के एक ऐसे हिस्से को चुनें जिसे आप आगे बेहतर बनाना चाहते हैं।' },
  { days: 365, badge: '👑', title: 'One Year', hi: 'एक साल', desc: 'A full year of progress.', descHi: 'एक पूरे साल की प्रगति।', reward: 'One-Year Badge', rewardHi: 'वन-ईयर बैज', reveal: 'Write yourself one line about what you have learned this year.', revealHi: 'इस साल आपने जो सीखा, उसके बारे में अपने लिए एक लाइन लिखें।' },
]

const CHECKINS = [
  { id: 'win', icon: '✦', title: 'Today felt good', hi: 'आज अच्छा लगा', body: 'Notice what helped. Keeping the good stuff close can make tomorrow easier.', bodyHi: 'जो मददगार रहा उसे नोटिस करें। अच्छी चीज़ों को पास रखना अगला दिन आसान बना सकता है।' },
  { id: 'hard', icon: '↗', title: 'Today felt hard', hi: 'आज मुश्किल था', body: 'A hard day is not the whole story. Reaching out for support is still a step forward.', bodyHi: 'एक मुश्किल दिन पूरी कहानी नहीं है। मदद तक पहुँचना फिर भी आगे बढ़ना है।' },
  { id: 'here', icon: '○', title: 'I am just showing up', hi: 'मैं बस आगे बढ़ रहा हूँ', body: 'That counts too. You do not have to feel perfect to keep moving.', bodyHi: 'यह भी मायने रखता है। आगे बढ़ने के लिए perfect महसूस करना जरूरी नहीं है।' },
]

function todayISO() {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

export default function StreakRewards() {
  const { language } = useLanguage()
  const [startDate, setStartDate] = useState('')
  const [manualDays, setManualDays] = useState('')
  const [currentDays, setCurrentDays] = useState(0)
  const [saved, setSaved] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState(0)
  const [claimed, setClaimed] = useState<number[]>([])
  const [checkIn, setCheckIn] = useState('')

  useEffect(() => {
    try {
      const savedStart = window.localStorage.getItem('breakfree-streak-start') ?? ''
      const savedDays = window.localStorage.getItem('breakfree-streak-days') ?? ''
      const savedClaimed = JSON.parse(window.localStorage.getItem('breakfree-claimed-milestones') ?? '[]')
      const savedCheckIn = window.localStorage.getItem('breakfree-checkin') ?? ''
      setStartDate(savedStart)
      setManualDays(savedDays)
      setClaimed(Array.isArray(savedClaimed) ? savedClaimed : [])
      setCheckIn(savedCheckIn)
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
  const selected = MILESTONES[selectedMilestone]
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
    const value = todayISO()
    setStartDate(value)
    setManualDays('')
    try { window.localStorage.setItem('breakfree-streak-start', value) } catch { /* no-op */ }
  }

  function resetTracker() {
    setStartDate('')
    setManualDays('')
    setCurrentDays(0)
    setClaimed([])
    setCheckIn('')
    try {
      window.localStorage.removeItem('breakfree-streak-start')
      window.localStorage.removeItem('breakfree-streak-days')
      window.localStorage.removeItem('breakfree-claimed-milestones')
      window.localStorage.removeItem('breakfree-checkin')
    } catch { /* no-op */ }
  }

  function claimMilestone(days: number) {
    if (currentDays < days || claimed.includes(days)) return
    const nextClaimed = [...claimed, days]
    setClaimed(nextClaimed)
    try { window.localStorage.setItem('breakfree-claimed-milestones', JSON.stringify(nextClaimed)) } catch { /* no-op */ }
  }

  function chooseCheckIn(id: string) {
    setCheckIn(id)
    try { window.localStorage.setItem('breakfree-checkin', id) } catch { /* no-op */ }
  }

  const ring = 2 * Math.PI * 54
  const dash = ring * (Math.min(currentDays / 365, 1))

  return (
    <div className="min-h-screen pt-16">
      <section className="relative overflow-hidden py-24 bg-[#0b1830] bf-hero">
        <div className="absolute top-16 right-0 w-72 h-72 rounded-full bg-[#a78bfa]/10 blur-3xl pointer-events-none" />
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
              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#a78bfa]/20 bg-[#a78bfa]/8 px-4 py-2 text-xs text-[#cfc3ff]">
                <span className="w-2 h-2 rounded-full bg-[#a78bfa]" />
                {tx('Tap a reward below to explore it', 'नीचे किसी reward पर टैप करके उसे देखें', language)}
              </div>
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
                <h2 className="text-2xl font-black text-[#f0ede6] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{next ? (language === 'hi' ? `${translateHindi(next.hi)} तक` : `Next: ${next.title}`) : tx('All milestones reached', 'सभी उपलब्धियाँ हासिल', language)}</h2>
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
                <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setManualDays('') }} className="w-full bg-[#0d1e36] border border-[#1e3050] focus:border-[#a78bfa] text-[#f0ede6] rounded-xl px-5 py-3 outline-none transition-all text-sm" />
              </label>
              <label className="block">
                <span className="block text-[#c8d8e8] text-sm font-medium mb-2">{tx('Or enter current days', 'या अभी के दिन डालें', language)}</span>
                <input type="number" min="0" value={manualDays} onChange={e => { setManualDays(e.target.value); setStartDate('') }} placeholder="e.g. 45" className="w-full bg-[#0d1e36] border border-[#1e3050] focus:border-[#a78bfa] text-[#f0ede6] placeholder-[#657b96] rounded-xl px-5 py-3 outline-none transition-all text-sm" />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button onClick={saveProgress} type="button" className="bg-[#1a9e8a] hover:bg-[#158a78] text-white font-semibold px-6 py-3 rounded-full text-sm transition-all hover:-translate-y-0.5">{saved ? tx('Saved ✓', 'सेव हो गया ✓', language) : tx('Save my progress', 'मेरी प्रगति सेव करें', language)}</button>
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
              <h2 className="text-3xl md:text-4xl font-black text-[#f0ede6]" style={{ fontFamily: 'var(--font-display)' }}>{tx('Tap a milestone. Unlock the moment.', 'किसी पड़ाव को टैप करें। उस पल को unlock करें।', language)}</h2>
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
            {MILESTONES.map((m, index) => {
              const isEarned = currentDays >= m.days
              const isSelected = selectedMilestone === index
              const isClaimed = claimed.includes(m.days)
              return (
                <button key={m.days} type="button" onClick={() => setSelectedMilestone(index)} className={`bf-card text-left rounded-2xl p-6 border transition-all ${isSelected ? 'bf-card-active' : 'border-[#1e3050]'} ${isEarned ? 'bg-[#a78bfa]/8' : 'opacity-70 hover:opacity-100'}`} style={{ ['--accent' as string]: '#a78bfa' }}>
                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-4xl ${isEarned ? '' : 'grayscale'}`}>{m.badge}</span>
                    <span className="text-xs font-bold text-[#8fa3bc]">{m.days} {tx('days', 'दिन', language)}</span>
                  </div>
                  <h3 className="text-[#f0ede6] font-black mb-1" style={{ fontFamily: 'var(--font-display)' }}>{language === 'hi' ? translateHindi(m.hi) : m.title}</h3>
                  <p className="text-[#8fa3bc] text-sm">{language === 'hi' ? translateHindi(m.descHi) : m.desc}</p>
                  <div className="mt-5 text-xs font-bold" style={{ color: isEarned ? '#a78bfa' : '#657b96' }}>{isClaimed ? tx('REWARD REVEALED ✓', 'रिवॉर्ड खुल गया ✓', language) : isEarned ? tx('TAP TO REVEAL', 'देखने के लिए टैप करें', language) : tx('LOCKED', 'लॉक्ड', language)}</div>
                </button>
              )
            })}
          </div>

          <div className="mt-5 bf-card rounded-3xl p-7 md:p-8 border border-[#a78bfa]/25 bg-[#111f3a]">
            {!claimed.includes(selected.days) ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-7">
                <div className="flex gap-5 items-center">
                  <div className="w-20 h-20 rounded-2xl border border-[#a78bfa]/25 bg-[#0b1830] flex items-center justify-center text-4xl grayscale opacity-60 shrink-0">🔒</div>
                  <div>
                    <p className="text-[#a78bfa] text-xs uppercase tracking-widest font-bold mb-1">{currentDays >= selected.days ? tx('Milestone ready', 'माइलस्टोन तैयार है', language) : tx('Next reward', 'अगला रिवॉर्ड', language)}</p>
                    <h3 className="text-xl md:text-2xl font-black text-[#f0ede6] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                      {currentDays >= selected.days ? tx('Something is waiting inside.', 'अंदर कुछ आपका इंतज़ार कर रहा है।', language) : tx('Keep going to unlock it.', 'इसे अनलॉक करने के लिए आगे बढ़ते रहें।', language)}
                    </h3>
                    <p className="text-[#8fa3bc] text-sm leading-relaxed">
                      {currentDays >= selected.days
                        ? tx('Tap reveal to open your badge and the small challenge attached to it.', 'रिवील दबाकर अपना बैज और उससे जुड़ा छोटा challenge खोलें।', language)
                        : tx(`${selected.days - currentDays} days to go`, `${selected.days - currentDays} दिन बाकी`, language)}
                    </p>
                  </div>
                </div>
                {currentDays >= selected.days && (
                  <button onClick={() => claimMilestone(selected.days)} type="button" className="shrink-0 px-6 py-3 rounded-full text-sm font-bold bg-[#a78bfa] text-[#0a1628] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#a78bfa]/25 transition-all">
                    {tx('Reveal my reward →', 'मेरा रिवॉर्ड खोलें →', language)}
                  </button>
                )}
              </div>
            ) : (
              <div className="bf-reward-reveal grid md:grid-cols-[160px_1fr] gap-7 items-center">
                <div className="relative mx-auto">
                  <div className="absolute inset-0 rounded-[2rem] bg-[#a78bfa]/25 blur-2xl" />
                  <div className="relative w-36 h-36 rounded-[2rem] border border-[#a78bfa]/45 bg-gradient-to-br from-[#a78bfa]/25 via-[#182642] to-[#0b1830] flex flex-col items-center justify-center shadow-2xl shadow-[#a78bfa]/15">
                    <span className="text-6xl leading-none">{selected.badge}</span>
                    <span className="mt-2 text-[9px] font-black tracking-[0.2em] text-[#d9d1ff] uppercase">{tx('Unlocked', 'अनलॉक', language)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-[#a78bfa] text-xs uppercase tracking-widest font-bold">{language === 'hi' ? translateHindi(selected.hi) : selected.title}</span>
                    <span className="rounded-full border border-[#1a9e8a]/30 bg-[#1a9e8a]/10 px-3 py-1 text-[10px] font-bold tracking-widest text-[#54d5bf] uppercase">{tx('Reward unlocked', 'रिवॉर्ड अनलॉक', language)}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#f0ede6] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {language === 'hi' ? translateHindi(selected.rewardHi) : selected.reward}
                  </h3>
                  <p className="text-[#c8d8e8] text-sm md:text-base leading-relaxed mb-5">
                    {language === 'hi' ? translateHindi(selected.revealHi) : selected.reveal}
                  </p>
                  <div className="rounded-2xl border border-[#a78bfa]/20 bg-[#0b1830]/70 p-4">
                    <p className="text-[#8fa3bc] text-xs uppercase tracking-[0.18em] font-bold mb-1">{tx('Your unlocked moment', 'आपका अनलॉक पल', language)}</p>
                    <p className="text-[#f0ede6] text-sm">{tx('Keep this reward as a reminder of progress — not a test you can fail.', 'इस रिवॉर्ड को प्रगति की याद की तरह रखें — ऐसी परीक्षा की तरह नहीं जिसमें आप असफल हों।', language)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-3xl mb-8">
            <p className="text-[#1a9e8a] text-xs uppercase tracking-[0.2em] font-bold mb-2">{tx('Check in', 'आज का चेक-इन', language)}</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#f0ede6]" style={{ fontFamily: 'var(--font-display)' }}>{tx('How are you doing today?', 'आज आप कैसा महसूस कर रहे हैं?', language)}</h2>
            <p className="text-[#8fa3bc] mt-3 text-sm leading-relaxed">{tx('Pick one. There is no score, no streak to protect, and no “wrong” answer.', 'एक चुनें। कोई score नहीं है, कोई streak बचाने की जरूरत नहीं, और कोई “गलत” जवाब नहीं है।', language)}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {CHECKINS.map(item => {
              const active = checkIn === item.id
              return (
                <button key={item.id} type="button" onClick={() => chooseCheckIn(item.id)} className={`bf-card text-left rounded-2xl p-6 border ${active ? 'border-[#1a9e8a]/50 bg-[#1a9e8a]/10' : 'border-[#1e3050] bg-[#111f3a]/70'}`}>
                  <div className="text-2xl text-[#1a9e8a] mb-4">{item.icon}</div>
                  <h3 className="text-[#f0ede6] font-bold mb-2">{language === 'hi' ? translateHindi(item.hi) : item.title}</h3>
                  <p className="text-[#8fa3bc] text-sm leading-relaxed">{language === 'hi' ? translateHindi(item.bodyHi) : item.body}</p>
                  <div className="mt-4 text-xs font-bold text-[#1a9e8a]">{active ? tx('Saved for today ✓', 'आज के लिए सेव ✓', language) : tx('Choose this →', 'इसे चुनें →', language)}</div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#0d1e36]">
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
