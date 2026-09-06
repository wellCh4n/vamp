import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Route Handler 在运行时读取 skills/strudel/ 作为系统提示和资料库，部署时要把它打进产物
  outputFileTracingIncludes: {
    '/api/stream': ['./skills/**/*'],
    '/api/skill/read': ['./skills/**/*'],
    '/api/skill/search': ['./skills/**/*'],
  },
}

export default nextConfig
