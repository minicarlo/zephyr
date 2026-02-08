import { Connection, PublicKey } from '@solana/web3.js';
import { createJupiterApiClient } from '@jup-ag/api';

const JUPITER_CONFIG = {
  cluster: 'devnet',
  endpoint: 'https://api.devnet.solana.com'
};

// Common token mints on devnet
const TOKEN_MINTS = {
  'SOL': new PublicKey('So11111111111111111111111111111111111111112'),
  'USDC': new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
  'USDT': new PublicKey('BQcdHdafW3jQ6ouv3F9w5L33NuySQ3nuEd45jtCXCXzQ'),
  'BTC': new PublicKey('3n6j7NssAZeiey9qD8bYSN8J9wK6Bv5X5dF8rJ7t9hYQ'),
  'ETH': new PublicKey('2FPyTwcZLUg1MDrwsyoP4KQ6P2Q9mZ4r7g8wX9vY2zK1'),
};

export class JupiterSwap {
  constructor(connection) {
    this.connection = connection;
    this.jupiterQuoteApi = createJupiterApiClient();
  }

  async getQuote(inputMint, outputMint, amount, slippageBps = 50) {
    try {
      const quote = await this.jupiterQuoteApi.quoteGet({
        inputMint: inputMint.toBase58(),
        outputMint: outputMint.toBase58(),
        amount: amount.toString(),
        slippageBps: slippageBps,
        onlyDirectRoutes: false,
        asLegacyTransaction: false,
      });

      if (!quote) {
        return null;
      }

      return {
        inputMint: quote.inputMint,
        outputMint: quote.outputMint,
        inAmount: quote.inAmount,
        outAmount: quote.outAmount,
        otherAmountThreshold: quote.otherAmountThreshold,
        swapMode: quote.swapMode,
        slippageBps: quote.slippageBps,
        platformFee: quote.platformFee,
        priceImpactPct: quote.priceImpactPct,
        routePlan: quote.routePlan,
        contextSlot: quote.contextSlot,
        timeTaken: quote.timeTaken,
      };
    } catch (error) {
      console.error('Jupiter quote error:', error);
      return null;
    }
  }

  async getQuoteForPair(fromToken, toToken, amount, slippageBps = 50) {
    const inputMint = TOKEN_MINTS[fromToken.toUpperCase()];
    const outputMint = TOKEN_MINTS[toToken.toUpperCase()];
    
    if (!inputMint || !outputMint) {
      throw new Error(`Token mint not found for ${fromToken} or ${toToken}`);
    }

    return this.getQuote(inputMint, outputMint, amount, slippageBps);
  }

  async getSwapTransaction(quote, userPublicKey) {
    try {
      const swapRequest = {
        quoteResponse: quote,
        userPublicKey: userPublicKey.toBase58(),
        wrapAndUnwrapSol: true,
        computeUnitPriceMicroLamports: 0,
        asLegacyTransaction: false,
        useSharedAccounts: true,
        destinationTokenAccount: null,
      };

      const swapResult = await this.jupiterQuoteApi.swapPost({ swapRequest });
      return swapResult.swapTransaction;
    } catch (error) {
      console.error('Jupiter swap error:', error);
      return null;
    }
  }

  getAvailableTokens() {
    return Object.keys(TOKEN_MINTS);
  }
}

export { TOKEN_MINTS, JUPITER_CONFIG };
