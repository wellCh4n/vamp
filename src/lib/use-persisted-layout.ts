"use client";

import { useCallback, useEffect } from "react";
import { useGroupRef, type Layout } from "react-resizable-panels";

/**
 * 把可拖拽面板的布局记到 localStorage。
 * 不用库自带的 useDefaultLayout：它在渲染期读 localStorage，服务端渲染会炸；
 * 这里改成挂载后再恢复，代价只是刷新时面板会从默认尺寸跳到记住的尺寸。
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
      /* 存储不可用或数据损坏时用默认布局 */
    }
  }, [groupRef, storageKey]);

  const onLayoutChanged = useCallback(
    (layout: Layout, meta: { isUserInteraction: boolean }) => {
      if (!meta.isUserInteraction) return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(layout));
      } catch {
        /* 忽略 */
      }
    },
    [storageKey],
  );

  return { groupRef, onLayoutChanged };
}
