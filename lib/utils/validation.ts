export const validateSolanaAddress = (address: string): boolean => {
  
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  };
  
  export const validateTransactionHash = (hash: string): boolean => {
 
    return /^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(hash);
  };
  
  export const getChainType = (address: string): 'solana' | 'ethereum' | 'invalid' => {
    if (address.startsWith('0x')) return 'ethereum';
    if (validateSolanaAddress(address)) return 'solana';
    return 'invalid';
  };