import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { getUserTokens , getTokenPrices } from '../lib/utils/tokenUtils'
 

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface UseChatProps {
  initialMessages?: Message[]
}

export function useChat({ initialMessages = [] }: UseChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<{ id: string; messages: Message[] }[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const { publicKey } = useWallet()

  // Local storage sync for chat history
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

  // Question type detection
  const isWalletQuestion = useCallback((message: string): boolean => {
    const walletKeywords = ['balance', 'tokens', 'SOL', 'my wallet', 'assets', 'wallet', 'lamports']
    return walletKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword.toLowerCase())
    )
  }, [])

  const isTokenPriceQuestion = useCallback((message: string): boolean => {
    const tokenKeywords = ['price', 'value', 'worth', 'cost', 'token']
    return tokenKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword.toLowerCase())
    )
  }, [])

  const isRoastWalletRequest = useCallback((message: string): boolean => {
    const roastKeywords = ['roast', 'roast my wallet', 'make fun of my wallet']
    return roastKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword.toLowerCase())
    )
  }, [])

  // Utility functions
  const generateSolanaExplorerLink = useCallback((address: string): string => {
    return `https://explorer.solana.com/address/${address}`
  }, [])

  // Input handling
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }, [])

  // Submit message and handle different types of queries
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, _p0: string | undefined, p0?: string) => {
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
        } else if (isTokenPriceQuestion(input)) {
          if (!publicKey) {
            newAssistantMessage = {
              id: String(messages.length + 2),
              role: 'assistant',
              content: "To get token prices, please connect your wallet first.",
            }
          } else {
            const walletData = await getUserTokens(publicKey.toBase58())
            const tokenPrices = await getTokenPrices(walletData)
            newAssistantMessage = {
              id: String(messages.length + 2),
              role: 'assistant',
              content: `Here are the current prices for your tokens:\n\n${tokenPrices
                .map((token) => `${token.name}: $${token.priceInUSD.toFixed(2)} (Total value: $${token.totalValueInUSD.toFixed(2)})`)
                .join('\n')}`,
            }
          }
        } else if (isRoastWalletRequest(input)) {
          if (!publicKey) {
            newAssistantMessage = {
              id: String(messages.length + 2),
              role: 'assistant',
              content: "I can't roast your wallet if it's not connected. Connect your wallet first, then I'll give it a good roasting!",
            }
          } else {
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: 'Roast my wallet',
                address: publicKey.toBase58(),
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
              content: parsedResponse.operationType === 9
                ? `${parsedResponse.message}\n\nWant to share this roast? [Share on X](https://twitter.com/intent/tweet?text=${encodeURIComponent(`My wallet just got roasted: "${parsedResponse.message}" 🔥💀 #SolanaWalletRoast`)})`
                : "Sorry, I couldn't roast your wallet right now. Maybe it's too cool to roast?",
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

  // Chat history management
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

  // Share roast on X (Twitter)
  const shareOnX = (roast: string) => {
    const tweetText = encodeURIComponent(`My wallet just got roasted: "${roast}" 🔥💀 #SolanaWalletRoast`)
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`
    window.open(tweetUrl, '_blank')
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
    shareOnX,
  }
}