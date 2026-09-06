"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentMessage } from "@earendil-works/pi-agent-core";
import {
  BookOpenIcon,
  DownloadIcon,
  Loader2Icon,
  PauseIcon,
  PlayIcon,
  RotateCwIcon,
  SquareIcon,
} from "lucide-react";

import { AgentChat, type ApplyResult } from "@/components/agent-chat";
import { ExportDialog } from "@/components/export-dialog";
import {
  StrudelEditor,
  type StrudelEditorHandle,
} from "@/components/strudel-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaybackBpm } from "@/components/playback-progress";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { api, type ProjectDto, type SessionDto } from "@/lib/api";
import { cheatsheet } from "@/lib/cheatsheet";
import {
  attachCanvas,
  type EngineState,
  getPlayingOwner,
  getState,
  pause,
  play,
  resume,
  setVisualization,
  stop,
  subscribe,
  type Visualization,
  waitForRuntimeErrors,
  warmup,
} from "@/lib/strudel";
import { useWideScreen } from "@/lib/media";
import { useSystemDark } from "@/lib/theme";
import { usePersistedLayout } from "@/lib/use-persisted-layout";
import { refreshTree } from "@/lib/tree-store";
import { cn } from "@/lib/utils";

export interface StudioProps {
  project: ProjectDto;
  session: SessionDto;
  messages: AgentMessage[];
}

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.platform);
const modKey = isMac ? "⌘" : "Ctrl";
const MANUAL_SAVE_DELAY_MS = 1500;
const DEFAULT_SESSION_TITLE = "新会话";
const VISUALIZATIONS: { key: Visualization; label: string }[] = [
  { key: "roll", label: "音符" },
  { key: "scope", label: "波形" },
  { key: "spectrum", label: "频谱" },
];
const VIS_STORAGE_KEY = "vibe-visualization";

function useVisualization() {
  const [mode, setMode] = useState<Visualization>(() => {
    try {
      const saved = localStorage.getItem(VIS_STORAGE_KEY);
      if (saved === "roll" || saved === "scope" || saved === "spectrum")
        return saved;
    } catch {
      /* ignore */
    }
    return "roll";
  });
  useEffect(() => {
    setVisualization(mode);
    try {
      localStorage.setItem(VIS_STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);
  return [mode, setMode] as const;
}

function useEngine() {
  const [state, setState] = useState<EngineState>(getState);
  useEffect(() => subscribe(setState), []);
  return state;
}

/**
 * 工作台：中间是当前会话的对话，右侧是工程代码。
 * 切换会话 / 工程时由路由重新挂载（key 见 studio-loader），这里不处理切换。
 */
export function Studio({ project, session, messages }: StudioProps) {
  const engine = useEngine();
  const dark = useSystemDark();
  const wide = useWideScreen();
  const studioLayout = usePersistedLayout("studio");
  const codeLayout = usePersistedLayout("code");
  const [code, setCode] = useState(project.code);
  const [evaluating, setEvaluating] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [title, setTitle] = useState(session.title);
  const [visualization, setVisualizationMode] = useVisualization();
  const editorRef = useRef<StrudelEditorHandle>(null);
  // 最新代码的镜像，供快捷键和 Agent 回调读取（避免闭包里的旧值）
  const codeRef = useRef(code);
  const lastSavedRef = useRef(project.code);
  const titledRef = useRef(
    session.title !== DEFAULT_SESSION_TITLE || messages.length > 0,
  );

  useEffect(() => {
    void warmup();
    // 播放是工程级别的：进入别的工程时把上一个工程的播放停掉
    const owner = getPlayingOwner();
    if (owner && owner !== project.id) stop();
  }, [project.id]);

  // pianoroll：canvas 按 devicePixelRatio 设尺寸，跟随容器大小变化
  const rollRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = rollRef.current;
    if (!el) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      el.width = Math.max(1, Math.round(el.clientWidth * dpr));
      el.height = Math.max(1, Math.round(el.clientHeight * dpr));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    attachCanvas(el);
    return () => {
      observer.disconnect();
      attachCanvas(null);
    };
  }, []);

  /** 第一次发消息：用这句话给会话起名 */
  const ensureSession = useCallback(
    async (firstText: string) => {
      if (!titledRef.current) {
        titledRef.current = true;
        const next = firstText.slice(0, 40);
        setTitle(next);
        api
          .renameSession(session.id, next)
          .then(() => refreshTree())
          .catch(() => undefined);
      }
      return session.id;
    },
    [session.id],
  );

  const persist = useCallback(
    async (sessionId: string, items: AgentMessage[]) => {
      await api.appendMessages(sessionId, items);
      refreshTree();
    },
    [],
  );

  // 手动编辑：停止输入 1.5 秒后保存为一个版本
  useEffect(() => {
    if (code === lastSavedRef.current) return;
    const timer = setTimeout(async () => {
      try {
        await api.saveProjectCode(project.id, code, "手动编辑", session.id);
        lastSavedRef.current = code;
        setSaveError(null);
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : String(err));
      }
    }, MANUAL_SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [code, project.id, session.id]);

  const busy = evaluating || engine.status === "loading";
  const playing = engine.started;

  const handlePlay = useCallback(async () => {
    if (!codeRef.current.trim()) return;
    setEvaluating(true);
    try {
      const ok = await play(codeRef.current, project.id);
      if (ok) setDirty(false);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  }, [project.id]);

  const handleStop = useCallback(() => stop(), []);

  // 播放 / 暂停一个键：播放中按下是暂停；暂停且代码没改就从原处继续；否则重新求值播放
  const handleToggle = useCallback(() => {
    if (engine.started) {
      pause();
      return;
    }
    if (engine.paused && !dirty) {
      void resume();
      return;
    }
    void handlePlay();
  }, [engine.started, engine.paused, dirty, handlePlay]);

  const replaceCode = useCallback((next: string) => {
    codeRef.current = next;
    setCode(next);
    editorRef.current?.setCode(next);
  }, []);

  // Agent 的工具执行：写入编辑器、播放、成功后记一个版本
  const applyCode = useCallback(
    async (next: string, summary: string): Promise<ApplyResult> => {
      replaceCode(next);
      setEvaluating(true);
      try {
        const since = performance.now();
        const ok = await play(next, project.id);
        const error = getState().error;
        if (!ok || error)
          return { ok: false, error: error ?? "代码没有产生可播放的 pattern" };
        // 音色不存在这类错误只在触发时才会报，等一小段时间再判定
        const runtimeErrors = await waitForRuntimeErrors(since);
        if (runtimeErrors.length) {
          return {
            ok: false,
            error: `代码已运行，但播放时报错：${runtimeErrors.slice(0, 3).join("；")}`,
          };
        }
        setDirty(false);
        try {
          await api.saveProjectCode(project.id, next, summary, session.id);
          lastSavedRef.current = next;
        } catch (err) {
          setSaveError(err instanceof Error ? err.message : String(err));
        }
        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        };
      } finally {
        setEvaluating(false);
      }
    },
    [project.id, session.id, replaceCode],
  );
  const getCode = useCallback(() => codeRef.current, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod) return;
      if (e.key === "Enter") {
        e.preventDefault();
        void handlePlay();
      } else if (e.key === ".") {
        e.preventDefault();
        handleStop();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlePlay, handleStop]);

  // 只在需要用户知道的时候显示：音色还在加载、引擎初始化失败。就绪 / 正在播放看工具栏就知道，不用提示
  const statusBadge = (() => {
    if (engine.status === "loading")
      return <Badge variant="secondary">加载音色中…</Badge>;
    if (engine.status === "error")
      return <Badge variant="destructive">引擎初始化失败</Badge>;
    return null;
  })();

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-2.5">
        <div className="flex min-w-0 items-baseline gap-2">
          <h1 className="truncate text-base font-semibold tracking-tight">
            {project.name}
          </h1>
          <span className="truncate text-xs text-muted-foreground">
            / {title}
          </span>
        </div>
        {statusBadge && <div className="ml-1 shrink-0">{statusBadge}</div>}
      </header>

      {/* 宽屏左右分栏、窄屏上下分栏，分隔线可拖拽，比例记在本地 */}
      <ResizablePanelGroup
        orientation={wide ? "horizontal" : "vertical"}
        groupRef={studioLayout.groupRef}
        onLayoutChanged={studioLayout.onLayoutChanged}
        className="min-h-0 flex-1"
      >
        {/* 对话 */}
        <ResizablePanel
          id="chat"
          defaultSize="40"
          minSize={wide ? 360 : 160}
          className="flex min-h-0 flex-col"
        >
          <AgentChat
            key={session.id}
            getCode={getCode}
            applyCode={applyCode}
            initialMessages={messages}
            ensureSession={ensureSession}
            persist={persist}
          />
        </ResizablePanel>
        <ResizableHandle />

        {/* 代码 */}
        <ResizablePanel
          id="code"
          defaultSize="60"
          minSize={wide ? 320 : 160}
          className="flex min-h-0 flex-col"
        >
          <div className="flex shrink-0 items-center gap-2 border-b px-4 py-2">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              代码
            </span>
            <div className="ml-1 flex items-center gap-1">
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="停止"
                title={`停止（${modKey}+.）`}
                onClick={handleStop}
                disabled={!playing && !engine.paused}
              >
                <SquareIcon />
              </Button>
              <Button
                size="icon-sm"
                aria-label={playing ? "暂停" : "播放"}
                title={playing ? "暂停" : `播放（${modKey}+↵）`}
                onClick={handleToggle}
                disabled={busy || !code.trim()}
              >
                {busy ? (
                  <Loader2Icon className="animate-spin" />
                ) : playing ? (
                  <PauseIcon />
                ) : (
                  <PlayIcon />
                )}
              </Button>
              {playing && dirty && (
                <Button
                  size="icon-sm"
                  variant="outline"
                  aria-label="更新"
                  title={`用当前代码热更新（${modKey}+↵）`}
                  onClick={handlePlay}
                  disabled={busy}
                >
                  <RotateCwIcon />
                </Button>
              )}
            </div>
            {playing && <PlaybackBpm />}
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => setShowExport(true)}
              disabled={busy || !code.trim()}
            >
              <DownloadIcon data-icon="inline-start" />
              导出
            </Button>
            <ExportDialog
              open={showExport}
              onOpenChange={setShowExport}
              code={code}
              name={project.name}
            />
            <Button
              variant={showCheatsheet ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowCheatsheet((v) => !v)}
              aria-pressed={showCheatsheet}
            >
              <BookOpenIcon data-icon="inline-start" />
              速查
            </Button>
          </div>
          {/* 编辑器、可视化和状态条贴边铺满，与左侧对话面板保持同一节奏，不再套卡片；编辑器和可视化之间可上下拖拽 */}
          <div className="flex min-h-0 flex-1 flex-col">
            <ResizablePanelGroup
              orientation="vertical"
              groupRef={codeLayout.groupRef}
              onLayoutChanged={codeLayout.onLayoutChanged}
              className="min-h-0 flex-1"
            >
              <ResizablePanel
                id="editor"
                minSize={120}
                className="flex min-h-0 flex-col"
              >
                <StrudelEditor
                  ref={editorRef}
                  initialCode={project.code}
                  dark={dark}
                  placeholder={
                    '// 在这里写 Strudel 代码，或者在左侧告诉 Agent 你想要什么\n// 例如：sound("bd sd hh sd")'
                  }
                  className="min-h-0 flex-1"
                  onChange={(value) => {
                    codeRef.current = value;
                    setCode(value);
                    setDirty(true);
                  }}
                  onEvaluate={() => void handlePlay()}
                  onStop={handleStop}
                />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel
                id="visualization"
                defaultSize={128}
                minSize={64}
                maxSize="60"
                className="relative overflow-hidden bg-muted/20"
                aria-label="可视化"
              >
                <canvas ref={rollRef} className="block h-full w-full" />
                <div
                  className="absolute top-1.5 right-1.5 flex gap-0.5 rounded-md bg-background/80 p-0.5 backdrop-blur"
                  role="tablist"
                  aria-label="可视化方式"
                >
                  {VISUALIZATIONS.map((v) => (
                    <Button
                      key={v.key}
                      size="xs"
                      variant={visualization === v.key ? "secondary" : "ghost"}
                      role="tab"
                      aria-selected={visualization === v.key}
                      onClick={() => setVisualizationMode(v.key)}
                    >
                      {v.label}
                    </Button>
                  ))}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
            {engine.error ? (
              <pre className="max-h-32 shrink-0 overflow-auto border-t border-destructive/40 bg-destructive/10 px-4 py-2 text-xs whitespace-pre-wrap text-destructive">
                {engine.error}
              </pre>
            ) : saveError ? (
              <p className="shrink-0 border-t px-4 py-1.5 text-xs text-destructive">
                保存失败：{saveError}
              </p>
            ) : (
              <p className="shrink-0 border-t px-4 py-1.5 text-xs text-muted-foreground">
                {modKey}+↵ 热更新，{modKey}+.
                停止。代码自动保存到工程，每次改动都有版本记录。
              </p>
            )}
          </div>
          <div
            className={cn(
              "max-h-[45%] shrink-0 border-t",
              !showCheatsheet && "hidden",
            )}
          >
            <ScrollArea className="h-full max-h-[40svh]">
              <div className="flex flex-col gap-4 px-4 py-3">
                {cheatsheet.map((section, i) => (
                  <section key={section.title}>
                    {i > 0 && <Separator className="mb-3" />}
                    <h3 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {section.title}
                    </h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 xl:grid-cols-2">
                      {section.items.map((item) => (
                        <div
                          key={item.syntax}
                          className="flex flex-col gap-0.5"
                        >
                          <dt>
                            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] break-all">
                              {item.syntax}
                            </code>
                          </dt>
                          <dd className="text-xs text-muted-foreground">
                            {item.desc}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ))}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
