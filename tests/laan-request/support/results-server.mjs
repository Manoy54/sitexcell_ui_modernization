import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.cwd(), '.test-artifacts', 'playwright');
const port = Number(process.env.RESULT_VIEWER_PORT ?? 4173);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    const relativePath = url.pathname === '/' ? 'live-results.json' : decodeURIComponent(url.pathname.slice(1));
    const target = normalize(join(root, relativePath));

    if (!target.startsWith(root)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    const targetStat = await stat(target);
    if (!targetStat.isFile()) throw new Error('Not a file');
    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(await readFile(target));
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Test result dashboard: http://127.0.0.1:${port}/`);
  console.log('Press Ctrl+C to stop the local server.');
});
