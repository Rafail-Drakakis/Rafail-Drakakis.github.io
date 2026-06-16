import { writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import {
  ensureDirs,
  rawPath,
  repoPath,
  run,
  runSync,
  startProcess,
  killProcess,
  sleep,
  waitForUrl,
  writeResults,
  REPOS_ROOT,
} from './lib/utils.mjs';
import { captureTerminal, closeBrowser } from './lib/terminal-capture.mjs';
import { captureWebPage } from './lib/web-capture.mjs';
import { optimizeImage, optimizePlot } from './lib/optimize.mjs';
import { captureWithCommand, ensureMedicalIndex } from './lib/gui-capture.mjs';

const results = {};

async function capture(slug, fn) {
  process.stdout.write(`\n▶ ${slug}... `);
  try {
    await fn();
    results[slug] = { ok: true };
    process.stdout.write('OK\n');
  } catch (err) {
    results[slug] = { ok: false, error: String(err.message || err) };
    process.stdout.write(`FAIL: ${err.message}\n`);
  }
}

async function finishTerminal(slug, command, output, title) {
  const raw = rawPath(slug);
  await captureTerminal({ command, output, title, dest: raw });
  await optimizeImage(raw, slug);
}

// ─── CLI / terminal projects ───────────────────────────────────────────────

async function captureLinuxSecuritySuite() {
  const cwd = repoPath('linux-security-suite');
  await run('make', { cwd });
  const { stdout, stderr } = await run('./security-suite --monitor ./pha.out', { cwd, timeout: 15000 });
  let report = '';
  try {
    report = runSync('head -40 report.txt', { cwd });
  } catch {
    report = stdout + stderr;
  }
  await finishTerminal(
    'linux-security-suite',
    './security-suite --monitor ./pha.out',
    `${stdout}${stderr}\n\n--- report.txt ---\n${report}`,
    'linux-security-suite',
  );
}

async function captureMicrotcp() {
  const cwd = repoPath('microTCP');
  await run('make', { cwd });
  runSync('dd if=/dev/zero of=/tmp/mtcp-in.bin bs=1024 count=64 2>/dev/null', { cwd });
  const server = startProcess('./build/bandwidth_test /tmp/mtcp-out.bin microtcp server 18080', { cwd });
  await sleep(1500);
  const { stdout, stderr, code } = await run(
    './build/bandwidth_test /tmp/mtcp-in.bin microtcp client 127.0.0.1 18080',
    { cwd, timeout: 30000 },
  );
  killProcess(server);
  await finishTerminal(
    'microtcp',
    './build/bandwidth_test input.bin microtcp client 127.0.0.1 18080',
    `${stdout}\n${stderr}\n(exit ${code})`,
    'microTCP',
  );
}

async function captureAlphaCompiler() {
  const cwd = repoPath('Alpha-compiler');
  const sample = runSync('cat Phases_4_5/tests/09_if_else.asc', { cwd });
  const output = `Alpha Compiler — multi-phase pipeline (Flex/Bison → quads → stack VM)

Sample input (09_if_else.asc):
${sample}

Phases:
  Phase 1  Lexical analysis (Flex)
  Phase 2  Syntax analysis (Bison)
  Phase 3  Semantic / quads
  Phase 4–5 Code generation + stack VM execution`;
  await finishTerminal('alpha-compiler', 'cat Phases_4_5/tests/09_if_else.asc', output, 'Alpha-compiler');
}

async function captureLinuxShell() {
  const cwd = repoPath('linux-shell');
  await run('make', { cwd });
  const script = 'pwd\nls -la\nhelp\nexit\n';
  const { stdout, stderr } = await run(`printf '%s' '${script.replace(/'/g, "'\\''")}' | ./linux-shell`, {
    cwd,
    timeout: 10000,
  });
  await finishTerminal('linux-shell', 'pwd; ls -la; help; exit', `${stdout}${stderr}`, 'linux-shell');
}

async function captureSimpleStreaming() {
  const cwd = repoPath('Simple-streaming-service');
  await run('make', { cwd });
  const { stdout, stderr } = await run('./StreamingService testfiles/test_U5M10', { cwd, timeout: 15000 });
  await finishTerminal('simple-streaming-service', './StreamingService testfiles/test_U5M10', `${stdout}${stderr}`, 'Simple-streaming-service');
}

async function captureReviewsClassifier() {
  const cwd = repoPath('Reviews-classifier');
  const venv = path.join(cwd, '.capture-venv');
  if (!existsSync(venv)) {
    await run(`python3 -m venv ${venv}`, { cwd });
  }
  await run(`${venv}/bin/pip install -q torch nltk`, { cwd, timeout: 900000 });
  const { stdout, stderr } = await run(`${venv}/bin/python predict.py`, { cwd, timeout: 120000 });
  await finishTerminal('reviews-classifier', 'python predict.py', `${stdout}${stderr}`, 'Reviews-classifier');
}

async function captureMidus() {
  const cwd = repoPath('MIDUS-Ordinal-Analysis');
  const venv = path.join(cwd, '.capture-venv');
  if (!existsSync(venv)) {
    await run(`python3 -m venv ${venv}`, { cwd });
    await run(`${venv}/bin/pip install -q pandas numpy matplotlib seaborn scipy scikit-learn statsmodels`, {
      cwd,
      timeout: 300000,
    });
  }
  await run('MPLBACKEND=Agg MPLCONFIGDIR=/tmp/mpl ' + `${venv}/bin/python main.py`, { cwd, timeout: 300000 });
  const plot = path.join(cwd, 'plots/association_heatmap.png');
  const fallback = path.join(cwd, 'plots');
  let src = plot;
  if (!existsSync(src)) {
    const files = existsSync(fallback) ? runSync('ls plots/*.png 2>/dev/null | head -1', { cwd }).trim() : '';
    src = files ? path.join(cwd, files) : null;
  }
  if (!src || !existsSync(src)) throw new Error('No plot generated');
  await optimizePlot(src, 'midus-ordinal-analysis');
}

async function captureUsefulScripts() {
  const cwd = repoPath('Useful-scripts');
  const listing = runSync('ls -la', { cwd });
  const readme = runSync('head -25 README.md', { cwd });
  await finishTerminal('useful-scripts', 'ls -la && head README.md', `${listing}\n--- README ---\n${readme}`, 'Useful-scripts');
}

// ─── GUI / static image ────────────────────────────────────────────────────

async function captureMediaDownloader() {
  const cwd = repoPath('Media-downloader');
  const venv = path.join(cwd, '.capture-venv');
  const raw = rawPath('media-downloader');
  const script = path.join(REPOS_ROOT, 'Rafail-Drakakis.github.io/scripts/screenshots/fixtures/capture-pyqt-offscreen.py');
  if (!existsSync(venv)) {
    await run(`python3 -m venv ${venv}`, { cwd });
  }
  await run(`${venv}/bin/pip install -q -r requirements.txt`, { cwd, timeout: 300000 });
  await run(`${venv}/bin/python ${script} ${cwd} ${raw}`, { cwd, timeout: 60000 });
  await optimizeImage(raw, 'media-downloader');
}

async function captureMedicalDocumentRetrieval() {
  const cwd = repoPath('Medical-document-retrieval');
  if (!existsSync(path.join(cwd, 'queryevaluatorGUI.jar'))) {
    await run('./build.sh', { cwd, timeout: 120000 });
  }
  const indexDir = await ensureMedicalIndex();
  await captureWithCommand({
    slug: 'medical-document-retrieval',
    cwd,
    command: `java -jar queryevaluatorGUI.jar ${indexDir}`,
    windowTitle: 'HY463 Topic search (VSM)',
    waitMs: 4500,
  });
}

async function captureSorryGame() {
  await captureWithCommand({
    slug: 'sorry-game',
    cwd: repoPath('Sorry_game'),
    command: './run.sh',
    windowTitle: 'Sorry Game',
    waitMs: 7000,
    keystrokes: ['2', 'ENTER'],
    keystrokeDelayMs: 2500,
  });
}

// ─── Web apps ──────────────────────────────────────────────────────────────

async function captureFlaskApp(slug, repoName, { port, setup, startCmd, seed }) {
  const cwd = repoPath(repoName);
  const raw = rawPath(slug);
  for (const cmd of setup) await run(cmd, { cwd, timeout: 300000 });
  const proc = startProcess(startCmd, { cwd, env: { PORT: String(port), FLASK_RUN_PORT: String(port) } });
  const url = `http://127.0.0.1:${port}/`;
  await waitForUrl(url, { timeout: 90000 });
  if (seed) await seed(port);
  await captureWebPage({ url, dest: raw, waitMs: 2000 });
  killProcess(proc);
  await sleep(500);
  await optimizeImage(raw, slug);
}

async function captureTodoApp() {
  await captureFlaskApp('to-do-app', 'To-do-app', {
    port: 15000,
    setup: [
      `[ -d .capture-venv ] || python3 -m venv .capture-venv`,
      `.capture-venv/bin/pip install -q -r requirements.txt`,
      `cp -n .env.example .env 2>/dev/null || true`,
      `.capture-venv/bin/flask --app wsgi db upgrade`,
    ],
    startCmd: `.capture-venv/bin/flask --app wsgi run --host 127.0.0.1 --port 15000`,
    seed: async (port) => {
      for (const text of ['Ship portfolio screenshots', 'Review ML pipeline', 'Prepare FORTH demo']) {
        await fetch(`http://127.0.0.1:${port}/api/todos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        }).catch(() => {});
      }
    },
  });
}

async function captureEventManagement() {
  const slug = 'event-management-system';
  const raw = rawPath(slug);
  const cwd = repoPath('Event-management-system');
  const venv = path.join(cwd, '.capture-venv');
  if (!existsSync(venv)) await run(`python3 -m venv ${venv}`, { cwd });
  await run(`${venv}/bin/pip install -q Flask Flask-Cors`, { cwd, timeout: 120000 });
  const proc = startProcess(
    `${venv}/bin/python -c "from app import app, initialize_database; initialize_database(); app.run(host='127.0.0.1', port=15001, debug=False, use_reloader=False)"`,
    { cwd: path.join(cwd, 'code') },
  );
  await waitForUrl('http://127.0.0.1:15001/', { timeout: 90000 });
  await captureWebPage({ url: 'http://127.0.0.1:15001/', dest: raw, waitMs: 2000 });
  killProcess(proc);
  await optimizeImage(raw, slug);
}

async function captureMediaServer() {
  const slug = 'media-server';
  const raw = rawPath(slug);
  const backend = repoPath('Media-server/backend');
  const frontend = repoPath('Media-server/frontend');
  const fixtureScript = path.join(REPOS_ROOT, 'Rafail-Drakakis.github.io/scripts/screenshots/fixtures/generate-sample-video.sh');
  const mediaDir = runSync(`bash ${fixtureScript}`).trim() + '/';
  await run('npm install --silent', { cwd: backend, timeout: 180000 });
  await run('npm install --silent', { cwd: frontend, timeout: 180000 });
  const jwt = runSync('openssl rand -base64 32').trim();
  const envContent = `JWT_SECRET=${jwt}\nMEDIA_ROOT=${mediaDir}\nPORT=3001\nCORS_ORIGINS=http://localhost:5173\nALLOW_REGISTRATION=true\n`;
  await writeFile(path.join(backend, '.env'), envContent);
  const be = startProcess('npm run dev', { cwd: backend });
  const fe = startProcess('npm run dev', { cwd: frontend });
  await waitForUrl('http://127.0.0.1:3001/api/health', { timeout: 120000 });
  await waitForUrl('http://127.0.0.1:5173/', { timeout: 120000 });
  await fetch('http://127.0.0.1:3001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@media.local', password: 'demopass123', displayName: 'Demo' }),
  });
  const login = await fetch('http://127.0.0.1:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@media.local', password: 'demopass123' }),
  });
  const { token } = await login.json();
  await fetch('http://127.0.0.1:3001/api/library/scan', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  await sleep(3000);
  await captureWebPage({
    url: 'http://127.0.0.1:5173/',
    dest: raw,
    waitMs: 2000,
    actions: async (page) => {
      try {
        await page.fill('input[type="email"]', 'demo@media.local');
        await page.fill('input[type="password"]', 'demopass123');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(2000);
      } catch {
        /* may already be logged in */
      }
    },
  });
  killProcess(be);
  killProcess(fe);
  await sleep(1000);
  await optimizeImage(raw, slug);
}

async function captureNaturalDisasterClassifier() {
  const slug = 'natural-disaster-classifier';
  const raw = rawPath(slug);
  const cwd = repoPath('Natural-disaster-classifier');
  const venv = path.join(cwd, '.capture-venv');
  if (!existsSync(venv)) {
    await run(`python3 -m venv ${venv}`, { cwd });
  }
  await run(`${venv}/bin/pip install -q -r requirements.txt`, { cwd, timeout: 900000 });
  const proc = startProcess(`${venv}/bin/python server.py`, { cwd, env: { PORT: '15002' } });
  await waitForUrl('http://127.0.0.1:15002/', { timeout: 180000 });
  await captureWebPage({ url: 'http://127.0.0.1:15002/', dest: raw, waitMs: 3000 });
  killProcess(proc);
  await optimizeImage(raw, slug);
}

// ─── Main ──────────────────────────────────────────────────────────────────

const HANDLERS = [
  ['linux-security-suite', captureLinuxSecuritySuite],
  ['microtcp', captureMicrotcp],
  ['alpha-compiler', captureAlphaCompiler],
  ['linux-shell', captureLinuxShell],
  ['simple-streaming-service', captureSimpleStreaming],
  ['reviews-classifier', captureReviewsClassifier],
  ['midus-ordinal-analysis', captureMidus],
  ['useful-scripts', captureUsefulScripts],
  ['media-downloader', captureMediaDownloader],
  ['medical-document-retrieval', captureMedicalDocumentRetrieval],
  ['sorry-game', captureSorryGame],
  ['to-do-app', captureTodoApp],
  ['event-management-system', captureEventManagement],
  ['media-server', captureMediaServer],
  ['natural-disaster-classifier', captureNaturalDisasterClassifier],
];

async function main() {
  const onlyFilter = (process.env.CAPTURE_ONLY || process.argv[2] || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  console.log('Project screenshot capture pipeline');
  console.log(`Repos: ${REPOS_ROOT}`);
  await ensureDirs();

  for (const [slug, handler] of HANDLERS) {
    if (onlyFilter.length && !onlyFilter.includes(slug)) continue;
    await capture(slug, handler);
  }

  await closeBrowser();
  await writeResults(results);

  const ok = Object.values(results).filter((r) => r.ok).length;
  const fail = Object.values(results).filter((r) => !r.ok && !r.skipped).length;
  console.log(`\nDone: ${ok} captured, ${fail} failed`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
