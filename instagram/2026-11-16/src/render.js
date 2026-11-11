// Renderiza cada <section class="slide"> dos HTML desta pasta em PNG 1080x1350.
// Uso: node render.js   (a partir de instagram/<semana>/src)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const dir = __dirname;
  const out = path.join(dir, '..');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  for (const file of fs.readdirSync(dir).filter(f => (f.startsWith('carrossel') || f.startsWith('v2-')) && f.endsWith('.html'))) {
    await page.goto('file://' + path.join(dir, file));
    await page.evaluate(() => document.fonts.ready);
    const slides = await page.$$('section.slide');
    const name = file.replace('.html', '');
    for (let i = 0; i < slides.length; i++) {
      const target = path.join(out, `${name}-${String(i + 1).padStart(2, '0')}.png`);
      await slides[i].screenshot({ path: target });
    }
    console.log(name, slides.length, 'slides');
  }
  await browser.close();
})();
