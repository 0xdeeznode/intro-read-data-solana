import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import fetch from 'node-fetch';



// Main Function 
async function main() {
    let suppliedPublicKey = process.argv[2];
    if (!suppliedPublicKey) {
        throw new Error("Provide a public key or domain to check the balance of!");
    }
    
    // Resolve domain if suppliedPublicKey is a .sol domain
    if (suppliedPublicKey.endsWith('.sol')) {
        try {
            suppliedPublicKey = await resolveDomain(suppliedPublicKey);
            console.log(`Resolved domain to public key: ${suppliedPublicKey}`);
        } catch (error) {
          console.error(`Error resolving domain: ${error.message}`);
          return;
        }
    } else {
        let publicKey: PublicKey;
        try {
            publicKey = new PublicKey(suppliedPublicKey);
            console.log("Objectifying your Public Key ...")
            const balance = await checkBalance(publicKey);
            console.log(`✅ Finished! The balance for the wallet at address ${publicKey} is ${balance} SOL !`)
        } catch (error) {
            console.error("Invalid public key provided!");
            process.exit(1); // Exit the process with an error code
        }
    }
}

// Function to resolve .sol domains
async function resolveDomain(domain: string): Promise<string> {
    const response = await fetch(`https://solana-name-service.xyz/api/v1/resolve/${domain}`);
    if (!response.ok) {
        throw new Error(`Failed to resolve domain: ${domain}`);
    }
    const data = await response.json();
    return data.address;
}

// Function to check Balance and convert to SOl
async function checkBalance(publicKey: PublicKey) {
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    console.log('Stablishing connection with Solana mainnet')
    let balanceInLamports: any;
    try {
        balanceInLamports = await connection.getBalance(publicKey);
        return (balanceInLamports / LAMPORTS_PER_SOL);
    } catch (error) {
        console.error("Failed to fetch balance:", error);
        process.exit(1); // Exit the process with an error code
    }
}


main().catch(err => console.error(err));