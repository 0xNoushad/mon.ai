import axios from 'axios';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;

export async function getUserTokens(walletAddress: string) {
  try {
    const response = await fetch(`/api/wallet/tokens?address=${walletAddress}`)
    if (!response.ok) throw new Error('Failed to fetch wallet tokens')
    const data = await response.json()
    return data.tokens // Assume the API returns an array of tokens with name and balance
  } catch (error) {
    console.error('Error fetching wallet tokens:', error)
    return []
  }
}
