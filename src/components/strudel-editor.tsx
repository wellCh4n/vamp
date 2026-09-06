'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { javascript, javascriptLanguage } from '@codemirror/lang-javascript'
import { bracketMatching } from '@codemirror/language'
import { Compartment, EditorState, Prec } from '@codemirror/state'
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  placeholder,
} from '@codemirror/view'
import { flashField, highlightExtension, themes } from '@strudel/codemirror'

import { attachEditor } from '@/lib/strudel'
import { cn } from '@/lib/utils'

export interface StrudelEditorHandle {
  setCode(code: string): void
  focus(): void
  view: EditorView | null
}

interface StrudelEditorProps {
  initialCode: string
  dark: boolean
  className?: string
  /** 编辑器为空时的提示文字 */
  placeholder?: string
  onChange?: (code: string) => void
  onEvaluate?: () => void
  onStop?: () => void
}

const themeCompartment = new Compartment()

// 让编辑器背景透明、字体跟随页面，其余配色用 Strudel 自带的 GitHub 主题
const chrome = EditorView.theme({
  '&': { backgroundColor: 'transparent', height: '100%', fontSize: '14px' },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': {
    fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
    lineHeight: '1.6',
  },
  // 左右留白对齐对话面板的 16px：行号从 8px 起，代码与右边缘各留 16px
  '.cm-gutters': { backgroundColor: 'transparent', border: 'none', color: 'var(--muted-foreground)', paddingLeft: '8px' },
  '.cm-content': { padding: '12px 0' },
  '.cm-line': { padding: '0 16px 0 8px' },
})

function editorTheme(dark: boolean) {
  return [dark ? themes.githubDark : themes.githubLight, chrome]
}

export const StrudelEditor = forwardRef<StrudelEditorHandle, StrudelEditorProps>(function StrudelEditor(
  { initialCode, dark, className, placeholder: placeholderText, onChange, onEvaluate, onStop },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  // 用 ref 保存回调，避免每次父组件渲染都重建编辑器
  const callbacks = useRef({ onChange, onEvaluate, onStop })
  useEffect(() => {
    callbacks.current = { onChange, onEvaluate, onStop }
  }, [onChange, onEvaluate, onStop])

  useEffect(() => {
    if (!rootRef.current) return
    const view = new EditorView({
      parent: rootRef.current,
      state: EditorState.create({
        doc: initialCode,
        extensions: [
          history(),
          highlightSpecialChars(),
          dropCursor(),
          lineNumbers(),
          highlightActiveLine(),
          drawSelection({ cursorBlinkRate: 0 }),
          javascript(),
          javascriptLanguage.data.of({
            closeBrackets: { brackets: ['(', '[', '{', "'", '"', '<'] },
          }),
          closeBrackets(),
          bracketMatching({ brackets: '()[]{}<>' }),
          EditorView.lineWrapping,
          placeholderText ? placeholder(placeholderText) : [],
          keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
          themeCompartment.of(editorTheme(dark)),
          Prec.highest(highlightExtension),
          flashField,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) callbacks.current.onChange?.(update.state.doc.toString())
          }),
          Prec.highest(
            keymap.of([
              { key: 'Mod-Enter', run: () => (callbacks.current.onEvaluate?.(), true) },
              { key: 'Ctrl-Enter', run: () => (callbacks.current.onEvaluate?.(), true) },
              { key: 'Mod-.', run: () => (callbacks.current.onStop?.(), true) },
              { key: 'Ctrl-.', run: () => (callbacks.current.onStop?.(), true) },
            ]),
          ),
        ],
      }),
    })
    viewRef.current = view
    attachEditor(view)
    return () => {
      attachEditor(null)
      view.destroy()
      viewRef.current = null
    }
    // initialCode 只在首次挂载时使用；后续通过 ref.setCode 更新
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    viewRef.current?.dispatch({ effects: themeCompartment.reconfigure(editorTheme(dark)) })
  }, [dark])

  useImperativeHandle(
    ref,
    () => ({
      setCode(code: string) {
        const view = viewRef.current
        if (!view) return
        view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: code } })
      },
      focus() {
        viewRef.current?.focus()
      },
      get view() {
        return viewRef.current
      },
    }),
    [],
  )

  return <div ref={rootRef} className={cn('min-h-0 overflow-hidden', className)} />
})
