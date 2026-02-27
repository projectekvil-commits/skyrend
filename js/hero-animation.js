/* ===================================
   SKYREND — Hero Animations
   =================================== */

/**
 * Parallax effect on hero background layers
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const layers = hero.querySelectorAll('.hero__bg-layer');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;

        if (scrollY > heroHeight) return; // Skip if past hero

        layers.forEach((layer, i) => {
            const speed = (i + 1) * 0.15;
            layer.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }, { passive: true });
}

/**
 * Generate floating particles near the rift
 */
function initParticles() {
    const container = document.querySelector('.hero__particles');
    if (!container) return;

    const PARTICLE_COUNT = 25;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Position near the rift (center-ish)
        const x = 40 + Math.random() * 20; // 40-60% from left
        const y = Math.random() * 100;
        const size = 1 + Math.random() * 3;
        const duration = 3 + Math.random() * 5;
        const delay = Math.random() * 6;
        const drift = -30 + Math.random() * 60;

        particle.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      --drift: ${drift}px;
    `;

        container.appendChild(particle);
    }
}

/**
 * Mouse move subtle response for hero content
 */
function initMouseMove() {
    const content = document.querySelector('.hero__content');
    const rift = document.querySelector('.hero__rift');
    if (!content) return;

    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const x = (clientX / innerWidth - 0.5) * 10;
        const y = (clientY / innerHeight - 0.5) * 10;

        content.style.transform = `translate(${x}px, ${y}px)`;

        if (rift) {
            rift.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
        }
    });
}

/**
 * Initialize all hero animations
 */
export function initHeroAnimations() {
    initParallax();
    initParticles();
    initMouseMove();
}
