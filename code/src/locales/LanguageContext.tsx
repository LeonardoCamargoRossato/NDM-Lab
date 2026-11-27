import {createContext,useContext,useState,useEffect,type ReactNode} from 'react';
type Lang='pt'|'en';const Context=createContext<{lang:Lang;setLang:(l:Lang)=>void;t:(pt:string,en:string)=>string}>({lang:'pt',setLang:()=>{},t:pt=>pt});
export function LanguageProvider({children}:{children:ReactNode}){const [lang,setLang]=useState<Lang>('pt');useEffect(()=>{document.documentElement.lang=lang==='pt'?'pt-BR':'en-US'},[lang]);return <Context.Provider value={{lang,setLang,t:(pt,en)=>lang==='pt'?pt:en}}>{children}</Context.Provider>}
export const useLanguage=()=>useContext(Context);