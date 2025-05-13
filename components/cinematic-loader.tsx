"use client"

import { useEffect, useState } from "react"

export default function CinematicLoader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center transition-opacity duration-500"
      style={{ opacity: progress === 100 ? 0 : 1, pointerEvents: progress === 100 ? "none" : "auto" }}
    >
      <div className="w-16 h-16 mb-8">
        <svg viewBox="0 0 24 24" className="w-full h-full animate-pulse">
          <path
            fill="currentColor"
            d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5M7.5,12A1.5,1.5 0 0,1 9,10.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 7.5,12M16.5,12A1.5,1.5 0 0,1 18,10.5A1.5,1.5 0 0,1 19.5,12A1.5,1.5 0 0,1 18,13.5A1.5,1.5 0 0,1 16.5,12Z"
            className="text-red-800"
          />
        </svg>
      </div>
      <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-800 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-4 text-sm text-gray-400">CINETUBE</div>
    </div>
  )
}
