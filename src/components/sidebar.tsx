'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronRightIcon, Loader2Icon, MessageSquareIcon, MusicIcon, PanelLeftIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react'

import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { api, type SessionDto } from '@/lib/api'
import { type ProjectNode, refreshTree, useTree } from '@/lib/tree-store'
import { cn } from '@/lib/utils'

/** Parse the current project / session out of the path: /p/<id> or /p/<id>/s/<sid> */
function parsePath(pathname: string) {
  const m = pathname.match(/^\/p\/([^/]+)(?:\/s\/([^/]+))?/)
  return { projectId: m?.[1] ?? null, sessionId: m?.[2] ?? null }
}

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { projectId: activeProject, sessionId: activeSession } = parsePath(pathname)
  const { projects, error: loadError } = useTree()

  const [error, setError] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [busy, setBusy] = useState(false)

  const run = useCallback(async (fn: () => Promise<void>) => {
    setBusy(true)
    setError(null)
    try {
      await fn()
      await refreshTree()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }, [])

  const [createError, setCreateError] = useState<string | null>(null)

  const openCreate = () => {
    setNewName('')
    setCreateError(null)
    setCreating(true)
  }

  const createProject = async () => {
    const name = newName.trim()
    if (!name || busy) return
    setBusy(true)
    setCreateError(null)
    try {
      const { project } = await api.createProject(name)
      const { session } = await api.createSession(project.id)
      setCreating(false)
      await refreshTree()
      router.push(`/p/${project.id}/s/${session.id}`)
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const newSession = (projectId: string) =>
    void run(async () => {
      const { session } = await api.createSession(projectId)
      setExpanded((prev) => ({ ...prev, [projectId]: true }))
      router.push(`/p/${projectId}/s/${session.id}`)
    })

  const renameProject = (p: ProjectNode) => {
    const name = window.prompt('工程名称', p.name)?.trim()
    if (!name || name === p.name) return
    void run(async () => {
      await api.renameProject(p.id, name)
    })
  }

  const deleteProject = (p: ProjectNode) => {
    if (!window.confirm(`删除工程「${p.name}」？会话和历史版本会一起删除。`)) return
    void run(async () => {
      await api.deleteProject(p.id)
      if (activeProject === p.id) router.push('/')
    })
  }

  const deleteSession = (p: ProjectNode, s: SessionDto) => {
    if (!window.confirm(`删除会话「${s.title}」？`)) return
    void run(async () => {
      await api.deleteSession(s.id)
      if (activeSession === s.id) router.push(`/p/${p.id}`)
    })
  }

  if (collapsed) {
    return (
      <aside className="flex w-12 shrink-0 flex-col items-center gap-2 border-r bg-sidebar py-3">
        <Link href="/" aria-label="Vamp 首页">
          <Logo />
        </Link>
        <Button variant="ghost" size="icon-sm" aria-label="展开侧边栏" onClick={() => setCollapsed(false)}>
          <PanelLeftIcon />
        </Button>
      </aside>
    )
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-1 px-3 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <Logo />
          <span className="text-base font-semibold tracking-tight">Vamp</span>
        </Link>
        <Button variant="ghost" size="icon-sm" className="ml-auto" aria-label="收起侧边栏" onClick={() => setCollapsed(true)}>
          <PanelLeftIcon />
        </Button>
      </div>

      <div className="px-3 pb-2">
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          新建工程
        </Button>
      </div>

      <Dialog open={creating} onOpenChange={(open) => !busy && setCreating(open)}>
        <DialogContent>
          <form
            className="contents"
            onSubmit={(e) => {
              e.preventDefault()
              void createProject()
            }}
          >
            <DialogHeader>
              <DialogTitle>新建工程</DialogTitle>
              <DialogDescription>一个工程就是一首曲子，创建后会自动打开第一个会话。</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="new-project-name" className="text-xs font-medium text-muted-foreground">
                工程名称
              </label>
              <Input
                id="new-project-name"
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="例如：夏夜 lo-fi"
                maxLength={80}
                disabled={busy}
              />
              {createError && <p className="text-xs text-destructive">{createError}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" disabled={busy} onClick={() => setCreating(false)}>
                取消
              </Button>
              <Button type="submit" disabled={busy || !newName.trim()}>
                {busy && <Loader2Icon className="animate-spin" data-icon="inline-start" />}
                创建
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {(error ?? loadError) && <p className="px-2 py-1 text-xs text-destructive">{error ?? loadError}</p>}
        {projects === null && !loadError && (
          <p className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
            <Loader2Icon className="size-3 animate-spin" />
            加载中…
          </p>
        )}
        {projects?.length === 0 && <p className="px-2 py-1 text-xs text-muted-foreground">还没有工程，先新建一个。</p>}
        <ul className="flex flex-col gap-0.5">
          {projects?.map((p) => {
            // Projects the user has not toggled: the current one starts expanded, the rest collapsed
            const open = expanded[p.id] ?? p.id === activeProject
            const isActiveProject = activeProject === p.id
            return (
              <li key={p.id}>
                <div
                  className={cn(
                    'group/project flex h-8 items-center gap-1 rounded-md px-1.5 text-sm hover:bg-sidebar-accent',
                    isActiveProject && 'bg-sidebar-accent/70',
                  )}
                >
                  <button
                    type="button"
                    className="flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                    aria-label={open ? '收起' : '展开'}
                    onClick={() => setExpanded((prev) => ({ ...prev, [p.id]: !open }))}
                  >
                    <ChevronRightIcon className={cn('size-3.5 transition-transform', open && 'rotate-90')} />
                  </button>
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-1.5 text-left font-medium"
                    aria-expanded={open}
                    onClick={() => setExpanded((prev) => ({ ...prev, [p.id]: !open }))}
                  >
                    <MusicIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{p.name}</span>
                  </button>
                  <div className="flex shrink-0 items-center opacity-0 group-hover/project:opacity-100 focus-within:opacity-100">
                    <Button variant="ghost" size="icon-xs" aria-label="重命名工程" onClick={() => renameProject(p)} disabled={busy}>
                      <PencilIcon />
                    </Button>
                    <Button variant="ghost" size="icon-xs" aria-label="删除工程" onClick={() => deleteProject(p)} disabled={busy}>
                      <Trash2Icon />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon-xs" className="shrink-0" aria-label="新建会话" title="新建会话" onClick={() => newSession(p.id)} disabled={busy}>
                    <PlusIcon />
                  </Button>
                </div>
                {open && (
                  <ul className="mt-0.5 ml-4 flex flex-col gap-0.5 border-l pl-2">
                    {p.sessions.length === 0 && <li className="flex h-8 items-center px-1.5 text-xs text-muted-foreground">还没有会话</li>}
                    {p.sessions.map((s) => {
                      const isActive = activeSession === s.id
                      return (
                        <li
                          key={s.id}
                          className={cn(
                            // The whole row is one highlight block, delete button included
                            'group/session flex h-8 items-center gap-1 rounded-md pr-1 hover:bg-sidebar-accent',
                            isActive && 'bg-sidebar-accent font-medium',
                          )}
                        >
                          <Link href={`/p/${p.id}/s/${s.id}`} className="flex h-full min-w-0 flex-1 items-center gap-1.5 rounded-md px-1.5 text-sm">
                            <MessageSquareIcon className="size-3.5 shrink-0 text-muted-foreground" />
                            <span className="truncate">{s.title}</span>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="shrink-0 opacity-0 group-hover/session:opacity-100 focus:opacity-100"
                            aria-label="删除会话"
                            onClick={() => deleteSession(p, s)}
                            disabled={busy}
                          >
                            <Trash2Icon />
                          </Button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
