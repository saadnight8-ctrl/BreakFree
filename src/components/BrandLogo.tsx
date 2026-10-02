import breakfreeLogo from '../assets/breakfree-logo.png'

export default function BrandLogo({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  return (
    <img
      src={breakfreeLogo}
      alt="BreakFree"
      className={`${compact ? 'h-8 w-auto' : 'h-12 w-auto'} object-contain bf-logo-interactive ${className}`}
      draggable={false}
    />
  )
}
