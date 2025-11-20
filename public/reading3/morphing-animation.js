// Configuration
const SCREENS_TO_END = 1;
const APPEAR_THRESHOLD = 0.5;

// Animation parameter values
const params = {
  displacementScale: 500,
  baseFrequency: 0.001,
  numOctaves: 1,
  distortionPeak: 0.4
};

// WebGL renderer
let webglMorph = null;

// Get elements
const originalContent = document.getElementById('original-content');
const seminarContent = document.getElementById('seminar-content');
const webglCanvas = document.getElementById('webgl-canvas');

// Liquify control elements removed (no longer used)

// Control panel removed - using fixed lens parameters

// Track dimensions
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;

function updateDimensions() {
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;
}

function getScrollProgress() {
  const scrolled = window.scrollY;
  const maxScroll = viewportHeight * SCREENS_TO_END;
  return Math.min(scrolled / maxScroll, 1);
}

function updateAnimation() {
  const progress = getScrollProgress();
  
  // Calculate initial size (4.2% of viewport width - 30% smaller than 6%)
  const initialSize = viewportWidth * 0.042;
  
  // Initial position (72% from left, 73% from top)
  const initialX = viewportWidth * 0.72;
  const initialY = viewportHeight * 0.73;
  
  // Interpolate dimensions
  const currentWidth = initialSize + (viewportWidth - initialSize) * progress;
  const currentHeight = initialSize + (viewportHeight - initialSize) * progress;
  
  // Interpolate position
  const currentX = initialX * (1 - progress);
  const currentY = initialY * (1 - progress);
  
  // Update displacement scale with ease-in-out curve
  const peak = params.distortionPeak;
  let displacementCurve;
  
  if (progress <= peak) {
    // Rising phase: ease-in-out from (0,0) to (peak,1)
    const t = progress / peak;
    displacementCurve = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  } else {
    // Falling phase: ease-in-out from (peak,1) to (1,0)
    const t = (progress - peak) / (1 - peak);
    displacementCurve = t < 0.5 ? 1 - 2 * t * t : Math.pow(-2 * t + 2, 2) / 2;
  }
  
  const currentDisplacementScale = params.displacementScale * displacementCurve;
  
  // WebGL rendering
  if (webglMorph) {
    webglMorph.render(currentX, currentY, currentWidth, currentHeight, currentDisplacementScale, contentOpacity);
  }
  
  // Update original content opacity
  if (progress < APPEAR_THRESHOLD) {
    originalContent.style.opacity = '1';
  } else {
    originalContent.style.opacity = Math.max(0, 1 - (progress - APPEAR_THRESHOLD) * 2);
  }
  
  // ===== HTML TEXTURE CAPTURE FEATURE (START) =====
  // Hide real HTML content during animation if using texture rendering
  const useTexture = webglMorph && webglMorph.useTextureRendering && webglMorph.contentTextureReady;
  // ===== HTML TEXTURE CAPTURE FEATURE (END) =====
  
  // Calculate content opacity fade-in
  // 0% opacity from 0 to 0.15
  // Fade to 100% from 0.15 to 0.40 (ease-in)
  let contentOpacity = 1.0;
  if (progress < 0.15) {
    contentOpacity = 0.0;
  } else if (progress < 0.40) {
    const fadeProgress = (progress - 0.15) / (0.40 - 0.15);
    contentOpacity = fadeProgress * fadeProgress; // Quadratic ease-in
  }
  
  // WebGL canvas should always be visible (contentOpacity only affects the texture, not the box)
  if (useTexture) {
    webglCanvas.style.opacity = '1';
  }
  
  // Update seminar content visibility
  if (progress >= 0.99) {
    // Animation complete: show real HTML, hide WebGL
    seminarContent.classList.add('active');
    seminarContent.style.opacity = '1';
    seminarContent.style.transform = 'none';
    seminarContent.style.clipPath = 'none';
    seminarContent.style.pointerEvents = 'auto';
    
    // Change background to black
    document.body.style.backgroundColor = '#000000';
    
    // ===== HTML TEXTURE CAPTURE FEATURE (START) =====
    if (useTexture) {
      webglCanvas.style.display = 'none';
    }
    // ===== HTML TEXTURE CAPTURE FEATURE (END) =====
  } else {
    // During animation: keep background white
    document.body.style.backgroundColor = '#ffffff';
    // During animation: use WebGL texture rendering
    seminarContent.classList.remove('active');
    
    // ===== HTML TEXTURE CAPTURE FEATURE (START) =====
    if (useTexture) {
      // Hide real HTML, show WebGL with texture
      seminarContent.style.opacity = '0';
      seminarContent.style.pointerEvents = 'none';
      webglCanvas.style.display = 'block';
    } else {
      // Fallback: show HTML with clip-path (old behavior)
      const boxCenterX = currentX + (currentWidth / 2);
      const boxCenterY = currentY + (currentHeight / 2);
      const clipPath = `inset(${currentY}px ${viewportWidth - currentX - currentWidth}px ${viewportHeight - currentY - currentHeight}px ${currentX}px)`;
      
      if (progress >= APPEAR_THRESHOLD) {
        const contentProgress = (progress - APPEAR_THRESHOLD) / (1 - APPEAR_THRESHOLD);
        const opacity = contentProgress;
        const scale = 0.3 + (0.7 * Math.pow(contentProgress, 2));
        
        seminarContent.style.transformOrigin = `${boxCenterX}px ${boxCenterY}px`;
        seminarContent.style.clipPath = clipPath;
        seminarContent.style.opacity = opacity;
        seminarContent.style.transform = `scale(${scale})`;
        seminarContent.style.pointerEvents = 'none';
      } else {
        seminarContent.style.opacity = '0';
        seminarContent.style.pointerEvents = 'none';
      }
    }
    // ===== HTML TEXTURE CAPTURE FEATURE (END) =====
  }
}

// Throttle scroll updates with requestAnimationFrame
let rafPending = false;
function throttledUpdateAnimation() {
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(() => {
      updateAnimation();
      rafPending = false;
    });
  }
}

// Liquify controls removed

// Reset scroll position on page load (prevent saved scroll position)
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Force scroll to top on page load
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Initialize WebGL
webglMorph = new WebGLMorph('webgl-canvas');
updateDimensions();
updateAnimation();

// Event listeners
window.addEventListener('scroll', throttledUpdateAnimation, { passive: true });
window.addEventListener('resize', () => {
  updateDimensions();
  if (webglMorph) webglMorph.resize();
  updateAnimation();
});

