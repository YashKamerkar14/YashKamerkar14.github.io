const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
fs.mkdirSync(path.join(root, '.design-review'), { recursive: true });
(async () => {
 const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
 const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
 const errors = [];
 page.on('pageerror', error => errors.push(error.message));
 try {
  await page.goto('http://127.0.0.1:3000/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, '.design-review/paper-desktop.png') });
  await page.getByRole('button', { name: 'Meet Scout and Scribe, the project AI agents' }).click();
  await page.screenshot({ path: path.join(root, '.design-review/paper-agents.png') });
  await page.getByRole('button', { name: 'Close project agents' }).click();
  await page.locator('#experience').evaluate(element => element.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(root, page.viewportSize().width < 700 ? '.design-review/paper-mobile-experience.png' : '.design-review/paper-experience.png') });
  await page.locator('#work').evaluate(element => element.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(root, '.design-review/paper-work.png') });
  await page.goto('http://127.0.0.1:3000/');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, '.design-review/paper-mobile.png') });
  await page.getByRole('button', { name: 'Meet Scout and Scribe, the project AI agents' }).click();
  await page.screenshot({ path: path.join(root, '.design-review/paper-mobile-agents.png') });
  await page.getByRole('button', { name: 'Close project agents' }).click();
  await page.locator('#experience').evaluate(element => element.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(root, page.viewportSize().width < 700 ? '.design-review/paper-mobile-experience.png' : '.design-review/paper-experience.png') });
  await page.locator('#work').evaluate(element => element.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(root, '.design-review/paper-mobile-work.png') });
  for (const width of [768,1024]) {
   await page.setViewportSize({width,height:1000});
   await page.goto('http://127.0.0.1:3000/');
   await page.evaluate(() => document.fonts.ready);
   await page.screenshot({path:path.join(root, `.design-review/paper-tablet-${width}.png`)});
  }
  if (process.argv.includes('--social')) {
   await page.setViewportSize({ width: 1200, height: 630 });
   await page.goto('http://127.0.0.1:3000/');
   await page.addStyleTag({ content: '.room-stage{height:630px;padding-top:115px;padding-bottom:150px}.room-copy h1{font-size:68px}.room-eyebrow{margin-bottom:18px!important}.room-intro{font-size:13px;max-width:510px;margin-top:18px!important}.hero-actions{margin-top:15px}.room-art{top:90px;right:10px;width:38%}.identity-note{bottom:24px;width:260px;padding:18px 22px}.identity-note h2{margin-top:12px}.identity-note h2 strong{font-size:35px}.identity-note a{display:none}.hero-workshop{top:auto;bottom:16px;left:580px;right:auto;width:270px;height:112px}.scout-floor{height:112px}.scout-walkway{height:72px}.scout-walker,.scout-walker .agent-character{width:66px;height:72px}.hero-workshop .agent-desk{flex-direction:row;gap:12px}.connection-detail,.room-footnote{display:none}.desk-agents .agent-character{width:66px;height:72px}.desk-caption{padding:0}.robot-dock,.robot-motion-toggle{display:none!important}' });
   await page.evaluate(() => { document.querySelectorAll('.paper-section').forEach(element => element.remove()); window.scrollTo(0,0); });
   await page.evaluate(() => document.fonts.ready);
   await page.screenshot({ path: path.join(root, 'public/images/og.png') });
  }
  console.log(JSON.stringify({ errors, captures: 10 }));
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
