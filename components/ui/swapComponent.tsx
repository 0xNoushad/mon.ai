'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { swapSolToToken } from 'lib/utils/jup';
import { USDC_MINT, SOL_MINT } from 'lib/utils/jup';

interface SwapComponentProps {
  onClose: () => void;
}

export function SwapComponent({ onClose }: SwapComponentProps) {
  const [amount, setAmount] = useState('');
  const [fromToken, setFromToken] = useState(SOL_MINT);
  const [toToken, setToToken] = useState(USDC_MINT);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = async () => {
    const amountInSol = parseFloat(amount);
    if (isNaN(amountInSol) || amountInSol <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsSwapping(true);
    setStatusMessage('Processing swap...');
    
    try {
      const result = await swapSolToToken(amountInSol, toToken);
      if (result.status === 'success') {
        setStatusMessage(`Swap successful! Signature: ${result.signature}`);
        alert(`Swap successful! Signature: ${result.signature}`);
        onClose();
      } else {
        setStatusMessage(`Swap failed: ${result.message}`);
        alert(`Swap failed: ${result.message}`);
      }
    } catch (error) {
      setStatusMessage('An error occurred during the swap.');
      console.error('Error during swap:', error);
      alert('An error occurred during the swap.');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border-2 border-black p-4 rounded-lg shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Swap Tokens</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
      <div className="space-y-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <div className="flex space-x-2">
          <select
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
            className="flex-1 border border-gray-300 p-2 rounded"
          >
            <option value={SOL_MINT}>SOL</option>
            <option value={USDC_MINT}>USDC</option>
          </select>
          <select
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            className="flex-1 border border-gray-300 p-2 rounded"
          >
            <option value={USDC_MINT}>USDC</option>
            <option value={SOL_MINT}>SOL</option>
          </select>
        </div>
        <button
          onClick={handleSwap}
          disabled={isSwapping}
          className={`w-full bg-[#00FF00] text-black border-2 border-black p-2 rounded hover:bg-[#00DD00] transition-colors duration-200 ${
            isSwapping ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSwapping ? 'Swapping...' : 'Swap'}
        </button>
        <div className="mt-4 text-sm text-gray-700">
          {statusMessage}
        </div>
      </div>
    </motion.div>
  );
}

