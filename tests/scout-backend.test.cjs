const {test} = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const {createVercelHandler} = require('../server/vercel-agent.cjs');
const origin = 'https://yashkamerkar14.github.io';

async function withServer(handler,run) {
 const server=http.createServer(handler);
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try { await run('http://127.0.0.1:'+server.address().port); }
 finally { await new Promise(resolve=>server.close(resolve)); }
}
const question = {method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify({question:'Who does Yash work for?'})};
const wire = 'data: {"choices":[{"delta":{"content":"Yash works at Uber."},"finish_reason":null}]}\n\ndata: {"choices":[{"delta":{},"finish_reason":"stop"}]}\n\ndata: [DONE]\n\n';

test('public CORS preflight permits only portfolio methods and headers without provider requests',async()=>{
 let calls=0;
 const handler=createVercelHandler({key:()=> 'mock-private-key',fetcher:async()=>{calls++;throw new Error('Unexpected provider request');}});
 await withServer(handler,async(base)=>{
  const response=await fetch(base+'/api/agents',{method:'OPTIONS',headers:{origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type'}});
  assert.equal(response.status,204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'),origin);
  assert.equal(response.headers.get('Vary'),'Origin');
  for(const forbidden of ['https://unrelated.example','null']) {
   const denied=await fetch(base+'/api/agents',{...question,headers:{...question.headers,origin:forbidden}});
   assert.equal(denied.status,403);
   assert.equal(denied.headers.get('Access-Control-Allow-Origin'),null);
  }
  assert.equal((await fetch(base+'/api/agents',{...question,headers:{'Content-Type':'application/json'}})).status,403);
  assert.equal((await fetch(base+'/api/agents',{method:'OPTIONS',headers:{origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'authorization'}})).status,403);
 });
 assert.equal(calls,0);
});

test('Vercel-parsed bodies stream one bounded call and status rewrites never contact the provider',async()=>{
 const calls=[];
 const fakeFetch=async(url,options)=>{
  calls.push({url,payload:options.body && JSON.parse(options.body)});
  if(url.endsWith('/key')) return Response.json({data:{limit:1,limit_remaining:1,usage_daily:0}});
  return new Response(wire);
 };
 const handler=createVercelHandler({key:()=> 'mock-private-key',fetcher:fakeFetch});
 // Simulate Vercel's body helper after the platform has consumed the stream.
 await withServer(async(req,res)=>{ if(req.method==='POST') req.body={question:'Who does Yash work for?'}; await handler(req,res); },async(base)=>{
  for(const route of ['/api/agents/status','/api/agents?route=status']) {
   const response=await fetch(base+route,{headers:{origin}});
   assert.deepEqual(await response.json(),{configured:true,provider:'OpenRouter'});
   assert.equal(response.headers.get('Access-Control-Allow-Origin'),origin);
  }
  assert.equal(calls.length,0);
  const response=await fetch(base+'/api/agents',question);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'),origin);
  const events=(await response.text()).trim().split('\n').map(line=>JSON.parse(line));
  assert.equal(events.at(-1).type,'done');
  assert.equal(events.find(event=>event.type==='delta').text,'Yash works at Uber.');
 });
 const modelCalls=calls.filter(call=>call.url.includes('/chat/completions'));
 assert.equal(modelCalls.length,1);
 assert.equal(modelCalls[0].payload.max_tokens,320);
 assert.equal(modelCalls[0].payload.reasoning.effort,'none');
});

test('provider usage stops every serverless instance before a billable call',async()=>{
 let modelCalls=0;
 const fakeFetch=async(url)=>{
  if(url.endsWith('/key')) return Response.json({data:{limit:1,limit_remaining:0.75,usage_daily:0.25}});
  modelCalls++; return new Response(wire);
 };
 for(let i=0;i<2;i++) await withServer(createVercelHandler({key:()=> 'mock-private-key',fetcher:fakeFetch}),async(base)=>{
  const response=await fetch(base+'/api/agents',question);
  assert.equal(response.status,429);
  assert.match((await response.json()).error,/today’s AI budget/);
 });
 assert.equal(modelCalls,0);
});

test('exhausted, unlimited, malformed or unreachable budgets fail closed without model calls',async()=>{
 for(const data of [
  {limit:1,limit_remaining:0,usage_daily:0},
  {limit:null,limit_remaining:null,usage_daily:0},
  {limit:1,limit_remaining:1},
  {limit:1,limit_remaining:1,usage_daily:-1},
  null,
 ]) {
  let calls=0;
  await withServer(createVercelHandler({key:()=> 'mock-private-key',fetcher:async(url)=>{
   assert.ok(url.endsWith('/key')); calls++;
   if(data===null) throw new Error('Provider unavailable');
   return Response.json({data});
  }}),async(base)=>{
   const response=await fetch(base+'/api/agents',question);
   assert.ok([429,503].includes(response.status));
   assert.ok(!(await response.text()).includes('mock-private-key'));
  });
  assert.equal(calls,1);
 }
});

test('malformed and oversized platform bodies are rejected before budget or model requests',async()=>{
 for(const body of ['invalid-json',{question:'x'.repeat(9000)}]) {
  let calls=0;
  const handler=createVercelHandler({key:()=> 'mock-private-key',fetcher:async()=>{calls++;throw new Error('Unexpected request');}});
  await withServer(async(req,res)=>{req.body=body;await handler(req,res);},async(base)=>{
   const response=await fetch(base+'/api/agents',question);
   assert.ok([400,413].includes(response.status));
  });
  assert.equal(calls,0);
 }
});
