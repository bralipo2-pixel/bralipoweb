import {indexable} from '../data.js';
export function GET({site}){return new Response(indexable?`User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${new URL('/sitemap.xml',site).href}\n`:'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain'}});}
