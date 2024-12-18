'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import ChatComponent from './chat'

export default function ChatPage() {
  const router = useRouter()
  const { connected } = useWallet()

  useEffect(() => {
    if (!connected) {
      router.push('/')
    }
  }, [connected, router])

  if (!connected) {
    return null // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ChatComponent />
    </div>
  )
}

