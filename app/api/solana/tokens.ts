import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { walletAddress } = await req.json();
  const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "getTokenAccountsByOwner",
    params: [
      walletAddress,
      { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
      { encoding: "jsonParsed" },
    ],
  };

  const response = await fetch(SOLANA_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  const tokens = data.result.value.map((account: any) => ({
    mint: account.account.data.parsed.info.mint,
    amount: account.account.data.parsed.info.tokenAmount.uiAmountString,
  }));

  return NextResponse.json(tokens);
}
