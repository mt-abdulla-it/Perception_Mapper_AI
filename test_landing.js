const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  // Ensure directories exist
  const recordingDir = path.join(__dirname, 'test-recordings');
  const screenshotDir = path.join(__dirname, 'test-screenshots');
  fs.mkdirSync(recordingDir, { recursive: true });
  fs.mkdirSync(screenshotDir, { recursive: true });

  console.log('Launching Chromium...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    recordVideo: { dir: recordingDir }
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to http://localhost:3009...');
    await page.goto('http://localhost:3009', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotDir, '1-landing-page.png') });

    console.log('Checking Showcase Section...');
    // Click on Showcase in Navbar
    await page.click('a[href="/#showcase"]');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotDir, '2-showcase-section.png') });

    // Click Basic tab
    console.log('Testing Basic Tier tab...');
    await page.click('text=Basic');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotDir, '3-basic-tier.png') });

    // Click Pro tab
    console.log('Testing Pro Tier tab...');
    await page.click('text=Pro');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotDir, '4-pro-tier.png') });

    // Click Free tab
    console.log('Testing Free Tier tab...');
    await page.click('text=Free');
    await page.waitForTimeout(1000);

    console.log('Testing Playground Section...');
    await page.locator('#playground').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Select corporate preset
    await page.click('text=Corporate Launch Announcement');
    await page.click('text=Analyze and Cleanse Text');
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(screenshotDir, '5-playground-analyzed.png') });

    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test execution encountered an error:', error);
    await page.screenshot({ path: path.join(screenshotDir, 'error-fallback.png') });
  } finally {
    await context.close();
    await browser.close();
  }
})();
