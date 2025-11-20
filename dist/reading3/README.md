# Reading3 - Morphing Box Animation

## Overview

This directory contains a scroll-driven morphing animation where a black square (6% of viewport width) in the bottom-right quadrant organically expands to cover the entire screen. As the box morphs, reading seminar content appears and scales within it.

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling for all elements
- `morphing-animation.js` - Animation logic
- `data/` - Data directory for seminar content

## How It Works

### Animation Sequence

1. **Initial State**: Perfect black square (6vw) positioned at 75% from left/top (bottom-right quadrant), no distortion
2. **0-50% Progress**: Black box grows and begins to distort organically, reaching peak distortion at 50%
3. **50-100% Progress**: Seminar content appears and scales (30% → 100%) while box continues to full screen, distortion reduces
4. **End State**: Full black background (perfect rectangle) with seminar content at 100% scale, no distortion

### Technical Implementation

**SVG Displacement Filter**:
- Uses `feTurbulence` with fractal noise for organic distortion
- `feDisplacementMap` applies displacement with a parabolic curve: starts at 0, peaks at middle (50%), returns to 0
- This ensures the box is a perfect square at start and perfect rectangle at end
- ClipPath ensures content stays within morphing boundaries

**JavaScript**:
- Tracks scroll progress (0-1) over 1 screen height
- Updates SVG rect dimensions and position
- Adjusts displacement scale dynamically
- Controls content opacity and scaling

## Adjustable Parameters

### In `morphing-animation.js`

```javascript
// Number of screen heights for full animation
const SCREENS_TO_END = 1;

// When seminar content starts appearing (0.5 = 50%)
const APPEAR_THRESHOLD = 0.5;

// Initial displacement intensity
const DISPLACEMENT_SCALE = 30;
```

### In Animation Logic

```javascript
// Initial size (6% of viewport width)
const initialSize = viewportWidth * 0.06;

// Initial position (bottom-right quadrant)
const initialX = viewportWidth * 0.75;
const initialY = viewportHeight * 0.75;

// Content scaling (starts at 30%)
const scale = 0.3 + (0.7 * Math.pow(contentProgress, 2));
```

### In `index.html` (SVG Filter)

```html
<feTurbulence
  baseFrequency="0.02"  <!-- Lower = larger waves -->
  numOctaves="3"        <!-- More = more detail -->
  seed="42"             <!-- Change for different pattern -->
/>
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

## Browser Compatibility

SVG filters are supported in all modern browsers:
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+

## Performance

The animation uses:
- Hardware-accelerated CSS transforms
- Passive scroll listeners
- RequestAnimationFrame implicitly via scroll events
- Should achieve 60fps on modern devices

