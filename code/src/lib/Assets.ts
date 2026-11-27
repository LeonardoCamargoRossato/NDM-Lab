const root=import.meta.env.BASE_URL+'assets/';
export const assets={itaLogo:root+'branding/ItaLogo.svg',webSeerCover:root+'webseer/cover/WebSeerCover.webp'} as const;
export function webSeerImage(n:number,format:'png'|'webp'){return root+'webseer/gallery/Capa'+String(n).padStart(2,'0')+'.'+format;}
