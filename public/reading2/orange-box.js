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
    const scrollingTerms = document.querySelector('.scrolling-terms');
    const orangeBox = document.querySelector('.orange-box');
    const scrollSpeed = 100;
    const boxWidth = orangeBox.offsetWidth;
    let position = initialPosition ?? (parseFloat(scrollingTerms.style.left) || boxWidth);
    let lastTime = performance.now();
    let isPaused = false;

    if (visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', visibilityChangeHandler);
    }

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

      let deltaTime = (currentTime - lastTime) / 1000;
      if (deltaTime > 0.1) {
        deltaTime = 0.1;
      }
      lastTime = currentTime;

      const currentHeight = parseFloat(getComputedStyle(orangeBox).height);
      const fontSize = Math.max(currentHeight * 0.8, 10);
      scrollingTerms.style.fontSize = fontSize + 'px';
      scrollingTerms.style.lineHeight = fontSize + 'px';

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
    const computedBg = getComputedStyle(scrollingTerms).backgroundColor;
    if (!scrollingTerms.dataset.originalBg) {
      scrollingTerms.dataset.originalBg = computedBg;
    }
    scrollingTerms.style.opacity = '0';
    scrollingTerms.style.pointerEvents = 'none';
    scrollingTerms.style.backgroundColor = 'rgba(255, 160, 0, 0)';

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
    
    // Convert to left positioning for animation (right edge at boxWidth means left at boxWidth - textWidth)
    const textWidth = scrollingTerms.offsetWidth;
    const startLeft = boxWidth - textWidth;
    scrollingTerms.style.right = 'auto';
    scrollingTerms.style.left = startLeft + 'px';
    const jumpSize = boxWidth * 0.3;
    const jerkDelay = 300;

    function setupAndStartJerks() {
      const positions = [];
      // Start from current position (where right edge was anchored)
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
          scrollingTerms.style.backgroundColor = scrollingTerms.dataset.originalBg || computedBg;
        }
        scrollingTerms.style.left = positions[step] + 'px';
        
        // Hide initial text when scrolling text reaches center (would cover it)
        const textWidth = scrollingTerms.offsetWidth;
        const centerX = boxWidth / 2;
        if (initialText && !initialText.classList.contains('hidden') && 
            positions[step] + textWidth > centerX && positions[step] < centerX) {
          initialText.classList.add('hidden');
        }

        if (step === positions.length - 1) {
          startSmoothScrolling(positions[step]);
        } else {
          setTimeout(() => performJerkyIntro(step + 1), jerkDelay);
        }
      }

      performJerkyIntro();
    }

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
      }, 1000);
    });
  }

  initOrangeBox();
})();

