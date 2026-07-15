import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(process.cwd(), 'src/data');
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const resources = read('resources.json').resources;
const papers = read('papers.json').papers;
const competitions = read('competitions.json').competitions;
const daily = read('daily-schedule.json').weeks;

const urlRefs = new Map();
const add = (url, ref) => {
  if (!url) return;
  const refs = urlRefs.get(url) ?? [];
  refs.push(ref);
  urlRefs.set(url, refs);
};

for (const resource of resources) {
  add(resource.url, `resource:${resource.id}`);
  for (const [name, url] of Object.entries(resource.specificLinks ?? {})) add(url, `resource:${resource.id}:${name}`);
}
for (const paper of papers) add(paper.url, `paper:${paper.id}`);
for (const competition of competitions) add(competition.url, `competition:${competition.id}`);
for (const week of daily) {
  for (const day of week.days) {
    for (const task of day.tasks) add(task.url, `task:${task.id}`);
  }
}

const entries = [...urlRefs.entries()];
const broken = [];
const warnings = [];
let checked = 0;

async function inspect([url, refs]) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    let response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'QuantPath-Link-Validator/1.0' },
    });
    if (response.status === 404 || response.status === 405 || response.status === 501) {
      response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'user-agent': 'QuantPath-Link-Validator/1.0', range: 'bytes=0-0' },
      });
    }
    checked += 1;
    if (response.status === 404 || response.status === 410) {
      broken.push({ url, status: response.status, refs });
    } else if (response.status >= 500) {
      warnings.push({ url, status: response.status, refs });
    }
  } catch (error) {
    checked += 1;
    const code = error?.cause?.code;
    const item = { url, error: code ?? error.name ?? String(error), refs };
    if (code === 'ERR_TLS_CERT_ALTNAME_INVALID' || code === 'CERT_HAS_EXPIRED' || code === 'DEPTH_ZERO_SELF_SIGNED_CERT') {
      broken.push(item);
    } else {
      warnings.push(item);
    }
  } finally {
    clearTimeout(timeout);
  }
}

const concurrency = 12;
for (let index = 0; index < entries.length; index += concurrency) {
  await Promise.all(entries.slice(index, index + concurrency).map(inspect));
  process.stdout.write(`\rChecked ${checked}/${entries.length}`);
}
process.stdout.write('\n');

console.log(JSON.stringify({ checked, broken, warnings: warnings.length }, null, 2));
if (warnings.length > 0) {
  console.warn(`Warnings (timeouts, bot blocks, or server errors): ${warnings.length}`);
}
if (broken.length > 0) process.exitCode = 1;
