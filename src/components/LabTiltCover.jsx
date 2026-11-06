import Icon from './Icon.jsx';
import {useEffect,useState} from 'react';
import TiltedCard from './reactbits/TiltedCard';
import useReducedMotion from './useReducedMotion';

export default function LabTiltCover({src,alt,url,label}){
 const reduced=useReducedMotion();
 const [coarse,setCoarse]=useState(false);
 useEffect(()=>{
  const media=matchMedia('(hover: none), (pointer: coarse)');
  const update=()=>setCoarse(media.matches);update();media.addEventListener('change',update);
  return()=>media.removeEventListener('change',update);
 },[]);
 return <a className="lab-tilt-link" href={url} aria-label={label}>
  {reduced||coarse?<div className="lab-still-cover"><img src={src} alt={alt} width="1200" height="900" loading="lazy" decoding="async"/><span className="lab-cover-arrow" aria-hidden="true"><Icon name="arrow-up-right"/></span></div>:<TiltedCard imageSrc={src} altText={alt} captionText={label} containerHeight="100%" containerWidth="100%" imageHeight="100%" imageWidth="100%" rotateAmplitude={8} scaleOnHover={1.025} showTooltip={false} flipOnClick={false} floating={false} gyroscope={false} intro={false} glare={.3} glareColor="#F9F9F9" shadow={.3} parallax={.35} radius={10} displayOverlayContent overlayDepth={12} overlayContent={<span className="lab-cover-arrow" aria-hidden="true"><Icon name="arrow-up-right"/></span>}/>} 
 </a>;
}
