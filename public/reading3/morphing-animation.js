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

// Liquify control elements
const useVortexCheckbox = document.getElementById('use-vortex');
const octavesSlider = document.getElementById('octaves');
const displacementMultSlider = document.getElementById('displacement-mult');
const flowBiasSlider = document.getElementById('flow-bias');
const noiseScaleSlider = document.getElementById('noise-scale');
const vortexStrengthSlider = document.getElementById('vortex-strength');
const vortexRadius1Slider = document.getElementById('vortex-radius1');
const vortexRadius2Slider = document.getElementById('vortex-radius2');
const vortexRadius3Slider = document.getElementById('vortex-radius3');
const octavesValue = document.getElementById('octaves-value');
const displacementMultValue = document.getElementById('displacement-mult-value');
const flowBiasValue = document.getElementById('flow-bias-value');
const noiseScaleValue = document.getElementById('noise-scale-value');
const vortexStrengthValue = document.getElementById('vortex-strength-value');
const vortexRadius1Value = document.getElementById('vortex-radius1-value');
const vortexRadius2Value = document.getElementById('vortex-radius2-value');
const vortexRadius3Value = document.getElementById('vortex-radius3-value');
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

// Liquify control handlers
function updateLiquifyControls() {
  const useVortex = useVortexCheckbox.checked;
  const octaves = parseInt(octavesSlider.value);
  const displacementMult = parseFloat(displacementMultSlider.value);
  const flowBias = parseFloat(flowBiasSlider.value);
  const noiseScale = parseFloat(noiseScaleSlider.value);
  const vortexStrength = parseFloat(vortexStrengthSlider.value);
  const vortexRadius1 = parseFloat(vortexRadius1Slider.value);
  const vortexRadius2 = parseFloat(vortexRadius2Slider.value);
  const vortexRadius3 = parseFloat(vortexRadius3Slider.value);
  
  octavesValue.textContent = octaves;
  displacementMultValue.textContent = displacementMult.toFixed(1);
  flowBiasValue.textContent = flowBias.toFixed(2);
  noiseScaleValue.textContent = noiseScale.toFixed(2);
  vortexStrengthValue.textContent = vortexStrength.toFixed(1);
  vortexRadius1Value.textContent = vortexRadius1;
  vortexRadius2Value.textContent = vortexRadius2;
  vortexRadius3Value.textContent = vortexRadius3;
  
  if (webglMorph) {
    webglMorph.updateLiquifyParams({
      useVortex,
      octaves,
      displacementMult,
      flowBias,
      noiseScale,
      vortexStrength,
      vortexRadius1,
      vortexRadius2,
      vortexRadius3
    });
    updateAnimation();
  }
}

function resetLiquify() {
  useVortexCheckbox.checked = true;
  octavesSlider.value = 3;
  displacementMultSlider.value = 2.5;
  flowBiasSlider.value = 0.1;
  noiseScaleSlider.value = 0.3;
  vortexStrengthSlider.value = 0.5;
  vortexRadius1Slider.value = 300;
  vortexRadius2Slider.value = 300;
  vortexRadius3Slider.value = 300;
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

useVortexCheckbox.addEventListener('change', updateLiquifyControls);
octavesSlider.addEventListener('input', updateLiquifyControls);
displacementMultSlider.addEventListener('input', updateLiquifyControls);
flowBiasSlider.addEventListener('input', updateLiquifyControls);
noiseScaleSlider.addEventListener('input', updateLiquifyControls);
vortexStrengthSlider.addEventListener('input', updateLiquifyControls);
vortexRadius1Slider.addEventListener('input', updateLiquifyControls);
vortexRadius2Slider.addEventListener('input', updateLiquifyControls);
vortexRadius3Slider.addEventListener('input', updateLiquifyControls);
resetLiquifyBtn.addEventListener('click', resetLiquify);
toggleControlsBtn.addEventListener('click', toggleControls);

