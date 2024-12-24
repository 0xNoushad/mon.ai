import { Connection } from "@solana/web3.js";
import { useEffect, useState } from "react";


export interface useNetworkConfiguration {
    networkName: string;
    rpcEndpoint: string;
  }

export function getConnection(networkSelected: string) {
    let connection: Connection;
    const RPC_URL = "https://api.mainnet.solana.com"; // Replace with the desired RPC URL

    if (networkSelected == "devnet") {
        connection = new Connection("https://api.devnet.solana.com", {
            commitment: "confirmed",
        });
    } else {
        connection = new Connection(
            RPC_URL,
            { commitment: "confirmed" }
        );
    }

    const [network, setNetwork] = useState<useNetworkConfiguration>({
        networkName: 'devnet',  
        rpcEndpoint: 'https://api.devnet.solana.com',  
      });
    
      useEffect(() => {
        
        const configuredNetwork = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
        const configuredEndpoint =
          process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.devnet.solana.com';
    
        setNetwork({
          networkName: configuredNetwork,
          rpcEndpoint: configuredEndpoint,
        });
      }, []);
    
     
  

    return connection;
};