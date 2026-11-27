const root=import.meta.env.BASE_URL+'assets/';
export const assets={hero:root+'home/hero/HumanDecisionMakingHero.webp',heroOriginal:root+'home/hero/HumanDecisionMakingHero.png',rpdOriginal:root+'home/rpd/RpdThreeExamples.png',te279Emblem:root+'course-te279/branding/Te279Emblem.webp',te279EmblemOriginal:root+'course-te279/branding/Te279Emblem.png',itaLogo:root+'branding/ItaLogo.svg',webSeerCover:root+'webseer/cover/WebSeerCover.webp',webSeerCoverOriginal:root+'webseer/cover/WebSeerCover.png',lcrLogo:root+'branding/LcrLogo.webp',webSeerBrand:root+'branding/WebSeerBrandCandidate.webp'} as const;
export function webSeerImage(n:number,format:'png'|'webp'){return root+'webseer/gallery/Capa'+String(n).padStart(2,'0')+'.'+format;}

export const templateScreenshots=['ReferenceHome','ReferenceSidebar','ReferenceLearnMore'].map(name=>({name,preview:root+'template/screenshots/'+name+'.webp',original:root+'template/screenshots/'+name+'.png'}));
