import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import { PlaybackGuard } from '@/components/playback-guard'
import { Sidebar } from '@/components/sidebar'
import { ThemeSync } from '@/components/theme-sync'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Vamp',
  description: '用 Strudel 和 AI 一起 live coding 音乐',
  icons: { icon: '/favicon.svg' },
}

// 主题跟随系统：在 hydration 之前按系统偏好设置 .dark，避免闪白；之后由 ThemeSync 实时跟随
const themeInit = `(function(){try{if(matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.classList.add('dark')}catch(e){}})()`

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="h-full bg-background text-foreground">
        <ThemeSync />
        <PlaybackGuard />
        <div className="flex h-svh overflow-hidden">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
        </div>
      </body>
    </html>
  )
}
