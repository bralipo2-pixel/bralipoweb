import {useEffect,useState} from 'react';
import useReducedMotion from './useReducedMotion';
import './StudioPass.css';

export default function StudioPass({lang='es'}){
 const es=lang==='es';
 const reduced=useReducedMotion();
 const [Lanyard,setLanyard]=useState(null);
 const [paused,setPaused]=useState(false);
 useEffect(()=>{let cancelled=false;if(!reduced)import('./reactbits/Lanyard').then(module=>{if(!cancelled)setLanyard(()=>module.default);}).catch(()=>{});return()=>{cancelled=true;};},[reduced]);
 return <figure className="studio-pass">
  <div className="studio-pass-stage">
   <div className="studio-pass-fallback"><span/><img src="/images/studio-pass.svg" width="800" height="1125" alt={es?'Credencial de Brian, Bralipo. Diseño y tecnología.':'Brian’s Bralipo badge. Design and technology.'}/></div>
   {!reduced&&Lanyard&&<div className="studio-pass-live" aria-hidden="true"><Lanyard frontImage="/images/studio-pass.svg" backImage="/images/studio-pass.svg" cardColor="#1E1E1E" strapColor="#8CFF2E" metal="silver" finish="matte" size={.72} strapLength={.4} strapWidth={.8} breeze={paused?0:.12} damping={.7} elasticity={.35} intro={false} interactive={!paused}/></div>}
  </div>
  <figcaption className="studio-pass-caption"><span className="studio-pass-hint">{es?'Arrastrá la credencial · Clic para girar':'Drag the badge · Click to flip'}</span>{!reduced&&Lanyard&&<button className="effect-toggle" type="button" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{es?(paused?'Activar movimiento':'Pausar movimiento'):(paused?'Enable motion':'Pause motion')}</button>}</figcaption>
 </figure>;
}
