"use client";

import { useSyncExternalStore } from "react";

/** Subscribe to a CSS media query (false during server rendering, corrected right after hydration) */
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

/** Matches Tailwind's lg breakpoint */
export function useWideScreen() {
  return useMediaQuery("(min-width: 1024px)");
}
