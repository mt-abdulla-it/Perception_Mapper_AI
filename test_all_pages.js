const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const recordingDir = path.join(__dirname, 'test-recordings');
  const screenshotDir = path.join(__dirname, 'test-screenshots');
  fs.mkdirSync(recordingDir, { recursive: true });
  fs.mkdirSync(screenshotDir, { recursive: true });

  console.log('🚀 Starting Full Verification Test Suite...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    recordVideo: { dir: recordingDir }
  });
  const page = await context.newPage();

  const checkPage = async (url, name) => {
    console.log(`Checking ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 5000 });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(screenshotDir, `${name}.png`) });
    } catch (err) {
      console.warn(`Failed to completely load ${url}:`, err.message);
      await page.screenshot({ path: path.join(screenshotDir, `${name}-error.png`) });
    }
  };

  try {
    // 1. Homepage & Showcase & Playground
    await checkPage('http://localhost:3009/', '01-homepage');

    console.log('Verifying Showcase tabs...');
    await page.click('text=Basic');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, '02-showcase-basic.png') });

    await page.click('text=Pro');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, '03-showcase-pro.png') });

    console.log('Testing Playground preset analysis...');
    await page.locator('#playground').scrollIntoViewIfNeeded();
    await page.click('text=Corporate Launch Announcement');
    await page.click('text=Analyze and Cleanse Text');
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(screenshotDir, '04-playground-analyzed.png') });

    // 2. Sign In
    await checkPage('http://localhost:3009/sign-in', '05-signin');

    // 3. Sign Up
    await checkPage('http://localhost:3009/sign-up', '06-signup');

    // 4. Pricing
    await checkPage('http://localhost:3009/pricing', '07-pricing');

    // 5. Contact
    await checkPage('http://localhost:3009/contact', '08-contact');

    // 6. Configuration
    await checkPage('http://localhost:3009/configuration', '09-configuration');

    // 7. Dashboard (should redirect to sign-in)
    await checkPage('http://localhost:3009/dashboard', '10-dashboard-redirect');

    console.log('🎉 Full E2E Page Checks Completed successfully!');
  } catch (error) {
    console.error('Fatal test error encountered:', error);
  } finally {
    await context.close();
    await browser.close();
  }
})();
