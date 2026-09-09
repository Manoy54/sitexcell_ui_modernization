import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const prototypeRoot = fileURLToPath(new URL('.', import.meta.url));
const resolvedRoot = resolve(prototypeRoot);
const port = Number.parseInt(process.env.ACCESS_PROTOTYPE_PORT ?? '4178', 10);
const contentTypes = {
    '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
};

createServer((request, response) => {
    const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
    const relativePath = requestUrl.pathname === '/' ? 'index.html' : decodeURIComponent(requestUrl.pathname.slice(1));
    const resolvedPath = resolve(prototypeRoot, normalize(relativePath));
    const isInside = resolvedPath === resolvedRoot || resolvedPath.startsWith(`${resolvedRoot}${sep}`);
    if (!isInside || !existsSync(resolvedPath) || statSync(resolvedPath).isDirectory()) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Prototype file not found.');
        return;
    }
    response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Security-Policy': "default-src 'self'; style-src 'self'; img-src 'self' data:; script-src 'self'; connect-src 'self'",
        'Content-Type': contentTypes[extname(resolvedPath)] ?? 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff',
    });
    createReadStream(resolvedPath).pipe(response);
}).listen(port, '127.0.0.1', () => {
    console.log(`Access Request prototype running at http://127.0.0.1:${port}`);
});
