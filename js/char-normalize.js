/**
 * Character Size Normalizer
 * 
 * Each faction character PNG has the character at a different relative scale
 * within its canvas (some fill 90%, others fill 30%). This module uses an
 * offscreen Canvas to measure the actual non-transparent pixel bounds and
 * applies a CSS scale() transform to make all characters the same visual height.
 */

const TARGET_CHAR_HEIGHT_PX = 460; // desired visual character height — matches 540px container
let hasRun = false; // guard — reset on HMR by Vite

// Vite HMR: reset guard when module is hot-replaced
if (import.meta.hot) {
    import.meta.hot.accept(() => {
        hasRun = false;
    });
}

function measureCharacterBounds(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    try {
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const w = canvas.width;
        const h = canvas.height;
        let minY = h, maxY = 0;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const alpha = data[(y * w + x) * 4 + 3];
                if (alpha > 20) {
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        const charHeight = Math.max(maxY - minY, 1);
        return { charHeight, canvasHeight: h };
    } catch (e) {
        return { charHeight: img.naturalHeight, canvasHeight: img.naturalHeight };
    }
}

export async function normalizeCharacterSizes() {
    if (hasRun) return;
    hasRun = true;

    const chars = Array.from(document.querySelectorAll('.faction__char'));
    if (!chars.length) return;

    // Wait for all images to load
    await Promise.all(chars.map(img =>
        img.complete
            ? Promise.resolve()
            : new Promise(res => { img.onload = res; img.onerror = res; })
    ));

    chars.forEach(img => {
        if (!img.naturalWidth) return;

        // Reset any existing transform BEFORE measuring rendered size
        img.style.transform = 'none';
        img.style.transformOrigin = 'bottom center';

        const bounds = measureCharacterBounds(img);

        // Rendered height of the img element
        const renderedHeight = img.getBoundingClientRect().height;
        if (!renderedHeight) return;

        // The character occupies (charHeight / canvasHeight) fraction of the rendered height
        const charRatio = bounds.charHeight / bounds.canvasHeight;
        const visibleCharHeight = renderedHeight * charRatio;

        // Scale factor to reach target visual height
        const rawScale = TARGET_CHAR_HEIGHT_PX / visibleCharHeight;
        const scale = Math.min(Math.max(rawScale, 0.5), 3.5);

        img.style.transform = `scale(${scale.toFixed(3)})`;

        console.log(
            `[CharNorm] ${img.src.split('/').pop()} ` +
            `ratio=${charRatio.toFixed(2)} ` +
            `visH=${Math.round(visibleCharHeight)}px → ` +
            `scale=${scale.toFixed(2)}`
        );
    });
}
