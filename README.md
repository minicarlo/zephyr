# Zephyr - Colosseum Hackathon Landing Page

Professional landing page for the Zephyr Colosseum hackathon submission.

## Features

- **Modern Design**: Sleek, crypto/DeFi aesthetic with gradients and animations
- **Responsive**: Fully responsive design works on all devices
- **Interactive**: Smooth scrolling, parallax effects, and scroll-triggered animations
- **Fast**: Lightweight HTML/CSS/JS with no frameworks
- **Accessible**: Semantic HTML and proper contrast ratios

## Structure

```
colosseum-landing/
├── index.html       # Main HTML structure
├── styles.css       # All styles and animations
├── script.js        # Interactive features
└── README.md        # This file
```

## Sections

1. **Hero** - Eye-catching introduction with animated floating cards
2. **Features** - 6 key features showcasing capabilities
3. **Tech Stack** - Technologies used in the project
4. **Demo** - Placeholder for demo video
5. **Hackathon** - Submission details and stats
6. **CTA** - Call-to-action with GitHub link
7. **Footer** - Links and copyright

## Color Scheme

- Primary: `#14F195` (Solana green)
- Secondary: `#9945FF` (Purple)
- Background: `#0a0a0f` (Dark)
- Cards: `#141420` (Darker card background)

## Usage

Simply open `index.html` in a browser or serve via any web server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Customization

- Update GitHub links in `index.html` (already updated to `minicarlo/zephyr`)
- Replace email address `contact@example.com` with your actual contact
- Add demo video by replacing the `.demo-placeholder` section
- Customize colors in `:root` variables in `styles.css`

## Deployment

Can be deployed to:
- GitHub Pages
- Vercel
- Netlify
- Any static hosting service

## License

Built for Colosseum Hackathon 2026
