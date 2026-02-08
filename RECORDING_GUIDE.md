# Zephyr Demo Video Recording Script
# Run this on your local machine to record the live terminal demo

## Option 1: Using OBS Studio (Free, Recommended)
1. Download OBS: https://obsproject.com/
2. Add "Browser Source" 
3. Enter URL: https://minicarlo.github.io/zephyr/
4. Set resolution: 1920x1080
5. Start recording
6. Scroll to "See it in Action" section
7. Let terminal run for 45-60 seconds
8. Stop recording
9. Export as MP4

## Option 2: Using Loom (Browser-based)
1. Install Loom extension: https://www.loom.com/
2. Open https://minicarlo.github.io/zephyr/
3. Start Loom recording (fullscreen)
4. Scroll to "See it in Action"
5. Record for 60 seconds
6. Download video as MP4

## Option 3: Using QuickTime (Mac)
1. Open QuickTime Player
2. File > New Screen Recording
3. Select area around the demo section
4. Record for 60 seconds
5. Save as MP4

## Option 4: Using Playwright (Automated)

Save this as `record.js` and run with Node.js:

```javascript
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        recordVideo: { dir: './videos/', size: { width: 1920, height: 1080 } }
    });
    
    const page = await context.newPage();
    await page.goto('https://minicarlo.github.io/zephyr/');
    await page.waitForTimeout(2000);
    
    // Scroll to demo
    await page.evaluate(() => {
        document.querySelector('#demo').scrollIntoView();
    });
    
    // Record 60 seconds of live terminal
    await page.waitForTimeout(60000);
    
    await context.close();
    await browser.close();
    console.log('✅ Video saved to ./videos/');
})();
```

Run:
```bash
npm install playwright
npx playwright install chromium
node record.js
```

## Video Requirements for Colosseum:
- **Duration:** 30-60 seconds
- **Resolution:** 1920x1080 (1080p)
- **Format:** MP4
- **Content:** Focus on technical architecture + brief user benefits

## What to Capture:
1. **0-5s:** Landing page hero section
2. **5-10s:** Scroll to "See it in Action"
3. **10-60s:** Live terminal showing:
   - Connection to Solana devnet
   - Market analysis
   - Jupiter route optimization
   - Trade execution
   - P&L updates

After recording, upload to YouTube/Vimeo and add link to Colosseum project.
