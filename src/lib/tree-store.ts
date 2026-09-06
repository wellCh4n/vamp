'use client'

import { useEffect, useSyncExternalStore } from 'react'

import type { ProjectDto, SessionDto } from '@/lib/api'

/**
 * 侧边栏工程树的全局 store。
 * 任何地方改了工程 / 会话后调用 refreshTree()，所有订阅者（侧边栏）会重新拉取。
 */

export interface ProjectNode extends ProjectDto {
  sessions: SessionDto[]
}

export interface TreeState {
  projects: ProjectNode[] | null
  error: string | null
}

const INITIAL: TreeState = { projects: null, error: null }
let snapshot: TreeState = INITIAL
const listeners = new Set<() => void>()
let inflight: Promise<void> | null = null

function set(next: TreeState) {
  snapshot = next
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function refreshTree(): Promise<void> {
  if (inflight) return inflight
  inflight = (async () => {
    try {
      const data = await fetch('/api/tree').then((r) => r.json() as Promise<{ projects?: ProjectNode[]; error?: string }>)
      if (data.error) throw new Error(data.error)
      set({ projects: data.projects ?? [], error: null })
    } catch (err) {
      set({ ...snapshot, error: err instanceof Error ? err.message : String(err) })
    } finally {
      inflight = null
    }
  })()
  return inflight
}

export function useTree(): TreeState {
  const state = useSyncExternalStore(subscribe, () => snapshot, () => INITIAL)
  useEffect(() => {
    if (snapshot.projects === null) void refreshTree()
  }, [])
  return state
}
