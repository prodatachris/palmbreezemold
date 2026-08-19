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

/**
 * No caching, ever, on the dev server.
 *
 * This sent no cache headers at all, which is not the same as sending
 * no-store: with no Cache-Control, no ETag and no Last-Modified, Chrome
 * falls back to heuristic caching and may reuse a response without
 * revalidating. That is how you end up staring at a page whose stylesheet
 * predates the change you just made and concluding the change did not work.
 * Production caching is a separate concern and lives in _headers and
 * deploy/gcs-cache-headers.sh.
 */
const NO_STORE = {
  'Cache-Control': 'no-store, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

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
    // Range requests, for the media only.
    //
    // Without these a browser cannot seek: it asks for a byte range, gets a
    // 200 and the whole file, and reports the clip as unseekable. That is
    // exactly what happened to the scroll-scrubbed hero video — readyState 4,
    // fully buffered, and video.seekable.end(0) === 0, so every seek snapped
    // back to frame zero and the clip looked frozen. Real hosts answer ranges;
    // this server was the only thing that did not, which made a working
    // feature look broken.
    const { size } = await stat(file);
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (range) {
      const start = range[1] ? Number(range[1]) : 0;
      const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
      if (start >= size || start > end) {
        res.writeHead(416, { 'Content-Range': `bytes */${size}` });
        return res.end();
      }
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        ...NO_STORE,
      });
      return createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': size,
      'Accept-Ranges': 'bytes',
      ...NO_STORE,
    });
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
  const headers = { 'Content-Type': type, 'Content-Length': body.length, Vary: 'Accept-Encoding', ...NO_STORE };
  if (encoding) headers['Content-Encoding'] = encoding;
  res.writeHead(200, headers);
  res.end(body);
}).listen(PORT, '127.0.0.1', () => {
  console.log(`serving ${ROOT}/ on http://127.0.0.1:${PORT} (brotli/gzip for text)`);
});
