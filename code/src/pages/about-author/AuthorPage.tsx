import {useLanguage} from '../../locales/LanguageContext';
import {portfolio} from '../../content/AcademicContent';
import {assets} from '../../lib/Assets';
import InteractiveAppPreview from '../../components/viewers/InteractiveAppPreview';

const skills=['AI Engineering','Software Development','Python','Data Science','RAG','Graphs','Scientific Computing','Quantum Technologies'];
export default function AuthorPage(){
 const {t}=useLanguage();
 return <div className="author-experience">
  <section className="author-profile">
   <img className="author-profile-photo" src={assets.authorProfile} alt="Leonardo Camargo Rossato" width="170" height="170"/>
   <h1>Leonardo Camargo Rossato</h1>
   <p className="author-role">AI Engineer &amp; Software Developer</p>
   <dl className="author-education">
    <dt>ITA</dt><dd>{t('Doutorando em Engenharia Eletrônica e Computação.','PhD student in Electronic and Computer Engineering.')}</dd>
    <dt>UFRGS</dt><dd>{t('Mestre em Física.','MSc in Physics.')}</dd>
    <dt>UFSM</dt><dd>{t('Bacharel em Física.','BSc in Physics.')}</dd>
   </dl>
   <div className="author-skills" aria-label={t('Áreas de atuação','Areas of expertise')}>{skills.map(skill=><span key={skill}>{skill}</span>)}</div>
   <h2>{t('Meu portfólio','My portfolio')}</h2>
   <p>{t('Meu portfólio reúne projetos de inteligência artificial, engenharia de software e pesquisa científica, conectando desenvolvimento tecnológico, análise de dados e aplicações reais.','My portfolio brings together artificial intelligence, software engineering and scientific research projects, connecting technology development, data analysis and real-world applications.')}</p>
  </section>
  <InteractiveAppPreview url={portfolio} title="LCR Portfolio" action={t('Abrir portfólio','Open App')} loadingLabel={t('Carregando portfólio…','Loading portfolio…')} fallbackLabel={t('Não foi possível confirmar o carregamento. Abra o portfólio em uma nova aba.','Loading could not be confirmed. Open the portfolio in a new tab.')}/>
 </div>;
}
