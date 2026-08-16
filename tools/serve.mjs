/**
 * Static server for the local checks.
 *
 *   node tools/serve.mjs [--port 8099] [--root dist]
 *
 * This replaces `python3 -m http.server`, which was fine for the audit but
 * quietly ruined the Core Web Vitals numbers: it sends no Content-Encoding, so
 * vitals.mjs was timing 45KB of uncompressed HTML for a page that any real host
 * serves in about 9KB. Under the Slow 4G profile that is roughly a five-fold
 * difference on the critical path, and it showed up as LCP over budget on the
 * two longest pages. Measuring against something production would never do is
 * not a conservative estimate, it is a wrong one.
 *
 * Brotli when the client accepts it, gzip otherwise, identity for anything
 * already compressed (images, video, fonts are all pre-compressed formats).
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const PORT = Number(flag('port', 8099));
const ROOT = flag('root', 'dist');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ico': 'image/x-icon',
};
/** Only text compresses usefully. The rest are already compressed formats. */
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg']);

const resolve = async (urlPath) => {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const candidates = clean.endsWith('/')
    ? [join(ROOT, clean, 'index.html')]
    : [join(ROOT, clean), join(ROOT, clean, 'index.html')];
  for (const c of candidates) {
    try { const s = await stat(c); if (s.isFile()) return c; } catch { /* next */ }
  }
  return null;
};

createServer(async (req, res) => {
  const file = await resolve(req.url);
  if (!file) {
    const notFound = join(ROOT, '404.html');
    try {
      const body = await readFile(notFound);
      res.writeHead(404, { 'Content-Type': TYPES['.html'] });
      return res.end(body);
    } catch { res.writeHead(404); return res.end('Not found'); }
  }

  const ext = extname(file).toLowerCase();
  const type = TYPES[ext] || 'application/octet-stream';

  if (!COMPRESSIBLE.has(ext)) {
    res.writeHead(200, { 'Content-Type': type });
    return createReadStream(file).pipe(res);
  }

  const raw = await readFile(file);
  const accepts = String(req.headers['accept-encoding'] || '');
  let body = raw; let encoding = null;
  if (/\bbr\b/.test(accepts)) {
    body = brotliCompressSync(raw, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } });
    encoding = 'br';
  } else if (/\bgzip\b/.test(accepts)) {
    body = gzipSync(raw, { level: 6 });
    encoding = 'gzip';
  }
  const headers = { 'Content-Type': type, 'Content-Length': body.length, Vary: 'Accept-Encoding' };
  if (encoding) headers['Content-Encoding'] = encoding;
  res.writeHead(200, headers);
  res.end(body);
}).listen(PORT, '127.0.0.1', () => {
  console.log(`serving ${ROOT}/ on http://127.0.0.1:${PORT} (brotli/gzip for text)`);
});
