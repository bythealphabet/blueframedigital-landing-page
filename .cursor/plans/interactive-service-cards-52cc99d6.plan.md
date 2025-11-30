<!-- 52cc99d6-632e-421f-9030-4ef82cf0c6f7 10a06476-ff5f-441d-9348-a22e8dcd28e5 -->
# Seamless Service Cards Transition

## Overview

Create an immersive, continuous experience where clicking a service card transitions to a detail page that shares the same Services component, creating the illusion of staying on the same page while the layout transforms with beautiful animations.

## User Experience Flow

1. **Home page** - User sees all 6 service cards in grid
2. **Click card** - Navigate to `/services/[slug]`
3. **Initial view** - Same Services grid appears (shared component in layout)
4. **Animation sequence**:

                                                - Selected card: Animates to first grid position using FLIP
                                                - Other cards: Fade out + scale down + translateZ back (3D depth effect) → remove from DOM
                                                - Detail content: Fades in within adjacent grid cells

5. **Mobile**: Selected card shrinks to compact size at top, detail content dominates below

## Technical Architecture

### Layout Structure

```
/services/+layout.svelte
├── Contains Services.svelte component
├── Passes selectedSlug prop from URL
└── Services.svelte renders:
    ├── All cards (if no slug selected)
    └── Or: Selected card + detail content (if slug present)
```

### Animation Strategy

**FLIP Animation** (First, Last, Invert, Play)

- Calculate positions before/after card reordering
- Use `flip` from `svelte/animate` for smooth repositioning

**3D Depth Effect** for non-selected cards

- Combine: `opacity: 0`, `scale(0.5)`, `translateZ(-500px)`
- Creates "zoom into distance" effect
- Then remove from DOM for accessibility

**View Transitions API**

- SvelteKit's `onNavigate` for smooth page transitions
- Maintains visual continuity during route change

## Implementation Steps

### 1. Create Services Layout

**File**: `src/routes/services/+layout.svelte`

- Import Services component
- Get slug from URL params
- Pass selectedSlug to Services component
- Render children (detail content) below Services component

**File**: `src/routes/services/+layout.ts`

- Load service data for validation
- Return slug to layout

### 2. Refactor Services Component

**File**: `src/lib/components/Services.svelte`

- Accept optional `selectedSlug` prop
- Conditionally render based on selected state:
                                - **No selection**: Show all cards in normal grid
                                - **Has selection**: Show selected card first + detail content in grid
- Implement animation logic:
                                - Use `flip` animation for card repositioning
                                - Apply 3D depth effect to non-selected cards
                                - Coordinate timing between card exit and content entry

### 3. Update ServiceCard Component

**File**: `src/lib/components/ServiceCard.svelte`

- Add `isSelected` prop for selected state styling
- Add `isExiting` prop for exit animation
- Add `compact` mode for mobile selected state
- Exit animation: fade + scale + translateZ
- Selected state: subtle highlight/glow effect

### 4. Refactor Service Detail Page

**File**: `src/routes/services/[slug]/+page.svelte`

- Remove Services.svelte import (now in layout)
- Only render detail content
- No back button needed (handled by layout/card click)
- Detail content integrates into Services grid

### 5. Create Detail Content Wrapper

**File**: `src/lib/components/service-details/DetailContentGrid.svelte`

- Wraps detail components
- Fits within Services grid structure
- Handles grid positioning next to selected card
- Fade-in animation when appearing
- Mobile: Full-width below compact card

### 6. Update Service Data

**File**: `src/lib/data/services.ts`

- Keep existing structure (already good)
- Ensure all content ready for grid integration

### 7. Add Animation Coordination

**File**: `src/lib/stores/serviceStore.ts`

- Track animation states
- Coordinate card exit → detail entry timing
- Handle selected card state

### 8. Implement Mobile Responsive Behavior

- Selected card: Compact mode (smaller, less padding)
- Detail content: Full width below card
- Smooth transition between states
- Touch-friendly interactions

### 9. Add Navigation Helper

- Back navigation: Navigate to `/` (returns to home)
- Can add overlay/close button to Services component when selected
- Browser back/forward works naturally

### 10. Polish & Test

- Test all service routes
- Verify animations smooth on various devices
- Test reduced motion preferences
- Verify accessibility (keyboard nav, screen readers)
- Test URL sharing

## Animation Timing

```typescript
// Suggested timing for smooth coordination
1. Navigation starts (0ms)
2. Page loads, Services component mounts (immediate)
3. Selected card identified (0ms)
4. FLIP animation begins (0ms)
   - Calculate positions
   - Non-selected cards start exit (0-300ms)
     * Opacity: 1 → 0
     * Scale: 1 → 0.5
     * TranslateZ: 0 → -500px
   - Selected card repositions (0-400ms)
5. Non-selected cards removed from DOM (300ms)
6. Detail content fades in (400-800ms)
```

## Key Code Patterns

### Services Component with Selection

```svelte
<script>
  import { flip } from 'svelte/animate';
  import { fly, fade, scale } from 'svelte/transition';
  
  let { selectedSlug = null } = $props();
  
  // Filter services based on selection
  $: selectedService = selectedSlug 
    ? services.find(s => s.slug === selectedSlug)
    : null;
  
  $: displayedServices = selectedService 
    ? [selectedService]
    : services;
</script>

<div class="services-grid" class:has-selection={!!selectedService}>
  {#each displayedServices as service (service.slug)}
    <div animate:flip={{ duration: 400 }}>
      <ServiceCard 
        {...service} 
        isSelected={service.slug === selectedSlug}
      />
    </div>
  {/each}
  
  {#if selectedService}
    <!-- Detail content in adjacent grid cells -->
    <DetailContentGrid {selectedService} />
  {/if}
</div>
```

### 3D Exit Animation

```svelte
<script>
  let isExiting = $state(false);
  
  function exitAnimation(node) {
    return {
      duration: 300,
      css: (t) => {
        const eased = quintOut(t);
        return `
          opacity: ${eased};
          transform: 
            perspective(1000px) 
            scale(${1 - (0.5 * (1 - eased))})
            translateZ(${-500 * (1 - eased)}px);
        `;
      }
    };
  }
</script>
```

### Mobile Compact Mode

```svelte
<style>
  .service-card.compact {
    padding: var(--spacing-sm);
    max-width: 100%;
  }
  
  .service-card.compact h3 {
    font-size: var(--font-size-base);
  }
  
  .service-card.compact p {
    display: none; /* Hide description in compact mode */
  }
  
  @media (max-width: 768px) {
    .services-grid.has-selection {
      grid-template-columns: 1fr;
    }
    
    .service-card.selected {
      max-height: 120px;
    }
  }
</style>
```

## Files to Create

1. `src/routes/services/+layout.svelte`
2. `src/routes/services/+layout.ts`
3. `src/lib/components/service-details/DetailContentGrid.svelte`

## Files to Modify

1. `src/lib/components/Services.svelte` - Major refactor for selection mode
2. `src/lib/components/ServiceCard.svelte` - Add selection/exit states
3. `src/routes/services/[slug]/+page.svelte` - Simplify to only detail content
4. `src/lib/stores/serviceStore.ts` - Enhanced animation coordination

## Files to Remove/Deprecate

1. `src/lib/components/service-details/ServiceDetailLayout.svelte` - No longer needed (Services handles layout)

## Benefits of This Approach

✅ **Seamless UX** - Feels like transforming one view, not navigating

✅ **Visual Continuity** - Same component = same look = no jarring changes

✅ **Shareable URLs** - Each service still has unique URL

✅ **Better Performance** - Reuses component instance

✅ **Elegant Code** - Services component handles both states

✅ **Natural Navigation** - Browser back just works

✅ **Accessible** - Cards removed from DOM when hidden

✅ **Mobile Optimized** - Compact mode keeps content primary

### To-dos

- [ ] Create service data structure with slugs and content