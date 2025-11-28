<script>
  import { onMount } from 'svelte';
  import { fade, fly, scale, blur } from 'svelte/transition';
  import { quintOut, elasticOut, backOut } from 'svelte/easing';
  import { spring, tweened } from 'svelte/motion';
  
  // Components (you would create these separately)
  // import ServiceCard from '$lib/components/ServiceCard.svelte';
  // import ScrollProgress from '$lib/components/ScrollProgress.svelte';
  
  // Store for scroll position
  let scrollY = 0;
  let scrollProgress = 0;
  
  // Animation visibility states
  let heroVisible = false;
  let servicesVisible = false;
  let aboutVisible = false;
  let contactVisible = false;
  
  // Parallax offset
  const parallaxOffset = spring(0, {
    stiffness: 0.05,
    damping: 0.5
  });
  
  // Counter animation
  const projectCounter = tweened(0, {
    duration: 2000,
    easing: quintOut
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
  let formData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };
  
  let formSubmitting = false;
  let formMessage = '';
  let formSuccess = false;
  
  // Lifecycle
  onMount(() => {
    heroVisible = true;
    
    // Animate project counter when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          projectCounter.set(150);
        }
      },
      { threshold: 0.5 }
    );
    
    // Set up parallax
    const unsubscribe = () => {
      window.removeEventListener('scroll', handleScroll);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return unsubscribe;
  });
  
  // Handlers
  function handleScroll() {
    scrollY = window.scrollY;
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = (scrollY / windowHeight) * 100;
    
    // Update parallax
    parallaxOffset.set(scrollY * 0.3);
  }
  
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

<!-- Scroll Progress Indicator -->
<div class="scroll-progress" style="width: {scrollProgress}%" />

<!-- Hero Section -->
<section class="hero" style="transform: translateY({$parallaxOffset}px)">
  <div class="hero-content">
    {#if heroVisible}
      <h1 
        class="logo hero-headline" 
        in:fly={{ y: 50, duration: 1000, delay: 200, easing: quintOut }}
      >
        Blue<span>Frame</span> Digital
      </h1>
      
      <p 
        class="tagline hero-subheadline"
        in:fly={{ y: 30, duration: 800, delay: 500, easing: quintOut }}
      >
        Professional Websites for Construction Businesses in Curaçao
      </p>
      
      <div class="hero-nav">
        <a 
          href="#services" 
          class="nav-button"
          in:fly={{ y: 20, duration: 600, delay: 700, easing: backOut }}
        >
          Our Services
        </a>
        <a 
          href="#about" 
          class="nav-button"
          in:fly={{ y: 20, duration: 600, delay: 850, easing: backOut }}
        >
          Why Choose Us
        </a>
        <a 
          href="#contact" 
          class="nav-button primary hero-cta"
          in:scale={{ duration: 800, delay: 1000, easing: elasticOut, start: 0.3 }}
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
      class:visible={servicesVisible}
      use:intersectionObserver={{ callback: () => servicesVisible = true }}
    >
      {#if servicesVisible}
        <span in:fly={{ y: 30, duration: 800, easing: quintOut }}>
          What We Do
        </span>
      {/if}
    </h2>
    
    <div class="services-grid">
      {#each services as service, i}
        {#if servicesVisible}
          <div
            in:fly={{ 
              y: 60, 
              duration: 800, 
              delay: i * 150, 
              easing: quintOut 
            }}
          >
            <!-- Use ServiceCard component here -->
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

<!-- Stats Section with Counter -->
<section class="trust-section">
  <div class="container">
    <div class="trust-grid">
      <div class="trust-item">
        <div class="trust-number">
          {Math.round($projectCounter)}+
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
        <span in:fade={{ duration: 800 }}>
          Why Construction Businesses Choose Us
        </span>
      {/if}
    </h2>
    
    <div class="about-content">
      {#if aboutVisible}
        <p in:fly={{ x: -60, duration: 800, delay: 200, easing: quintOut }}>
          We understand your world because we've lived it. With a decade of hands-on 
          experience in construction—from swinging hammers as a carpenter to reading 
          blueprints as a drafter, managing crews as a foreman, and running projects 
          as a contractor—we know the challenges you face every day.
        </p>
        
        <p in:fly={{ x: 60, duration: 800, delay: 400, easing: quintOut }}>
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
        <span in:fade={{ duration: 800 }}>
          Ready to Grow Your Construction Business?
        </span>
      {/if}
    </h2>
    
    {#if contactVisible}
      <p in:fade={{ duration: 600, delay: 200 }}>
        Let's build a website that showcases your work and brings in more clients.
      </p>
      
      <form 
        on:submit|preventDefault={handleSubmit}
        class="contact-form"
        in:scale={{ duration: 800, delay: 400, easing: elasticOut, start: 0.8 }}
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
            in:fly={{ y: 10, duration: 400 }}
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

<!-- Back to Top Button -->
{#if scrollY > 300}
  <button
    class="back-to-top"
    on:click={scrollToTop}
    in:scale={{ duration: 400, easing: elasticOut }}
    out:scale={{ duration: 300 }}
    aria-label="Back to top"
  >
    <i data-lucide="arrow-up" width="24" height="24"></i>
  </button>
{/if}

<style>
  /* Import your existing styles or include them here */
  @import '../styles/variables.css';
  
  /* Additional Svelte-specific styles */
  .visible {
    opacity: 1;
  }
  
  /* Scroll progress bar */
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
    transition: width 0.1s ease-out;
  }
  
  /* Form message animations */
  .form-message {
    margin-top: var(--spacing-md);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    text-align: center;
    font-weight: 600;
  }
  
  .form-message.success {
    background: rgba(34, 197, 94, 0.1);
    border: 2px solid #22c55e;
    color: #22c55e;
  }
  
  .form-message.error {
    background: rgba(239, 68, 68, 0.1);
    border: 2px solid #ef4444;
    color: #ef4444;
  }
  
  /* Back to top button */
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
    transition: all 0.3s ease;
    z-index: 1000;
  }
  
  .back-to-top:hover {
    background: var(--primary-blue-light);
    transform: translateY(-3px) scale(1.1);
    box-shadow: 0 0 30px rgba(37, 99, 235, 0.6);
  }
</style>

<!-- Custom Svelte Action for Intersection Observer -->
<script context="module">
  export function intersectionObserver(node, { callback, options = {} }) {
    const observer = new IntersectionObserver(
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
    );
    
    observer.observe(node);
    
    return {
      destroy() {
        observer.disconnect();
      }
    };
  }
</script>
