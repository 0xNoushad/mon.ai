import { useWallet } from '@solana/wallet-adapter-react'
import { useCallback } from 'react'

export const useSolanaWallet = () => {
  const { 
    connected,
    publicKey,
    signMessage,
    signTransaction,
    disconnect,
    select,
    wallets,
  } = useWallet()

  const connectWallet = useCallback(() => {
    if (wallets.length > 0 && !connected) {
      select(wallets[0].adapter.name)
    }
  }, [wallets, connected, select])

  const disconnectWallet = useCallback(async () => {
    if (disconnect) {
      await disconnect()
    }
  }, [disconnect])

  return {
    wallet: {
      publicKey,
      signMessage,
      signTransaction,
    },
    isConnected: connected,
    connectWallet,
    disconnectWallet,
  }
}

