import { cpSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = resolve(root, 'Images');
const dst = resolve(root, 'public', 'Images');

mkdirSync(dst, { recursive: true });
cpSync(src, dst, { recursive: true, force: true });
console.log('✅ Images copied to public/Images');
