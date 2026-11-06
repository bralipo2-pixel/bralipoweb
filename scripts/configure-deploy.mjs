import fs from 'node:fs';
import path from 'node:path';

// Only modify generated output: the local CMS keeps its localhost proxy.
const root=path.resolve(process.env.DEPLOY_OUTPUT_DIR||'dist');
const hosted=process.env.NETLIFY==='true';
const remote=process.env.REPOSITORY_URL||'';
const inferred=remote.match(/github\.com[:/]([^/]+\/[^/#?]+?)(?:\.git)?\/?$/)?.[1];
const repo=process.env.CMS_GITHUB_REPO||inferred||'bralipo2-pixel/bralipoweb';
if(hosted&&!repo)throw new Error('Decap: connect a GitHub repository in Netlify or set CMS_GITHUB_REPO=owner/repository.');
if(repo&&!/^[\w.-]+\/[\w.-]+$/.test(repo))throw new Error('CMS_GITHUB_REPO must be owner/repository.');
const branch=process.env.CMS_BRANCH||'main';
if(!/^[\w./-]+$/.test(branch))throw new Error('Invalid CMS_BRANCH.');
const configPath=path.join(root,'admin/config.yml');
let config=fs.readFileSync(configPath,'utf8');
if(repo)config=config.replace(/  repo: .*/,`  repo: ${repo}`).replace(/  branch: .*/,`  branch: ${branch}`);
if(hosted){
 config=config.replace(/local_backend:\r?\n  url: [^\r\n]+/, 'local_backend: false');
 const site=new URL(process.env.SITE_URL||process.env.URL);
 if(site.protocol!=='https:'||site.username||site.password)throw new Error('Netlify needs a public HTTPS site URL.');
 const authDomain=new URL(process.env.URL||site.origin).hostname;
 config=config.replace('  name: github',`  name: github\n  site_domain: ${authDomain}`);
 config+=`\nsite_url: ${JSON.stringify(site.origin)}\ndisplay_url: ${JSON.stringify(site.origin)}\n`;
 if(process.env.CONTEXT&&process.env.CONTEXT!=='production'){
  fs.appendFileSync(path.join(root,'_headers'),'\n/*\n  X-Robots-Tag: noindex, nofollow\n');
 }
}
fs.writeFileSync(configPath,config);
console.log(hosted?'Netlify: Decap configured; local proxy disabled.':'Local build: Decap proxy preserved.');
