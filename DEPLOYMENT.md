# Deployment Instructions

## Issue: RPC Connection Timeout

If you're experiencing connection timeout errors when deploying, try these solutions:

## Solution 1: Use a Custom RPC Endpoint

1. Get a free RPC endpoint from one of these services:
   - **Alchemy**: https://www.alchemy.com/ (Free tier available)
   - **Infura**: https://www.infura.io/ (Free tier available)
   - **QuickNode**: https://www.quicknode.com/ (Free tier available)

2. Add the RPC URL to your `.env` file:
   ```env
   ALFAJORES_RPC_URL=https://your-rpc-endpoint-url
   ```

3. Deploy again:
   ```bash
   cd apps/contracts
   pnpm deploy:token:alfajores
   ```

## Solution 2: Manual Deployment Steps

If RPC endpoints are not accessible, you can:

1. **Deploy using Remix IDE** (Browser-based):
   - Go to https://remix.ethereum.org/
   - Create a new file and paste the `ClaimableToken.sol` contract
   - Compile the contract
   - Deploy to Celo Alfajores using MetaMask or another wallet
   - Copy the deployed contract address

2. **Update your .env file**:
   ```bash
   ./update-contract-address.sh 0xYOUR_CONTRACT_ADDRESS
   ```
   Or manually edit `.env` and set:
   ```env
   NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
   ```

## Solution 3: Check Network/Firewall

- Ensure your network allows connections to RPC endpoints
- Try using a VPN if your network blocks these connections
- Check if you're behind a corporate firewall

## After Deployment

Once you have the contract address:

1. Update `.env` with the contract address
2. Restart your Next.js dev server:
   ```bash
   pnpm dev
   ```

## Getting Testnet CELO

If you need testnet CELO for gas fees:
- Celo Faucet: https://faucet.celo.org/alfajores
- You'll need testnet CELO in the wallet associated with your PRIVATE_KEY

