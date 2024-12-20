'use client'

import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      (window as any).workbox !== undefined
    ) {
      const wb = (window as any).workbox

      // Add event listeners to handle PWA lifecycle
      wb.addEventListener('installed', (event: any) => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      wb.addEventListener('controlling', (event: any) => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      wb.addEventListener('activated', (event: any) => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      // Register the service worker
      wb.register()
    }
  }, [])

  return null
}

