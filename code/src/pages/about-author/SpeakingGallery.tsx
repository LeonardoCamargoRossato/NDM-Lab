import {useRef,useState} from 'react';
import {useLanguage} from '../../locales/LanguageContext';
import ImageViewer from '../../components/viewers/ImageViewer';
import content from '../../content/AuthorContent.json';

const items=content.gallery;
const local=(path:string)=>import.meta.env.BASE_URL+path;
export default function SpeakingGallery(){
 const {t,lang}=useLanguage();
 const [expanded,setExpanded]=useState(false);
 const [active,setActive]=useState(0);
 const [selected,setSelected]=useState<number|null>(null);
 const rail=useRef<HTMLDivElement>(null);
 const title=(item:typeof items[number])=>lang==='pt'?item.titlePt:item.titleEn;
 function move(direction:number){
  const node=rail.current;if(!node)return;
  const next=Math.max(0,Math.min(items.length-1,active+direction));
  const target=node.children.item(next) as HTMLElement|null;
  if(target)node.scrollTo({left:Math.min(node.scrollWidth-node.clientWidth,target.offsetLeft-node.offsetLeft),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  setActive(next);
 }
 function sync(){
  const node=rail.current;if(!node)return;
  const left=node.getBoundingClientRect().left;
  const index=Array.from(node.children).findIndex(el=>el.getBoundingClientRect().right>left+8);
  if(index>=0)setActive(index);
 }
 function card(item:typeof items[number],index:number,grid=false){return <button type="button" key={item.id} className={grid?'speaking-grid-card':'speaking-card'} data-photo-number={item.photoNumber} onClick={()=>setSelected(index)} aria-label={title(item)}><img src={local(item.media.card)} alt={title(item)} loading="lazy" decoding="async"/><span>{title(item)}</span></button>}
 return <section className="speaking-gallery" aria-label={t('Experiências & Apresentações','Experiences & Presentations')}>
  <div className="speaking-heading"><div><h2>{t('Experiências & Apresentações','Experiences & Presentations')}</h2><p>{t('Palestras, cursos, eventos e apresentações técnicas.','Talks, courses, events and technical presentations.')}</p></div>
  <div className="speaking-controls"><span aria-live="polite">{active+1} / {items.length}</span><button type="button" aria-expanded={expanded} aria-controls="speaking-grid" aria-label={expanded?t('Ocultar todas as imagens','Hide all gallery images'):t('Mostrar todas as imagens','Show all gallery images')} onClick={()=>setExpanded(v=>!v)}>▦</button><button type="button" aria-label={t('Imagens anteriores','Previous images')} onClick={()=>move(-1)}>‹</button><button type="button" aria-label={t('Próximas imagens','Next images')} onClick={()=>move(1)}>›</button></div></div>
  <div className="speaking-rail" ref={rail} onScroll={sync}>{items.map((item,index)=>card(item,index))}</div>
  {expanded&&<div className="speaking-grid" id="speaking-grid">{items.map((item,index)=>card(item,index,true))}</div>}
  {selected!==null&&<ImageViewer src={local(items[selected].media.full)} alt={title(items[selected])} onDismiss={()=>setSelected(null)}/>}
 </section>;
}
