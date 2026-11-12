// Renderiza a animação quadro a quadro (30 fps) usando Playwright/Chromium.
// Uso: node render.js            -> todos os quadros em ./frames
//      node render.js 12.5 20    -> só os quadros nesses segundos (teste)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{
  const html=path.resolve(__dirname,'animacao.html'), out=path.resolve(__dirname,'frames');
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
  await p.goto('file://'+html); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(800);
  const dur=await p.evaluate(()=>window.DURATION);
  const args=process.argv.slice(2).map(Number);
  const times=args.length?args:Array.from({length:Math.round(dur*30)},(_,i)=>i/30);
  fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(out,{recursive:true});
  for(let i=0;i<times.length;i++){
    await p.evaluate(t=>window.seek(t),times[i]);
    await p.screenshot({path:`${out}/f${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:93});
  }
  await b.close();
})();
