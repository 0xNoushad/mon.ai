import { Connection, PublicKey } from '@solana/web3.js';
import { Jupiter } from '@jup-ag/core';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import JSBI from 'jsbi';

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com';
const connection = new Connection(RPC_ENDPOINT);

export interface TokenBalance {
  mint: string;
  name: string;
  symbol: string;
  logoURI: string;
  balance: number;
  decimals: number;
  priceUSD: number;
  valueUSD: number;
}

async function getTokenMap(): Promise<Map<string, TokenInfo>> {
  const tokens = await new TokenListProvider().resolve();
  const tokenList = tokens.filterByClusterSlug('mainnet-beta').getList();
  return new Map(tokenList.map((token) => [token.address, token]));
}

export async function getUserTokens(walletAddress: string): Promise<TokenBalance[]> {
  const publicKey = new PublicKey(walletAddress);
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: TOKEN_PROGRAM_ID,
  });

  const jupiter = await Jupiter.load({
    connection,
    cluster: 'mainnet-beta',
    user: publicKey,
  });

  const tokenMap = await getTokenMap();
  const tokenBalances: TokenBalance[] = [];

  for (const { account } of tokenAccounts.value) {
    const parsedInfo = account.data.parsed.info;
    const mintAddress = parsedInfo.mint;
    const balance = parsedInfo.tokenAmount.uiAmount;

    if (balance === 0) continue;

    const tokenInfo = tokenMap.get(mintAddress) as TokenInfo;
    if (!tokenInfo) continue;

    const { symbol, name, logoURI } = tokenInfo;
    const decimals = parsedInfo.tokenAmount.decimals;

    let priceUSD = 0;
    try {
      const routes = await jupiter.computeRoutes({
        inputMint: new PublicKey(mintAddress),
        outputMint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // USDC mint
        amount: JSBI.BigInt(1_000_000), // 1 token
        slippageBps: 1,
      });

      if (routes.routesInfos.length > 0) {
        priceUSD = Number(routes.routesInfos[0].outAmount) / 1_000_000; // Convert to USD
      }
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
    }

    const valueUSD = balance * priceUSD;

    tokenBalances.push({
      mint: mintAddress,
      name: name || '',
      symbol: symbol || '',
      logoURI: logoURI || '',
      balance: balance || 0,
      decimals: decimals || 0,
      priceUSD: priceUSD || 0,
      valueUSD: valueUSD || 0,
    });
  }

  return tokenBalances;
}
