<script>
  import { onMount } from 'svelte';
  import { fly, scale } from 'svelte/transition';
  import { quintOut, elasticOut } from 'svelte/easing';
  import { Spring, Tween, prefersReducedMotion } from 'svelte/motion';
  
  let { title = '', description = '', icon = '', delay = 0 } = $props();
  
  let visible = $state(false);
  let element = $state();
  let isHovered = $state(false);
  
  // NEW SVELTE 5: Spring for smooth 3D rotations
  const rotationSpring = new Spring({ x: 0, y: 0 }, {
    stiffness: 0.1,
    damping: 0.4,
    precision: 0.01
  });
  
  // NEW SVELTE 5: Tween for smooth icon scale
  const iconScale = new Tween(1, {
    duration: 400,
    easing: elasticOut
  });
  
  // NEW SVELTE 5: Spring for spotlight position
  const spotlightPos = new Spring({ x: 0, y: 0 }, {
    stiffness: 0.15,
    damping: 0.6
  });
  
  // NEW SVELTE 5: Tween for glow intensity
  const glowIntensity = new Tween(0, {
    duration: 300,
    easing: quintOut
  });
  
  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  });
  
  function handleMouseMove(e) {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Update spring targets - they'll animate smoothly
    rotationSpring.target = {
      x: ((y - centerY) / centerY) * 10,
      y: ((centerX - x) / centerX) * 10
    };
    
    spotlightPos.target = { x, y };
  }
  
  function handleMouseEnter() {
    isHovered = true;
    iconScale.target = 1.2;
    glowIntensity.target = 1;
  }
  
  function handleMouseLeave() {
    isHovered = false;
    rotationSpring.target = { x: 0, y: 0 };
    iconScale.target = 1;
    glowIntensity.target = 0;
  }
  
  // Respect reduced motion preference
  const shouldAnimate = !prefersReducedMotion.current;
</script>

<div bind:this={element} class="service-card-container">
  {#if visible}
    <div 
      class="service-card"
      class:hovered={isHovered}
      onmousemove={handleMouseMove}
      onmouseenter={handleMouseEnter}
      onmouseleave={handleMouseLeave}
      transition:fly={{ 
        y: shouldAnimate ? 60 : 0, 
        duration: 800, 
        delay, 
        easing: quintOut 
      }}
      style="
        transform: perspective(1000px) 
                   rotateX({rotationSpring.current.x}deg) 
                   rotateY({rotationSpring.current.y}deg);
        --glow-intensity: {glowIntensity.current};
      "
    >
      <!-- Icon with spring-based scale animation -->
      <div 
        class="service-icon" 
        style="transform: scale({iconScale.current});"
      >
        <i data-lucide={icon} width="48" height="48"></i>
      </div>
      
      <h3 transition:fly={{ y: 20, duration: 600, delay: delay + 200 }}>
        {title}
      </h3>
      
      <p transition:fly={{ y: 20, duration: 600, delay: delay + 400 }}>
        {description}
      </p>
      
      <!-- Spotlight with spring-based position -->
      {#if isHovered}
        <div 
          class="spotlight"
          transition:scale={{ duration: 300, easing: elasticOut }}
          style="
            left: {spotlightPos.current.x}px; 
            top: {spotlightPos.current.y}px;
            opacity: {glowIntensity.current * 0.6};
          "
        />
      {/if}
      
      <!-- Animated glow effect -->
      <div 
        class="card-glow"
        style="opacity: {glowIntensity.current * 0.3};"
      />
    </div>
  {/if}
</div>

<style>
  .service-card-container {
    perspective: 1000px;
    height: 100%;
  }
  
  .service-card {
    background: var(--background-card);
    padding: var(--spacing-xl);
    border: 2px solid var(--primary-blue);
    border-radius: var(--radius-sm);
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    transform-style: preserve-3d;
    will-change: transform;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .service-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(30, 58, 138, 0.03) 10px,
      rgba(30, 58, 138, 0.03) 20px
    );
    pointer-events: none;
    opacity: 1;
    transition: opacity 0.3s ease;
  }
  
  .service-card.hovered {
    border-color: var(--primary-blue-light);
    box-shadow: 
      0 20px 60px rgba(37, 99, 235, calc(0.2 + var(--glow-intensity) * 0.2)),
      0 0 40px rgba(96, 165, 250, calc(var(--glow-intensity) * 0.3));
  }
  
  .service-card.hovered::before {
    opacity: 0;
  }
  
  .service-icon {
    margin-bottom: var(--spacing-md);
    color: var(--primary-blue-bright);
    transition: color 0.3s ease;
    transform-style: preserve-3d;
    transform-origin: center;
    filter: drop-shadow(0 0 calc(10px * var(--glow-intensity, 0)) var(--primary-blue-bright));
  }
  
  .service-card.hovered .service-icon {
    color: var(--primary-blue-light);
  }
  
  h3 {
    font-size: var(--font-size-h3);
    margin-bottom: var(--spacing-md);
    color: var(--text-secondary);
    transform: translateZ(10px);
  }
  
  p {
    color: var(--text-tertiary);
    line-height: var(--line-height-relaxed);
    transform: translateZ(5px);
    flex-grow: 1;
  }
  
  .spotlight {
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(
      circle,
      rgba(96, 165, 250, 0.4) 0%,
      rgba(96, 165, 250, 0.2) 30%,
      transparent 60%
    );
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 1;
    will-change: left, top;
  }
  
  .card-glow {
    position: absolute;
    inset: -20px;
    background: radial-gradient(
      circle at center,
      rgba(96, 165, 250, 0.3),
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
    filter: blur(20px);
    transition: opacity 0.3s ease;
  }
  
  /* Shimmer effect on hover */
  .service-card::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(96, 165, 250, 0.1),
      transparent
    );
    transform: translateX(-100%) rotate(45deg);
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  .service-card.hovered::after {
    transform: translateX(100%) rotate(45deg);
  }
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    .spotlight,
    .card-glow {
      display: none;
    }
    
    .service-card {
      transform: none !important;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .service-card,
    .service-icon,
    .spotlight,
    .card-glow {
      transition: none !important;
      animation: none !important;
    }
  }
</style>
