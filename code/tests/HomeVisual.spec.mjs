import {test,expect} from '@playwright/test';
test('language options are horizontal and Home cards prioritize covers',async({page},info)=>{
 await page.goto('./');
 const language=page.getByRole('button',{name:'Idioma'});
 await language.click();
 const panel=page.locator('.language-dropdown');
 await expect(panel).toBeVisible();
 for(const label of ['PT-BR','EN-US']){
  const option=panel.getByRole('button',{name:label,exact:true});
  const flag=option.locator('svg');
  const text=option.locator('span');
  await expect(flag).toBeVisible();
  const f=await flag.boundingBox(),t=await text.boundingBox(),o=await option.boundingBox();
  expect(o.width).toBeGreaterThanOrEqual(120);
  expect(o.height).toBeGreaterThanOrEqual(40);
  expect(t.x).toBeGreaterThan(f.x+f.width);
  expect(Math.abs(t.y+t.height/2-f.y-f.height/2)).toBeLessThan(3);
 }
 await page.screenshot({path:info.outputPath('language-horizontal.png')});
 await panel.getByRole('button',{name:'EN-US',exact:true}).click();
 await expect(page.getByRole('link',{name:'Home',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Language'}).click();
 await panel.getByRole('button',{name:'PT-BR',exact:true}).click();
 await expect(page.getByRole('link',{name:'Início',exact:true})).toBeVisible();
 for(const card of await page.locator('.research-card').all()){
  const media=card.locator('.research-card-media'),copy=card.locator('.research-card-copy'),img=media.locator('img');
  await expect.poll(()=>img.evaluate(el=>el.complete&&el.naturalWidth>0)).toBeTruthy();
  const m=await media.boundingBox(),c=await copy.boundingBox(),i=await img.boundingBox();
  if(info.project.name==='390x844'){expect(m.y+m.height).toBeLessThanOrEqual(c.y+1);expect(i.width).toBeGreaterThan(250)}
  else{expect(m.width).toBeGreaterThan(c.width);expect(i.width).toBeGreaterThan(160)}
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 await page.screenshot({path:info.outputPath('home-media-first.png'),fullPage:true});
});
