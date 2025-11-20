// Configuration
const SCREENS_TO_END = 1;
const APPEAR_THRESHOLD = 0.5;

// Default parameter values
const DEFAULT_PARAMS = {
  displacementScale: 500,
  baseFrequency: 0.001,
  numOctaves: 1,
  distortionPeak: 0.2
};

// Current parameter values
let params = { ...DEFAULT_PARAMS };

// Filter mode state
let currentFilterMode = 'curl'; // 'curl' or 'stream'

// Get elements
const svg = document.getElementById('morphing-svg');
const morphingShape = document.getElementById('morphingShape');
const morphFilterCurl = document.getElementById('morphFilterCurl');
const morphFilterStream = document.getElementById('morphFilterStream');
const originalContent = document.getElementById('original-content');
const seminarContent = document.getElementById('seminar-content');

// Cache filter elements from both filters (optimization #3)
const feTurbulenceCurl = morphFilterCurl.querySelector('feTurbulence');
const feTurbulenceStream = morphFilterStream.querySelector('feTurbulence');
const feDisplacementMapCurl = morphFilterCurl.querySelector('feDisplacementMap');
const feDisplacementMapStream = morphFilterStream.querySelector('feDisplacementMap');

// Cache commonly accessed elements for performance
const cachedElements = {
  feTurbulence: feTurbulenceCurl,
  feDisplacementMap: feDisplacementMapCurl
};

// Track dimensions
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;

function updateDimensions() {
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;
  
  // Update SVG viewBox
  svg.setAttribute('viewBox', `0 0 ${viewportWidth} ${viewportHeight}`);
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
  
  // Update displacement scale with a curve: starts at 0, peaks at distortionPeak, ends at 0
  // Using piecewise parabolas to ensure 0 at start and end
  const peak = params.distortionPeak;
  let displacementCurve;
  
  if (progress <= peak) {
    // Rising phase: parabola from (0,0) to (peak,1)
    displacementCurve = Math.pow(progress / peak, 2);
  } else {
    // Falling phase: parabola from (peak,1) to (1,0)
    displacementCurve = Math.pow((1 - progress) / (1 - peak), 2);
  }
  
  const currentDisplacementScale = params.displacementScale * displacementCurve;
  
  // Update morphing shape
  morphingShape.setAttribute('x', currentX);
  morphingShape.setAttribute('y', currentY);
  morphingShape.setAttribute('width', currentWidth);
  morphingShape.setAttribute('height', currentHeight);
  
  // Use cached filter elements (optimization #3)
  const feTurbulence = cachedElements.feTurbulence;
  const feDisplacementMap = cachedElements.feDisplacementMap;
  
  // Update turbulence parameters
  feTurbulence.setAttribute('baseFrequency', params.baseFrequency);
  feTurbulence.setAttribute('numOctaves', params.numOctaves);
  
  // Update displacement scale
  feDisplacementMap.setAttribute('scale', currentDisplacementScale);
  
  // Update filter application - only apply filter when displacement is significant
  // Disable filter when distortion is very low to avoid rendering artifacts
  // Use higher threshold to prevent issues with large rectangles
  if (currentDisplacementScale > 10) {
    morphingShape.setAttribute('filter', 'url(#morphFilterCurl)');
  } else {
    morphingShape.removeAttribute('filter');
  }
  
  // Update original content opacity
  if (progress < APPEAR_THRESHOLD) {
    originalContent.style.opacity = '1';
  } else {
    originalContent.style.opacity = Math.max(0, 1 - (progress - APPEAR_THRESHOLD) * 2);
  }
  
  // Update seminar content
  if (progress >= APPEAR_THRESHOLD) {
    const contentProgress = (progress - APPEAR_THRESHOLD) / (1 - APPEAR_THRESHOLD);
    
    // Opacity: linear
    const opacity = contentProgress;
    
    // Scale: quadratic ease-in (starts at 0.3, goes to 1)
    const scale = 0.3 + (0.7 * Math.pow(contentProgress, 2));
    
    seminarContent.style.opacity = opacity;
    seminarContent.style.transform = `scale(${scale})`;
    
    // Enable pointer events when fully visible
    if (progress >= 0.99) {
      seminarContent.classList.add('active');
    } else {
      seminarContent.classList.remove('active');
    }
  } else {
    seminarContent.style.opacity = '0';
    seminarContent.style.transform = 'scale(0.3)';
    seminarContent.classList.remove('active');
  }
}

// Throttle scroll updates with requestAnimationFrame (optimization #1)
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

// Initialize
updateDimensions();
updateAnimation();

// Event listeners
window.addEventListener('scroll', throttledUpdateAnimation, { passive: true });
window.addEventListener('resize', () => {
  updateDimensions();
  updateAnimation();
});

