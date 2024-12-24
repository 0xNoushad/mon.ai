'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createGenericFileFromBrowserFile } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import {
  createAndMint,
  mplTokenMetadata,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
 
import { base58 } from '@metaplex-foundation/umi/serializers';
import { generateSigner } from '@metaplex-foundation/umi';

interface TokenCreatorProps {
  onClose: () => void;
}

export const TokenCreator: React.FC<TokenCreatorProps> = ({ onClose }) => {
  const wallet = useWallet();
  const [tokenName, setTokenName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [decimals, setDecimals] = useState<number>(9);
  const [tokenDescription, setTokenDescription] = useState('');
  const [metadataURL, setMetadataURL] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const createToken = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      alert('Please connect your wallet first.');
      return;
    }
  
    if (!tokenName || !symbol || quantity <= 0) {
      alert('Please fill all required fields correctly.');
      return;
    }
  
    setIsCreating(true);
  
    try {
      const umi = createUmi('https://api.devnet.solana.com')
        .use(walletAdapterIdentity(wallet))
        .use(mplTokenMetadata())
        .use(irysUploader({ address: 'https://devnet.irys.xyz' }));
  
      const mintSigner = generateSigner(umi);
  
      let metadataURI = metadataURL;
  
      if (!metadataURI && file) {
        const [uploadedURI] = await umi.uploader.upload([
          await createGenericFileFromBrowserFile(file),
        ]);
        metadataURI = uploadedURI;
      }

      const transaction = await createAndMint(umi, {
        name: tokenName,
        symbol,
        uri: metadataURI,
        decimals,
        amount: BigInt(quantity) * BigInt(10 ** decimals),
        tokenStandard: TokenStandard.Fungible,
        sellerFeeBasisPoints: {
          basisPoints: BigInt(0),
          identifier: '%',
          decimals: 2
        },
        mint: mintSigner,
      }).sendAndConfirm(umi);
  
      const txSignature = base58.deserialize(transaction.signature)[0];
      alert(`Token created successfully! Transaction ID: ${txSignature}`);
      onClose();
    } catch (error) {
      alert(`Error creating token: ${(error as Error).message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white border-2 border-black p-4 rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Create Token</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Fill out the form below to create your custom token. Provide a name, symbol, quantity, and other optional details.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Token Name</label>
          <input
            type="text"
            placeholder="Token Name"
            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Symbol</label>
          <input
            type="text"
            placeholder="Symbol"
            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Decimals</label>
          <input
            type="number"
            min="0"
            max="9"
            className="mt-1 block w-full border-2 border-gray-300 rounded-sm shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={decimals}
            onChange={(e) => setDecimals(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            placeholder="Description"
            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={tokenDescription}
            onChange={(e) => setTokenDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Metadata URL</label>
          <input
            type="text"
            placeholder="https://example.com/metadata.json"
            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={metadataURL}
            onChange={(e) => setMetadataURL(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload File</label>
          <input type="file" onChange={handleFileChange} className="mt-1" />
        </div>
      </div>
      <button
        className={`mt-4 w-full bg-green-500 text-white font-bold py-2 px-4 rounded ${
          isCreating ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isCreating}
        onClick={createToken}
      >
        {isCreating ? 'Creating...' : 'Create Token'}
      </button>
    </div>
  );
};

