#!/usr/bin/env node
/**
 * 把 Strudel 官方仓库里的文档、函数参考（JSDoc）、示例曲和鼓型整理成 skills/strudel/ 目录，
 * 供 Agent 渐进式阅读（SKILL.md 进系统提示，其余文件按需用 read_doc / search_docs 工具读取）。
 *
 * 用法：npm run skill:build
 *   - 默认把 Strudel 仓库稀疏克隆到 .cache/strudel（可用 STRUDEL_SRC 指定已有的克隆）
 *   - 用仓库自带的 jsdoc 配置生成 doc.json（函数参考）
 *   - 输出到 skills/strudel/，并刷新 SKILL.md 里 generated 标记之间的索引
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'skills', 'strudel')
const SRC = process.env.STRUDEL_SRC || path.join(ROOT, '.cache', 'strudel')
const REPO = 'https://codeberg.org/uzu/strudel.git'
const SPARSE_PATHS = ['website/src/pages', 'website/src/repl', 'packages', 'jsdoc']

// ---------- 1. 准备源码和 doc.json ----------

function ensureSource() {
  if (!fs.existsSync(path.join(SRC, 'website', 'src', 'pages'))) {
    console.log(`[skill] cloning ${REPO} -> ${SRC}`)
    fs.mkdirSync(path.dirname(SRC), { recursive: true })
    execSync(`git clone --depth 1 --filter=blob:none --sparse ${REPO} "${SRC}"`, { stdio: 'inherit' })
    execSync(`git -C "${SRC}" sparse-checkout set ${SPARSE_PATHS.join(' ')}`, { stdio: 'inherit' })
  }
  const docJson = path.join(SRC, 'doc.json')
  if (!fs.existsSync(docJson)) {
    console.log('[skill] generating doc.json with jsdoc')
    const jsdocBin = path.join(ROOT, 'node_modules', '.bin', 'jsdoc')
    const template = path.join(ROOT, 'node_modules', 'jsdoc-json')
    execSync(`"${jsdocBin}" packages/ --template "${template}" --destination doc.json -c jsdoc/jsdoc.config.json`, {
      cwd: SRC,
      stdio: 'inherit',
    })
  }
  return JSON.parse(fs.readFileSync(docJson, 'utf8')).docs
}

// ---------- 工具函数 ----------

function stripHtml(html = '') {
  return html
    .replace(/<code>(.*?)<\/code>/gs, '`$1`')
    .replace(/<a [^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gs, '[$2]($1)')
    .replace(/<\/?(strong|b)>/g, '**')
    .replace(/<\/?(em|i)>/g, '*')
    .replace(/<\/p>\s*<p>/g, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim()
}

/** JSDoc 注释原文里 @tag 之前的部分就是 markdown 描述 */
function docDescription(item) {
  const raw = (item.comment || '').replace(/^\/\*\*\s*/, '').replace(/\s*\*\/$/, '')
  const out = []
  for (const line of raw.split('\n').map((l) => l.replace(/^\s*\*\s?/, ''))) {
    if (/^@\w+/.test(line.trim())) break
    out.push(line)
  }
  return out
    .join('\n')
    .trim()
    .replace(/\{@link ([^}|]+)(?:\|[^}]*)?\}/g, '`$1`')
}

function unescapeTemplate(s) {
  return s.replace(/\\`/g, '`').replace(/\\\$/g, '$').replace(/\\\\/g, '\\')
}

function firstSentence(text) {
  const plain = text.replace(/\s+/g, ' ').trim()
  const m = plain.match(/^(.*?[.!?])(\s|$)/)
  return (m ? m[1] : plain).slice(0, 140)
}

function kebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()
}

function write(rel, content) {
  const file = path.join(OUT, rel)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n')
}

// ---------- 2. 函数参考 ----------

const SKIP_TAGS = new Set(['internals', 'internal'])
/** 只收浏览器里能用的包 */
const REFERENCE_GROUPS = [
  {
    file: 'reference/controls.md',
    title: 'Sound & effect controls',
    intro: '声音参数和效果器参数。每个控制既可以当函数调用（`lpf(1000)`），也可以当 pattern 方法链式调用（`.lpf("<500 2000>")`），参数都可以是 pattern / mini-notation。',
    match: (d) => d.meta?.filename === 'controls.mjs',
    sections: [
      ['samples', 'Sound & samples'],
      ['pitch', 'Pitch'],
      ['amplitude', 'Amplitude & dynamics'],
      ['envelope', 'Envelopes'],
      ['filter', 'Filters'],
      ['lfo', 'LFO / modulation'],
      ['fm', 'FM synthesis'],
      ['wavetable', 'Wavetable / synth'],
      ['distortion', 'Distortion'],
      ['orbit', 'Global effects (orbit, delay, reverb)'],
      ['superdirt', 'SuperDirt'],
      ['external_io', 'External IO (MIDI / OSC)'],
    ],
  },
  {
    file: 'reference/pattern.md',
    title: 'Pattern functions',
    intro: 'Pattern 变换函数：时间、结构、条件、叠加、随机、数值运算等。大多数既是 `Pattern` 方法，也可以作为独立函数调用。',
    match: (d) => ['pattern.mjs', 'pick.mjs', 'euclid.mjs', 'util.mjs', 'evaluate.mjs', 'repl.mjs'].includes(d.meta?.filename ?? ''),
    sections: [
      ['temporal', 'Time'],
      ['combiners', 'Combining patterns'],
      ['generators', 'Creating patterns'],
      ['functional', 'Functional'],
      ['stepwise', 'Stepwise'],
      ['math', 'Math'],
      ['tonal', 'Tonal'],
      ['visualization', 'Visualization / debugging'],
    ],
  },
  {
    file: 'reference/signals.md',
    title: 'Signals & randomness',
    intro: '连续信号（sine、saw、perlin…）和随机函数（rand、choose、degradeBy、sometimes…）。信号取值发生在事件触发时，要连续变化需配合 `segment`。',
    match: (d) => d.meta?.filename === 'signal.mjs',
    sections: [
      ['generators', 'Signals'],
      ['temporal', 'Randomness in time'],
      ['combiners', 'Choosing'],
      ['functional', 'Functional'],
      ['math', 'Math'],
    ],
  },
  {
    file: 'reference/tonal.md',
    title: 'Tonal (scales, chords, voicings)',
    intro: '来自 @strudel/tonal：音阶、和弦、voicing。',
    match: (d) => ['tonal.mjs', 'voicings.mjs'].includes(d.meta?.filename ?? ''),
    sections: [],
  },
  {
    file: 'reference/samples.md',
    title: 'Sample loading & sound aliases',
    intro: '加载采样、别名、复音数设置等（@strudel/webaudio / superdough）。',
    match: (d) => ['sampler.mjs', 'superdough.mjs'].includes(d.meta?.filename ?? ''),
    sections: [],
  },
  {
    file: 'reference/draw.md',
    title: 'Visualization',
    intro: 'pianoroll、scope、spectrum、spiral、pitchwheel 等可视化函数（本项目编辑器下方已自带 pianoroll / 波形 / 频谱，一般不需要在代码里调用）。',
    match: (d) => ['pianoroll.mjs', 'spiral.mjs', 'pitchwheel.mjs', 'scope.mjs', 'spectrum.mjs', 'drawLine.mjs'].includes(d.meta?.filename ?? ''),
    sections: [],
  },
]

function isUserFacing(d) {
  if (!d.name || d.kind === 'package' || d.kind === 'class') return false
  if ((d.tags || []).some((t) => SKIP_TAGS.has(t))) return false
  if (d.longname.includes('#')) return false // Pattern.prototype 内部方法
  if (d.access === 'private' || d.undocumented || d.name.startsWith('_')) return false
  return (d.examples?.length ?? 0) > 0 || (d.tags?.length ?? 0) > 0
}

function renderEntry(d) {
  const lines = [`### ${d.name}`]
  if (d.synonyms_text) lines.push(`Synonyms: \`${d.synonyms.join('`, `')}\``)
  const desc = docDescription(d)
  if (desc) lines.push('', desc)
  if (d.params?.length) {
    lines.push('', 'Params:')
    for (const p of d.params) {
      const type = p.type?.names?.join(' | ') ?? ''
      lines.push(`- \`${p.name}\`${type ? ` (${type})` : ''}${p.description ? `: ${stripHtml(p.description)}` : ''}`)
    }
  }
  for (const ex of d.examples ?? []) lines.push('', '```js', ex.trim(), '```')
  return lines.join('\n')
}

function buildReference(docs) {
  const used = new Set()
  const index = [] // { file, name, synonyms, summary }
  const namesByFile = new Map()
  for (const group of REFERENCE_GROUPS) {
    const items = docs.filter((d) => isUserFacing(d) && group.match(d) && !used.has(d.longname))
    items.forEach((d) => used.add(d.longname))
    const bySection = new Map()
    const rest = []
    for (const d of items) {
      const section = group.sections.find(([tag]) => (d.tags || []).includes(tag))
      if (section) {
        if (!bySection.has(section[1])) bySection.set(section[1], [])
        bySection.get(section[1]).push(d)
      } else rest.push(d)
    }
    const parts = [`# ${group.title}`, '', group.intro, '', `共 ${items.length} 项。每项：名称、同义名、说明、参数、示例。`]
    const ordered = [...group.sections.map((s) => s[1]).filter((t) => bySection.has(t)), ...(rest.length ? ['Other'] : [])]
    for (const title of ordered) {
      const list = title === 'Other' ? rest : bySection.get(title)
      parts.push('', `## ${title}`, '')
      for (const d of list) parts.push(renderEntry(d), '')
    }
    write(group.file, parts.join('\n'))
    namesByFile.set(group.file, items.map((d) => d.name))
    for (const d of items) {
      index.push({ file: group.file, name: d.name, synonyms: d.synonyms ?? [], summary: firstSentence(stripHtml(d.description || '')) })
    }
  }
  // 函数索引：一行一个，便于 search_docs 命中
  const lines = ['# Function index', '', '每行：`name` (synonyms) — 一句话说明 → 所在文件。详细说明和示例用 read_doc 读对应文件的该标题。', '']
  let currentFile = ''
  for (const e of index) {
    if (e.file !== currentFile) {
      currentFile = e.file
      lines.push('', `## ${currentFile}`, '')
    }
    lines.push(`- \`${e.name}\`${e.synonyms.length ? ` (${e.synonyms.join(', ')})` : ''} — ${e.summary || '(no description)'}`)
  }
  write('reference/index.md', lines.join('\n'))
  return { namesByFile, count: index.length }
}

// ---------- 3. 教程 / 专题文档（mdx → md）----------

const PAGES = [
  // [源目录, 输出前缀, 包含的页面（顺序即阅读顺序）]
  ['workshop', 'workshop', ['getting-started', 'first-sounds', 'first-notes', 'first-effects', 'pattern-effects', 'recap']],
  [
    'learn',
    'learn',
    [
      'getting-started',
      'code',
      'mini-notation',
      'notes',
      'sounds',
      'samples',
      'synths',
      'effects',
      'lfo',
      'signals',
      'time-modifiers',
      'conditional-modifiers',
      'random-modifiers',
      'accumulation',
      'factories',
      'stepwise',
      'tonal',
      'visual-feedback',
      'metadata',
      'strudel-vs-tidal',
      'faq',
    ],
  ],
  ['recipes', 'recipes', ['recipes', 'rhythms', 'arpeggios', 'microrhythms']],
  ['understand', 'understand', ['cycles', 'pitch', 'voicings']],
  ['functions', 'functions', ['intro', 'value-modifiers']],
]

function rewriteLink(href) {
  const m = href.match(/^\/(workshop|learn|recipes|understand|functions)\/([a-z0-9-]+)\/?(#.*)?$/)
  if (m) return `${m[1]}/${m[2]}.md${m[3] ?? ''}`
  if (href.startsWith('/')) return `https://strudel.cc${href}`
  return href
}

function convertMdx(mdx, docsByName, warn) {
  let md = mdx
  const fm = md.match(/^---\n([\s\S]*?)\n---\n/)
  const title = fm?.[1].match(/^title:\s*(.+)$/m)?.[1]?.trim() ?? ''
  if (fm) md = md.slice(fm[0].length)
  md = md.replace(/^import .*$/gm, '')
  md = md.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')

  // <MiniRepl tune={`...`} /> → 代码块
  md = md.replace(/<MiniRepl\b[\s\S]*?tune=\{`((?:[^`\\]|\\.)*)`\}[\s\S]*?\/>/g, (_, code) => `\n\`\`\`js\n${unescapeTemplate(code).trim()}\n\`\`\`\n`)
  md = md.replace(/<MiniRepl\b[\s\S]*?\/>/g, '')

  // <JsDoc name="x" h={0} hideDescription /> → 内联函数说明
  md = md.replace(/<JsDoc\b([\s\S]*?)\/>/g, (_, attrs) => {
    const name = attrs.match(/name="([^"]+)"/)?.[1]
    const h = attrs.match(/h=\{(\d)\}/)?.[1]
    const hide = /hideDescription/.test(attrs)
    const item = name && (docsByName.get(name) ?? docsByName.get(name.replace(/^Pattern\./, '')))
    if (!item) {
      warn(`JsDoc not found: ${name}`)
      return ''
    }
    const lines = []
    if (h !== '0') lines.push(`${'#'.repeat(Number(h ?? 3))} ${item.name}`)
    if (!hide) {
      if (item.synonyms_text) lines.push(`Synonyms: \`${item.synonyms.join('`, `')}\``)
      const desc = docDescription(item)
      if (desc) lines.push('', desc)
      if (item.params?.length) {
        lines.push('')
        for (const p of item.params) lines.push(`- \`${p.name}\`: ${stripHtml(p.description || '')}`)
      }
    }
    for (const ex of item.examples ?? []) lines.push('', '```js', ex.trim(), '```')
    return `\n${lines.join('\n')}\n`
  })

  md = md.replace(/<QA\b[^>]*q="([^"]*)"[^>]*>/g, '\n**$1**\n')
  md = md.replace(/<img\b[^>]*\/?>/g, '')
  md = md.replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, text) => `[${text.trim()}](${rewriteLink(href)})`)
  md = md.replace(/<\/?(Box|QA|Examples|Colors|PitchSlider|Gamepad|DeviceMotion|div|span|details|summary|kbd)\b[^>]*\/?>/g, '')
  md = md.replace(/<br\s*\/?>/g, '\n')
  md = md.replace(/\{["'] ["']\}/g, ' ')
  md = md.replace(/\]\(([^)\s]+)\)/g, (_, href) => `](${rewriteLink(href)})`)
  md = md.replace(/&nbsp;/g, ' ')
  md = md.trim()
  if (title && !/^#\s/.test(md)) md = `# ${title}\n\n${md}`
  return { md, title }
}

function buildPages(docsByName, warn) {
  const index = [] // { file, title, summary }
  for (const [dir, prefix, names] of PAGES) {
    for (const name of names) {
      const file = path.join(SRC, 'website', 'src', 'pages', dir, `${name}.mdx`)
      if (!fs.existsSync(file)) {
        warn(`page missing: ${dir}/${name}.mdx`)
        continue
      }
      const { md, title } = convertMdx(fs.readFileSync(file, 'utf8'), docsByName, warn)
      const rel = `${prefix}/${name}.md`
      write(rel, `${md}\n\n---\nSource: https://strudel.cc/${dir}/${name}/ (AGPL-3.0, Strudel contributors)`)
      const body = md.replace(/^#.*$/m, '').replace(/```[\s\S]*?```/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/[#*_>`]/g, '').trim()
      index.push({ file: rel, title: title || name, summary: firstSentence(body) })
    }
  }
  return index
}

// ---------- 4. 示例曲和鼓型 ----------

function parseExports(source) {
  const out = []
  const re = /export const (\w+) = `((?:[^`\\]|\\.)*)`/g
  let m
  while ((m = re.exec(source))) out.push({ name: m[1], code: unescapeTemplate(m[2]).trim() })
  return out
}

function buildTunes() {
  const tunes = parseExports(fs.readFileSync(path.join(SRC, 'website', 'src', 'repl', 'tunes.mjs'), 'utf8'))
  const lines = [
    '# Example tunes',
    '',
    `Strudel 官方 REPL 自带的 ${tunes.length} 首示例曲（AGPL-3.0，Strudel contributors，部分曲子注释里有作者署名）。`,
    '每首一个二级标题，可用 read_doc 带 heading 只读一首。适合作为编曲结构、音色搭配、和声写法的参考。',
    '',
  ]
  const index = []
  for (const t of tunes) {
    const comment = t.code.split('\n').find((l) => l.startsWith('//'))?.replace(/^\/\/\s*/, '') ?? ''
    lines.push(`## ${t.name}`, '', comment ? `${comment}\n` : '', '```js', t.code, '```', '')
    index.push({ name: t.name, summary: comment })
  }
  write('examples/tunes.md', lines.join('\n'))
  return index
}

function drumGenre(name) {
  return name.replace(/Alt$/, '').replace(/\d+[a-z]?$/, '')
}

function buildDrums() {
  const patterns = parseExports(fs.readFileSync(path.join(SRC, 'website', 'src', 'repl', 'drum_patterns.mjs'), 'utf8'))
  const groups = new Map()
  for (const p of patterns) {
    const genre = drumGenre(p.name)
    if (!groups.has(genre)) groups.set(genre, [])
    groups.get(genre).push({ name: p.name, code: p.code.replace(/^\/\/.*\n/gm, '').trim() })
  }
  const attribution =
    '来源：Strudel 官方 REPL 的 drum_patterns.mjs，原始数据来自 https://github.com/lvm/tidal-drum-patterns （GPL-3.0），用 https://github.com/urswilke/read_beats 转换。'
  const indexLines = ['# Drum pattern index', '', attribution, '', '按曲风分文件，每个文件里每个鼓型一个二级标题。鼓型都是 `stack("...", "...").s().slow(2)` 的形式：每行一个鼓件，`[x ~ ~ ~]` 一组是一拍（16 分音符），4 组一小节，`slow(2)` 把两小节摊到两个 cycle。', '', '用法：把 `.s()` 里加上 `.bank("RolandTR909")` 换音色；把某一行拿出来单独用 `$: s("...")`。', '']
  const genres = []
  for (const [genre, list] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const rel = `examples/drums/${kebab(genre)}.md`
    const lines = [`# ${genre} drum patterns`, '', attribution, '', `${list.length} 个鼓型。`, '']
    for (const p of list) lines.push(`## ${p.name}`, '', '```js', p.code, '```', '')
    write(rel, lines.join('\n'))
    indexLines.push(`- [${genre}](${rel}) (${list.length}): ${list.map((p) => p.name).join(', ')}`)
    genres.push({ genre, file: rel, count: list.length })
  }
  write('examples/drums/index.md', indexLines.join('\n'))
  return genres
}

// ---------- 4b. 音色清单（本项目预加载的采样 / soundfont）----------

const CDN = 'https://strudel.b-cdn.net'
const SAMPLE_SOURCES = [
  ['tidal-drum-machines.json', `${CDN}/tidal-drum-machines.json`],
  ['tidal-drum-machines-alias.json', `${CDN}/tidal-drum-machines-alias.json`],
  ['uzu-drumkit.json', `${CDN}/uzu-drumkit.json`],
  ['piano.json', `${CDN}/piano.json`],
  ['vcsl.json', `${CDN}/vcsl.json`],
  ['dirt-samples.json', 'https://raw.githubusercontent.com/tidalcycles/dirt-samples/main/strudel.json'],
]
/** 本项目自带的映射（public/samples/<dir>/*.json），直接读本地文件；一个目录可有多份映射 */
const LOCAL_SAMPLE_MAPS = [
  [
    'chinese-traditional',
    ['strudel.json'],
    '京剧锣鼓（单击采样，`n` 选第几个）：板鼓 `bangu`、小锣 `xiaoluo`、大锣 `daluo`、铙钹 `naobo`。来源与授权见 public/samples/chinese-traditional/README.md。',
  ],
]

async function fetchJson(name, url) {
  const cacheFile = path.join(path.dirname(SRC), 'strudel-samples', name)
  if (fs.existsSync(cacheFile)) return JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
  console.log(`[skill] fetching ${url}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: ${res.status}`)
  const text = await res.text()
  fs.mkdirSync(path.dirname(cacheFile), { recursive: true })
  fs.writeFileSync(cacheFile, text)
  return JSON.parse(text)
}

function sampleEntries(map) {
  return Object.entries(map)
    .filter(([k]) => !k.startsWith('_'))
    .map(([name, v]) => ({ name, count: Array.isArray(v) ? v.length : typeof v === 'object' ? Object.keys(v).length : 1, pitched: !Array.isArray(v) && typeof v === 'object' }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function fmtList(entries) {
  return entries.map((e) => (e.pitched ? `${e.name}（按音高）` : e.count > 1 ? `${e.name}(${e.count})` : e.name)).join(', ')
}

async function buildSounds() {
  const data = {}
  for (const [name, url] of SAMPLE_SOURCES) data[name] = await fetchJson(name, url)
  const local = LOCAL_SAMPLE_MAPS.map(([dir, files, desc]) => [
    dir,
    desc,
    Object.assign({}, ...files.map((f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'samples', dir, f), 'utf8')))),
  ])
  const gmSource = fs.readFileSync(path.join(ROOT, 'node_modules', '@strudel', 'soundfonts', 'gm.mjs'), 'utf8')
  const gm = [...gmSource.matchAll(/^\s{2}(gm_\w+):/gm)].map((m) => m[1])

  const machines = data['tidal-drum-machines.json']
  const alias = data['tidal-drum-machines-alias.json']
  const banks = new Map()
  for (const key of Object.keys(machines)) {
    if (key.startsWith('_')) continue
    const [bank, ...rest] = key.split('_')
    if (!banks.has(bank)) banks.set(bank, [])
    banks.get(bank).push(rest.join('_'))
  }
  const lines = [
    '# Available sounds',
    '',
    '本项目启动时预加载的全部音色名（由 scripts/build-strudel-skill.mjs 从官方 CDN 清单生成）。`s("name")` 只能用这里出现的名字；`n` 或 `name:n` 选同名采样里的第几个。',
    '',
    '## Synths（无需加载）',
    '',
    '`sine sawtooth(saw) square triangle(tri) supersaw` · 噪声 `white pink brown crackle` · ZZFX `z_sawtooth z_tan z_noise z_sine z_square`。只写 `note()` 不写 `s()` 默认 `triangle`。',
    '',
    '## Drum machines',
    '',
    '用 `s("bd sd hh").bank("RolandTR909")`，或直接 `s("RolandTR909_bd")`。别名（如 `bank("tr909")`）也可用。每个 bank 后面列出它有的鼓件：',
    '',
  ]
  for (const [bank, keys] of [...banks.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`- **${bank}**${alias[bank] ? `（别名 ${alias[bank]}）` : ''}: ${keys.sort().join(' ')}`)
  }
  lines.push('', '## Default drum kit（不带 bank 时的 bd sd hh …，来自 uzu-drumkit）', '', fmtList(sampleEntries(data['uzu-drumkit.json'])))
  lines.push('', '## Piano', '', fmtList(sampleEntries(data['piano.json'])), '', '`note("c e g").s("piano")` 或 `.piano()`。')
  lines.push('', '## Dirt-Samples（Tidal 经典采样包，括号里是同名采样个数，用 `n` 选择）', '', fmtList(sampleEntries(data['dirt-samples.json'])))
  lines.push('', '## VCSL（Versilian 乐器采样，多为打击乐 / 民族乐器）', '', fmtList(sampleEntries(data['vcsl.json'])))
  for (const [dir, desc, map] of local) {
    lines.push('', '## Chinese traditional', '', `本项目自带（public/samples/${dir}）。${desc}`, '', fmtList(sampleEntries(map)))
  }
  lines.push('', `## GM soundfonts（${gm.length} 个，按需从 CDN 加载，第一次触发会稍有延迟）`, '', '用 `note("c e g").s("gm_epiano1")`。', '', gm.join(', '))
  write('reference/sounds.md', lines.join('\n'))
  return {
    banks: banks.size,
    dirt: sampleEntries(data['dirt-samples.json']).length,
    vcsl: sampleEntries(data['vcsl.json']).length,
    local: local.reduce((n, [, , map]) => n + sampleEntries(map).length, 0),
    gm: gm.length,
  }
}

// ---------- 5. SKILL.md 索引 & 附注 ----------

function buildAttribution() {
  write(
    'ATTRIBUTION.md',
    [
      '# Sources & licenses',
      '',
      '本目录由 scripts/build-strudel-skill.mjs 从 Strudel 官方仓库 https://codeberg.org/uzu/strudel 生成，请勿手改（SKILL.md 除外）。',
      '',
      '- workshop/ learn/ recipes/ understand/ functions/：strudel.cc 网站文档（website/src/pages），AGPL-3.0，Strudel contributors。',
      '- reference/：packages/ 源码里的 JSDoc 注释，AGPL-3.0，Strudel contributors。',
      '- examples/tunes.md：website/src/repl/tunes.mjs，AGPL-3.0，Strudel contributors（部分曲子注释里有作者署名）。',
      '- examples/drums/：website/src/repl/drum_patterns.mjs，数据来自 lvm/tidal-drum-patterns（GPL-3.0）。',
      '- reference/sounds.md：strudel.b-cdn.net 上的采样清单（tidal-drum-machines、uzu-drumkit、piano、VCSL）、tidalcycles/dirt-samples 的 strudel.json、@strudel/soundfonts 的 GM 列表、本项目 public/samples/ 下的映射（来源与授权见各目录 README）。',
      '',
      `生成时间：${new Date().toISOString().slice(0, 10)}`,
    ].join('\n'),
  )
}

function updateSkillIndex({ pages, reference, tunes, drums, sounds }) {
  const file = path.join(OUT, 'SKILL.md')
  if (!fs.existsSync(file)) {
    console.warn('[skill] SKILL.md 不存在，跳过索引刷新（先手写 SKILL.md 并放入 generated 标记）')
    return
  }
  const lines = ['## 文件索引（自动生成）', '', '### 教程与专题（workshop 按顺序读；learn 按主题查）', '']
  for (const p of pages) lines.push(`- \`${p.file}\` — ${p.title}${p.summary ? `：${p.summary}` : ''}`)
  lines.push('', '### 函数参考（reference/，先读 reference/index.md 或用 search_docs 搜函数名）', '')
  for (const [f, names] of reference.namesByFile) lines.push(`- \`${f}\`（${names.length} 项）：${names.join(', ')}`)
  lines.push(
    `- \`reference/sounds.md\` — 本项目预加载的全部音色名：${sounds.banks} 个鼓机 bank 及各自的鼓件、默认鼓组、Dirt-Samples ${sounds.dirt} 组、VCSL ${sounds.vcsl} 组、中国传统乐器 ${sounds.local} 组、GM soundfont ${sounds.gm} 个（不确定某个音色名是否存在时查这里，heading 可用 "Drum machines" / "Dirt-Samples" / "Chinese traditional" / "GM soundfonts" 等）`,
  )
  lines.push('', `### 示例曲（examples/tunes.md，${tunes.length} 首，heading = 曲名）`, '')
  lines.push(tunes.map((t) => `${t.name}${t.summary ? `（${t.summary}）` : ''}`).join('；'))
  lines.push('', `### 鼓型库（examples/drums/<genre>.md，共 ${drums.reduce((n, g) => n + g.count, 0)} 个，索引见 examples/drums/index.md）`, '')
  lines.push(drums.map((g) => `${path.basename(g.file, '.md')}(${g.count})`).join(', '))
  const generated = lines.join('\n')
  const src = fs.readFileSync(file, 'utf8')
  const start = '<!-- generated:start -->'
  const end = '<!-- generated:end -->'
  const a = src.indexOf(start)
  const b = src.indexOf(end)
  if (a < 0 || b < 0) throw new Error('SKILL.md 缺少 generated 标记')
  fs.writeFileSync(file, `${src.slice(0, a + start.length)}\n${generated}\n${src.slice(b)}`)
}

// ---------- main ----------

const warnings = []
const warn = (m) => warnings.push(m)
const docs = ensureSource()
const docsByName = new Map(docs.map((d) => [d.longname, d]).concat(docs.map((d) => [d.name, d])))
// 清理旧的生成物（SKILL.md 保留）
for (const sub of ['workshop', 'learn', 'recipes', 'understand', 'functions', 'reference', 'examples']) {
  fs.rmSync(path.join(OUT, sub), { recursive: true, force: true })
}
const reference = buildReference(docs)
const pages = buildPages(docsByName, warn)
const tunes = buildTunes()
const drums = buildDrums()
const sounds = await buildSounds()
buildAttribution()
updateSkillIndex({ pages, reference, tunes, drums, sounds })
console.log(`[skill] pages ${pages.length}, functions ${reference.count}, tunes ${tunes.length}, drum genres ${drums.length}, gm sounds ${sounds.gm}`)
for (const w of [...new Set(warnings)]) console.warn('[skill] warn:', w)
