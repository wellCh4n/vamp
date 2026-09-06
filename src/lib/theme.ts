'use client'

import { useSyncExternalStore } from 'react'

/** 主题跟随系统：订阅 prefers-color-scheme，不再提供手动切换和本地存储 */

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

/** 当前系统是否为深色（服务端渲染时为 false，客户端 hydration 后立即纠正） */
export function useSystemDark() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
