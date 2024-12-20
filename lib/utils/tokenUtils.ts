// tokenUtils.ts
import { Token, TokenWithPrice } from '../types/tokens';

export async function getUserTokens(address: string): Promise<Token[]> {
  try {
    const response = await fetch(`/api/wallet/tokens?address=${address}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tokens');
    }
    const tokens: Token[] = await response.json();
    return tokens;
  } catch (error) {
    console.error('Error in getUserTokens:', error);
    return [];
  }
}

export async function getTokenPrices(tokens: Token[]): Promise<TokenWithPrice[]> {
  try {
    const tokenPrices = await Promise.all(
      tokens.map(async (token) => {
        try {
          const response = await fetch(`https://public-api.solscan.io/market/token/${token.mint}`);
          const priceData = await response.json();
          const priceInUSD = priceData?.priceUsdt || 0;

          return {
            ...token,
            priceInUSD,
            totalValueInUSD: priceInUSD * token.amount,
          };
        } catch (error) {
          console.error(`Error fetching price for token ${token.mint}:`, error);
          return {
            ...token,
            priceInUSD: 0,
            totalValueInUSD: 0,
          };
        }
      })
    );

    return tokenPrices;
  } catch (error) {
    console.error('Error in getTokenPrices:', error);
    return tokens.map((token) => ({
      ...token,
      priceInUSD: 0,
      totalValueInUSD: 0,
    }));
  }
}

export function filterLowValueTokens(tokens: TokenWithPrice[], threshold: number = 5) {
  return tokens.filter((token) => token.totalValueInUSD < threshold && token.amount > 0);
}

export type { TokenWithPrice };
