'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Playback is per project: stop it when the route leaves the project that is playing (for another
 * project or the home page).
 * Strudel modules can only load in the browser, hence the dynamic import (this component is server-rendered).
 */
export function PlaybackGuard() {
  const pathname = usePathname()
  useEffect(() => {
    let cancelled = false
    void import('@/lib/strudel').then(({ getPlayingOwner, stop }) => {
      if (cancelled) return
      const owner = getPlayingOwner()
      if (!owner) return
      const current = pathname.match(/^\/p\/([^/]+)/)?.[1] ?? null
      if (current !== owner) stop()
    })
    return () => {
      cancelled = true
    }
  }, [pathname])
  return null
}
