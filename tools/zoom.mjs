/**
 * WCAG 1.4.4 — text resized to 200%.
 *
 * Injects `html { font-size: 32px }` and reports two failures: text clipped by
 * an ellipsis, and horizontal overflow of the document. Neither shows up in the
 * normal audit, which measures at the browser default size.
 *
 * Both now pass on all 36 pages at 320px and 390px. Two causes, and neither was
 * the rem-based chrome originally suspected:
 *
 *   1. Long words had no break opportunity. A heading at 200% is ~69px, so a
 *      single word ("homeowners", "Aspergillus/Penicillium") is wider than its
 *      column and painted past the viewport. overflow-wrap: break-word on the
 *      headings and inherited from body covers it.
 *   2. Flex and grid items keep their automatic minimum size — min-content —
 *      so they refuse to shrink below their longest word and push the container
 *      out regardless of how the text is allowed to wrap. Five layouts had
 *      this; see the min-width: 0 rule near the top of styles.css.
 *
 * Worth knowing if this ever regresses: a page can overflow with no element
 * whose box is past the edge, because text overflowing its own box still counts
 * toward documentElement.scrollWidth. Compare scrollWidth to clientWidth per
 * element to find the container; a rect scan alone will report nothing.
 *
 *   node tools/zoom.mjs [width]
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
// WCAG 1.4.4: text scaled to 200% with no loss of content or function.
await cdp.send('Page.addScriptToEvaluateOnNewDocument',{source:`
  document.addEventListener('DOMContentLoaded',()=>{
    const s=document.createElement('style');
    s.textContent='html{font-size:32px !important}';
    document.head.appendChild(s);
  });`});
const width=Number(process.argv[2]||390);
await cdp.send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:2,mobile:width<700});
const PROBE=`(() => {
  const de=document.documentElement;
  const out={overflow:null, clipped:[]};
  if (de.scrollWidth > de.clientWidth + 1) {
    out.overflow = de.scrollWidth + ' in ' + de.clientWidth;
    out.offenders = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right > de.clientWidth + 1) {
        out.offenders.push(el.tagName.toLowerCase()+'.'+(el.className||'').toString().split(' ')[0]+
          ' right='+Math.round(r.right)+' "'+(el.textContent||'').trim().slice(0,26)+'"');
      }
    }
    out.offenders = [...new Set(out.offenders)].slice(-4);
  }
  for (const el of document.querySelectorAll('body *')) {
    if (el.namespaceURI === 'http://www.w3.org/2000/svg') continue;
    if (!el.textContent || !el.textContent.trim()) continue;
    if (![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())) continue;
    if (!el.checkVisibility({checkVisibilityCSS:true})) continue;
    const cs=getComputedStyle(el);
    const clips = cs.textOverflow==='ellipsis'||cs.whiteSpace==='nowrap'||cs.overflow==='hidden'||cs.overflowX==='hidden';
    if (clips && el.scrollWidth > el.clientWidth + 1)
      out.clipped.push(el.tagName.toLowerCase()+'.'+(el.className||'').toString().split(' ')[0]+' "'+el.textContent.trim().slice(0,22)+'"');
  }
  return JSON.stringify(out);
})()`;
let over=0, clip=0;
for (const r of routes) {
  await cdp.send('Page.navigate',{url:'http://127.0.0.1:8099'+r});
  await sleep(420);
  const v=JSON.parse((await cdp.send('Runtime.evaluate',{expression:PROBE,returnByValue:true})).result.value);
  if (v.overflow) { over++; if(over<=3) console.log(`  ✗ ${r} horizontal overflow at 200% text: ${v.overflow}`); }
  if (v.clipped.length) { clip++; if(clip<=4) console.log(`  ✗ ${r} clipped: ${[...new Set(v.clipped)].slice(0,2).join(' | ')}`); }
}
console.log(`\n  ${routes.length} pages at ${width}px with text at 200%`);
console.log(`  ${over} with horizontal overflow · ${clip} with clipped text`);
ch.kill();process.exit(0);
