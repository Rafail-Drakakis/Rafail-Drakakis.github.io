import { chromium } from 'playwright';
import { getBrowser } from './terminal-capture.mjs';

export async function captureWebPage({
  url,
  dest,
  width = 1280,
  height = 800,
  waitMs = 1500,
  fullPage = false,
  actions,
}) {
  const b = await getBrowser();
  const page = await b.newPage({ viewport: { width, height } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  if (actions) await actions(page);
  if (waitMs) await page.waitForTimeout(waitMs);
  await page.screenshot({ path: dest, type: 'png', fullPage });
  await page.close();
}
