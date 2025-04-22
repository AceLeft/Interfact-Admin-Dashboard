import gsap from 'gsap';

const ease = 'power4.inOut';
let isAnimating = false;
let lastNavigatedPath = ''; 

export function isPageAnimating() {
  return isAnimating;
}

export function runPageTransition(reset) {
  if (isAnimating) return Promise.resolve(); 

  isAnimating = true;

  return new Promise((resolve) => {
    if (reset === '/dashboard') lastNavigatedPath = '/dashboard';
    else lastNavigatedPath = '';
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
      onComplete: resolve,
    });
  });
}

export function revealTransition() {
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

    if (
      !href || href.startsWith('#') || href === pathname || href === lastNavigatedPath ||  isAnimating
    ) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    
    runPageTransition(false).then(() => {
      router.push(href);
      lastNavigatedPath = href;
    });
  };


  document.querySelectorAll('a[href]').forEach((link) => {
    link.removeEventListener('click', handleClick); 
    link.addEventListener('click', handleClick); 
  });

  revealTransition();
}
