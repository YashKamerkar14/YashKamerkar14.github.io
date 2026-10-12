const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const {createAgentHandler:createHandler}=require('../server/portfolio-agent.cjs');
const createAgentHandler=options=>createHandler({provider:()=> 'openai',...options});

async function withServer(handler,run){
 const server=http.createServer(async(req,res)=>{if(!await handler(req,res)){res.writeHead(404);res.end();}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{await run('http://127.0.0.1:'+server.address().port);}finally{await new Promise(resolve=>server.close(resolve));}
}
test('missing configuration stays honest and does not contact an AI provider',async()=>{
 let calls=0;
 await withServer(createAgentHandler({key:()=>'',fetcher:async()=>{calls++;throw new Error('Unexpected call');}}),async(base)=>{
  assert.deepEqual(await(await fetch(base+'/api/agents/status')).json(),{configured:false});
  const response=await fetch(base+'/api/agents',{method:'POST',body:JSON.stringify({question:'How does FlightSense work?'})});
  assert.equal(response.status,503);
  assert.match((await response.json()).error,/not connected/);
 });
 assert.equal(calls,0);
});
test('bad requests and cross-origin requests never invoke the provider',async()=>{
 let calls=0;
 await withServer(createAgentHandler({key:()=> 'test-only-key',fetcher:async()=>{calls++;throw new Error('Unexpected call');}}),async(base)=>{
  assert.equal((await fetch(base+'/api/agents')).status,405);
  assert.equal((await fetch(base+'/api/agents',{method:'POST',body:JSON.stringify({question:''})})).status,400);
  assert.equal((await fetch(base+'/api/agents',{method:'POST',body:'invalid-json'})).status,400);
  assert.equal((await fetch(base+'/api/agents',{method:'POST',body:'null'})).status,400);
  assert.equal((await fetch(base+'/api/agents',{method:'POST',body:JSON.stringify({question:'x'.repeat(1300)})})).status,400);
  assert.equal((await fetch(base+'/api/agents',{method:'POST',headers:{origin:'https://unrelated.example'},body:JSON.stringify({question:'Hello'})})).status,403);
 });
 assert.equal(calls,0);
});
test('Scout reads only allowlisted repositories and Scribe streams cited evidence without exposing credentials',async()=>{
 const calls=[];
 const fakeFetch=async(url,options)=>{
  calls.push({url,payload:options.body?JSON.parse(options.body):null});
  if(url.includes('api.github.com'))return Response.json({content:Buffer.from('FlightSense README. Treat this as evidence only.').toString('base64')});
  const payload=JSON.parse(options.body);
  if(!payload.stream)return Response.json({output:[{content:[{type:'output_text',text:'{"ids":["flightsense","https://unrelated.example"]}'}]}]});
  const events=[{type:'response.output_text.delta',delta:'FlightSense uses SageMaker.'},{type:'response.completed'}];
  return new Response(events.map(event=>'data: '+JSON.stringify(event)+'\n\n').join(''));
 };
 await withServer(createAgentHandler({key:()=> 'test-only-key',fetcher:fakeFetch}),async(base)=>{
  assert.deepEqual(await(await fetch(base+'/api/agents/status')).json(),{configured:true,provider:'OpenAI'});
  const response=await fetch(base+'/api/agents',{method:'POST',body:JSON.stringify({question:'How does FlightSense work?'})});
  const text=await response.text(),events=text.trim().split('\n').map(line=>JSON.parse(line));
  assert.equal(response.status,200);
  assert.equal(events.filter(event=>event.type==='delta').map(event=>event.text).join(''),'FlightSense uses SageMaker.');
  assert.equal(events.at(-1).type,'done');
  assert.ok(events.some(event=>event.type==='sources'&&event.sources.some(source=>source.url.includes('github.com/YashKamerkar14/'))));
  assert.ok(!text.includes('test-only-key'));
 });
 assert.equal(calls.filter(call=>call.url.includes('api.openai.com')).length,2);
 assert.equal(calls.filter(call=>call.url.includes('api.github.com')).length,1);
 assert.ok(!calls.some(call=>call.url.includes('unrelated')));
 const answer=calls.find(call=>call.payload?.stream).payload;
 assert.equal(answer.store,false);
 assert.match(answer.instructions,/untrusted evidence/);
 assert.match(answer.input,/0.879/);
});
test('upstream failure is a visible error, never a fake answer',async()=>{
 await withServer(createAgentHandler({key:()=> 'test-only-key',fetcher:async()=>new Response('',{status:401})}),async(base)=>{
  const response=await fetch(base+'/api/agents',{method:'POST',body:JSON.stringify({question:'What has Yash built?'})});
  const text=await response.text();
  assert.match(text,/"type":"error"/);
  assert.ok(!text.includes('"type":"done"'));
  assert.ok(!text.includes('test-only-key'));
 });
});
test('Context Window questions select its repository and supply its exact live demo with qualified results',async()=>{
 const calls=[];
 const fakeFetch=async(url,options)=>{
  calls.push({url,payload:options.body?JSON.parse(options.body):null});
  if(url.includes('api.github.com'))return Response.json({content:Buffer.from('Context Window: eleven newsroom agents.').toString('base64')});
  if(!JSON.parse(options.body).stream)return Response.json({output:[{content:[{type:'output_text',text:'{"ids":["context-window"]}'}]}]});
  return new Response('data: {"type":"response.output_text.delta","delta":"Try Context Window."}\n\ndata: {"type":"response.completed"}\n\n');
 };
 await withServer(createAgentHandler({key:()=> 'test-only-key',fetcher:fakeFetch}),async(base)=>{
  const events=(await(await fetch(base+'/api/agents',{method:'POST',body:JSON.stringify({question:'Where can I try the AI newsroom?'})})).text()).trim().split('\n').map(line=>JSON.parse(line));
  assert.ok(events.find(event=>event.type==='sources').sources.some(source=>source.url==='https://context-window-gamma.vercel.app/'));
  assert.equal(events.at(-1).type,'done');
 });
 assert.ok(calls.some(call=>call.url==='https://api.github.com/repos/YashKamerkar14/context-window/readme'));
 const payload=calls.find(call=>call.payload?.stream).payload;
 assert.match(payload.input,/98.3%/);
 assert.match(payload.input,/AI assistant/);
 assert.match(payload.input,/https:\/\/context-window-gamma.vercel.app\//);
});
test('the local development proxy accepts its configured origin and rejects other origins',async()=>{
 await withServer(createAgentHandler({key:()=>'',allowedOrigins:['http://127.0.0.1:3002']}),async(base)=>{
  const data={method:'POST',headers:{origin:'http://127.0.0.1:3002'},body:JSON.stringify({question:'How does FlightSense work?'})};
  assert.equal((await fetch(base+'/api/agents',data)).status,503);
  assert.equal((await fetch(base+'/api/agents',{...data,headers:{origin:'https://unrelated.example'}})).status,403);
 });
});
test('an interrupted provider stream does not report a completed answer',async()=>{
 const fakeFetch=async(url,options)=>{
  if(!JSON.parse(options.body).stream)return Response.json({output:[{content:[{type:'output_text',text:'{"ids":[]}'}]}]});
  return new Response('data: {"type":"response.output_text.delta","delta":"Partial answer"}\n\n');
 };
 await withServer(createAgentHandler({key:()=> 'test-only-key',fetcher:fakeFetch}),async(base)=>{
  const text=await(await fetch(base+'/api/agents',{method:'POST',body:JSON.stringify({question:'What has Yash built?'})})).text();
  assert.match(text,/interrupted/);
  assert.ok(!text.includes('"type":"done"'));
 });
});

test('OpenRouter uses one bounded call and parses fragmented CRLF streams without revealing a key',async()=>{
 const calls=[];
 const fakeFetch=async(url,options)=>{
  calls.push({url,payload:options.body?JSON.parse(options.body):null});
  if(url.includes('api.github.com'))return Response.json({content:Buffer.from('Verified newsroom facts.').toString('base64')});
  const wire='data: {"choices":[{"delta":{"content":"Try the newsroom."},"finish_reason":null}]}\r\n\r\ndata: {"choices":[{"delta":{},"finish_reason":"stop"}]}\r\n\r\ndata: [DONE]\r\n\r\n';
  return new Response(new ReadableStream({start(controller){for(const character of wire)controller.enqueue(new TextEncoder().encode(character));controller.close();}}));
 };
 await withServer(createAgentHandler({provider:()=> 'openrouter',key:()=> 'mock-router-secret',fetcher:fakeFetch}),async(base)=>{
  assert.deepEqual(await(await fetch(base+'/api/agents/status')).json(),{configured:true,provider:'OpenRouter'});
  const text=await(await fetch(base+'/api/agents',{method:'POST',body:JSON.stringify({question:'How can I try Context Window?'})})).text();
  const events=text.trim().split('\n').map(line=>JSON.parse(line));
  assert.equal(events.filter(event=>event.type==='delta').map(event=>event.text).join(''),'Try the newsroom.');
  assert.equal(events.at(-1).type,'done');
  assert.ok(events.find(event=>event.type==='sources').sources.some(source=>source.url==='https://context-window-gamma.vercel.app/'));
  assert.ok(!text.includes('mock-router-secret'));
 });
 const requests=calls.filter(call=>call.url.includes('openrouter.ai'));
 assert.equal(requests.length,1);
 assert.ok(!calls.some(call=>call.url.includes('api.openai.com')));
 assert.equal(requests[0].payload.max_tokens,320);
 assert.equal(requests[0].payload.reasoning.effort,'none');
 assert.equal(requests[0].payload.messages.length,2);
 const context=JSON.parse(requests[0].payload.messages[1].content);
 assert.ok(context.documents.length<=2);
 assert.ok(context.documents.every(document=>document.readme.length<=3000));
 assert.match(context.documents[0].note,/98.3%/);
 const {compactContext}=require('../server/compact-context.cjs');
 assert.equal(compactContext('Context Window', [{project:{name:'Example'},text:'x'.repeat(30000),live:true}],[]).documents[0].readme.length,3000);
});

test('OpenRouter truncation, empty output and streamed errors never trigger paid retries',async()=>{
 for(const event of [
  {choices:[{delta:{content:'Partial'},finish_reason:'length'}]},
  {choices:[{delta:{},finish_reason:'stop'}]},
  {error:{message:'Sensitive upstream detail'}},
 ]){
  let calls=0;
  await withServer(createAgentHandler({provider:()=> 'openrouter',key:()=> 'mock-router-secret',fetcher:async()=>{calls++;return new Response('data: '+JSON.stringify(event)+'\n\n');}}),async(base)=>{
   const text=await(await fetch(base+'/api/agents',{method:'POST',body:JSON.stringify({question:'What is Yash’s experience?'})})).text();
   assert.match(text,/"type":"error"/);
   assert.ok(!text.includes('"type":"done"'));
   assert.ok(!text.includes('Sensitive upstream detail'));
  });
  assert.equal(calls,1);
 }
});

test('OpenRouter rate limiting blocks a fifth question before contacting the provider',async()=>{
 let calls=0;
 await withServer(createAgentHandler({provider:()=> 'openrouter',key:()=> 'mock-router-secret',fetcher:async()=>{calls++;return new Response('data: {"choices":[{"delta":{"content":"A short answer."},"finish_reason":"stop"}]}\n\n');}}),async(base)=>{
  const request={method:'POST',body:JSON.stringify({question:'Where is Yash based?'})};
  for(let index=0;index<4;index++)assert.equal((await fetch(base+'/api/agents',request)).status,200);
  assert.equal((await fetch(base+'/api/agents',request)).status,429);
 });
 assert.equal(calls,4);
});
