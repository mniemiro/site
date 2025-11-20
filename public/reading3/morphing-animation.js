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

// Lens control elements
const lens1XSlider = document.getElementById('lens1-x');
const lens1YSlider = document.getElementById('lens1-y');
const lens1RadiusSlider = document.getElementById('lens1-radius');
const lens1K1Slider = document.getElementById('lens1-k1');
const lens2XSlider = document.getElementById('lens2-x');
const lens2YSlider = document.getElementById('lens2-y');
const lens2RadiusSlider = document.getElementById('lens2-radius');
const lens2K1Slider = document.getElementById('lens2-k1');
const resetLensBtn = document.getElementById('reset-lens');
const toggleLensControlsBtn = document.getElementById('toggle-lens-controls');
const lensControlsContent = document.getElementById('lens-controls-content');

const lens1XValue = document.getElementById('lens1-x-value');
const lens1YValue = document.getElementById('lens1-y-value');
const lens1RadiusValue = document.getElementById('lens1-radius-value');
const lens1K1Value = document.getElementById('lens1-k1-value');
const lens2XValue = document.getElementById('lens2-x-value');
const lens2YValue = document.getElementById('lens2-y-value');
const lens2RadiusValue = document.getElementById('lens2-radius-value');
const lens2K1Value = document.getElementById('lens2-k1-value');

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
updateLensControls(); // Initialize lens parameters
updateAnimation();

// Event listeners
window.addEventListener('scroll', throttledUpdateAnimation, { passive: true });
window.addEventListener('resize', () => {
  updateDimensions();
  if (webglMorph) webglMorph.resize();
  updateAnimation();
});

// Lens control event listeners
function updateLensControls() {
  const lens1X = parseFloat(lens1XSlider.value);
  const lens1Y = parseFloat(lens1YSlider.value);
  const lens1Radius = parseFloat(lens1RadiusSlider.value);
  const lens1K1 = parseFloat(lens1K1Slider.value);
  const lens2X = parseFloat(lens2XSlider.value);
  const lens2Y = parseFloat(lens2YSlider.value);
  const lens2Radius = parseFloat(lens2RadiusSlider.value);
  const lens2K1 = parseFloat(lens2K1Slider.value);
  
  lens1XValue.textContent = lens1X.toFixed(2);
  lens1YValue.textContent = lens1Y.toFixed(2);
  lens1RadiusValue.textContent = lens1Radius.toFixed(2);
  lens1K1Value.textContent = lens1K1.toFixed(1);
  lens2XValue.textContent = lens2X.toFixed(2);
  lens2YValue.textContent = lens2Y.toFixed(2);
  lens2RadiusValue.textContent = lens2Radius.toFixed(2);
  lens2K1Value.textContent = lens2K1.toFixed(1);
  
  if (webglMorph) {
    webglMorph.updateLiquifyParams({
      lens1X,
      lens1Y,
      lens1Radius,
      lens1K1,
      lens2X,
      lens2Y,
      lens2Radius,
      lens2K1
    });
    updateAnimation();
  }
}

function resetLens() {
  lens1XSlider.value = 0.3;
  lens1YSlider.value = 0.3;
  lens1RadiusSlider.value = 0.25;
  lens1K1Slider.value = 0.5;
  lens2XSlider.value = 0.7;
  lens2YSlider.value = 0.7;
  lens2RadiusSlider.value = 0.25;
  lens2K1Slider.value = 0.5;
  updateLensControls();
}

function toggleLensControls() {
  lensControlsContent.classList.toggle('hidden');
  toggleLensControlsBtn.textContent = lensControlsContent.classList.contains('hidden') ? '+' : '−';
}

lens1XSlider.addEventListener('input', updateLensControls);
lens1YSlider.addEventListener('input', updateLensControls);
lens1RadiusSlider.addEventListener('input', updateLensControls);
lens1K1Slider.addEventListener('input', updateLensControls);
lens2XSlider.addEventListener('input', updateLensControls);
lens2YSlider.addEventListener('input', updateLensControls);
lens2RadiusSlider.addEventListener('input', updateLensControls);
lens2K1Slider.addEventListener('input', updateLensControls);
resetLensBtn.addEventListener('click', resetLens);
toggleLensControlsBtn.addEventListener('click', toggleLensControls);

