// ==================== CONFIGURATION ====================

const CONFIG = {
  // Scroll animation
  screensToEnd: 1.1,
  appearThreshold: 0.5,
  
  // Box initial state
  initialBoxSize: 0.035,      // 3.5% of viewport width
  initialBoxX: 0.72,         // 72% from left
  initialBoxY: 0.73,         // 73% from top
  
  // Box path curves (quadratic bezier control points)
  topLeftCurve: { x: 0.85, y: 0.18 },
  bottomLeftCurve: { x: 0.2, y: 0.2 },
  
  // Interactive elements
  textX: 0.41,               // 41% from left
  textY: 0.55,               // 55% from top
  
  // WebGL distortion
  displacementScale: 500,
  distortionPeak: 0.4,       // Peak distortion at 40% progress
  
  // Content fade-in
  contentFadeEnd: 0.60,      // Fade from 0% to 100% opacity by 60% progress
  
  // Crossfade transition
  crossfadeStart: 0.99,      // Start crossfading to real HTML at 99%
  crossfadeComplete: 1.0,    // Complete transition at 100%
  
  // Finger animation
  fingerOscillationSpeed: 350,  // Milliseconds per oscillation
  fingerOscillationRange: 0.08   // ±8% along the path
};

// ==================== STATE ====================

let webglMorph = null;
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;
let rafPending = false;

// Cache box center for finger animation (updated on scroll, read at 60fps)
let cachedBoxCenter = { x: 0, y: 0 };

// Track if we've scrolled to top after animation completion
let hasScrolledToTop = false;

// DOM elements
const originalContent = document.getElementById('original-content');
const seminarContent = document.getElementById('seminar-content');
const webglCanvas = document.getElementById('webgl-canvas');
const whatsInTheBoxText = document.getElementById('whats-in-the-box-text');
const pointingFinger = document.getElementById('pointing-finger');

// ==================== UTILITY FUNCTIONS ====================

function updateDimensions() {
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;
}

function getScrollProgress() {
  const scrolled = window.scrollY;
  const maxScroll = viewportHeight * CONFIG.screensToEnd;
  return Math.min(scrolled / maxScroll, 1);
}

function quadraticBezier(p0, p1, p2, t) {
  return Math.pow(1 - t, 2) * p0 + 2 * (1 - t) * t * p1 + Math.pow(t, 2) * p2;
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ==================== BOX CALCULATION ====================

function calculateBoxCorners(progress) {
  const initialSize = viewportWidth * CONFIG.initialBoxSize;
  const initialX = viewportWidth * CONFIG.initialBoxX;
  const initialY = viewportHeight * CONFIG.initialBoxY;
  
  const t = progress;
  
  // Top-left corner follows curved path
  const topLeftControlX = viewportWidth * CONFIG.topLeftCurve.x;
  const topLeftControlY = viewportHeight * CONFIG.topLeftCurve.y;
  const topLeftX = quadraticBezier(initialX, topLeftControlX, 0, t);
  const topLeftY = quadraticBezier(initialY, topLeftControlY, 0, t);
  
  // Bottom-left corner follows its own curved path
  const bottomLeftStartX = initialX;
  const bottomLeftStartY = initialY + initialSize;
  const bottomLeftEndX = 0;
  const bottomLeftEndY = viewportHeight;
  const bottomLeftControlX = viewportWidth * CONFIG.bottomLeftCurve.x;
  const bottomLeftControlY = viewportHeight * CONFIG.bottomLeftCurve.y;
  const bottomLeftX = quadraticBezier(bottomLeftStartX, bottomLeftControlX, bottomLeftEndX, t);
  const bottomLeftY = quadraticBezier(bottomLeftStartY, bottomLeftControlY, bottomLeftEndY, t);
  
  // Top-right and bottom-right corners grow uniformly
  const topRightX = topLeftX + (initialSize + (viewportWidth - initialSize) * progress);
  const topRightY = topLeftY;
  const bottomRightX = topRightX;
  const bottomRightY = bottomLeftY;
  
  // Calculate bounding box
  const x = topLeftX;
  const y = topLeftY;
  const width = topRightX - topLeftX;
  const height = bottomLeftY - topLeftY;
  
  // Calculate center of quadrilateral (average of all 4 corners)
  const centerX = (topLeftX + topRightX + bottomRightX + bottomLeftX) / 4;
  const centerY = (topLeftY + topRightY + bottomRightY + bottomLeftY) / 4;
  
  return { x, y, width, height, centerX, centerY };
}

// ==================== ANIMATION ====================

function updateAnimation() {
  const progress = getScrollProgress();
  const box = calculateBoxCorners(progress);
  
  // Cache box center for finger animation (avoids recalculating at 60fps)
  cachedBoxCenter.x = box.centerX;
  cachedBoxCenter.y = box.centerY;
  
  // Calculate displacement with ease-in-out curve (peak at distortionPeak)
  const peak = CONFIG.distortionPeak;
  let displacementCurve;
  
  if (progress <= peak) {
    const t = progress / peak;
    displacementCurve = easeInOut(t);
  } else {
    const t = (progress - peak) / (1 - peak);
    displacementCurve = 1 - easeInOut(t);
  }
  
  const currentDisplacementScale = CONFIG.displacementScale * displacementCurve;
  
  // Calculate content opacity (fade in from 0 to CONFIG.contentFadeEnd)
  const contentOpacity = progress < CONFIG.contentFadeEnd 
    ? progress / CONFIG.contentFadeEnd 
    : 1.0;
  
  // WebGL rendering
  if (webglMorph) {
    webglMorph.render(box.x, box.y, box.width, box.height, currentDisplacementScale, contentOpacity);
  }
  
  // Update original content opacity
  if (progress < CONFIG.appearThreshold) {
    originalContent.style.opacity = '1';
  } else {
    originalContent.style.opacity = Math.max(0, 1 - (progress - CONFIG.appearThreshold) * 2);
  }
  
  // Keep text visible throughout animation
  if (whatsInTheBoxText) {
    whatsInTheBoxText.style.opacity = '1';
  }
  
  // ===== HTML TEXTURE CAPTURE FEATURE (START) =====
  const useTexture = webglMorph && webglMorph.useTextureRendering && webglMorph.contentTextureReady;
  // ===== HTML TEXTURE CAPTURE FEATURE (END) =====
  
  // Hide seminar content at zero scroll
  if (progress === 0) {
    seminarContent.style.opacity = '0';
    seminarContent.style.pointerEvents = 'none';
  }
  
  // Ensure WebGL canvas is visible during animation
  if (progress < CONFIG.crossfadeComplete) {
    webglCanvas.style.display = 'block';
  }
  
  // Update seminar content visibility with crossfade
  if (progress >= CONFIG.crossfadeStart) {
    const fadeRange = CONFIG.crossfadeComplete - CONFIG.crossfadeStart;
    const fadeProgress = fadeRange > 0 
      ? (progress - CONFIG.crossfadeStart) / fadeRange 
      : 1.0; // If start == complete, show immediately
    
    seminarContent.classList.add('active');
    seminarContent.style.opacity = Math.min(1.0, Math.max(0.0, fadeProgress)).toString();
    seminarContent.style.transform = 'none';
    seminarContent.style.clipPath = 'none';
    seminarContent.style.pointerEvents = progress >= CONFIG.crossfadeComplete ? 'auto' : 'none';
    
    // When animation completes, make content scrollable and scroll to top
    if (progress >= CONFIG.crossfadeComplete) {
      seminarContent.style.position = 'relative';
      seminarContent.style.top = 'auto';
      seminarContent.style.left = 'auto';
      seminarContent.style.width = 'auto';
      seminarContent.style.height = 'auto';
      seminarContent.style.justifyContent = 'flex-start';
      
      // Scroll to top once when animation completes
      if (!hasScrolledToTop) {
        window.scrollTo(0, 0);
        hasScrolledToTop = true;
      }
    }
    
    document.body.style.backgroundColor = '#000000';
    
    // ===== HTML TEXTURE CAPTURE FEATURE (START) =====
    if (useTexture && progress >= CONFIG.crossfadeComplete) {
      webglCanvas.style.display = 'none';
    }
    // ===== HTML TEXTURE CAPTURE FEATURE (END) =====
  } else {
    document.body.style.backgroundColor = '#ffffff';
    seminarContent.classList.remove('active');
    
    // Reset positioning for animation
    seminarContent.style.position = 'fixed';
    seminarContent.style.top = '0';
    seminarContent.style.left = '0';
    seminarContent.style.width = '100%';
    seminarContent.style.height = '100%';
    seminarContent.style.justifyContent = 'center';
    
    // Reset scroll-to-top flag when scrolling back
    hasScrolledToTop = false;
    
    // ===== HTML TEXTURE CAPTURE FEATURE (START) =====
    if (useTexture) {
      seminarContent.style.opacity = '0';
      seminarContent.style.pointerEvents = 'none';
      webglCanvas.style.display = 'block';
    }
    // ===== HTML TEXTURE CAPTURE FEATURE (END) =====
  }
}

function throttledUpdateAnimation() {
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(() => {
      updateAnimation();
      rafPending = false;
    });
  }
}

// ==================== FINGER ANIMATION ====================

function animateFinger() {
  if (pointingFinger && whatsInTheBoxText) {
    // Use cached box center (calculated on scroll, not every frame)
    const boxCenterX = cachedBoxCenter.x;
    const boxCenterY = cachedBoxCenter.y;
    
    // Text center (fixed)
    const textCenterX = viewportWidth * CONFIG.textX;
    const textCenterY = viewportHeight * CONFIG.textY;
    
    // Calculate oscillation along the path between text and box
    const oscillation = 0.5 + CONFIG.fingerOscillationRange * Math.sin(Date.now() / CONFIG.fingerOscillationSpeed);
    const fingerX = textCenterX + (boxCenterX - textCenterX) * oscillation;
    const fingerY = textCenterY + (boxCenterY - textCenterY) * oscillation;
    
    pointingFinger.style.left = `${fingerX}px`;
    pointingFinger.style.top = `${fingerY}px`;
    
    // Calculate angle from finger to box center
    const dx = boxCenterX - fingerX;
    const dy = boxCenterY - fingerY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    pointingFinger.style.transform = `rotate(${angle}deg)`;
    pointingFinger.style.opacity = '1';
  }
  
  requestAnimationFrame(animateFinger);
}

// ==================== INITIALIZATION ====================

function initializeInteractiveElements() {
  if (!whatsInTheBoxText || !pointingFinger) return;
  
  const textX = viewportWidth * CONFIG.textX;
  const textY = viewportHeight * CONFIG.textY;
  whatsInTheBoxText.style.left = `${textX}px`;
  whatsInTheBoxText.style.top = `${textY}px`;
  whatsInTheBoxText.style.transform = 'translateX(-50%)';
}

// Reset scroll position on page load
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Initialize
webglMorph = new WebGLMorph('webgl-canvas');
updateDimensions();
initializeInteractiveElements();
updateAnimation();

// Event listeners
window.addEventListener('scroll', throttledUpdateAnimation, { passive: true });
window.addEventListener('resize', () => {
  updateDimensions();
  if (webglMorph) webglMorph.resize();
  initializeInteractiveElements();
  updateAnimation();
});

// Start continuous finger animation loop
animateFinger();
