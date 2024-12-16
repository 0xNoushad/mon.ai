'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PaperAirplaneIcon, Bars3Icon } from '@heroicons/react/24/solid'
import { IBM_Plex_Mono } from 'next/font/google'
import { useChat } from 'hooks/chat'
import { ChatHistorySidebar } from 'components/ui/ChatHistorySidebar'

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '400',
})

const suggestedActions = [
  "Tell me about dreams",
  "Explore consciousness",
  "Discuss reality perception",
  "Analyze dream symbolism",
]

const matrixBackground = `
  linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
`

export default function ChatInterface() {
  const { publicKey } = useWallet()
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!publicKey) {
    return (
      <div className={`min-h-screen ${mono.className} bg-[#f5f5f5] flex items-center justify-center`} style={{ backgroundImage: matrixBackground, backgroundSize: '20px 20px' }}>
        <div className="text-center bg-white p-6 rounded-lg shadow-lg">
          <p className="text-xl mb-4">Please connect your wallet to start chatting.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${mono.className} bg-[#f5f5f5] flex`} style={{ backgroundImage: matrixBackground, backgroundSize: '20px 20px' }}>
      <ChatHistorySidebar
        chatHistory={chatHistory}
        startNewChat={startNewChat}
        loadChatFromHistory={loadChatFromHistory}
        deleteChat={deleteChat}
        showHistory={showHistory} currentChatId={null}      />

      {/* Main Chat Area */}
      <div className="flex-1 transition-all duration-300 ease-in-out" style={{ marginLeft: showHistory ? '256px' : '0' }}>
        <div className="max-w-3xl mx-auto">
          <div className="min-h-screen relative overflow-hidden">
            {/* Theme Label */}
            <div className="p-4 text-xs text-black border-b border-gray-600 flex justify-between items-center bg-white bg-opacity-80">
              <div className="flex items-center">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="mr-4 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                >
                  <Bars3Icon className="h-5 w-5 text-gray-600" />
                </button>
                <div>mon.ai v1</div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4 p-4 pb-32">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`
                    relative max-w-[85%] text-xs leading-5
                    ${msg.role === 'assistant' ? 'ml-auto' : ''}
                  `}
                >
                  <div
                    className={`
                      relative overflow-hidden
                      ${msg.role === 'assistant' 
                        ? 'bg-[#90EE90] text-black border-black' 
                        : 'bg-white text-black border-gray-600'}
                      p-3 border
                    `}
                    style={{
                      clipPath: msg.role === 'assistant' 
                        ? 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' 
                        : 'polygon(0 0, 100% 0, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                    }}
                  >
                    <div className="relative z-10 font-mono">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-center">
                  <div className="inline-block h-4 w-4 animate-pulse bg-[#90EE90]"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="fixed bottom-16 left-0 right-0 px-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleInputChange({ target: { value: action } } as React.ChangeEvent<HTMLInputElement>)}
                      className="bg-white hover:bg-[#90EE90] text-black text-xs py-1 px-2
                               border border-gray-600 transition-colors duration-200"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Form */}
            <div className="fixed bottom-4 left-0 right-0 px-4">
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit}>
                  <div className="relative">
                    <input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Type your message..."
                      className="w-full bg-white text-black text-xs
                               px-3 py-2 pr-10
                               border border-gray-600
                               focus:outline-none focus:ring-1 focus:ring-[#90EE90] focus:border-[#90EE90]
                               placeholder:text-gray-400"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      disabled={isLoading}
                    >
                      <PaperAirplaneIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {error && (
              <div className="fixed bottom-24 left-4 right-4">
                <div className="max-w-3xl mx-auto">
                  <div className="bg-red-100 border border-red-400 text-red-700 text-xs p-2">
                    {error}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

