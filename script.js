// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards and tech items
document.querySelectorAll('.feature-card, .tech-item, .hackathon-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-visual');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Animate stats on scroll
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-value');
    stats.forEach(stat => {
        const text = stat.textContent;
        // Keep original text for non-numeric values
        if (!/\d/.test(text)) return;
        
        const hasNumber = text.match(/\d+/);
        if (hasNumber) {
            const number = parseInt(hasNumber[0]);
            let current = 0;
            const increment = number / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    stat.textContent = text;
                    clearInterval(timer);
                } else {
                    stat.textContent = text.replace(/\d+/, Math.floor(current));
                }
            }, 30);
        }
    });
};

// Trigger stat animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            animateStats();
            entry.target.dataset.animated = 'true';
        }
    });
}, { threshold: 0.5 });

const hackathonSection = document.querySelector('.hackathon-stats');
if (hackathonSection) {
    statsObserver.observe(hackathonSection);
}

// Add floating animation variance to hero cards
const floatingCards = document.querySelectorAll('.floating-card');
floatingCards.forEach((card, index) => {
    card.style.animationDuration = `${3 + index * 0.5}s`;
});

// Add gradient animation to title
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    let hue = 0;
    setInterval(() => {
        hue = (hue + 1) % 360;
        heroTitle.style.filter = `hue-rotate(${hue}deg)`;
    }, 50);
}

// Live Terminal Demo
class ZephyrTerminal {
    constructor() {
        this.terminal = document.querySelector('.terminal-body');
        this.isRunning = false;
        this.trades = [
            { pair: 'SOL/USDC', amount: 5.2, out: 847.32, profit: 12.47, pct: 1.48 },
            { pair: 'BONK/SOL', amount: 1200000, out: 2.45, profit: 0.18, pct: 0.08 },
            { pair: 'JUP/USDC', amount: 150, out: 423.50, profit: 8.92, pct: 2.15 },
            { pair: 'PYTH/SOL', amount: 850, out: 6.72, profit: -0.34, pct: -0.05 },
            { pair: 'RAY/USDC', amount: 75, out: 98.45, profit: 4.21, pct: 4.47 }
        ];
        this.currentTrade = 0;
    }

    getTimestamp() {
        const now = new Date();
        return now.toTimeString().slice(0, 8);
    }

    createLine(timestamp, level, message, extraClass = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${extraClass}`;
        line.innerHTML = `
            <span class="timestamp">${timestamp}</span>
            <span class="level ${level.toLowerCase()}">${level}</span>
            <span class="message">${message}</span>
        `;
        return line;
    }

    async typeEffect(element, text, speed = 20) {
        element.textContent = '';
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await this.sleep(speed);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async simulateTrade() {
        const trade = this.trades[this.currentTrade];
        const ts = this.getTimestamp();

        // Market analysis
        this.terminal.appendChild(this.createLine(ts, 'INFO', `Market analysis running for ${trade.pair}...`));
        this.terminal.scrollTop = this.terminal.scrollHeight;
        await this.sleep(800);

        // Price fetch
        const ts2 = this.getTimestamp();
        this.terminal.appendChild(this.createLine(ts2, 'INFO', `Pyth price feed: $${(Math.random() * 100 + 20).toFixed(2)}`));
        this.terminal.scrollTop = this.terminal.scrollHeight;
        await this.sleep(600);

        // Jupiter route
        const ts3 = this.getTimestamp();
        this.terminal.appendChild(this.createLine(ts3, 'INFO', `Jupiter route optimized: ${trade.amount} → ${trade.out}`));
        this.terminal.scrollTop = this.terminal.scrollHeight;
        await this.sleep(700);

        // Execute
        const ts4 = this.getTimestamp();
        const successLine = this.createLine(ts4, 'SUCCESS', `✓ Trade executed: ${trade.pair}`, 'highlight');
        this.terminal.appendChild(successLine);
        this.terminal.scrollTop = this.terminal.scrollHeight;
        await this.sleep(500);

        // Profit/loss
        const ts5 = this.getTimestamp();
        const isProfit = trade.profit > 0;
        const profitLine = this.createLine(
            ts5, 
            isProfit ? 'SUCCESS' : 'WARN',
            `${isProfit ? '💰' : '📉'} P&L: ${isProfit ? '+' : ''}$${Math.abs(trade.profit).toFixed(2)} (${trade.pct > 0 ? '+' : ''}${trade.pct.toFixed(2)}%)`,
            isProfit ? 'profit' : 'loss'
        );
        this.terminal.appendChild(profitLine);
        this.terminal.scrollTop = this.terminal.scrollHeight;

        // Move to next trade
        this.currentTrade = (this.currentTrade + 1) % this.trades.length;
        await this.sleep(2000);

        // Keep only last 20 lines
        while (this.terminal.children.length > 20) {
            this.terminal.removeChild(this.terminal.firstChild);
        }
    }

    async run() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        // Clear initial content
        this.terminal.innerHTML = '';
        
        // Add startup messages
        const startup = [
            ['SYSTEM', 'Initializing Zephyr v1.0...'],
            ['SYSTEM', 'Connecting to Solana devnet...'],
            ['SUCCESS', '✓ Connected (latency: 45ms)'],
            ['SYSTEM', 'Loading Pyth price feeds...'],
            ['SUCCESS', '✓ 47 markets active'],
            ['SYSTEM', 'Initializing Jupiter aggregator...'],
            ['SUCCESS', '✓ Router ready'],
            ['INFO', 'Agent wallet: 7xKx...9Pq2'],
            ['INFO', 'Balance: 125.8 SOL'],
            ['SUCCESS', '✓ Zephyr is now trading autonomously']
        ];

        for (const [level, msg] of startup) {
            this.terminal.appendChild(this.createLine(this.getTimestamp(), level, msg));
            this.terminal.scrollTop = this.terminal.scrollHeight;
            await this.sleep(300);
        }

        await this.sleep(1000);

        // Start trading loop
        while (this.isRunning) {
            await this.simulateTrade();
        }
    }

    stop() {
        this.isRunning = false;
    }
}

// Initialize terminal when in view
let terminalInstance = null;
const terminalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (!terminalInstance) {
                terminalInstance = new ZephyrTerminal();
                terminalInstance.run();
            }
        }
    });
}, { threshold: 0.3 });

const demoSection = document.querySelector('.demo-terminal');
if (demoSection) {
    terminalObserver.observe(demoSection);
}

// Log page load
console.log('🚀 Zephyr - Autonomous DeFi Agent');
console.log('Built for Colosseum Hackathon 2026');
console.log('Live demo running in #demo section');
