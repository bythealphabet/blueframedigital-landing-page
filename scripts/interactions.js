/**
 * Micro-interactions and enhanced user experience features
 */

(function() {
    'use strict';

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed header if any
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Enhanced form interactions
    function initFormInteractions() {
        const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
        
        formInputs.forEach(input => {
            // Add floating label effect
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });

            // Check if input has value on load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }

    // Icon animations on service cards
    function initIconAnimations() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            const icon = card.querySelector('.service-icon svg');
            if (!icon) return;

            card.addEventListener('mouseenter', function() {
                icon.style.transform = 'scale(1.15) rotate(5deg)';
            });

            card.addEventListener('mouseleave', function() {
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }

    // Portfolio item interactions
    function initPortfolioInteractions() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // Add ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.5)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s ease-out';
                ripple.style.pointerEvents = 'none';
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Add ripple animation to CSS if not exists
    function addRippleAnimation() {
        if (!document.getElementById('ripple-animation-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Button hover effects enhancement
    function initButtonEffects() {
        const buttons = document.querySelectorAll('.nav-button, .cta-button, .contact-button');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Lazy load images
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Initialize all interactions
    function init() {
        initSmoothScroll();
        initFormInteractions();
        initIconAnimations();
        initPortfolioInteractions();
        initButtonEffects();
        initLazyLoading();
        addRippleAnimation();
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

