const projectFiles = import.meta.glob('./content/projects/*.json', { eager: true, import: 'default' });
const labFiles = import.meta.glob('./content/labs/*.json', { eager: true, import: 'default' });
export const indexable = import.meta.env.PUBLIC_INDEXABLE === 'true';
const visible = x => x.published && (!x.demo || !indexable);
export const projects = Object.values(projectFiles).filter(visible).sort((a,b)=>a.order-b.order);
// Undated legacy entries follow dated projects, retaining their manual order.
const publicationTime = entry => Date.parse(entry.date || '') || 0;
export const latestProjects = [...projects].sort((a,b)=>publicationTime(b)-publicationTime(a)||a.order-b.order).slice(0,4);
export const labs = Object.values(labFiles).filter(visible).sort((a,b)=>a.order-b.order);
export const paths = {
  es: {home:'',projects:'proyectos',services:'servicios',studio:'estudio',contact:'contacto',labs:'labs',branding:'servicios/branding',web:'servicios/diseno-desarrollo-web',ai:'servicios/inteligencia-artificial'},
  en: {home:'',projects:'projects',services:'services',studio:'studio',contact:'contact',labs:'labs',branding:'services/branding',web:'services/web-design-development',ai:'services/artificial-intelligence'}
};
export const href = (lang,key) => `/${lang}/${paths[lang][key]}${paths[lang][key] ? '/' : ''}`;
export const entryHref = (lang,type,slug) => `${href(lang,type)}${slug}/`;
export const t = (lang,es,en) => lang === 'es' ? es : en;
export const serviceData = {
 branding: {es:['Una identidad que se sienta tuya.','Creamos un sistema visual que represente tu marca y le dé coherencia a sus distintos puntos de contacto.',['Diseño de logotipo','Paleta de colores y tipografías','Recursos gráficos y aplicaciones','Guía de uso de la identidad']],en:['An identity that feels like you.','We create visual systems that express your brand and bring consistency to every touchpoint.',['Logo design','Colour palette and typography','Graphic assets and applications','Brand guidelines']]},
 web: {es:['Un lugar propio para tu marca.','Diseñamos y desarrollamos sitios que presentan tu propuesta con claridad, funcionan en distintos dispositivos y facilitan el contacto.',['Landing pages y sitios institucionales','Diseño de interfaces y desarrollo responsive','Estructura y configuración técnica para SEO','Gestión de contenidos según el proyecto']],en:['A place of your own for your brand.','We design and build websites that explain your offer clearly, work across devices and make getting in touch easy.',['Landing pages and business websites','Interface design and responsive development','Site structure and technical SEO setup','Content management to fit your project']]},
 ai: {es:['De una idea a algo que podés usar.','Desarrollamos personajes virtuales y aplicaciones, combinando diseño, desarrollo y herramientas de inteligencia artificial.',['Influencers y personajes virtuales','Contenido visual con IA','Prototipos y apps desarrolladas con ayuda de IA','Integración de funciones de IA en aplicaciones']],en:['From an idea to something you can use.','We develop virtual characters and applications, combining design, development and artificial intelligence tools.',['Virtual influencers and characters','AI visual content','Prototypes and apps built with AI assistance','AI features integrated into applications']]}
};
