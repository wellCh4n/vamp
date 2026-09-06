'use client'

import dynamic from 'next/dynamic'
import { Loader2Icon } from 'lucide-react'

import type { StudioProps } from '@/components/studio'

// Strudel 和 CodeMirror 在 import 时就会访问 window，只能在浏览器加载
const Studio = dynamic(() => import('@/components/studio').then((m) => m.Studio), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
      <Loader2Icon className="size-4 animate-spin" />
      正在加载音频引擎…
    </div>
  ),
})

export function StudioLoader(props: StudioProps) {
  // 换会话 / 换工程时整体重挂，避免旧状态串到新会话
  return <Studio key={`${props.project.id}:${props.session.id}`} {...props} />
}
