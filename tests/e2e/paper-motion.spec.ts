import { test, expect } from "@playwright/test";

test("background depth visibly follows the pointer while text stays steady", async ({ page }) => {
  await page.setViewportSize({ width:1440, height:1000 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const grid=page.locator(".studio-grid"), floor=page.locator(".room-floor");
  const headingBefore=await page.locator("#hero-title").boundingBox();
  await page.mouse.move(1250,230);
  await expect.poll(async()=> (await grid.boundingBox())!.x).toBeLessThan(-90);
  const gridRight=(await grid.boundingBox())!.x, floorRight=(await floor.boundingBox())!.x;
  await page.mouse.move(170,700);
  await expect.poll(async()=> (await grid.boundingBox())!.x-gridRight).toBeGreaterThan(40);
  await expect.poll(async()=> floorRight-(await floor.boundingBox())!.x).toBeGreaterThan(20);
  expect(await page.locator("#hero-title").boundingBox()).toEqual(headingBefore);
  await page.locator("#experience").evaluate(el=>el.scrollIntoView({block:"start"}));
  await page.mouse.move(1250,200);
  await expect.poll(async()=> (await grid.boundingBox())!.x).toBeLessThan(-90);
  await page.mouse.move(170,200);
  await expect.poll(async()=> (await grid.boundingBox())!.x).toBeGreaterThan(-55);
  await page.emulateMedia({reducedMotion:"reduce"});
  await expect(grid).toHaveCSS("transform","none");
  await expect(floor).toHaveCSS("translate","none");
});

test("subtle mouse feedback and robot gaze preserve native actions", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const studio = page.locator(".paper-studio");
  await expect(studio).toHaveAttribute("data-room-visible", "true");
  const art=page.locator(".room-art");
  const initialPose=await art.evaluate(el=>getComputedStyle(el).transform);
  await page.mouse.move(1180, 240);
  await expect(studio).toHaveAttribute("data-pointer", "active");
  await expect.poll(()=>art.evaluate(el=>getComputedStyle(el).transform)).not.toBe(initialPose);
  await expect.poll(() => page.locator(".scout-walker .agent-gaze").evaluate(el => getComputedStyle(el).transform)).not.toBe("matrix(1, 0, 0, 1, 0, 0)");
  const launch = page.getByRole("button", { name: "Meet Scout and Scribe, the project AI agents" });
  await launch.hover();
  await expect(page.locator(".ink-cursor-label")).toHaveText("Ask the team");
  await expect(page.locator(".ink-cursor-label")).toBeVisible();
  await launch.click();
  await expect(page.getByRole("dialog", { name: /Small team/ })).toBeVisible();
  await expect(page.locator(".ink-cursor")).toHaveCSS("opacity", "0");
  await page.keyboard.press("Escape");
  await expect(launch).toBeFocused();
  await page.locator("#context-window .project-preview").hover();
  await expect(page.locator(".project-card").first()).toHaveAttribute("data-hovering", "true");
  await page.keyboard.press("Tab");
  await expect(studio).not.toHaveAttribute("data-pointer");
  await expect(page.locator(".project-card").first()).not.toHaveAttribute("data-hovering");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});

test("mouse-wheel scrolling moves the room layers and reading progress without capturing scroll",async({page})=>{
  await page.setViewportSize({width:1440,height:1000});
  await page.goto("/");
  await expect(page.locator(".paper-studio")).toHaveAttribute("data-room-visible","true");
  const art=page.locator(".room-art");
  const initial=await art.evaluate(el=>getComputedStyle(el).translate);
  await page.mouse.move(1100,300);
  await page.mouse.wheel(0,300);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(200);
  await expect.poll(()=>art.evaluate(el=>getComputedStyle(el).translate)).not.toBe(initial);
  await expect.poll(()=>page.locator(".reading-progress").evaluate(el=>el.getBoundingClientRect().width)).toBeGreaterThan(0);
  await page.emulateMedia({reducedMotion:"reduce"});
  await expect(art).toHaveCSS("translate","none");
  await page.mouse.wheel(0,200);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(400);
});

test("reduced motion takes effect immediately and touch has no mouse effects", async ({ page, browser }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".paper-studio")).toHaveAttribute("data-room-visible", "true");
  await page.mouse.move(1100, 240);
  await expect(page.locator(".paper-studio")).toHaveAttribute("data-pointer", "active");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".paper-studio")).not.toHaveAttribute("data-pointer");
  await expect(page.locator(".ink-cursor")).toHaveCSS("display", "none");
  await expect(page.locator(".scout-walker .agent-gaze")).toHaveCSS("transform", "none");
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 1024, height: 900 } });
  try {
    const touch = await context.newPage();
    await touch.goto("http://127.0.0.1:3000/");
    await touch.mouse.move(700, 240);
    await expect(touch.locator(".ink-cursor")).toHaveCSS("display", "none");
    await expect(touch.locator(".paper-studio")).not.toHaveAttribute("data-pointer");
    await touch.getByRole("button", { name: "Meet Scout and Scribe, the project AI agents" }).tap();
    await expect(touch.getByRole("dialog", { name: /Small team/ })).toBeVisible();
  } finally { await context.close(); }
});
