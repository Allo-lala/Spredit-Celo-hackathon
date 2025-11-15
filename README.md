# celo-app

A Celo blockchain application with token claiming functionality called `Spredit` from `Spot (Sport) predictions `

A modern Celo blockchain application built with Next.js, TypeScript, and Turborepo. This app allows users to connect their wallet and claim 20 tokens once per wallet address using Composer Kit UI components.

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   PRIVATE_KEY=your_private_key_here
   NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
   ```
   
   Get a WalletConnect Project ID from [https://cloud.walletconnect.com](https://cloud.walletconnect.com)

3. Deploy the token contract to Celo Alfajores:
   ```bash
   cd apps/contracts
   pnpm deploy:token:alfajores
   ```
   
   After deployment, copy the contract address and update `NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS` in your `.env` file.

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

This is a monorepo managed by Turborepo with the following structure:

- `apps/web` - Next.js application with embedded UI components and utilities
- `apps/hardhat` - Smart contract development environment

## Available Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Lint all packages and apps
- `pnpm type-check` - Run TypeScript type checking

### Smart Contract Scripts

- `pnpm contracts:compile` - Compile smart contracts
- `pnpm contracts:test` - Run smart contract tests
- `pnpm contracts:deploy` - Deploy contracts to local network
- `pnpm contracts:deploy:alfajores` - Deploy to Celo Alfajores testnet
- `pnpm contracts:deploy:sepolia` - Deploy to Celo Sepolia testnet
- `pnpm contracts:deploy:celo` - Deploy to Celo mainnet

### Token Contract Deployment

- `pnpm contracts:deploy:token` - Deploy ClaimableToken to local network
- `pnpm contracts:deploy:token:alfajores` - Deploy ClaimableToken to Celo Alfajores testnet
- `pnpm contracts:deploy:token:sepolia` - Deploy ClaimableToken to Celo Sepolia testnet
- `pnpm contracts:deploy:token:celo` - Deploy ClaimableToken to Celo mainnet

## Features

- **Wallet Connection**: Connect wallet using Composer Kit Wallet component
- **Token Claiming**: Claim 20 tokens once per wallet address
- **Balance Display**: View your token balance in real-time
- **Mobile-Friendly**: Responsive design that works on all devices
- **One-Time Claim**: Prevents users from claiming multiple times

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Composer Kit (@composer-kit/ui)
- **Wallet Integration**: Wagmi + Viem + RainbowKit
- **Smart Contracts**: Hardhat with Viem
- **Token Standard**: ERC-20 (OpenZeppelin)
- **Monorepo**: Turborepo
- **Package Manager**: PNPM

## Contract Details

The `ClaimableToken` contract is an ERC-20 token that:
- Allows users to claim 20 tokens once per wallet address
- Tracks which addresses have already claimed
- Prevents duplicate claims
- Uses OpenZeppelin's ERC20 implementation for security

### 
cd "/home/alanyi/Downloads/Celo Hackathon/celo-app/apps/web" && pnpm dev