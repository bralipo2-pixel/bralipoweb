import fs from 'node:fs';
fs.mkdirSync('public/admin',{recursive:true});
fs.copyFileSync('node_modules/decap-cms/dist/decap-cms.js','public/admin/decap-cms.js');
