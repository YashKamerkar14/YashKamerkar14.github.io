import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("drawer links all four visible project windows and dismisses accessibly",async({page})=>{
  await page.setViewportSize({width:1440,height:1000});
  let questions=0;
  await page.route("**/api/agents",route=>{questions++;return route.fulfill({status:500,json:{error:"No model calls during workspace checks"}});});
  await page.goto("/");
  const handle=page.getByRole("button",{name:"Open project drawer",exact:true});
  await handle.click();
  const panel=page.getByRole("region",{name:"Project drawer",exact:true});
  await expect(panel.getByRole("heading",{level:3})).toHaveText(["Context Window","Medical Bill Auditor","FlightSense","Mettle"]);
  await expect(panel.getByRole("link",{name:"Medical Bill Auditor live demo from drawer"})).toHaveAttribute("href","https://medical-bill-auditor-demo.streamlit.app/");
  const accessibility=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();
  expect(accessibility.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(handle).toBeFocused();
  await handle.click();
  await page.getByRole("heading",{level:1}).click();
  await expect(panel).toBeHidden();
  await page.emulateMedia({reducedMotion:"reduce"});
  await handle.click();
  await expect(panel).toBeVisible();
  await panel.getByRole("button",{name:"Close drawer contents"}).click();
  await expect(panel).toBeHidden();
  expect(questions).toBe(0);
});

test("all projects and their real links remain readable without JavaScript or books",async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:1000}});
  try {
    const page=await context.newPage();
    await page.goto("http://127.0.0.1:3000/#work");
    await expect(page.locator(".project-window h3")).toHaveText(["Context Window","Medical Bill Auditor","FlightSense","Mettle: Test your machine’s mettle"]);
    await expect(page.locator(".project-book")).toHaveCount(0);
    await expect(page.locator("#medical-bill-auditor").getByRole("link",{name:/Live demo/})).toHaveAttribute("href","https://medical-bill-auditor-demo.streamlit.app/");
    await expect(page.locator("#flightsense").getByRole("link",{name:/Read paper/})).toHaveAttribute("href","https://arxiv.org/abs/2605.07364");
    await expect(page.locator("#football")).toHaveCount(0);
  } finally {await context.close();}
});

test("phone gallery anchors and drawer work by tap without overflow",async({browser})=>{
  const context=await browser.newContext({hasTouch:true,isMobile:true,viewport:{width:390,height:844},reducedMotion:"reduce"});
  try {
    const page=await context.newPage();
    await page.goto("http://127.0.0.1:3000/#medical-bill-auditor");
    await expect(page.locator("#medical-bill-auditor h3")).toBeInViewport();
    await page.getByRole("button",{name:"Open project drawer",exact:true}).tap();
    const panel=page.getByRole("region",{name:"Project drawer",exact:true});
    const bounds=await panel.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(390);
    await panel.getByRole("button",{name:"Close drawer contents"}).tap();
    await expect(panel).toBeHidden();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  } finally {await context.close();}
});
