// ==================== CONFIGURATION ====================

// The scroll driver works like a "scrollytelling" intro: we pin all hero elements
// for CONFIG.screensToEnd viewports and let scrollY act purely as animation progress.
// Once scroll exits that section, the real DOM is already positioned at 0, so no
// "descrolling" offsets or jumps are necessary—the browser just continues into the
// normal page flow.
const CONFIG = {
  // Scroll animation
  screensToEnd: 1.3,
  appearThreshold: 0.3,
  
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
  distortionPeak: 0.5,       // Peak distortion at 50% progress
  
  // Content fade-in
  contentFadeEnd: 0.60,      // Fade from 0% to 100% opacity by 60% progress
  
  // Crossfade transition
  crossfadeStart: 0.99,      // Start crossfading to real HTML at 99%
  crossfadeComplete: 1.0,    // Complete transition at 100%
  
  // Finger animation
  fingerOscillationSpeed: 350,  // Milliseconds per oscillation
  fingerOscillationRange: 0.08,   // ±8% along the path
  
  // Auto-scroll animation
  autoScrollDuration: 1200  // Duration in milliseconds (1.2 seconds)
};

// Expose the scroll span to CSS so the sticky intro section matches JS math.
document.documentElement.style.setProperty('--screens-to-end', String(CONFIG.screensToEnd));

// ==================== STATE ====================

let webglMorph = null;
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;
let rafPending = false;

// Cache box center for finger animation (updated on scroll, read at 60fps)
let cachedBoxCenter = { x: 0, y: 0 };

// Auto-scroll state
let isAutoScrolling = false;
let autoScrollStartTime = 0;
let autoScrollStartPosition = 0;
let autoScrollTargetPosition = 0;

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
  if (CONFIG.screensToEnd <= 0) {
    console.warn('[morphing-animation] screensToEnd must be > 0; defaulting to 1.');
  }

  const effectiveScreens = CONFIG.screensToEnd > 0 ? CONFIG.screensToEnd : 1;
  const scrolled = window.scrollY;
  const maxScroll = viewportHeight * effectiveScreens;
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
  
  // Enable/disable pointer events on canvas based on scroll progress
  // Only allow clicks when at the start (progress === 0) and not auto-scrolling
  if (webglCanvas) {
    if (progress === 0 && !isAutoScrolling) {
      webglCanvas.style.pointerEvents = 'auto';
    } else {
      webglCanvas.style.pointerEvents = 'none';
    }
  }
  
  // Update seminar content visibility with crossfade
  if (progress >= CONFIG.crossfadeStart) {
    const fadeRange = CONFIG.crossfadeComplete - CONFIG.crossfadeStart;
    const fadeProgress = fadeRange > 0 
      ? (progress - CONFIG.crossfadeStart) / fadeRange 
      : 1.0; // If start == complete, show immediately
    
    seminarContent.classList.add('active');
    seminarContent.style.opacity = Math.min(1.0, Math.max(0.0, fadeProgress)).toString();
    seminarContent.style.pointerEvents = progress >= CONFIG.crossfadeComplete ? 'auto' : 'none';

    // Because the intro section owns all scroll movement, we never adjust the
    // seminar content's transform here—when the user scrolls past the intro,
    // the document simply reveals the same content we captured for WebGL.
    
    // ===== HTML TEXTURE CAPTURE FEATURE (START) =====
    if (useTexture && progress >= CONFIG.crossfadeComplete) {
      webglCanvas.style.display = 'none';
    }
    // ===== HTML TEXTURE CAPTURE FEATURE (END) =====
  } else {
    seminarContent.classList.remove('active');

    seminarContent.style.opacity = '0';
    seminarContent.style.pointerEvents = 'none';

    // ===== HTML TEXTURE CAPTURE FEATURE (START) =====
    if (useTexture) {
      seminarContent.style.opacity = '0';
      seminarContent.style.pointerEvents = 'none';
      webglCanvas.style.display = 'block';
    }
    // ===== HTML TEXTURE CAPTURE FEATURE (END) =====
  }
  
  // Background color: stay white during animation, instantly change to black when complete
  if (progress >= CONFIG.crossfadeComplete) {
    document.body.style.backgroundColor = '#000000';
    document.documentElement.style.backgroundColor = '#000000';
  } else {
    document.body.style.backgroundColor = '#ffffff';
    document.documentElement.style.backgroundColor = '#ffffff';
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

// ==================== AUTO-SCROLL ANIMATION ====================

function isPointInBox(x, y, box) {
  // Check if point is inside the quadrilateral box
  // Using bounding box check (simpler and sufficient for click detection)
  return x >= box.x && x <= box.x + box.width &&
         y >= box.y && y <= box.y + box.height;
}

function handleCanvasClick(event) {
  // Only handle clicks when scroll progress is zero and not already auto-scrolling
  const progress = getScrollProgress();
  if (progress !== 0 || isAutoScrolling) {
    return;
  }
  
  // Get click coordinates
  const clickX = event.clientX;
  const clickY = event.clientY;
  
  // Calculate box position at progress 0
  const box = calculateBoxCorners(0);
  
  // Check if click is within the black box
  if (isPointInBox(clickX, clickY, box)) {
    startAutoScroll();
  }
}

function startAutoScroll() {
  if (isAutoScrolling) return;
  
  isAutoScrolling = true;
  autoScrollStartTime = performance.now();
  autoScrollStartPosition = window.scrollY;
  
  // Calculate target scroll position
  const effectiveScreens = CONFIG.screensToEnd > 0 ? CONFIG.screensToEnd : 1;
  autoScrollTargetPosition = viewportHeight * effectiveScreens;
  
  // Disable pointer events on canvas during auto-scroll to prevent additional clicks
  if (webglCanvas) {
    webglCanvas.style.pointerEvents = 'none';
  }
  
  // Start animation loop
  animateAutoScroll();
}

function animateAutoScroll() {
  if (!isAutoScrolling) return;
  
  const now = performance.now();
  const elapsed = now - autoScrollStartTime;
  const duration = CONFIG.autoScrollDuration;
  
  if (elapsed >= duration) {
    // Animation complete
    window.scrollTo(0, autoScrollTargetPosition);
    isAutoScrolling = false;
    
    // Pointer events will be handled by updateAnimation based on scroll progress
    updateAnimation();
    return;
  }
  
  // Linear interpolation
  const t = elapsed / duration;
  const currentScroll = autoScrollStartPosition + 
    (autoScrollTargetPosition - autoScrollStartPosition) * t;
  
  // Set scroll position (this will trigger scroll event, but we'll handle it)
  window.scrollTo(0, currentScroll);
  
  // Continue animation
  requestAnimationFrame(animateAutoScroll);
}

function handleScrollDuringAutoScroll() {
  // Prevent user scrolling during auto-scroll
  if (!isAutoScrolling) return;
  
  // Calculate where scroll should be based on elapsed time
  const now = performance.now();
  const elapsed = now - autoScrollStartTime;
  const duration = CONFIG.autoScrollDuration;
  
  if (elapsed >= duration) {
    // Animation should be complete
    isAutoScrolling = false;
    return;
  }
  
  const t = elapsed / duration;
  const targetScroll = autoScrollStartPosition + 
    (autoScrollTargetPosition - autoScrollStartPosition) * t;
  
  // Only restore if user tried to scroll away from target
  const currentScroll = window.scrollY;
  const tolerance = 1; // 1px tolerance to avoid unnecessary restorations
  if (Math.abs(currentScroll - targetScroll) > tolerance) {
    window.scrollTo(0, targetScroll);
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

// Ensure the first frame (and html2canvas capture) always see the top of the page.
window.scrollTo(0, 0);

// Explicitly set initial background to hard white
document.documentElement.style.backgroundColor = '#ffffff';
document.body.style.backgroundColor = '#ffffff';

// Initialize
webglMorph = new WebGLMorph('webgl-canvas');
updateDimensions();
initializeInteractiveElements();
updateAnimation();

// Event listeners
window.addEventListener('scroll', () => {
  // Handle user scroll during auto-scroll
  if (isAutoScrolling) {
    handleScrollDuringAutoScroll();
  }
  throttledUpdateAnimation();
}, { passive: true });

window.addEventListener('resize', () => {
  updateDimensions();
  if (webglMorph) webglMorph.resize();
  initializeInteractiveElements();
  updateAnimation();
});

// Add click handler to canvas for auto-scroll trigger
if (webglCanvas) {
  webglCanvas.addEventListener('click', handleCanvasClick);
}

// Start continuous finger animation loop
animateFinger();
