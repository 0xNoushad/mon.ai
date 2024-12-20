import { fetchWalletProfile } from './profile'
import { formatUSD, formatBalance } from './format'

interface WalletRoastData {
  balance: number
  totalValueUSD: number
  tokens: Array<{
    name: string
    symbol: string
    balance: number
    valueUSD: number
  }>
  transactionCount?: number
  nftCount?: number
  oldestTxTimestamp?: number
}

export async function generateWalletRoast(address: string): Promise<string> {
  try {
    const profile = await fetchWalletProfile(address)
    const roastData: WalletRoastData = {
      balance: profile.balance,
      totalValueUSD: profile.totalValueUSD,
      tokens: profile.tokens,
      transactionCount: profile.transactionCount,
      nftCount: profile.nftCount,
      oldestTxTimestamp: profile.oldestTxTimestamp
    }

    return createRoast(roastData)
  } catch (error) {
    console.error('Error generating roast:', error)
    return "This wallet is so mysterious, even the blockchain can't find it! 👻"
  }
}

function createRoast(data: WalletRoastData): string {
  // Create contextual roasts based on wallet data
  const roasts: string[] = []

  // Balance-based roasts
  if (data.balance === 0) {
    roasts.push("Your wallet is so empty, it's using SOL-itude as a coping mechanism! 🏜️")
  } else if (data.balance < 0.1) {
    roasts.push(`${formatBalance(data.balance)} SOL? I've seen more value in a fortune cookie! 🥠`)
  } else if (data.balance > 100) {
    roasts.push(`Whale alert! 🐋 But with those trading decisions, you won't be one for long!`)
  }

  // Value-based roasts
  if (data.totalValueUSD < 10) {
    roasts.push(`Portfolio worth ${formatUSD(data.totalValueUSD)}? Even my lunch costs more! 🍱`)
  } else if (data.totalValueUSD < 100) {
    roasts.push("Your portfolio wouldn't even get you backstage at a Solana hackathon! 🎫")
  }

  // Token-based roasts
  if (data.tokens.length === 0) {
    roasts.push("No tokens? Even my grandma has more tokens, and she thinks crypto is a type of coffee! ☕")
  } else if (data.tokens.length > 10) {
    roasts.push(`${data.tokens.length} different tokens? Collecting shitcoins like they're Pokemon cards! 🃏`)
  }

  // NFT-based roasts
  if (data.nftCount === 0) {
    roasts.push("No NFTs? Even right-clickers have a better collection! 🖱️")
  } else if (data.nftCount && data.nftCount > 50) {
    roasts.push(`${data.nftCount} NFTs? Someone's been aping into every mint since 2021! 🐒`)
  }

  // Add more specific roasts based on memcoins
  const memeCoinCount = data.tokens.filter(t => 
    t.name.toLowerCase().includes('pepe') || 
    t.name.toLowerCase().includes('doge') || 
    t.name.toLowerCase().includes('shib')
  ).length
  if (memeCoinCount > 0) {
    roasts.push(`${memeCoinCount} memecoins? Your portfolio is more of a joke than DOGE! 🃏`)
  }

  const genericRoasts = [
    "This wallet screams 'I watched one YouTube crypto tutorial'! 📺",
    "Your portfolio diversification strategy: hoping for airdrops! 🪂",
    "This wallet is so basic, it makes vanilla JavaScript look spicy! 🌶️",
    "Your transaction history reads like a 'What Not To Do in Crypto' guide! 📚"
  ]

  return roasts.length > 0 
    ? roasts[Math.floor(Math.random() * roasts.length)]
    : genericRoasts[Math.floor(Math.random() * genericRoasts.length)]
}

