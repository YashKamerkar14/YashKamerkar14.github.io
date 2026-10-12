import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
  expect(results.violations.map(v => ({ rule:v.id, nodes:v.nodes.map(n => ({ target:n.target, reason:n.failureSummary })) }))).toEqual([]);
}

test("the portfolio preserves all resume facts and the source PDF", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading",{level:1})).toHaveText("Yash Kamerkar");
  await expect(page.locator(".room-positioning")).toContainText("complexity into clarity");
  await expect(page.locator(".room-intro")).toContainText("software and AI engineer at Uber");
  await expect(page.locator(".room-eyebrow")).toContainText("SAN JOSE");
  await expect(page.locator(".experience-item")).toHaveCount(3);
  await expect(page.locator(".experience-body li")).toHaveCount(15);
  await expect(page.getByText("Aug 2026 — Present",{exact:true})).toBeVisible();
  await expect(page.getByText("Sep 2024 — May 2026 · Hoboken, NJ",{exact:true})).toBeVisible();
  await page.locator(".full-toolkit summary").click();
  await expect(page.locator(".toolkit-grid li")).toHaveCount(54);
  const portrait=page.locator(".paper-portrait img");
  await portrait.evaluate((el:HTMLImageElement)=>el.decode());
  expect(await portrait.evaluate((el:HTMLImageElement)=>el.naturalWidth>0)).toBeTruthy();
  const pdf=await page.request.get("/Yash_Mahesh_Kamerkar_Resume.pdf");
  expect(pdf.ok()).toBeTruthy();
  expect((await pdf.body()).subarray(0,4).toString()).toBe("%PDF");
});

test("experience is the first full section and details open by keyboard", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator("#experience").evaluate(el=>Boolean(el.compareDocumentPosition(document.getElementById("work")!)&Node.DOCUMENT_POSITION_FOLLOWING))).toBeTruthy();
  await expect(page.locator(".employment-label h3")).toHaveText(["Uber","Universal Courier","Dell Technologies"]);
  await expect(page.locator(".header-name")).toHaveText("Home");
  await expect(page.locator(".work-poster,.pull-note,.chapter-rail")).toHaveCount(0);
  const note=page.locator(".experience-details").first();
  await expect(note).not.toHaveAttribute("open");
  await note.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(note).toHaveAttribute("open","");
  await expect(note).toContainText("180 GB");
  await page.keyboard.press("Enter");
  await expect(note).not.toHaveAttribute("open");
});

test("all three projects are visible together with concise summaries and research links",async({page})=>{
  await page.goto("/#work");
  await expect(page.locator(".project-card")).toHaveCount(3);
  await expect(page.locator(".project-card h3")).toHaveText(["Context Window","Medical Bill Auditor","FlightSense"]);
  for(const card of await page.locator(".project-card").all()) {
    expect((await card.locator(".project-description").innerText()).length).toBeLessThan(180);
    expect(await card.locator(".project-tags li").count()).toBeLessThanOrEqual(4);
  }
  await expect(page.locator(".context-project,.context-details,.newsroom-team")).toHaveCount(0);
  await expect(page.locator("#flightsense").getByRole("link",{name:/Read paper/})).toHaveAttribute("href","https://arxiv.org/abs/2605.07364");
  await expect(page.locator("#flightsense")).not.toContainText("ROC-AUC");
  await expect(page.locator("#football")).toHaveCount(0);
});

test("medical search shows concise summaries without internal review notes",async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:/Search .*portfolio/}).click();
  await page.getByRole("textbox",{name:"Search work, experience, skills, or contact"}).fill("medical");
  const results=page.locator(".search-results li");
  await expect(results).toHaveCount(2);
  for(const result of await results.all()) {
    await expect(result).toContainText("Medical Bill Auditor");
    expect((await result.locator("p").innerText()).length).toBeLessThan(180);
  }
  await expect(page.locator(".search-results")).not.toContainText("Projects_Resume.docx");
  await expect(page.locator(".search-results")).not.toContainText("review environment");
});

test("the portfolio keeps one visual mode and search still accepts the B key", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".paper-studio")).toHaveAttribute("data-room-visible","true");
  const title=page.getByRole("heading",{level:1});
  const font=await title.evaluate(el=>getComputedStyle(el).fontFamily);
  await expect(page.getByRole("button",{name:/Blueprint|Paper mode/})).toHaveCount(0);
  await page.keyboard.press("b");
  expect(await title.evaluate(el=>getComputedStyle(el).fontFamily)).toBe(font);
  await expect(page.locator(".paper-studio")).not.toHaveAttribute("data-blueprint");
  await page.keyboard.press("Control+k");
  await page.getByRole("textbox").fill("backend");
  await expect(page.getByRole("textbox")).toHaveValue("backend");
  await page.keyboard.press("Escape");
});

test("main navigation tracks experience and project reading", async ({ page }) => {
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  await expect(page.locator(".paper-studio")).toHaveAttribute("data-room-visible","true");
  const nav=page.getByRole("navigation",{name:"Main navigation",exact:true});
  for(const name of ["Experience","Projects","Contact"]){
    await nav.getByRole("link",{name,exact:true}).click();
    await expect(nav.getByRole("link",{name,exact:true})).toHaveAttribute("aria-current","location");
  }
  await page.getByRole("link",{name:"Home",exact:true}).click();
  await expect(page.getByRole("heading",{level:1})).toBeInViewport();
});

test("mobile menu navigates and closes with Escape", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  await expect(page.locator(".paper-studio")).toHaveAttribute("data-room-visible","true");
  const menu=page.locator(".mobile-menu");
  const trigger=menu.locator("summary");
  await trigger.click();
  await expect(menu).toHaveAttribute("open","");
  const nav=page.getByRole("navigation",{name:"Mobile navigation"});
  await expect(nav.getByRole("link",{name:/Resume/})).toHaveAttribute("href","/Yash_Mahesh_Kamerkar_Resume.pdf");
  await nav.getByRole("link",{name:"Experience",exact:true}).click();
  await expect(page).toHaveURL(/#experience$/);
  await expect(menu).not.toHaveAttribute("open");
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(menu).not.toHaveAttribute("open");
  await expect(trigger).toBeFocused();
});

test("research case, architecture paths, sitemap and 404 work", async ({ page }) => {
  const failed:string[]=[];
  page.on("response",r=>{if(r.status()>=400)failed.push(r.url());});
  await page.goto("/#work");
  await page.locator("#flightsense").getByRole("link",{name:/Research notes/}).click();
  await expect(page).toHaveURL(/\/work\/flightsense\/$/);
  await expect(page.getByRole("heading",{level:1})).toContainText("FlightSense");
  await page.getByRole("button",{name:"Weather ingestion"}).click();
  await expect(page.locator(".architecture-flow")).toContainText("AWS Lambda");
  await page.getByRole("button",{name:"AI assistant"}).click();
  await expect(page.locator(".architecture-flow")).toContainText("Bedrock");
  await page.waitForLoadState("networkidle");
  expect(failed).toEqual([]);
  const xml=await page.request.get("/sitemap.xml");
  expect(await xml.text()).toContain("/work/flightsense/");
  const missing=await page.request.get("/a-route-that-does-not-exist/");
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain("a wrong turn");
});

for(const width of [320,360,390,768,1024,1440]) test("homepage and case have no overflow at "+width+"px",async({page})=>{
  await page.setViewportSize({width,height:900});
  for(const route of ["/","/work/flightsense/"]){
    await page.goto(route); await page.evaluate(()=>document.fonts.ready);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
    if(route==="/"){
      await page.locator("details").evaluateAll(items=>items.forEach(item=>item.setAttribute("open","")));
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
    }
  }
});

test("search finds evidence, empty states, and restores focus",async({page})=>{
  await page.goto("/");
  await expect(page.locator(".paper-studio")).toHaveAttribute("data-room-visible","true");
  await page.keyboard.press("Control+k");
  const search=page.getByRole("textbox",{name:"Search work, experience, skills, or contact"});
  await expect(search).toBeFocused();
  await search.fill("RAG");
  await expect(page.locator(".search-results")).toContainText("12,000 compliance documents");
  await search.fill("zznonexistent");
  await expect(page.locator(".search-empty")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button",{name:/^Search .*portfolio$/})).toBeFocused();
});

test("cross-page search expands matching resume and toolkit evidence",async({page})=>{
  for(const [query,hash] of [["180 GB","experience-1"],["Terraform","toolkit"]]){
    await page.goto("/work/flightsense/");
    await page.getByRole("button",{name:/^Search .*portfolio$/}).click();
    await page.getByRole("textbox").fill(query);
    await page.locator(".search-results").getByRole("link").first().click();
    await expect(page).toHaveURL(new RegExp("/#"+hash+"$"));
    await expect(page.locator("#"+hash+" details")).toHaveAttribute("open","");
    await expect(page.getByText(query==="Terraform"?"Terraform":/ETL pipeline ingesting and normalizing 180 GB/,{exact:query==="Terraform"})).toBeVisible();
  }
});

test("email copy and verified contact links work",async({page,context})=>{
  await context.grantPermissions(["clipboard-read","clipboard-write"]);
  await page.goto("/#contact");
  await page.getByRole("button",{name:"Copy email address"}).click();
  await expect(page.locator(".copy-status")).toHaveText("Email address copied.");
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe("yashkamerkar1407@gmail.com");
  await expect(page.getByRole("link",{name:"Email Yash Kamerkar",exact:true})).toHaveAttribute("href","mailto:yashkamerkar1407@gmail.com");
});

test("core reading, mobile navigation and disclosures work without JavaScript",async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto("http://127.0.0.1:3000/");
  await expect(page.getByRole("heading",{level:1})).toBeVisible();
  await page.locator(".experience-details summary").first().click();
  await expect(page.getByText(/Integrated 3 carrier REST APIs/)).toBeVisible();
  await page.locator(".mobile-menu summary").click();
  await page.getByRole("navigation",{name:"Mobile navigation"}).getByRole("link",{name:"Projects"}).click();
  await expect(page.locator("#work-title")).toBeInViewport();
  await expect(page.locator("#context-window .project-links").getByRole("link",{name:/Live demo/})).toBeVisible();
  await expect(page.locator("#medical-bill-auditor .project-links").getByRole("link",{name:/Live demo/})).toBeVisible();
  await page.goto("http://127.0.0.1:3000/work/flightsense/");
  await page.locator(".architecture-transcript summary").click();
  await expect(page.locator(".architecture-transcript")).toContainText("Amazon Bedrock");
  await context.close();
});

test("reduced motion, zoom and a short phone remain readable",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  await page.evaluate(()=>{document.documentElement.style.zoom="2";});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
  await page.evaluate(()=>{document.documentElement.style.zoom="1";});
  await page.setViewportSize({width:375,height:667});
  await expect(page.getByRole("heading",{level:1})).toBeVisible();
  await expect(page.locator(".header-name")).toBeVisible();
  await page.locator("#experience-title").scrollIntoViewIfNeeded();
  await expect(page.locator("#experience-title")).toBeInViewport();
});

test("homepage, expanded evidence, case and search pass automated accessibility",async({page})=>{
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:900});
    await page.goto("/");
    await page.locator("details").evaluateAll(items=>items.forEach(item=>item.setAttribute("open","")));
    await expectAccessible(page);
    await page.getByRole("button",{name:/^Search .*portfolio$/}).click();
    await expectAccessible(page);
    await page.goto("/work/flightsense/");
    await page.locator("details").evaluateAll(items=>items.forEach(item=>item.setAttribute("open","")));
    await expectAccessible(page);
  }
});
