import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const fonts = `<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,900&family=Geist+Mono:wght@500&family=Geist:wght@400;500&display=block" rel="stylesheet">`;
const base = `*{margin:0;box-sizing:border-box}body{width:100vw;height:100vh;overflow:hidden}`;

const icon = (size, radius) => `<!doctype html><html><head>${fonts}<style>${base}
body{display:flex;align-items:center;justify-content:center;background:${radius ? "transparent" : "#e0582a"}}
.tile{width:${size}px;height:${size}px;border-radius:${radius}px;background:#e0582a;display:flex;align-items:center;justify-content:center}
.t{font-family:Fraunces;font-weight:900;color:#fff;font-size:${Math.round(size * 0.42)}px;letter-spacing:-0.04em;line-height:1}
</style></head><body><div class="tile"><span class="t">301</span></div></body></html>`;

const logo = (name) => `data:image/svg+xml;base64,${readFileSync(`public/logos/${name}.svg`).toString("base64")}`;
const og = `<!doctype html><html><head>${fonts}<style>${base}
body{background:#f5f2ec;padding:46px 58px;color:#1c1813;font-family:Geist;display:flex;flex-direction:column}
.top{display:flex;align-items:center;justify-content:space-between;padding-bottom:25px;border-bottom:1px solid #dcd6cc}
.brand{font-size:30px;font-weight:600;letter-spacing:-1px}.brand span{color:#e0582a}
.k{font-family:'Geist Mono';color:#756b60;font-size:16px;letter-spacing:.12em}
h1{font-family:Fraunces;font-weight:900;font-size:78px;line-height:1.04;letter-spacing:-.045em;margin-top:34px}
p{font-size:27px;line-height:1.45;color:#655d53;margin-top:15px;max-width:960px}
.stack{margin-top:auto;display:flex;align-items:center;background:#fff;border:1px solid #e0d9cf;border-radius:20px;min-height:142px;padding:24px 27px;gap:24px}
.group{display:flex;align-items:center;gap:24px}.tool{display:flex;align-items:center;gap:12px;font-size:20px;font-weight:500;white-space:nowrap}
img{width:34px;height:34px;object-fit:contain}.or{font-size:15px;color:#8d8376}.arrow{font-size:32px;color:#b9b0a5;padding:0 6px}.services{flex:1;justify-content:space-between}.label{font-family:'Geist Mono';font-size:12px;color:#8d8376;letter-spacing:.06em;margin-bottom:17px}
</style></head><body>
<div class="top"><div class="brand">How to AI<span>.</span></div><div class="k">AI 301 / LOCAL AI</div></div>
<h1>AI that never leaves<br>your computer.</h1>
<p>One prompt sets up an open model and an agent that uses it.</p>
<div class="stack"><div style="flex:1"><div class="label">RUNS ON YOUR COMPUTER</div><div class="group services"><div class="tool"><img src="${logo('ollama')}">Ollama</div><span class="arrow">→</span><div class="tool"><img src="${logo('qwen')}">Qwen</div><span class="arrow">→</span><div class="tool"><img src="${logo('opencode')}">OpenCode</div><span class="arrow">+</span><div class="tool"><img src="${logo('vercel')}">Agent Desktop</div></div></div></div>
</body></html>`;

const jobs = [
  ["src/app/opengraph-image.png", 1200, 630, og],
  ["src/app/icon.png", 512, 512, icon(512, 112)],
  ["src/app/apple-icon.png", 180, 180, icon(180, 0)],
  ["public/icon-192.png", 192, 192, icon(192, 0)],
  ["public/icon-512.png", 512, 512, icon(512, 0)],
];

const browser = await chromium.launch();
for (const [file, width, height, html] of jobs) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file, omitBackground: file.endsWith("icon.png") && !file.includes("apple") });
  await page.close();
  console.log("wrote", file);
}
await browser.close();
