<script>
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { quintOut, elasticOut } from 'svelte/easing';
  
  export let title = '';
  export let description = '';
  export let icon = '';
  export let delay = 0;
  
  let visible = false;
  let element;
  let isHovered = false;
  
  // Mouse tracking for 3D tilt effect
  let mouseX = 0;
  let mouseY = 0;
  let rotateX = 0;
  let rotateY = 0;
  
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
    
    observer.observe(element);
    
    return () => observer.disconnect();
  });
  
  function handleMouseMove(e) {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    rotateX = ((y - centerY) / centerY) * 10;
    rotateY = ((centerX - x) / centerX) * 10;
    
    mouseX = x;
    mouseY = y;
  }
  
  function handleMouseLeave() {
    isHovered = false;
    rotateX = 0;
    rotateY = 0;
  }
  
  function handleMouseEnter() {
    isHovered = true;
  }
</script>

<div 
  bind:this={element}
  class="service-card-container"
  style="--delay: {delay}ms"
>
  {#if visible}
    <div 
      class="service-card"
      class:hovered={isHovered}
      on:mousemove={handleMouseMove}
      on:mouseleave={handleMouseLeave}
      on:mouseenter={handleMouseEnter}
      in:fly={{ y: 60, duration: 800, delay, easing: quintOut }}
      style="transform: perspective(1000px) rotateX({rotateX}deg) rotateY({rotateY}deg)"
    >
      <div class="service-icon" class:pulse={isHovered}>
        <i data-lucide={icon} width="48" height="48"></i>
      </div>
      
      <h3 in:fade={{ duration: 600, delay: delay + 200 }}>
        {title}
      </h3>
      
      <p in:fade={{ duration: 600, delay: delay + 400 }}>
        {description}
      </p>
      
      {#if isHovered}
        <div 
          class="spotlight"
          in:scale={{ duration: 300, easing: elasticOut }}
          style="left: {mouseX}px; top: {mouseY}px"
        />
      {/if}
    </div>
  {/if}
</div>

<style>
  .service-card-container {
    perspective: 1000px;
  }
  
  .service-card {
    background: var(--background-card);
    padding: var(--spacing-xl);
    border: 2px solid var(--primary-blue);
    border-radius: var(--radius-sm);
    position: relative;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transform-style: preserve-3d;
    will-change: transform;
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
    box-shadow: 0 20px 60px rgba(37, 99, 235, 0.4);
    transform: translateZ(20px);
  }
  
  .service-card.hovered::before {
    opacity: 0;
  }
  
  .service-icon {
    margin-bottom: var(--spacing-md);
    color: var(--primary-blue-bright);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    transform-style: preserve-3d;
    transform: translateZ(0);
  }
  
  .service-icon.pulse {
    animation: pulse 0.6s ease-in-out;
    color: var(--primary-blue-light);
    filter: drop-shadow(0 0 20px var(--primary-blue-bright));
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: translateZ(0) scale(1);
    }
    50% {
      transform: translateZ(30px) scale(1.2);
    }
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
  }
  
  .spotlight {
    position: absolute;
    width: 200px;
    height: 200px;
    background: radial-gradient(
      circle,
      rgba(96, 165, 250, 0.2) 0%,
      transparent 70%
    );
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 0;
  }
  
  /* Shimmer effect */
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
    transform: translateX(-100%);
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  .service-card.hovered::after {
    transform: translateX(100%);
  }
</style>
