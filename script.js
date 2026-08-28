document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Navbar scroll effect with smooth transition ──
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // ── 2. Mobile menu toggle ──
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // ── 3. Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ── 4. Scroll reveal with staggered timing ──
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ── 5. Smooth parallax with requestAnimationFrame ──
    const parallaxElements = document.querySelectorAll('[data-speed]');
    let ticking = false;
    
    function updateParallax() {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.speed);
            const parent = el.parentElement;
            const rect = parent.getBoundingClientRect();
            
            // Only transform when in or near the viewport
            if (rect.bottom > -vh * 0.5 && rect.top < vh * 1.5) {
                // Calculate how far through the viewport this element is
                const center = rect.top + rect.height / 2;
                const offset = (center - vh / 2) * speed;
                el.style.transform = `translate3d(0, ${offset}px, 0)`;
            }
        });
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
    
    // Initial call
    updateParallax();

    // ── 6. Animated stat counters with smooth easing ──
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2200;
                const start = performance.now();
                
                function animate(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease out quart for smoother deceleration
                    const eased = 1 - Math.pow(1 - progress, 4);
                    const current = Math.round(eased * target);
                    
                    el.textContent = current.toLocaleString('es-ES');
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                }
                
                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // ── 7. Image progressive reveal on showcase items ──
    const showcaseImages = document.querySelectorAll('.showcase-img img, .facility-mini img');
    
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
                imgObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    showcaseImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transform = 'scale(1.08)';
        img.style.transition = 'opacity 1.2s ease, transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
        imgObserver.observe(img);
    });

});

// ── 8. Booking Modal Logic (Global Scope) ──
function openBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        // Reset to step 1 when opening
        nextStep(1);
    }
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function nextStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show target step
    const targetStep = document.getElementById('step-' + stepNumber);
    if (targetStep) {
        targetStep.classList.add('active');
    }
    
    // Update progress bar
    document.querySelectorAll('.progress-step').forEach(step => {
        const num = parseInt(step.dataset.step);
        if (num === stepNumber) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else if (num < stepNumber) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Update progress lines
    document.querySelectorAll('.progress-line').forEach((line, index) => {
        if (index < stepNumber - 1) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
}

/* ════════════════════════════
   CAROUSEL LOGIC
   ════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('facilityCarousel');
    if (!track) return;

    const items = Array.from(track.children);
    const dotsContainer = document.getElementById('carouselDots');
    let currentIndex = 0;

    // Create dots
    items.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            moveToIndex(idx);
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function updateDots(index) {
        dots.forEach(d => d.classList.remove('active'));
        if(dots[index]) dots[index].classList.add('active');
    }

    function moveToIndex(index) {
        if (index < 0) index = items.length - 1;
        if (index >= items.length) index = 0;
        
        currentIndex = index;
        const itemWidth = items[0].getBoundingClientRect().width;
        
        // Scroll smoothly to the item
        track.scrollTo({
            left: itemWidth * index,
            behavior: 'smooth'
        });
        
        updateDots(currentIndex);
    }

    window.moveCarousel = (direction) => {
        moveToIndex(currentIndex + direction);
    };

    // Update active dot on manual scroll
    track.addEventListener('scroll', () => {
        const itemWidth = items[0].getBoundingClientRect().width;
        const scrollPosition = track.scrollLeft;
        const index = Math.round(scrollPosition / itemWidth);
        if(index !== currentIndex) {
            currentIndex = index;
            updateDots(currentIndex);
        }
    });
});
