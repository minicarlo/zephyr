import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, setProvider, Wallet } from '@project-serum/anchor';
import express from 'express';
import cors from 'cors';

async function main() {
    console.log('🚀 Initializing Zephyr...');
    
    // Initialize Solana connection
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
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