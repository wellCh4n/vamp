#!/usr/bin/env node
/**
 * Turns the docs, function reference (JSDoc), example tunes and drum patterns from the official
 * Strudel repository into the skills/strudel/ directory, for the agent to read progressively
 * (SKILL.md goes into the system prompt; the rest is read on demand through the read_doc /
 * search_docs tools).
 *
 * Usage: npm run skill:build
 *   - sparse-clones the Strudel repository into .cache/strudel by default (STRUDEL_SRC points at an
 *     existing clone instead)
 *   - runs the repository's own jsdoc config to produce doc.json (the function reference)
 *   - writes to skills/strudel/ and refreshes the index between the generated markers in SKILL.md
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'skills', 'strudel')
const SRC = process.env.STRUDEL_SRC || path.join(ROOT, '.cache', 'strudel')
const REPO = 'https://codeberg.org/uzu/strudel.git'
const SPARSE_PATHS = ['website/src/pages', 'website/src/repl', 'packages', 'jsdoc']

// ---------- 1. Prepare the source and doc.json ----------

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

// ---------- Helpers ----------

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

/** In a raw JSDoc comment, everything before the first @tag is the markdown description */
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

// ---------- 2. Function reference ----------

const SKIP_TAGS = new Set(['internals', 'internal'])
/** Only the packages usable in the browser */
const REFERENCE_GROUPS = [
  {
    file: 'reference/controls.md',
    title: 'Sound & effect controls',
    intro: 'Sound and effect parameters. Every control can be called as a function (`lpf(1000)`) or chained as a pattern method (`.lpf("<500 2000>")`), and every argument can be a pattern / mini-notation.',
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
    intro: 'Pattern transformations: time, structure, conditionals, layering, randomness, arithmetic and more. Most are both `Pattern` methods and standalone functions.',
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
    intro: 'Continuous signals (sine, saw, perlin, …) and random functions (rand, choose, degradeBy, sometimes, …). A signal is sampled when an event fires, so pair it with `segment` for continuous movement.',
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
    intro: 'From @strudel/tonal: scales, chords and voicings.',
    match: (d) => ['tonal.mjs', 'voicings.mjs'].includes(d.meta?.filename ?? ''),
    sections: [],
  },
  {
    file: 'reference/samples.md',
    title: 'Sample loading & sound aliases',
    intro: 'Loading samples, aliases, polyphony settings and the like (@strudel/webaudio / superdough).',
    match: (d) => ['sampler.mjs', 'superdough.mjs'].includes(d.meta?.filename ?? ''),
    sections: [],
  },
  {
    file: 'reference/draw.md',
    title: 'Visualization',
    intro: 'Visualization functions such as pianoroll, scope, spectrum, spiral and pitchwheel (this project already shows a pianoroll / scope / spectrum below the editor, so calling them from code is rarely needed).',
    match: (d) => ['pianoroll.mjs', 'spiral.mjs', 'pitchwheel.mjs', 'scope.mjs', 'spectrum.mjs', 'drawLine.mjs'].includes(d.meta?.filename ?? ''),
    sections: [],
  },
]

function isUserFacing(d) {
  if (!d.name || d.kind === 'package' || d.kind === 'class') return false
  if ((d.tags || []).some((t) => SKIP_TAGS.has(t))) return false
  if (d.longname.includes('#')) return false // internal Pattern.prototype methods
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
    const parts = [`# ${group.title}`, '', group.intro, '', `${items.length} entries. Each one lists name, synonyms, description, parameters and examples.`]
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
  // Function index: one per line, so search_docs can hit it
  const lines = ['# Function index', '', 'Each line: `name` (synonyms) - a one-line description, grouped by the file it lives in. For the full description and examples, read that heading of that file with read_doc.', '']
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

// ---------- 3. Tutorials and topic pages (mdx -> md) ----------

const PAGES = [
  // [source directory, output prefix, pages to include (in reading order)]
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

  // <MiniRepl tune={`...`} /> -> a code block
  md = md.replace(/<MiniRepl\b[\s\S]*?tune=\{`((?:[^`\\]|\\.)*)`\}[\s\S]*?\/>/g, (_, code) => `\n\`\`\`js\n${unescapeTemplate(code).trim()}\n\`\`\`\n`)
  md = md.replace(/<MiniRepl\b[\s\S]*?\/>/g, '')

  // <JsDoc name="x" h={0} hideDescription /> -> an inline function description
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

// ---------- 4. Example tunes and drum patterns ----------

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
    `The ${tunes.length} example tunes shipped with the official Strudel REPL (AGPL-3.0, Strudel contributors; some tunes credit their author in a comment).`,
    'One level-two heading per tune, so read_doc with a heading returns just one. A good reference for arrangement structure, sound choices and harmony.',
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
    'Source: drum_patterns.mjs from the official Strudel REPL. The underlying data comes from https://github.com/lvm/tidal-drum-patterns (GPL-3.0), converted with https://github.com/urswilke/read_beats.'
  const indexLines = ['# Drum pattern index', '', attribution, '', 'One file per genre, with a level-two heading per pattern. Every pattern has the shape `stack("...", "...").s().slow(2)`: one line per drum, each `[x ~ ~ ~]` group is one beat (sixteenth notes), four groups make a bar, and `slow(2)` spreads two bars over two cycles.', '', 'Usage: add `.bank("RolandTR909")` after `.s()` to change the kit, or lift a single line out on its own with `$: s("...")`.', '']
  const genres = []
  for (const [genre, list] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const rel = `examples/drums/${kebab(genre)}.md`
    const lines = [`# ${genre} drum patterns`, '', attribution, '', `${list.length} patterns.`, '']
    for (const p of list) lines.push(`## ${p.name}`, '', '```js', p.code, '```', '')
    write(rel, lines.join('\n'))
    indexLines.push(`- [${genre}](${rel}) (${list.length}): ${list.map((p) => p.name).join(', ')}`)
    genres.push({ genre, file: rel, count: list.length })
  }
  write('examples/drums/index.md', indexLines.join('\n'))
  return genres
}

// ---------- 4b. Sound list (the samples / soundfonts this project preloads) ----------

const CDN = 'https://strudel.b-cdn.net'
const SAMPLE_SOURCES = [
  ['tidal-drum-machines.json', `${CDN}/tidal-drum-machines.json`],
  ['tidal-drum-machines-alias.json', `${CDN}/tidal-drum-machines-alias.json`],
  ['uzu-drumkit.json', `${CDN}/uzu-drumkit.json`],
  ['piano.json', `${CDN}/piano.json`],
  ['vcsl.json', `${CDN}/vcsl.json`],
  ['dirt-samples.json', 'https://raw.githubusercontent.com/tidalcycles/dirt-samples/main/strudel.json'],
  ['wavetables.json', 'https://raw.githubusercontent.com/Bubobubobubobubo/Dough-Waveforms/main/strudel.json'],
]
/** Maps shipped with this project (public/samples/<dir>/*.json), read straight off disk; a directory may hold several */
const LOCAL_SAMPLE_MAPS = [
  [
    'chinese-traditional',
    ['strudel.json'],
    'Beijing opera percussion (single-stroke samples, picked with `n`): bangu drum `bangu`, small gong `xiaoluo`, large gong `daluo`, cymbals `naobo`. Sources and licenses are in public/samples/chinese-traditional/README.md.',
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
  return entries.map((e) => (e.pitched ? `${e.name} (pitched)` : e.count > 1 ? `${e.name}(${e.count})` : e.name)).join(', ')
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
    'Every sound name this project preloads at startup (generated by scripts/build-strudel-skill.mjs from the official CDN manifests). `s("name")` only accepts names listed here; `n` or `name:n` picks which sample of that name to use.',
    '',
    '## Synths (no loading needed)',
    '',
    '`sine sawtooth(saw) square triangle(tri) supersaw` - noise `white pink brown crackle` - ZZFX `z_sawtooth z_tan z_noise z_sine z_square`. `note()` without `s()` defaults to `triangle`.',
    '',
    '## Drum machines',
    '',
    'Use `s("bd sd hh").bank("RolandTR909")`, or `s("RolandTR909_bd")` directly. Aliases such as `bank("tr909")` work too. Each bank is followed by the drums it has:',
    '',
  ]
  for (const [bank, keys] of [...banks.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`- **${bank}**${alias[bank] ? ` (alias ${alias[bank]})` : ''}: ${keys.sort().join(' ')}`)
  }
  lines.push('', '## Default drum kit (the bd sd hh … used without a bank, from uzu-drumkit)', '', fmtList(sampleEntries(data['uzu-drumkit.json'])))
  lines.push('', '## Piano', '', fmtList(sampleEntries(data['piano.json'])), '', '`note("c e g").s("piano")` or `.piano()`.')
  lines.push('', '## Dirt-Samples (the classic Tidal sample pack; the number in parentheses is how many samples share the name, picked with `n`)', '', fmtList(sampleEntries(data['dirt-samples.json'])))
  lines.push('', '## VCSL (Versilian instrument samples, mostly percussion and folk instruments)', '', fmtList(sampleEntries(data['vcsl.json'])))
  lines.push(
    '',
    '## Wavetables (AKWF single-cycle waveforms)',
    '',
    'Use `s("wt_flute")`, and `n` to pick one of the waveforms in that family. A wavetable drives the synth engine rather than the sampler, so filter envelopes and velocity coupling shape it as strongly as an oscillator — unlike a soundfont. Prefer these over `gm_*` for any voice that has to be expressive.',
    '',
    fmtList(sampleEntries(data['wavetables.json'])),
  )
  for (const [dir, desc, map] of local) {
    lines.push('', '## Chinese traditional', '', `Shipped with this project (public/samples/${dir}). ${desc}`, '', fmtList(sampleEntries(map)))
  }
  lines.push('', `## GM soundfonts (${gm.length} of them, loaded from the CDN on demand, so the first trigger lags slightly)`, '', 'Use `note("c e g").s("gm_epiano1")`.', '', gm.join(', '))
  write('reference/sounds.md', lines.join('\n'))
  return {
    banks: banks.size,
    dirt: sampleEntries(data['dirt-samples.json']).length,
    vcsl: sampleEntries(data['vcsl.json']).length,
    wavetables: sampleEntries(data['wavetables.json']).length,
    local: local.reduce((n, [, , map]) => n + sampleEntries(map).length, 0),
    gm: gm.length,
  }
}

// ---------- 5. SKILL.md index and attribution ----------

function buildAttribution() {
  write(
    'ATTRIBUTION.md',
    [
      '# Sources & licenses',
      '',
      'This directory is generated by scripts/build-strudel-skill.mjs from the official Strudel repository https://codeberg.org/uzu/strudel. Do not edit it by hand (SKILL.md excepted).',
      '',
      '- workshop/ learn/ recipes/ understand/ functions/: the strudel.cc website docs (website/src/pages), AGPL-3.0, Strudel contributors.',
      '- reference/: JSDoc comments from the packages/ source, AGPL-3.0, Strudel contributors.',
      '- examples/tunes.md: website/src/repl/tunes.mjs, AGPL-3.0, Strudel contributors (some tunes credit their author in a comment).',
      '- examples/drums/: website/src/repl/drum_patterns.mjs, with data from lvm/tidal-drum-patterns (GPL-3.0).',
      '- reference/sounds.md: the sample manifests on strudel.b-cdn.net (tidal-drum-machines, uzu-drumkit, piano, VCSL), the strudel.json of tidalcycles/dirt-samples, the GM list from @strudel/soundfonts, and the maps under this project\'s public/samples/ (sources and licenses in each directory\'s README).',
      '',
      `Generated: ${new Date().toISOString().slice(0, 10)}`,
    ].join('\n'),
  )
}

function updateSkillIndex({ pages, reference, tunes, drums, sounds }) {
  const file = path.join(OUT, 'SKILL.md')
  if (!fs.existsSync(file)) {
    console.warn('[skill] no SKILL.md, skipping the index refresh (write SKILL.md by hand first and add the generated markers)')
    return
  }
  const lines = ['## File index (generated)', '', '### Tutorials and topics (read workshop in order; look up learn by topic)', '']
  for (const p of pages) lines.push(`- \`${p.file}\` — ${p.title}${p.summary ? `: ${p.summary}` : ''}`)
  lines.push('', '### Function reference (reference/; start with reference/index.md, or search a function name with search_docs)', '')
  for (const [f, names] of reference.namesByFile) lines.push(`- \`${f}\` (${names.length} entries): ${names.join(', ')}`)
  lines.push(
    `- \`reference/sounds.md\` — every sound name this project preloads: ${sounds.banks} drum-machine banks with their drums, the default kit, ${sounds.dirt} Dirt-Samples groups, ${sounds.vcsl} VCSL groups, ${sounds.wavetables} AKWF wavetable families, ${sounds.local} traditional Chinese groups and ${sounds.gm} GM soundfonts (check here whenever you are unsure a sound name exists; useful headings are "Drum machines" / "Dirt-Samples" / "Chinese traditional" / "GM soundfonts")`,
  )
  lines.push('', `### Example tunes (examples/tunes.md, ${tunes.length} of them, heading = tune name)`, '')
  lines.push(tunes.map((t) => `${t.name}${t.summary ? ` (${t.summary})` : ''}`).join('; '))
  lines.push('', `### Drum pattern library (examples/drums/<genre>.md, ${drums.reduce((n, g) => n + g.count, 0)} in total, indexed in examples/drums/index.md)`, '')
  lines.push(drums.map((g) => `${path.basename(g.file, '.md')}(${g.count})`).join(', '))
  const generated = lines.join('\n')
  const src = fs.readFileSync(file, 'utf8')
  const start = '<!-- generated:start -->'
  const end = '<!-- generated:end -->'
  const a = src.indexOf(start)
  const b = src.indexOf(end)
  if (a < 0 || b < 0) throw new Error('SKILL.md is missing the generated markers')
  fs.writeFileSync(file, `${src.slice(0, a + start.length)}\n${generated}\n${src.slice(b)}`)
}

// ---------- main ----------

const warnings = []
const warn = (m) => warnings.push(m)
const docs = ensureSource()
const docsByName = new Map(docs.map((d) => [d.longname, d]).concat(docs.map((d) => [d.name, d])))
// Clear the previous output (SKILL.md is kept)
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
