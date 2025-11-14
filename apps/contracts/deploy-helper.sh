#!/bin/bash
# Deployment helper script for ClaimableToken

echo "🚀 ClaimableToken Deployment Helper"
echo "===================================="
echo ""

# Check if .env file exists
if [ ! -f "../../.env" ]; then
    echo "❌ Error: .env file not found in project root"
    exit 1
fi

# Load environment variables
export $(cat ../../.env | grep -v '^#' | xargs)

# Check if PRIVATE_KEY is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not found in .env file"
    exit 1
fi

echo "✅ Environment variables loaded"
echo ""

# Check if custom RPC URL is set
if [ -z "$ALFAJORES_RPC_URL" ]; then
    echo "⚠️  No custom RPC URL set. Using default: https://alfajores-forno.celo-testnet.org"
    echo "💡 Tip: If you experience connection timeouts, set ALFAJORES_RPC_URL in .env"
    echo "   You can get a free RPC endpoint from:"
    echo "   - Alchemy: https://www.alchemy.com/"
    echo "   - Infura: https://www.infura.io/"
    echo "   - QuickNode: https://www.quicknode.com/"
    echo ""
fi

echo "📦 Deploying ClaimableToken to Celo Alfajores..."
echo ""

# Deploy
pnpm deploy:token:alfajores

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Copy the contract address from the output above"
    echo "2. Update NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS in your .env file"
    echo "3. Restart your Next.js dev server"
else
    echo ""
    echo "❌ Deployment failed"
    echo ""
    echo "💡 Troubleshooting:"
    echo "1. Check your internet connection"
    echo "2. Try using a different RPC endpoint (set ALFAJORES_RPC_URL in .env)"
    echo "3. Ensure your PRIVATE_KEY has sufficient testnet CELO for gas"
    echo "4. Get testnet CELO from: https://faucet.celo.org/alfajores"
fi

