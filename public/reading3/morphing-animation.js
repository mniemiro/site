// Configuration
const SCREENS_TO_END = 1;
const APPEAR_THRESHOLD = 0.5;
const DISPLACEMENT_SCALE = 30;

// Get elements
const svg = document.getElementById('morphing-svg');
const morphingShape = document.getElementById('morphingShape');
const morphFilter = document.getElementById('morphFilter');
const originalContent = document.getElementById('original-content');
const seminarContent = document.getElementById('seminar-content');

// Get displacement map element
const feDisplacementMap = morphFilter.querySelector('feDisplacementMap');

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
  
  // Update displacement scale (reduces to 0)
  const currentDisplacementScale = DISPLACEMENT_SCALE * (1 - progress);
  
  // Update morphing shape
  morphingShape.setAttribute('x', currentX);
  morphingShape.setAttribute('y', currentY);
  morphingShape.setAttribute('width', currentWidth);
  morphingShape.setAttribute('height', currentHeight);
  
  // Update displacement filter
  feDisplacementMap.setAttribute('scale', currentDisplacementScale);
  
  // Update filter application
  if (currentDisplacementScale > 0) {
    morphingShape.setAttribute('filter', 'url(#morphFilter)');
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

