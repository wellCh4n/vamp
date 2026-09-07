import 'server-only'

import fs from 'node:fs'
import path from 'node:path'

/**
 * Server-side loading of the skills under skills/:
 * - Each skill directory has one SKILL.md, whose body (frontmatter stripped) is concatenated into
 *   the system prompt in order: strudel first, the rest sorted by directory name.
 * - Every other markdown file is read on demand by the agent through the read_doc / search_docs tools.
 *   Path rules: strudel is the default skill, so its paths are relative to skills/strudel/ (e.g.
 *   learn/effects.md); other skills are prefixed with their directory name (e.g. music-theory/melody.md).
 *
 * The whole directory (about 1MB) is read into memory at startup; in development it is re-read
 * whenever a file changes.
 */

const SKILLS_DIR = path.join(process.cwd(), 'skills')
/** The default skill: its paths carry no prefix */
const DEFAULT_SKILL = 'strudel'
/** Maximum characters one read_doc call returns; beyond that it returns only an outline */
export const MAX_DOC_CHARS = 24_000
const MAX_SEARCH_RESULTS = 20

interface SkillFile {
  /** The path as the agent sees it: no prefix for the default skill, a `<skill>/` prefix otherwise */
  path: string
  skill: string
  /** Path relative to the skill directory */
  rel: string
  content: string
  lines: string[]
}

let cache: Map<string, SkillFile> | undefined
/** Used in development to detect a stale cache: the newest mtime among the directory's .md files */
let cacheStamp = 0
let looseIndex: Map<string, string> | undefined

function latestMtime(dir: string): number {
  let latest = 0
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) latest = Math.max(latest, latestMtime(full))
    else if (entry.name.endsWith('.md')) latest = Math.max(latest, fs.statSync(full).mtimeMs)
  }
  return latest
}

/** Only a directory with a SKILL.md counts as a skill; the default skill sorts first */
function skillDirs(): string[] {
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(SKILLS_DIR, e.name, 'SKILL.md')))
    .map((e) => e.name)
    .sort((a, b) => (a === DEFAULT_SKILL ? -1 : b === DEFAULT_SKILL ? 1 : a.localeCompare(b)))
}

function publicPath(skill: string, rel: string) {
  return skill === DEFAULT_SKILL ? rel : `${skill}/${rel}`
}

function loadAll(): Map<string, SkillFile> {
  // Read once in production; in development this avoids restarting the dev server after `npm run skill:build` or a manual markdown edit
  if (cache && process.env.NODE_ENV !== 'development') return cache
  if (cache && latestMtime(SKILLS_DIR) === cacheStamp) return cache
  looseIndex = undefined
  cacheStamp = latestMtime(SKILLS_DIR)
  const files = new Map<string, SkillFile>()
  for (const skill of skillDirs()) {
    const root = path.join(SKILLS_DIR, skill)
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(full)
        else if (entry.name.endsWith('.md')) {
          const rel = path.relative(root, full).split(path.sep).join('/')
          const content = fs.readFileSync(full, 'utf8')
          const p = publicPath(skill, rel)
          files.set(p, { path: p, skill, rel, content, lines: content.split('\n') })
        }
      }
    }
    walk(root)
  }
  cache = files
  return files
}

const isSkillIndex = (f: SkillFile) => f.rel === 'SKILL.md'

/** The SKILL.md bodies of every skill (frontmatter excluded), concatenated into the system prompt */
export function getSkillPrompt(): string {
  const files = loadAll()
  const parts = skillDirs()
    .map((skill) => files.get(publicPath(skill, 'SKILL.md')))
    .filter((f): f is SkillFile => !!f)
    .map((f) => f.content.replace(/^---\n[\s\S]*?\n---\n/, '').trim())
  if (!parts.length) throw new Error('skills/*/SKILL.md 不存在，请先运行 npm run skill:build')
  return parts.join('\n\n')
}

export function listDocs(): string[] {
  return [...loadAll().values()]
    .filter((f) => !isSkillIndex(f))
    .map((f) => f.path)
    .sort()
}

function normalizePath(p: string) {
  return p
    .trim()
    .replace(/^\.?\//, '')
    .replace(/^skills\//, '')
    .replace(new RegExp(`^${DEFAULT_SKILL}/`), '')
    .replace(/\\/g, '/')
}

/** Key for loose matching: lowercased, .md stripped, camelCase hyphenated (the model often writes FunkyDrummer for funky-drummer) */
function looseKey(p: string) {
  return p
    .replace(/\.md$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}

function resolveFile(rel: string): SkillFile | undefined {
  const files = loadAll()
  const exact = files.get(rel) ?? files.get(`${rel}.md`)
  if (exact) return exact
  looseIndex ??= new Map([...files.keys()].map((k) => [looseKey(k), k]))
  const hit = looseIndex.get(looseKey(rel))
  return hit ? files.get(hit) : undefined
}

function headingLevel(line: string) {
  const m = line.match(/^(#{1,6})\s+\S/)
  return m ? m[1].length : 0
}

function headingText(line: string) {
  return line.replace(/^#{1,6}\s+/, '').trim()
}

function outline(file: SkillFile): string {
  return file.lines
    .filter((l) => headingLevel(l) > 0)
    .map((l) => l.replace(/^(#{1,6})\s+/, (_, h: string) => `${'  '.repeat(h.length - 1)}- `))
    .join('\n')
}

export interface ReadResult {
  path: string
  heading?: string
  content: string
  /** When the content is truncated, return an outline suggesting a re-read with a heading */
  truncated?: boolean
}

/** Read a whole file, or one heading section of it (from that heading to the next heading at the same or a higher level) */
export function readDoc(rawPath: string, heading?: string): ReadResult {
  const rel = normalizePath(rawPath)
  const file = resolveFile(rel)
  if (!file || isSkillIndex(file)) {
    const suggestions = listDocs()
      .filter((p) => p.includes(path.basename(rel, '.md')))
      .slice(0, 5)
    throw new Error(`文件不存在：${rel}${suggestions.length ? `。你是不是想读：${suggestions.join(', ')}` : '。可用 search_docs 查找。'}`)
  }
  if (!heading) {
    if (file.content.length <= MAX_DOC_CHARS) return { path: file.path, content: file.content }
    return {
      path: file.path,
      content: `${file.lines.slice(0, 40).join('\n')}\n\n…（文件较长，共 ${file.lines.length} 行，以下是大纲，请用 heading 参数读需要的段落）\n\n${outline(file)}`,
      truncated: true,
    }
  }
  const want = heading.trim().toLowerCase().replace(/^#+\s*/, '')
  const start = file.lines.findIndex((l) => headingLevel(l) > 0 && headingText(l).toLowerCase() === want)
  if (start < 0) {
    const near = file.lines.filter((l) => headingLevel(l) > 0 && headingText(l).toLowerCase().includes(want)).map(headingText)
    throw new Error(`${file.path} 里没有标题「${heading}」${near.length ? `。相近的标题：${near.slice(0, 8).join(', ')}` : ''}`)
  }
  const level = headingLevel(file.lines[start])
  let end = file.lines.length
  for (let i = start + 1; i < file.lines.length; i++) {
    const l = headingLevel(file.lines[i])
    if (l > 0 && l <= level) {
      end = i
      break
    }
  }
  const content = file.lines.slice(start, end).join('\n').trim()
  return { path: file.path, heading: headingText(file.lines[start]), content: content.slice(0, MAX_DOC_CHARS) }
}

export interface SearchHit {
  path: string
  heading: string
  line: number
  text: string
}

/**
 * Full-text search: a line matches only when every term appears on it (case-insensitively); heading
 * lines and the function index rank first.
 * Returns the matching line together with its nearest heading, so a follow-up read_doc(path, heading)
 * can pull the whole section.
 */
export function searchDocs(query: string, limit = MAX_SEARCH_RESULTS): SearchHit[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
  if (!terms.length) return []
  const hits: (SearchHit & { score: number })[] = []
  for (const file of loadAll().values()) {
    if (isSkillIndex(file)) continue
    let heading = ''
    file.lines.forEach((line, i) => {
      if (headingLevel(line) > 0) heading = headingText(line)
      const lower = line.toLowerCase()
      if (!terms.every((t) => lower.includes(t))) return
      let score = 0
      if (headingLevel(line) > 0) score += 10
      if (file.path.startsWith('reference/index')) score += 6
      if (file.path.startsWith('reference/')) score += 3
      if (terms.some((t) => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(lower))) score += 2
      hits.push({ path: file.path, heading, line: i + 1, text: line.trim().slice(0, 200), score })
    })
  }
  hits.sort((a, b) => b.score - a.score || a.path.localeCompare(b.path) || a.line - b.line)
  return hits.slice(0, limit).map(({ path, heading, line, text }) => ({ path, heading, line, text }))
}
