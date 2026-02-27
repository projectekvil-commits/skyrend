/* ===================================
   SKYREND — Site-Wide Particle Background
   =================================== */

/**
 * Creates a persistent canvas behind the entire site with:
 * - Drifting star particles (tiny white dots, like starfield)
 * - Rare amber/gold sparks that flare briefly
 * - Two slow ambient teal/crimson orbs that drift across the page
 *
 * All blends over the base --color-bg-deep background.
 */
export function initSiteBg() {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'site-bg-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');

    // Resize handler
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = document.documentElement.scrollHeight;
    }
    resize();
    window.addEventListener('resize', () => {
        resize();
        buildParticles();
    });

    // ── Particle pool ────────────────────────────────────────
    const STAR_COUNT = 140;
    const SPARK_COUNT = 18;
    let stars = [];
    let sparks = [];

    function rand(min, max) { return min + Math.random() * (max - min); }

    function buildParticles() {
        const W = canvas.width;
        const H = canvas.height;

        // Stars — small slow-drifting dots
        stars = Array.from({ length: STAR_COUNT }, () => ({
            x: rand(0, W),
            y: rand(0, H),
            r: rand(0.4, 1.6),
            speed: rand(0.15, 0.55),
            drift: rand(-0.12, 0.12),
            alpha: rand(0.15, 0.5),
            flicker: rand(0.003, 0.012),
            flickerDir: Math.random() > 0.5 ? 1 : -1,
            baseAlpha: 0,
        }));
        stars.forEach(s => s.baseAlpha = s.alpha);

        // Sparks — brighter, coloured, short-lived flares
        sparks = Array.from({ length: SPARK_COUNT }, () => buildSpark(W, H));
    }

    function buildSpark(W, H) {
        // Colour: teal, gold, or faint crimson
        const palette = [
            'rgba(62, 201, 192,',   // teal
            'rgba(212, 168, 75,',   // gold
            'rgba(200, 100, 50,',   // amber
            'rgba(255, 255, 230,',  // white-ish
        ];
        const color = palette[Math.floor(Math.random() * palette.length)];
        return {
            x: rand(0, W),
            y: rand(0, H),
            r: rand(1, 3.5),
            speed: rand(0.2, 0.7),
            drift: rand(-0.3, 0.3),
            alpha: 0,
            maxAlpha: rand(0.3, 0.75),
            life: 0,
            maxLife: rand(180, 420),   // frames
            color,
        };
    }

    buildParticles();

    // ── Ambient orbs — huge blurred light blobs ───────────────
    const orbs = [
        { x: 0.15, y: 0.10, r: 340, color: 'rgba(62, 201, 192,', a: 0.04, dx: 0.00012, dy: 0.00008 },
        { x: 0.80, y: 0.55, r: 400, color: 'rgba(180, 100, 40,', a: 0.05, dx: -0.00009, dy: 0.00011 },
        { x: 0.50, y: 0.85, r: 300, color: 'rgba(62, 60, 140,', a: 0.045, dx: 0.00010, dy: -0.00007 },
    ];

    // ── Render loop ───────────────────────────────────────────
    function draw() {
        const W = canvas.width;
        const H = canvas.height;

        ctx.clearRect(0, 0, W, H);

        // Base background
        ctx.fillStyle = '#07080f';
        ctx.fillRect(0, 0, W, H);

        // Ambient orbs
        orbs.forEach(orb => {
            // Drift slowly
            orb.x += orb.dx;
            orb.y += orb.dy;
            if (orb.x < 0 || orb.x > 1) orb.dx *= -1;
            if (orb.y < 0 || orb.y > 1) orb.dy *= -1;

            const cx = orb.x * W;
            const cy = orb.y * H;
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orb.r);
            grad.addColorStop(0, orb.color + orb.a + ')');
            grad.addColorStop(1, orb.color + '0)');
            ctx.beginPath();
            ctx.arc(cx, cy, orb.r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        });

        // Stars
        stars.forEach(s => {
            // Drift upward slowly
            s.y -= s.speed;
            s.x += s.drift;
            if (s.y < -4) { s.y = H + 4; s.x = rand(0, W); }
            if (s.x < -4) s.x = W + 4;
            if (s.x > W + 4) s.x = -4;

            // Flicker alpha
            s.alpha += s.flicker * s.flickerDir;
            if (s.alpha >= s.baseAlpha * 1.6 || s.alpha <= s.baseAlpha * 0.3) s.flickerDir *= -1;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 215, 255, ${s.alpha})`;
            ctx.fill();
        });

        // Sparks (coloured flares)
        sparks.forEach((sp, i) => {
            sp.life++;
            sp.y -= sp.speed;
            sp.x += sp.drift;

            // Fade in / fade out
            const progress = sp.life / sp.maxLife;
            sp.alpha = progress < 0.3
                ? sp.maxAlpha * (progress / 0.3)
                : sp.maxAlpha * (1 - (progress - 0.3) / 0.7);

            if (sp.life >= sp.maxLife) {
                sparks[i] = buildSpark(W, H);
                return;
            }

            // Glow
            const grad = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sp.r * 4);
            grad.addColorStop(0, sp.color + sp.alpha + ')');
            grad.addColorStop(0.4, sp.color + sp.alpha * 0.4 + ')');
            grad.addColorStop(1, sp.color + '0)');

            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.r * 4, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Core dot
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.r * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = sp.color + Math.min(sp.alpha * 2, 1) + ')';
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    draw();

    // Re-measure page height periodically (content loads async)
    setTimeout(resize, 2000);
}
