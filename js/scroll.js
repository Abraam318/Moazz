(() => {
  const animatedSelectors = ['.fade-up', '.reveal-left', '.reveal-right', '.reveal-bottom'];
  let ticking = false;
  let hero = null;
  let scrollIndicator = null;
  let scrollSpeedElements = [];
  const mobileMatch = window.matchMedia('(max-width: 768px)');

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  const initAnimations = () => {
    animatedSelectors
      .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
      .forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index * 80, 400)}ms`;
        observer.observe(element);
      });
  };

  const cacheRefs = () => {
    hero = document.querySelector('[data-parallax]');
    scrollIndicator = document.querySelector('.scroll-indicator');
    scrollSpeedElements = Array.from(document.querySelectorAll('[data-scroll-speed]'));
  };

  const handleParallax = () => {
    if (!hero) return;
    const strength = mobileMatch.matches ? 0.08 : 0.2;
    const offset = window.scrollY * strength;
    hero.style.transform = `translate3d(0, ${offset}px, 0)`;
  };

  const handleScrollSpeedElements = () => {
    if (!scrollSpeedElements.length) return;
    const modifier = mobileMatch.matches ? 0.55 : 1;
    scrollSpeedElements.forEach((element) => {
      const speed = parseFloat(element.dataset.scrollSpeed || '0');
      const translate = window.scrollY * speed * modifier;
      element.style.transform = `translate3d(0, ${translate}px, 0)`;
    });
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleParallax();
        handleScrollSpeedElements();
        if (scrollIndicator) {
          scrollIndicator.style.opacity = window.scrollY > 120 ? '0' : '1';
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  const handleMediaChange = () => {
    handleParallax();
    handleScrollSpeedElements();
  };

  mobileMatch.addEventListener?.('change', handleMediaChange);

  document.addEventListener('DOMContentLoaded', () => {
    cacheRefs();
    initAnimations();
    handleParallax();
    handleScrollSpeedElements();
    window.addEventListener('scroll', onScroll, { passive: true });
  });
})();
