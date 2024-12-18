'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Space_Mono } from 'next/font/google'
import { Message } from 'hooks/chat'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: '400',
})

interface ChatHistorySidebarProps {
  chatHistory: { id: string; messages: Message[] }[]
  startNewChat: () => void
  loadChatFromHistory: (chatId: string) => void
  deleteChat: (chatId: string) => void
  showHistory: boolean
  currentChatId: string | null
}

const gridBackground = `
  repeating-linear-gradient(#e5e5e5 0 1px, transparent 1px 100%),
  repeating-linear-gradient(90deg, #e5e5e5 0 1px, transparent 1px 100%)
`

export function ChatHistorySidebar({
  chatHistory,
  startNewChat,
  loadChatFromHistory,
  deleteChat,
  showHistory,
  currentChatId
}: ChatHistorySidebarProps) {
  return (
    <AnimatePresence>
      {showHistory && (
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`${spaceMono.className} w-64 bg-white border-r-2 border-black fixed left-0 top-0 h-full z-10`}
          style={{ 
            backgroundImage: gridBackground,
            backgroundSize: '20px 20px'
          }}
        >
          <div className="p-4 border-b-2 border-black">
            <h2 className="text-lg font-bold text-black mb-4">Chat History</h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startNewChat}
              className="w-full bg-[#00FF00] text-black text-sm py-2 px-4 border-2 border-black"
            >
              <PlusIcon className="h-4 w-4 inline-block mr-2" />
              New Chat
            </motion.button>
          </div>
          <div className="space-y-2 max-h-[calc(100vh-150px)] overflow-y-auto p-4">
            <AnimatePresence>
              {chatHistory.map((chat) => (
                <motion.div 
                  key={chat.id} 
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => loadChatFromHistory(chat.id)}
                    className={`w-full text-left text-xs py-2 px-4 border border-black transition-colors duration-200 ${
                      chat.id === currentChatId ? 'bg-[#00FF00]' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {chat.messages[0].content.substring(0, 20)}...
                  </motion.button>
                  <motion.button
                    
                  
                    onClick={() => deleteChat(chat.id)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  >
                    <XMarkIcon className="h-4 w-4 text-black hover:text-red-600" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

