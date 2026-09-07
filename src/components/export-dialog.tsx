'use client'

import { useState } from 'react'
import { DownloadIcon, Loader2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { exportAudio } from '@/lib/strudel'
import { cn } from '@/lib/utils'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  code: string
  /** Default file name (the project name) */
  name: string
}

const SAMPLE_RATES = [44100, 48000] as const
const MAX_CYCLES = 256

type Status = { kind: 'idle' } | { kind: 'rendering' } | { kind: 'done'; seconds: number; warnings: string[] } | { kind: 'error'; message: string }

/** Export WAV: render the given cycle range offline, then let the browser download it */
export function ExportDialog({ open, onOpenChange, code, name }: ExportDialogProps) {
  const [begin, setBegin] = useState('0')
  const [cycles, setCycles] = useState('16')
  const [sampleRate, setSampleRate] = useState<(typeof SAMPLE_RATES)[number]>(44100)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const beginNum = Number(begin)
  const cyclesNum = Number(cycles)
  const valid = Number.isInteger(beginNum) && beginNum >= 0 && Number.isInteger(cyclesNum) && cyclesNum >= 1 && cyclesNum <= MAX_CYCLES
  const rendering = status.kind === 'rendering'

  const run = async () => {
    if (!valid || rendering) return
    setStatus({ kind: 'rendering' })
    try {
      const fileName = `${name.trim() || 'vamp'}-cycle${beginNum}-${beginNum + cyclesNum}`
      const result = await exportAudio({ code, begin: beginNum, cycles: cyclesNum, sampleRate, name: fileName })
      setStatus({ kind: 'done', seconds: result.seconds, warnings: result.warnings })
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : String(err) })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (rendering) return
        if (!next) setStatus({ kind: 'idle' })
        onOpenChange(next)
      }}
    >
      <DialogContent showCloseButton={!rendering}>
        <form
          className="contents"
          onSubmit={(e) => {
            e.preventDefault()
            void run()
          }}
        >
          <DialogHeader>
            <DialogTitle>导出音频</DialogTitle>
            <DialogDescription>
              离线渲染指定的 cycle 区间并下载 WAV。pattern 是无限循环的，所以要选一段来导出；导出前会先停止播放。
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
              起始 cycle
              <Input type="number" min={0} step={1} value={begin} onChange={(e) => setBegin(e.target.value)} disabled={rendering} />
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
              导出 cycle 数（1–{MAX_CYCLES}）
              <Input type="number" min={1} max={MAX_CYCLES} step={1} value={cycles} onChange={(e) => setCycles(e.target.value)} disabled={rendering} />
            </label>
            <div className="col-span-2 flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
              采样率
              <div className="flex gap-1" role="radiogroup" aria-label="采样率">
                {SAMPLE_RATES.map((rate) => (
                  <Button
                    key={rate}
                    type="button"
                    size="sm"
                    variant={sampleRate === rate ? 'secondary' : 'outline'}
                    role="radio"
                    aria-checked={sampleRate === rate}
                    disabled={rendering}
                    onClick={() => setSampleRate(rate)}
                  >
                    {rate / 1000} kHz
                  </Button>
                ))}
              </div>
            </div>
            <p className="col-span-2 text-xs text-muted-foreground">
              用 <code>setcpm(bpm/4)</code> 写的曲子里 1 cycle = 1 小节；16 个 cycle 在 120 BPM 下约 32 秒。
            </p>
          </div>
          {status.kind === 'done' && (
            <div className={cn('rounded-md border px-3 py-2 text-xs', status.warnings.length ? 'border-amber-500/40 bg-amber-500/10' : 'border-emerald-500/40 bg-emerald-500/10')}>
              已导出 {Math.round(status.seconds)} 秒的 WAV，浏览器会自动下载。
              {status.warnings.length > 0 && (
                <>
                  <br />
                  渲染时有报错，导出的文件可能缺少部分声音：{status.warnings.slice(0, 3).join('；')}
                </>
              )}
            </div>
          )}
          {status.kind === 'error' && <p className="text-xs text-destructive">导出失败：{status.message}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={rendering} onClick={() => onOpenChange(false)}>
              关闭
            </Button>
            <Button type="submit" disabled={!valid || rendering || !code.trim()}>
              {rendering ? <Loader2Icon className="animate-spin" data-icon="inline-start" /> : <DownloadIcon data-icon="inline-start" />}
              {rendering ? '渲染中…' : '导出 WAV'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
