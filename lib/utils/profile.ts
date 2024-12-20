import { Connection, PublicKey } from '@solana/web3.js'
import { getUserTokens, getTokenPrices } from 'lib/utils/tokenUtils'

export interface WalletProfile {
  nfts: any
  transactionCount: number | undefined
  nftCount: number | undefined
  oldestTxTimestamp: number | undefined
  metadata?: any
  address: string
  balance: number
  tokens: TokenInfo[]
  totalValueUSD: number
}

interface TokenInfo {
  mint: string
  name: string
  symbol: string
  balance: number
  priceUSD: number
  valueUSD: number
}

export async function fetchWalletProfile(address: string): Promise<WalletProfile> {
  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com')
  const publicKey = new PublicKey(address)

  // Fetch SOL balance
  const balance = await connection.getBalance(publicKey)

  // Fetch user tokens
  const userTokens = await getUserTokens(address)

  // Fetch token prices
  const tokenPrices = await getTokenPrices(userTokens)

  // Calculate total value and create TokenInfo array
  let totalValueUSD = 0
  const tokens: TokenInfo[] = tokenPrices.map(token => {
    const valueUSD = token.priceInUSD * token.balance
    totalValueUSD += valueUSD
    return {
      mint: token.mint,
      name: token.name,
      symbol: token.symbol,
      balance: token.balance,
      priceUSD: token.priceInUSD,
      valueUSD
    }
  })

  // Add SOL to the total value
  const solPriceUSD = await fetchSolPrice()
  const solValueUSD = (balance / 1e9) * solPriceUSD
  totalValueUSD += solValueUSD

  return {
    metadata: {},  
    address,
    balance: balance / 1e9,  
    tokens,
    nfts: [],  
    totalValueUSD,
    transactionCount: 0,  
    nftCount: 0,  
    oldestTxTimestamp: 0  
  }
    totalValueUSD
  }


async function fetchSolPrice(): Promise<number> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
    const data = await response.json()
    return data.solana.usd
  } catch (error) {
    console.error('Error fetching SOL price:', error)
    return 0
  }
}

export function generateExplorerLink(address: string): string {
  return `https://explorer.solana.com/address/${address}`
}

export function formatBalance(balance: number, decimals: number = 4): string {
  return balance.toFixed(decimals)
}

export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

