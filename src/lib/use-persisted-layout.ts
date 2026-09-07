"use client";

import { useCallback, useEffect } from "react";
import { useGroupRef, type Layout } from "react-resizable-panels";

/**
 * Persist the resizable panel layout to localStorage.
 * The library's own useDefaultLayout is not used: it reads localStorage during render, which breaks
 * server rendering. This restores after mount instead, at the cost of the panels jumping from their
 * default sizes to the remembered ones on refresh.
 */
export function usePersistedLayout(key: string) {
  const groupRef = useGroupRef();
  const storageKey = `vamp:layout:${key}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const layout = JSON.parse(raw) as Layout;
      if (Object.values(layout).every((v) => typeof v === "number"))
        groupRef.current?.setLayout(layout);
    } catch {
      /* Fall back to the default layout when storage is unavailable or the data is corrupt */
    }
  }, [groupRef, storageKey]);

  const onLayoutChanged = useCallback(
    (layout: Layout, meta: { isUserInteraction: boolean }) => {
      if (!meta.isUserInteraction) return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(layout));
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  );

  return { groupRef, onLayoutChanged };
}
