# Vamp

Vamp (a short phrase played over and over): live-code looping music together with an AI, in plain language. It is built on [Strudel](https://strudel.cc) (the JavaScript port of Tidal Cycles), with a Claude-driven agent.

Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui (Base UI flavor) + `@strudel/*` + [pi](https://github.com/earendil-works/pi) (`@earendil-works/pi-agent-core` + `pi-ai`).

## Running it

```sh
cp .env.example .env.local   # fill in a model key (see below); DATABASE_URL already points at the Postgres in docker compose
npm install
docker compose up -d         # Postgres 17 on host port 5436
npm run dev                  # http://localhost:3000; database migrations run on first request
```

## Projects and sessions

A **project** is one piece of music (its current code lives on the project). A project can have several **sessions**, each an independent agent conversation. The UI is a ChatGPT-style three-column layout: the sidebar holds the project tree (project -> session, with a + on the project row to start a session), the middle column is the current session's conversation, and the right column is the project's code. Clicking a project only expands or collapses its session list; clicking a session opens the conversation. There is no project landing page (`/p/<id>` redirects to the most recent session).

- Manual edits in the editor are saved 1.5s after typing stops; code written by the agent via `set_code` is saved once it plays successfully. Every code change records a row in `project_versions`.
- A session is created on the first message and takes its title from that message. After each turn the new messages are written to the `messages` table (pi's AgentMessage stored verbatim as jsonb), so reopening a session continues where it left off.
- The database schema lives in `src/db/schema.ts` and migrations in `drizzle/`. After changing the schema, run `npm run db:generate` to produce a migration; it is applied automatically at startup, or manually with `npm run db:migrate`.

## Model configuration

Pick a protocol in `.env.local`. Keys are used only on the server:

| Variable | Meaning |
| --- | --- |
| `LLM_PROVIDER` | `anthropic` (default) or `openai` |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_BASE_URL` / `ANTHROPIC_MODEL` | Anthropic protocol; `BASE_URL` can point at any relay speaking that protocol |
| `OPENAI_API_KEY` / `OPENAI_BASE_URL` / `OPENAI_MODEL` | OpenAI protocol; `BASE_URL` can point at DeepSeek, OpenRouter, Ollama, vLLM, or any compatible service |
| `OPENAI_API` | `completions` (chat/completions, the default) or `responses` |
| `OPENAI_REASONING` | Whether to send `reasoning_effort`: `auto` (inferred from the model name) / `true` / `false` |

DeepSeek, for example:

```sh
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat
```

- Editor: the toolbar is a player-style stop / play (pause) pair of icon buttons. Playing again after a pause resumes in place, while stop rewinds to the beginning; editing the code mid-playback adds a hot-update button. `⌘/Ctrl + Enter` plays or hot-updates, `⌘/Ctrl + .` stops. The mini-notation currently sounding is highlighted. Below the editor you can switch the visualization between notes (pianoroll), waveform (scope) and spectrum. Playback is per project and stops automatically when you switch to another one.
- Agent panel: describe the music you want, and the model writes complete code into the editor and plays it through the `set_code` tool. Playback errors are fed back so the model can fix them (at most 4 `set_code` calls per message). You can keep talking while the agent runs; your message is inserted after the current step (pi's steering).
- The agent's Strudel knowledge is delivered progressively as a skill (see below): the system prompt carries only a cheatsheet and an index, and the model reaches for the `read_doc` / `search_docs` tools when it needs the function reference, example tunes or drum patterns (at most 8 lookups per message).
- The first playback downloads samples from the strudel CDN (drum machines, piano, VCSL, Dirt-Samples); `gm_*` sounds come from soundfonts and load on demand. The Beijing opera percussion `bangu xiaoluo daluo naobo` lives in `public/samples/chinese-traditional/`, ships as mp3 with the project, and its sources and licenses are documented in that directory's README.
- Errors raised during playback (a missing sound, say) appear below the editor and are handed back to the agent as a tool result; upstream overload or rate limiting is retried twice automatically.
- Export: the "Export" button in the code toolbar renders a chosen cycle range offline (start cycle, cycle count, 44.1k / 48k) and downloads a 16-bit WAV. A pattern loops forever, so you pick the range yourself; playback stops before the export and audio is restored afterwards. The implementation is `exportAudio` in `src/lib/strudel.ts`. It does not use `renderPatternAudio` from `@strudel/webaudio` 1.3.0, because that function's audio controller carries its own private AudioContext, which breaks reverb and delay sends.

## Strudel skill (the agent's knowledge base)

`skills/strudel/` is the doc library the agent reads progressively, structured along the Agent Skills conventions:

| Layer | Contents | When it enters the context |
| --- | --- | --- |
| `SKILL.md` | Hand-written cheatsheet (mini-notation, sounds, effects, common functions, multi-track patterns) + notes on this project's environment + an auto-generated file index | Concatenated into the system prompt on every request (served from the prompt cache) |
| `workshop/` `learn/` `recipes/` `understand/` `functions/` | The official strudel.cc tutorials and topic pages (mdx converted to markdown, `<JsDoc>` expanded in place) | Read on demand with `read_doc(path, heading?)` |
| `reference/` | Function reference generated from source JSDoc (controls / pattern / signals / tonal / samples / draw, 443 entries), `index.md` with one line per function, and `sounds.md` listing every sound this project preloads | Found with `search_docs(query)`, then one heading read with `read_doc` |
| `examples/tunes.md` | The 32 example tunes from the official REPL | `read_doc("examples/tunes.md", heading="<tune name>")` |
| `examples/drums/` | 492 drum patterns split by genre (Funk, Afro, Disco, House, Dnb, Reggaeton, …) | Read the matching file when the user names a genre |

## Music theory skill

`skills/music-theory/` is hand-written music-theory material, independent of Strudel, that keeps what the agent writes musically sound. `SKILL.md` holds seven non-negotiables plus an index (it goes into the system prompt), `checklist.md` covers the decisions to make before writing, default choices, and the checks to run afterwards, and the remaining files split by topic: keys and scales, chord progressions, bass and voice leading, melody, rhythm/meter/tempo, arrangement, and Chinese pentatonic modes. Each one gives the Strudel spelling. The agent reads them through directory-prefixed paths such as `read_doc("music-theory/melody.md")`.

The server (`src/lib/skill.ts`) treats every directory under `skills/` that has a `SKILL.md` as a skill: the SKILL.md bodies are concatenated into the system prompt in order (strudel first), and the other markdown files are reached through `read_doc` / `search_docs` — strudel's paths carry no prefix, every other skill's paths are prefixed with its directory name.

`src/lib/skill.ts` reads the whole directory into memory at startup, and `GET /api/skill/read` and `GET /api/skill/search` expose it to the browser-side tools. The `heading` parameter of `read_doc` returns only the section under that heading; a long file read without a heading returns just an outline.

Every file except `SKILL.md` is generated — do not edit them by hand. To update to a newer Strudel:

```sh
npm run skill:build   # sparse-clones codeberg.org/uzu/strudel into .cache/strudel, runs jsdoc to build doc.json, rebuilds skills/strudel/ and refreshes the index in SKILL.md
```

Sources and licenses are listed in `skills/strudel/ATTRIBUTION.md` (docs and example tunes AGPL-3.0; drum patterns from lvm/tidal-drum-patterns, GPL-3.0).

## Layout

| Path | What it is |
| --- | --- |
| `src/lib/agent.ts` | The browser-side pi `Agent`: the `set_code` / `read_doc` / `search_docs` tools, their call limits, and the `streamProxy` route to the backend |
| `src/app/api/stream/route.ts` | The server side of `streamProxy`: assembles the system prompt (instructions + `skills/strudel/SKILL.md`, prompt-cached), calls the model and streams events back over SSE; GET returns the current model definition |
| `src/lib/skill.ts`, `src/app/api/skill/` | Reading and searching the Strudel skill (a server-side in-memory index) |
| `scripts/build-strudel-skill.mjs` | Generates `skills/strudel/` from the official Strudel repository |
| `src/lib/llm-config.ts` | Reads the environment to decide the Anthropic / OpenAI protocol, model, baseUrl and key |
| `src/lib/agent-model.ts` | Model definitions (Anthropic uses adaptive thinking; for OpenAI, pi-ai adapts to compatibility differences by baseUrl) |
| `src/components/agent-chat.tsx` | The chat panel, rendering the pi agent's state directly (messages, stream deltas, tool results) |
| `src/components/studio.tsx` | The studio (a client component loaded through `dynamic(..., { ssr: false })`): conversation + editor + autosave |
| `src/components/sidebar.tsx` | The project / session tree, fed by `src/lib/tree-store.ts` (`GET /api/tree`) |
| `src/db/` | Drizzle schema, connection and migrations (`index.ts`), data access layer (`queries.ts`) |
| `src/app/api/projects`, `src/app/api/sessions` | REST endpoints for projects / sessions / messages / versions |
| `src/components/strudel-editor.tsx` | CodeMirror 6 editor + Strudel playback highlighting |
| `src/lib/strudel.ts` | The Strudel engine wrapper (repl / webaudio / sample loading) |
| `skills/strudel/` | The agent's Strudel knowledge base (see above) |
| `docs/strudel-notes.md` | Strudel study notes for humans (the agent uses the skill instead) |

Strudel is licensed under AGPL-3.0, so this project, as a derivative work, is open-sourced under a compatible license.
