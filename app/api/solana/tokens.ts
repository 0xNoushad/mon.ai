import { NextApiRequest, NextApiResponse } from 'next'
import { Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Invalid wallet address' })
  }

  try {
    const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet.solana.com')
    const publicKey = new PublicKey(address)

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    })

    const tokens = tokenAccounts.value.map((accountInfo) => {
      const parsedInfo = accountInfo.account.data.parsed.info
      return {
        mint: parsedInfo.mint,
        amount: parsedInfo.tokenAmount.uiAmount,
        decimals: parsedInfo.tokenAmount.decimals,
      }
    })

    res.status(200).json(tokens)
  } catch (error) {
    console.error('Error fetching token accounts:', error)
    res.status(500).json({ error: 'Failed to fetch token accounts' })
  }
}
