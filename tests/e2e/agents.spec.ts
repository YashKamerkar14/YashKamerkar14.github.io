import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Mettle has real destinations and its starter sends one question with source links",async({page})=>{
 let questions=0;
 await page.route("**/api/agents/status",route=>route.fulfill({json:{configured:true,provider:"OpenRouter"}}));
 await page.route("**/api/agents",async route=>{
  questions++;
  expect(route.request().postDataJSON().question).toBe("What did Mettle find about 4-bit compression?");
  await route.fulfill({contentType:"application/x-ndjson",body:[
   {type:"delta",text:"On the RTX 4080 Laptop GPU, 4-bit was 12% faster, but instruction-following dropped from 48% to 9%. The accuracy result was inconclusive."},
   {type:"sources",sources:[{label:"Mettle live benchmark",url:"https://yashkamerkar14.github.io/mettle/"}]},
   {type:"done"}
  ].map(event=>JSON.stringify(event)).join("\n")+"\n"});
 });
 await page.goto("/#work");
 const project=page.locator("#mettle");
 await expect(project.getByRole("link",{name:/Live demo/})).toHaveAttribute("href","https://yashkamerkar14.github.io/mettle/");
 await expect(project.getByRole("link",{name:/GitHub/})).toHaveAttribute("href","https://github.com/YashKamerkar14/mettle");
 await page.getByRole("button",{name:/Search .*portfolio/}).click();
 await page.getByRole("textbox",{name:"Search work, experience, skills, or contact"}).fill("mettle");
 await expect(page.locator(".search-results li")).toHaveCount(2);
 await expect(page.locator(".search-results")).not.toContainText("blinded scorer audit");
 await page.keyboard.press("Escape");
 await page.getByRole("button",{name:"Meet Scout and Scribe, the project AI agents"}).click();
 expect(questions).toBe(0);
 await page.getByRole("button",{name:"What did Mettle find about 4-bit compression?",exact:true}).click();
 await expect(page.locator(".agent-answer")).toContainText("accuracy result was inconclusive");
 await expect(page.locator(".agent-sources").getByRole("link",{name:/Mettle live benchmark/})).toHaveAttribute("href","https://yashkamerkar14.github.io/mettle/");
 expect(questions).toBe(1);
});

test("public GitHub sources and the supplied Twitter profile are linked accurately",async({page})=>{
 await page.goto("/");
 await expect(page.locator("#context-window").getByRole("link",{name:/Live demo/})).toHaveAttribute("href","https://context-window-gamma.vercel.app/");
 await expect(page.locator("#context-window .project-links").getByRole("link",{name:/GitHub/})).toHaveAttribute("href","https://github.com/YashKamerkar14/context-window");
 await expect(page.locator("#flightsense .project-links").getByRole("link",{name:/GitHub/})).toHaveAttribute("href","https://github.com/YashKamerkar14/Flight-Delay-Prediction-using-Amazon-Sagemaker");
 await expect(page.locator("#flightsense")).toContainText("CO-AUTHORED");
 await expect(page.locator(".poster-research")).toHaveCount(0);
 for(const route of ["/","/work/flightsense/"]){
  await page.goto(route);
  await expect(page.getByRole("link",{name:"Twitter / X"})).toHaveAttribute("href","https://x.com/Yashrooney14");
 }
});

test("agents disclose a missing connection and preserve dialog keyboard behavior",async({page})=>{
 await page.route("**/api/agents/status",route=>route.fulfill({json:{configured:false}}));
 await page.goto("/");
 const launch=page.getByRole("button",{name:"Meet Scout and Scribe, the project AI agents"});
 await launch.click();
 await expect(page.getByRole("dialog",{name:/Small team/})).toBeVisible();
 await expect(page.locator(".agent-offline")).toContainText("isn’t connected yet");
 await expect(page.locator(".agent-offline").getByRole("link",{name:/Medical Bill Auditor/})).toHaveAttribute("href","https://medical-bill-auditor-demo.streamlit.app/");
 await expect(page.getByRole("button",{name:"Ask the team",exact:true})).toBeDisabled();
 await page.keyboard.press("Escape");
 await expect(launch).toBeFocused();
});

test("Medical Bill Auditor starter submits exactly one question with a bounded example answer",async({page})=>{
 let questions=0;
 await page.route("**/api/agents/status",route=>route.fulfill({json:{configured:true,provider:"OpenRouter"}}));
 await page.route("**/api/agents",async route=>{
  questions++;
  expect(route.request().postDataJSON().question).toBe("How does Medical Bill Auditor check bills?");
  await route.fulfill({contentType:"application/x-ndjson",body:[
   {type:"delta",text:"Its hosted demo checks six synthetic examples with deterministic rules; the full local system adds model-assisted matching and RAG."},
   {type:"done"}
  ].map(event=>JSON.stringify(event)).join("\n")+"\n"});
 });
 await page.goto("/");
 await page.getByRole("button",{name:"Meet Scout and Scribe, the project AI agents"}).click();
 expect(questions).toBe(0);
 await page.getByRole("button",{name:"How does Medical Bill Auditor check bills?",exact:true}).click();
 await expect(page.locator(".agent-answer")).toContainText("six synthetic examples");
 expect(questions).toBe(1);
});

test("real-stage events drive the characters and streamed answers retain source links",async({page})=>{
 await page.emulateMedia({reducedMotion:"reduce"});
 await page.route("**/api/agents/status",route=>route.fulfill({json:{configured:true}}));
 await page.route("**/api/agents",async route=>{
  const question=route.request().postDataJSON().question;
  expect(question).toBe("How does FlightSense work?");
  await new Promise(resolve=>setTimeout(resolve,250));
  const events=[
   {type:"stage",agent:"scout",status:"Checking GitHub sources"},
   {type:"sources",sources:[{label:"FlightSense · GitHub README",url:"https://github.com/YashKamerkar14/Flight-Delay-Prediction-using-Amazon-Sagemaker"}]},
   {type:"stage",agent:"scout",status:"Sources ready"},
   {type:"stage",agent:"scribe",status:"Writing a grounded answer"},
   {type:"delta",text:"FlightSense combines SageMaker prediction with a Streamlit interface."},
   {type:"stage",agent:"scribe",status:"Answer ready"},
   {type:"done"}
  ];
  await route.fulfill({contentType:"application/x-ndjson",body:events.map(event=>JSON.stringify(event)).join("\n")+"\n"});
 });
 await page.goto("/");
 await page.getByRole("button",{name:"Meet Scout and Scribe, the project AI agents"}).click();
 await page.getByRole("button",{name:"How does FlightSense work?"}).click();
 await expect(page.getByRole("button",{name:/Stop/})).toBeVisible();
 await expect(page.locator(".agent-answer")).toContainText("SageMaker prediction");
 await expect(page.locator(".agent-sources").getByRole("link")).toHaveAttribute("href","https://github.com/YashKamerkar14/Flight-Delay-Prediction-using-Amazon-Sagemaker");
 await expect(page.locator(".agent-team")).toContainText("Answer ready");
 await expect(page.locator(".agent-error")).toHaveCount(0);
});

test("agent failures are visible and never replaced with simulated answers",async({page})=>{
 await page.route("**/api/agents/status",route=>route.fulfill({json:{configured:true}}));
 await page.route("**/api/agents",route=>route.fulfill({status:503,json:{error:"The AI service is unavailable right now."}}));
 await page.goto("/");
 await page.getByRole("button",{name:"Meet Scout and Scribe, the project AI agents"}).click();
 await page.getByRole("button",{name:"How does FlightSense work?"}).click();
 await expect(page.locator(".agent-error")).toContainText("unavailable");
 await expect(page.locator(".agent-answer")).toHaveCount(0);
 await expect(page.getByRole("textbox",{name:"Your question"})).toBeEnabled();
});

test("stopping a question cancels work and labels the answer unfinished",async({page})=>{
 await page.route("**/api/agents/status",route=>route.fulfill({json:{configured:true}}));
 await page.route("**/api/agents",async route=>{
  await new Promise(resolve=>setTimeout(resolve,400));
  try { await route.fulfill({contentType:"application/x-ndjson",body:'{"type":"delta","text":"Late answer"}\n{"type":"done"}\n'}); } catch { /* The visitor cancelled this request. */ }
 });
 await page.goto("/");
 await page.getByRole("button",{name:"Meet Scout and Scribe, the project AI agents"}).click();
 await page.getByRole("button",{name:"How does FlightSense work?"}).click();
 await page.getByRole("button",{name:/Stop/}).click();
 await expect(page.locator(".agent-reading")).toContainText("unfinished answer");
 await expect(page.locator(".agent-team")).toContainText("Answer stopped");
 await expect(page.getByRole("textbox",{name:"Your question"})).toBeEnabled();
 await expect(page.locator(".agent-answer")).toHaveCount(0);
});

test("robot dialog is accessible and responsive",async({page})=>{
 await page.route("**/api/agents/status",route=>route.fulfill({json:{configured:true}}));
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:844});
  await page.goto("/");
  await page.getByRole("button",{name:"Meet Scout and Scribe, the project AI agents"}).click();
  await expect(page.getByRole("textbox",{name:"Your question"})).toBeFocused();
  const violations=(await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze()).violations;
  expect(violations.map(item=>({rule:item.id,nodes:item.nodes.map(node=>node.failureSummary)}))).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  const dialog=page.locator(".agent-dialog");
  expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBeTruthy();
  await page.getByRole("button",{name:"Close project agents"}).click();
 }
});
