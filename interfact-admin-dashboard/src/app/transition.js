import gsap from 'gsap';

const ease = 'power4.inOut';
let isAnimating = false;
let lastPath = ''; // Keep track of the last successful route change

export function isPageAnimating() {
  return isAnimating;
}

export function animateToPage(router, href, currentPathname) {
  if (!href || href.startsWith('#') || isAnimating || href === currentPathname) return;

  isAnimating = true;

  return new Promise((resolve) => {
    gsap.set('.block', { visibility: 'visible', scaleY: 0 });
    gsap.to('.block', {
      scaleY: 1,
      duration: 1,
      stagger: {
        each: 0.1,
        from: 'start',
        grid: [2, 5],
        axis: 'x',
      },
      ease,
      onComplete: () => {
        lastPath = href; // Update last path AFTER animation completes
        router.push(href);
        resolve();
      },
    });
  });
}

function revealTransition() {
  return new Promise((resolve) => {
    gsap.set('.block', { scaleY: 1 });
    gsap.to('.block', {
      scaleY: 0,
      duration: 1,
      stagger: {
        each: 0.1,
        from: 'start',
        grid: 'auto',
        axis: 'x',
      },
      ease,
      onComplete: () => {
        gsap.set('.block', { visibility: 'hidden' });
        isAnimating = false;
        resolve();
      },
    });
  });
}

export function setupPageTransitions({ router, pathname }) {
  if (typeof window === 'undefined') return;

  const handleClick = (event) => {
    const link = event.currentTarget;
    const href = link.getAttribute('href');

    // Prevent animation on same page or during animation
    if (!href || href.startsWith('#') || isAnimating || href === lastPath) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    animateToPage(router, href, pathname);
  };

  // Clean up and re-attach listeners
  document.querySelectorAll('a').forEach((link) => {
    link.removeEventListener('click', handleClick);
    link.addEventListener('click', handleClick);
  });

  // Trigger reveal animation on mount
  revealTransition();
}
