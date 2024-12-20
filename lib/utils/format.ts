export function formatUSD(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }
  
  export function formatBalance(value: number): string {
    if (value === 0) return '0'
    if (value < 0.001) return '<0.001'
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3
    }).format(value)
  }
  
  