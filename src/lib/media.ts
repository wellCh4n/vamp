"use client";

import { useSyncExternalStore } from "react";

/** 订阅一个 CSS 媒体查询（服务端渲染时为 false，客户端 hydration 后立即纠正） */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** 与 Tailwind 的 lg 断点一致 */
export function useWideScreen() {
  return useMediaQuery("(min-width: 1024px)");
}
