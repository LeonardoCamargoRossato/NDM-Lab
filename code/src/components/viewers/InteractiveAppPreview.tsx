import {useEffect,useRef,useState} from 'react';

type Props={url:string;title:string;action:string;loadingLabel:string;fallbackLabel:string;referenceWidth?:number;referenceHeight?:number;hover?:boolean};

export default function InteractiveAppPreview({url,title,action,loadingLabel,fallbackLabel,referenceWidth=1440,referenceHeight=810,hover=true}:Props){
 const stage=useRef<HTMLDivElement>(null);
 const [scale,setScale]=useState(0);
 const [loaded,setLoaded]=useState(false);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const node=stage.current;if(!node)return;
  const resize=()=>setScale(node.clientWidth/referenceWidth);
  resize();const observer=new ResizeObserver(resize);observer.observe(node);
  return ()=>observer.disconnect();
 },[referenceWidth]);
 useEffect(()=>{setLoaded(false);setFailed(false);const timer=window.setTimeout(()=>setFailed(true),18000);return ()=>window.clearTimeout(timer)},[url]);
 return <section className={'app-preview'+(hover?' app-preview-hover':'')} aria-label={title}>
  <a className="app-preview-open" href={url} target="_blank" rel="noopener noreferrer" aria-label={action}><span className="app-preview-action">{action}</span><span aria-hidden="true">↗</span></a>
  <div className="app-preview-stage" ref={stage} style={{aspectRatio:referenceWidth+'/'+referenceHeight}}>
   {!loaded&&<div className="app-preview-loading" role="status">{failed?fallbackLabel:loadingLabel}</div>}
   {scale>0&&<iframe title={title} src={url} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads" onLoad={()=>{setLoaded(true);setFailed(false)}} onError={()=>setFailed(true)} style={{width:referenceWidth,height:referenceHeight,transform:'scale('+scale+')'}}/>}
  </div>
  <a className="app-preview-mobile-action" href={url} target="_blank" rel="noopener noreferrer">{action} ↗</a>
 </section>;
}
