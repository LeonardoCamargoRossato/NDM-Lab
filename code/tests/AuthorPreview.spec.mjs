import {test,expect} from '@playwright/test';
const portfolio='https://leonardocamargorossato.github.io/LCR-SolutionsArchitecture-IA-Quantum/';
test('author preview geometry, independent action, locale and route isolation',async({page,context},info)=>{
 const remote=[];page.on('request',r=>{if(r.url().startsWith(portfolio))remote.push(r.url())});
 // Deterministic fixture only for local component behavior; real portfolio checked separately.
 await context.route(portfolio+'**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><body style="margin:0"><button onclick="this.textContent=\'Activated\'">Preview action</button><div style="height:1600px">Scrollable preview fixture</div></body></html>'}));
 await page.goto('./');expect(remote).toHaveLength(0);await expect(page.locator('iframe')).toHaveCount(0);
 await page.getByRole('link',{name:'Sobre o autor',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Leonardo Camargo Rossato'})).toBeVisible();
 await expect(page.locator('.author-skills span')).toHaveCount(6);
 const photo=page.locator('.author-profile-photo');await expect.poll(()=>photo.evaluate(el=>el.complete&&el.naturalWidth>0)).toBeTruthy();
 const frame=page.locator('.app-preview-stage iframe');await frame.scrollIntoViewIfNeeded();
 await expect(frame).toHaveAttribute('title','LCR Portfolio');await expect(frame).toHaveAttribute('src',portfolio+'#/');
 const stage=await page.locator('.app-preview-stage').boundingBox(),f=await frame.boundingBox();
 expect(Math.abs(stage.width/stage.height-4/3)).toBeLessThan(.02);expect(Math.abs(stage.width-f.width)).toBeLessThan(2);expect(Math.abs(stage.height-f.height)).toBeLessThan(2);
 expect(await frame.evaluate(el=>[el.offsetWidth,el.offsetHeight])).toEqual([1440,1080]);
 if(info.project.name==='1440x900'||info.project.name==='1920x1080'||info.project.name==='1366x768'){
  const profile=await page.locator('.author-profile').boundingBox();expect(stage.width/profile.width).toBeGreaterThan(1.8);
  await page.locator('.app-preview').hover();await expect(page.locator('.app-preview-action')).toHaveCSS('opacity','1');
  await page.locator('.app-preview-open').focus();await expect(page.locator('.app-preview-action')).toHaveCSS('opacity','1');
 }
 const button=page.frameLocator('iframe').getByRole('button',{name:'Preview action'});await button.click();await expect(page.frameLocator('iframe').getByRole('button',{name:'Activated',exact:true})).toBeVisible();
 await page.frameLocator('iframe').locator('body').evaluate(el=>el.ownerDocument.defaultView.scrollTo(0,500));
 expect(await page.frameLocator('iframe').locator('body').evaluate(el=>el.ownerDocument.defaultView.scrollY)).toBeGreaterThan(0);
 const action=page.getByRole('link',{name:/Abrir portfólio/}).filter({visible:true});await expect(action).toHaveAttribute('target','_blank');
 const popupPromise=page.waitForEvent('popup');await action.click();const popup=await popupPromise;await popup.waitForLoadState();expect(popup.url()).toContain(portfolio);await popup.close();
 await page.getByRole('button',{name:'Idioma'}).click();await page.getByRole('button',{name:'EN-US'}).click();
 await expect(page.getByRole('link',{name:/Open App/}).filter({visible:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 await page.getByRole('link',{name:'Home',exact:true}).click();await expect(page.locator('iframe')).toHaveCount(0);
});

test('author profile, official gallery order, lazy PNG, carousel, grid and viewer',async({page,context},info)=>{
 const png=[];const gallery=[];page.on('request',r=>{if(r.url().includes('/speaking-gallery/'))gallery.push(r.url());if(r.url().includes('/speaking-gallery/png/'))png.push(r.url())});
 await context.route(portfolio+'**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><body>Local preview fixture</body></html>'}));
 await page.goto('./');expect(gallery).toHaveLength(0);
 await page.goto('./#/sobre-o-autor');
 for(const [name,url] of [['ITA','https://www.ita.br/'],['UFRGS','https://www.ufrgs.br/'],['UFSM','https://www.ufsm.br/']]){const a=page.getByRole('link',{name,exact:true});await expect(a).toHaveAttribute('href',url);await expect(a).toHaveAttribute('target','_blank')}
 await expect(page.locator('.author-profile')).toHaveCSS('background-color','rgba(35, 77, 112, 0.035)');
 const photo=await page.locator('.author-profile-photo').boundingBox(),name=await page.locator('.author-identity h1').boundingBox();expect(photo.x+photo.width).toBeLessThanOrEqual(name.x+1);
 await page.getByRole('button',{name:/Leia mais/}).click();const modal=page.getByRole('dialog');await expect(modal).toBeVisible();await expect(modal.locator('p')).toHaveCount(9);await page.keyboard.press('Escape');await expect(modal).not.toBeVisible();
 const rail=page.locator('.speaking-rail');await rail.scrollIntoViewIfNeeded();const cards=rail.locator('.speaking-card');await expect(cards).toHaveCount(10);
 expect(await cards.evaluateAll(els=>els.map(el=>Number(el.getAttribute('data-photo-number'))))).toEqual([9,11,8,12,1,2,3,4,5,6]);
 const preview=await page.locator('.app-preview').boundingBox(),section=await page.locator('.speaking-gallery').boundingBox();expect(section.y).toBeGreaterThan(preview.y+preview.height-1);expect(Math.abs(section.width-preview.width)).toBeLessThan(2);
 await expect.poll(()=>cards.first().locator('img').evaluate(el=>el.complete&&el.naturalWidth>0)).toBeTruthy();expect(png).toHaveLength(0);
 await page.getByRole('button',{name:'Próximas imagens'}).click();await expect.poll(()=>rail.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
 await page.getByRole('button',{name:'Imagens anteriores'}).click();await expect.poll(()=>rail.evaluate(el=>el.scrollLeft)).toBeLessThan(3);
 await page.getByRole('button',{name:'Mostrar todas as imagens'}).click();const grid=page.locator('.speaking-grid');await expect(grid.locator('button')).toHaveCount(10);
 await grid.locator('button').first().click();const viewer=page.locator('.image-viewer');await expect(viewer).toBeVisible();await expect.poll(()=>viewer.locator('img').evaluate(el=>el.complete&&el.naturalWidth>0)).toBeTruthy();expect(png).toHaveLength(1);
 await viewer.getByRole('button',{name:'Ampliar'}).click();await expect(viewer.getByRole('textbox',{name:'Percentual de zoom'})).toHaveValue('110');
 await expect(viewer.getByRole('link',{name:'Download'})).toHaveAttribute('href',/Speaking09\.png$/);
 await page.keyboard.press('Escape');await expect(viewer).toHaveCount(0);await expect(grid.locator('button').first()).toBeFocused();
 await page.getByRole('button',{name:'Ocultar todas as imagens'}).click();await expect(grid).toHaveCount(0);
 await page.getByRole('button',{name:'Idioma'}).click();await page.getByRole('button',{name:'EN-US'}).click();await expect(page.getByRole('heading',{name:'Experiences & Presentations'})).toBeVisible();await expect(page.getByRole('button',{name:/Read more/})).toBeVisible();
 await page.screenshot({path:info.outputPath('author-gallery-en.png'),fullPage:true});
});
