import type { AgentMessage } from '@earendil-works/pi-agent-core'

/** 浏览器端调用后端 API 的薄封装（服务端类型见 src/db/schema.ts，这里用序列化后的形状） */

export interface ProjectDto {
  id: string
  name: string
  code: string
  createdAt: string
  updatedAt: string
}

export interface ProjectSummaryDto extends ProjectDto {
  sessionCount: number
}

export interface SessionDto {
  id: string
  projectId: string
  title: string
  createdAt: string
  updatedAt: string
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
  const data = (await res.json().catch(() => null)) as (T & { error?: string }) | null
  if (!res.ok) throw new Error(data?.error ?? `请求失败（${res.status}）`)
  return data as T
}

export const api = {
  listProjects: () => request<{ projects: ProjectSummaryDto[] }>('/api/projects'),
  createProject: (name: string, code = '') =>
    request<{ project: ProjectDto }>('/api/projects', { method: 'POST', body: JSON.stringify({ name, code }) }),
  getProject: (id: string) => request<{ project: ProjectDto; sessions: SessionDto[] }>(`/api/projects/${id}`),
  renameProject: (id: string, name: string) =>
    request<{ project: ProjectDto }>(`/api/projects/${id}`, { method: 'PATCH', body: JSON.stringify({ name }) }),
  saveProjectCode: (id: string, code: string, summary: string, sessionId: string | null) =>
    request<{ project: ProjectDto }>(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ code, summary, sessionId }),
    }),
  deleteProject: (id: string) => request<{ ok: true }>(`/api/projects/${id}`, { method: 'DELETE' }),

  createSession: (projectId: string, title?: string) =>
    request<{ session: SessionDto }>(`/api/projects/${projectId}/sessions`, { method: 'POST', body: JSON.stringify({ title }) }),
  getSession: (id: string) => request<{ session: SessionDto; messages: AgentMessage[] }>(`/api/sessions/${id}`),
  renameSession: (id: string, title: string) =>
    request<{ session: SessionDto }>(`/api/sessions/${id}`, { method: 'PATCH', body: JSON.stringify({ title }) }),
  deleteSession: (id: string) => request<{ ok: true }>(`/api/sessions/${id}`, { method: 'DELETE' }),
  appendMessages: (sessionId: string, messages: AgentMessage[]) =>
    request<{ count: number }>(`/api/sessions/${sessionId}/messages`, { method: 'POST', body: JSON.stringify({ messages }) }),
}
