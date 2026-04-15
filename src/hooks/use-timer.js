import { useState, useEffect, useRef, useCallback } from "react"

export function useTimer(initialSeconds = 300) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  const start = useCallback((seconds) => {
    setTimeLeft(seconds ?? initialSeconds)
    setIsRunning(true)
  }, [initialSeconds])

  const stop = useCallback(() => {
    setIsRunning(false)
    clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(intervalRef.current); setIsRunning(false); return 0 }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const seconds = String(timeLeft % 60).padStart(2, "0")
  const formattedTime = `${minutes}:${seconds}`

  return { timeLeft, formattedTime, isRunning, start, stop }
}
