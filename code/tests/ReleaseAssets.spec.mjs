import {test,expect} from '@playwright/test';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';

test('Home assets, original RPD and complete viewer controls',async({page},info)=>{
 const requests=[];
 page.on('request',r=>{if(r.url().endsWith('/RpdThreeExamples.png'))requests.push(r.url())});
 await page.goto('./');
 for(const selector of ['.decision-hero','.research-card img']){
  for(const image of await page.locator(selector).all())await expect.poll(()=>image.evaluate(el=>el.complete&&el.naturalWidth>0)).toBeTruthy();
 }
 expect(requests).toHaveLength(0);
 const trigger=page.getByRole('button',{name:'Entenda o que é RPD'});
 await expect(trigger).toBeEnabled();
 const oldScroll=await page.evaluate(()=>window.scrollY);
 await trigger.click();
 const viewer=page.getByRole('dialog');
 await expect(viewer).toBeVisible();
 const image=viewer.locator('img');
 await expect.poll(()=>image.evaluate(el=>el.complete&&el.naturalWidth===1491&&el.naturalHeight===1055)).toBeTruthy();
 expect(requests).toHaveLength(1);
 const zoom=viewer.getByRole('textbox',{name:'Percentual de zoom'});
 await expect(zoom).toHaveValue('100');
 await viewer.getByRole('button',{name:'Ampliar'}).click();
 await expect(zoom).toHaveValue('110');
 await viewer.getByRole('button',{name:'Reduzir'}).click();
 await expect(zoom).toHaveValue('100');
 await zoom.fill('73');await zoom.press('Enter');await expect(zoom).toHaveValue('73');
 const stage=viewer.locator('.viewer-stage');
 await stage.hover();await page.mouse.wheel(0,-100);await expect(zoom).toHaveValue('83');
 const rect=await stage.boundingBox();
 const before=await image.evaluate(el=>el.style.transform);
 await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);
 await page.mouse.down();await page.mouse.move(rect.x+rect.width/2+40,rect.y+rect.height/2+30,{steps:5});await page.mouse.up();
 await expect.poll(()=>image.evaluate(el=>el.style.transform)).not.toBe(before);
 const downloadPromise=page.waitForEvent('download');
 await viewer.getByRole('link',{name:'Download'}).click();
 const download=await downloadPromise;
 expect(download.suggestedFilename()).toBe('RpdThreeExamples.png');
 expect(createHash('sha256').update(await readFile(await download.path())).digest('hex')).toBe('59a1920363e35e122c373d86c7e56562f34f4309c69974c15b1890c20f91e9da');
 const full=viewer.getByRole('button',{name:'Tela cheia'});
 expect(await page.evaluate(()=>document.fullscreenEnabled)).toBeTruthy();
 await full.click();await expect.poll(()=>page.evaluate(()=>document.fullscreenElement?.classList.contains('viewer-content')||false)).toBe(true);
 await page.screenshot({path:info.outputPath('rpd-fullscreen.png')});
 await full.click();await expect.poll(()=>page.evaluate(()=>document.fullscreenElement===null)).toBe(true);
 await expect.poll(()=>page.evaluate(()=>document.body.style.overflow)).toBe('hidden');
 await viewer.getByRole('button',{name:'Fechar',exact:true}).click();
 await expect(viewer).toHaveCount(0);await expect(trigger).toBeFocused();
 await expect.poll(()=>page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
 // Trigger may scroll into view on narrow viewports. Check restoration relative to reopened state.
 if(info.project.name==='1440x900')expect(await page.evaluate(()=>window.scrollY)).toBe(oldScroll);
 await trigger.click();await page.keyboard.press('Escape');await expect(viewer).toHaveCount(0);await expect(trigger).toBeFocused();
 await page.evaluate(()=>Object.defineProperty(document,'fullscreenEnabled',{configurable:true,value:false}));
 await trigger.click();await viewer.getByRole('button',{name:'Tela cheia'}).click();
 await expect(viewer.getByRole('status')).toContainText('Tela cheia indisponível');
 await viewer.getByRole('button',{name:'Fechar',exact:true}).click();
});

test('dropdown marks, template screenshots and original cover on demand',async({page},info)=>{
 const originals=[];
 page.on('request',r=>{if(/\/(Reference(Home|Sidebar|LearnMore)|WebSeerCover)\.png$/.test(r.url()))originals.push(r.url())});
 await page.goto('./');
 await page.getByRole('button',{name:'Saiba mais'}).click();
 for(const name of ['Sobre o WebSeer','Sobre o template']){
  const img=page.getByRole('link',{name,exact:true}).locator('img');
  await expect.poll(()=>img.evaluate(el=>el.complete&&el.naturalWidth>0)).toBeTruthy();
 }
 await page.getByRole('link',{name:'Sobre o template'}).click();
 const cards=page.locator('.screenshot-gallery .screenshot-card');
 await expect(cards).toHaveCount(3);
 for(const card of await cards.all()){
  await card.scrollIntoViewIfNeeded();
  await expect.poll(()=>card.locator('img').evaluate(el=>el.complete&&el.naturalWidth>0)).toBeTruthy();
 }
 expect(originals).toHaveLength(0);
 await page.screenshot({path:info.outputPath('template-gallery.png'),fullPage:true});
 for(let i=0;i<3;i++){
  await cards.nth(i).click();
  const viewer=page.getByRole('dialog');
  await expect.poll(()=>viewer.locator('img').evaluate(el=>el.complete&&el.naturalWidth>0)).toBeTruthy();
  await viewer.getByRole('button',{name:'Fechar',exact:true}).click();
 }
 expect(originals).toHaveLength(3);
 await page.goto('./#/webseer');
 const cover=page.locator('.webseer-cover-card');
 await cover.scrollIntoViewIfNeeded();
 await expect.poll(()=>cover.locator('img').evaluate(el=>el.complete&&el.naturalWidth>0)).toBeTruthy();
 expect(originals).toHaveLength(3);
 await cover.click();
 const viewer=page.getByRole('dialog');
 await expect.poll(()=>viewer.locator('img').evaluate(el=>el.complete&&el.naturalWidth>0)).toBeTruthy();
 await expect(viewer.getByRole('link',{name:'Download'})).toHaveAttribute('href',/WebSeerCover\.png$/);
 expect(originals).toHaveLength(4);
 await viewer.getByRole('button',{name:'Fechar',exact:true}).click();
});

test.describe('touch input',()=>{
 test.use({hasTouch:true});
 test('RPD viewer responds to real Chromium touch events',async({page,context},info)=>{
  await page.goto('./');await page.getByRole('button',{name:'Entenda o que é RPD'}).tap();
  const viewer=page.getByRole('dialog');
  const stage=viewer.locator('.viewer-stage');
  const image=viewer.locator('img');
  await expect.poll(()=>image.evaluate(el=>el.complete&&el.naturalWidth>0)).toBeTruthy();
  await viewer.getByRole('button',{name:'Ampliar'}).tap();
  const box=await stage.boundingBox();
  const x=Math.round(box.x+box.width/2),y=Math.round(box.y+box.height/2);
  const before=await image.evaluate(el=>el.style.transform);
  const cdp=await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+35,y:y+25}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});

  await expect.poll(()=>image.evaluate(el=>el.style.transform)).not.toBe(before);
  await page.screenshot({path:info.outputPath('rpd-touch.png')});
  const close=viewer.getByRole('button',{name:'Fechar',exact:true});
  const closeBox=await close.boundingBox();
  const closePoint={x:Math.round(closeBox.x+closeBox.width/2),y:Math.round(closeBox.y+closeBox.height/2)};
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[closePoint]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect(viewer).toHaveCount(0);
  await cdp.detach();
 });
});
