# Deploy Contract via Remix IDE

Since the RPC endpoint is timing out, here's how to deploy using Remix IDE (browser-based):

## Step 1: Open Remix IDE

1. Go to https://remix.ethereum.org/
2. Wait for it to load completely

## Step 2: Create the Contract File

1. In the left sidebar, click on "contracts" folder (or create it if it doesn't exist)
2. Click the "+" button to create a new file
3. Name it: `ClaimableToken.sol`
4. Copy and paste the contract code from: `apps/contracts/contracts/ClaimableToken.sol`

## Step 3: Install OpenZeppelin Contracts

1. In Remix, go to the "File Explorer" tab
2. Click on "contracts" folder
3. Right-click and select "New Folder"
4. Name it: `@openzeppelin`
5. Inside that folder, create another folder: `contracts`
6. Inside `contracts`, create: `token/ERC20/ERC20.sol`
7. You can get the OpenZeppelin ERC20 contract from: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/token/ERC20/ERC20.sol

**OR** use the simpler approach:

1. In Remix, go to the "Solidity Compiler" tab
2. Click on "Advanced Configurations"
3. Enable "Auto compile" and "Optimization"
4. The compiler should handle imports automatically

## Step 4: Compile the Contract

1. Go to the "Solidity Compiler" tab (second icon from top)
2. Select compiler version: `0.8.28` (or closest available)
3. Click "Compile ClaimableToken.sol"
4. Check for any errors and fix them

## Step 5: Deploy to Celo Alfajores

1. Go to the "Deploy & Run Transactions" tab (third icon from top)
2. In "Environment", select "Injected Provider - MetaMask" (or your wallet)
3. Make sure your wallet is connected to **Celo Alfajores Testnet**
   - If not, add it: https://chainlist.org/?search=celo%20alfajores
4. Ensure you have testnet CELO for gas (get from: https://faucet.celo.org/alfajores)
5. Click "Deploy" button
6. Confirm the transaction in your wallet

## Step 6: Get the Contract Address

1. After deployment, the contract address will appear in the "Deployed Contracts" section
2. Click on the contract to expand it
3. Copy the contract address (starts with 0x...)

## Step 7: Update Your .env File

1. Open your `.env` file in the project root
2. Update the contract address:
   ```env
   NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS_HERE
   ```
3. Save the file

## Step 8: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd /home/alanyi/Downloads/Celo Hackathon/celo-app
pnpm dev
```

## Alternative: Use a Different RPC Endpoint

If you have access to a different RPC provider, you can add it to your `.env`:

```env
ALFAJORES_RPC_URL=https://your-rpc-endpoint-url
```

Then try deploying again:
```bash
cd apps/contracts
pnpm deploy:token:alfajores
```

