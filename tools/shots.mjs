#!/usr/bin/env node
/**
 * Screenshots via CDP with real device metrics emulation.
 *
 *   node tools/shots.mjs --route / --width 390 --slices 4
 *   node tools/shots.mjs --route /services/mold-remediation/ --width 1440 --slices 6
 *
 * Why not `chrome --headless --screenshot --window-size=390,844`: macOS clamps
 * the browser window to roughly 400px wide, so a narrower --window-size still
 * lays out at ~400px and merely crops the image. It looks exactly like a
 * horizontal-overflow bug that is not there. Emulation.setDeviceMetricsOverride
 * sets the layout viewport directly and is not subject to that clamp.
 *
 * Also disables smooth scrolling before capturing: fragment navigation and
 * programmatic scrolls are animated, and headless virtual time freezes the
 * animation mid-flight, producing blank or half-scrolled frames.
 */

import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };

const BASE = flag('base', 'http://127.0.0.1:8099').replace(/\/$/, '');
const ROUTE = flag('route', '/');
const WIDTH = Number(flag('width', 1440));
const HEIGHT = Number(flag('height', WIDTH < 700 ? 844 : 900));
const SLICES = Number(flag('slices', 3));
const OUT = flag('out', '/tmp/shot');
const PORT = 9334;

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map();
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.pending.has(m.id)) {
        const { resolve, reject } = this.pending.get(m.id);
        this.pending.delete(m.id);
        m.error ? reject(new Error(m.error.message)) : resolve(m.result);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
}

async function connect() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const t = list.find((x) => x.type === 'page');
      if (t) {
        const ws = new WebSocket(t.webSocketDebuggerUrl);
        await new Promise((res, rej) => {
          ws.addEventListener('open', res, { once: true });
          ws.addEventListener('error', rej, { once: true });
        });
        return new CDP(ws);
      }
    } catch { /* not up */ }
    await sleep(250);
  }
  throw new Error('no chrome');
}

const chrome = spawn(CHROME, [
  '--headless', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=/tmp/shots-profile-${PORT}`,
  'about:blank',
], { stdio: 'ignore' });

try {
  const cdp = await connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  // Chrome keeps a disk cache in --user-data-dir, and that directory is keyed on
  // a constant port, so it survives between runs. Against a dev server that
  // answers conditional requests, a tool run straight after a rebuild could be
  // served the previous build and report on it. That is how a sentinel holding a
  // known-bad claim passed twice out of three runs.
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH, height: HEIGHT, deviceScaleFactor: 2, mobile: WIDTH < 700,
  });

  await cdp.send('Page.navigate', { url: BASE + ROUTE });
  await new Promise((res) => setTimeout(res, 2500));

  // Kill smooth scrolling so programmatic scrolls land instantly.
  await cdp.send('Runtime.evaluate', {
    expression: `document.documentElement.style.scrollBehavior='auto';
      document.documentElement.scrollHeight`,
    returnByValue: true,
  });

  const { result } = await cdp.send('Runtime.evaluate', {
    expression: 'document.documentElement.scrollHeight', returnByValue: true,
  });
  const total = result.value;
  const step = Math.max(1, Math.floor((total - HEIGHT) / Math.max(1, SLICES - 1)));

  // --at "<css selector>" jumps to one element instead of walking the page,
  // and --y <px> scrolls to an absolute offset. Both take precedence over --slices.
  const AT = flag('at', null);
  const Y = flag('y', null);
  let offsets = Array.from({ length: SLICES }, (_, i) => i * step);
  if (Y !== null) offsets = [Number(Y)];
  if (AT) {
    const { result: r } = await cdp.send('Runtime.evaluate', {
      expression: `(() => { const el = document.querySelector(${JSON.stringify(AT)});
        return el ? Math.max(0, el.getBoundingClientRect().top + window.scrollY - 90) : -1; })()`,
      returnByValue: true,
    });
    if (r.value < 0) throw new Error(`--at selector matched nothing: ${AT}`);
    offsets = [r.value];
  }

  for (let i = 0; i < offsets.length; i++) {
    const y = Math.min(offsets[i], Math.max(0, total - HEIGHT));
    await cdp.send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
    await sleep(400);
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const file = `${OUT}-${WIDTH}-${i}.png`;
    await writeFile(file, Buffer.from(shot.data, 'base64'));
    console.log(`${file}  (scrollY=${y} of ${total})`);
  }
} finally {
  chrome.kill();
}
