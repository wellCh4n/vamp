import { cn } from '@/lib/utils'

/** App icon, the same artwork as public/favicon.svg (dark rounded square + four purple bars) */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('size-6 shrink-0', className)}>
      <rect width="32" height="32" rx="7" fill="#111" />
      <g fill="#c084fc">
        <rect x="6" y="14" width="3" height="10" rx="1.5" />
        <rect x="11" y="8" width="3" height="16" rx="1.5" />
        <rect x="16" y="11" width="3" height="13" rx="1.5" />
        <rect x="21" y="5" width="3" height="19" rx="1.5" />
      </g>
    </svg>
  )
}
