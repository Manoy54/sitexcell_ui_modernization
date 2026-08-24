import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const prototypeRoot = fileURLToPath(new URL('.', import.meta.url));
const resolvedRoot = resolve(prototypeRoot);
const port = Number.parseInt(process.env.LAAN_PROTOTYPE_PORT ?? '4177', 10);

const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
};

createServer((request, response) => {
    const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
    const relativePath = requestUrl.pathname === '/' ? 'index.html' : decodeURIComponent(requestUrl.pathname.slice(1));
    const resolvedPath = resolve(prototypeRoot, normalize(relativePath));

    const isInsidePrototype = resolvedPath === resolvedRoot || resolvedPath.startsWith(`${resolvedRoot}${sep}`);

    if (!isInsidePrototype || !existsSync(resolvedPath) || statSync(resolvedPath).isDirectory()) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Prototype file not found.');
        return;
    }

    response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': contentTypes[extname(resolvedPath)] ?? 'application/octet-stream',
    });
    createReadStream(resolvedPath).pipe(response);
}).listen(port, '127.0.0.1', () => {
    console.log(`LAAN prototype running at http://127.0.0.1:${port}`);
    console.log(`Selected reference dashboard: http://127.0.0.1:${port}/`);
});
