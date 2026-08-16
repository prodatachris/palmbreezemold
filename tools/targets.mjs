/**
 * WCAG 2.5.8 — target size (minimum), and an advisory pass at 44px.
 *
 * 2.5.8 asks for 24x24 CSS px and exempts targets sitting inline in a sentence,
 * where the line-height of the surrounding text constrains them. That exemption
 * covers most of this site — it is link-dense body copy — so the check reports
 * the exempt count too rather than quietly dropping ~1300 elements.
 *
 * The 24px line is the pass/fail one. The 44px line is advisory and is what
 * Apple's HIG and Material both use: everything below it is listed, because
 * passing AA is not the same as being comfortable to hit on a phone, and this
 * is a phone-first audience. When this was written the site passed 24px
 * outright, and the only thing left under 44px was the header brand lockup at
 * 204x32 — wide, isolated, and deliberately not resized.
 *
 *   node tools/targets.mjs [width]
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
await cdp.send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 2, mobile: width < 700 });
await cdp.send('Network.enable');
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

const AA = 24, COMFORT = 44;

function probeTargets() {
  const SEL = 'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"]),summary';
  const out = [];
  for (const el of document.querySelectorAll(SEL)) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (r.width >= 44 && r.height >= 44) continue;
    // 2.5.8 "Inline" exception: the target is in a sentence, so the line-height
    // of the non-target text around it is what constrains its size.
    const p = el.parentElement;
    const inlineInText =
      p && ['P', 'LI', 'SPAN', 'TD', 'DD', 'DT', 'H1', 'H2', 'H3', 'H4'].includes(p.tagName) &&
      cs.display.startsWith('inline');
    out.push({
      sel: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''),
      w: Math.round(r.width), h: Math.round(r.height), inlineInText,
      txt: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 26),
    });
  }
  return JSON.stringify(out);
}

let fails = 0, exempt = 0;
const small = new Map();
for (const r of routes) {
  await cdp.send('Page.navigate', { url: 'http://127.0.0.1:8099' + r });
  await new Promise((res) => {
    const h = (e) => { const m = JSON.parse(e.data); if (m.method === 'Page.loadEventFired') { cdp.ws.removeEventListener('message', h); res(); } };
    cdp.ws.addEventListener('message', h);
  });
  await sleep(180);
  const list = JSON.parse((await cdp.send('Runtime.evaluate', { expression: '(' + probeTargets.toString() + ')()', returnByValue: true })).result.value);
  for (const t of list) {
    if (t.inlineInText) { exempt++; continue; }
    const key = `${t.sel} ${t.w}x${t.h} "${t.txt}"`;
    if (!small.has(key)) small.set(key, { n: 0, ex: r, fail: t.w < AA || t.h < AA });
    small.get(key).n++;
    if (t.w < AA || t.h < AA) fails++;
  }
}

console.log(`\n▸ Target size at ${width}px  (${AA}px = WCAG 2.5.8 AA, ${COMFORT}px = advisory)\n`);
console.log(`  ${exempt} target(s) exempt as inline in a sentence\n`);
if (small.size) {
  console.log(`  under ${COMFORT}px:`);
  [...small].sort((a, b) => b[1].n - a[1].n).forEach(([k, v]) =>
    console.log(`   ${v.fail ? '✗' : '·'} x${String(v.n).padEnd(3)} ${k}   e.g. ${v.ex}`));
  console.log('');
}
if (fails) {
  console.log(`✗ ${fails} target(s) below the ${AA}px minimum\n`);
  process.exit(1);
}
console.log(`✓ every non-exempt target meets the ${AA}px minimum\n`);
process.exit(0);
