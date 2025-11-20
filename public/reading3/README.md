# Reading3 - Morphing Box Animation

## Overview

This directory contains a WebGL-based scroll-driven morphing animation where a black square (6% of viewport width) in the bottom-right quadrant organically expands to cover the entire screen with dramatic displacement effects. As the box morphs, reading seminar content appears and scales within it.

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling for all elements
- `morphing-animation.js` - Animation orchestration and timing
- `webgl-morph.js` - WebGL renderer with displacement shaders
- `data/` - Data directory for seminar content
- `SVG_IMPLEMENTATION.md` - Documentation of previous SVG approach

## How It Works

### Animation Sequence

1. **Initial State**: Perfect black square (6vw) positioned at 75% from left/top (bottom-right quadrant), no distortion
2. **0-20% Progress**: Black box grows and distorts dramatically, reaching peak distortion at 20%
3. **20-50% Progress**: Distortion reduces while box continues expanding
4. **50-100% Progress**: Seminar content appears and scales (30% → 100%) while box reaches full screen
5. **End State**: Full black background (perfect rectangle) with seminar content at 100% scale, no distortion

### Technical Implementation

**WebGL Rendering**:
- Custom fragment shader applies displacement based on procedural noise
- Displacement scale: 500 (very high for dramatic effect)
- Noise frequency: 0.001 (very low = 1-4 large "humps" across screen)
- Parabolic displacement curve ensures 0 at start/end, peaks at 20%
- Direct GPU rendering provides smooth performance at extreme displacement values

**JavaScript**:
- Tracks scroll progress (0-1) over 1 screen height
- Updates WebGL uniforms for position, size, and displacement
- requestAnimationFrame throttling for 60fps performance
- Controls content opacity and scaling

## Adjustable Parameters

### In `morphing-animation.js`

```javascript
const params = {
  displacementScale: 500,  // How far pixels displace (higher = more dramatic)
  baseFrequency: 0.001,    // Noise frequency (lower = larger humps)
  numOctaves: 1,           // Noise detail layers (1 = smoothest)
  distortionPeak: 0.2      // When displacement peaks (0-1)
};

const SCREENS_TO_END = 1;        // Screen heights for full animation
const APPEAR_THRESHOLD = 0.5;     // When seminar content appears (50%)
```

### In `webgl-morph.js`

Noise generation in `setupNoiseTexture()`:
```javascript
const size = 512;  // Noise texture resolution
// Adjust noise formula for different hump patterns
```

Shader displacement calculation:
```javascript
vec2 displace = (noise.rg - 0.5) * 2.0 * u_displacement;
```

## Customizing Content

Edit the seminar content in `index.html` within the `#seminar-content` div. The animation will automatically:
- Keep content within the morphing box boundaries
- Scale it with the same curve
- Fade it in with the same timing

No JavaScript or CSS changes needed for content updates!

## Testing

1. Navigate to `/reading3/` in your browser
2. Scroll down to see the animation
3. Watch for:
   - Black square starting in bottom-right
   - Organic morphing with wavy edges
   - Content appearing halfway through
   - Content scaling up smoothly
   - No distortion at end state

## Why WebGL Instead of SVG?

Originally implemented with SVG filters (`feTurbulence` + `feDisplacementMap`), but at extreme displacement values (500) needed for the desired visual effect, WebGL provides:
- Significantly smoother performance
- Better handling of large displacements
- No filter region clipping issues
- More control over noise generation

See `SVG_IMPLEMENTATION.md` for the archived SVG approach.

## Browser Compatibility

WebGL is supported in all modern browsers:
- Chrome/Edge 80+ ✓
- Firefox 75+ ✓
- Safari 13+ ✓
- ~97% browser coverage

Falls back gracefully if WebGL is unavailable (console error, no crash).

## Performance

The animation uses:
- Direct GPU rendering via WebGL shaders
- requestAnimationFrame throttling (60fps cap)
- Cached uniform updates
- Passive scroll listeners
- Achieves 60fps on modern devices, even at extreme displacement values

