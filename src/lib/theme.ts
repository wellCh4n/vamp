'use client'

import { useSyncExternalStore } from 'react'

/** Theme follows the system: subscribe to prefers-color-scheme; there is no manual toggle or local storage */

const QUERY = '(prefers-color-scheme: dark)'

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

function getServerSnapshot() {
  return false
}

/** Whether the system is currently dark (false during server rendering, corrected right after hydration) */
export function useSystemDark() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
