'use client'

import dynamic from 'next/dynamic'
import { Loader2Icon } from 'lucide-react'

import type { StudioProps } from '@/components/studio'

// Strudel and CodeMirror touch window at import time, so they can only load in the browser
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
  // Remount entirely when the session or project changes, so old state cannot leak into the new session
  return <Studio key={`${props.project.id}:${props.session.id}`} {...props} />
}
