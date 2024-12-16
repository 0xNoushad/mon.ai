import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { inputMint, outputMint, amount } = await req.json();
  
  const JUPITER_API = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}`;
  const response = await fetch(JUPITER_API);
  const data = await response.json();

  return NextResponse.json({
    inAmount: data.inAmount / 1e6, // Adjust decimals
    outAmount: data.outAmount / 1e6,
    quote: data,
  });
}
