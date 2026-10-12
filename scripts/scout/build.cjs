const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'../..');
const destination = path.join(root,'.scout-deployment');
const write = (name,content) => { const file=path.join(destination,name); fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,content); };
const json = (name,value) => write(name,JSON.stringify(value,null,2)+'\n');

// Explicit allowlist: neither .env nor unrelated project files enter the upload.
for (const name of ['portfolio-agent.cjs','compact-context.cjs','openrouter-budget.cjs','vercel-agent.cjs']) write('server/'+name,fs.readFileSync(path.join(root,'src/server',name)));
json('lib/content.json',require('../../src/lib/content.ts'));
json('lib/projects.json',require('../../src/lib/projects.json'));
write('server/portfolio-data.cjs',"module.exports = require('../lib/content.json');\n");
write('api/agents.js',"const {createVercelHandler} = require('../server/vercel-agent.cjs');\nmodule.exports = createVercelHandler();\n");
json('package.json',{name:'yash-portfolio-scout',version:'1.0.0',private:true,engines:{node:'24.x'}});
json('vercel.json',{
 $schema:'https://openapi.vercel.sh/vercel.json',framework:null,buildCommand:'',installCommand:'',outputDirectory:'public',
 functions:{'api/agents.js':{maxDuration:60,supportsCancellation:true,includeFiles:'{lib,server}/**'}},
 rewrites:[{source:'/api/agents/status',destination:'/api/agents?route=status'}],
});
write('public/index.html','<!doctype html><html lang="en"><meta charset="utf-8"><title>Scout portfolio API</title><p>Scout is Yash Kamerkar’s portfolio guide. <a href="https://yashkamerkar14.github.io/">Visit the portfolio</a>.</p></html>\n');
write('.vercelignore','.env*\n.vercel\nnode_modules\n');
console.log('Prepared .scout-deployment: server code and public portfolio facts only; no credentials.');
