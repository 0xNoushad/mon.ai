'use client'

import { useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import TerminalChat from "./chat"

export default function ChatScreen() {
  const { connected } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!connected) {
      router.push('/wallet')
    }
  }, [connected, router])

  return connected ? <TerminalChat /> : null
}

