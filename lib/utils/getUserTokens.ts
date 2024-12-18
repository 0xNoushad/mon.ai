import axios from 'axios';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;

export async function getUserTokens(walletAddress: string) {
  try {
    const response = await axios.get(`/api/wallet/tokens?address=${walletAddress}`);
    return response.data.tokens;  
  } catch (error) {
    console.error('Error fetching wallet tokens:', error);
    return [];
  }
}

