import { 
    Connection, 
    Keypair, 
    PublicKey, 
    sendAndConfirmTransaction, 
    Transaction 
  } from '@solana/web3.js'
  import { 
    createInitializeMintInstruction,
    getMinimumBalanceForRentExemptMint,
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo
  } from '@solana/spl-token'
  
  interface CreateTokenParams {
    connection: Connection
    payer: Keypair
    mintAuthority: PublicKey
    freezeAuthority: PublicKey | null
    decimals: number
    amount?: number
    recipient?: PublicKey
  }
  
  interface TokenMetadata {
    name: string
    symbol: string
    description?: string
    image?: string
  }
  
  export async function createToken(
    params: CreateTokenParams,
    metadata?: TokenMetadata
  ): Promise<{ tokenMint: PublicKey; tokenAccount?: PublicKey }> {
    try {
      // Create the token mint
      const mint = await createMint(
        params.connection,
        params.payer,
        params.mintAuthority,
        params.freezeAuthority,
        params.decimals,
        undefined,
        undefined,
        TOKEN_PROGRAM_ID
      )
  
      console.log(`Token mint created: ${mint.toBase58()}`)
  
      // If amount and recipient are provided, mint initial tokens
      if (params.amount && params.recipient) {
        // Create or get the associated token account
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
          params.connection,
          params.payer,
          mint,
          params.recipient
        )
  
        // Mint the specified amount to the recipient
        await mintTo(
          params.connection,
          params.payer,
          mint,
          tokenAccount.address,
          params.mintAuthority,
          params.amount
        )
  
        console.log(`Minted ${params.amount} tokens to ${tokenAccount.address.toBase58()}`)
  
        return { tokenMint: mint, tokenAccount: tokenAccount.address }
      }
  
      return { tokenMint: mint }
    } catch (error) {
      console.error('Error creating token:', error)
      throw error
    }
  }
  
  // Helper function to estimate the cost of creating a token
  export async function estimateTokenCreationCost(
    connection: Connection,
    includeMetadata: boolean = false
  ): Promise<number> {
    try {
      const rentExemptMint = await getMinimumBalanceForRentExemptMint(connection)
      let totalCost = rentExemptMint
  
      // Add estimated transaction fee
      totalCost += 5000 // Base transaction fee
  
      // If including metadata, add estimated metadata account cost
      if (includeMetadata) {
        totalCost += await connection.getMinimumBalanceForRentExemption(MINT_SIZE)
      }
  
      return totalCost
    } catch (error) {
      console.error('Error estimating token creation cost:', error)
      throw error
    }
  }
  
  // Example usage:
  /*
  const connection = new Connection('https://api.mainnet-beta.solana.com')
  const payer = Keypair.generate() // In reality, this would be your wallet's keypair
  const mintAuthority = payer.publicKey
  const decimals = 9
  
  const tokenMetadata = {
    name: "My Token",
    symbol: "MYTKN",
    description: "My awesome token on Solana",
    image: "https://my-token-image.com/image.png"
  }
  
  const { tokenMint, tokenAccount } = await createToken(
    {
      connection,
      payer,
      mintAuthority,
      freezeAuthority: null,
      decimals,
      amount: 1000000000, // 1 token with 9 decimals
      recipient: payer.publicKey
    },
    tokenMetadata
  )
  */
  
  