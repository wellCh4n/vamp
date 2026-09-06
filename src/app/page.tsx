import { Logo } from '@/components/logo'

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <Logo className="size-10" />
      <h1 className="text-lg font-semibold tracking-tight">Vamp</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        在左侧新建一个工程，或者点开已有的工程。一个工程就是一首曲子，工程下的每个会话都是一段和 Agent 的对话，都可以改这首曲子。
      </p>
    </div>
  )
}
