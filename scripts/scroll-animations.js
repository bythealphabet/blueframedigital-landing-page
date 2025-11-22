/**
 * Scroll Animation Handler using Intersection Observer
 * Handles all scroll-triggered animations with performance optimization
 */

(function() {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll Progress Indicator
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        function updateProgress() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            progressBar.style.width = scrollPercent + '%';
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // Intersection Observer for scroll animations
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        if (animatedElements.length === 0) return;

        // Fallback for browsers without Intersection Observer
        if (!('IntersectionObserver' in window)) {
            animatedElements.forEach(element => {
                element.classList.add('animated');
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -15% 0px', // Trigger when 15% of element is visible
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Optional: Unobserve after animation to improve performance
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Counter Animation for Trust Section
    function animateCounter(element, target, duration = 2000) {
        if (prefersReducedMotion) {
            element.textContent = target;
            return;
        }

        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        if (counters.length === 0) return;

        // Fallback for browsers without Intersection Observer
        if (!('IntersectionObserver' in window)) {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                counter.textContent = target;
            });
            return;
        }
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted', 'counter-animate');
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    animateCounter(entry.target, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Parallax Effect (subtle, only on desktop)
    function initParallax() {
        if (prefersReducedMotion || window.innerWidth < 768) return;

        const parallaxElements = document.querySelectorAll('.parallax');
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * 0.1; // 10% movement
                element.style.transform = `translateY(${rate}px)`;
            });
        }

        window.addEventListener('scroll', updateParallax, { passive: true });
    }

    // Initialize all scroll features
    function init() {
        initScrollProgress();
        initScrollAnimations();
        initCounters();
        initParallax();
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

