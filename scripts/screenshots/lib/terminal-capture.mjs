import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { ROOT, escapeHtml } from './utils.mjs';

let browser;

export async function getBrowser() {
  if (!browser) browser = await chromium.launch();
  return browser;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = undefined;
  }
}

export async function captureTerminal({ command, output, title, dest }) {
  const template = await readFile(path.join(ROOT, 'templates/terminal.html'), 'utf8');
  const html = template
    .replace(/\{\{TITLE\}\}/g, escapeHtml(title || 'terminal'))
    .replace(/\{\{COMMAND\}\}/g, escapeHtml(command))
    .replace(/\{\{OUTPUT\}\}/g, escapeHtml(output.trim() || '(no output)'));

  const tmpHtml = path.join(ROOT, '.raw', `_terminal_${Date.now()}.html`);
  await writeFile(tmpHtml, html);

  const b = await getBrowser();
  const page = await b.newPage({ viewport: { width: 960, height: 540 } });
  await page.goto(`file://${tmpHtml}`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: dest, type: 'png' });
  await page.close();
}
