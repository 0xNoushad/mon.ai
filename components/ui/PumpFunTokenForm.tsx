'use client'

import { useState } from 'react'
import { Button } from "components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useWallet } from '@solana/wallet-adapter-react'
import { TokenCreationResponse } from 'lib/types/tokens'

interface PumpFunTokenFormProps {
  onSuccess: (response: TokenCreationResponse) => void;
  onError: (error: string) => void;
}

export function PumpFunTokenForm({ onSuccess, onError }: PumpFunTokenFormProps) {
  const { publicKey } = useWallet()
  const [formData, setFormData] = useState({
    tokenName: '',
    tokenTicker: '',
    description: '',
    imageUrl: '',
    twitter: '',
    telegram: '',
    website: '',
    initialLiquiditySOL: '0.1',
    slippageBps: '5',
    priorityFee: '0.00005'
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey) {
      onError('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/token/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          address: publicKey.toBase58()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create token')
      }

      const result = await response.json()
      onSuccess(result)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to create token')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white border-2 border-black p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tokenName">Token Name</Label>
          <Input
            id="tokenName"
            value={formData.tokenName}
            onChange={(e) => setFormData({ ...formData, tokenName: e.target.value })}
            required
            className="border-2 border-black"
          />
        </div>
        <div>
          <Label htmlFor="tokenTicker">Token Ticker</Label>
          <Input
            id="tokenTicker"
            value={formData.tokenTicker}
            onChange={(e) => setFormData({ ...formData, tokenTicker: e.target.value })}
            required
            className="border-2 border-black"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="border-2 border-black"
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          required
          className="border-2 border-black"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="twitter">Twitter (optional)</Label>
          <Input
            id="twitter"
            value={formData.twitter}
            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
            className="border-2 border-black"
          />
        </div>
        <div>
          <Label htmlFor="telegram">Telegram (optional)</Label>
          <Input
            id="telegram"
            value={formData.telegram}
            onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
            className="border-2 border-black"
          />
        </div>
        <div>
          <Label htmlFor="website">Website (optional)</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="border-2 border-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="initialLiquiditySOL">Initial Liquidity (SOL)</Label>
          <Input
            id="initialLiquiditySOL"
            type="number"
            step="0.000001"
            value={formData.initialLiquiditySOL}
            onChange={(e) => setFormData({ ...formData, initialLiquiditySOL: e.target.value })}
            required
            className="border-2 border-black"
          />
        </div>
        <div>
          <Label htmlFor="slippageBps">Slippage (BPS)</Label>
          <Input
            id="slippageBps"
            type="number"
            value={formData.slippageBps}
            onChange={(e) => setFormData({ ...formData, slippageBps: e.target.value })}
            required
            className="border-2 border-black"
          />
        </div>
        <div>
          <Label htmlFor="priorityFee">Priority Fee (SOL)</Label>
          <Input
            id="priorityFee"
            type="number"
            step="0.000001"
            value={formData.priorityFee}
            onChange={(e) => setFormData({ ...formData, priorityFee: e.target.value })}
            required
            className="border-2 border-black"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#00FF00] text-black border-2 border-black hover:bg-[#00DD00]"
      >
        {isLoading ? 'Creating Token...' : 'Launch Token'}
      </Button>
    </form>
  )
}

