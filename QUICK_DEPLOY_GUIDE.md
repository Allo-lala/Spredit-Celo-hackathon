# Quick Deploy Guide - ClaimableToken Contract

## Step 1: Open Remix IDE
Go to: https://remix.ethereum.org/

## Step 2: Create the Contract File
1. In the left sidebar, click on the **"contracts"** folder
2. Click the **"+"** button to create a new file
3. Name it: **`ClaimableToken.sol`**
4. Copy and paste this code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ClaimableToken
 * @dev ERC20 token that allows users to claim 20 tokens once per wallet address
 */
contract ClaimableToken is ERC20 {
    // Mapping to track which addresses have already claimed
    mapping(address => bool) public hasClaimed;
    
    // Amount of tokens to claim (20 tokens with 18 decimals)
    uint256 public constant CLAIM_AMOUNT = 20 * 10**18;
    
    // Owner of the contract
    address public owner;
    
    // Events
    event TokensClaimed(address indexed user, uint256 amount);
    
    constructor() ERC20("Claimable Token", "CLAIM") {
        owner = msg.sender;
        // Mint initial supply to contract owner for distribution
        _mint(msg.sender, 1000000 * 10**18); // 1 million tokens
    }
    
    /**
     * @dev Allows users to claim 20 tokens once
     * @notice Users can only claim once per wallet address
     */
    function claimTokens() external {
        require(!hasClaimed[msg.sender], "Tokens already claimed for this address");
        
        hasClaimed[msg.sender] = true;
        _mint(msg.sender, CLAIM_AMOUNT);
        
        emit TokensClaimed(msg.sender, CLAIM_AMOUNT);
    }
    
    /**
     * @dev Check if an address has already claimed
     * @param _address The address to check
     * @return true if the address has claimed, false otherwise
     */
    function checkClaimStatus(address _address) external view returns (bool) {
        return hasClaimed[_address];
    }
}
```

## Step 3: Install OpenZeppelin (IMPORTANT!)

The contract uses OpenZeppelin's ERC20. In Remix:

1. Go to the **"Solidity Compiler"** tab (second icon from top)
2. Click on **"Advanced Configurations"** or look for **"Compiler Configuration"**
3. Enable **"Auto compile"**
4. In the compiler settings, you should see an option to manage imports
5. **OR** use the Remix plugin:
   - Go to **"Plugin Manager"** (bottom left)
   - Search for **"OpenZeppelin"** or **"Solidity Import Resolver"**
   - Install it
   - This will automatically resolve `@openzeppelin/contracts` imports

**Alternative**: If imports don't work automatically:
1. In Remix, go to **"File Explorer"**
2. Create folder structure: `@openzeppelin/contracts/token/ERC20/`
3. Create file `ERC20.sol` and copy from: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/token/ERC20/ERC20.sol
4. Also need: `IERC20.sol`, `IERC20Metadata.sol`, and `Context.sol` from OpenZeppelin

## Step 4: Compile
1. Go to **"Solidity Compiler"** tab
2. Select compiler version: **0.8.28** (or closest available like 0.8.20+)
3. Click **"Compile ClaimableToken.sol"**
4. Check for errors - if you see import errors, follow Step 3 above

## Step 5: Connect Wallet & Deploy
1. Go to **"Deploy & Run Transactions"** tab (third icon)
2. In **"Environment"**, select **"Injected Provider - MetaMask"** (or your wallet)
3. **IMPORTANT**: Make sure your wallet is connected to **Celo Alfajores Testnet**
   - If not in your wallet, add it:
     - Network Name: Celo Alfajores
     - RPC URL: https://alfajores-forno.celo-testnet.org
     - Chain ID: 44787
     - Currency Symbol: CELO
     - Block Explorer: https://alfajores.celoscan.io
4. Get testnet CELO from: https://faucet.celo.org/alfajores
5. In the deploy section, make sure **"ClaimableToken"** is selected (not "Owner"!)
6. Click **"Deploy"** button
7. Confirm the transaction in your wallet

## Step 6: Get Contract Address
1. After deployment, look in the **"Deployed Contracts"** section
2. You should see **"CLAIMABLETOKEN"** (not "Owner")
3. Click to expand it
4. Copy the contract address (starts with `0x...`)

## Step 7: Update .env File
Once you have the contract address, run:

```bash
cd /home/alanyi/Downloads/Celo Hackathon/celo-app
./update-contract-address.sh 0xYOUR_CONTRACT_ADDRESS_HERE
```

Or manually edit `.env`:
```env
NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS_HERE
```

## Step 8: Restart Dev Server
```bash
pnpm dev
```

## Troubleshooting

**If you see "Owner" contract instead:**
- Make sure you selected "ClaimableToken" in the deploy dropdown
- Delete the old "Owner" contract from Remix if it's confusing
- Recompile the ClaimableToken contract

**If imports fail:**
- Use the OpenZeppelin plugin in Remix
- Or manually copy the OpenZeppelin contracts into Remix

**If deployment fails:**
- Check you're on Celo Alfajores testnet (not mainnet!)
- Ensure you have testnet CELO for gas
- Check the Remix console for error messages

