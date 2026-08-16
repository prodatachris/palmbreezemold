#!/usr/bin/env node
/**
 * Lab Core Web Vitals per page, over CDP.
 *
 *   node tools/vitals.mjs [--width 390] [--routes /,/services/,...]
 *
 * Reports LCP (and which element it was), CLS (and the biggest shift source),
 * and FCP. Observers are installed with Page.addScriptToEvaluateOnNewDocument
 * so they are running before the first paint — a PerformanceObserver attached
 * after load has already missed everything it was meant to see.
 *
 * Lab numbers, not field data: no network throttling and a warm local server,
 * so treat LCP as a floor and CLS as the real signal. CLS is the one that is
 * genuinely comparable here, because layout shift is caused by the markup
 * rather than by the connection.
 */

import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };

const BASE = flag('base', 'http://127.0.0.1:8099').replace(/\/$/, '');
const WIDTH = Number(flag('width', 390));
const HEIGHT = Number(flag('height', WIDTH < 700 ? 844 : 900));
const PORT = 9341;
const ROUTES = flag('routes',
  '/,/services/hvac-air-conditioner-mold-remediation/,/service-areas/wellington/,/guides/first-48-hours-after-water-damage/,/contact/',
).split(',');

/* Installed before any page script runs. */
const COLLECTOR = `
window.__v = { lcp: 0, lcpEl: '', cls: 0, worst: 0, worstEl: '', fcp: 0 };
try {
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      if (e.startTime > window.__v.lcp) {
        window.__v.lcp = e.startTime;
        const el = e.element;
        window.__v.lcpEl = el
          ? el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\\s+/)[0] : '')
          : (e.url || '(text)');
      }
    }
  }).observe({ type: 'largest-contentful-paint', buffered: true });

  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      if (e.hadRecentInput) continue;
      window.__v.cls += e.value;
      if (e.value > window.__v.worst) {
        window.__v.worst = e.value;
        const s = e.sources && e.sources[0] && e.sources[0].node;
        window.__v.worstEl = s
          ? s.tagName.toLowerCase() + (s.className && typeof s.className === 'string' && s.className ? '.' + s.className.trim().split(/\\s+/)[0] : '')
          : '(unknown)';
      }
    }
  }).observe({ type: 'layout-shift', buffered: true });

  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      if (e.name === 'first-contentful-paint') window.__v.fcp = e.startTime;
    }
  }).observe({ type: 'paint', buffered: true });
} catch (err) { window.__v.error = String(err); }
`;

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map();
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.pending.has(m.id)) { this.pending.get(m.id)(m.result); this.pending.delete(m.id); }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((r) => { this.pending.set(id, r); this.ws.send(JSON.stringify({ id, method, params })); });
  }
}

const chrome = spawn(CHROME, [
  '--headless', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=/tmp/vitals-${PORT}`, 'about:blank',
], { stdio: 'ignore' });

try {
  let target;
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = list.find((t) => t.type === 'page');
      if (target) break;
    } catch { /* not up */ }
    await sleep(250);
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res) => ws.addEventListener('open', res, { once: true }));
  const cdp = new CDP(ws);

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH, height: HEIGHT, deviceScaleFactor: WIDTH < 700 ? 3 : 1, mobile: WIDTH < 700,
  });
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: COLLECTOR });

  /* Unthrottled against a warm localhost, LCP lands around 50ms on every page,
     which tells you nothing. Lighthouse's Slow 4G profile plus a 4x CPU
     slowdown is the standard mobile proxy and makes the number comparable to
     what a phone on cell data actually sees. --no-throttle to disable. */
  const THROTTLE = !args.includes('--no-throttle');
  if (THROTTLE) {
    await cdp.send('Network.enable');
    // Measure a first visit, and never a previous build (see prose.mjs note).
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }

  console.log(`\n▸ Vitals at ${WIDTH}px (${THROTTLE ? 'Slow 4G + 4x CPU' : 'unthrottled'})\n`);
  console.log('  CLS     LCP      FCP     LCP element                 worst shift');
  console.log('  ' + '─'.repeat(76));

  let worstCls = 0;
  for (const route of ROUTES) {
    await cdp.send('Page.navigate', { url: BASE + route });
    await sleep(THROTTLE ? 6000 : 2600);
    // Nudge the page so any late shift from lazy content is counted.
    await cdp.send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight * 0.5)' });
    await sleep(700);
    await cdp.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
    await sleep(500);

    const { result } = await cdp.send('Runtime.evaluate', { expression: 'window.__v', returnByValue: true });
    const v = result.value || {};
    worstCls = Math.max(worstCls, v.cls || 0);
    const mark = (v.cls || 0) > 0.1 ? '✗' : (v.cls || 0) > 0.01 ? '·' : '✓';
    console.log(
      `  ${mark} ${(v.cls || 0).toFixed(3)}  ${String(Math.round(v.lcp || 0)).padStart(5)}ms  ${String(Math.round(v.fcp || 0)).padStart(5)}ms  ` +
      `${(v.lcpEl || '—').slice(0, 26).padEnd(26)}  ${(v.worstEl || '—').slice(0, 20)}`,
    );
    console.log(`      ${route}`);
  }
  console.log('\n  CLS budget: good ≤ 0.10, needs-improvement ≤ 0.25');
  console.log(`  worst CLS observed: ${worstCls.toFixed(3)}\n`);
} finally {
  chrome.kill();
}
