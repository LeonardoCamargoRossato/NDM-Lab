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
