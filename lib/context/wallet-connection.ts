'use client'

import { useWallet } from '@solana/wallet-adapter-react'

export function useWalletConnection() {
  const { connected } = useWallet()
  return { connected }
}

