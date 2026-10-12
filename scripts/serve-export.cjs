const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
require('@next/env').loadEnvConfig(require('node:path').resolve(__dirname,'..'));
const {createAgentHandler} = require('../src/server/portfolio-agent.cjs');
const handleAgent = createAgentHandler();
const root = path.resolve(__dirname, '../out');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml' };
http.createServer(async (req, res) => {
  if (await handleAgent(req,res)) return;
  let file;
  try { file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)); } catch { res.writeHead(400); res.end('Bad request'); return; }
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end('Forbidden'); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404, { 'Content-Type': mime['.html'] }); fs.createReadStream(path.join(root, '404.html')).pipe(res); return; }
  const extension = path.extname(file);
  const headers = { 'Content-Type': mime[extension] || 'application/octet-stream', 'Cache-Control': file.includes(path.sep + '_next' + path.sep + 'static' + path.sep) ? 'public, max-age=31536000, immutable' : 'no-cache', 'X-Content-Type-Options': 'nosniff' };
  if (/\bbr\b/.test(req.headers['accept-encoding'] || '') && ['.html', '.js', '.css', '.svg', '.xml', '.txt'].includes(extension)) {
    res.writeHead(200, { ...headers, 'Content-Encoding': 'br', 'Vary': 'Accept-Encoding' }); fs.createReadStream(file).pipe(zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 } })).pipe(res);
  } else if (/\bgzip\b/.test(req.headers['accept-encoding'] || '') && ['.html', '.js', '.css', '.svg', '.xml', '.txt'].includes(extension)) {
    res.writeHead(200, { ...headers, 'Content-Encoding': 'gzip', 'Vary': 'Accept-Encoding' }); fs.createReadStream(file).pipe(zlib.createGzip()).pipe(res);
  } else { res.writeHead(200, headers); fs.createReadStream(file).pipe(res); }
}).listen(3000, '127.0.0.1', () => console.log('Portfolio preview: http://127.0.0.1:3000'));
