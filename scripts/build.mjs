import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(resolve(root, 'src'), resolve(dist, 'src'), { recursive: true });
await cp(resolve(root, 'index.html'), resolve(dist, 'index.html'));
await cp(resolve(root, 'PRIVACY.md'), resolve(dist, 'PRIVACY.md'));

// Ensure the static build is path-portable on subdirectories and local hosts.
const indexPath = resolve(dist, 'index.html');
let html = await readFile(indexPath, 'utf8');
html = html.replace('href="/src/style.css"', 'href="./src/style.css"');
html = html.replace('src="/src/game.js"', 'src="./src/game.js"');
await writeFile(indexPath, html);

console.log('Built WATCHED to dist/ with zero runtime dependencies.');
