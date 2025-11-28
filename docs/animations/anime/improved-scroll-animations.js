/**
 * ENHANCED SCROLL ANIMATIONS
 * Blue Frame Digital
 * 
 * Features:
 * - Intersection Observer for better performance
 * - Smooth scroll progress indicator
 * - Parallax effects
 * - Throttled scroll listeners
 * - Counter animations
 */

// ========================================
// CONFIGURATION
// ========================================

const CONFIG = {
    // Intersection Observer options
    observerOptions: {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger 100px before element enters viewport
        threshold: 0.15 // Trigger when 15% of element is visible
    },
    
    // Animation delays for staggering
    staggerDelay: 100, // milliseconds
    
    // Parallax settings
    parallaxIntensity: 0.3,
    
    // Throttle delay for scroll events
    throttleDelay: 16 // ~60fps
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Throttle function to limit execution rate
 */
function throttle(func, delay) {
    let lastCall = 0;
    let timeoutId = null;
    
    return function(...args) {
        const now = Date.now();
        const timeSinceLastCall = now - lastCall;
        
        if (timeSinceLastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                func.apply(this, args);
            }, delay - timeSinceLastCall);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

/**
 * Animate counter numbers
 */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// ========================================
// INTERSECTION OBSERVER
// ========================================

/**
 * Initialize Intersection Observer for scroll animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (!animatedElements.length) return;
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animated class with slight delay for smooth effect
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, 50);
                
                // Optional: Unobserve after animation (one-time animation)
                // Uncomment the line below if you want animations to trigger only once
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove animated class when element leaves viewport
                // This creates a re-triggering effect when scrolling back
                // Comment out if you want one-time animations
                // entry.target.classList.remove('animated');
            }
        });
    }, CONFIG.observerOptions);
    
    // Observe all elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    return observer;
}

// ========================================
// SCROLL PROGRESS INDICATOR
// ========================================

/**
 * Update scroll progress bar
 */
function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (!scrollProgress) return;
    
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    
    scrollProgress.style.width = `${Math.min(scrolled, 100)}%`;
}

// ========================================
// PARALLAX EFFECTS
// ========================================

/**
 * Initialize parallax effects
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-container');
    
    if (!parallaxElements.length) return;
    
    const handleParallax = throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            if (!isInViewport(element)) return;
            
            const speed = element.dataset.parallaxSpeed || CONFIG.parallaxIntensity;
            const yPos = -(scrolled * speed);
            
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }, CONFIG.throttleDelay);
    
    window.addEventListener('scroll', handleParallax, { passive: true });
    
    // Initial call
    handleParallax();
}

// ========================================
// COUNTER ANIMATIONS
// ========================================

/**
 * Initialize counter animations
 */
function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = parseInt(entry.target.dataset.counter);
                const duration = parseInt(entry.target.dataset.counterDuration) || 2000;
                
                entry.target.classList.add('counted', 'counter-animate');
                animateCounter(entry.target, target, duration);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// ========================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ========================================

/**
 * Initialize smooth scrolling for navigation
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            // Skip if href is just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 80; // Adjust based on your header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// ICON ANIMATIONS
// ========================================

/**
 * Add pulse animation to service icons on hover
 */
function initIconAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const icon = card.querySelector('.service-icon');
        if (!icon) return;
        
        card.addEventListener('mouseenter', () => {
            icon.classList.add('icon-pulse');
        });
        
        card.addEventListener('mouseleave', () => {
            icon.classList.remove('icon-pulse');
        });
    });
}

// ========================================
// FORM ANIMATIONS
// ========================================

/**
 * Add floating label effect to form inputs
 */
function initFormAnimations() {
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    
    formInputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        // Remove focus effect if empty
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Check on page load if input has value
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// ========================================
// HERO SECTION ANIMATIONS
// ========================================

/**
 * Add extra animations to hero section
 */
function initHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Add floating animation to hero background pattern
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('float');
        }, 1000);
    }
}

// ========================================
// CARD HOVER EFFECTS
// ========================================

/**
 * Enhanced card hover effects with mouse tracking
 */
function initCardEffects() {
    const cards = document.querySelectorAll('.service-card, .portfolio-item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ========================================
// PERFORMANCE MONITORING
// ========================================

/**
 * Log performance metrics (development only)
 */
function logPerformance() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Performance:', {
                    'DOM Content Loaded': `${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`,
                    'Load Complete': `${perfData.loadEventEnd - perfData.loadEventStart}ms`,
                    'Total Load Time': `${perfData.loadEventEnd}ms`
                });
            }, 0);
        });
    }
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize all animations
 */
function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAnimations);
    } else {
        initializeAnimations();
    }
}

function initializeAnimations() {
    try {
        // Core animations
        initScrollAnimations();
        updateScrollProgress();
        
        // Enhanced features
        initParallax();
        initCounters();
        initSmoothScroll();
        initIconAnimations();
        initFormAnimations();
        initHeroAnimations();
        initCardEffects();
        
        // Scroll listeners (throttled)
        const throttledScrollHandler = throttle(() => {
            updateScrollProgress();
        }, CONFIG.throttleDelay);
        
        window.addEventListener('scroll', throttledScrollHandler, { passive: true });
        
        // Performance monitoring (development)
        logPerformance();
        
        // Add shimmer effect to cards after initial load
        setTimeout(() => {
            const cards = document.querySelectorAll('.service-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('shimmer-effect');
                }, index * 100);
            });
        }, 1000);
        
        console.log('✨ Animations initialized successfully');
    } catch (error) {
        console.error('Error initializing animations:', error);
    }
}

// ========================================
// EXPORT FOR MODULE USAGE (optional)
// ========================================

// If using ES6 modules, uncomment:
// export { init, initScrollAnimations, initParallax, initCounters };

// Start initialization
init();

// ========================================
// UTILITY FUNCTIONS FOR EXTERNAL USE
// ========================================

/**
 * Manually trigger animation on element
 */
window.triggerAnimation = function(element) {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    
    if (element) {
        element.classList.remove('animated');
        setTimeout(() => {
            element.classList.add('animate-on-scroll', 'animated');
        }, 10);
    }
};

/**
 * Reset all animations
 */
window.resetAnimations = function() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => {
        el.classList.remove('animated');
    });
    
    // Re-initialize
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
};
