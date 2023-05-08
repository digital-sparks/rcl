import Lenis from '@studio-freight/lenis';

// smooth page scroll
const pageScroller = new Lenis({
  wrapper: window,
  lerp: 0.2,
  duration: 1.2,
  infinite: false,
});

function raf(time: number) {
  pageScroller.raf(time);
  requestAnimationFrame(raf);
}

const scrollLinks = document.querySelectorAll('.footer_back');

scrollLinks.forEach((link) => {
  const target: string = link.getAttribute('href') || '';
  link.setAttribute('data-target', target);
  link.removeAttribute('href');
  link.addEventListener('click', (e) => {
    e.preventDefault();
    pageScroller.scrollTo(target, {
      lerp: 0.04,
    });
  });
});

requestAnimationFrame(raf);
