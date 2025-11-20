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
  
  // Calculate initial size (6% of viewport width)
  const initialSize = viewportWidth * 0.06;
  
  // Initial position (75% from left/top - bottom-right quadrant)
  const initialX = viewportWidth * 0.75;
  const initialY = viewportHeight * 0.75;
  
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
    webglMorph.render(currentX, currentY, currentWidth, currentHeight, currentDisplacementScale);
  }
  
  // Update original content opacity
  if (progress < APPEAR_THRESHOLD) {
    originalContent.style.opacity = '1';
  } else {
    originalContent.style.opacity = Math.max(0, 1 - (progress - APPEAR_THRESHOLD) * 2);
  }
  
  // Calculate box center (for content expansion origin)
  const boxCenterX = currentX + (currentWidth / 2);
  const boxCenterY = currentY + (currentHeight / 2);
  
  // Create clip-path to match the expanding box
  // Using inset() for a simple rectangular clip (lens distortions happen in WebGL layer below)
  const clipPath = `inset(${currentY}px ${viewportWidth - currentX - currentWidth}px ${viewportHeight - currentY - currentHeight}px ${currentX}px)`;
  
  // ===== HTML TEXTURE CAPTURE FEATURE (START) =====
  // Hide real HTML content during animation if using texture rendering
  const useTexture = webglMorph && webglMorph.useTextureRendering && webglMorph.contentTextureReady;
  // ===== HTML TEXTURE CAPTURE FEATURE (END) =====
  
  // Update seminar content
  if (progress >= APPEAR_THRESHOLD) {
    const contentProgress = (progress - APPEAR_THRESHOLD) / (1 - APPEAR_THRESHOLD);
    
    // Opacity: linear
    const opacity = contentProgress;
    
    // Scale: quadratic ease-in (starts at 0.3, goes to 1)
    const scale = 0.3 + (0.7 * Math.pow(contentProgress, 2));
    
    // Set transform-origin to the center of the black box
    seminarContent.style.transformOrigin = `${boxCenterX}px ${boxCenterY}px`;
    seminarContent.style.clipPath = clipPath;
    seminarContent.style.opacity = opacity;
    seminarContent.style.transform = `scale(${scale})`;
    
    // Enable pointer events when fully visible
    if (progress >= 0.99) {
      seminarContent.classList.add('active');
      seminarContent.style.clipPath = 'none'; // Remove clip at end
      // ===== HTML TEXTURE CAPTURE FEATURE (START) =====
      // Show real HTML at end, hide WebGL
      if (useTexture) {
        webglCanvas.style.display = 'none';
      }
      // ===== HTML TEXTURE CAPTURE FEATURE (END) =====
    } else {
      seminarContent.classList.remove('active');
      // ===== HTML TEXTURE CAPTURE FEATURE (START) =====
      // During animation: hide real HTML if using texture, show WebGL
      if (useTexture) {
        seminarContent.style.opacity = '0';
        seminarContent.style.pointerEvents = 'none';
        webglCanvas.style.display = 'block';
      }
      // ===== HTML TEXTURE CAPTURE FEATURE (END) =====
    }
  } else {
    seminarContent.style.transformOrigin = `${boxCenterX}px ${boxCenterY}px`;
    seminarContent.style.clipPath = clipPath;
    seminarContent.style.opacity = '0';
    seminarContent.style.transform = 'scale(0.3)';
    seminarContent.classList.remove('active');
    // ===== HTML TEXTURE CAPTURE FEATURE (START) =====
    // Keep WebGL visible during early animation
    if (useTexture) {
      webglCanvas.style.display = 'block';
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

