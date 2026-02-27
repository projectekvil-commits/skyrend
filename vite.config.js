import { defineConfig } from 'vite';
import { resolve, join } from 'path';
import { createReadStream, existsSync } from 'fs';

const BRAIN = 'C:/Users/Alex/.gemini/antigravity/brain/f6daef26-595c-4c5c-b117-14593848c8c3';

// Generated atmospheric backgrounds for faction cards
const FACTION_BACKGROUNDS = {
    '/Images/generated/faction-bg-dominion.png': `${BRAIN}/faction_bg_dominion_1772204150152.png`,
    '/Images/generated/faction-bg-accord.png': `${BRAIN}/faction_bg_accord_1772204168249.png`,
    '/Images/generated/faction-bg-veil.png': `${BRAIN}/faction_bg_veil_1772204182029.png`,
    '/Images/generated/faction-bg-covenant.png': `${BRAIN}/faction_bg_covenant_1772204199155.png`,
};

function serveStaticAssets() {
    return {
        name: 'serve-static-assets',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const url = decodeURIComponent(req.url || '').split('?')[0];

                // Serve generated faction backgrounds from brain folder
                const generated = FACTION_BACKGROUNDS[url];
                if (generated && existsSync(generated)) {
                    res.setHeader('Content-Type', 'image/png');
                    res.setHeader('Cache-Control', 'no-cache');
                    createReadStream(generated).pipe(res);
                    return;
                }

                // Serve /Images/* and /assets/* from project root
                if (url.startsWith('/Images/') || url.startsWith('/assets/')) {
                    const filePath = join(process.cwd(), url);
                    if (existsSync(filePath)) {
                        const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
                        const mime = {
                            png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
                            gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
                        }[ext] ?? 'application/octet-stream';
                        res.setHeader('Content-Type', mime);
                        res.setHeader('Cache-Control', 'no-cache');
                        createReadStream(filePath).pipe(res);
                        return;
                    }
                }

                next();
            });
        },
    };
}

export default defineConfig({
    plugins: [serveStaticAssets()],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                download: resolve(__dirname, 'download.html'),
            },
        },
    },
    server: { port: 5173 },
});
