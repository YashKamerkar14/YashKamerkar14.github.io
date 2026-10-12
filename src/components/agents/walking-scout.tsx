"use client";

import { useEffect, useRef, type RefObject } from "react";
import { AgentCharacter } from "@/components/agents/robot-character";
import { RobotMotionToggle } from "@/components/agents/robot-motion-toggle";

const duration = 28000;

/** Native browser animations run the routine; no render loop or AI requests. */
export function WalkingScout({ onOpen, launcherRef }: { onOpen: () => void; launcherRef: RefObject<HTMLButtonElement|null> }) {
  const floor = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const walker = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const root=floor.current, path=track.current, robot=walker.current;
    const studio=root?.closest<HTMLElement>(".paper-studio");
    if (!root || !path || !robot || !studio) return;
    const media=matchMedia("(prefers-reduced-motion: reduce)");
    let visible=false, hovering=false, focused=false;
    let animations: Animation[]=[];
    let travel: Animation|null=null;
    const sync=()=>{
      const paused=media.matches || !visible || document.hidden || hovering || focused || studio.dataset.robotsPaused==="true" || Boolean(studio.querySelector("dialog[open]"));
      root.dataset.walking=String(!paused);
      animations.forEach(animation=>paused ? animation.pause() : animation.play());
    };
    const moveFrames=()=>{
      const distance=Math.max(0,path.clientWidth-robot.offsetWidth);
      return [{offset:0,transform:"translateX(0px)"},{offset:.28,transform:`translateX(${distance}px)`},{offset:.44,transform:`translateX(${distance}px)`},{offset:.70,transform:"translateX(0px)"},{offset:1,transform:"translateX(0px)"}];
    };
    const build=()=>{
      animations.forEach(animation=>animation.cancel()); animations=[]; travel=null;
      if (media.matches) { root.dataset.walking="false"; return; }
      const timing={duration,iterations:Infinity,easing:"linear"};
      travel=robot.animate(moveFrames(),timing); animations.push(travel);
      const poses=(selector:string,pose:(time:number)=>string)=>{
        const element=robot.querySelector<SVGElement|HTMLElement>(selector);
        if (!element) return;
        const frames=Array.from({length:161},(_,i)=>({offset:i/160,transform:pose(i/160)}));
        animations.push(element.animate(frames,timing));
      };
      const gait=(t:number)=>{
        const moving=t<.28 || (t>=.44 && t<.70);
        const elapsed=(t<.28 ? t : t-.44)*duration/1000;
        return moving ? Math.sin(elapsed*Math.PI*2/.7) : 0;
      };
      const bounce=(t:number)=>-Math.abs(gait(t))*3;
      poses(".robot-leg-left",t=>`rotate(${gait(t)*17}deg) translateY(${Math.min(0,gait(t))*5}px)`);
      poses(".robot-leg-right",t=>`rotate(${-gait(t)*17}deg) translateY(${Math.min(0,-gait(t))*5}px)`);
      poses(".agent-body",t=>`translateY(${bounce(t)}px)`);
      poses(".robot-arm-left",t=>{
        const wave=t>=.70 && t<.82 ? 142+Math.sin((t-.70)*duration/1000*Math.PI*3)*16 : gait(t)*13;
        return `translateY(${bounce(t)}px) rotate(${wave}deg)`;
      });
      poses(".robot-arm-right",t=>`translateY(${bounce(t)}px) rotate(${t>=.28 && t<.44 ? -24 : -gait(t)*12}deg)`);
      poses(".robot-head",t=>`rotate(${t>=.28 && t<.44 ? 9 : t>=.84 && t<.95 ? Math.sin((t-.84)*30)*7 : 0}deg)`);
      poses(".scout-orientation",t=>`rotateY(${t<.28 ? -12 : t>=.44 && t<.70 ? 12 : 0}deg)`);
      sync();
    };
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting && entries[0].intersectionRatio>=.5;root.dataset.visible=String(visible);sync();},{threshold:.5});
    observer.observe(path);
    const changes=new MutationObserver(sync);
    changes.observe(studio,{attributes:true,subtree:true,attributeFilter:["data-robots-paused","open"]});
    const resize=new ResizeObserver(()=>{ if(travel?.effect instanceof KeyframeEffect) travel.effect.setKeyframes(moveFrames()); });
    resize.observe(path);
    const enter=()=>{hovering=true;sync();}; const leave=()=>{hovering=false;sync();};
    const focus=()=>{focused=true;sync();}; const blur=()=>{focused=false;sync();};
    robot.addEventListener("pointerenter",enter); robot.addEventListener("pointerleave",leave);
    robot.addEventListener("focus",focus); robot.addEventListener("blur",blur);
    document.addEventListener("visibilitychange",sync); media.addEventListener("change",build);
    build();
    return()=>{
      animations.forEach(animation=>animation.cancel()); observer.disconnect(); changes.disconnect(); resize.disconnect();
      robot.removeEventListener("pointerenter",enter); robot.removeEventListener("pointerleave",leave);
      robot.removeEventListener("focus",focus); robot.removeEventListener("blur",blur);
      document.removeEventListener("visibilitychange",sync); media.removeEventListener("change",build);
    };
  },[]);
  return <div ref={floor} className="scout-floor">
    <div ref={track} className="scout-walkway"><button ref={walker} className="scout-walker" type="button" onClick={onOpen} aria-label="Ask Scout about my projects"><span className="scout-orientation"><AgentCharacter agent="scout" walking/></span></button></div>
    <button ref={launcherRef} className="agent-desk scout-invite" type="button" onClick={onOpen} aria-label="Meet Scout and Scribe, the project AI agents"><span className="desk-caption">Ask Scout about my work <span aria-hidden="true">↗</span></span></button>
    <RobotMotionToggle/>
  </div>;
}
