import { PublicKey } from "@solana/web3.js";

export interface Creator {
  address: string;
  percentage: number;
}

export interface CollectionOptions {
  name: string;
  uri: string;
  royaltyBasisPoints?: number;
  creators?: Creator[];
}

export interface CollectionDeployment {
  collectionAddress: PublicKey;
  signature: Uint8Array;
}

export interface MintCollectionNFTResponse {
  mint: PublicKey;
  metadata: PublicKey;
}

export interface PumpFunTokenOptions {
  twitter?: string;
  telegram?: string;
  website?: string;
  initialLiquiditySOL?: number;
  slippageBps?: number;
  priorityFee?: number;
}

export interface PumpfunLaunchResponse {
  signature: string;
  mint: string;
  metadataUri?: string;
  error?: string;
}

export interface LuloAccountDetailsResponse {
  totalValue: number;
  interestEarned: number;
  realtimeApy: number;
  settings: {
    owner: string;
    allowedProtocols: string | null;
    homebase: string | null;
    minimumRate: string;
  };
}

export interface FetchPriceResponse {
  status: "success" | "error";
  tokenId?: string;
  priceInUSDC?: string;
  message?: string;
  code?: string;
}

export interface TokenCreationResponse {
  signature: string;
  mint: string;
  metadataUri: string;
}

export interface SolanaAgentKit {
  wallet_address: string;
  connection: any;
  wallet: any;
}

// New interfaces
export interface Token {
  amount: any;
  mint: string;
  name: string;
  symbol: string;
  balance: number;
  decimals: number;
}

export interface TokenWithPrice extends Token {
  priceInUSD: number;
  totalValueInUSD: number;
}

