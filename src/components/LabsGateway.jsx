import {useState} from 'react';
import FaultyTerminal from './reactbits/FaultyTerminal';
import useReducedMotion from './useReducedMotion';

export default function LabsGateway({lang='es',page=false}){
 const es=lang==='es';
 const Heading=page?'h1':'h2';
 const [paused,setPaused]=useState(false);
 const reduced=useReducedMotion();
 return <section className={`labs-gateway${page?' labs-page-hero':''}`} aria-labelledby="labs-gateway-title">
  <div className="terminal-backdrop" aria-hidden="true">
   {!reduced&&<FaultyTerminal tint="#8CFF2E" glyphs="characters" scale={1.3} digitSize={1.35} gridMul={[2,1]} timeScale={.12} pause={paused} scanlineIntensity={.12} glitchAmount={0} flickerAmount={0} noiseAmp={.4} chromaticAberration={0} dither={.12} curvature={.08} brightness={.75} glow={.3} persistence={.5} scramble={.15} mouseReact={!paused} mouseStrength={.18} mouseGlow={.4} clickEffect="none" pageLoadAnimation={false} dpr={1}/>} 
  </div>
  <div className="labs-gateway-top"><p className="eyebrow"><span className="status-dot"/> {page?'BRALIPO / LABS':'03 / BRALIPO LABS'}</p><span className="lab-code" aria-hidden="true">[ {es?'IDEAS EN EXPLORACIÓN':'IDEAS IN EXPLORATION'} ]</span></div>
  <div className="labs-gateway-content">
   <span className="labs-wordmark" aria-hidden="true">LABS<span>↗</span></span>
   <Heading id="labs-gateway-title">{es?'Ideas propias.':'Independent ideas.'}<br/><em>{es?'Posibilidades reales.':'Real possibilities.'}</em></Heading>
   <p>{es?'Nuestro espacio para experimentar con inteligencia artificial. Aplicaciones, personajes virtuales e ideas que llevamos a la práctica.':'Our space to experiment with artificial intelligence. Apps, virtual characters and ideas that we bring to life.'}</p>
   <a className="button" href={page?'#lab-experiments':`/${lang}/labs/`}>{page?(es?'Explorar proyectos':'Explore projects'):(es?'Entrar a Labs':'Enter Labs')} <span>{page?'↓':'↗'}</span></a>
  </div>
  <div className="labs-gateway-bottom"><div className="lab-topics"><span>{es?'APLICACIONES':'APPLICATIONS'}</span><span>{es?'PERSONAJES VIRTUALES':'VIRTUAL CHARACTERS'}</span><span>{es?'EXPERIMENTOS':'EXPERIMENTS'}</span></div>{!reduced&&<button type="button" className="effect-toggle" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'▷':'Ⅱ'} <span>{es?(paused?'Activar fondo':'Pausar fondo'):(paused?'Enable background':'Pause background')}</span></button>}</div>
 </section>;
}
