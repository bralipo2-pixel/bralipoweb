import Icon from './Icon.jsx';
import AnimatedContent from './reactbits/AnimatedContent';
import ChromeRing from './ChromeRing';
import Grainient from './reactbits/Grainient';
import {useState} from 'react';
import useReducedMotion from './useReducedMotion';

export default function Hero({lang='es'}){
 const es=lang==='es';
 const [paused,setPaused]=useState(false);
 const reduced=useReducedMotion();
 return <section className="hero" aria-labelledby="hero-heading">
  <div className="hero-grainient" aria-hidden="true">{!reduced&&<Grainient colors={['#1E1E1E','#1E1E1E','#8CFF2E','#F9F9F9','#1E1E1E']} angle={135} type="linear" bands={1.4} speed={paused?0:.22} flow={.7} scale={1.1} softness={.85} silk={.45} grainAmount={.09} grainSize={1.2} grainAnimated={false} contrast={1.1} interactive={!paused} stir={.5} clickSwirl={false} intro={false} dpr={1}/>}</div>
  <div className="hero-copy">
   <p className="eyebrow"><span className="status-dot"/> {es?'ESTUDIO DIGITAL · ARGENTINA':'DIGITAL STUDIO · ARGENTINA'}</p>
   <AnimatedContent trigger="mount" distance={24} duration={.8} animateOpacity={false}>
    <h1 id="hero-heading">{es?<><span className="headline-bold">Identidades</span><em>con carácter.</em><span className="headline-light">Ideas que</span><strong>toman forma.</strong></>:<><span className="headline-bold">Distinctive</span><em>by design.</em><span className="headline-light">Ideas taking</span><strong>shape.</strong></>}</h1>
   </AnimatedContent>
   <p className="hero-description">{es?'Branding, desarrollo web e inteligencia artificial para darle forma a tu próximo proyecto.':'Branding, web development and artificial intelligence to bring your next project to life.'}</p>
   <div className="actions"><a className="button" href={`/${lang}/${es?'contacto':'contact'}/`}>{es?'Contanos tu proyecto':'Tell us about your project'} <span><Icon name="arrow-up-right"/></span></a><a className="text-link" href="#selected-work">{es?'Ver proyectos':'View our work'} <span><Icon name="arrow-down"/></span></a></div>
  </div>
  <ChromeRing paused={paused}/>
  {!reduced&&<button className="effect-toggle hero-motion-toggle" type="button" aria-pressed={paused} onClick={()=>setPaused(!paused)}><Icon name={paused?"play":"pause"}/> <span>{es?(paused?'Activar movimiento':'Pausar movimiento'):(paused?'Enable motion':'Pause motion')}</span></button>}
  <div className="hero-bottom"><span>{es?'DISEÑO CON INTENCIÓN. TECNOLOGÍA CON PROPÓSITO.':'DESIGN WITH INTENT. TECHNOLOGY WITH PURPOSE.'}</span><span className="hero-line"/><span>{es?'SEGUÍ EXPLORANDO':'SCROLL TO EXPLORE'} <Icon name="arrow-down"/></span></div>
 </section>;
}
