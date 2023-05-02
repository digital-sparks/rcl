import 'swiper/css';
import 'swiper/css/effect-fade';

import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/all';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import createShadow from 'node_modules/swiper/shared/create-shadow.js';
import effectInit from 'node_modules/swiper/shared/effect-init.js';
import effectTarget from 'node_modules/swiper/shared/effect-target.js';
import effectVirtualTransitionEnd from 'node_modules/swiper/shared/effect-virtual-transition-end.js';
import { getSlideTransformEl } from 'node_modules/swiper/shared/utils.js';
import { PowerGlitch } from 'powerglitch';
import Swiper, { EffectCards, EffectFade, Navigation, Pagination } from 'swiper';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);

window.Webflow ||= [];

window.Webflow.push(async () => {
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

  PowerGlitch.glitch('.panel_corner_svg', {
    playMode: 'always',
    createContainers: true,
    hideOverflow: false,
    timing: {
      duration: 5000,
    },
    glitchTimeSpan: {
      start: 0,
      end: 1,
    },
    shake: {
      velocity: 7,
      amplitudeX: 0.025,
      amplitudeY: 0.025,
    },
    slice: {
      count: 1,
      velocity: 8,
      minHeight: 0.05,
      maxHeight: 0.5,
      hueRotate: false,
    },
  });

  PowerGlitch.glitch('.prefooter_logo.is-back, .nav-overlay_logo.is-front', {
    playMode: 'always',
    createContainers: true,
    hideOverflow: false,
    timing: {
      duration: 5000,
    },
    glitchTimeSpan: {
      start: 0,
      end: 1,
    },
    shake: {
      velocity: 5,
      amplitudeX: 0.025,
      amplitudeY: 0.025,
    },
    slice: {
      count: 1,
      velocity: 7,
      minHeight: 0.05,
      maxHeight: 0.35,
      hueRotate: false,
    },
  });

  PowerGlitch.glitch('.nav-overlay_background', {
    playMode: 'always',
    createContainers: true,
    hideOverflow: true,
    timing: {
      duration: 5000,
    },
    glitchTimeSpan: {
      start: 0,
      end: 1,
    },
    shake: {
      velocity: 6,
      amplitudeX: 0.005,
      amplitudeY: 0.005,
    },
    slice: {
      count: 1,
      velocity: 1,
      minHeight: 0.01,
      maxHeight: 0.25,
      hueRotate: false,
    },
  });

  document.querySelectorAll('.faq_toggle').forEach((faqToggle) => {
    const faqTitle = faqToggle.querySelector('.faq_title');
    const { startGlitch, stopGlitch } = PowerGlitch.glitch(faqTitle, {
      playMode: 'hover',
      createContainers: true,
      hideOverflow: false,
      timing: {
        duration: 5000,
        iterations: 10,
      },
      glitchTimeSpan: {
        start: 0,
        end: 1,
      },
      shake: {
        velocity: 8,
        amplitudeX: 0.01,
        amplitudeY: 0.015,
      },
      slice: {
        count: 1,
        velocity: 9.5,
        minHeight: 0.02,
        maxHeight: 0.3,
        hueRotate: false,
      },
      pulse: false,
    });

    faqToggle.addEventListener('mouseover', function () {
      startGlitch();
    });
    faqToggle.addEventListener('mouseout', () => {
      stopGlitch();
    });
  });

  document.querySelectorAll('.button').forEach((button) => {
    const buttonText = button.querySelector('.button_text-wrap');

    const { startGlitch, stopGlitch } = PowerGlitch.glitch(buttonText, {
      playMode: 'hover',
      createContainers: true,
      hideOverflow: false,
      timing: {
        duration: 5000,
        iterations: 10,
      },
      glitchTimeSpan: {
        start: 0,
        end: 1,
      },
      shake: {
        velocity: 8,
        amplitudeX: 0.015,
        amplitudeY: 0.025,
      },
      slice: {
        count: 1,
        velocity: 9.5,
        minHeight: 0.02,
        maxHeight: 0.3,
        hueRotate: false,
      },
      pulse: false,
    });

    PowerGlitch.glitch(button, {
      playMode: 'hover',
      createContainers: true,
      hideOverflow: false,
      timing: {
        duration: 5000,
        iterations: 10,
      },
      glitchTimeSpan: {
        start: 0,
        end: 1,
      },
      shake: {
        velocity: 4,
        amplitudeX: 0.015,
        amplitudeY: 0.015,
      },
      slice: false,
      pulse: false,
    });

    button.addEventListener('mouseover', function () {
      startGlitch();
    });
    button.addEventListener('mouseout', () => {
      stopGlitch();
    });
  });

  PowerGlitch.glitch('.footer_back', {
    playMode: 'hover',
    createContainers: true,
    hideOverflow: false,
    timing: {
      duration: 5000,
      iterations: 10,
    },
    glitchTimeSpan: {
      start: 0,
      end: 1,
    },
    shake: {
      velocity: 4,
      amplitudeX: 0.0075,
      amplitudeY: 0.0075,
    },
    slice: {
      count: 1,
      velocity: 9.5,
      minHeight: 0.02,
      maxHeight: 0.3,
      hueRotate: false,
    },
    pulse: false,
  });

  PowerGlitch.glitch('.social-link_icon', {
    playMode: 'hover',
    createContainers: true,
    hideOverflow: false,
    timing: {
      duration: 5000,
      iterations: 10,
    },
    glitchTimeSpan: {
      start: 0,
      end: 1,
    },
    shake: {
      velocity: 4,
      amplitudeX: 0.075,
      amplitudeY: 0.075,
    },
    slice: {
      count: 1,
      velocity: 9.5,
      minHeight: 0.02,
      maxHeight: 0.3,
      hueRotate: false,
    },
    pulse: false,
  });

  PowerGlitch.glitch('.portal_component', {
    playMode: 'always',
    createContainers: true,
    hideOverflow: false,
    timing: {
      duration: 5000,
      iterations: 10,
    },
    glitchTimeSpan: {
      start: 0,
      end: 1,
    },
    shake: {
      velocity: 4,
      amplitudeX: 0.005,
      amplitudeY: 0.005,
    },
    slice: false,
    pulse: false,
  });

  const randomTeamCard = () => {
    const randomCard = Math.floor(
      1 + Math.random() * document.querySelectorAll('.team-card_slide').length
    );
    const element = document.querySelector(
      `.team-card_slide:nth-child(${randomCard}) .team-card_component`
    );
    document.querySelectorAll('.team-card_component').forEach((element) => {
      element.classList.remove('flicker-slow');
    });
    element?.classList.add('flicker-slow');

    setTimeout(randomTeamCard, 5000 + Math.random() * 3000);
  };
  randomTeamCard();

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

  const scrollLinks = document.querySelectorAll('.scroll-navigation_link, .footer_back');

  scrollLinks.forEach((link, index) => {
    const target: string = link.getAttribute('href') || '';
    link.setAttribute('data-target', target);
    link.removeAttribute('href');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      pageScroller.scrollTo(target, {
        lerp: 0.04,
        // duration: 5,
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
              onUpdate: () => {
                marqueeTimeline.timeScale(scrubObject.value);
              },
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
      this.el = el[0];
      this.elAll = el;
      this.chars = '!<>-\\/[]{}—=+*^?#';
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
        const start = Math.floor(Math.random() * 70);
        const end = start + Math.floor(Math.random() * 70);
        const random = Math.random();
        this.queue.push({ from, to, start, end, random });
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
          if (!char || Math.random() < 0.05) {
            char = this.queue[i].random < 0.1 ? this.randomChar() : to;
            this.queue[i].char = char;
          }
          output += `<span>${char}</span>`;
        } else {
          output += from;
        }
      }
      this.elAll.forEach((element) => {
        element.innerHTML = output;
      });
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

  document.querySelectorAll('[text-effect=scramble]').forEach((text) => {
    const duration = text.getAttribute('text-effect-duration') || 2000;
    const phrase = text.querySelector('div')?.innerText;
    const fx = new TextScramble(text.querySelectorAll('div'));

    const next = () => {
      fx.setText(phrase).then(() => {
        setTimeout(next, duration);
      });
    };
    next();
  });

  ////

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

        setTimeout(() => {
          switch (swiper.realIndex) {
            case 0:
              document.querySelectorAll('.date_ticker > div').forEach((element) => {
                element.textContent = '10312022';
              });
              break;
            case 1:
              document.querySelectorAll('.date_ticker > div').forEach((element) => {
                element.textContent = '11242022';
              });
              break;
            case 2:
              document.querySelectorAll('.date_ticker > div').forEach((element) => {
                element.textContent = '12252022';
              });
              break;
            default:
              document.querySelectorAll('.date_ticker > div').forEach((element) => {
                element.textContent = '10312022';
              });
          }
        }, 250);

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
          start: 'top 60%',
          end: 'bottom center',
          toggleActions: 'play none play none',
          // markers: true,
        },
      })
      .fromTo(
        panelEl,
        {
          height: 0,
          width: 0,
        },
        {
          height: 'auto',
          duration: 0.3,
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
          ease: 'power2.out',
        }
      )
      .to(
        panelEl,
        {
          delay: 0.05,
          duration: 0.75,
          ease: 'power2.out',
          width: '100%',
        },
        '<'
      ) // after this comes code for the preloader
      .fromTo(
        '.loading-bar_active',
        {
          width: 0,
          duration: 0,
        },
        {
          width: '100%',
          duration: 3,
          delay: 0.1,
          ease: CustomEase.create(
            'custom',
            'M0,0 C0,0 0.05,0.05 0.129,0.129 0.14,0.14 0.173,0.137 0.186,0.15 0.205,0.169 0.198,0.214 0.22,0.236 0.241,0.258 0.316,0.281 0.34,0.305 0.375,0.341 0.387,0.434 0.424,0.472 0.444,0.492 0.491,0.471 0.512,0.492 0.542,0.521 0.556,0.592 0.586,0.622 0.617,0.654 0.691,0.662 0.722,0.692 0.765,0.733 0.79,0.811 0.824,0.848 0.928,0.959 1,1 1,1 '
          ),
          onInit: function () {
            // const el = document.querySelectorAll('.incoming-transmission-text');
            // const text = el[0]?.textContent;
            // const fx = new TextScramble(el, 5);
            // fx.setText(text);

            const el = document.querySelectorAll('[type-el]');
            el.forEach((elm) => {
              const text = elm.querySelector('.incoming-transmission-text').textContent;
              const fx = new TextScramble(elm.querySelectorAll('.incoming-transmission-text'), 5);
              fx.setText(text);
            });
          },
        }
      )
      .to('.panel_box_loader', {
        opacity: 0,
        duration: 1,
        delay: 0.5,
        onComplete: function () {
          document.querySelector('.panel_box_loader').style.display = 'none';
        },
      })
      .fromTo(
        [
          '.panel_box_container .panel_box_wrapper',
          '.panel_box_container .swiper-pagination-wrap',
          '.panel_box_container .swiper_buttons-wrap',
          '.date_component',
          '.og-unknown_component',
        ],
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.5,
        },
        '<'
      );
  });

  function updatePanelWidth() {
    panelComponents.forEach((panel) => {
      if (panel.querySelector('.panel_box_loader') != null) {
        panel.querySelector('.panel_box_loader').style.minWidth = '0px';
        panel.querySelector('.panel2_box_padding').style.minWidth =
          panel.querySelector('.panel_box-component')?.clientWidth + 'px';
      } else {
        panel.querySelector('.panel_box_padding').style.minWidth =
          panel.querySelector('.panel_box-component')?.clientWidth + 'px';
      }

      panel.querySelector('.panel_box-component').style.minHeight =
        panel.querySelector('.panel_box_width')?.clientHeight + 4 + 'px';
    });
  }

  const pagination = document.querySelectorAll('[swiper="pagination"]');
  pagination.forEach((paginateEl) => {
    const swiperContainer = paginateEl.previousElementSibling;
    swiperContainer?.append(paginateEl);
  });

  /*----------------------------*/
  /* UPDATE ON RESIZE           */

  let resizeTimeout,
    currentWindowWidth: number = document.documentElement.clientWidth,
    oldWindowWidth: number = currentWindowWidth,
    initTeamCardSwiper = false,
    initCollectionCardSwiper = false,
    collectionCardSwiper,
    teamCardSwiper;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      currentWindowWidth = document.documentElement.clientWidth;
      if (oldWindowWidth !== currentWindowWidth) {
        console.log('updated window size');
        swiperCard(currentWindowWidth);
        initCollectionCard(currentWindowWidth);
        oldWindowWidth = currentWindowWidth;
        updatePanelWidth();
      }
    }, 50);
  });

  window.addEventListener('load', () => {
    swiperCard(currentWindowWidth);
    initCollectionCard(currentWindowWidth);
  });

  /* END                        */
  /*----------------------------*/

  function getPositionAtCenter(element) {
    const { top, left, width, height } = element.getBoundingClientRect();
    return {
      x: left + width / 2,
      y: top + height / 2,
    };
  }

  function getDistanceBetweenElements(a, b) {
    const aPosition = getPositionAtCenter(a);
    const bPosition = getPositionAtCenter(b);

    return {
      xDistance: (aPosition.x - bPosition.x) / 10,
      yDistance: (aPosition.y - bPosition.y) / 10,
    };
    //return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
  }

  function initCollectionCard(windowWidth: number) {
    console.log(initCollectionCardSwiper);
    if (windowWidth <= 767 && !initCollectionCardSwiper) {
      collectionCardSwiper = new Swiper('.collection-card_container', {
        // wrapperClass: 'div-block-8',
        slideClass: 'collection-card_slide',
        effect: 'cards',
        centeredSlides: true,
        cardsEffect: {
          rotate: true,
          perSlideRotate: 3,
          perSlideOffset: 3Ÿ,
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
        navigation: {
          prevEl: '.swiper_button-prev',
          nextEl: '.swiper_button-next',
        },
        modules: [EffectCards, Navigation],
      });
      initCollectionCardSwiper = true;
    } else if (windowWidth > 767 && initCollectionCardSwiper) {
      collectionCardSwiper.destroy(true, true);
      initCollectionCardSwiper = false;
    }
  }

  const collectionCardTimeline = gsap.matchMedia();
  collectionCardTimeline.add('(min-width: 767px)', () => {
    const cardsTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.section_collection-cards',
        start: '10% bottom',
        end: 'bottom 75%',
        scrub: true,
        // markers: true,
      },
    });

    cardsTl.from('.collection-card_slide', {
      x: function (index, target, targets) {
        return getDistanceBetweenElements(
          document.querySelector('.collection-card_container'),
          target
        ).xDistance;
      },
      y: function (index, target, targets) {
        return getDistanceBetweenElements(
          document.querySelector('.collection-card_container'),
          target
        ).yDistance;
      },
      rotate: 0,
      opacity: 0,
      duration: 0.01,
      stagger: 0.005,
      ease: 'power1.out',
    });
  });

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
        modules: [Pagination, Navigation],
      });
    } else if (windowWidth > 1200 && initTeamCardSwiper) {
      teamCardSwiper.destroy(true, true);
      initTeamCardSwiper = false;
    }
  }

  const proxy = { skew: 0 },
    skewSetter = gsap.quickSetter('.team-card_slide .team-card_component', 'skewY', 'deg'), // fast
    skewSetter2 = gsap.quickSetter('.team-card_slide .panel_corner-wrap', 'skewY', 'deg'), // fast
    clamp = gsap.utils.clamp(-2, 2); // don't let the skew go beyond 20 degrees.

  ScrollTrigger.create({
    onUpdate: (self) => {
      const skew = clamp(self.getVelocity() / -300);
      // only do something if the skew is MORE severe. Remember, we're always tweening back to 0, so if the user slows their scrolling quickly, it's more natural to just let the tween handle that smoothly rather than jumping to the smaller skew.
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, {
          skew: 0,
          duration: 0.8,
          ease: 'power3',
          overwrite: true,
          onUpdate: () => {
            skewSetter(proxy.skew);
            skewSetter2(proxy.skew);
          },
        });
      }
    },
  });

  // make the right edge "stick" to the scroll bar. force3D: true improves performance
  gsap.set('.team-card_slide .team-card_component', {
    transformOrigin: 'right center',
    force3D: true,
  });
  gsap.set('.team-card_slide .panel_corner-wrap', {
    transformOrigin: 'right center',
    force3D: true,
  });

  document.querySelector('.date_circle')?.addEventListener('mouseenter', () => {
    gsap.to('.date_circle_line', {
      scaleY: 0.75,
    });
  });
  document.querySelector('.date_circle')?.addEventListener('mouseleave', () => {
    gsap.to('.date_circle_line', {
      scaleY: 1,
    });
  });
});
