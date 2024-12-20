'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperAirplaneIcon, Bars3Icon, WalletIcon } from '@heroicons/react/24/solid'
import { Space_Mono } from 'next/font/google'
import { useChat } from 'hooks/chat'
import { ChatHistorySidebar } from 'components/ui/ChatHistorySidebar'
import SpiralLoader from 'components/ui/loader'
import { WalletInfoBox } from 'components/ui/WalletInfoBox'
import { ClientWalletMultiButton } from 'components/ui/ClientWalletMultiButton'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: '400',
})

const suggestedActions = [
  "Tell me about dreams",
  "Explore consciousness",
  "Discuss reality perception",
  "Analyze dream symbolism",
  "Roast my wallet",
]

const gridBackground = `
  repeating-linear-gradient(#e5e5e5 0 1px, transparent 1px 100%),
  repeating-linear-gradient(90deg, #e5e5e5 0 1px, transparent 1px 100%)
`

export default function ChatInterface() {
  const { publicKey, connected } = useWallet()
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    startNewChat,
    chatHistory,
    loadChatFromHistory,
    deleteChat,
  } = useChat({
    initialMessages: [],
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [showWalletInfo, setShowWalletInfo] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const renderMessageContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        if (part.includes('twitter.com/intent/tweet')) {
          return (
            <button
              key={index}
              onClick={() => window.open(part, '_blank')}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Share on X
            </button>
          );
        }
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleSubmitWrapper = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await handleSubmit(event, publicKey ? publicKey.toBase58() : undefined)
  }

  if (!connected) {
    return (
      <div className={`min-h-screen ${spaceMono.className} bg-white flex items-center justify-center`}
           style={{ 
             backgroundImage: gridBackground,
             backgroundSize: '20px 20px'
           }}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center bg-white border-2 border-black p-8"
        >
          <p className="text-xl mb-4 text-black">Connect wallet to continue</p>
          <ClientWalletMultiButton className="!bg-[#00FF00] !text-black !border-2 !border-black hover:!bg-[#00DD00]" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${spaceMono.className} bg-white`}
         style={{ 
           backgroundImage: gridBackground,
           backgroundSize: '20px 20px'
         }}>
      <ChatHistorySidebar
        chatHistory={chatHistory}
        startNewChat={startNewChat}
        loadChatFromHistory={loadChatFromHistory}
        deleteChat={deleteChat}
        showHistory={showHistory}
        currentChatId={null}
      />

      <WalletInfoBox 
        isOpen={showWalletInfo} 
        onClose={() => setShowWalletInfo(false)}
      />

      <div className="flex-1 transition-all duration-300 ease-in-out"
           style={{ marginLeft: showHistory ? '256px' : '0' }}>
        <div className="max-w-3xl mx-auto">
          <div className="min-h-screen relative">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white border-b-2 border-black flex justify-between items-center sticky top-0 z-10"
            >
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 hover:bg-gray-100 transition-colors duration-200"
                >
                  <Bars3Icon className="h-6 w-6 text-black" />
                </motion.button>
                <h1 className="text-xl font-bold text-black">Theme A-16</h1>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWalletInfo(!showWalletInfo)}
                className="p-2 hover:bg-gray-100 transition-colors duration-200"
              >
                <WalletIcon className="h-6 w-6 text-black" />
              </motion.button>
            </motion.div>

            <div className="space-y-4 p-6 pb-32">
              <AnimatePresence>
                {messages.map((msg: { role: string; content: string }, index: React.Key | null | undefined) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`relative max-w-[85%] ${msg.role === 'assistant' ? 'ml-auto' : ''}`}
                  >
                    <div
                      className={`
                        relative p-4 border border-black overflow-hidden
                        ${msg.role === 'assistant' 
                          ? 'bg-[#00FF00]' 
                          : 'bg-gray-100'}
                      `}
                    >
                      <p className="text-sm text-black break-words">{renderMessageContent(msg.content)}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <div className="flex justify-center">
                  <SpiralLoader size={30} color="#00FF00" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-24 left-0 right-0 px-4"
              style={{ display: messages.length === 0 ? 'block' : 'none' }}
            >
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedActions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInputChange({ target: { value: action } } as React.ChangeEvent<HTMLInputElement>)}
                      className="bg-white text-sm py-2 px-4 border-2 border-black hover:bg-gray-50 transition-colors duration-200"
                    >
                      {action}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-6 left-0 right-0 px-4"
            >
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmitWrapper} className="relative">
                  <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="w-full bg-white text-sm px-4 py-3 pr-12 border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#00FF00] focus:border-black"
                    disabled={isLoading}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
                    disabled={isLoading}
                  >
                    <PaperAirplaneIcon className="h-5 w-5 text-black" />
                  </motion.button>
                </form>
              </div></motion.div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed bottom-32 left-4 right-4"
                >
                  <div className="max-w-3xl mx-auto">
                    <div className="bg-red-50 border-2 border-red-500 text-red-600 text-sm p-3">
                      {error}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

