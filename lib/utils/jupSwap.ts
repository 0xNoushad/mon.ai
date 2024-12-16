export async function fetchSwapQuote(inputMint: string, outputMint: string, amount: string) {
    const JUPITER_API = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}`;
    const response = await fetch(JUPITER_API);
    return await response.json();
  }
  