// Initialize AOS (Animate On Scroll) if available
if (window.AOS) {
    window.AOS.init({ duration: 800, once: true, offset: 100 });
}

// Preloader functionality (moved from inline HTML)
window.addEventListener('load', () => {
    const loader = document.getElementById('load');
    const body = document.body;
    if (!loader) return;
    loader.classList.add('fade-out');
    setTimeout(() => {
        loader.style.display = 'none';
        body.classList.remove('loading');
    }, 500);
});

// Fade-in Animation Observer
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.classList.remove('invisible');
        } 
    // else {
    //   entry.target.classList.remove('visible');
    //   entry.target.classList.add('invisible');
    // }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(element => {
    fadeObserver.observe(element);
});

// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Navigation
    nav.classList.toggle('active');

    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });

    // Burger Animation
    burger.classList.toggle('toggle');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            nav.classList.remove('active');
            burger.classList.remove('toggle');
        }
    });
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scrolled');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scrolled')) {
        // Scrolling down
        navbar.classList.add('scrolled');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scrolled')) {
        // Scrolling up
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});


// Form Submission with API call
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = this.querySelector('.submit-button');
        const originalText = submitButton.innerHTML;
        const statusEl = document.getElementById('contact-status');

        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const _hp = (document.getElementById('_hp')?.value || '').trim();

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message, _hp })
            });
            const data = await res.json().catch(() => ({ ok: false }));

            if (res.ok && data.ok) {
                submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                statusEl && (statusEl.textContent = 'Thanks! Your message has been sent.');
                contactForm.reset();
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (err) {
            submitButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Try Again';
            statusEl && (statusEl.textContent = 'Sorry, there was an error sending your message.');
        } finally {
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 2000);
        }
    });
}



// Mouse cursor tracking
document.addEventListener('DOMContentLoaded', () => {
    const indicator = document.getElementById('cursor-indicator');
    
    if (indicator) {
        document.addEventListener('mousemove', (e) => {
            // Use requestAnimationFrame for smooth animation
            requestAnimationFrame(() => {
                indicator.style.left = `${e.clientX}px`;
                indicator.style.top = `${e.clientY}px`;
            });
        });
        
        // Hide cursor indicator when mouse leaves the window
        document.addEventListener('mouseleave', () => {
            indicator.style.opacity = '0';
        });
        
        // Show cursor indicator when mouse enters the window
        document.addEventListener('mouseenter', () => {
            indicator.style.opacity = '1';
        });
    }
});

// Cursor outline effect
document.addEventListener('DOMContentLoaded', () => {
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursorOutline) {
        document.addEventListener('mousemove', (e) => {
            // Use requestAnimationFrame for smooth animation
            requestAnimationFrame(() => {
                cursorOutline.style.left = `${e.clientX}px`;
                cursorOutline.style.top = `${e.clientY}px`;
            });
        });
        
        // Hide cursor outline when mouse leaves the window
        document.addEventListener('mouseleave', () => {
            cursorOutline.style.opacity = '0';
        });
        
        // Show cursor outline when mouse enters the window
        document.addEventListener('mouseenter', () => {
            cursorOutline.style.opacity = '1';
        });
    }
});

function highlightActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingNavLink) { correspondingNavLink.classList.add('active'); }
            }
        });
    }

// Update active link on scroll
window.addEventListener('scroll', () => {
    highlightActiveNavLink();
});
highlightActiveNavLink();

// Theme toggle with persistence and system preference fallback
(function initThemeToggle() {
    const root = document.documentElement;
    const toggleBtn = document.querySelector('.theme-toggle');
    const THEME_KEY = 'preferred-theme';

    function applyTheme(theme) {
        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
            toggleBtn && (toggleBtn.innerHTML = '<i class="fas fa-sun"></i>');
        } else {
            root.removeAttribute('data-theme');
            toggleBtn && (toggleBtn.innerHTML = '<i class="fas fa-moon"></i>');
        }
    }

    // Determine initial theme
    const stored = localStorage.getItem(THEME_KEY);
    let initial = stored;
    if (!initial) {
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        initial = prefersLight ? 'light' : 'dark';
    }
    applyTheme(initial);

    // Toggle on click
    toggleBtn && toggleBtn.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const next = current === 'light' ? 'dark' : 'light';
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
    });

    // Update if system preference changes and user hasn't explicitly set
    const media = window.matchMedia('(prefers-color-scheme: light)');
    media.addEventListener && media.addEventListener('change', (e) => {
        const explicit = localStorage.getItem(THEME_KEY);
        if (!explicit) {
            applyTheme(e.matches ? 'light' : 'dark');
        }
    });
})();

// Interactive hero background
(function heroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let width = 1, height = 1;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = prefersReduced ? prefersReduced.matches : false;

    const container = canvas.parentElement || canvas;

    function resize() {
        const rect = (container.getBoundingClientRect ? container.getBoundingClientRect() : canvas.getBoundingClientRect());
        // Fallback to viewport if layout not ready yet
        const rectWidth = Math.max(1, Math.floor(rect.width || window.innerWidth));
        const rectHeight = Math.max(1, Math.floor(rect.height || Math.floor(window.innerHeight * 0.6)));
        width = rectWidth;
        height = rectHeight;
        // Mirror CSS size to avoid visual scaling glitches
        canvas.style.width = rectWidth + 'px';
        canvas.style.height = rectHeight + 'px';
        // Set drawing buffer considering DPR
        canvas.width = Math.floor(rectWidth * dpr);
        canvas.height = Math.floor(rectHeight * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // React to layout/size changes of the container
    if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => {
            resize();
            initParticles();
        });
        ro.observe(container);
    } else {
        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });
    }

    const colors = {
        dark: ['#00e676', '#2f8d46', 'rgba(0,230,118,0.25)'],
        light: ['#0fbf7e', '#0c8f53', 'rgba(12,143,83,0.28)']
    };

    function currentPalette() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? colors.light : colors.dark;
    }

    let mouse = { x: -9999, y: -9999 };
    let rafMouse = null;
    window.addEventListener('mousemove', (e) => {
        if (rafMouse) return;
        rafMouse = requestAnimationFrame(() => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            rafMouse = null;
        });
    }, { passive: true });
    window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    // Particle field
    const COUNT_BASE = 60; // scales with width
    let particles = [];

    function initParticles() {
        let count = Math.floor((width * height) / 35000) + COUNT_BASE;
        if (width < 640) count = Math.floor(count * 0.65);
        if (reduceMotion) count = Math.floor(count * 0.35);
        particles = new Array(count).fill(0).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            r: Math.random() * 1.8 + 0.6
        }));
    }
    // Initialize particles after we ensure a valid size
    const kickoff = () => {
        resize();
        initParticles();
        (window.requestIdleCallback || window.requestAnimationFrame)(step);
    };
    // Defer kickoff to next frame(s) so CSS/layout are settled
    requestAnimationFrame(() => requestAnimationFrame(kickoff));

    function step() {
        const [c1, c2, glow] = currentPalette();
        ctx.clearRect(0, 0, width, height);

        // subtle gradient backdrop
        const g = ctx.createLinearGradient(0, 0, width, height);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);

        // Draw connections
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // attraction to mouse
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.hypot(dx, dy);
            const influence = Math.max(0, 1 - dist / 180);
            p.vx += (dx / (dist || 1)) * 0.04 * influence;
            p.vy += (dy / (dist || 1)) * 0.04 * influence;

            // velocity damping
            p.vx *= 0.985;
            p.vy *= 0.985;

            // move
            p.x += p.vx;
            p.y += p.vy;

            // bounce
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // draw particle
            ctx.beginPath();
            ctx.fillStyle = c1;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Lines between nearby particles
        if (!reduceMotion) {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i], b = particles[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const d = dx * dx + dy * dy;
                    if (d < 12000) {
                        ctx.strokeStyle = glow;
                        ctx.globalAlpha = Math.max(0.05, 1 - d / 12000);
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }
        }

        // Cursor pulse
        if (mouse.x > 0 && !reduceMotion) {
            const rad = 30;
            const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, rad);
            grad.addColorStop(0, c2);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, rad, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(step);
    }
    // step() is started in kickoff()
})();

// Update canonical and og:url at runtime to absolute URL (useful on Vercel preview/production)
(function updateCanonicalOg() {
    try {
        const absoluteUrl = window.location.origin + window.location.pathname;
        const canonical = document.getElementById('canonical-link');
        const ogUrl = document.getElementById('og-url');
        if (canonical) canonical.setAttribute('href', absoluteUrl);
        if (ogUrl) ogUrl.setAttribute('content', absoluteUrl);
    } catch (_) {
        // no-op
    }
})();