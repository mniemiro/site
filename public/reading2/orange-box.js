(() => {
  let ticking = false;
  let scrollDistance = 0;
  let boxHeightPx = 0;
  let minHeightPx = 0;
  let recentTerms = [];
  let currentTermIndex = 0;
  let scrollingAnimationId = null;
  let visibilityChangeHandler = null;

  const termBank = [
    'SEMIADDITIVITY',
    'AMBIDEXTERITY',
    'HIGHER CHARACTER CORRESPONDENCES',
    'TRANSCHROMATIC CHARACTER RINGS',
    'PARAMETRIZED SEMIADDITIVITY',
    'TEMPERED LOCAL SYSTEMS',
    'E<sub>n</sub>-MODULE LOCAL SYSTEMS + f<sub>!</sub> ⊣ f<sup>*</sup> ⊣ f<sub>*</sub>',
    'π-FINITE SPACES',
    'CATEGORICAL TRACES',
    'SPAN FUNCTORIALITY',
    'HIGHER INTEGRATION',
    'MODES',
    'TRACES',
    'ITERATED SPAN CATEGORIES',
    'DECORATED COSPANS',
    'THE 2-CATEGORY OF GROUPS',
    'Pr<sup>ʟ</sup>',
    'CATEGORIFICATION',
    'An<sup>π-fin</sup>-PARAMETRIZED CATEGORIES + L<sub>K(t)</sub>E<sub>n</sub>',
    'p-ADIC FREE LOOP SPACES',
    'KAN EXTENSIONS COMPUTED FIBERWISE',
    'HIGHER CARDINALITY',
    'ADJUNCTIONS',
    'HOMOTOPY THEORY',
    'HIGHER ∞-CATEGORY THEORY'
  ];

  function recalculateConstants() {
    const scrollSpeed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scroll-speed'));
    const boxHeightVh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--box-height'));
    boxHeightPx = (boxHeightVh / 100) * window.innerHeight;
    minHeightPx = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--min-height'));
    scrollDistance = scrollSpeed * window.innerHeight;
  }

  function getNextTerm() {
    if (currentTermIndex === 0) {
      currentTermIndex = 1;
      recentTerms = [termBank[0]];
      return termBank[0];
    }

    const availableTerms = termBank.filter(term => !recentTerms.includes(term));
    if (availableTerms.length === 0) {
      recentTerms = recentTerms.slice(-1);
    }

    const available = availableTerms.length > 0 ? availableTerms : termBank;
    const randomIndex = Math.floor(Math.random() * available.length);
    const selectedTerm = available[randomIndex];

    recentTerms.push(selectedTerm);
    if (recentTerms.length > 5) {
      recentTerms.shift();
    }

    return selectedTerm;
  }

  function updateTextSizes() {
    const orangeBox = document.querySelector('.orange-box');
    const initialText = document.querySelector('.initial-text');
    const scrollingTerms = document.querySelector('.scrolling-terms');
    const currentHeight = parseFloat(getComputedStyle(orangeBox).height);

    if (initialText && !initialText.classList.contains('hidden')) {
      const initialFontSize = Math.max(minHeightPx * 0.6, 10);
      initialText.style.fontSize = initialFontSize + 'px';
    }

    if (scrollingTerms && !scrollingTerms.classList.contains('hidden')) {
      const scrollingFontSize = Math.max(currentHeight * 0.8, 10);
      scrollingTerms.style.fontSize = scrollingFontSize + 'px';
      scrollingTerms.style.lineHeight = scrollingFontSize + 'px';
    }
  }

  function updateBoxHeight() {
    const scrollY = window.scrollY;
    const orangeBox = document.querySelector('.orange-box');

    if (!orangeBox) {
      return;
    }

    const t = Math.min(scrollY / scrollDistance, 1);
    const newHeight = minHeightPx + (boxHeightPx - minHeightPx) * (1 - Math.pow(t, 1.2));
    orangeBox.style.height = newHeight + 'px';
    updateTextSizes();
    ticking = false;
  }

  function startSmoothScrolling(initialPosition = null) {
    // Cancel any existing animation to prevent multiple animations running
    if (scrollingAnimationId) {
      cancelAnimationFrame(scrollingAnimationId);
      scrollingAnimationId = null;
    }

    // Remove any existing visibility change listener to prevent duplicates
    if (visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', visibilityChangeHandler);
      visibilityChangeHandler = null;
    }

    const scrollingTerms = document.querySelector('.scrolling-terms');
    const orangeBox = document.querySelector('.orange-box');
    const baseScrollSpeed = 100; // Base speed in pixels per second
    const boxWidth = orangeBox.offsetWidth;
    let position = initialPosition ?? (parseFloat(scrollingTerms.style.left) || boxWidth);
    let lastTime = performance.now();
    let isPaused = false;

    visibilityChangeHandler = () => {
      if (document.hidden) {
        isPaused = true;
        if (scrollingAnimationId) {
          cancelAnimationFrame(scrollingAnimationId);
        }
      } else {
        isPaused = false;
        lastTime = performance.now();
        scrollingAnimationId = requestAnimationFrame(animate);
      }
    };

    document.addEventListener('visibilitychange', visibilityChangeHandler);

    function animate(currentTime) {
      if (isPaused) return;
      
      // Log first frame to confirm animation is running
      if (!window._animateStarted) {
        window._animateStarted = true;
        console.log('Animation started, animate function is running');
      }

      let deltaTime = (currentTime - lastTime) / 1000;
      if (deltaTime > 0.1) {
        deltaTime = 0.1;
      }
      lastTime = currentTime;

      const currentHeight = parseFloat(getComputedStyle(orangeBox).height);
      const fontSize = Math.max(currentHeight * 0.8, 10);
      scrollingTerms.style.fontSize = fontSize + 'px';
      scrollingTerms.style.lineHeight = fontSize + 'px';

      // Recalculate max box height to ensure it's current
      const boxHeightVh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--box-height'));
      const maxBoxHeight = (boxHeightVh / 100) * window.innerHeight;

      // Calculate speed multiplier based on box height
      // At max height: 3.0x speed (200% increase), at half height and below: 1.0x speed
      const halfHeight = maxBoxHeight / 2;
      let speedMultiplier = 1.0;
      if (currentHeight > halfHeight && maxBoxHeight > 0) {
        // Linear interpolation between half height (1.0x) and max height (3.0x)
        const ratio = (currentHeight - halfHeight) / (maxBoxHeight - halfHeight);
        speedMultiplier = 1.0 + (2.0 * ratio);
      }
      const scrollSpeed = baseScrollSpeed * speedMultiplier;
      
      // Debug logging (remove after testing)
      // Log every 60 frames (~1 second at 60fps) to see speed changes
      if (!window._speedDebugFrameCount) window._speedDebugFrameCount = 0;
      window._speedDebugFrameCount++;
      if (window._speedDebugFrameCount % 60 === 0) {
        console.log('Speed debug:', {
          currentHeight: currentHeight.toFixed(1),
          maxBoxHeight: maxBoxHeight.toFixed(1),
          halfHeight: halfHeight.toFixed(1),
          speedMultiplier: speedMultiplier.toFixed(2),
          scrollSpeed: scrollSpeed.toFixed(1)
        });
      }

      position -= scrollSpeed * deltaTime;

      const textWidth = scrollingTerms.offsetWidth;
      if (position + textWidth < boxWidth + 300) {
        const nextTerm = getNextTerm();
        const currentHTML = scrollingTerms.innerHTML.trim();
        scrollingTerms.innerHTML = currentHTML ? currentHTML + ' + ' + nextTerm : nextTerm;
      }

      if (position + textWidth < -200) {
        const nextTerm = getNextTerm();
        scrollingTerms.innerHTML = nextTerm;
        position = boxWidth;
      }

      scrollingTerms.style.left = position + 'px';
      scrollingAnimationId = requestAnimationFrame(animate);
    }

    console.log('startSmoothScrolling called, starting animation');
    scrollingAnimationId = requestAnimationFrame(animate);
  }

  function startScrollingTerms() {
    const scrollingTerms = document.querySelector('.scrolling-terms');
    const initialText = document.querySelector('.initial-text');
    if (!scrollingTerms) {
      console.error('scrolling-terms element not found!');
      return;
    }


    // Keep element hidden but make it participate in layout for measurement
    scrollingTerms.classList.remove('hidden');
    scrollingTerms.style.opacity = '0';
    scrollingTerms.style.pointerEvents = 'none';

    const orangeBox = document.querySelector('.orange-box');
    const boxWidth = orangeBox.offsetWidth;
    
    // Anchor to right edge so content grows leftward as terms are added
    scrollingTerms.style.left = 'auto';
    scrollingTerms.style.right = '0';

    function seedScrollingText() {
      const bufferWidth = window.innerWidth * 1.5;
      const firstTerm = getNextTerm();
      let content = `<span class="first-term-marker">${firstTerm}</span>`;
      scrollingTerms.innerHTML = content;

      while (scrollingTerms.offsetWidth < bufferWidth) {
        const nextTerm = getNextTerm();
        content += ' + ' + nextTerm;
        scrollingTerms.innerHTML = content;
      }
    }
    
    seedScrollingText();
    updateTextSizes();
    
    // Keep right-anchored for now, we'll measure and position after layout
    const jumpSize = boxWidth * 0.3;
    const jerkDelay = 650;

    function setupAndStartJerks() {
      // Now measure after layout has occurred
      const textWidth = scrollingTerms.offsetWidth;
      // Start from right edge: if text is wider than box, start at boxWidth (off-screen to the right)
      // Otherwise, start so right edge of text aligns with right edge of box
      const startLeft = textWidth <= boxWidth ? boxWidth - textWidth : boxWidth;
      
      // Convert to left positioning for animation
      scrollingTerms.style.right = 'auto';
      scrollingTerms.style.left = startLeft + 'px';
      
      const positions = [];
      let currentPosition = startLeft;

      positions.push(currentPosition);
      while (currentPosition - jumpSize > 0) {
        currentPosition -= jumpSize;
        positions.push(currentPosition);
      }

      if (positions[positions.length - 1] !== 0) {
        positions.push(0);
      }

      function performJerkyIntro(step = 0) {
        if (step >= positions.length) {
          return;
        }
        if (step === 0) {
          // Make visible only when starting the jerky animation
          scrollingTerms.style.opacity = '1';
          scrollingTerms.style.pointerEvents = '';
        }
        scrollingTerms.style.left = positions[step] + 'px';

        if (step === positions.length - 1) {
          startSmoothScrolling(positions[step]);
        } else {
          setTimeout(() => performJerkyIntro(step + 1), jerkDelay);
        }
      }

      performJerkyIntro();
    }

    // Wait for layout before measuring and starting jerks
    requestAnimationFrame(() => {
      requestAnimationFrame(setupAndStartJerks);
    });
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateBoxHeight);
      ticking = true;
    }
  }

  function initOrangeBox() {
    recalculateConstants();
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', () => {
      recalculateConstants();
      updateBoxHeight();
      updateTextSizes();
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        updateBoxHeight();
      });
    } else {
      updateBoxHeight();
    }

    window.addEventListener('load', () => {
      window.scrollTo(0, 0);
      recalculateConstants();
      updateBoxHeight();

      setTimeout(() => {
        startScrollingTerms();
      }, 1250);
    });
  }

  initOrangeBox();
})();

