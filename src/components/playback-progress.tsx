'use client'

import { useEffect, useRef } from 'react'

import { subscribeTransport } from '@/lib/strudel'

/**
 * Tempo readout during playback. A pattern loops forever and has no total length, so there is no
 * progress bar, only a BPM readout (converted as 1 cycle = 4 beats, matching setcpm(bpm/4); it
 * follows tempo changes made in the code).
 * The per-frame callback writes to the DOM directly instead of React state, so the whole studio
 * does not re-render.
 */
export function PlaybackBpm() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let last = ''
    return subscribeTransport(({ cps }) => {
      const text = `${Math.round(cps * 240)} bpm`
      if (text !== last && ref.current) {
        last = text
        ref.current.textContent = text
      }
    })
  }, [])

  return (
    <span ref={ref} className="shrink-0 text-xs text-muted-foreground tabular-nums" aria-live="off">
      … bpm
    </span>
  )
}
