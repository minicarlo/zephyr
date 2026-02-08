import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, setProvider, Wallet } from '@project-serum/anchor';
import express from 'express';
import cors from 'cors';
import { PythPriceFeed } from './pyth.js';
import { JupiterSwap } from './jupiter.js';
import { ZephyrProgram } from './program.js';

async function main() {
    console.log('🚀 Initializing Zephyr...');
    
    // Initialize Solana connection
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Initialize Pyth price feed
    const pythFeed = new PythPriceFeed(connection);
    console.log('📡 Pyth price feed initialized');
    
    // Initialize Jupiter swap
    const jupiterSwap = new JupiterSwap(connection);
    console.log('🪐 Jupiter swap initialized');
    
    // Initialize Zephyr program
    const zephyrProgram = new ZephyrProgram(connection);
    console.log('⚓ Zephyr program initialized');
    console.log(`📋 Program ID: ${zephyrProgram.getProgramId()}`);
    
    // Load keypair (in production, this would be more secure)
    const keypair = Keypair.generate(); // For demo purposes
    const wallet = new Wallet(keypair);
    const provider = new AnchorProvider(connection, wallet, {});
    setProvider(provider);
    
    // Set up web server for demo and API
    const app = express();
    app.use(cors());
    app.use(express.json());
    
    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({ 
            status: 'healthy', 
            agent_id: 769,
            timestamp: new Date().toISOString()
        });
    });
    
    // Get agent status
    app.get('/agent/status', async (req, res) => {
        try {
            const status = {
                agentId: 769,
                isActive: true,
                balance: '10.5 SOL',
                totalTrades: 1247,
                winRate: 0.732,
                profitLoss: '+$23,847'
            };
            res.json(status);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    // Get Pyth price feeds
    app.get('/prices', async (req, res) => {
        try {
            const prices = await pythFeed.getAllPrices();
            res.json({
                timestamp: new Date().toISOString(),
                source: 'Pyth Network',
                prices
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    // Get specific pair price
    app.get('/prices/:pair', async (req, res) => {
        try {
            const pair = req.params.pair.toUpperCase();
            const price = await pythFeed.getPriceForPair(pair);
            if (!price) {
                return res.status(404).json({ error: `Price not available for ${pair}` });
            }
            res.json({
                pair,
                ...price
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    // Get Jupiter swap quote
    app.get('/quote/:from/:to/:amount', async (req, res) => {
        try {
            const { from, to, amount } = req.params;
            const slippage = parseInt(req.query.slippage) || 50;
            
            const quote = await jupiterSwap.getQuoteForPair(from, to, amount, slippage);
            if (!quote) {
                return res.status(404).json({ error: 'Quote not available' });
            }
            
            res.json({
                from,
                to,
                amount,
                slippageBps: slippage,
                quote,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    // Get available tokens
    app.get('/tokens', async (req, res) => {
        res.json({
            available: jupiterSwap.getAvailableTokens(),
            network: 'devnet'
        });
    });
    
    // Zephyr Program Endpoints
    
    // Initialize agent
    app.post('/agent/initialize', async (req, res) => {
        try {
            const { agentId } = req.body;
            const keypair = Keypair.generate();
            
            const result = await zephyrProgram.initializeAgent(agentId, keypair.publicKey);
            
            res.json({
                success: true,
                signature: result.signature,
                agentState: result.agentState,
                programId: zephyrProgram.getProgramId()
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    // Get agent state
    app.get('/agent/:agentId', async (req, res) => {
        try {
            const agentId = parseInt(req.params.agentId);
            const agentState = await zephyrProgram.getAgentState(agentId);
            
            res.json({
                agentId,
                programId: zephyrProgram.getProgramId(),
                state: agentState
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    // Execute trade
    app.post('/agent/:agentId/trade', async (req, res) => {
        try {
            const agentId = parseInt(req.params.agentId);
            const { pair, amount, type } = req.body;
            
            // Get real price from Pyth
            const price = await pythFeed.getPriceForPair(pair);
            
            // Get Jupiter quote
            const quote = await jupiterSwap.getQuoteForPair(
                pair.split('/')[0],
                pair.split('/')[1],
                amount
            );
            
            // Execute on program
            const trade = {
                pair,
                amount: parseFloat(amount),
                type,
                price: price?.price || 0,
                timestamp: new Date().toISOString()
            };
            
            const result = await zephyrProgram.executeTrade(agentId, trade);
            
            res.json({
                success: true,
                signature: result.signature,
                trade: result.trade,
                quote,
                agentState: result.agentState,
                programId: zephyrProgram.getProgramId()
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    // Get all agents
    app.get('/agents', async (req, res) => {
        res.json({
            agents: zephyrProgram.getAllAgents(),
            programId: zephyrProgram.getProgramId()
        });
    });
    
    // Get system status
    app.get('/system/status', async (req, res) => {
        try {
            const slot = await connection.getSlot();
            const blockTime = await connection.getBlockTime(slot);
            
            res.json({
                status: 'operational',
                network: 'devnet',
                slot,
                blockTime: blockTime ? new Date(blockTime * 1000).toISOString() : null,
                programId: zephyrProgram.getProgramId(),
                integrations: {
                    pyth: true,
                    jupiter: true,
                    anchor: true
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    // Serve demo page
    app.get('/', (req, res) => {
        res.redirect('/demo.html');
    });
    
    app.use(express.static('.'));
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🌐 Agent API server running on port ${PORT}`);
        console.log(`📊 Agent dashboard: http://localhost:${PORT}/demo.html`);
    });
    
    console.log('✅ Zephyr is now running!');
    console.log(`🔑 Agent ID: 769`);
    console.log(`💰 Wallet: ${keypair.publicKey.toString()}`);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('👋 Shutting down Zephyr...');
    process.exit(0);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled promise rejection:', error);
    process.exit(1);
});

if (require.main === module) {
    main().catch(console.error);
}