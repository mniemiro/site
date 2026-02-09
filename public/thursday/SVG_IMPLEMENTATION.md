# SVG Implementation (Archived)

This document preserves the original SVG-based morphing animation implementation for reference.

## Why We Switched to WebGL

The SVG implementation worked well for moderate displacement values, but at the extreme parameters needed for the desired visual effect (displacement=500, frequency=0.001), WebGL provided significantly smoother performance.

## Original SVG Approach

### Filter Definition

```html
<filter id="morphFilterCurl" x="-50%" y="-50%" width="200%" height="200%">
  <feTurbulence
    type="fractalNoise"
    baseFrequency="0.001"
    numOctaves="1"
    seed="42"
    result="turbulence"
  />
  <feDisplacementMap
    in="SourceGraphic"
    in2="turbulence"
    scale="500"
    xChannelSelector="R"
    yChannelSelector="G"
  />
</filter>
```

### Key Components

**feTurbulence:**
- Generated fractal noise using Perlin-like algorithm
- `baseFrequency`: 0.001 (very low = large spatial features)
- `numOctaves`: 1 (smooth, no extra detail layers)
- `type`: fractalNoise (smoother than turbulence type)

**feDisplacementMap:**
- Displaced pixels based on turbulence texture
- R channel → X displacement
- G channel → Y displacement
- Scale: 500 (extreme displacement for dramatic effect)

### JavaScript Animation Logic

```javascript
// Calculate displacement curve (parabolic, 0 at start/end)
const peak = 0.2; // Peaks at 20% scroll
let displacementCurve;

if (progress <= peak) {
  displacementCurve = Math.pow(progress / peak, 2);
} else {
  displacementCurve = Math.pow((1 - progress) / (1 - peak), 2);
}

const currentDisplacementScale = 500 * displacementCurve;

// Update filter
feDisplacementMap.setAttribute('scale', currentDisplacementScale);

// Apply to morphing shape
if (currentDisplacementScale > 10) {
  morphingShape.setAttribute('filter', 'url(#morphFilterCurl)');
} else {
  morphingShape.removeAttribute('filter'); // Avoid artifacts at low displacement
}
```

### Advantages of SVG Approach

1. **Native browser primitive** - Highly optimized by browser vendors
2. **Zero JavaScript during animation** (after setup) - Filter runs entirely in GPU
3. **Simple implementation** - Just XML + minimal JS
4. **Excellent browser support** - Works everywhere
5. **Easy to adjust** - Change attributes, see results immediately

### Limitations at Extreme Parameters

1. **Filter region clipping** - Large displacements (500) push pixels outside filter bounds
2. **Performance degradation** - SVG filters not optimized for extreme values
3. **Rendering artifacts** - Browser safety constraints cause issues at boundaries
4. **Limited control** - Can't customize the noise generation algorithm

### Complex Effects Attempted

We also experimented with a "curl" effect to create more directional flow:

```html
<feColorMatrix
  in="turbulence"
  type="matrix"
  values="1 0 0 0 0
          0 0 1 0 0
          0 1 0 0 0
          0 0 0 1 0"
  result="rotatedNoise"
/>
```

This created a 90° phase shift between X and Y displacement channels, producing swirling patterns. However, it caused additional rendering instability at extreme displacement values.

### Optimizations Tried

1. **DOM query caching** - Store filter element references
2. **requestAnimationFrame throttling** - Cap updates at 60fps
3. **Conditional filter application** - Disable when displacement < 10
4. **Filter region expansion** - Extended to 200% to accommodate displacement

## When to Use SVG vs WebGL

**Use SVG when:**
- Moderate displacement values (< 100)
- Standard browser-optimized effects desired
- Simplicity and maintainability are priorities
- Need maximum compatibility

**Use WebGL when:**
- Extreme displacement values needed
- Custom noise/displacement functions required
- Maximum performance is critical
- Willing to handle more complexity

## Recreation Instructions

To recreate the SVG implementation:

1. Add the filter definition to SVG `<defs>`
2. Create a `<rect>` with `id="morphingShape"`
3. Animate rect position, size, and filter scale based on scroll
4. Use parabolic curve for displacement to ensure 0 at start/end
5. Disable filter when scale < 10 to avoid artifacts

See git history for complete working implementation.

