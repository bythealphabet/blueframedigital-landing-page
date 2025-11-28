<script>
  import { onMount } from 'svelte';
  import { fade, fly, scale, blur } from 'svelte/transition';
  import { quintOut, elasticOut, backOut } from 'svelte/easing';
  import { Spring, Tween, prefersReducedMotion } from 'svelte/motion';
  
  // NEW SVELTE 5: Using reactive state with $state
  let scrollY = $state(0);
  let heroVisible = $state(false);
  let servicesVisible = $state(false);
  let aboutVisible = $state(false);
  let contactVisible = $state(false);
  
  // NEW SVELTE 5: Spring for scroll progress (smoother than before!)
  const scrollProgress = new Spring(0, {
    stiffness: 0.1,
    damping: 0.5
  });
  
  // NEW SVELTE 5: Spring for parallax (buttery smooth)
  const parallaxOffset = new Spring(0, {
    stiffness: 0.05,
    damping: 0.4
  });
  
  // NEW SVELTE 5: Tween for counter with custom easing
  const projectCounter = new Tween(0, {
    duration: 2500,
    easing: quintOut
  });
  
  // NEW SVELTE 5: Spring for back-to-top button scale
  const backToTopScale = new Spring(0, {
    stiffness: 0.2,
    damping: 0.6
  });
  
  // Services data
  const services = [
    {
      icon: 'globe',
      title: 'Professional Websites',
      description: 'Showcase your construction projects with a modern, professional website that builds trust with potential clients.'
    },
    {
      icon: 'image',
      title: 'Project Galleries',
      description: 'Display your completed projects with beautiful photo galleries that highlight your craftsmanship and expertise.'
    },
    {
      icon: 'phone',
      title: 'Lead Generation',
      description: 'Convert website visitors into clients with contact forms, quote requests, and clear calls-to-action.'
    },
    {
      icon: 'smartphone',
      title: 'Mobile-Friendly Design',
      description: 'Your clients browse on their phones. Your website will look perfect on all devices.'
    },
    {
      icon: 'search',
      title: 'Local SEO',
      description: 'Get found by local customers searching for construction services in Curaçao.'
    },
    {
      icon: 'headphones',
      title: 'Ongoing Support',
      description: 'We maintain and update your website so you can focus on building.'
    }
  ];
  
  // Form state
  let formData = $state({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  let formSubmitting = $state(false);
  let formMessage = $state('');
  let formSuccess = $state(false);
  
  // NEW SVELTE 5: Derived state for scroll position
  let showBackToTop = $derived(scrollY > 300);
  
  // NEW SVELTE 5: Check if animations should be reduced
  const shouldAnimate = $derived(!prefersReducedMotion.current);
  
  // Lifecycle and effects
  onMount(() => {
    heroVisible = true;
    
    // Update springs on scroll
    const handleScroll = () => {
      scrollY = window.scrollY;
      
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollY / windowHeight) * 100;
      
      // Update spring targets
      scrollProgress.target = progress;
      parallaxOffset.target = scrollY * 0.3;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Counter animation observer
    const counterObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          projectCounter.target = 150;
        }
      },
      { threshold: 0.5 }
    );
    
    const counterElement = document.querySelector('.trust-number');
    if (counterElement) {
      counterObserver.observe(counterElement);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      counterObserver.disconnect();
    };
  });
  
  // Watch showBackToTop and update spring
  $effect(() => {
    backToTopScale.target = showBackToTop ? 1 : 0;
  });
  
  // Handlers
  async function handleSubmit() {
    formSubmitting = true;
    formMessage = '';
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        formSuccess = true;
        formMessage = 'Thank you! Your message has been sent successfully.';
        formData = { name: '', email: '', phone: '', message: '' };
      } else {
        formSuccess = false;
        formMessage = 'Something went wrong. Please try again.';
      }
    } catch (error) {
      formSuccess = false;
      formMessage = 'Network error. Please try again later.';
    } finally {
      formSubmitting = false;
    }
  }
  
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<svelte:window bind:scrollY />

<!-- NEW SVELTE 5: Spring-based scroll progress (super smooth!) -->
<div 
  class="scroll-progress" 
  style="width: {scrollProgress.current}%"
/>

<!-- Hero Section with Spring-based parallax -->
<section 
  class="hero" 
  style="transform: translateY({parallaxOffset.current}px)"
>
  <div class="hero-content">
    {#if heroVisible}
      <h1 
        class="logo hero-headline" 
        transition:fly={{ 
          y: shouldAnimate ? 50 : 0, 
          duration: 1000, 
          delay: 200, 
          easing: quintOut 
        }}
      >
        Blue<span>Frame</span> Digital
      </h1>
      
      <p 
        class="tagline hero-subheadline"
        transition:fly={{ 
          y: shouldAnimate ? 30 : 0, 
          duration: 800, 
          delay: 500, 
          easing: quintOut 
        }}
      >
        Professional Websites for Construction Businesses in Curaçao
      </p>
      
      <div class="hero-nav">
        <a 
          href="#services" 
          class="nav-button"
          transition:fly={{ 
            y: shouldAnimate ? 20 : 0, 
            duration: 600, 
            delay: 700, 
            easing: backOut 
          }}
        >
          Our Services
        </a>
        <a 
          href="#about" 
          class="nav-button"
          transition:fly={{ 
            y: shouldAnimate ? 20 : 0, 
            duration: 600, 
            delay: 850, 
            easing: backOut 
          }}
        >
          Why Choose Us
        </a>
        <a 
          href="#contact" 
          class="nav-button primary hero-cta"
          transition:scale={{ 
            duration: 800, 
            delay: 1000, 
            easing: elasticOut, 
            start: shouldAnimate ? 0.3 : 1 
          }}
        >
          Get Started
        </a>
      </div>
    {/if}
  </div>
</section>

<!-- Services Section -->
<section class="services" id="services">
  <div class="container">
    <h2 
      class="section-title"
      use:intersectionObserver={{ callback: () => servicesVisible = true }}
    >
      {#if servicesVisible}
        <span transition:fly={{ 
          y: shouldAnimate ? 30 : 0, 
          duration: 800, 
          easing: quintOut 
        }}>
          What We Do
        </span>
      {/if}
    </h2>
    
    <div class="services-grid">
      {#each services as service, i}
        {#if servicesVisible}
          <div
            transition:fly={{ 
              y: shouldAnimate ? 60 : 0, 
              duration: 800, 
              delay: i * 150, 
              easing: quintOut 
            }}
          >
            <div class="service-card">
              <div class="service-icon">
                <i data-lucide={service.icon} width="48" height="48"></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</section>

<!-- Stats Section with NEW SVELTE 5 Tween counter -->
<section class="trust-section">
  <div class="container">
    <div class="trust-grid">
      <div class="trust-item">
        <div class="trust-number">
          {Math.round(projectCounter.current)}+
        </div>
        <div class="trust-label">Projects Completed</div>
      </div>
    </div>
  </div>
</section>

<!-- About Section -->
<section class="about" id="about">
  <div class="container">
    <h2 
      class="section-title"
      use:intersectionObserver={{ callback: () => aboutVisible = true }}
    >
      {#if aboutVisible}
        <span transition:fade={{ duration: 800 }}>
          Why Construction Businesses Choose Us
        </span>
      {/if}
    </h2>
    
    <div class="about-content">
      {#if aboutVisible}
        <p transition:fly={{ 
          x: shouldAnimate ? -60 : 0, 
          duration: 800, 
          delay: 200, 
          easing: quintOut 
        }}>
          We understand your world because we've lived it. With a decade of hands-on 
          experience in construction—from swinging hammers as a carpenter to reading 
          blueprints as a drafter, managing crews as a foreman, and running projects 
          as a contractor—we know the challenges you face every day.
        </p>
        
        <p transition:fly={{ 
          x: shouldAnimate ? 60 : 0, 
          duration: 800, 
          delay: 400, 
          easing: quintOut 
        }}>
          For the past 8+ years, we've applied that same dedication to mastering web 
          development. This unique combination means we don't just build websites—we 
          build digital tools that speak your language and solve your real business problems.
        </p>
      {/if}
    </div>
  </div>
</section>

<!-- Contact Section -->
<section class="contact" id="contact">
  <div class="container">
    <h2 use:intersectionObserver={{ callback: () => contactVisible = true }}>
      {#if contactVisible}
        <span transition:fade={{ duration: 800 }}>
          Ready to Grow Your Construction Business?
        </span>
      {/if}
    </h2>
    
    {#if contactVisible}
      <p transition:fade={{ duration: 600, delay: 200 }}>
        Let's build a website that showcases your work and brings in more clients.
      </p>
      
      <form 
        onsubmit={handleSubmit}
        class="contact-form"
        transition:scale={{ 
          duration: 800, 
          delay: 400, 
          easing: elasticOut, 
          start: shouldAnimate ? 0.8 : 1 
        }}
      >
        <div class="form-group">
          <input
            type="text"
            bind:value={formData.name}
            placeholder="Your Name"
            required
          />
        </div>
        
        <div class="form-group">
          <input
            type="email"
            bind:value={formData.email}
            placeholder="Your Email"
            required
          />
        </div>
        
        <div class="form-group">
          <input
            type="tel"
            bind:value={formData.phone}
            placeholder="Your Phone (optional)"
          />
        </div>
        
        <div class="form-group">
          <textarea
            bind:value={formData.message}
            rows="5"
            placeholder="Tell us about your project..."
            required
          />
        </div>
        
        <button type="submit" class="contact-button" disabled={formSubmitting}>
          {formSubmitting ? 'Sending...' : 'Send Message'}
        </button>
        
        {#if formMessage}
          <div 
            class="form-message" 
            class:success={formSuccess}
            class:error={!formSuccess}
            transition:fly={{ y: 10, duration: 400 }}
          >
            {formMessage}
          </div>
        {/if}
      </form>
    {/if}
  </div>
</section>

<!-- Footer -->
<footer>
  <p>&copy; 2024 Blue Frame Digital. All rights reserved.</p>
</footer>

<!-- NEW SVELTE 5: Spring-based back to top button (smooth scale) -->
{#if backToTopScale.current > 0.01}
  <button
    class="back-to-top"
    onclick={scrollToTop}
    style="transform: scale({backToTopScale.current}); opacity: {backToTopScale.current}"
    aria-label="Back to top"
  >
    <i data-lucide="arrow-up" width="24" height="24"></i>
  </button>
{/if}

<style>
  /* Your existing styles stay the same */
  @import '../styles/variables.css';
  
  /* Scroll progress with smooth spring animation */
  .scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      var(--primary-blue), 
      var(--primary-blue-light),
      var(--primary-blue-bright)
    );
    z-index: 9999;
    will-change: width;
  }
  
  /* Hero section */
  .hero {
    min-height: 100vh;
    background: var(--background-dark-alt);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--spacing-lg);
    position: relative;
    overflow: hidden;
    border-bottom: 2px solid var(--primary-blue);
    will-change: transform;
  }
  
  /* Service card improvements */
  .service-card {
    background: var(--background-card);
    padding: var(--spacing-xl);
    border: 2px solid var(--primary-blue);
    border-radius: var(--radius-sm);
    transition: all 0.3s ease;
    height: 100%;
  }
  
  .service-card:hover {
    border-color: var(--primary-blue-light);
    box-shadow: 0 20px 60px rgba(37, 99, 235, 0.3);
    transform: translateY(-8px);
  }
  
  /* Trust section */
  .trust-number {
    font-size: 3rem;
    font-weight: 700;
    color: var(--primary-blue-bright);
    margin-bottom: var(--spacing-sm);
    text-shadow: 0 0 20px rgba(96, 165, 250, 0.5);
  }
  
  /* Back to top with spring animation */
  .back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background: var(--primary-blue);
    color: var(--text-primary);
    border: 2px solid var(--primary-blue);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px rgba(30, 58, 138, 0.4);
    transition: background 0.3s ease;
    z-index: 1000;
    will-change: transform, opacity;
  }
  
  .back-to-top:hover {
    background: var(--primary-blue-light);
    box-shadow: 0 0 30px rgba(37, 99, 235, 0.6);
  }
</style>

<!-- Custom Svelte Action for Intersection Observer -->
{#snippet intersectionObserver(node, { callback, options = {} })}
  {@const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px',
      ...options
    }
  )}
  {observer.observe(node)}
  {() => observer.disconnect()}
{/snippet}
