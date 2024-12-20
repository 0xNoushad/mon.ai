'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { getUserTokens , getTokenPrices } from 'lib/utils/tokenUtils'
 
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

interface WalletInfoBoxProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletInfoBox({ isOpen, onClose }: WalletInfoBoxProps) {
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [tokens, setTokens] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAccountInfo() {
      if (publicKey && connected) {
        setIsLoading(true)
        setError(null)
        try {
          // Fetch SOL balance
          const balance = await connection.getBalance(publicKey)
          setBalance(balance / LAMPORTS_PER_SOL)

          // Fetch token balances
          const walletTokens = await getUserTokens(publicKey.toBase58())
          const tokenPrices = await getTokenPrices(walletTokens)
          setTokens(tokenPrices)
        } catch (error) {
          console.error('Error fetching account info:', error)
          setError('Failed to fetch account information. Please try again.')
        } finally {
          setIsLoading(false)
        }
      } else {
        setBalance(null)
        setTokens([])
      }
    }

    fetchAccountInfo()
  }, [publicKey, connected, connection])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full w-64 bg-white border-l-2 border-black z-20 overflow-y-auto"
        >
          <div className="p-4 border-b-2 border-black flex justify-between items-center">
            <h2 className="text-lg font-bold text-black">Wallet Info</h2>
            <button onClick={onClose} className="text-black hover:text-gray-700">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="p-4">
            {!connected ? (
              <div className="text-center">
                <p className="mb-4">Connect your wallet to view information.</p>
                <WalletMultiButton className="!bg-[#00FF00] !text-black !border-2 !border-black hover:!bg-[#00DD00] !w-full" />
              </div>
            ) : isLoading ? (
              <p className="text-center">Loading wallet info...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-black p-2">
                  <p className="font-bold">SOL Balance</p>
                  <p>{balance !== null ? `${balance.toFixed(4)} SOL` : 'N/A'}</p>
                </div>
                {tokens.length === 0 ? (
                  <p className="text-center">No other tokens found in your wallet.</p>
                ) : (
                  tokens.map((token, index) => (
                    <div key={index} className="border-2 border-black p-2">
                      <p className="font-bold">{token.name}</p>
                      <p>Amount: {token.amount.toFixed(2)}</p>
                      <p>Price: ${token.priceInUSD.toFixed(2)}</p>
                      <p>Total Value: ${token.totalValueInUSD.toFixed(2)}</p>
                    </div>
                  ))
                )}
              </div>
            )}
            <div className="mt-4 items-center">
              <WalletMultiButton className="!bg-[#00FF00] !text-black !border-2 !border-black hover:!bg-[#00DD00] !w-full" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}