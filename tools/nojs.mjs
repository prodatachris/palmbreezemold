/**
 * The site with JavaScript disabled.
 *
 * README.md states that every page is complete and navigable without it, and
 * nothing tested that claim. It was false on phones: the mobile nav is
 * display:none and the only thing that opens it is a button that needs a script,
 * so a visitor with JS off got a Menu control that did nothing. The links were
 * still reachable through the footer, which is why no automated check noticed.
 *
 * Fixed by marking the document with a `js` class before first paint and scoping
 * the collapse to it; without the class the nav sits in flow and the toggle is
 * hidden. This check holds that: it fails if the nav is unreachable, if a dead
 * toggle is on screen, or if a page loses its content.
 *
 *   node tools/nojs.mjs [width]
 */
import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', PORT=9466;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
class CDP{constructor(ws){this.ws=ws;this.id=0;this.p=new Map();
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);const r=this.p.get(m.id);if(r){this.p.delete(m.id);m.error?r.rej(new Error(m.error.message)):r.res(m.result)}});}
 send(m,p={}){const id=++this.id;this.ws.send(JSON.stringify({id,method:m,params:p}));return new Promise((res,rej)=>this.p.set(id,{res,rej}))}}
const routes=[];(function w(d){for(const e of readdirSync(d,{withFileTypes:true})){const p=join(d,e.name);
 if(e.isDirectory())w(p);else if(e.name==='index.html')routes.push('/'+(d==='dist'?'':d.slice(5)+'/'))}})('dist');
const ch=spawn(CHROME,['--headless','--disable-gpu','--no-first-run',`--remote-debugging-port=${PORT}`,`--user-data-dir=/tmp/zoom-${PORT}`,'about:blank'],{stdio:'ignore'});
let cdp;for(let i=0;i<80;i++){try{const l=await(await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();const t=l.find(x=>x.type==='page');
 if(t){const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.addEventListener('open',r,{once:true});ws.addEventListener('error',j,{once:true})});cdp=new CDP(ws);break}}catch{}await sleep(200)}
await cdp.send('Page.enable');await cdp.send('Runtime.enable');
// The user-data-dir below is constant, so Chrome's disk cache survives between
// runs and will happily serve a stylesheet from a previous build. Every other
// browser tool here disables it; this one did not, and silently measured stale
// CSS — three consecutive fixes appeared to change nothing.
await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});

const width = Number(process.argv[2] || 390);
await cdp.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
await cdp.send('Network.enable');
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
await cdp.send('Emulation.setScriptExecutionDisabled', { value: true });

function probeNoJs() {
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('navToggle');
  return JSON.stringify({
    navReachable: nav ? getComputedStyle(nav).display !== 'none' : false,
    navLinks: nav ? nav.querySelectorAll('a[href]').length : 0,
    deadToggle: toggle ? getComputedStyle(toggle).display !== 'none' : false,
    footLinks: document.querySelectorAll('.ftr a[href]').length,
    chars: document.body.innerText.replace(/\s+/g, ' ').trim().length,
  });
}

let failed = 0;
for (const r of routes) {
  await cdp.send('Page.navigate', { url: 'http://127.0.0.1:8099' + r });
  await new Promise((res) => {
    const h = (e) => { const m = JSON.parse(e.data); if (m.method === 'Page.loadEventFired') { cdp.ws.removeEventListener('message', h); res(); } };
    cdp.ws.addEventListener('message', h);
  });
  await sleep(140);
  const v = JSON.parse((await cdp.send('Runtime.evaluate', { expression: '(' + probeNoJs.toString() + ')()', returnByValue: true })).result.value);
  const bad = [];
  if (!v.navReachable || v.navLinks === 0) bad.push('primary nav not reachable without JS');
  if (v.deadToggle) bad.push('menu toggle is on screen but nothing can open the nav');
  if (v.footLinks < 5) bad.push(`footer has only ${v.footLinks} link(s)`);
  if (v.chars < 400) bad.push(`page has ${v.chars} characters of text`);
  if (bad.length) { failed++; console.log(`  ✗ ${r}\n      ${bad.join('\n      ')}`); }
}
console.log(`\n  ${routes.length} pages at ${width}px with JavaScript disabled`);
if (failed) { console.log(`  ${failed} page(s) not usable without it\n`); process.exit(1); }
console.log('  ✓ every page navigable without JavaScript\n');
process.exit(0);
