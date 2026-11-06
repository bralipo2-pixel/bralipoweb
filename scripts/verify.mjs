import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(process.env.VERIFY_DIR||'dist');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?files(path.join(dir,x.name)):[path.join(dir,x.name)]);}
const all=files(root).filter(p=>p.endsWith('.html')&&!p.includes(`${path.sep}admin${path.sep}`));
let checked=0;
for(const file of all){
 const html=fs.readFileSync(file,'utf8');
 if(file===path.join(root,'index.html'))continue;
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,`${file}: exactly one H1`);
 assert.match(html,/<html lang="(?:es|en)"/,`${file}: language`);
 assert.match(html,/<title>[^<]+<\/title>/,`${file}: title`);
 assert.match(html,/<meta name="description" content="[^"]+"/,`${file}: description`);
 const confirmation=/[\\/](gracias|thank-you)[\\/]index\.html$/.test(file);
 if(confirmation)assert.match(html,/<meta name="robots" content="noindex/);
 if(process.env.VERIFY_INDEXABLE==='true'&&!file.endsWith('404.html')&&!confirmation){
  assert.match(html,/<link rel="canonical" href="https:\/\/bralipo\.example\//,`${file}: canonical`);
  assert.match(html,/<link rel="alternate" hreflang="es"/,`${file}: Spanish alternate`);
  assert.match(html,/<link rel="alternate" hreflang="en"/,`${file}: English alternate`);
  assert.doesNotMatch(html,/Vista de prueba|Preview sample/,`${file}: demo excluded`);
 }
 for(const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)){
  const url=decodeURIComponent(match[1]);const target=path.join(root,url);
  assert.ok(fs.existsSync(target)||fs.existsSync(path.join(target,'index.html')),`${file}: missing ${url}`);
 }
 for(const img of html.matchAll(/<img\b[^>]*>/g))assert.match(img[0],/\balt=/,`${file}: image alt`);
 checked++;
}
for(const lang of ['es','en']){
 const home=fs.readFileSync(path.join(root,lang,'index.html'),'utf8');
 assert.match(home,/Identidades|Distinctive/,'Hero is in server HTML');
 assert.match(home,/Poppins|stylesheet/,'Styles are linked');
}
const admin=fs.readFileSync(path.join(root,'admin','config.yml'),'utf8');
assert.match(admin,/name: projects/);assert.match(admin,/name: labs/);
assert.match(admin,/repo: bralipo2-pixel\/bralipoweb/);
if(process.env.NETLIFY==='true'){
 assert.match(admin,/local_backend: false/);
 assert.doesNotMatch(admin,/localhost:8081|REEMPLAZAR/);
 assert.match(admin,/site_domain:/);
}
for(const [lang,route,thanks] of [['es','contacto','gracias'],['en','contact','thank-you']]){
 const html=fs.readFileSync(path.join(root,lang,route,'index.html'),'utf8');
 assert.match(html,/<form[^>]+name="contact"[^>]+method="POST"/);
 assert.match(html,/data-netlify="true"/);
 assert.match(html,/netlify-honeypot="website"/);
 assert.match(html,/name="form-name" value="contact"/);
 assert.ok(html.includes(`action="/${lang}/${thanks}/"`));
 assert.ok(html.includes(`data-submit-path="/${lang}/${route}/"`));
 if(process.env.VERIFY_FORM_ENABLED)assert.ok(html.includes(`data-enabled="${process.env.VERIFY_FORM_ENABLED}"`));
}
assert.ok(fs.existsSync(path.join(root,'admin','decap-cms.js')));
for(const dir of ['projects','labs'])for(const name of fs.readdirSync(`src/content/${dir}`)){
 const e=JSON.parse(fs.readFileSync(`src/content/${dir}/${name}`,'utf8'));
 assert.match(e.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
 for(const lang of ['es','en'])for(const field of ['summary','description','scope','role','alt','seoTitle','seoDescription'])assert.ok(e[lang][field],`${name}: missing ${lang}.${field}`);
}
console.log(`PASS: ${checked} HTML pages, local links and assets, H1, metadata, languages, content and CMS bundles.`);
