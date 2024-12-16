import React from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Message } from 'hooks/chat'

interface ChatHistorySidebarProps {
  chatHistory: { id: string; messages: Message[] }[]
  startNewChat: () => void
  loadChatFromHistory: (chatId: string) => void
  deleteChat: (chatId: string) => void
  showHistory: boolean
  currentChatId: string | null
}

const matrixBackground = `
  linear-gradient(rgba(0, 0,0, 0.1) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
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
    <div 
      className={`w-64 bg-[#f5f5f5] border-r border-gray-600 p-4 transition-all duration-300 ease-in-out ${showHistory ? 'translate-x-0' : '-translate-x-full'} fixed left-0 top-0 h-full z-10`} 
      style={{ backgroundImage: matrixBackground, backgroundSize: '20px 20px' }}
    >
      <h2 className="text-lg font-semibold mb-4 text-black">Chat History</h2>
      <button
        onClick={startNewChat}
        className="w-full bg-[#90EE90] text-black text-xs py-2 px-4 mb-4 rounded hover:bg-[#7CCD7C] transition-colors duration-200"
      >
        <PlusIcon className="h-4 w-4 inline-block mr-2" />
        New Chat
      </button>
      <div className="space-y-2 max-h-[calc(100vh-150px)] overflow-y-auto">
        {chatHistory.map((chat) => (
          <div key={chat.id} className="relative group">
            <button
              onClick={() => loadChatFromHistory(chat.id)}
              className={`w-full text-left text-xs py-2 px-4 hover:bg-[#90EE90] rounded transition-colors duration-200 bg-white bg-opacity-80 pr-8 ${
                chat.id === currentChatId ? 'bg-[#90EE90]' : ''
              }`}
            >
              {chat.messages[0].content.substring(0, 20)}...
            </button>
            <button
              onClick={() => deleteChat(chat.id)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <XMarkIcon className="h-4 w-4 text-gray-600 hover:text-red-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

