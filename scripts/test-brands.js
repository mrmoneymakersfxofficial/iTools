const { chromium } = require("playwright");
const { spawn } = require("child_process");

const BASE = "http://127.0.0.1:3098";

async function main() {
  // Start Next.js server
  const server = spawn("npx", ["next", "start", "-p", "3098"], {
    cwd: "/home/z/my-project",
    detached: true,
    stdio: "ignore",
    env: { ...process.env },
  });
  server.unref();

  // Wait for server
  await new Promise((r) => setTimeout(r, 8000));

  const viewports = [
    { w: 375, h: 812, label: "Android", file: "android-375x812", ua: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/125.0.0.0 Mobile Safari/537.36" },
    { w: 390, h: 844, label: "iOS", file: "ios-390x844", ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" },
    { w: 1440, h: 900, label: "Windows", file: "desktop-1440x900", ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36" },
  ];

  for (const vp of viewports) {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      userAgent: vp.ua,
    });
    const page = await ctx.newPage();

    try {
      await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 15000 });
      
      // Scroll to brand section
      // Use text content to distinguish: mobile has "18 MARCAS", desktop has brand names
      const sel = vp.w < 1024
        ? '[data-section="Comprar por Marca"]:has(> div > nav)'
        : '[data-section="Comprar por Marca"]:not(:has(> div > nav))';
      const section = page.locator(sel).first();
      const count = await section.count();
      
      if (count > 0) {
        await section.scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
        await section.screenshot({ path: `/home/z/my-project/download/brands-${vp.file}.png` });
        console.log(`OK ${vp.label}: brands-${vp.file}.png`);
      } else {
        await page.screenshot({ path: `/home/z/my-project/download/brands-${vp.file}.png` });
        console.log(`WARN ${vp.label} (full page): brands-${vp.file}.png`);
      }
    } catch (err) {
      console.error(`ERR ${vp.label}: ${err.message}`);
    }

    await browser.close();
  }

  // Kill server
  try { process.kill(-server.pid); } catch (_) {}
  
  console.log("Done");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });