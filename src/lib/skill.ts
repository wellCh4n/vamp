import 'server-only'

import fs from 'node:fs'
import path from 'node:path'

/**
 * Strudel skill（skills/strudel/）的服务端读取：
 * - SKILL.md 正文进系统提示（去掉 frontmatter）
 * - 其余 markdown 由 Agent 通过 read_doc / search_docs 工具按需读取
 *
 * 目录内容由 scripts/build-strudel-skill.mjs 生成，启动后整目录读进内存（约 1MB）。
 */

const SKILL_DIR = path.join(process.cwd(), 'skills', 'strudel')
/** read_doc 单次最多返回的字符数，超出时只返回大纲 */
export const MAX_DOC_CHARS = 24_000
const MAX_SEARCH_RESULTS = 20

interface SkillFile {
  path: string
  content: string
  lines: string[]
}

let cache: Map<string, SkillFile> | undefined

function loadAll(): Map<string, SkillFile> {
  if (cache) return cache
  const files = new Map<string, SkillFile>()
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith('.md')) {
        const rel = path.relative(SKILL_DIR, full).split(path.sep).join('/')
        const content = fs.readFileSync(full, 'utf8')
        files.set(rel, { path: rel, content, lines: content.split('\n') })
      }
    }
  }
  walk(SKILL_DIR)
  cache = files
  return files
}

/** SKILL.md 正文（不含 frontmatter），拼进系统提示 */
export function getSkillPrompt(): string {
  const skill = loadAll().get('SKILL.md')
  if (!skill) throw new Error('skills/strudel/SKILL.md 不存在，请先运行 npm run skill:build')
  return skill.content.replace(/^---\n[\s\S]*?\n---\n/, '').trim()
}

export function listDocs(): string[] {
  return [...loadAll().keys()].filter((p) => p !== 'SKILL.md').sort()
}

function normalizePath(p: string) {
  return p
    .trim()
    .replace(/^\.?\//, '')
    .replace(/^skills\/strudel\//, '')
    .replace(/\\/g, '/')
}

/** 宽松匹配用的键：小写、去 .md、驼峰转连字符（模型常把 funky-drummer 写成 FunkyDrummer） */
function looseKey(p: string) {
  return p
    .replace(/\.md$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}

let looseIndex: Map<string, string> | undefined

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
  /** 内容被截断时给出大纲，提示用 heading 再读 */
  truncated?: boolean
}

/** 读一个文件，或文件里的一个标题段落（从该标题到下一个同级或更高级标题） */
export function readDoc(rawPath: string, heading?: string): ReadResult {
  const rel = normalizePath(rawPath)
  const file = resolveFile(rel)
  if (!file || file.path === 'SKILL.md') {
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
 * 全文搜索：所有词都出现在同一行（不区分大小写）才算命中；标题行和函数索引优先。
 * 返回命中行及其所在的最近标题，方便随后用 read_doc(path, heading) 读整段。
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
    if (file.path === 'SKILL.md') continue
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
