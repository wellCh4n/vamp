'use client'

import { useEffect } from 'react'

import { useSystemDark } from '@/lib/theme'

/**
 * Mirror the system color scheme onto <html class="dark">. The first paint is set by the inline
 * script in layout.tsx before hydration; this component keeps up with later system light/dark switches.
 */
export function ThemeSync() {
  const dark = useSystemDark()
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  return null
}
