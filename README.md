# Zephyr - Autonomous DeFi Agent

[![Colosseum](https://img.shields.io/badge/Colosseum-Submitted-success)](https://colosseum.com/projects/zephyr)
[![Solana](https://img.shields.io/badge/Solana-Devnet-14F195)](https://solana.com)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

**Autonomous DeFi agent for Solana that executes trades, optimizes portfolios, and manages risk 24/7.**

Built for Colosseum Hackathon 2026 🏆

🔗 **Live Demo:** https://minicarlo.github.io/zephyr/  
🔗 **Submission:** https://colosseum.com/projects/zephyr  
🔗 **GitHub:** https://github.com/minicarlo/zephyr

---

## 🚀 Features

- **🤖 AI-Powered Trading** - Autonomous strategy execution 24/7
- **⚡ Real-Time Price Feeds** - Pyth Network integration for accurate market data
- **🪐 Optimal Swap Routing** - Jupiter aggregator for best execution prices
- **🔒 Self-Custodial** - You control your keys, agent executes with permissions
- **📊 Live Dashboard** - Real-time monitoring of trades, P&L, and performance
- **⛓️ On-Chain Programs** - Anchor-based Solana programs for trustless execution

---

## 🏗️ Architecture

```
Zephyr/
├── 📱 Frontend (GitHub Pages)
│   ├── Live terminal demo
│   ├── Real-time price display
│   └── Interactive agent controls
│
├── 🔗 Backend API (Node.js/Express)
│   ├── Pyth price feeds (/prices)
│   ├── Jupiter quotes (/quote)
│   └── Agent management (/agent)
│
├── ⛓️ Solana Program (Anchor/Rust)
│   ├── Agent state management
│   ├── Trade execution
│   └── PDA-based storage
│
└── 🔌 Integrations
    ├── Pyth Network - Price feeds
    ├── Jupiter - Swap aggregation
    └── Solana Devnet - Blockchain
```

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Blockchain** | Solana (Devnet) |
| **Smart Contracts** | Anchor Framework (Rust) |
| **Price Feeds** | Pyth Network |
| **Swaps** | Jupiter Aggregator |
| **Backend** | Node.js, Express |
| **Frontend** | HTML5, CSS3, Vanilla JS |
| **Deployment** | GitHub Pages |

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- Git

### Setup

```bash
# Clone repository
git clone https://github.com/minicarlo/zephyr.git
cd zephyr

# Install dependencies
npm install

# Start development server
npm start
```

Server runs on `http://localhost:3000`

---

## 🔌 API Endpoints

### System Status
```bash
GET /system/status
```

### Price Feeds (Pyth)
```bash
GET /prices           # All prices
GET /prices/SOL/USD   # Specific pair
```

### Swap Quotes (Jupiter)
```bash
GET /quote/SOL/USDC/1000000000  # Quote 1 SOL → USDC
```

### Agent Management
```bash
POST /agent/initialize          # Create agent
GET /agent/:agentId            # Get agent state
POST /agent/:agentId/trade     # Execute trade
```

📖 **Full API docs:** [API.md](./API.md)

---

## 🎮 Live Demo

The interactive demo includes:

- **Live Terminal** - Real-time agent activity simulation
- **Price Ticker** - Live Pyth price updates
- **Trade Visualization** - See routes, execution, and P&L
- **Tech Stack** - Actual logos of integrated protocols

👉 **Try it:** https://minicarlo.github.io/zephyr/

---

## 🚀 Deploying the Anchor Program

To deploy the on-chain program to Solana devnet:

```bash
# Run deployment script
./deploy.sh
```

This will:
1. Check/install Solana CLI and Anchor
2. Build the Rust program
3. Deploy to devnet
4. Output program ID

---

## 📁 Project Structure

```
zephyr/
├── 📄 index.html              # Landing page
├── 🎨 styles.css              # Styling & animations
├── ⚡ script.js               # Interactive demo
├── 📘 API.md                  # API documentation
├── 🚀 deploy.sh               # Program deployment
│
├── src/
│   ├── index.ts              # Express server
│   ├── pyth.js               # Pyth integration
│   ├── jupiter.js            # Jupiter integration
│   └── program.js            # Anchor program interface
│
├── programs/
│   └── zephyr/
│       └── src/
│           └── lib.rs        # Solana program
│
└── logos/                     # Brand assets
```

---

## 🏆 Hackathon Submission

**Status:** ✅ Submitted to Colosseum

| Category | Status |
|----------|--------|
| Landing Page | ✅ Live |
| GitHub Repo | ✅ Complete |
| Demo Video | 📝 Script ready |
| Program Deployment | 📝 Scripts ready |
| Price Feeds (Pyth) | ✅ Integrated |
| Swap Routing (Jupiter) | ✅ Integrated |

**Claim URL:** https://colosseum.com/agent-hackathon/claim/75b73ff6-b3c1-4ac0-90b1-d9a95a0b2990

---

## 🤝 Contributing

Built for the Colosseum Agent Hackathon 2026.

---

## 📜 License

MIT License - see [LICENSE](./LICENSE)

---

**Built with ❤️ for the future of DeFi**

🌐 https://minicarlo.github.io/zephyr/  
📧 Built for Colosseum Hackathon 2026
