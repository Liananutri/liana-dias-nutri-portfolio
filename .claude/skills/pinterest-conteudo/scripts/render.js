#!/usr/bin/env node
// Renderiza cada <section class="slide"> de um HTML em PNG no tamanho exato.
// Uso: node render.js <arquivo.html> <pasta_saida> [--scale 1]
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const [input, outDir = 'out'] = process.argv.slice(2).filter(a => !a.startsWith('--'));
  const si = process.argv.indexOf('--scale');
  const scale = si > -1 ? Number(process.argv[si + 1]) : 1;
  if (!input) { console.error('Uso: node render.js <arquivo.html> <pasta_saida>'); process.exit(1); }
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: scale });
  // Troca FONT_DIR pela pasta de fontes do site (repo/assets/fonts) e renderiza uma cópia temporária.
  const fontDir = 'file://' + path.resolve(__dirname, '../../../../assets/fonts');
  const tmp = path.resolve(input).replace(/\.html?$/, '') + '.render.html';
  fs.writeFileSync(tmp, fs.readFileSync(input, 'utf8').replaceAll('FONT_DIR', fontDir));
  await page.goto('file://' + tmp);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');

  const slides = await page.$$('section.slide');
  if (!slides.length) { console.error('Nenhum <section class="slide"> encontrado.'); process.exit(1); }

  // Avisa sobre texto que transborda o slide.
  const overflow = await page.$$eval('section.slide', els => els.map((s, i) => {
    const r = s.getBoundingClientRect();
    const bad = [...s.querySelectorAll('*')].some(c => {
      const b = c.getBoundingClientRect();
      return b.width && (b.right > r.right + 1 || b.bottom > r.bottom + 1 || b.left < r.left - 1 || b.top < r.top - 1);
    });
    return bad ? i + 1 : null;
  }).filter(Boolean));
  if (overflow.length) console.warn('ATENÇÃO: conteúdo saindo do slide em: ' + overflow.join(', '));

  for (let i = 0; i < slides.length; i++) {
    const file = path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
    await slides[i].screenshot({ path: file });
    console.log(file);
  }
  await browser.close();
  fs.unlinkSync(tmp);
})();
