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

// Curve parameters for box path
const curveParams = {
  controlX: 0.85,  // Control point X for top-left corner path
  controlY: 0.18,  // Control point Y for top-left corner path
  bottomLeftControlX: 0.2,  // Control point X for bottom-left corner path
  bottomLeftControlY: 0.2   // Control point Y for bottom-left corner path
};

// WebGL renderer
let webglMorph = null;

// Get elements
const originalContent = document.getElementById('original-content');
const seminarContent = document.getElementById('seminar-content');
const webglCanvas = document.getElementById('webgl-canvas');
const whatsInTheBoxText = document.getElementById('whats-in-the-box-text');
const pointingFinger = document.getElementById('pointing-finger');

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
  
  // Calculate initial size (4.0% of viewport width - 5% smaller than 4.2%)
  const initialSize = viewportWidth * 0.04;
  
  // Initial position (72% from left, 73% from top)
  const initialX = viewportWidth * 0.72;
  const initialY = viewportHeight * 0.73;
  
  // Dimensions are now calculated from corner positions (see above in TESTING section)
  // Original uniform scaling (commented out for testing):
  // const currentWidth = initialSize + (viewportWidth - initialSize) * progress;
  // const currentHeight = initialSize + (viewportHeight - initialSize) * progress;
  
  // Independent corner paths using quadratic bezier curves
  const t = progress;
  
  // Top-left corner follows its curved path
  const topLeftControlX = viewportWidth * curveParams.controlX;
  const topLeftControlY = viewportHeight * curveParams.controlY;
  const topLeftX = Math.pow(1 - t, 2) * initialX + 2 * (1 - t) * t * topLeftControlX + Math.pow(t, 2) * 0;
  const topLeftY = Math.pow(1 - t, 2) * initialY + 2 * (1 - t) * t * topLeftControlY + Math.pow(t, 2) * 0;
  
  // Bottom-left corner follows its own curved path
  const bottomLeftStartX = initialX;
  const bottomLeftStartY = initialY + initialSize;
  const bottomLeftEndX = 0;
  const bottomLeftEndY = viewportHeight;
  const bottomLeftControlX = viewportWidth * curveParams.bottomLeftControlX;
  const bottomLeftControlY = viewportHeight * curveParams.bottomLeftControlY;
  
  const bottomLeftX = Math.pow(1 - t, 2) * bottomLeftStartX + 2 * (1 - t) * t * bottomLeftControlX + Math.pow(t, 2) * bottomLeftEndX;
  const bottomLeftY = Math.pow(1 - t, 2) * bottomLeftStartY + 2 * (1 - t) * t * bottomLeftControlY + Math.pow(t, 2) * bottomLeftEndY;
  
  // Top-right and bottom-right corners grow uniformly to fill screen
  const topRightX = topLeftX + (initialSize + (viewportWidth - initialSize) * progress);
  const topRightY = topLeftY;
  const bottomRightX = topRightX;
  const bottomRightY = bottomLeftY;
  
  // Calculate box position and size from corners
  const currentX = topLeftX;
  const currentY = topLeftY;
  const currentWidth = topRightX - topLeftX;
  const currentHeight = bottomLeftY - topLeftY;
  
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
  
  // Calculate content opacity (fade in from 0 to 0.25 progress - increased by 10%)
  let contentOpacity = 1.0;
  if (progress < 0.25) {
    contentOpacity = progress / 0.25; // Linear fade from 0 to 1
  }
  
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
  
  // Update finger position (between text and box)
  if (pointingFinger && whatsInTheBoxText) {
    // Box center (dynamic)
    const boxCenterX = currentX + (currentWidth / 2);
    const boxCenterY = currentY + (currentHeight / 2);
    
    // Text center (fixed)
    const textCenterX = viewportWidth * 0.42;
    const textCenterY = viewportHeight * 0.64;
    
    // Position finger at midpoint between text center and box center
    const fingerX = (textCenterX + boxCenterX) / 2;
    const fingerY = (textCenterY + boxCenterY) / 2;
    
    pointingFinger.style.left = `${fingerX}px`;
    pointingFinger.style.top = `${fingerY}px`;
    
    // Keep visible throughout animation
    pointingFinger.style.opacity = '1';
    whatsInTheBoxText.style.opacity = '1';
  }
  
  // ===== HTML TEXTURE CAPTURE FEATURE (START) =====
  // Hide real HTML content during animation if using texture rendering
  const useTexture = webglMorph && webglMorph.useTextureRendering && webglMorph.contentTextureReady;
  // ===== HTML TEXTURE CAPTURE FEATURE (END) =====
  
  // Hide seminar content at zero scroll, but keep canvas visible
  if (progress === 0) {
    seminarContent.style.opacity = '0';
    seminarContent.style.pointerEvents = 'none';
  }
  
  // Ensure WebGL canvas is always visible during animation
  if (progress < 0.99) {
    webglCanvas.style.display = 'block';
  }
  
  // Update seminar content visibility with crossfade
  if (progress >= 0.95) {
    // Start crossfading from texture to real HTML at 95%
    const fadeProgress = (progress - 0.95) / 0.05; // 0 to 1 over 95% to 100%
    
    seminarContent.classList.add('active');
    seminarContent.style.opacity = fadeProgress.toString();
    seminarContent.style.transform = 'none';
    seminarContent.style.clipPath = 'none';
    seminarContent.style.pointerEvents = progress >= 0.99 ? 'auto' : 'none';
    
    // Change background to black
    document.body.style.backgroundColor = '#000000';
    
    // ===== HTML TEXTURE CAPTURE FEATURE (START) =====
    if (useTexture) {
      // Hide WebGL completely at the end (don't fade canvas opacity - it affects the black box!)
      if (progress >= 0.99) {
        webglCanvas.style.display = 'none';
      }
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

// Initialize text position (fixed)
function initializeInteractiveElements() {
  if (!whatsInTheBoxText || !pointingFinger) return;
  
  // Position text 8% left of middle, 64% down viewport
  const textX = viewportWidth * 0.42; // 50% - 8% = 42%
  const textY = viewportHeight * 0.64; // 64% down from top (was 60%, moved 4% down)
  whatsInTheBoxText.style.left = `${textX}px`;
  whatsInTheBoxText.style.top = `${textY}px`;
  whatsInTheBoxText.style.transform = 'translateX(-50%)'; // Center the text on its position
  
  // Note: initialSize is 4.0% of viewport width
}

// Initialize WebGL
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

