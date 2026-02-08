# Zephyr API Documentation

Complete API reference for the Zephyr autonomous DeFi agent.

## Base URL
```
http://localhost:3000
```

## System Status

### GET /system/status
Returns overall system health and integration status.

**Response:**
```json
{
  "status": "operational",
  "network": "devnet",
  "slot": 123456789,
  "blockTime": "2026-02-08T18:15:30.000Z",
  "programId": "F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX",
  "integrations": {
    "pyth": true,
    "jupiter": true,
    "anchor": true
  }
}
```

## Price Feeds (Pyth Network)

### GET /prices
Returns all available price feeds.

**Response:**
```json
{
  "timestamp": "2026-02-08T18:15:30.000Z",
  "source": "Pyth Network",
  "prices": {
    "SOL/USD": {
      "price": 145.23,
      "confidence": 0.12,
      "timestamp": "2026-02-08T18:15:30.000Z",
      "status": 1
    },
    "BTC/USD": { ... },
    "ETH/USD": { ... },
    "JUP/USD": { ... },
    "USDC/USD": { ... }
  }
}
```

### GET /prices/:pair
Get specific pair price (e.g., `/prices/SOL/USD`).

**Response:**
```json
{
  "pair": "SOL/USD",
  "price": 145.23,
  "confidence": 0.12,
  "timestamp": "2026-02-08T18:15:30.000Z",
  "status": 1
}
```

## Swap Quotes (Jupiter)

### GET /quote/:from/:to/:amount
Get swap quote for token pair.

**Example:** `/quote/SOL/USDC/1000000000` (1 SOL in lamports)

**Response:**
```json
{
  "from": "SOL",
  "to": "USDC",
  "amount": "1000000000",
  "slippageBps": 50,
  "quote": {
    "inputMint": "So11111111111111111111111111111111111111112",
    "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "inAmount": "1000000000",
    "outAmount": "145230000",
    "otherAmountThreshold": "144500000",
    "swapMode": "ExactIn",
    "slippageBps": 50,
    "platformFee": null,
    "priceImpactPct": "0.12",
    "routePlan": [...],
    "contextSlot": 123456789,
    "timeTaken": 0.123
  },
  "timestamp": "2026-02-08T18:15:30.000Z"
}
```

### GET /tokens
List available tokens for swapping.

**Response:**
```json
{
  "available": ["SOL", "USDC", "USDT", "BTC", "ETH"],
  "network": "devnet"
}
```

## Agent Management (Anchor Program)

### POST /agent/initialize
Initialize a new trading agent.

**Request:**
```json
{
  "agentId": 769
}
```

**Response:**
```json
{
  "success": true,
  "signature": "simulated_1707411330000",
  "agentState": {
    "authority": "7xKx...9Pq2",
    "agentId": 769,
    "balance": 0,
    "totalTrades": 0,
    "profitLoss": 0,
    "riskThreshold": 5000,
    "status": "active",
    "createdAt": "2026-02-08T18:15:30.000Z"
  },
  "programId": "F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX"
}
```

### GET /agent/:agentId
Get agent state.

**Example:** `/agent/769`

**Response:**
```json
{
  "agentId": 769,
  "programId": "F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX",
  "state": {
    "agentId": 769,
    "balance": 10.5,
    "totalTrades": 1247,
    "profitLoss": 23847,
    "winRate": 0.732,
    "status": "active"
  }
}
```

### POST /agent/:agentId/trade
Execute a trade with real price feeds and swap routes.

**Example:** `/agent/769/trade`

**Request:**
```json
{
  "pair": "SOL/USDC",
  "amount": "1000000000",
  "type": "swap"
}
```

**Response:**
```json
{
  "success": true,
  "signature": "simulated_trade_1707411330000",
  "trade": {
    "pair": "SOL/USDC",
    "amount": 1000000000,
    "type": "swap",
    "price": 145.23,
    "timestamp": "2026-02-08T18:15:30.000Z",
    "pnl": 12.47
  },
  "quote": {
    "inputMint": "So11111111111111111111111111111111111111112",
    "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "inAmount": "1000000000",
    "outAmount": "145230000",
    "priceImpactPct": "0.12",
    "contextSlot": 123456789
  },
  "agentState": {
    "agentId": 769,
    "balance": 10.6,
    "totalTrades": 1248,
    "profitLoss": 23859.47,
    "status": "active"
  },
  "programId": "F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX"
}
```

### GET /agents
List all agents.

**Response:**
```json
{
  "agents": [
    {
      "agentId": 769,
      "balance": 10.5,
      "totalTrades": 1247,
      "status": "active"
    }
  ],
  "programId": "F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX"
}
```

## Health Check

### GET /health
Basic health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "agent_id": 769,
  "timestamp": "2026-02-08T18:15:30.000Z"
}
```

## Running the Server

```bash
# Install dependencies
npm install

# Start the server
npm start

# Or with hot reload
npm run dev
```

The server will start on port 3000 (or PORT env variable).

## Architecture

- **Pyth Network**: Real-time price feeds for SOL, BTC, ETH, JUP, USDC
- **Jupiter**: Optimal swap routing and quotes
- **Anchor Program**: Simulated on-chain agent state (deploy with `deploy.sh` for real deployment)

## Demo

Visit https://minicarlo.github.io/zephyr/ for the interactive live demo.
