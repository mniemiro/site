// Configuration
const SCREENS_TO_END = 1;
const APPEAR_THRESHOLD = 0.5;

// Animation parameter values
const params = {
  displacementScale: 500,
  baseFrequency: 0.001,
  numOctaves: 1,
  distortionPeak: 0.2
};

// WebGL renderer
let webglMorph = null;

// Get elements
const originalContent = document.getElementById('original-content');
const seminarContent = document.getElementById('seminar-content');
const webglCanvas = document.getElementById('webgl-canvas');

// Liquify control elements
const octavesSlider = document.getElementById('octaves');
const displacementMultSlider = document.getElementById('displacement-mult');
const flowBiasSlider = document.getElementById('flow-bias');
const noiseScaleSlider = document.getElementById('noise-scale');
const octavesValue = document.getElementById('octaves-value');
const displacementMultValue = document.getElementById('displacement-mult-value');
const flowBiasValue = document.getElementById('flow-bias-value');
const noiseScaleValue = document.getElementById('noise-scale-value');
const resetLiquifyBtn = document.getElementById('reset-liquify');
const toggleControlsBtn = document.getElementById('toggle-controls');
const controlsContent = document.getElementById('controls-content');

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

// Liquify control handlers
function updateLiquifyControls() {
  const octaves = parseInt(octavesSlider.value);
  const displacementMult = parseFloat(displacementMultSlider.value);
  const flowBias = parseFloat(flowBiasSlider.value);
  const noiseScale = parseFloat(noiseScaleSlider.value);
  
  octavesValue.textContent = octaves;
  displacementMultValue.textContent = displacementMult.toFixed(1);
  flowBiasValue.textContent = flowBias.toFixed(2);
  noiseScaleValue.textContent = noiseScale.toFixed(2);
  
  if (webglMorph) {
    webglMorph.updateLiquifyParams({
      octaves,
      displacementMult,
      flowBias,
      noiseScale
    });
    updateAnimation();
  }
}

function resetLiquify() {
  octavesSlider.value = 3;
  displacementMultSlider.value = 2.5;
  flowBiasSlider.value = 0.1;
  noiseScaleSlider.value = 0.3;
  updateLiquifyControls();
}

function toggleControls() {
  controlsContent.classList.toggle('hidden');
  toggleControlsBtn.textContent = controlsContent.classList.contains('hidden') ? '+' : '−';
}

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

octavesSlider.addEventListener('input', updateLiquifyControls);
displacementMultSlider.addEventListener('input', updateLiquifyControls);
flowBiasSlider.addEventListener('input', updateLiquifyControls);
noiseScaleSlider.addEventListener('input', updateLiquifyControls);
resetLiquifyBtn.addEventListener('click', resetLiquify);
toggleControlsBtn.addEventListener('click', toggleControls);

