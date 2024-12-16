import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { getUserTokens } from '../lib/utils/getUserTokens'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface UseChatProps {
  initialMessages: Message[]
}

export function useChat({ initialMessages }: UseChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<{ id: string; messages: Message[] }[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const { publicKey } = useWallet()

  useEffect(() => {
    if (publicKey) {
      const storedHistory = localStorage.getItem(`chatHistory_${publicKey.toBase58()}`)
      if (storedHistory) {
        setChatHistory(JSON.parse(storedHistory))
      }
    }
  }, [publicKey])

  useEffect(() => {
    if (publicKey && chatHistory.length > 0) {
      localStorage.setItem(`chatHistory_${publicKey.toBase58()}`, JSON.stringify(chatHistory))
    }
  }, [chatHistory, publicKey])

  const isWalletQuestion = (message: string): boolean => {
    const walletKeywords = ['balance', 'tokens', 'SOL', 'my wallet', 'assets']
    return walletKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  const generateSolanaExplorerLink = (address: string): string => {
    return `https://explorer.solana.com/address/${address}`
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (input.trim()) {
      const newUserMessage: Message = {
        id: String(messages.length + 1),
        role: 'user',
        content: input,
      }
      setMessages([...messages, newUserMessage])
      setInput('')
      setIsLoading(true)
      setError(null)

      try {
        let newAssistantMessage: Message

        if (isWalletQuestion(input)) {
          if (!publicKey) {
            newAssistantMessage = {
              id: String(messages.length + 2),
              role: 'assistant',
              content: "It seems like your wallet isn't connected. Please connect your wallet to check its details.",
            }
          } else {
            const walletData = await getUserTokens(publicKey.toBase58())
            const explorerLink = generateSolanaExplorerLink(publicKey.toBase58())
            newAssistantMessage = {
              id: String(messages.length + 2),
              role: 'assistant',
              content:
                walletData && walletData.length > 0
                  ? `Here are your tokens:\n\n${walletData
                      .map((token: any) => `${token.name}: ${token.balance}`)
                      .join('\n')}\n\nYou can view more details on Solana Explorer: ${explorerLink}`
                  : `Your wallet appears to have no tokens or assets. You can view your wallet on Solana Explorer: ${explorerLink}`,
            }
          }
        } else {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: input,
              address: publicKey ? publicKey.toBase58() : '',
            }),
          })

          if (!response.ok) {
            throw new Error('Failed to get response from the model')
          }

          const responseData = await response.json()
          const parsedResponse = JSON.parse(responseData.content)

          newAssistantMessage = {
            id: String(messages.length + 2),
            role: 'assistant',
            content: parsedResponse.message || "Sorry, I couldn't generate a response.",
          }
        }

        const updatedMessages = [...messages, newUserMessage, newAssistantMessage]
        setMessages(updatedMessages)
        updateChatHistory(updatedMessages)
      } catch (error) {
        console.error('Error:', error)
        setError('An error occurred while fetching the response. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const startNewChat = () => {
    if (messages.length > 0) {
      updateChatHistory(messages)
    }
    const newChatId = Date.now().toString()
    setCurrentChatId(newChatId)
    setMessages([])
    setInput('')
    setError(null)
  }

  const updateChatHistory = (newMessages: Message[]) => {
    const chatId = currentChatId || Date.now().toString()
    setChatHistory((prevHistory) => {
      const existingChatIndex = prevHistory.findIndex((chat) => chat.id === chatId)
      if (existingChatIndex !== -1) {
        const updatedHistory = [...prevHistory]
        updatedHistory[existingChatIndex] = { id: chatId, messages: newMessages }
        return updatedHistory
      } else {
        return [{ id: chatId, messages: newMessages }, ...prevHistory]
      }
    })
    setCurrentChatId(chatId)
  }

  const loadChatFromHistory = (chatId: string) => {
    const selectedChat = chatHistory.find((chat) => chat.id === chatId)
    if (selectedChat) {
      setMessages(selectedChat.messages)
      setCurrentChatId(chatId)
    }
  }

  const deleteChat = (chatId: string) => {
    setChatHistory((prevHistory) => prevHistory.filter((chat) => chat.id !== chatId))
    if (chatId === currentChatId) {
      startNewChat()
    }
  }

  return {
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
    currentChatId,
  }
}

