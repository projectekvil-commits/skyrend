/* ===================================
   SKYREND — Main Entry
   =================================== */

import { initI18n } from './i18n.js';
import { initHeroAnimations } from './hero-animation.js';
import { normalizeCharacterSizes } from './char-normalize.js';
import { initSiteBg } from './site-bg.js';


/* ─── CSS Imports ─── */
import '../css/variables.css';
import '../css/global.css';
import '../css/bg-canvas.css';
import '../css/navbar.css';
import '../css/hero.css';
import '../css/features.css';
import '../css/factions.css';
import '../css/guides.css';
import '../css/footer.css';

/* ─── Navbar Scroll Effect ─── */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check

    // Hamburger menu
    const hamburger = document.querySelector('.navbar__hamburger');
    const links = document.querySelector('.navbar__links');

    if (hamburger && links) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            links.classList.toggle('open');
        });

        // Close menu on link click (mobile)
        links.querySelectorAll('.navbar__link').forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                links.classList.remove('open');
            });
        });
    }
}

/* ─── Scroll Reveal (IntersectionObserver) ─── */
function initScrollReveal() {
    const selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
    const reveals = document.querySelectorAll(selectors);
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
}

/* ─── Ambient Cursor Glow ─── */
function initCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

/* ─── Faction Cards: Staggered Scroll Reveal ─── */
function initFactionReveal() {
    const cards = document.querySelectorAll('.faction');
    if (cards.length === 0) return;

    // Add alternating slide directions (start hidden)
    cards.forEach((card, i) => {
        card.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Find index to apply stagger
                    const idx = [...cards].indexOf(entry.target);
                    entry.target.style.transitionDelay = `${idx * 60}ms`;
                    entry.target.classList.add('revealed');
                    // Remove delay after animation so hover works cleanly
                    setTimeout(() => {
                        entry.target.style.transitionDelay = '0ms';
                    }, 800 + idx * 60);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.04, rootMargin: '0px 0px 80px 0px' }
    );

    cards.forEach((card) => observer.observe(card));
}


/* ─── Smooth Scroll for Anchor Links ─── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ─── Initialize Everything ─── */
document.addEventListener('DOMContentLoaded', async () => {
    initSiteBg();          // Must be first — creates the canvas
    initNavbar();
    initHeroAnimations();
    initScrollReveal();
    initFactionReveal();
    initSmoothScroll();
    initCursorGlow();
    await initI18n();

    // Run character normalizer after images have had time to render
    setTimeout(normalizeCharacterSizes, 1500);

    // Remove loading state
    document.body.classList.add('loaded');
});
