const http = require('node:http');
const {spawn} = require('node:child_process');
require('@next/env').loadEnvConfig(require('node:path').resolve(__dirname,'..'));
const {createAgentHandler} = require('../src/server/portfolio-agent.cjs');
const port = Number(process.env.PORT || 3000);
const handleAgent = createAgentHandler({allowedOrigins:['http://127.0.0.1:'+port,'http://localhost:'+port]});
const api = http.createServer(async(req,res) => {
 if (await handleAgent(req,res)) return;
 res.writeHead(404); res.end('Not found');
});
api.listen(port+1,'127.0.0.1',() => {
 const next = spawn(process.execPath,[require.resolve('next/dist/bin/next'),'dev','--hostname','127.0.0.1','--port',String(port)],{stdio:'inherit',cwd:require('node:path').resolve(__dirname,'..')});
 next.on('exit',code => { api.close(); process.exitCode=code || 0; });
 for(const signal of ['SIGINT','SIGTERM']) process.on(signal,() => { next.kill(signal); api.close(); });
});
api.on('error',error=>{console.error(error.message);process.exitCode=1;});
