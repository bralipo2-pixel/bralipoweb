import ScrollStack, {ScrollStackItem} from './reactbits/ScrollStack';
import useReducedMotion from './useReducedMotion';
import './ProjectStack.css';

export default function ProjectStack({entries,lang='es'}) {
 const reduced=useReducedMotion();
 const es=lang==='es';
 const cards=entries.map((entry,index)=><ScrollStackItem key={entry.slug} itemClassName="project-stack-card">
  <article className="project-stack-project">
   <a className="project-stack-link" href={`/${lang}/${es?'proyectos':'projects'}/${entry.slug}/`}>
    <div className="project-stack-cover">
     <img src={entry.cover} alt={entry[lang].alt} width="1200" height="900" loading="lazy" decoding="async"/>
     {entry.demo&&<span className="demo-label">{es?'Vista de prueba':'Preview sample'}</span>}
    </div>
    <div className="project-stack-caption">
     <span className="project-stack-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span>
     <div><h3>{entry.title}</h3><p>{entry[lang].scope}</p></div>
     <span className="project-stack-cta">{es?'Ver proyecto':'View project'} <span aria-hidden="true">↗</span></span>
    </div>
   </a>
  </article>
 </ScrollStackItem>);
 if(reduced||entries.length<2)return <div className="project-stack project-stack-static">{cards}</div>;
 return <ScrollStack className="project-stack" useWindowScroll smoothScroll={false} snap={false} stackPosition={108} itemDistance={100} itemStackDistance={20} itemScale={.035} baseScale={.9} dimAmount={.12} holdDistance={100}>{cards}</ScrollStack>;
}
