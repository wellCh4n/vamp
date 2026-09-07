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
  /** Placeholder shown while the editor is empty */
  placeholder?: string
  onChange?: (code: string) => void
  onEvaluate?: () => void
  onStop?: () => void
}

const themeCompartment = new Compartment()

// Make the editor background transparent and inherit the page font; keep Strudel's own GitHub theme for the rest
const chrome = EditorView.theme({
  '&': { backgroundColor: 'transparent', height: '100%', fontSize: '14px' },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': {
    fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
    lineHeight: '1.6',
  },
  // Match the chat panel's 16px gutters: line numbers start at 8px, with 16px before the code and at the right edge
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
  // Keep callbacks in a ref so the editor is not rebuilt on every parent render
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
    // initialCode is only used on the first mount; later updates go through ref.setCode
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
