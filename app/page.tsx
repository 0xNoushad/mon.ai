'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { motion } from 'framer-motion'

const gridBackground = `
  repeating-linear-gradient(#e5e5e5 0 1px, transparent 1px 100%),
  repeating-linear-gradient(90deg, #e5e5e5 0 1px, transparent 1px 100%)
`

export default function Home() {
  const router = useRouter()
  const { connected } = useWallet()

  useEffect(() => {
    if (connected) {
      router.push('/chat')
    }
  }, [connected, router])

  return (
    <div className="min-h-screen flex items-center justify-center"
         style={{ 
           backgroundImage: gridBackground,
           backgroundSize: '20px 20px'
         }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-white border-2 border-black p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-4">Welcome to Theme A-16</h1>
        <p className="mb-6 text-lg">Connect your wallet to access your personal chat</p>
        <WalletMultiButton className="!bg-[#00FF00] !text-black !border-2 !border-black hover:!bg-[#00DD00] !rounded-full !px-6 !py-3 !text-lg !font-semibold !transition-all !duration-300" />
      </motion.div>
    </div>
  )
}

