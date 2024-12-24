import { TokenWithPrice, getUserTokens, getTokenPrices, filterLowValueTokens } from 'lib/utils/tokenUtils'
 

interface CommandResponse {
  content: string
  error?: boolean
  showSwapModal?: boolean
  showDustModal?: boolean
}

export async function handleCommand(input: string, userPublicKey?: string): Promise<CommandResponse> {
  // Handle @user command
  if (input.startsWith('@user')) {
    if (!userPublicKey) {
      return {
        content: "Please connect your wallet to use this command.",
        error: true
      }
    }
    try {
      const tokens = await getUserTokens(userPublicKey)
      const tokenPrices = await getTokenPrices(tokens)
      const totalValue = tokenPrices.reduce((sum, token) => sum + token.totalValueInUSD, 0)
      
      return {
        content: `Your wallet contains:
${tokenPrices.map(token => 
          `${token.name}: ${token.amount.toFixed(2)} (${token.priceInUSD > 0 ? '$' + token.totalValueInUSD.toFixed(2) : 'Price unavailable'})`
        ).join('\n')}

Total Portfolio Value: $${totalValue.toFixed(2)}`
      }
    } catch (error) {
      return {
        content: "Failed to fetch your wallet information.",
        error: true
      }
    }
  }

  // Handle @scan command
  if (input.startsWith('@scan')) {
    const address = input.split(' ')[1]
    if (!address) {
      return {
        content: "Please provide a wallet address to scan. Usage: @scan <address>",
        error: true
      }
    }
    try {
      const tokens = await getUserTokens(address)
      const tokenPrices = await getTokenPrices(tokens)
      return {
        content: `Wallet ${address.slice(0, 4)}...${address.slice(-4)} contains:
${tokenPrices.map(token => 
          `${token.name}: ${token.amount.toFixed(2)}`
        ).join('\n')}`
      }
    } catch (error) {
      return {
        content: "Failed to scan the provided wallet address.",
        error: true
      }
    }
  }

  // Handle @price command
  if (input.startsWith('@price')) {
    const symbol = input.split(' ')[1]
    if (!symbol) {
      return {
        content: "Please provide a token symbol to check price. Usage: @price <symbol>",
        error: true
      }
    }
    try {
      const tokens = userPublicKey ? await getUserTokens(userPublicKey) : []
      const token = tokens.find((t: { symbol: string }) => t.symbol.toLowerCase() === symbol.toLowerCase())
      if (!token) {
        return {
          content: `Could not find price information for ${symbol.toUpperCase()}`,
          error: true
        }
      }
      const tokenPrices = await getTokenPrices([token])
      const tokenWithPrice = tokenPrices[0]
      
      return {
        content: `${tokenWithPrice.name} (${tokenWithPrice.symbol})
Price: $${tokenWithPrice.priceInUSD.toFixed(2)}
Your Balance: ${tokenWithPrice.amount.toFixed(2)}
Total Value: $${tokenWithPrice.totalValueInUSD.toFixed(2)}`
      }
    } catch (error) {
      return {
        content: "Failed to fetch token price information.",
        error: true
      }
    }
  }

  // Handle @swap command
  if (input.startsWith('@swap')) {
    if (!userPublicKey) {
      return {
        content: "Please connect your wallet to use the swap feature.",
        error: true
      }
    }
    return {
      content: "Opening swap interface...",
      showSwapModal: true
    }
  }

  // Handle @dust command
  if (input.startsWith('@dust')) {
    if (!userPublicKey) {
      return {
        content: "Please connect your wallet to use the dust collection feature.",
        error: true
      }
    }
    return {
      content: "Opening dust collection interface...",
      showDustModal: true
    }
  }

  // If no command matched
  return {
    content: input
  }
}

