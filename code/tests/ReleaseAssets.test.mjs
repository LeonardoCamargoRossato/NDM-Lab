import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const inventory=JSON.parse(fs.readFileSync('../documentation/AssetInventory.json','utf8'));
test('required release originals and previews exist and recorded hashes match',()=>{
 const names=['home/background/HomeBackground.png','home/background/HomeBackground.webp','home/hero/HumanDecisionMakingHero.png','home/hero/HumanDecisionMakingHero.webp','home/rpd/RpdThreeExamples.png','course-te279/branding/Te279Emblem.png','course-te279/branding/Te279Emblem.webp','branding/LcrLogo.png','branding/LcrLogo.webp','branding/WebSeerBrandCandidate.png','branding/WebSeerBrandCandidate.webp','webseer/cover/WebSeerCover.png','webseer/cover/WebSeerCover.webp',...['ReferenceHome','ReferenceSidebar','ReferenceLearnMore'].flatMap(n=>['png','webp'].map(ext=>'template/screenshots/'+n+'.'+ext))];
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
