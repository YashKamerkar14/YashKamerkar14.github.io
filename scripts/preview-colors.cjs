/* Creates comparison artifacts without adding a public theme switcher or making AI calls. */
const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'docs/design');
const palettes = [
  { id:'cream', name:'01 / Warm studio', description:'Cream, deep teal, warm sand paper notes.', colors:['#f3f1e6','#007a86','#eee3d1','#eaedcf'], background:'#f3f1e6', ink:'#1c2925' },
  { id:'lilac', name:'02 / Lilac atelier', description:'Lilac, ink violet, a touch of butter yellow.', colors:['#f4efff','#6340b6','#e5ddf8','#edf0c5'], background:'#f4efff', ink:'#262039' },
  { id:'midnight', name:'03 / Midnight lab', description:'Navy, ice cyan, illuminated workbench.', colors:['#131f2a','#a3e4e5','#233443','#bce6da'], background:'#131f2a', ink:'#eaf0f5' },
];
(async () => {
  const browser = await chromium.launch({ executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true });
  const errors = [];
  try {
    const page = await browser.newPage({ viewport:{width:1440,height:1000}, reducedMotion:'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    const css = fs.readFileSync(path.join(output,'color-options.css'),'utf8');
    for (const palette of palettes) {
      await page.setViewportSize({width:1440,height:1000});
      await page.goto('http://127.0.0.1:3000/');
      await page.evaluate(() => document.fonts.ready);
      await page.addStyleTag({content:css});
      if (palette.id !== 'cream') await page.evaluate(id => document.documentElement.dataset.colorPreview = id, palette.id);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.screenshot({path:path.join(output,`${palette.id}-desktop.png`)});
      await page.locator('#experience').evaluate(element => element.scrollIntoView({block:'start'}));
      await page.screenshot({path:path.join(output,`${palette.id}-experience.png`)});
      await page.setViewportSize({width:390,height:844});
      await page.evaluate(() => scrollTo(0,0));
      await page.screenshot({path:path.join(output,`${palette.id}-mobile.png`)});
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) throw new Error(`${palette.id}: mobile overflow`);
    }
    const cards = palettes.map(p => `<article style="background:${p.background};color:${p.ink}"><h2>${p.name}</h2><p>${p.description}</p><div class="swatches">${p.colors.map(c => `<span style="background:${c}"></span>`).join('')}</div><img src="${p.id}-desktop.png" alt="${p.name}: desktop hero"><img src="${p.id}-experience.png" alt="${p.name}: experience section"></article>`).join('');
    const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Yash Kamerkar — color directions</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;padding:40px;background:#e3e4e8;color:#262937;font-family:Arial,sans-serif}h1{font-size:32px;margin:0 0 10px}body>p{font-size:16px;margin:0 0 28px}.options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}article{border:1px solid #9299a555;border-radius:12px;overflow:hidden;padding:24px 0 0}article h2{font-size:23px;margin:0 24px 10px}article p{font-size:15px;margin:0 24px 16px}.swatches{display:flex;gap:8px;margin:0 24px 24px}.swatches span{width:29px;height:29px;border-radius:50%;border:1px solid #7d899755}img{display:block;width:100%;height:auto;border-top:1px solid #9299a533}img+img{margin-top:16px}@media(max-width:900px){.options{grid-template-columns:1fr}body{padding:22px}}</style><h1>Three color directions. Your actual portfolio.</h1><p>Same content and layout — compare the first impression and the experience section. These are review options, not permanent website modes.</p><div class="options">${cards}</div></html>`;
    fs.writeFileSync(path.join(output,'color-options.html'),html);
    await page.setViewportSize({width:2100,height:1400});
    await page.goto(`file:///${path.join(output,'color-options.html').replaceAll('\\','/')}`);
    await page.screenshot({path:path.join(output,'color-options.png'),fullPage:true});
    console.log(JSON.stringify({palettes:palettes.length,errors,output:'docs/design/color-options.png'}));
    if (errors.length) process.exitCode=1;
  } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exitCode=1;});
