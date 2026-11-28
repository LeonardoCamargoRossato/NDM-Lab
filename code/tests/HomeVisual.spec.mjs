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
  const parent=await page.locator('.hero-actions').boundingBox(),cardBox=await card.boundingBox();
  expect(cardBox.width/parent.width).toBeGreaterThan(.98);
  expect(m.x+m.width).toBeLessThanOrEqual(c.x+1);expect(i.width/m.width).toBeGreaterThan(.98);
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 const cards=await page.locator('.research-card').all();const first=await cards[0].boundingBox(),second=await cards[1].boundingBox();expect(first.y+first.height).toBeLessThanOrEqual(second.y+1);await page.screenshot({path:info.outputPath('home-media-first.png'),fullPage:true});
});

test('Decision Landscape covers the entire Home at 35 percent and loads only the approved WebP',async({page},info)=>{
 const requests=[],failures=[];
 page.on('request',r=>{if(/HomeBackground\.(png|webp)(?:$|\?)/.test(r.url()))requests.push(r.url())});
 page.on('response',r=>{if(r.status()>=400&&new URL(r.url()).hostname==='127.0.0.1')failures.push(r.url())});
 await page.goto('./#/webseer');await expect(page.getByRole('heading',{name:'WebSeer',exact:true})).toBeVisible();
 await expect(page.locator('.home-background')).toHaveCount(0);expect(requests).toHaveLength(0);
 await page.goto('./#/');
 const main=page.locator('main.home-main'),layer=main.locator('.home-background');
 await expect(layer).toHaveAttribute('aria-hidden','true');
 await expect(layer).toHaveCSS('opacity','0.35');await expect(main).toHaveCSS('background-color','rgb(255, 255, 255)');
 await expect(main.locator('.hero')).toHaveCSS('opacity','1');
 await expect(layer).toHaveCSS('background-size','cover');await expect(layer).toHaveCSS('pointer-events','none');await expect(layer).toHaveCSS('background-repeat','no-repeat');
 const m=await main.boundingBox(),b=await layer.boundingBox();
 expect(Math.abs(m.x-b.x)).toBeLessThan(1);expect(Math.abs(m.y-b.y)).toBeLessThan(1);
 expect(Math.abs(m.width-b.width)).toBeLessThan(1);expect(Math.abs(m.height-b.height)).toBeLessThan(1);
 expect(m.x).toBe(0);expect(m.width).toBe(await page.evaluate(()=>window.innerWidth));
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 const bg=await layer.evaluate(el=>window.getComputedStyle(el).backgroundImage);expect(bg).toMatch(/HomeBackground\.webp/);
 const dimensions=await layer.evaluate(async el=>{const url=window.getComputedStyle(el).backgroundImage.slice(5,-2);const image=document.createElement('img');image.src=url;await image.decode();return [image.naturalWidth,image.naturalHeight]});
 expect(dimensions).toEqual([1672,941]);
 expect(requests.some(u=>u.endsWith('/HomeBackground.webp'))).toBeTruthy();expect(requests.some(u=>u.endsWith('.png'))).toBeFalsy();
 await expect(page.locator('.hero h1')).toBeVisible();await expect(page.locator('.research-card')).toHaveCount(2);
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:info.outputPath('decision-landscape-35.png'),fullPage:true});
 if(info.project.name==='1920x1080'){
  for(const opacity of [0.30,0.35,0.40]){
   await layer.evaluate((el,value)=>el.style.setProperty('--background-opacity',String(value)),opacity);
   await expect(layer).toHaveCSS('opacity',String(opacity));
   await page.screenshot({path:info.outputPath('comparison-'+Math.round(opacity*100)+'.png'),fullPage:true});
  }
  await layer.evaluate(el=>el.style.setProperty('--background-opacity','0.35'));
 }
 await page.getByRole('link',{name:/WebSeer/}).first().click();
 await expect(page.getByRole('heading',{name:'WebSeer',exact:true})).toBeVisible();await expect(page.locator('.home-background')).toHaveCount(0);
 expect(failures).toEqual([]);expect(requests.some(u=>u.endsWith('.png'))).toBeFalsy();
});

test('organic Hero fills its responsive column, retains transparency and loads only on Home',async({page},info)=>{
 const requests=[];const failures=[];
 page.on('request',r=>{if(/HumanDecisionMakingHero(?:Organic)?\.(svg|png|webp)(?:$|\?)/.test(r.url()))requests.push(r.url())});
 page.on('response',r=>{if(r.status()>=400&&new URL(r.url()).hostname==='127.0.0.1')failures.push(r.url())});
 await page.goto('./#/webseer');await expect(page.getByRole('heading',{name:'WebSeer',exact:true})).toBeVisible();expect(requests).toHaveLength(0);
 await page.goto('./#/');const hero=page.locator('.decision-hero');const column=page.locator('.hero-visual');
 await expect(hero).toHaveAttribute('src',/HumanDecisionMakingHeroOrganic\.webp$/);await expect.poll(()=>hero.evaluate(el=>el.complete&&el.naturalWidth>0)).toBeTruthy();
 await expect(hero).toHaveCSS('opacity','1');await expect(hero).toHaveCSS('border-radius','0px');await expect(hero).toHaveCSS('background-color','rgba(0, 0, 0, 0)');await expect(hero).toHaveCSS('box-shadow','none');
 await expect(page.locator('.home-background')).toHaveCSS('opacity','0.35');
 const a=await hero.boundingBox(),b=await column.boundingBox();expect(Math.abs(a.width-b.width)).toBeLessThan(1);
 const result=await hero.evaluate(async img=>{
  await img.decode();const c=document.createElement('canvas');c.width=128;c.height=128;const ctx=c.getContext('2d');ctx.drawImage(img,0,0,128,128);
  const pixels=ctx.getImageData(0,0,128,128).data;let transparent=0,opaque=0;for(let i=3;i<pixels.length;i+=4){if(pixels[i]<16)transparent++;if(pixels[i]>240)opaque++}
  return {width:img.naturalWidth,height:img.naturalHeight,transparent,opaque};
 });
 expect(result.transparent).toBeGreaterThan(0);expect(result.opaque).toBeGreaterThan(0);
 expect(Math.abs(a.width/a.height-result.width/result.height)).toBeLessThan(.03);
 if(info.project.name==='1920x1080'||info.project.name==='1440x900'||info.project.name==='1366x768'){const copy=await page.locator('.hero-copy').boundingBox();expect(a.x).toBeGreaterThan(copy.x+copy.width-1)}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 expect(requests.some(u=>u.endsWith('HumanDecisionMakingHeroOrganic.webp'))).toBeTruthy();expect(requests.every(u=>u.endsWith('HumanDecisionMakingHeroOrganic.webp'))).toBeTruthy();
 console.log('ORGANIC_HERO_RENDER',info.project.name,result);
 await page.screenshot({path:info.outputPath('organic-hero.png'),fullPage:true});
 await page.getByRole('button',{name:'Entenda o que é RPD'}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);expect(failures).toEqual([]);
});

test('Home remains readable without clipping, allowing natural scroll on compact screens',async({page},info)=>{
 await page.goto('./');
 const sizes=info.project.name==='1440x900'?[[1440,900],[1366,600],[1280,720],[1280,1024],[320,568],[360,640],[844,390],[568,320],[2560,1440]]:[null];
 for(const size of sizes){
  if(size)await page.setViewportSize({width:size[0],height:size[1]});
  console.log('HOME_FIT_VIEWPORT',page.viewportSize());
  
  await expect(page.locator('.hero .eyebrow')).toHaveCount(0);
  await expect.poll(()=>page.evaluate(()=>{
   const w=window.innerWidth,h=window.innerHeight,main=document.querySelector('.home-main').getBoundingClientRect();
   const visible=['.topbar','footer','.hero h1','.hero-subtitle','.lead','.research-card','.research-card img','.research-card-copy','.hero-actions .primary','.decision-hero','.rpd-link'].flatMap(selector=>[...document.querySelectorAll(selector)]).every(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.x>=-1&&r.y>=-1&&r.right<=w+1&&r.bottom<=document.documentElement.scrollHeight+1});
   const content=[...document.querySelectorAll('.hero h1,.hero-subtitle,.lead,.research-card,.hero-actions .primary,.decision-hero,.rpd-link')].every(el=>{const r=el.getBoundingClientRect();return r.top>=main.top-1&&r.bottom<=main.bottom+1&&r.left>=main.left-1&&r.right<=main.right+1});
   return {visible,content,scroll:document.documentElement.scrollWidth<=w+1};
  })).toEqual({visible:true,content:true,scroll:true});
  await page.evaluate(()=>window.scrollTo(0,0));
  const viewport=page.viewportSize();await page.screenshot({path:info.outputPath('home-fit-'+viewport.width+'x'+viewport.height+'.png')});
 }
 await page.getByRole('button',{name:'Idioma'}).click();await page.getByRole('button',{name:'EN-US'}).click();
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
 await page.getByRole('button',{name:'Language'}).click();await page.getByRole('button',{name:'PT-BR'}).click();
 await page.getByRole('link',{name:/TE-279 — Tomada de Decisão Naturalista/}).click();await expect(page.locator('.home-app')).toHaveCount(0);
});
