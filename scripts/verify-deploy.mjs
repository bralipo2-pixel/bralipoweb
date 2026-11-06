import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

fs.mkdirSync('tmp',{recursive:true});
const root=fs.mkdtempSync(path.resolve('tmp/deploy-check-'));
fs.mkdirSync(path.join(root,'admin'));
const template=fs.readFileSync('public/admin/config.yml','utf8');
const run=extra=>{
 fs.writeFileSync(path.join(root,'admin/config.yml'),template);
 return spawnSync(process.execPath,['scripts/configure-deploy.mjs'],{encoding:'utf8',env:{...process.env,NETLIFY:'true',CONTEXT:'production',REPOSITORY_URL:'https://github.com/bralipo2-pixel/bralipoweb.git',URL:'https://bralipo-check.netlify.app',SITE_URL:'',CMS_GITHUB_REPO:'',CMS_BRANCH:'main',DEPLOY_OUTPUT_DIR:root,...extra}});
};
let result=run({});assert.equal(result.status,0,result.stderr);
let config=fs.readFileSync(path.join(root,'admin/config.yml'),'utf8');
assert.match(config,/repo: bralipo2-pixel\/bralipoweb\n/);
assert.match(config,/local_backend: false/);
assert.doesNotMatch(config,/localhost:8081/);
assert.match(config,/site_domain: bralipo-check.netlify.app/);
result=run({SITE_URL:'https://bralipo.example',CONTEXT:'deploy-preview'});assert.equal(result.status,0,result.stderr);
config=fs.readFileSync(path.join(root,'admin/config.yml'),'utf8');
assert.match(config,/site_url: "https:\/\/bralipo.example"/);
assert.match(fs.readFileSync(path.join(root,'_headers'),'utf8'),/X-Robots-Tag: noindex, nofollow/);
assert.notEqual(run({CMS_GITHUB_REPO:'invalid repository'}).status,0);
assert.notEqual(run({URL:'http://insecure.example'}).status,0);
assert.equal(fs.readFileSync('public/admin/config.yml','utf8'),template,'Local config must not be modified.');
console.log('PASS: deployment CMS config, OAuth domain, preview noindex, invalid values, local config preserved.');
