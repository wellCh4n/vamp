# Vamp

Vamp（音乐里反复演奏的短乐句）：用自然语言和 AI 一起 live coding 循环音乐。底层是 [Strudel](https://strudel.cc)（Tidal Cycles 的 JavaScript 移植），Agent 由 Claude 驱动。

技术栈：Next.js 16（App Router）+ React 19 + TypeScript + Tailwind v4 + shadcn/ui（Base UI 版）+ `@strudel/*` + [pi](https://github.com/earendil-works/pi)（`@earendil-works/pi-agent-core` + `pi-ai`）。

## 运行

```sh
cp .env.example .env.local   # 填入模型 Key（见下），DATABASE_URL 默认指向 docker compose 里的 Postgres
npm install
docker compose up -d         # Postgres 17，本机端口 5436
npm run dev                  # http://localhost:3000，首次访问自动执行数据库迁移
```

## 工程与会话

一个**工程**就是一首曲子（当前代码保存在工程上）；对同一个工程可以开多个**会话**，每个会话是一段独立的 Agent 对话。界面是 ChatGPT 式三栏：左侧边栏是工程树（工程 → 会话，工程行上的 + 新建会话），中间是当前会话的对话，右侧是工程代码。点工程只展开 / 收起它的会话列表，点会话进入对话；没有工程落地页（`/p/<id>` 会跳转到最近的会话）。

- 编辑器里的手动修改停止输入 1.5 秒后自动保存；Agent 通过 `set_code` 写入的代码在播放成功后保存。每次代码变化都会在 `project_versions` 里留一条版本。
- 会话在第一次发消息时创建，标题取自第一句话；每轮对话结束后把新消息写入 `messages` 表（pi 的 AgentMessage 原样存 jsonb），重新打开会话即可继续。
- 数据库结构见 `src/db/schema.ts`，迁移文件在 `drizzle/`。改了 schema 后 `npm run db:generate` 生成迁移，应用启动时自动执行，也可以 `npm run db:migrate` 手动跑。

## 模型配置

`.env.local` 里选协议，Key 只在服务端使用：

| 变量 | 说明 |
| --- | --- |
| `LLM_PROVIDER` | `anthropic`（默认）或 `openai` |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_BASE_URL` / `ANTHROPIC_MODEL` | Anthropic 协议；`BASE_URL` 可指向兼容 Anthropic 协议的中转 |
| `OPENAI_API_KEY` / `OPENAI_BASE_URL` / `OPENAI_MODEL` | OpenAI 协议；`BASE_URL` 可指向 DeepSeek、OpenRouter、Ollama、vLLM 等任何兼容服务 |
| `OPENAI_API` | `completions`（chat/completions，默认）或 `responses` |
| `OPENAI_REASONING` | 是否发送 `reasoning_effort`：`auto`（按型号名判断）/ `true` / `false` |

例如用 DeepSeek：

```sh
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat
```

- 编辑器：工具栏是播放器式的停止 / 播放（暂停）图标按钮，暂停后再按播放从原处继续，停止回到开头；播放中改了代码会多出一个热更新按钮。快捷键 `⌘/Ctrl + Enter` 播放 / 热更新，`⌘/Ctrl + .` 停止。正在响的 mini-notation 会高亮。编辑器下方可切换可视化：音符（pianoroll）、波形（示波器）、频谱。播放是工程级别的，切到别的工程会自动停止。
- Agent 面板：描述你想要的音乐，模型通过 `set_code` 工具把完整代码写进编辑器并播放；播放报错会自动回传给模型修正（每次输入最多 4 次 `set_code`）。Agent 运行中还可以继续说话，消息会在当前步骤后插入（pi 的 steering）。
- Agent 的 Strudel 知识以 skill 的形式渐进式提供（见下）：系统提示里只有速查和索引，模型需要时用 `read_doc` / `search_docs` 工具查函数参考、示例曲和鼓型（每次输入最多 8 次）。
- 第一次播放会从 strudel CDN 下载采样（鼓机、钢琴、VCSL、Dirt-Samples），`gm_*` 音色来自 soundfonts，按需加载。中国传统乐器在 `public/samples/chinese-traditional/`：笛子 `dizi` 和京剧锣鼓 `bangu xiaoluo daluo naobo` 的 mp3 随项目发布，二胡 `erhu` 的映射指向 CC0 来源仓库按需加载，来源与授权见该目录 README。
- 播放过程中的错误（比如音色不存在）会显示在编辑器下方，并作为工具结果回传给 Agent；上游过载 / 限流会自动重试两次。
- 导出：代码工具栏的"导出"按钮离线渲染指定的 cycle 区间（起始 cycle、cycle 数、44.1k / 48k）并下载 16-bit WAV。pattern 是无限循环的，所以要自己选一段；导出前会停止播放，完成后自动恢复音频。实现在 `src/lib/strudel.ts` 的 `exportAudio`，没有直接用 `@strudel/webaudio` 1.3.0 的 `renderPatternAudio`，因为它内部的音频控制器带着一份私有 AudioContext，混响 / 延迟发送会报错。

## Strudel skill（Agent 的知识库）

`skills/strudel/` 是给 Agent 渐进式阅读的资料库，结构参考 Agent Skills 的约定：

| 层 | 内容 | 什么时候进上下文 |
| --- | --- | --- |
| `SKILL.md` | 手写的速查（mini-notation、音色、效果、常用函数、多轨写法）+ 本项目环境说明 + 自动生成的文件索引 | 每次请求都拼进系统提示（走 prompt cache） |
| `workshop/` `learn/` `recipes/` `understand/` `functions/` | strudel.cc 的官方教程和专题页（mdx 转 markdown，`<JsDoc>` 就地展开） | 模型用 `read_doc(path, heading?)` 按需读 |
| `reference/` | 从源码 JSDoc 生成的函数参考（controls / pattern / signals / tonal / samples / draw，443 项）、`index.md` 每函数一行、`sounds.md` 本项目预加载的全部音色名 | `search_docs(query)` 搜到再 `read_doc` 读一个标题 |
| `examples/tunes.md` | 官方 REPL 的 32 首示例曲 | `read_doc("examples/tunes.md", heading="曲名")` |
| `examples/drums/` | 492 个按曲风分文件的鼓型（Funk、Afro、Disco、House、Dnb、Reggaeton…） | 用户点名曲风时读对应文件 |

服务端 `src/lib/skill.ts` 启动时把整个目录读进内存，`GET /api/skill/read` 和 `GET /api/skill/search` 提供给浏览器里的工具；`read_doc` 的 `heading` 参数只返回一个标题下的段落，长文件不带 heading 只返回大纲。

除 `SKILL.md` 外的文件都是生成的，不要手改。更新到新版 Strudel：

```sh
npm run skill:build   # 稀疏克隆 codeberg.org/uzu/strudel 到 .cache/strudel，跑 jsdoc 生成 doc.json，重建 skills/strudel/ 并刷新 SKILL.md 里的索引
```

来源与许可见 `skills/strudel/ATTRIBUTION.md`（文档和示例曲 AGPL-3.0，鼓型来自 lvm/tidal-drum-patterns，GPL-3.0）。

## 结构

| 路径 | 说明 |
| --- | --- |
| `src/lib/agent.ts` | 浏览器端的 pi `Agent`：`set_code` / `read_doc` / `search_docs` 工具、工具次数上限、通过 `streamProxy` 走后端 |
| `src/app/api/stream/route.ts` | `streamProxy` 的服务端：拼系统提示（指令 + `skills/strudel/SKILL.md`，prompt cache），调模型并按 SSE 协议回传；GET 返回当前模型定义 |
| `src/lib/skill.ts`、`src/app/api/skill/` | Strudel skill 的读取与搜索（服务端内存索引） |
| `scripts/build-strudel-skill.mjs` | 从 Strudel 官方仓库生成 `skills/strudel/` |
| `src/lib/llm-config.ts` | 读环境变量，决定 Anthropic / OpenAI 协议、模型、baseUrl、Key |
| `src/lib/agent-model.ts` | 模型定义（Anthropic 用 adaptive thinking；OpenAI 由 pi-ai 按 baseUrl 自动适配兼容差异） |
| `src/components/agent-chat.tsx` | 聊天面板，直接渲染 pi Agent 的 state（消息、流式增量、工具结果） |
| `src/components/studio.tsx` | 工作台（客户端组件，经 `dynamic(..., { ssr: false })` 加载）：对话 + 编辑器 + 自动保存 |
| `src/components/sidebar.tsx` | 左侧工程 / 会话树，数据来自 `src/lib/tree-store.ts`（`GET /api/tree`） |
| `src/db/` | Drizzle schema、连接与迁移（`index.ts`）、数据访问层（`queries.ts`） |
| `src/app/api/projects`、`src/app/api/sessions` | 工程 / 会话 / 消息 / 版本的 REST 接口 |
| `src/components/strudel-editor.tsx` | CodeMirror 6 编辑器 + Strudel 播放高亮 |
| `src/lib/strudel.ts` | Strudel 引擎封装（repl / webaudio / 采样加载） |
| `skills/strudel/` | Agent 的 Strudel 知识库（见上） |
| `docs/strudel-notes.md` | 给人看的 Strudel 学习笔记（Agent 现在用的是 skill） |

Strudel 采用 AGPL-3.0 许可证，本项目作为衍生作品需以兼容许可证开源。
