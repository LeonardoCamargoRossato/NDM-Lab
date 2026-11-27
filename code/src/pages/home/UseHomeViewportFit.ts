import {useLayoutEffect,type RefObject} from 'react';

/** Fit the real content, not a hidden scrollbar. Preserve natural scrolling if a
 * very small or zoomed viewport would require illegibly shrinking the page. */
export function useHomeViewportFit(heroRef:RefObject<HTMLElement|null>){
  useLayoutEffect(()=>{
    const hero=heroRef.current;
    const main=hero?.closest<HTMLElement>('.home-main');
    const app=main?.closest<HTMLElement>('.home-app');
    if(!hero||!main||!app)return;
    const header=app.querySelector<HTMLElement>('.topbar');
    const footer=app.querySelector<HTMLElement>('footer');
    const fit=()=>{
      const relaxed=main.dataset.fitRelaxed==='true';
      const height=relaxed?window.innerHeight-(header?.offsetHeight??0)-(footer?.offsetHeight??0):main.clientHeight;
      const scale=Math.min(1,(height-6)/Math.max(1,hero.offsetHeight),(main.clientWidth-4)/Math.max(1,hero.offsetWidth));
      const allowScroll=scale<0.65||window.innerWidth<320||window.innerHeight<280;
      main.dataset.fitRelaxed=String(allowScroll);
      hero.style.setProperty('--home-fit',String(allowScroll?1:Math.max(0,scale)));
    };
    fit();
    const observer=new ResizeObserver(fit);
    observer.observe(main);observer.observe(hero);
    if(header)observer.observe(header);
    if(footer)observer.observe(footer);
    window.addEventListener('resize',fit);
    window.visualViewport?.addEventListener('resize',fit);
    document.addEventListener('fullscreenchange',fit);
    return ()=>{
      observer.disconnect();window.removeEventListener('resize',fit);
      window.visualViewport?.removeEventListener('resize',fit);
      document.removeEventListener('fullscreenchange',fit);
      delete main.dataset.fitRelaxed;hero.style.removeProperty('--home-fit');
    };
  },[heroRef]);
}
