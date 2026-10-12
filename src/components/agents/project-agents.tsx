"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";
import { AgentCharacter } from "@/components/agents/robot-character";
import { WalkingScout } from "@/components/agents/walking-scout";
import { scoutEndpoint } from "@/lib/scout-api";

type Agent = "scout" | "scribe";
type Source = {label:string;url:string};

export function ProjectAgents() {
 const dialog=useRef<HTMLDialogElement>(null), launcher=useRef<HTMLButtonElement>(null), input=useRef<HTMLInputElement>(null), request=useRef<AbortController|null>(null), answerBox=useRef<HTMLDivElement>(null);
 const returnFocus=useRef<HTMLElement|null>(null);
 const [configured,setConfigured]=useState<boolean|null>(null), [question,setQuestion]=useState(""), [asked,setAsked]=useState(""), [answer,setAnswer]=useState(""), [sources,setSources]=useState<Source[]>([]), [busy,setBusy]=useState(false), [error,setError]=useState("");
 const [provider,setProvider]=useState("the configured AI provider");
 const [stage,setStage]=useState<Record<Agent,string>>({scout:"Finds the evidence",scribe:"Makes it clear"});
 const [outcome,setOutcome]=useState<"idle"|"working"|"complete"|"stopped"|"error">("idle");
 useEffect(()=>{
  const controller=new AbortController();
  fetch(scoutEndpoint("/api/agents/status"),{signal:controller.signal,credentials:"omit"}).then(r=>r.ok?r.json():null).then(data=>{setConfigured(Boolean(data?.configured));if(data?.provider==="OpenRouter" || data?.provider==="OpenAI")setProvider(data.provider);}).catch(()=>{if(!controller.signal.aborted)setConfigured(false);});
  return()=>{controller.abort();request.current?.abort();};
 },[]);
 useEffect(()=>{ const el=answerBox.current; if(el && el.scrollHeight-el.scrollTop-el.clientHeight<100) el.scrollTop=el.scrollHeight; },[answer,stage]);
 useEffect(()=>{ const reveal=()=>{returnFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null;dialog.current?.showModal();input.current?.focus();}; window.addEventListener("portfolio:ask-agents",reveal); return()=>window.removeEventListener("portfolio:ask-agents",reveal); },[]);
 function open(){returnFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null;dialog.current?.showModal();input.current?.focus();}
 function stop(){if(request.current){request.current.abort();request.current=null;setBusy(false);setOutcome("stopped");setStage({scout:"Research stopped",scribe:"Answer stopped"});}}
 function close(){stop();dialog.current?.close();(returnFocus.current || launcher.current)?.focus();}
 async function ask(value:string){
  const text=value.trim();if(!text || busy || configured!==true)return;
  request.current?.abort();const controller=new AbortController();request.current=controller;
  setAsked(text);setQuestion("");setAnswer("");setSources([]);setError("");setBusy(true);setOutcome("working");setStage({scout:"Receiving your question",scribe:"Waiting for sources"});
  let finished=false;
  try{
   const response=await fetch(scoutEndpoint("/api/agents"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:text}),signal:controller.signal,credentials:"omit"});
   if(!response.ok){const data=await response.json();throw new Error(data.error || "The team couldn’t connect. Try again shortly.");}
   if(!response.body)throw new Error("The answer stream is unavailable.");
   const reader=response.body.getReader(),decoder=new TextDecoder();let buffer="";
   const consume=(line:string)=>{
    if(!line.trim())return;const event=JSON.parse(line);
    if(event.type==="stage" && (event.agent==="scout" || event.agent==="scribe"))setStage(previous=>({...previous,[event.agent]:event.status}));
    if(event.type==="delta")setAnswer(previous=>previous+event.text);
    if(event.type==="sources")setSources(event.sources);
    if(event.type==="error")throw new Error(event.message);
    if(event.type==="done")finished=true;
   };
   while(true){const chunk=await reader.read();if(chunk.done)break;buffer+=decoder.decode(chunk.value,{stream:true});const lines=buffer.split("\n");buffer=lines.pop() || "";lines.forEach(consume);}
   if(buffer)consume(buffer);
   if(!finished)throw new Error("The connection ended before the answer was complete.");
   setOutcome("complete");
  }catch(problem){if(!controller.signal.aborted){setOutcome("error");setError(problem instanceof Error?problem.message:"The team couldn’t finish that question.");setStage({scout:"Sources collected when available",scribe:"Couldn’t finish this answer"});}}
  finally{if(request.current===controller){setBusy(false);request.current=null;}}
 }
 return <>
  <WalkingScout onOpen={open} launcherRef={launcher}/>
  <dialog ref={dialog} className="agent-dialog" aria-labelledby="agent-title" onCancel={()=>stop()} onClose={()=>{stop();(returnFocus.current || launcher.current)?.focus();}} onClick={e=>{if(e.target===e.currentTarget)close();}}>
   <div className="agent-dialog-heading"><div><p>THE PROJECT DESK / YOUR ROBOT CREW</p><h2 id="agent-title">Small team.<br/><em>Good questions.</em></h2></div><button type="button" className="agent-close" onClick={close} aria-label="Close project agents">×</button></div>
   <div className="agent-team" aria-label="Agent activity" data-busy={busy} data-handoff={busy && stage.scout==="Sources ready"}><div><AgentCharacter agent="scout" working={busy && stage.scout!=="Sources ready"}/><span><strong>Scout</strong><small>{stage.scout}</small></span></div><span className="agent-handoff" aria-hidden="true"><span className="handoff-paper">✓</span> →</span><div><AgentCharacter agent="scribe" working={busy && stage.scribe==="Writing a grounded answer"}/><span><strong>Scribe</strong><small>{stage.scribe}</small></span></div></div>
   <div className="agent-reading" ref={answerBox}>
    {configured===false && <p className="agent-offline" role="status">The AI team isn’t connected yet. You can still explore <a href="https://context-window-gamma.vercel.app/" target="_blank" rel="noopener">Context Window live ↗</a>, <a href="https://medical-bill-auditor-demo.streamlit.app/" target="_blank" rel="noopener">Medical Bill Auditor’s synthetic examples ↗</a>, the <a href={profile.flightRepo} target="_blank" rel="noopener">FlightSense research ↗</a>, and <a href="/#experience" onClick={close}>engineering experience ↗</a>.</p>}
    {!asked && <div className="agent-welcome"><p>Ask about my projects, engineering choices, or experience. Scout checks the sources; Scribe turns them into a clear answer.</p>{configured===true && <div className="agent-prompts">{["How does Context Window verify its stories?","How does Medical Bill Auditor check bills?","How does FlightSense work?","What backend systems has Yash built?"].map(prompt=><button key={prompt} type="button" onClick={()=>ask(prompt)}>{prompt}<span aria-hidden="true">↗</span></button>)}</div>}</div>}
    {asked && <p className="agent-question">{asked}</p>}
    {answer && <div className="agent-answer"><span>SCRIBE’S ANSWER</span><p>{answer}</p></div>}
    {busy && !answer && <p className="agent-progress" role="status">Scout and Scribe are working on your question<span aria-hidden="true">…</span></p>}
    {error && <p className="agent-error" role="alert">{error}</p>}
    {outcome==="stopped" && <p className="agent-progress" role="status">Stopped. Any text above is an unfinished answer.</p>}
    {sources.length>0 && <nav className="agent-sources" aria-label="Answer sources"><span>FOLLOW THE EVIDENCE</span>{sources.map(source=><a key={source.url} href={source.url} target={source.url.startsWith("https://")?"_blank":undefined} rel="noopener" onClick={()=>{if(source.url.startsWith("/"))close();}}>{source.label} ↗</a>)}</nav>}
   </div>
   <form className="agent-form" onSubmit={e=>{e.preventDefault();void ask(question);}}><label htmlFor="agent-question">Your question</label><div><input ref={input} id="agent-question" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={1200} placeholder="What would you like to know?" disabled={busy || configured!==true}/>{busy?<button type="button" onClick={stop}>Stop <span aria-hidden="true">■</span></button>:<button type="submit" disabled={!question.trim() || configured!==true}>Ask the team <span aria-hidden="true">↗</span></button>}</div><p>Answers use public project sources and portfolio facts. Your question is sent to {provider} only when you ask.</p></form>
   <p className="sr-only" role="status">{busy?stage.scout+". "+stage.scribe:outcome==="complete"?"Answer ready.":outcome==="stopped"?"Answer stopped.":outcome==="error"?"Answer unavailable.":configured===true?"Project agents ready.":"Project agents are not connected."}</p>
  </dialog>
 </>;
}
