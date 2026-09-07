import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Route handlers read skills/strudel/ at runtime for the system prompt and doc library, so bundle it on deploy
  outputFileTracingIncludes: {
    '/api/stream': ['./skills/**/*'],
    '/api/skill/read': ['./skills/**/*'],
    '/api/skill/search': ['./skills/**/*'],
  },
}

export default nextConfig
