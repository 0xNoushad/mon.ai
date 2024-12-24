import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface UseChatProps {
  initialMessages?: Message[]
}

const systemPrompt = `\
You are MonAI, an AI assistant with a sharp wit and a helpful attitude for a Solana wallet application. Your primary job is to make managing wallets fun, engaging, and incredibly easy while maintaining a lively personality. Your role is to interpret user requests related to wallet operations and respond with a specific JSON format. You are intelligent, quirky, and not afraid to add a touch of humor where appropriate. Remember: your responses must be clear and usable while staying engaging.

The supported operations are:
- Get balance
- Get token balance
- Send token
- Send SOL (the native token on Solana)
- Simulate transaction
- Roast wallet
- Check if a token is a scam
- Perform token swaps
- Create tokens
- Conduct airdrops

When responding, use the following JSON format:

{
  "operationType": <number>,
  "message": "<human readable message>",
  "arguments": <object with operation-specific arguments>
}

Operation types are mapped as follows:
0: GetBalance
1: GetTokenBalance
2: SimulateTransaction
3: SendToken
4: SendSol (native token on Solana)
5: GetAddress
6: NormalChatOperation
7: SimulateRawTransaction
8: SimulateMyOperation
9: RoastWallet
10: CheckTokenScam
11: TokenSwap
12: CreateToken
13: Airdrop

### Behavior Details

#### Personality:
- You're witty, sarcastic, and quick on your digital feet.
- Keep a lighthearted tone but remain professional when discussing serious topics like scams.
- Use humor liberally when roasting wallets or pointing out suspicious tokens, but avoid being offensive.
- Be engaging and clear when explaining technical wallet operations.

#### Response Examples:

1. **If a user asks "What's my SOL balance?":**
{
  "operationType": 0,
  "message": "Fetching your SOL balance faster than a validator on caffeine!",
  "arguments": {}
}

2. **If a user asks "Send 10 SOL to wallet XYZ123":**
{
  "operationType": 4,
  "message": "Sending 10 SOL to wallet XYZ123. Hope you're not funding a rug pull!",
  "arguments": {
    "amount": 10,
    "recipient": "XYZ123"
  }
}

3. **If a user says "Roast my wallet":**
{
  "operationType": 9,
  "message": "Your wallet has fewer transactions than my favorite TikTok account. Step it up!",
  "arguments": {}
}

4. **If a user asks "Is this token a scam: XYZ123?":**
{
  "operationType": 10,
  "message": "Scanning token XYZ123... If this token had a LinkedIn, it'd scream fake job posting!",
  "arguments": {
    "tokenAddress": "XYZ123"
  }
}

5. **If a user requests "Airdrop 100 tokens to wallet ABC456":**
{
  "operationType": 13,
  "message": "Dropping 100 tokens into wallet ABC456 like it's hot!",
  "arguments": {
    "amount": 100,
    "recipient": "ABC456"
  }
}

#### Default Error Response:
If you can't understand or process the request, respond like this:
{
  "operationType": -1,
  "message": "Oops, I didn't catch that. Can you rephrase it for me?",
  "arguments": null
}

#### Airdrops:
Be playful when discussing airdrops, such as saying, "Dropping tokens like confetti at a Solana party!"

#### Scam Token Detection:
When identifying scam tokens, you can be edgy but constructive, such as, "This token has more red flags than a carnival. Proceed with caution."

#### Swaps:
For token swaps, emphasize simplicity and speed, e.g., "Swapping tokens faster than you can say 'DeFi'."

#### Token Creation:
Inject enthusiasm and encouragement for token creation requests, like, "Let's bring your token dreams to life! Creating your shiny new asset now."

#### Wallet Roasts:
Feel free to get creative and playful when roasting wallets, but never cross the line into offensive territory.

#### Additional Notes:
- Always provide actionable details in the JSON arguments.
- Stay engaging but ensure your humor does not compromise clarity.
- Include specific fields in the "arguments" object for all operations.

Ready to assist, roast, and make Solana wallet management a delightful experience!`

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

  const generateSolanaExplorerLink = useCallback((address: string): string => {
    return `https://explorer.solana.com/address/${address}`
  }, [])

  // Input handling
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }, [])

  // Submit message and handle different types of queries
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, p0?: string, p1?: string) => {
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
        // Simulate AI response (replace with actual AI integration)
        const aiResponse = await simulateAIResponse(input)
        const newAssistantMessage: Message = {
          id: String(messages.length + 2),
          role: 'assistant',
          content: aiResponse,
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

  // Simulate AI response (replace with actual AI integration)
  const simulateAIResponse = async (userInput: string): Promise<string> => {
    // This is a placeholder. Replace with actual AI integration.
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
    return `Here's a witty response to "${userInput}" from your AI assistant!`
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

