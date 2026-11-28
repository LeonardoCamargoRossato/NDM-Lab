import {useRef} from 'react';
import {useLanguage} from '../../locales/LanguageContext';
import {portfolio} from '../../content/AcademicContent';
import {assets} from '../../lib/Assets';
import InteractiveAppPreview from '../../components/viewers/InteractiveAppPreview';
import SpeakingGallery from './SpeakingGallery';
import content from '../../content/AuthorContent.json';

const skills=['AI Engineering','Software Development','RAG','Data Science','Graph','Quantum Technologies'];
export default function AuthorPage(){
 const {t,lang}=useLanguage();
 const about=content.about[lang==='pt'?'pt':'en'];
 const details=useRef<HTMLDialogElement>(null);
 return <div className="author-experience">
  <section className="author-profile">
   <div className="author-identity"><img className="author-profile-photo" src={assets.authorProfile} alt="Leonardo Camargo Rossato" width="170" height="170"/><div><h1>Leonardo Camargo Rossato</h1><p className="author-role">AI Engineer &amp; Software Developer</p></div></div>
   <div className="author-education"><p><a href="https://www.ita.br/" target="_blank" rel="noopener noreferrer">ITA</a> — {t('Doutorando em Engenharia Eletrônica e Computação','PhD candidate in Electronic Engineering and Computing')}</p><p>{t('Mestre em Física','MSc in Physics')} — <a href="https://www.ufrgs.br/" target="_blank" rel="noopener noreferrer">UFRGS</a> | {t('Bacharel em Física','BSc in Physics')} — <a href="https://www.ufsm.br/" target="_blank" rel="noopener noreferrer">UFSM</a></p></div>
   <div className="author-skills" aria-label={t('Áreas de atuação','Areas of expertise')}>{skills.map(skill=><span key={skill}>{skill}</span>)}</div>
   <h2>{t('Sobre','About')}</h2><p>{about.intro}</p>
   {about.bio.slice(0,3).map(line=><p key={line}>{line}</p>)}
   <button className="author-read-more" onClick={()=>details.current?.showModal()}>{t('Leia mais','Read more')} ↗</button>
   <p className="author-portfolio-summary"><strong>{t('Meu portfólio:','My Portfolio:')}</strong> {t('Meu portfólio reúne projetos de inteligência artificial, engenharia de software e pesquisa científica, conectando desenvolvimento tecnológico, análise de dados e aplicações reais.','My portfolio brings together artificial intelligence, software engineering and scientific research projects, connecting technology development, data analysis and real-world applications.')}</p>
   <dialog className="author-details" ref={details} aria-labelledby="author-details-title"><div className="author-details-heading"><h2 id="author-details-title">{t('Sobre','About')}</h2><button type="button" aria-label={t('Fechar','Close')} onClick={()=>details.current?.close()}>×</button></div><p>{about.intro}</p>{about.bio.map(line=><p key={line}>{line}</p>)}</dialog>
  </section>
  <div className="author-portfolio-column"><InteractiveAppPreview url={portfolio} title="LCR Portfolio" referenceWidth={1440} referenceHeight={1080} action={t('Abrir portfólio','Open App')} loadingLabel={t('Carregando portfólio…','Loading portfolio…')} fallbackLabel={t('Não foi possível confirmar o carregamento. Abra o portfólio em uma nova aba.','Loading could not be confirmed. Open the portfolio in a new tab.')}/><SpeakingGallery/></div>
 </div>;
}
