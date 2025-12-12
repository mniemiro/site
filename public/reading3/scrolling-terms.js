(() => {
  let recentTerms = [];
  let currentTermIndex = 0;
  let scrollingAnimationId = null;
  let visibilityChangeHandler = null;
  let hasStarted = false;
  let termBank = [];
  let termsLoaded = false;

  // Load terms from current.json
  async function loadTerms() {
    try {
      const response = await fetch('data/current.json');
      if (!response.ok) {
        throw new Error(`Failed to load terms data: ${response.status}`);
      }
      const data = await response.json();
      if (data.terms && Array.isArray(data.terms)) {
        termBank = data.terms;
        termsLoaded = true;
      } else {
        console.warn('No terms array found in current.json, using empty array');
        termBank = [];
        termsLoaded = true;
      }
    } catch (error) {
      console.error('Error loading terms:', error);
      termBank = [];
      termsLoaded = true;
    }
  }

  function getNextTerm() {
    if (termBank.length === 0) {
      return '';
    }

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
    if (!scrollingTerms || !orangeBox) {
      return;
    }

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

      let deltaTime = (currentTime - lastTime) / 1000;
      if (deltaTime > 0.1) {
        deltaTime = 0.1;
      }
      lastTime = currentTime;

      position -= baseScrollSpeed * deltaTime;

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
    if (hasStarted) return;
    if (!termsLoaded || termBank.length === 0) {
      // Wait for terms to load
      return;
    }
    hasStarted = true;

    const scrollingTerms = document.querySelector('.scrolling-terms');
    const orangeBox = document.querySelector('.orange-box');
    if (!scrollingTerms || !orangeBox) {
      console.error('scrolling-terms or orange-box element not found!');
      return;
    }

    // Keep element hidden but make it participate in layout for measurement
    scrollingTerms.classList.remove('hidden');
    scrollingTerms.style.opacity = '0';
    scrollingTerms.style.pointerEvents = 'none';

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
    
    // Keep right-anchored for now, we'll measure and position after layout
    const jumpSize = boxWidth * 0.3;
    const jerkDelay = 550;

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

  function checkAndStart() {
    const seminarContent = document.querySelector('#seminar-content');
    if (seminarContent && seminarContent.classList.contains('active')) {
      // Wait a bit after the animation completes before starting
      setTimeout(() => {
        startScrollingTerms();
      }, 500);
    }
  }

  // Check periodically if the animation has completed
  async function initScrollingTerms() {
    // Load terms first
    await loadTerms();
    
    // Check immediately after terms are loaded
    checkAndStart();
    
    // Also check periodically in case the class is added later
    const checkInterval = setInterval(() => {
      if (hasStarted) {
        clearInterval(checkInterval);
        return;
      }
      checkAndStart();
    }, 100);

    // Also listen for class changes on the seminar content
    const seminarContent = document.querySelector('#seminar-content');
    if (seminarContent) {
      const observer = new MutationObserver(() => {
        if (!hasStarted) {
          checkAndStart();
        }
      });
      observer.observe(seminarContent, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollingTerms);
  } else {
    initScrollingTerms();
  }
})();

