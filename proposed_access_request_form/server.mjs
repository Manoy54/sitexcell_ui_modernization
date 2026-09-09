import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, normalize, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const prototypeRoot = fileURLToPath(new URL('.', import.meta.url));
const resolvedRoot = resolve(prototypeRoot);
const port = Number.parseInt(process.env.ACCESS_PROTOTYPE_PORT ?? '4178', 10);
const contentTypes = {
    '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
};

export function parseRequestPath(requestTarget, host) {
    try {
        const requestUrl = new URL(requestTarget ?? '/', `http://${host ?? 'localhost'}`);
        return { ok: true, relativePath: requestUrl.pathname === '/' ? 'index.html' : decodeURIComponent(requestUrl.pathname.slice(1)) };
    } catch {
        return { ok: false, status: 400 };
    }
}

export function createPrototypeServer() {
    return createServer((request, response) => {
        const parsedPath = parseRequestPath(request.url, request.headers.host);
        if (!parsedPath.ok) {
            response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end('Malformed prototype URL.');
            return;
        }
        const resolvedPath = resolve(prototypeRoot, normalize(parsedPath.relativePath));
        const isInside = resolvedPath === resolvedRoot || resolvedPath.startsWith(`${resolvedRoot}${sep}`);
        if (!isInside || !existsSync(resolvedPath) || statSync(resolvedPath).isDirectory()) {
            response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end('Prototype file not found.');
            return;
        }
        response.writeHead(200, {
            'Cache-Control': 'no-store',
            'Content-Security-Policy': "default-src 'self'; style-src 'self' https://cdn.jsdelivr.net; font-src 'self' https://cdn.jsdelivr.net data:; img-src 'self' data:; script-src 'self'; connect-src 'self'",
            'Content-Type': contentTypes[extname(resolvedPath)] ?? 'application/octet-stream',
            'X-Content-Type-Options': 'nosniff',
        });
        createReadStream(resolvedPath).pipe(response);
    });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    createPrototypeServer().listen(port, '127.0.0.1', () => {
        console.log(`Access Request prototype running at http://127.0.0.1:${port}`);
    });
}
