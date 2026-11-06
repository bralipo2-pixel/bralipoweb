import {indexable,paths,href,entryHref,projects,labs} from '../data.js';
export function GET({site}){
 const urls=indexable?['es','en'].flatMap(lang=>[...Object.keys(paths[lang]).map(k=>href(lang,k)),...projects.filter(x=>!x.demo).map(x=>entryHref(lang,'projects',x.slug)),...labs.filter(x=>!x.demo).map(x=>entryHref(lang,'labs',x.slug))]):[];
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path=>`<url><loc>${new URL(path,site).href}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});
}
