'use client'

import { useEffect } from 'react'

import { useSystemDark } from '@/lib/theme'

/**
 * 把系统配色同步到 <html class="dark">。首屏由 layout.tsx 的内联脚本在 hydration 前设置，
 * 这里负责之后系统切换深浅色时实时跟随。
 */
export function ThemeSync() {
  const dark = useSystemDark()
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  return null
}
