'use client'

import { useEffect, useRef } from 'react'

import { subscribeTransport } from '@/lib/strudel'

/**
 * 播放中的速度显示。pattern 是无限循环的，没有总长度，所以不画进度条，
 * 只显示 BPM（按 1 cycle = 4 拍换算，对应 setcpm(bpm/4) 的写法；代码里改了速度会跟着变）。
 * 每帧回调里直接改 DOM 而不走 React state，避免整个工作台重渲染。
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
