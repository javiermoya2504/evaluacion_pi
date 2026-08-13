"use client"

import { useEffect, useRef } from "react"

export function useAutoRefresh(refresh: () => void | Promise<void>, intervalMs = 30_000) {
  const refreshRef = useRef(refresh)

  useEffect(() => {
    refreshRef.current = refresh
  }, [refresh])

  useEffect(() => {
    const run = () => void refreshRef.current()
    run()
    const interval = window.setInterval(run, intervalMs)
    const onVisibility = () => { if (document.visibilityState === "visible") run() }
    window.addEventListener("focus", run)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener("focus", run)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [intervalMs])
}
