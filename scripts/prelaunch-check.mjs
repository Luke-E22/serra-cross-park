#!/usr/bin/env node
// Prelaunch check for serracrosspark.com.
//
// Prints one warning for each thing that still has to change before launch, then the count.
// It never fails the build: it always exits 0, even if it hits an error of its own.
// Runs before every build (package.json "prebuild") and by hand with `npm run prelaunch`.
//
// No dependencies, and nothing imported from src/. It reads src/config/site.ts as text and
// inspects it with regexes, so it works before the TypeScript is compiled and never runs it.
//
// Checks:
//   1. A PAYMENTS URL still contains "startup-ventura" (the placeholder Zeffy forms).
//   2. The Strong Glasgow demo fonts (design-system/fonts/StrongGlasgow-*.ttf) are still in place.
//   3. BOOKING.calEventSlug is still '30min'.
//   4. Any "[CONFIRM" marker left anywhere under src/.
//   5. Anyone in PEOPLE with no photo.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = join(ROOT, 'src', 'config', 'site.ts');
const CONFIG_LABEL = 'src/config/site.ts';
const FONTS_DIR = join(ROOT, 'design-system', 'fonts');
const SRC_DIR = join(ROOT, 'src');

// File types under src/ that are not text. Everything else is scanned for markers.
const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.heic', '.ico', '.bmp', '.tif', '.tiff',
  '.woff', '.woff2', '.ttf', '.otf', '.eot',
  '.pdf', '.zip', '.gz', '.mp4', '.mov', '.mp3', '.wav',
]);

const warnings = [];
const warn = (message) => warnings.push(message);

/* ---------- small text helpers ---------- */

/** Index of the brace that closes the one at `openIndex`, skipping strings and comments. -1 if none. */
function matchBrace(text, openIndex) {
  let depth = 0;
  let i = openIndex;
  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '/' && next === '/') {
      const end = text.indexOf('\n', i);
      i = end === -1 ? text.length : end;
      continue;
    }
    if (ch === '/' && next === '*') {
      const end = text.indexOf('*/', i + 2);
      i = end === -1 ? text.length : end + 2;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      i = skipString(text, i);
      continue;
    }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
    i += 1;
  }
  return -1;
}

/** Index just past the closing quote of the string that opens at `start`. */
function skipString(text, start) {
  const quote = text[start];
  let i = start + 1;
  while (i < text.length) {
    if (text[i] === '\\') { i += 2; continue; }
    if (text[i] === quote) return i + 1;
    i += 1;
  }
  return text.length;
}

/** The text between the braces of `export const NAME = { ... }`, or null when not found. */
function blockOf(config, name) {
  const re = new RegExp(`export\\s+const\\s+${name}\\b[^=]*=\\s*\\{`);
  const m = re.exec(config);
  if (!m) return null;
  const open = m.index + m[0].length - 1;
  const close = matchBrace(config, open);
  if (close === -1) return null;
  return config.slice(open, close + 1);
}

/** Every `{ ... }` object literal inside `text`, at any depth, as strings. */
function objectsIn(text) {
  const out = [];
  let i = text.indexOf('{');
  while (i !== -1) {
    const close = matchBrace(text, i);
    if (close === -1) break;
    out.push(text.slice(i, close + 1));
    i = text.indexOf('{', i + 1);
  }
  return out;
}

/** An object literal with its nested object literals blanked out, so keys at its own level stand alone. */
function ownLevel(objectText) {
  let inner = objectText.slice(1, -1);
  let changed = true;
  while (changed) {
    changed = false;
    const open = inner.indexOf('{');
    if (open !== -1) {
      const close = matchBrace(inner, open);
      if (close !== -1) {
        inner = inner.slice(0, open) + inner.slice(close + 1);
        changed = true;
      }
    }
  }
  return inner;
}

const readConfig = () => {
  if (!existsSync(CONFIG_PATH)) {
    warn(`${CONFIG_LABEL} is missing, so the payment, slug and photo checks did not run.`);
    return null;
  }
  try {
    return readFileSync(CONFIG_PATH, 'utf8');
  } catch (error) {
    warn(`Could not read ${CONFIG_LABEL} (${error && error.message ? error.message : String(error)}), so the payment, slug and photo checks did not run.`);
    return null;
  }
};

/* ---------- checks ---------- */

function checkPayments(config) {
  const block = blockOf(config, 'PAYMENTS');
  if (!block) {
    warn(`Could not find PAYMENTS in ${CONFIG_LABEL}; the payment URL check did not run.`);
    return;
  }
  const re = /(\w+)\s*:\s*(['"`])([^'"`\n]*)\2/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    const [, key, , url] = m;
    if (url.includes('startup-ventura')) {
      warn(`PAYMENTS.${key} still points at Startup Ventura's Zeffy form (${url}). Replace it with Serra Cross Conservancy's own form.`);
    }
  }
}

function checkFonts() {
  if (!existsSync(FONTS_DIR)) return;
  const demoFiles = readdirSync(FONTS_DIR).filter((f) => /^StrongGlasgow-.*\.ttf$/i.test(f)).sort();
  for (const file of demoFiles) {
    warn(`Strong Glasgow demo font still in place: design-system/fonts/${file} (personal use only). License the face from Herofonts and replace it.`);
  }
}

function checkCalSlug(config) {
  if (/calEventSlug\s*:\s*(['"`])30min\1/.test(config)) {
    warn(`BOOKING.calEventSlug is still '30min' in ${CONFIG_LABEL}. That Cal.com event does not exist; the live event is 'reserve'.`);
  }
}

function checkConfirmMarkers() {
  if (!existsSync(SRC_DIR)) return;
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && !BINARY_EXTENSIONS.has(extname(entry.name).toLowerCase())) files.push(full);
    }
  };
  walk(SRC_DIR);
  files.sort();

  for (const file of files) {
    let text;
    try {
      text = readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    if (text.includes('\u0000')) continue; // binary after all
    if (!text.includes('[CONFIRM')) continue;
    const label = relative(ROOT, file);
    const lines = text.split(/\r?\n/);
    lines.forEach((line, index) => {
      let at = line.indexOf('[CONFIRM');
      while (at !== -1) {
        const close = line.indexOf(']', at);
        const marker = close === -1 ? line.slice(at).trim() : line.slice(at, close + 1);
        warn(`${label}:${index + 1}  ${marker}`);
        at = line.indexOf('[CONFIRM', at + 1);
      }
    });
  }
}

function checkPeoplePhotos(config) {
  const block = blockOf(config, 'PEOPLE');
  if (!block) {
    warn(`Could not find PEOPLE in ${CONFIG_LABEL}; the photo check did not run.`);
    return;
  }
  for (const object of objectsIn(block)) {
    const own = ownLevel(object);
    const nameMatch = /(?:^|[\s,{])name\s*:\s*(['"`])([^'"`\n]*)\1/.exec(own);
    if (!nameMatch) continue;
    const hasPhoto = /(?:^|[\s,{])photo\s*:\s*(['"`])[^'"`\n]+\1/.test(own);
    if (!hasPhoto) {
      warn(`No photo for ${nameMatch[2]} (PEOPLE in ${CONFIG_LABEL}). The About page shows initials until one is added.`);
    }
  }
}

/* ---------- run ---------- */

function run() {
  console.log('Prelaunch check for Serra Cross Park');
  console.log('Each line below is something to settle before the site goes live. The build continues either way.');
  console.log('');

  const config = readConfig();
  const steps = [
    () => config && checkPayments(config),
    () => checkFonts(),
    () => config && checkCalSlug(config),
    () => checkConfirmMarkers(),
    () => config && checkPeoplePhotos(config),
  ];
  for (const step of steps) {
    try {
      step();
    } catch (error) {
      warn(`The prelaunch check hit an error of its own: ${error && error.message ? error.message : String(error)}`);
    }
  }

  for (const message of warnings) console.log(`WARN  ${message}`);
  if (warnings.length) console.log('');
  const noun = warnings.length === 1 ? 'warning' : 'warnings';
  console.log(`Prelaunch check: ${warnings.length} ${noun}.`);
}

try {
  run();
} catch (error) {
  console.log(`The prelaunch check stopped on an error of its own: ${error && error.message ? error.message : String(error)}`);
  console.log(`Prelaunch check: ${warnings.length} ${warnings.length === 1 ? 'warning' : 'warnings'} before it stopped.`);
}
process.exitCode = 0;
