const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const root = path.resolve(__dirname,'../..');
require('@next/env').loadEnvConfig(root);
const destination = path.join(root,'.scout-deployment');
const cache = path.join(root,'node_modules/.cache/npm/_npx');
const cliPackage = fs.readdirSync(cache).map(directory=>path.join(cache,directory,'node_modules/vercel/package.json')).find(file=>fs.existsSync(file) && JSON.parse(fs.readFileSync(file,'utf8')).version==='63.1.2');
if (!cliPackage) throw new Error('Install Vercel CLI 63.1.2 using the documented npm cache first.');
const cli = path.resolve(path.dirname(cliPackage),JSON.parse(fs.readFileSync(cliPackage,'utf8')).bin.vercel);
const secret = process.env.OPENROUTER_API_KEY;
if (!secret) throw new Error('Add OPENROUTER_API_KEY to the ignored local environment first.');
const settings = {
 OPENROUTER_API_KEY:secret,
 OPENROUTER_MODEL:process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash-lite',
 SCOUT_DAILY_BUDGET_USD:process.env.SCOUT_DAILY_BUDGET_USD || '0.25',
 SCOUT_ALLOWED_ORIGINS:process.env.SCOUT_ALLOWED_ORIGINS || 'https://yashkamerkar14.github.io,http://127.0.0.1:3000,http://localhost:3000',
};
async function add(name,value) {
 await new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,[cli,'env','add',name,'production',name==='OPENROUTER_API_KEY'?'--sensitive':'--no-sensitive','--yes','--force','--cwd',destination],{cwd:root,stdio:['pipe','pipe','pipe'],windowsHide:true});
  let output='';
  child.stdout.on('data',chunk=>output+=chunk); child.stderr.on('data',chunk=>output+=chunk);
  child.on('error',reject);
  child.on('close',code=>code===0?resolve():reject(new Error(output.replaceAll(secret,'[redacted]'))));
  // Credentials travel over stdin, never shell arguments or printed commands.
  child.stdin.end(value);
 });
 console.log('Stored '+name+' in the Scout project production environment.');
}
(async()=>{ for(const [name,value] of Object.entries(settings)) await add(name,value); })().catch(error=>{console.error(error.message.replaceAll(secret,'[redacted]'));process.exitCode=1;});
