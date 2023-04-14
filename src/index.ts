import 'swiper/css/effect-fade';

import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import createShadow from 'node_modules/swiper/shared/create-shadow.js';
import effectInit from 'node_modules/swiper/shared/effect-init.js';
import effectTarget from 'node_modules/swiper/shared/effect-target.js';
import effectVirtualTransitionEnd from 'node_modules/swiper/shared/effect-virtual-transition-end.js';
import { getSlideTransformEl } from 'node_modules/swiper/shared/utils.js';
import { PowerGlitch } from 'powerglitch';
import Swiper, { EffectCards, EffectFade, Navigation, Pagination } from 'swiper';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(async () => {
  console.log(window.Webflow.scroll);
  PowerGlitch.glitch('.logo svg', {
    playMode: 'always',
    createContainers: true,
    hideOverflow: true,
    timing: {
      duration: 3000,
    },
    glitchTimeSpan: {
      start: 0,
      end: 3,
    },
    shake: {
      velocity: 14,
      amplitudeX: 0.002,
      amplitudeY: 0.005,
    },
    slice: {
      count: 3,
      velocity: 9,
      minHeight: 0.02,
      maxHeight: 0.1,
      hueRotate: true,
    },
    pulse: false,
  });

  PowerGlitch.glitch('.hero-circle', {
    playMode: 'always',
    createContainers: true,
    hideOverflow: false,
    timing: {
      duration: 1000,
    },
    glitchTimeSpan: {
      start: 0,
      end: 1,
    },
    shake: {
      velocity: 2,
      amplitudeX: 0.005,
      amplitudeY: 0.005,
    },
    slice: {
      count: 0,
      velocity: 8,
      minHeight: 0.001,
      maxHeight: 0.05,
      hueRotate: false,
    },
    pulse: true,
  });

  // smooth page scroll
  const pageScroller = new Lenis({
    wrapper: window,
    lerp: 0.2,
    duration: 1.2,
    infinite: false,
  });
  function raf(time) {
    pageScroller.raf(time);
    requestAnimationFrame(raf);
  }

  const scrollLinks = document.querySelectorAll('.scroll-navigation_link');

  scrollLinks.forEach((link, index) => {
    const target: string = link.getAttribute('href') || '';
    link.setAttribute('data-target', target);
    link.removeAttribute('href');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      pageScroller.scrollTo(target, {
        lerp: 0.04,
        duration: 5,
      });
    });
  });

  // pageScroller.on('scroll', (e) => {
  //   console.log(pageScroller);
  // });

  requestAnimationFrame(raf);

  // attribute value checker
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== 'string' || attrVal.trim() === '') return defaultVal;
    if (attrVal === 'true' && defaultValType === 'boolean') return true;
    if (attrVal === 'false' && defaultValType === 'boolean') return false;
    if (isNaN(attrVal) && defaultValType === 'string') return attrVal;
    if (!isNaN(attrVal) && defaultValType === 'number') return +attrVal;
    return defaultVal;
  }
  // marquee component
  document.querySelectorAll("[tr-marquee-element='component']").forEach(function (element, index) {
    // console.log(element);
    const componentEl = element;
    const panelEl = componentEl.querySelectorAll("[tr-marquee-element='panel']");
    // const triggerHoverEl = componentEl.querySelector("[tr-marquee-element='triggerhover']"));
    // const triggerClickEl = componentEl.querySelector("[tr-marquee-element='triggerclick']");
    let speedSetting = attr(100, componentEl.getAttribute('tr-marquee-speed'));
    const verticalSetting = attr(false, componentEl.getAttribute('tr-marquee-vertical'));
    const reverseSetting = attr(false, componentEl.getAttribute('tr-marquee-reverse'));
    const scrollDirectionSetting = attr(
      false,
      componentEl.getAttribute('tr-marquee-scrolldirection')
    );
    const scrollScrubSetting = attr(false, componentEl.getAttribute('tr-marquee-scrollscrub'));
    let moveDistanceSetting = -100;
    let timeScaleSetting = 1;
    const pausedStateSetting = false;

    if (reverseSetting) moveDistanceSetting = 100;
    const marqueeTimeline = gsap.timeline({
      repeat: -1,
      onReverseComplete: () => marqueeTimeline.progress(1),
    });

    // console.log(panelEl?.clientWidth);

    speedSetting = panelEl[0]?.clientWidth / speedSetting;

    marqueeTimeline.fromTo(
      panelEl,
      { xPercent: 0 },
      { xPercent: moveDistanceSetting, ease: 'none', duration: speedSetting }
    );

    const scrubObject = { value: 1 };
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (!pausedStateSetting) {
          if (scrollDirectionSetting && timeScaleSetting !== self.direction) {
            timeScaleSetting = self.direction;
            marqueeTimeline.timeScale(self.direction);
          }
          if (scrollScrubSetting) {
            // console.log(pageScroller.velocity);
            let v = pageScroller.velocity * 0.5; // self.getVelocity() * 0.006;
            v = gsap.utils.clamp(-60, 60, v);
            const scrubTimeline = gsap.timeline({
              onUpdate: () => marqueeTimeline.timeScale(scrubObject.value),
            });
            scrubTimeline.fromTo(
              scrubObject,
              { value: v },
              { value: timeScaleSetting, duration: 0.5 }
            );
          }
        }
      },
    });
    // function pauseMarquee(isPausing) {
    //   pausedStateSetting = isPausing;
    //   const pauseObject = { value: 1 };
    //   const pauseTimeline = gsap.timeline({
    //     onUpdate: () => marqueeTimeline.timeScale(pauseObject.value),
    //   });
    //   if (isPausing) {
    //     pauseTimeline.fromTo(pauseObject, { value: timeScaleSetting }, { value: 0, duration: 0.5 });
    //     triggerClickEl.addClass('is-paused');
    //   } else {
    //     pauseTimeline.fromTo(pauseObject, { value: 0 }, { value: timeScaleSetting, duration: 0.5 });
    //     triggerClickEl.removeClass('is-paused');
    //   }
    // }
  });

  const collectionCardSwiper = new Swiper('.swiper.collection-card_container', {
    // wrapperClass: 'div-block-8',
    // slideClass: 'collection-card',
    effect: 'cards',
    centeredSlides: true,
    cardsEffect: {
      rotate: true,
      perSlideRotate: 3,
      perSlideOffset: 2,
      slideShadows: false,
    },
    grabCursor: true,
    loop: true,
    observer: true,
    resizeObserver: true,
    breakpoints: {
      991: {
        enabled: false,
      },
    },
    on: {
      afterInit: function (swiper) {
        console.log(swiper.params.speed);
        // console.log(swiper);
        // console.log(swiper.slidesEl);
        // const randomRotation = [];
        // swiper.slides.forEach((slide, i) => {
        //   randomRotation[i] = Math.random() * 8;
        // });
        // console.lg
      },
    },
    // keyboard: true,
    modules: [EffectCards],
  });

  const collectionCards = document.querySelectorAll('.collection-card_component');
  let zIndex = 4;

  collectionCards.forEach((collectionCard: Element) => {
    const rgbColor = collectionCard.querySelector('.collection-card_face')?.style?.borderColor;

    collectionCard.addEventListener('mouseover', function () {
      collectionCard.parentNode.style.zIndex = zIndex;
      zIndex++;
    });
    // collectionCard.addEventListener('mouseout', function () {
    //   const baseZindex = collectionCard.parentNode.getAttribute('data-z-index');
    //   collectionCard.parentNode.style.zIndex = baseZindex;
    // });

    collectionCard.addEventListener('click', function () {
      const faceWrap = this.querySelector('.collection-card_faces-wrap');

      if (!this.dataset.clicked) {
        collectionCards.forEach((collectionCard) => {
          const card = collectionCard.querySelector('.collection-card_faces-wrap');
          gsap.to(card, { rotationY: 0, duration: 0.6, ease: 'sine.out' });
          collectionCard.removeAttribute('data-clicked');

          // const baseZindex = collectionCard.parentNode.getAttribute('data-z-index');
          // collectionCard.parentNode.style.zIndex = baseZindex;
        });

        this.setAttribute('data-clicked', 'true');

        gsap.to(faceWrap, {
          rotationY: 180,
          duration: 0.6,
          ease: 'sine.out',
          onStart: animateScore,
        });
      } else {
        this.removeAttribute('data-clicked');
        gsap.to(faceWrap, {
          rotationY: 0,
          duration: 0.6,
          ease: 'sine.out',
        });
      }
    });

    // animate the score on the back of the collectionCard
    function animateScore() {
      const scores = collectionCard.querySelectorAll('.collection-card_score');

      scores.forEach(function (score: Element, i: number) {
        const totalScore = score.dataset.count;

        let list = score.querySelectorAll('.collection-card_score_bar');
        const styleValues = [
          { key: 'boxShadow', value: `0px 0px 6px ${rgbColor}` },
          { key: 'backgroundColor', value: rgbColor },
        ];
        if (list.length === 0) {
          list = score.querySelectorAll('.collection-card_score_icon svg');
          styleValues[0].key = 'filter';
          styleValues[0].value = `drop-shadow(0 0 .5rem ${rgbColor})`;
          styleValues[1].key = 'fill';
        }

        const dots = Array.prototype.slice.call(list, 0, totalScore);

        setTimeout(() => {
          gsap.to(dots, {
            [styleValues[0].key]: styleValues[0].value,
            [styleValues[1].key]: styleValues[1].value,
            delay: 0.3,
            duration: 0.2,
            stagger: 0.05,
          });
        }, i * 75);
      });
    }
  });

  // ——————————————————————————————————————————————————
  // TextScramble
  // ——————————————————————————————————————————————————

  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => (this.resolve = resolve));
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="dud">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  // ——————————————————————————————————————————————————
  // Example
  // ——————————————————————————————————————————————————

  const phrases = ['Incoming Transmission'];

  const el = document.querySelectorAll('[type-el]');

  const next = () => {
    el.forEach((item) => {
      const fx = new TextScramble(item);
      fx.setText(phrases[0]);
    });
  };

  ////

  const panelComponents = document.querySelectorAll('.panel_component');

  panelComponents.forEach((panel) => {
    const size = {
      width: panel.querySelector('.panel_box-component')?.clientWidth,
      height: panel.querySelector('.panel_box-component')?.clientHeight,
    };

    panel.querySelector('.panel_box-component').style.minHeight = size.height + 'px';

    if (panel.querySelector('.panel_box_loader') != null) {
      panel.querySelector('.panel2_box_padding').style.minWidth = size.width + 'px';
      panel.querySelector('.panel_box_loader').style.minWidth = size.width + 'px';
      panel.querySelectorAll('[type-el=""]').textContent = '';
    } else {
      panel.querySelector('.panel_box_padding').style.minWidth = size.width + 'px';
    }

    const panelEl = panel.querySelector('.panel_box_width');
    const cornersEl = panel.querySelector('.panel_corner-wrap');

    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top 50%', // 10% of .panel2 enters the bottom of the viewport
        },
      })
      .fromTo(
        panelEl,
        {
          // duration: 0,
          height: 0,
          width: 0,
        },
        {
          height: 'auto',
          duration: 0.4,
          ease: 'power2.out',
        }
      )
      .fromTo(
        cornersEl,
        {
          transform: 'scale(0.99)',
          width: '80%',
          opacity: 0,
        },
        {
          width: '100%',
          transform: 'scale(1)',
          opacity: 1,
          duration: 0.4,
          // delay: 0.1,
          ease: 'power2.out',
        }
      )
      .to(
        panelEl,
        {
          delay: 0.05,
          duration: 1.2,
          ease: 'power2.out',
          width: '100%',
        },
        '<'
      )
      .fromTo(
        '.div-block-28',
        {
          width: 0,
          duration: 0,
          onComplete: next,
        },
        {
          width: '100%',
          duration: 2,
          delay: 0.1,
          ease: 'power2.out',
        }
      )
      .to('.panel_box_loader', {
        opacity: 0,
        onComplete: function () {
          document.querySelector('.panel_box_loader').style.display = 'none';
        },
      })
      .fromTo(
        '.panel_box_container',
        {
          opacity: 0,
        },
        {
          opacity: 1,
        },
        '<'
      );
  });

  function updatePanelWidth() {
    panelComponents.forEach((panel) => {
      panel.querySelector('.panel_box_padding').style.minWidth =
        panel.querySelector('.panel_box-component')?.clientWidth + 'px';
      if (panel.querySelector('.panel_box_loader') != null) {
        panel.querySelector('.panel_box_loader').style.minWidth = '0px';
      }

      panel.querySelector('.panel_box-component').style.minHeight =
        panel.querySelector('.panel_box_width')?.clientHeight + 'px';
    });
  }

  const pagination: Element = document.querySelector('[swiper="pagination"]');
  const swiperContainer: Element = document.querySelector('[swiper="container"]');
  swiperContainer?.append(pagination);

  /*----------------------------*/
  /* UPDATE ON RESIZE           */

  let resizeTimeout,
    currentWindowWidth: number = document.documentElement.clientWidth,
    oldWindowWidth: number = currentWindowWidth,
    initTeamCardSwiper = false,
    teamCardSwiper;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      currentWindowWidth = document.documentElement.clientWidth;
      if (oldWindowWidth !== currentWindowWidth) {
        console.log(currentWindowWidth);
        swiperCard(currentWindowWidth);
        oldWindowWidth = currentWindowWidth;
        updatePanelWidth();
      }
    }, 75);
  });

  window.addEventListener('load', () => {
    swiperCard(currentWindowWidth);
  });

  /* END                        */
  /*----------------------------*/

  function swiperCard(windowWidth: number) {
    if (windowWidth <= 1200 && !initTeamCardSwiper) {
      initTeamCardSwiper = true;
      teamCardSwiper = new Swiper('.team-card_container', {
        wrapperClass: 'team-card_wrapper',
        slideClass: 'team-card_slide',
        slidesPerView: 'auto',
        speed: 500,
        centeredSlides: true,
        spaceBetween: 48,
        loop: true,
        grabCursor: true,
        autoHeight: false,
        pagination: {
          el: '.swiper-pagination-wrap',
          bulletClass: 'bullet-small',
          bulletActiveClass: 'is-active',
          clickable: true,
          type: 'bullets',
        },
        breakpoints: {
          1200: {
            enabled: false,
            centeredSlides: false,
          },
          991: {
            spaceBetween: 80,
            speed: 700,
          },
          768: {
            spaceBetween: 64,
            speed: 650,
          },
        },
        // keyboard: true,
        modules: [Pagination],
      });
    } else if (windowWidth > 1200 && initTeamCardSwiper) {
      teamCardSwiper.destroy(true, true);
      initTeamCardSwiper = false;
    }
  }

  // alert('hi');

  const panelSwiper = new Swiper('.panel_box_container', {
    // wrapperClass: 'panel_wrapper',
    // slideClass: 'panel_slide',
    slidesPerView: 1,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    speed: 1000,
    centeredSlides: true,
    grabCursor: false,
    autoHeight: false,
    pagination: {
      el: '.swiper-pagination-wrap',
      bulletClass: 'bullet-large',
      bulletActiveClass: 'is-active',
      clickable: true,
      type: 'bullets',
    },
    navigation: {
      nextEl: '.swiper_button-next',
      prevEl: '.swiper_button-prev',
    },
    breakpoints: {
      991: {
        allowTouchMove: false,
        autoHeight: false,
      },
    },
    // keyboard: true,
    modules: [Pagination, Navigation, EffectFade],
    on: {
      slideChangeTransitionStart(swiper) {
        const panelEl = document.querySelector('.panel_box_width');

        const tl = gsap.timeline();
        tl.to(panelEl, {
          // delay: 0.15,
          duration: 0.5,
          ease: 'power2.out',
          width: '0%',
        })
          .to(panelEl, {
            // delay: 0.1,
            duration: 0.2,
            ease: 'power2.out',
            height: '0',
          })
          .to(panelEl, {
            delay: 0.05,
            duration: 0.3,
            ease: 'power2.out',
            height: 'auto',
          })
          .to(panelEl, {
            // delay: 0.1,
            duration: 0.6,
            ease: 'power2.out',
            width: '100%',
          });
      },
    },
  });
});
