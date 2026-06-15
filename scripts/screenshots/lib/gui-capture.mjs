import { spawn, execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { sleep, rawPath, repoPath, run, runSync } from './utils.mjs';
import { optimizeImage } from './optimize.mjs';

/**
 * Capture a native Swing/AWT window by title using ImageMagick import.
 */
export async function captureWindowByTitle(windowTitle, dest, { waitMs = 4000 } = {}) {
  if (!hasImport()) {
    throw new Error('ImageMagick `import` is required for GUI capture (DISPLAY must be set)');
  }
  await sleep(waitMs);
  execSync(`import -window '${windowTitle.replace(/'/g, "'\\''")}' '${dest}'`, {
    stdio: 'pipe',
    env: process.env,
  });
  if (!existsSync(dest)) throw new Error(`Capture failed: ${dest}`);
}

function hasImport() {
  try {
    execSync('command -v import', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Send keystrokes via a tiny Java AWT Robot helper (for JOptionPane dialogs).
 */
export async function sendKeystrokes(keys, { delayMs = 3000 } = {}) {
  const helperDir = path.join(repoPath('Rafail-Drakakis.github.io/scripts/screenshots/fixtures'));
  const helperClass = path.join(helperDir, 'RobotHelper.class');
  if (!existsSync(helperClass)) {
    execSync(`javac ${path.join(helperDir, 'RobotHelper.java')}`, { stdio: 'pipe' });
  }
  const keyArg = keys.join(',');
  spawn('java', ['-cp', helperDir, 'RobotHelper', String(delayMs), keyArg], {
    detached: true,
    stdio: 'ignore',
  }).unref();
}

export async function captureWithCommand({
  slug,
  command,
  cwd,
  windowTitle,
  waitMs = 5000,
  keystrokes,
  keystrokeDelayMs = 3000,
}) {
  const raw = rawPath(slug);
  try {
    execSync('pkill -f "Sorry_game/run.sh" 2>/dev/null || true', { stdio: 'ignore' });
    execSync('pkill -f queryevaluatorGUI.jar 2>/dev/null || true', { stdio: 'ignore' });
  } catch {
    /* ignore */
  }

  if (keystrokes?.length) {
    await sendKeystrokes(keystrokes, { delayMs: keystrokeDelayMs });
  }

  const proc = spawn('setsid', ['bash', '-lc', command], {
    cwd,
    env: process.env,
    detached: true,
    stdio: 'ignore',
  });
  proc.unref();

  try {
    await captureWindowByTitle(windowTitle, raw, { waitMs });
    await optimizeImage(raw, slug);
  } finally {
    try {
      process.kill(-proc.pid, 'SIGTERM');
    } catch {
      try {
        process.kill(proc.pid, 'SIGTERM');
      } catch {
        /* ignore */
      }
    }
    await sleep(300);
    try {
      execSync('pkill -f "Sorry_game/run.sh" 2>/dev/null || true', { stdio: 'ignore' });
      execSync('pkill -f queryevaluatorGUI.jar 2>/dev/null || true', { stdio: 'ignore' });
    } catch {
      /* ignore cleanup errors */
    }
  }
}

export async function ensureMedicalIndex() {
  const cwd = repoPath('Medical-document-retrieval');
  const indexDir = path.join(cwd, 'out/MiniCollectionIndex');
  const vocab = path.join(indexDir, 'VocabularyFile.txt');
  if (existsSync(vocab)) return indexDir;

  const fixtureDir = path.join(cwd, 'fixtures/MiniCollection');
  if (!existsSync(path.join(fixtureDir, 'doc1.nxml'))) {
    throw new Error('MiniCollection fixtures missing');
  }
  if (!existsSync(path.join(cwd, 'queryevaluatorGUI.jar'))) {
    await run('./build.sh', { cwd, timeout: 120000 });
  }
  await run(
    'java -cp "out:lib/BioReader.jar:lib/Stemmer.jar" gr.uoc.csd.hy463.indexing.IndexerMain --index fixtures/MiniCollection out/MiniCollectionIndex',
    { cwd, timeout: 120000 },
  );
  return indexDir;
}
