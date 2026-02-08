#!/bin/bash
# Zephyr Anchor Program Deployment Script
# Run this on your local machine to deploy the program to devnet

set -e

echo "🚀 Zephyr Anchor Deployment"
echo "============================"

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Installing..."
    sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
fi

if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor CLI not found. Installing..."
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install latest
    avm use latest
fi

echo "✅ Prerequisites met"

# Set Solana config to devnet
echo "Setting Solana to devnet..."
solana config set --url devnet

# Check balance
echo "Checking SOL balance..."
BALANCE=$(solana balance | awk '{print $1}')
echo "Current balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 2" | bc -l) )); then
    echo "💰 Requesting airdrop..."
    solana airdrop 2
fi

# Build the program
echo "🔨 Building Anchor program..."
cd programs/zephyr
anchor build

# Deploy
echo "🚀 Deploying to devnet..."
anchor deploy

echo "✅ Deployment complete!"
echo ""
echo "Update your program ID in:"
echo "  - src/index.ts"
echo "  - Anchor.toml"
echo ""
echo "Your program is now live on Solana devnet!"
