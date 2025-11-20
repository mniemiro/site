// Configuration
const SCREENS_TO_END = 1;
const APPEAR_THRESHOLD = 0.5;

// Default parameter values
const DEFAULT_PARAMS = {
  displacementScale: 250,
  baseFrequency: 0.011,
  numOctaves: 1,
  distortionPeak: 0.25
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

// Get filter elements from both filters
const feTurbulenceCurl = morphFilterCurl.querySelector('feTurbulence');
const feTurbulenceStream = morphFilterStream.querySelector('feTurbulence');
const feDisplacementMapCurl = morphFilterCurl.querySelector('feDisplacementMap');
const feDisplacementMapStream = morphFilterStream.querySelector('feDisplacementMap');

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
  
  // Update filter parameters based on current mode
  const feTurbulence = currentFilterMode === 'curl' ? feTurbulenceCurl : feTurbulenceStream;
  const feDisplacementMap = currentFilterMode === 'curl' ? feDisplacementMapCurl : feDisplacementMapStream;
  
  // Update turbulence parameters
  feTurbulence.setAttribute('baseFrequency', params.baseFrequency);
  feTurbulence.setAttribute('numOctaves', params.numOctaves);
  
  // Update displacement scale
  feDisplacementMap.setAttribute('scale', currentDisplacementScale);
  
  // Update filter application
  if (currentDisplacementScale > 0) {
    morphingShape.setAttribute('filter', `url(#morphFilter${currentFilterMode === 'curl' ? 'Curl' : 'Stream'})`);
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

// Initialize
updateDimensions();
updateAnimation();

// Event listeners
window.addEventListener('scroll', updateAnimation, { passive: true });
window.addEventListener('resize', () => {
  updateDimensions();
  updateAnimation();
});

