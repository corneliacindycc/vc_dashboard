const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const dir = path.join(__dirname, "../public/readme");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const base = "http://127.0.0.1:3000";

  async function shot(url, name, waitMs = 800) {
    await page.goto(base + url, { waitUntil: "networkidle" });
    await page.waitForTimeout(waitMs);
    await page.screenshot({ path: path.join(dir, `${name}.png`) });
  }

  await shot("/", "01-overview");
  await shot("/radar", "02-radar");
  await shot("/companies/grab", "03-company");
  await shot("/agent", "04-agent-input");
  await page.goto(base + "/agent/grab", { waitUntil: "networkidle" });
  await page.waitForTimeout(5500);
  await page.screenshot({ path: path.join(dir, "05-agent-report.png") });
  await shot("/review", "06-team-review");
  await shot("/review/grab", "07-review-detail");
  await shot("/portfolio", "08-portfolio");
  await shot("/portfolio/pf-canva", "09-portfolio-detail");

  await browser.close();
  console.log("ok");
})();
