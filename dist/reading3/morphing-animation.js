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
  
  // Update pointing finger to track the black box center
  if (pointingFinger && whatsInTheBoxText) {
    const boxCenterX = currentX + (currentWidth / 2);
    const boxCenterY = currentY + (currentHeight / 2);
    
    // Position finger to the top-left of the box, maintaining fixed distance
    const fingerOffsetX = -80; // Fixed distance to the left
    const fingerOffsetY = -80; // Fixed distance above
    const fingerX = boxCenterX + fingerOffsetX;
    const fingerY = boxCenterY + fingerOffsetY;
    
    pointingFinger.style.left = `${fingerX}px`;
    pointingFinger.style.top = `${fingerY}px`;
    
    // Fade out finger and text as animation progresses
    const interactiveOpacity = Math.max(0, 1 - (progress / 0.5)); // Fade out by 50% progress
    pointingFinger.style.opacity = interactiveOpacity.toString();
    whatsInTheBoxText.style.opacity = interactiveOpacity.toString();
  }
  
  // ===== HTML TEXTURE CAPTURE FEATURE (START) =====
  // Hide real HTML content during animation if using texture rendering
  const useTexture = webglMorph && webglMorph.useTextureRendering && webglMorph.contentTextureReady;
  // ===== HTML TEXTURE CAPTURE FEATURE (END) =====
  
  // Hide seminar content at zero scroll, but keep canvas visible
  if (progress === 0) {
    seminarContent.style.visibility = 'hidden';
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
    seminarContent.style.visibility = 'visible'; // Make visible during crossfade
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

// Initialize text position (stays fixed, finger moves)
function initializeTextPosition() {
  if (!whatsInTheBoxText || !pointingFinger) {
    console.error('Text or finger element not found');
    return;
  }
  
  const initialSize = viewportWidth * 0.042;
  const initialX = viewportWidth * 0.72;
  const initialY = viewportHeight * 0.73;
  
  const boxCenterX = initialX + (initialSize / 2);
  const boxCenterY = initialY + (initialSize / 2);
  
  // Position text so the finger (at box center - 80px) is near bottom-left of text
  const fingerX = boxCenterX - 80;
  const fingerY = boxCenterY - 80;
  
  // Text positioned to the left and above the finger
  const textX = fingerX - 200; // Text to the left of finger
  const textY = fingerY - 40;  // Text above finger
  
  whatsInTheBoxText.style.left = `${textX}px`;
  whatsInTheBoxText.style.top = `${textY}px`;
  
  // Position finger initially too
  pointingFinger.style.left = `${fingerX}px`;
  pointingFinger.style.top = `${fingerY}px`;
}

// Reset scroll position on page load (prevent saved scroll position)
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Force scroll to top on page load
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAll);
} else {
  initializeAll();
}

function initializeAll() {
  // Initialize WebGL
  webglMorph = new WebGLMorph('webgl-canvas');
  updateDimensions();
  initializeTextPosition(); // Set initial text position
  updateAnimation();

  // Event listeners
  window.addEventListener('scroll', throttledUpdateAnimation, { passive: true });
  window.addEventListener('resize', () => {
    updateDimensions();
    if (webglMorph) webglMorph.resize();
    initializeTextPosition(); // Update text position on resize
    updateAnimation();
  });
}

