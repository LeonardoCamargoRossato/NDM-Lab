import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const inventory=JSON.parse(fs.readFileSync('../documentation/AssetInventory.json','utf8'));
test('required release originals and previews exist and recorded hashes match',()=>{
 const names=['about-author/profile/AuthorProfile.jpeg','about-author/profile/AuthorProfile.webp','home/hero/HumanDecisionMakingHeroOrganic.webp','home/hero/HumanDecisionMakingHero.svg','home/background/HomeBackground.png','home/background/HomeBackground.webp','home/hero/HumanDecisionMakingHero.png','home/hero/HumanDecisionMakingHero.webp','home/rpd/RpdThreeExamples.png','course-te279/branding/Te279Emblem.png','course-te279/branding/Te279Emblem.webp','branding/LcrLogo.png','branding/LcrLogo.webp','branding/WebSeerBrandCandidate.png','branding/WebSeerBrandCandidate.webp','webseer/cover/WebSeerCover.png','webseer/cover/WebSeerCover.webp',...['ReferenceHome','ReferenceSidebar','ReferenceLearnMore'].flatMap(n=>['png','webp'].map(ext=>'template/screenshots/'+n+'.'+ext))];
 for(const name of names){
  const path='code/public/assets/'+name;
  const entry=inventory.assets.find(a=>a.path===path);
  assert.ok(entry,'Missing inventory: '+path);
  const bytes=fs.readFileSync('../'+path);
  assert.ok(bytes.length>0,path);
  if(entry.sha256)assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256,path);
  if(entry.git_blob_sha)assert.equal(createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),entry.git_blob_sha,path);
 }
 assert.ok(!fs.existsSync('../Assets Novos Temporários'),'Temporary intake must not ship');
});

test('Decision Landscape matches both approved SHA-256 values and dimensions',()=>{
 const original=fs.readFileSync('public/assets/home/background/HomeBackground.png');
 const optimized=fs.readFileSync('public/assets/home/background/HomeBackground.webp');
 assert.equal(createHash('sha256').update(original).digest('hex'),'33701e034858e1eb3d45da0b41f7c25abc8a7c54a5ba48a49bca7b2fe48c0371');
 assert.equal(createHash('sha256').update(optimized).digest('hex'),'78e6b2558229b7babbab34c5212209a7f2ebf149e37fc9b179aad3d0b43dbe02');
 assert.equal(original.readUInt32BE(16),1672);assert.equal(original.readUInt32BE(20),941);
 assert.equal(original.length,2471826);assert.equal(optimized.length,112512);
});

test('organic Hero SVG is unchanged and has no active or external content',()=>{
 const bytes=fs.readFileSync('public/assets/home/hero/HumanDecisionMakingHero.svg');
 const svg=bytes.toString('utf8');
 assert.equal(bytes.length,3352667);
 assert.equal(createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),'d3f7c39040916c5e89f5f8b757f5aa19abbac1b7');
 assert.match(svg,/<svg\b/i);
 assert.doesNotMatch(svg,/<(?:[\w.-]+:)?(?:script|foreignObject|iframe|object|embed)\b|<!DOCTYPE|<!ENTITY|\son[a-z]+\s*=|@import/i);
 for(const match of svg.matchAll(/(?:href|src)\s*=\s*["']([^"']*)["']/gi)) assert.match(match[1],/^(?:#|data:image\/(?:png|jpeg|webp);base64,)/i,'Nonlocal SVG reference');
 console.log('ORGANIC_HERO_SHA256 '+createHash('sha256').update(bytes).digest('hex'));
});

test('official portrait is exact and organic WebP is optimized',()=>{
 const jpeg=fs.readFileSync('public/assets/about-author/profile/AuthorProfile.jpeg');
 const webp=fs.readFileSync('public/assets/about-author/profile/AuthorProfile.webp');
 const gitHash=bytes=>createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
 assert.equal(gitHash(jpeg),'e075f98c2e71eb0465a91731bc3770fdf06ca162');
 assert.equal(gitHash(webp),'ad311ecaa26b0b37ba26bbea7fec36a41aae9e61');
 const hero=fs.readFileSync('public/assets/home/hero/HumanDecisionMakingHeroOrganic.webp');
 assert.ok(hero.length<=350000);assert.equal(hero.toString('ascii',8,12),'WEBP');
});

test('public speaking gallery retains exact source order and all twenty verified variants',()=>{
 const content=JSON.parse(fs.readFileSync('src/content/AuthorContent.json','utf8'));
 assert.deepEqual(content.gallery.map(x=>x.photoNumber),[9,11,8,12,1,2,3,4,5,6]);
 assert.ok(content.gallery.every(x=>x.visible));assert.equal(content.about.pt.bio.length,8);assert.equal(content.about.en.bio.length,8);
 for(const item of content.gallery)for(const key of ['card','full']){
  const path='code/public/'+item.media[key];const asset=inventory.assets.find(x=>x.path===path);
  assert.ok(asset,path);assert.equal(asset.editorial_id,item.id);assert.equal(asset.sort_order,item.sortOrder);
  const data=fs.readFileSync('../'+path);assert.equal(createHash('sha256').update(data).digest('hex'),asset.sha256);
 }
 assert.equal(fs.readdirSync('public/assets/about-author/speaking-gallery/webp').length,10);
 assert.equal(fs.readdirSync('public/assets/about-author/speaking-gallery/png').length,10);
});
