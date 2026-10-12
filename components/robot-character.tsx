"use client";

import { useId } from "react";

/** Original articulated robots. Desk routines are ornamental; working reflects API activity. */
export function AgentCharacter({ agent, working = false, station = false, walking = false }: { agent: "scout" | "scribe"; working?: boolean; station?: boolean; walking?: boolean }) {
  const id = "robot-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const scout = agent === "scout";
  const accent = scout ? "#9ed5c8" : "#b8b7df";
  const glow = scout ? "#a8f1dc" : "#d2d0ff";
  return <svg viewBox="0 0 220 240" fill="none" aria-hidden="true" className={"agent-character character-" + agent} data-working={working} data-scene={walking ? "walk" : station ? "desk" : "figure"}>
    <defs>
      <linearGradient id={id + "-shell"} x1="64" y1="20" x2="163" y2="173" gradientUnits="userSpaceOnUse"><stop stopColor="#fffef8"/><stop offset=".45" stopColor="#e5e8e2"/><stop offset="1" stopColor="#9aa7a5"/></linearGradient>
      <linearGradient id={id + "-edge"} x1="50" y1="50" x2="178" y2="100" gradientUnits="userSpaceOnUse"><stop stopColor="#bcc5c0"/><stop offset=".6" stopColor="#f2f4eb"/><stop offset="1" stopColor="#7c8d89"/></linearGradient>
      <linearGradient id={id + "-glass"} x1="71" y1="36" x2="148" y2="95" gradientUnits="userSpaceOnUse"><stop stopColor="#344744"/><stop offset=".48" stopColor="#182d2b"/><stop offset="1" stopColor="#0a1c1c"/></linearGradient>
      <linearGradient id={id + "-accent"} x1="68" y1="115" x2="133" y2="170" gradientUnits="userSpaceOnUse"><stop stopColor="#edf8ef"/><stop offset=".45" stopColor={accent}/><stop offset="1" stopColor={scout ? "#589788" : "#77759f"}/></linearGradient>
      <radialGradient id={id + "-shadow"}><stop stopColor="#233e38" stopOpacity=".24"/><stop offset="1" stopColor="#233e38" stopOpacity="0"/></radialGradient>
    </defs>
    <ellipse cx="112" cy="222" rx="94" ry="14" fill={"url(#" + id + "-shadow)"}/>
    <g className="agent-body" stroke="#405551" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <g className="robot-legs">
        <g className="robot-leg-left"><path d="M88 165v34" stroke="#6c7e77" strokeWidth="12"/><circle cx="88" cy="181" r="7" fill="#d0dad1"/><path d="M88 179v4" stroke="#80958b"/><rect x="72" y="193" width="28" height="23" rx="7" fill={"url(#" + id + "-edge)"}/><path d="M77 208h18" stroke="#4b5e58" strokeWidth="4"/></g>
        <g className="robot-leg-right"><path d="M127 165v34" stroke="#6c7e77" strokeWidth="12"/><circle cx="127" cy="181" r="7" fill="#d0dad1"/><path d="M127 179v4" stroke="#80958b"/><rect x="115" y="193" width="28" height="23" rx="7" fill={"url(#" + id + "-edge)"}/><path d="M120 208h18" stroke="#4b5e58" strokeWidth="4"/></g>
      </g>
      <path d="M97 95v25h22V95" fill="#728780"/><path d="M99 104h18m-18 5h18m-18 5h18" stroke="#d4ded4"/>
      <path d="M73 121q0-10 11-10h47q11 0 11 10v39q0 16-14 18H86q-13-2-13-18Z" fill={"url(#" + id + "-shell)"}/>
      <path d="M78 122q0-6 6-6h45q7 0 7 6v27q0 7-7 7H84q-6 0-6-7Z" fill={"url(#" + id + "-accent)"} stroke="#7a9690"/>
      <rect x="88" y="123" width="37" height="22" rx="4" fill="#273c37"/><path d="M95 130h20m-20 6h13" stroke={glow} strokeWidth="2"/>
      <circle className="robot-led" cx="126" cy="165" r="3" fill={glow}/><path d="M84 163h21m-21 4h21" stroke="#677b73"/>
      <g className="robot-head">
        <path d="M61 33q0-15 16-16h68q18 0 23 14v53q0 17-18 20l-76-1q-13-1-13-16Z" fill={"url(#" + id + "-edge)"}/>
        <rect x="51" y="23" width="110" height="77" rx="22" fill={"url(#" + id + "-shell)"}/>
        <path d="M60 40q1-10 12-11h68" stroke="#fffef8" strokeWidth="3" opacity=".85"/>
        <rect x="62" y="35" width="88" height="54" rx="16" fill={"url(#" + id + "-glass)"} stroke="#667b73"/>
        <path d="M70 46q2-5 8-5h42" stroke="#b8d7c9" opacity=".18" strokeWidth="2"/>
        <rect x="43" y="47" width="10" height="27" rx="4" fill={accent}/><rect x="162" y="47" width="10" height="27" rx="4" fill="#8da29b"/>
        <path d="M106 23V11" stroke="#728b80" strokeWidth="3"/><circle className="robot-led" cx="106" cy="8" r="4" fill={accent}/>
        <g className="agent-gaze"><g className="agent-eyes" fill={glow} stroke="none"><rect x="82" y="52" width="10" height="15" rx="4"/><rect x="123" y="52" width="10" height="15" rx="4"/><rect x="83" y="52" width="3" height="4" rx="1" fill="#f4fff7"/><rect x="124" y="52" width="3" height="4" rx="1" fill="#f4fff7"/></g><path d="M99 76q9 6 18-1" stroke={glow} strokeWidth="2"/></g>
        <g stroke="#8fa59a" strokeWidth="1"><circle cx="68" cy="95" r="2"/><circle cx="146" cy="95" r="2"/><path d="m67 94 2 2m76-2 2 2"/></g>
      </g>
    </g>
    {station && <g className="robot-workbench" stroke="#667a6f" strokeWidth="1.4" strokeLinejoin="round">
      <path d="m21 187 11-19h159l15 19-15 9H31Z" fill="#dadcd0"/><path d="M21 187h185v9H21Z" fill="#b7bfb0"/><path d="M34 196v21m159-21v21" strokeWidth="5"/>
      {scout ? <g className="robot-task"><path d="m136 151 43-3 5 27-43 4Z" fill="#fffdf1"/><path d="m146 160 23-2m-22 8 28-2m-27 8 13-1" stroke="#8ca09a"/><path d="m145 182 35-2 8 8-35 2Z" fill="#f6f4e8"/><path className="robot-scan" d="m144 166 35-3" stroke="#2d9c86" strokeWidth="2.5"/><rect x="35" y="171" width="26" height="9" rx="2" fill="#77978a"/><path d="M40 175h16" stroke="#d3e6cf"/></g> : <g className="robot-task"><path d="m90 137 53-3 1 39-52 4Z" fill="#9aaea4"/><path d="m94 141 45-2 1 30-45 4Z" fill="#1b3632"/><path className="robot-code-line code-one" d="m100 149 26-1" stroke="#a8cfc0" strokeWidth="2"/><path className="robot-code-line code-two" d="m100 156 18-1" stroke="#c2bce9" strokeWidth="2"/><path className="robot-code-line code-three" d="m100 163 32-2" stroke="#a8cfc0" strokeWidth="2"/><path d="m92 177 52-4 9 11-54 5Z" fill="#d9e0d5"/><path d="m100 180 36-3m-32 8 38-3" stroke="#8c9b90"/><path d="m157 176 27-2 9 13-28 2Z" fill="#fffced"/><path d="m165 181 15-1m-11 6 15-1" stroke="#8c9b90"/><path d="m35 170 18-2 4 13-18 2Z" fill="#e9dfc7"/><path d="M54 172q10-2 10 4t-8 4"/></g>}
    </g>}
    <g stroke="#405551" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <g className="robot-arm robot-arm-left"><circle cx="72" cy="126" r="8" fill={accent}/><path d={scout ? "m70 131-13 18 14 14" : "m70 131-9 18 33 26"} stroke="#849e93" strokeWidth="10"/><circle cx={scout ? 56 : 61} cy="149" r="6" fill="#dbe3d7"/><rect x={scout ? 63 : 87} y={scout ? 159 : 169} width="15" height="10" rx="4" fill={"url(#" + id + "-shell)"}/></g>
      <g className="robot-arm robot-arm-right"><circle cx="143" cy="126" r="8" fill={accent}/><path d="m148 129 18 13-5 18" stroke="#8ea79b" strokeWidth="10"/><circle cx="166" cy="143" r="6" fill="#e1e8dc"/><rect x="152" y="153" width="17" height="11" rx="4" fill={"url(#" + id + "-shell)"}/>
        {walking ? <g className="robot-tablet"><rect x="162" y="143" width="29" height="38" rx="4" fill="#d1dace"/><rect x="166" y="147" width="21" height="27" rx="2" fill="#21463e"/><path d="M170 154h13m-13 5h9m-9 5h13" stroke="#b8e1c9" strokeWidth="2"/><circle cx="177" cy="178" r="1" fill="#527969"/></g> : scout ? <g className="agent-tool"><path d="m168 156 9-13" stroke="#385e52" strokeWidth="5"/><circle cx="184" cy="132" r="16" fill="#86b2a4"/><circle cx="184" cy="132" r="12" fill="#cce9e0" fillOpacity=".75"/><path d="m177 125 11-2" stroke="#fffef3" strokeWidth="3"/></g> : <g className="agent-tool"><path d="m166 151 10 2-7 20-7 4-1-8Z" fill="#d9ac62"/><path d="m162 177 7-4" stroke="#49554b" strokeWidth="3"/></g>}
      </g>
    </g>
  </svg>;
}
