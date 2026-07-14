const { chromium } = require("playwright");
const { spawn } = require("child_process");

const BASE = "http://127.0.0.1:3097";

async function main() {
  const server = spawn("npx", ["next", "start", "-p", "3097"], {
    cwd: "/home/z/my-project",
    detached: true, stdio: "ignore", env: { ...process.env },
  });
  server.unref();
  await new Promise((r) => setTimeout(r, 8000));

  const viewports = [
    { w: 375, h: 812, label: "Android", file: "brands-android-375x812.png", ua: "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/125 Mobile" },
    { w: 390, h: 844, label: "iOS", file: "brands-ios-390x844.png", ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15" },
    { w: 1440, h: 900, label: "Desktop", file: "brands-desktop-1440x900.png", ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125" },
  ];

  for (const vp of viewports) {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, userAgent: vp.ua });
    const page = await ctx.newPage();
    try {
      await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 15000 });
      const sel = vp.w < 1024
        ? '[data-section="Comprar por Marca"]:has(> div > nav)'
        : '[data-section="Comprar por Marca"]:not(:has(> div > nav))';
      const section = page.locator(sel).first();
      if (await section.count() > 0) {
        await section.scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        await section.screenshot({ path: `/home/z/my-project/download/${vp.file}` });
        console.log(`OK ${vp.label}: ${vp.file}`);
      } else {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(600);
        await page.screenshot({ path: `/home/z/my-project/download/${vp.file}` });
        console.log(`WARN ${vp.label} (scroll)`);
      }
    } catch (e) { console.error(`ERR ${vp.label}: ${e.message}`); }
    await browser.close();
  }
  try { process.kill(-server.pid); } catch (_) {}
  console.log("Done");
  process.exit(0);
}

main().catch(() => process.exit(1));