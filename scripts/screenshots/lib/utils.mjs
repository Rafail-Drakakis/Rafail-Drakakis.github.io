import { spawn, execSync } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');
export const PORTFOLIO_ROOT = path.resolve(ROOT, '../..');
export const REPOS_ROOT = path.resolve(PORTFOLIO_ROOT, '..');
export const RAW_DIR = path.join(ROOT, '.raw');
export const OUT_DIR = path.join(PORTFOLIO_ROOT, 'public/images/projects');

export async function ensureDirs() {
  await mkdir(RAW_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function run(cmd, { cwd = REPOS_ROOT, env = {}, timeout = 120000 } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn('bash', ['-lc', cmd], {
      cwd,
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error(`Timeout: ${cmd}`));
    }, timeout);
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    });
    child.on('error', reject);
  });
}

export function runSync(cmd, { cwd = REPOS_ROOT, env = {} } = {}) {
  return execSync(cmd, {
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 10 * 1024 * 1024,
  });
}

export function startProcess(cmd, { cwd = REPOS_ROOT, env = {} } = {}) {
  const child = spawn('bash', ['-lc', cmd], {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'ignore',
    detached: true,
  });
  child.unref();
  return child;
}

export function killProcess(child) {
  if (!child?.pid) return;
  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch {
    try {
      process.kill(child.pid, 'SIGTERM');
    } catch {
      /* ignore */
    }
  }
}

export async function waitForUrl(url, { timeout = 60000, interval = 500 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok || res.status < 500) return true;
    } catch {
      /* retry */
    }
    await sleep(interval);
  }
  throw new Error(`URL not ready: ${url}`);
}

export function repoPath(name) {
  return path.join(REPOS_ROOT, name);
}

export function rawPath(slug) {
  return path.join(RAW_DIR, `${slug}.png`);
}

export function outPath(slug) {
  return path.join(OUT_DIR, `${slug}.webp`);
}

export function hasCommand(cmd) {
  try {
    execSync(`command -v ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export async function writeResults(results) {
  await writeFile(path.join(ROOT, 'results.json'), JSON.stringify(results, null, 2));
}

export function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
