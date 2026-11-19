import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {stripTypeScriptTypes} from 'node:module';
const source=fs.readFileSync('src/components/Analytics.astro','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
const code=stripTypeScriptTypes(source);
function setup(saved=null,hostname='bralipo.com'){
 const listeners={},buttons={},scripts=[];let reloads=0;
 const panel={hidden:true};const settings={setAttribute(){},focus(){},addEventListener(type,fn){buttons.settings=fn;}};
 const container={dataset:{analyticsId:'G-TEST12345'},querySelector:selector=>selector==='[data-consent-panel]'?panel:settings,querySelectorAll:()=>['yes','no'].map(choice=>({dataset:{consent:choice},addEventListener(type,fn){buttons[choice]=fn;}}))};
 const document={querySelector:()=>container,referrer:'https://example.org/path?private=secret',title:'Bralipo',cookie:'_ga=abc; nf_lang=es',createElement:()=>({}),head:{append:script=>scripts.push(script)},addEventListener:(name,fn)=>listeners[name]=fn};
 const context={window:{},document,URL,location:{hostname,origin:`https://${hostname}`,pathname:'/es/',href:`https://${hostname}/es/?private=secret#hidden`,reload(){reloads++;}},localStorage:{getItem:()=>saved,setItem:(key,value)=>{saved=value;}}};
 vm.runInNewContext(code,context);
 return {context,panel,buttons,scripts,listeners,reloads:()=>reloads};
}
let page=setup();assert.equal(page.scripts.length,0);assert.equal(page.panel.hidden,false);
page.buttons.no();assert.equal(page.scripts.length,0);
page.buttons.yes();assert.equal(page.scripts.length,1);
page.listeners['bralipo:contact-sent']();
let events=page.context.window.dataLayer.map(x=>Array.from(x));
assert.equal(events.filter(x=>x[1]==='page_view').length,1);
assert.equal(events.filter(x=>x[1]==='generate_lead').length,1);
assert.ok(!JSON.stringify(events).includes('secret'));
page.buttons.no();assert.equal(page.reloads(),1);assert.equal(page.context.window['ga-disable-G-TEST12345'],true);
const count=page.context.window.dataLayer.length;page.listeners['bralipo:contact-sent']();assert.equal(page.context.window.dataLayer.length,count);
assert.equal(setup('no').scripts.length,0);
assert.equal(setup('yes').scripts.length,1);
assert.equal(setup('yes','preview.netlify.app').scripts.length,0);
console.log('PASS: consent, rejection, revocation, sanitized pageviews, lead event and preview exclusion.');
