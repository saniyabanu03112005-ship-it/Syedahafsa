/**
 * MAIN JAVASCRIPT - Syeda Hafsa Portfolio
 * Handles Navigation, Scroll Reveals, Modals, Skill Visualizer, and Particle Backgrounds.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollReveal();
    initModals();
    initSkillObserver();
    initParticles();
});

/* ==========================================================================
   NAVIGATION MENU (Responsive Hamburger & Active Links)
   ========================================================================== */
function initNavigation() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // Set Active State based on current filename
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (page === href || (page === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }
    });
}

/* ==========================================================================
   SCROLL REVEAL (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Once it reveals, we don't need to track it anymore
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in full view
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

/* ==========================================================================
   INTERACTIVE SKILLS PROGRESS OBSERVER
   ========================================================================== */
function initSkillObserver() {
    const progressBars = document.querySelectorAll('.skill-progress-bar');
    
    if (progressBars.length === 0) return;

    const skillCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const value = bar.getAttribute('data-progress');
                bar.style.width = value + '%';
                observer.unobserve(bar);
            }
        });
    };

    const skillObserver = new IntersectionObserver(skillCallback, {
        root: null,
        threshold: 0.1
    });

    progressBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

/* ==========================================================================
   MODALS (Resume Digital Viewer & Certificates)
   ========================================================================== */
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.modal-close');
    const resumeBtn = document.querySelector('[data-open-resume]');
    const certButtons = document.querySelectorAll('[data-open-cert]');

    // Open Digital Resume Modal
    if (resumeBtn) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const resumeModal = document.getElementById('resumeModal');
            if (resumeModal) {
                resumeModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock scroll
            }
        });
    }

    // Open Certifications Modal
    certButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const certId = btn.getAttribute('data-open-cert');
            const certName = btn.getAttribute('data-cert-name') || 'Certification';
            const certIssuer = btn.getAttribute('data-cert-issuer') || 'University';
            
            const certModal = document.getElementById('certModal');
            if (certModal) {
                // Populate certificate details
                const titleEl = certModal.querySelector('.modal-title');
                const issuerEl = certModal.querySelector('.modal-issuer');
                const placeholderTitleEl = certModal.querySelector('.cert-placeholder-title');
                
                if (titleEl) titleEl.innerText = certName;
                if (issuerEl) issuerEl.innerText = certIssuer;
                if (placeholderTitleEl) placeholderTitleEl.innerText = certName + " Document";
                
                certModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close Modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modals.forEach(modal => modal.classList.remove('active'));
            document.body.style.overflow = 'auto'; // Unlock scroll
        });
    });

    // Close on click outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => modal.classList.remove('active'));
            document.body.style.overflow = 'auto';
        }
    });
}

/* ==========================================================================
   DYNAMIC BACKGROUND PARTICLES (Subtle Canvas Graphic)
   ========================================================================== */
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-particles-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    
    // Add canvas as the first child of the body
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    const colors = [
        'rgba(139, 92, 246, 0.08)', // Violet
        'rgba(6, 182, 212, 0.08)',  // Cyan
        'rgba(255, 255, 255, 0.03)'  // Soft White
    ];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 4 + 1;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off borders
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        const count = Math.min(Math.floor(canvas.width / 15), 80); // Responsive particle count
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Soft connective lines for nearby particles
        drawLines();

        animationId = requestAnimationFrame(animate);
    }

    function drawLines() {
        const maxDist = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const alpha = (1 - (dist / maxDist)) * 0.05;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Initialize systems
    init();
    animate();

    // Responsive debounce resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            cancelAnimationFrame(animationId);
            init();
            animate();
        }, 200);
    });
}
