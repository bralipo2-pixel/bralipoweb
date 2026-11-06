import { useEffect, useRef, useState } from 'react';

export default function ChromeRing({paused=false}) {
  const holder = useRef(null);
  const pausedRef = useRef(false);
  const wakeRef = useRef(()=>{});
  useEffect(()=>{pausedRef.current=paused;if(!paused)wakeRef.current();},[paused]);
  const [ready,setReady] = useState(false);
  useEffect(()=>{
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let dispose = ()=>{}, cancelled = false;
    async function mount(){
      if(media.matches || cancelled) return;
      try {
        const THREE = await import('three');
        const {RoomEnvironment} = await import('three/addons/environments/RoomEnvironment.js');
        if(cancelled || media.matches) return;
        const el = holder.current;
        const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
        renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
        renderer.setClearColor(0x1e1e1e,0);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        el.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36,1,0.1,30);
        camera.position.z = 7.6;
        const pmrem = new THREE.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        const environment = pmrem.fromScene(room,0.035);
        scene.environment = environment.texture;
        const geometry = new THREE.TorusGeometry(1.42,.53,48,144);
        const pos = geometry.attributes.position;
        for(let i=0;i<pos.count;i++) {
          const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),a=Math.atan2(y,x);
          pos.setXYZ(i,x,y*1.12,z+0.17*Math.sin(a*2));
        }
        geometry.computeVertexNormals();
        const material = new THREE.MeshPhysicalMaterial({color:0xc8c9c5,metalness:1,roughness:.23,clearcoat:.75,clearcoatRoughness:.2});
        material.onBeforeCompile = shader => {
          shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`float grain = fract(sin(dot(floor(vViewPosition * 540.0), vec3(12.9898,78.233,37.719))) * 43758.5453);\n outgoingLight *= 0.87 + grain * 0.26;\n #include <opaque_fragment>`);
        };
        const mesh = new THREE.Mesh(geometry,material);
        mesh.rotation.set(.48,-.55,-.48);
        scene.add(mesh);
        const rim = new THREE.DirectionalLight(0x8cff2e,4);
        rim.position.set(-3,1,3); scene.add(rim);
        let pointer={x:0,y:0}, inView=true, raf=0, phase=0, previous=0;
        const resize=()=>{const w=el.clientWidth,h=el.clientHeight; if(!w||!h)return; renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};
        const ro=new ResizeObserver(resize);ro.observe(el);resize();
        const move=e=>{if(e.pointerType==='touch')return;const b=el.getBoundingClientRect();pointer={x:(e.clientX-b.left)/b.width-.5,y:(e.clientY-b.top)/b.height-.5};};
        const leave=()=>{pointer={x:0,y:0};};
        el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
        const render=now=>{
          raf=0;
          const dt=previous?Math.min((now-previous)/1000,.05):0;previous=now;
          if(!pausedRef.current){phase+=dt;mesh.rotation.y+=( -.55+pointer.x*.42+Math.sin(phase*.22)*.1-mesh.rotation.y)*.04;mesh.rotation.x+=(.48+pointer.y*.25-mesh.rotation.x)*.04;mesh.position.y=Math.sin(phase*.55)*.07;}
          renderer.render(scene,camera);
          if(inView&&!document.hidden&&!media.matches&&!pausedRef.current)raf=requestAnimationFrame(render);
        };
        const resume=()=>{if(inView&&!document.hidden&&!raf&&!media.matches){previous=0;raf=requestAnimationFrame(render);}};
        wakeRef.current=resume;
        const io=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;if(inView)resume();else{cancelAnimationFrame(raf);raf=0;} });io.observe(el);
        document.addEventListener('visibilitychange',resume);
        const lost=e=>{e.preventDefault();setReady(false);cancelAnimationFrame(raf);};renderer.domElement.addEventListener('webglcontextlost',lost);
        resize();renderer.render(scene,camera);setReady(true);resume();
        dispose=()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',resume);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);geometry.dispose();material.dispose();environment.dispose();room.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();};
      }catch(error){console.warn('Chrome artwork uses static fallback.',error);setReady(false);}
    }
    const changed=()=>{dispose();dispose=()=>{};setReady(false);if(!media.matches)mount();};
    media.addEventListener('change',changed);mount();
    return()=>{cancelled=true;dispose();media.removeEventListener('change',changed);};
  },[]);
  return <div className={`chrome-art ${ready?'is-ready':''}`}>
    <img className="chrome-fallback" src="/images/recurso1.webp" alt="" width="733" height="734" fetchPriority="high" />
    <div ref={holder} className="chrome-canvas" aria-hidden="true" />
  </div>;
}
