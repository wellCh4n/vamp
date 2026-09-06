'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * 播放是工程级别的：路由离开正在播放的工程（去别的工程或首页）时停止播放。
 * Strudel 模块只能在浏览器加载，所以这里用动态 import（本组件会在服务端渲染）。
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
