#!/bin/bash
# Script to update contract address in .env file

if [ -z "$1" ]; then
    echo "Usage: ./update-contract-address.sh <contract_address>"
    echo "Example: ./update-contract-address.sh 0x1234567890123456789012345678901234567890"
    exit 1
fi

CONTRACT_ADDRESS=$1
ENV_FILE=".env"

# Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found"
    exit 1
fi

# Update or add NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS
if grep -q "NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS" "$ENV_FILE"; then
    # Update existing line
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=.*|NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=$CONTRACT_ADDRESS|" "$ENV_FILE"
    else
        # Linux
        sed -i "s|NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=.*|NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=$CONTRACT_ADDRESS|" "$ENV_FILE"
    fi
    echo "✅ Updated NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=$CONTRACT_ADDRESS"
else
    # Add new line
    echo "" >> "$ENV_FILE"
    echo "NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> "$ENV_FILE"
    echo "✅ Added NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=$CONTRACT_ADDRESS"
fi

echo ""
echo "📋 Updated .env file. Please restart your Next.js dev server."

