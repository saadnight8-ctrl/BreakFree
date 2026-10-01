export default function BrandLogo({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  return (
    <img
      src="/breakfree-logo.png"
      alt="BreakFree"
      className={`${compact ? 'h-8 w-auto' : 'h-12 w-auto'} object-contain bf-logo-interactive ${className}`}
    />
  )
}
