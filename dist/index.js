"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // bin/live-reload.js
  var init_live_reload = __esm({
    "bin/live-reload.js"() {
      "use strict";
      new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());
    }
  });

  // node_modules/.pnpm/powerglitch@2.3.2/node_modules/powerglitch/lib/src/index.js
  var require_src = __commonJS({
    "node_modules/.pnpm/powerglitch@2.3.2/node_modules/powerglitch/lib/src/index.js"(exports) {
      "use strict";
      init_live_reload();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PowerGlitch = exports.mergeOptions = void 0;
      var getDefaultOptions = (playMode = "always") => {
        return {
          playMode,
          createContainers: true,
          hideOverflow: false,
          timing: playMode === "always" ? { duration: 2 * 1e3, iterations: Infinity } : { duration: 250, iterations: 1 },
          glitchTimeSpan: playMode === "always" ? { start: 0.5, end: 0.7 } : { start: 0, end: 1 },
          shake: {
            velocity: 15,
            amplitudeX: 0.2,
            amplitudeY: 0.2
          },
          slice: playMode === "click" ? {
            count: 15,
            velocity: 20,
            minHeight: 0.02,
            maxHeight: 0.15,
            hueRotate: true
          } : {
            count: 6,
            velocity: 15,
            minHeight: 0.02,
            maxHeight: 0.15,
            hueRotate: true
          },
          pulse: false
        };
      };
      var getGlitchFactor = (options, stepPct) => {
        if (!options.glitchTimeSpan) {
          return 1;
        }
        const glitchStart = options.glitchTimeSpan.start;
        const glitchEnd = options.glitchTimeSpan.end;
        if (stepPct < glitchStart || stepPct > glitchEnd) {
          return 0;
        }
        const glitchPeak = glitchStart + (glitchEnd - glitchStart) / 2;
        if (stepPct < glitchPeak) {
          return (stepPct - glitchStart) / (glitchPeak - glitchStart);
        } else {
          return (glitchEnd - stepPct) / (glitchEnd - glitchPeak);
        }
      };
      var getGlitchRandom = (options, stepPct) => {
        return (Math.random() - 0.5) * 2 * getGlitchFactor(options, stepPct);
      };
      var getRandomRectanglePolygonCss = ({ minHeight, maxHeight, minWidth, maxWidth }) => {
        const height = Math.floor(Math.random() * ((maxHeight - minHeight) * 100 + 1)) + minHeight * 100;
        const width = Math.floor(Math.random() * ((maxWidth - minWidth) * 100 + 1)) + minWidth * 100;
        const top = Math.floor(Math.random() * (100 - height));
        const left = Math.floor(Math.random() * (100 - width));
        const topRight = `${left + width}% ${top}%`;
        const bottomRight = `${left + width}% ${top + height}%`;
        const bottomLeft = `${left}% ${top + height}%`;
        const topLeft = `${left}% ${top}%`;
        return `polygon(${topRight},${bottomRight},${bottomLeft},${topLeft})`;
      };
      var generateGlitchSliceLayer = (options) => {
        const stepCount = Math.floor(options.slice.velocity * options.timing.duration / 1e3) + 1;
        const steps = [];
        for (let index = 0; index < stepCount; ++index) {
          if (getGlitchFactor(options, index / stepCount) === 0) {
            steps.push({
              opacity: "0",
              transform: "none",
              clipPath: "unset"
            });
            continue;
          }
          const translateX = getGlitchRandom(options, index / stepCount) * 30;
          const styles = {
            opacity: "1",
            transform: `translate3d(${translateX}%,0,0)`,
            clipPath: getRandomRectanglePolygonCss({ minHeight: options.slice.minHeight, maxHeight: options.slice.maxHeight, minWidth: 1, maxWidth: 1 })
          };
          if (options.slice.hueRotate) {
            styles.filter = `hue-rotate(${Math.floor(getGlitchRandom(options, index / stepCount) * 360)}deg)`;
          }
          steps.push(styles);
        }
        return {
          steps,
          timing: Object.assign({ easing: `steps(${stepCount},jump-start)` }, options.timing)
        };
      };
      var generateGlitchPulseLayer = (options) => {
        return !options.pulse ? null : {
          steps: [
            { transform: "scale(1)", opacity: "1" },
            { transform: `scale(${options.pulse.scale})`, opacity: "0" }
          ],
          timing: Object.assign(Object.assign({}, options.timing), { delay: (options.glitchTimeSpan ? options.glitchTimeSpan.start : 0) * options.timing.duration, easing: "ease-in-out" })
        };
      };
      var generateBaseLayer = (options) => {
        if (!options.shake) {
          return { steps: [], timing: {} };
        }
        const stepCount = Math.floor(options.shake.velocity * options.timing.duration / 1e3) + 1;
        const steps = [];
        for (let index = 0; index < stepCount; ++index) {
          const translateX = getGlitchRandom(options, index / stepCount) * options.shake.amplitudeX * 100;
          const translateY = getGlitchRandom(options, index / stepCount) * options.shake.amplitudeY * 100;
          steps.push({
            transform: `translate3d(${translateX}%,${translateY}%,0)`
          });
        }
        return {
          steps,
          timing: Object.assign({ easing: `steps(${stepCount},jump-start)` }, options.timing)
        };
      };
      var generateLayers = (options) => [
        generateBaseLayer(options),
        generateGlitchPulseLayer(options),
        ...Array.from({ length: options.slice.count }).map(() => generateGlitchSliceLayer(options))
      ].filter((entry) => entry !== null);
      var mergeOptions = (...objects) => {
        const isObject3 = (obj) => obj && typeof obj === "object";
        return objects.reduce((prev, obj) => {
          Object.keys(obj).forEach((key) => {
            if (isObject3(prev[key]) && isObject3(obj[key])) {
              prev[key] = (0, exports.mergeOptions)(prev[key], obj[key]);
            } else if (obj[key] !== void 0) {
              prev[key] = obj[key];
            }
          });
          return prev;
        }, {});
      };
      exports.mergeOptions = mergeOptions;
      var prepareGlitchElement = (element, options) => {
        var _a, _b;
        if (!options.createContainers) {
          return {
            container: element,
            layersContainer: element,
            glitched: element.firstElementChild
          };
        }
        if (!element.dataset.glitched) {
          const layersContainer2 = document.createElement("div");
          const container2 = document.createElement("div");
          if (getComputedStyle(element).getPropertyValue("display").match(/^inline/)) {
            container2.style.display = "inline-block";
          }
          container2.appendChild(layersContainer2);
          (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(container2, element);
          layersContainer2.prepend(element);
          return {
            container: container2,
            layersContainer: layersContainer2,
            glitched: element
          };
        }
        const layersContainer = element.parentElement;
        const container = (_b = element.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
        while (layersContainer.children.length > 1) {
          layersContainer.removeChild(layersContainer.children[1]);
        }
        layersContainer.firstElementChild.getAnimations().forEach((animation) => animation.cancel());
        return {
          container,
          layersContainer,
          glitched: element
        };
      };
      var glitchElement = (element, layers, options) => {
        const { glitched, container, layersContainer } = prepareGlitchElement(element, options);
        layersContainer.style.display = "grid";
        if (options.hideOverflow) {
          container.style.overflow = "hidden";
        }
        if (options.html) {
          glitched.innerHTML = options.html;
        }
        glitched.style.gridArea = "1/1/-1/-1";
        const baseLayer = glitched.cloneNode(true);
        baseLayer.style.gridArea = "1/1/-1/-1";
        baseLayer.style.userSelect = "none";
        baseLayer.style.pointerEvents = "none";
        baseLayer.style.opacity = "0";
        for (let i2 = 0; i2 < layers.length - 1; ++i2) {
          const layerDiv = baseLayer.cloneNode(true);
          layersContainer.appendChild(layerDiv);
        }
        const startGlitch = () => {
          layers.forEach((layer, i2) => {
            layersContainer.children[i2].animate(layer.steps, layer.timing);
          });
        };
        const stopGlitch = () => {
          layers.forEach((_, i2) => {
            layersContainer.children[i2].getAnimations().forEach((animation) => {
              animation.cancel();
            });
          });
        };
        container.onmouseenter = null;
        container.onmouseleave = null;
        container.onclick = null;
        switch (options.playMode) {
          case "always":
            startGlitch();
            break;
          case "hover":
            container.onmouseenter = startGlitch;
            container.onmouseleave = stopGlitch;
            break;
          case "click":
            container.onclick = () => {
              stopGlitch();
              startGlitch();
            };
            break;
        }
        element.dataset.glitched = "1";
        return { container, startGlitch, stopGlitch };
      };
      var glitch = (elOrSelector = ".powerglitch", userOptions = {}) => {
        const options = (0, exports.mergeOptions)(getDefaultOptions(userOptions.playMode), userOptions);
        let elements = [];
        if (typeof elOrSelector === "string") {
          elements = Array.from(document.querySelectorAll(elOrSelector));
        } else if (elOrSelector instanceof NodeList) {
          elements = Array.from(elOrSelector);
        } else if (Array.isArray(elOrSelector)) {
          elements = elOrSelector;
        } else if (elOrSelector instanceof HTMLElement) {
          elements = [elOrSelector];
        }
        const layers = generateLayers(options);
        const entries = elements.map((element) => glitchElement(element, layers, options));
        return {
          containers: entries.map((entry) => entry.container),
          startGlitch: () => entries.forEach((entry) => entry.startGlitch()),
          stopGlitch: () => entries.forEach((entry) => entry.stopGlitch())
        };
      };
      exports.PowerGlitch = {
        glitch,
        generateLayers,
        getDefaultOptions
      };
    }
  });

  // src/index.ts
  init_live_reload();

  // node_modules/.pnpm/@studio-freight+lenis@1.0.6/node_modules/@studio-freight/lenis/dist/lenis.modern.mjs
  init_live_reload();
  function t(t2, e2, i2) {
    return Math.max(t2, Math.min(e2, i2));
  }
  var e = class {
    advance(e2) {
      var i2;
      if (!this.isRunning)
        return;
      let s2 = false;
      if (this.lerp)
        this.value = (1 - (o2 = this.lerp)) * this.value + o2 * this.to, Math.round(this.value) === this.to && (this.value = this.to, s2 = true);
      else {
        this.currentTime += e2;
        const i3 = t(0, this.currentTime / this.duration, 1);
        s2 = i3 >= 1;
        const o3 = s2 ? 1 : this.easing(i3);
        this.value = this.from + (this.to - this.from) * o3;
      }
      var o2;
      null == (i2 = this.onUpdate) || i2.call(this, this.value, { completed: s2 }), s2 && this.stop();
    }
    stop() {
      this.isRunning = false;
    }
    fromTo(t2, e2, { lerp: i2 = 0.1, duration: s2 = 1, easing: o2 = (t3) => t3, onUpdate: n2 }) {
      this.from = this.value = t2, this.to = e2, this.lerp = i2, this.duration = s2, this.easing = o2, this.currentTime = 0, this.isRunning = true, this.onUpdate = n2;
    }
  };
  function i(t2, e2) {
    let i2;
    return function() {
      let s2 = arguments, o2 = this;
      clearTimeout(i2), i2 = setTimeout(function() {
        t2.apply(o2, s2);
      }, e2);
    };
  }
  var s = class {
    constructor(t2, e2) {
      this.onWindowResize = () => {
        this.width = window.innerWidth, this.height = window.innerHeight;
      }, this.onWrapperResize = () => {
        this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight;
      }, this.onContentResize = () => {
        const t3 = this.wrapper === window ? document.documentElement : this.wrapper;
        this.scrollHeight = t3.scrollHeight, this.scrollWidth = t3.scrollWidth;
      }, this.wrapper = t2, this.content = e2, this.wrapper === window ? (window.addEventListener("resize", this.onWindowResize, false), this.onWindowResize()) : (this.wrapperResizeObserver = new ResizeObserver(i(this.onWrapperResize, 100)), this.wrapperResizeObserver.observe(this.wrapper), this.onWrapperResize()), this.contentResizeObserver = new ResizeObserver(i(this.onContentResize, 100)), this.contentResizeObserver.observe(this.content), this.onContentResize();
    }
    destroy() {
      var t2, e2;
      window.removeEventListener("resize", this.onWindowResize, false), null == (t2 = this.wrapperResizeObserver) || t2.disconnect(), null == (e2 = this.contentResizeObserver) || e2.disconnect();
    }
    get limit() {
      return { x: this.scrollWidth - this.width, y: this.scrollHeight - this.height };
    }
  };
  var o = () => ({ events: {}, emit(t2, ...e2) {
    let i2 = this.events[t2] || [];
    for (let t3 = 0, s2 = i2.length; t3 < s2; t3++)
      i2[t3](...e2);
  }, on(t2, e2) {
    var i2;
    return (null == (i2 = this.events[t2]) ? void 0 : i2.push(e2)) || (this.events[t2] = [e2]), () => {
      var i3;
      this.events[t2] = null == (i3 = this.events[t2]) ? void 0 : i3.filter((t3) => e2 !== t3);
    };
  } });
  var n = class {
    constructor(e2, { wheelMultiplier: i2 = 1, touchMultiplier: s2 = 2, normalizeWheel: n2 = false }) {
      this.onTouchStart = (t2) => {
        const { pageX: e3, pageY: i3 } = t2.targetTouches ? t2.targetTouches[0] : t2;
        this.touchStart.x = e3, this.touchStart.y = i3;
      }, this.onTouchMove = (t2) => {
        const { pageX: e3, pageY: i3 } = t2.targetTouches ? t2.targetTouches[0] : t2, s3 = -(e3 - this.touchStart.x) * this.touchMultiplier, o2 = -(i3 - this.touchStart.y) * this.touchMultiplier;
        this.touchStart.x = e3, this.touchStart.y = i3, this.emitter.emit("scroll", { type: "touch", deltaX: s3, deltaY: o2, event: t2 });
      }, this.onWheel = (e3) => {
        let { deltaX: i3, deltaY: s3 } = e3;
        this.normalizeWheel && (i3 = t(-100, i3, 100), s3 = t(-100, s3, 100)), i3 *= this.wheelMultiplier, s3 *= this.wheelMultiplier, this.emitter.emit("scroll", { type: "wheel", deltaX: i3, deltaY: s3, event: e3 });
      }, this.element = e2, this.wheelMultiplier = i2, this.touchMultiplier = s2, this.normalizeWheel = n2, this.touchStart = { x: null, y: null }, this.emitter = o(), this.element.addEventListener("wheel", this.onWheel, { passive: false }), this.element.addEventListener("touchstart", this.onTouchStart, { passive: false }), this.element.addEventListener("touchmove", this.onTouchMove, { passive: false });
    }
    on(t2, e2) {
      return this.emitter.on(t2, e2);
    }
    destroy() {
      this.emitter.events = {}, this.element.removeEventListener("wheel", this.onWheel, { passive: false }), this.element.removeEventListener("touchstart", this.onTouchStart, { passive: false }), this.element.removeEventListener("touchmove", this.onTouchMove, { passive: false });
    }
  };
  var r = class {
    constructor({ direction: t2, gestureDirection: i2, mouseMultiplier: r2, smooth: l, wrapper: h = window, content: a = document.documentElement, wheelEventsTarget: c = h, smoothWheel: u = null == l || l, smoothTouch: p = false, duration: d, easing: m = (t3) => Math.min(1, 1.001 - Math.pow(2, -10 * t3)), lerp: v = d ? null : 0.1, infinite: g = false, orientation: S = null != t2 ? t2 : "vertical", gestureOrientation: w = null != i2 ? i2 : "vertical", touchMultiplier: f = 2, wheelMultiplier: z = null != r2 ? r2 : 1, normalizeWheel: M = false } = {}) {
      this.onVirtualScroll = ({ type: t3, deltaX: e2, deltaY: i3, event: s2 }) => {
        if (s2.ctrlKey)
          return;
        if ("vertical" === this.options.gestureOrientation && 0 === i3 || "horizontal" === this.options.gestureOrientation && 0 === e2)
          return;
        if (s2.composedPath().find((t4) => null == t4 || null == t4.hasAttribute ? void 0 : t4.hasAttribute("data-lenis-prevent")))
          return;
        if (this.isStopped || this.isLocked)
          return void s2.preventDefault();
        if (this.isSmooth = this.options.smoothTouch && "touch" === t3 || this.options.smoothWheel && "wheel" === t3, !this.isSmooth)
          return this.isScrolling = false, void this.animate.stop();
        s2.preventDefault();
        let o2 = i3;
        "both" === this.options.gestureOrientation ? o2 = Math.abs(i3) > Math.abs(e2) ? i3 : e2 : "horizontal" === this.options.gestureOrientation && (o2 = e2), this.scrollTo(this.targetScroll + o2, { programmatic: false });
      }, this.onScroll = () => {
        if (!this.isScrolling) {
          const t3 = this.animatedScroll;
          this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, this.direction = Math.sign(this.animatedScroll - t3), this.emit();
        }
      }, t2 && console.warn("Lenis: `direction` option is deprecated, use `orientation` instead"), i2 && console.warn("Lenis: `gestureDirection` option is deprecated, use `gestureOrientation` instead"), r2 && console.warn("Lenis: `mouseMultiplier` option is deprecated, use `wheelMultiplier` instead"), l && console.warn("Lenis: `smooth` option is deprecated, use `smoothWheel` instead"), window.lenisVersion = "1.0.5", h !== document.documentElement && h !== document.body || (h = window), this.options = { wrapper: h, content: a, wheelEventsTarget: c, smoothWheel: u, smoothTouch: p, duration: d, easing: m, lerp: v, infinite: g, gestureOrientation: w, orientation: S, touchMultiplier: f, wheelMultiplier: z, normalizeWheel: M }, this.dimensions = new s(h, a), this.rootElement.classList.add("lenis"), this.velocity = 0, this.isStopped = false, this.isSmooth = u || p, this.isScrolling = false, this.targetScroll = this.animatedScroll = this.actualScroll, this.animate = new e(), this.emitter = o(), this.options.wrapper.addEventListener("scroll", this.onScroll, { passive: false }), this.virtualScroll = new n(c, { touchMultiplier: f, wheelMultiplier: z, normalizeWheel: M }), this.virtualScroll.on("scroll", this.onVirtualScroll);
    }
    destroy() {
      this.emitter.events = {}, this.options.wrapper.removeEventListener("scroll", this.onScroll, { passive: false }), this.virtualScroll.destroy();
    }
    on(t2, e2) {
      return this.emitter.on(t2, e2);
    }
    off(t2, e2) {
      var i2;
      this.emitter.events[t2] = null == (i2 = this.emitter.events[t2]) ? void 0 : i2.filter((t3) => e2 !== t3);
    }
    setScroll(t2) {
      this.isHorizontal ? this.rootElement.scrollLeft = t2 : this.rootElement.scrollTop = t2;
    }
    emit() {
      this.emitter.emit("scroll", this);
    }
    reset() {
      this.isLocked = false, this.isScrolling = false, this.velocity = 0, this.animate.stop();
    }
    start() {
      this.isStopped = false, this.reset();
    }
    stop() {
      this.isStopped = true, this.animate.stop(), this.reset();
    }
    raf(t2) {
      const e2 = t2 - (this.time || t2);
      this.time = t2, this.animate.advance(1e-3 * e2);
    }
    scrollTo(e2, { offset: i2 = 0, immediate: s2 = false, lock: o2 = false, duration: n2 = this.options.duration, easing: r2 = this.options.easing, lerp: l = !n2 && this.options.lerp, onComplete: h = null, force: a = false, programmatic: c = true } = {}) {
      if (!this.isStopped || a) {
        if (["top", "left", "start"].includes(e2))
          e2 = 0;
        else if (["bottom", "right", "end"].includes(e2))
          e2 = this.limit;
        else {
          var u;
          let t2;
          if ("string" == typeof e2 ? t2 = document.querySelector(e2) : null != (u = e2) && u.nodeType && (t2 = e2), t2) {
            if (this.options.wrapper !== window) {
              const t3 = this.options.wrapper.getBoundingClientRect();
              i2 -= this.isHorizontal ? t3.left : t3.top;
            }
            const s3 = t2.getBoundingClientRect();
            e2 = (this.isHorizontal ? s3.left : s3.top) + this.animatedScroll;
          }
        }
        if ("number" == typeof e2) {
          if (e2 += i2, e2 = Math.round(e2), this.options.infinite ? c && (this.targetScroll = this.animatedScroll = this.scroll) : e2 = t(0, e2, this.limit), s2)
            return this.animatedScroll = this.targetScroll = e2, this.setScroll(this.scroll), this.reset(), this.emit(), void (null == h || h());
          if (!c) {
            if (e2 === this.targetScroll)
              return;
            this.targetScroll = e2;
          }
          this.animate.fromTo(this.animatedScroll, e2, { duration: n2, easing: r2, lerp: l, onUpdate: (t2, { completed: e3 }) => {
            o2 && (this.isLocked = true), this.isScrolling = true, this.velocity = t2 - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = t2, this.setScroll(this.scroll), c && (this.targetScroll = t2), e3 && (o2 && (this.isLocked = false), requestAnimationFrame(() => {
              this.isScrolling = false;
            }), this.velocity = 0, null == h || h()), this.emit();
          } });
        }
      }
    }
    get rootElement() {
      return this.options.wrapper === window ? this.options.content : this.options.wrapper;
    }
    get limit() {
      return this.isHorizontal ? this.dimensions.limit.x : this.dimensions.limit.y;
    }
    get isHorizontal() {
      return "horizontal" === this.options.orientation;
    }
    get actualScroll() {
      return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
    }
    get scroll() {
      return this.options.infinite ? function(t2, e2) {
        let i2 = t2 % e2;
        return (e2 > 0 && i2 < 0 || e2 < 0 && i2 > 0) && (i2 += e2), i2;
      }(this.animatedScroll, this.limit) : this.animatedScroll;
    }
    get progress() {
      return 0 === this.limit ? 1 : this.scroll / this.limit;
    }
    get isSmooth() {
      return this.__isSmooth;
    }
    set isSmooth(t2) {
      this.__isSmooth !== t2 && (this.rootElement.classList.toggle("lenis-smooth", t2), this.__isSmooth = t2);
    }
    get isScrolling() {
      return this.__isScrolling;
    }
    set isScrolling(t2) {
      this.__isScrolling !== t2 && (this.rootElement.classList.toggle("lenis-scrolling", t2), this.__isScrolling = t2);
    }
    get isStopped() {
      return this.__isStopped;
    }
    set isStopped(t2) {
      this.__isStopped !== t2 && (this.rootElement.classList.toggle("lenis-stopped", t2), this.__isStopped = t2);
    }
  };

  // node_modules/.pnpm/gsap@3.11.5/node_modules/gsap/index.js
  init_live_reload();

  // node_modules/.pnpm/gsap@3.11.5/node_modules/gsap/gsap-core.js
  init_live_reload();
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  var _config = {
    autoSleep: 120,
    force3D: "auto",
    nullTargetWarn: 1,
    units: {
      lineHeight: ""
    }
  };
  var _defaults = {
    duration: 0.5,
    overwrite: false,
    delay: 0
  };
  var _suppressOverwrites;
  var _reverting;
  var _context;
  var _bigNum = 1e8;
  var _tinyNum = 1 / _bigNum;
  var _2PI = Math.PI * 2;
  var _HALF_PI = _2PI / 4;
  var _gsID = 0;
  var _sqrt = Math.sqrt;
  var _cos = Math.cos;
  var _sin = Math.sin;
  var _isString = function _isString2(value) {
    return typeof value === "string";
  };
  var _isFunction = function _isFunction2(value) {
    return typeof value === "function";
  };
  var _isNumber = function _isNumber2(value) {
    return typeof value === "number";
  };
  var _isUndefined = function _isUndefined2(value) {
    return typeof value === "undefined";
  };
  var _isObject = function _isObject2(value) {
    return typeof value === "object";
  };
  var _isNotFalse = function _isNotFalse2(value) {
    return value !== false;
  };
  var _windowExists = function _windowExists2() {
    return typeof window !== "undefined";
  };
  var _isFuncOrString = function _isFuncOrString2(value) {
    return _isFunction(value) || _isString(value);
  };
  var _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function() {
  };
  var _isArray = Array.isArray;
  var _strictNumExp = /(?:-?\.?\d|\.)+/gi;
  var _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g;
  var _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g;
  var _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi;
  var _relExp = /[+-]=-?[.\d]+/;
  var _delimitedValueExp = /[^,'"\[\]\s]+/gi;
  var _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i;
  var _globalTimeline;
  var _win;
  var _coreInitted;
  var _doc;
  var _globals = {};
  var _installScope = {};
  var _coreReady;
  var _install = function _install2(scope) {
    return (_installScope = _merge(scope, _globals)) && gsap;
  };
  var _missingPlugin = function _missingPlugin2(property, value) {
    return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
  };
  var _warn = function _warn2(message, suppress) {
    return !suppress && console.warn(message);
  };
  var _addGlobal = function _addGlobal2(name, obj) {
    return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
  };
  var _emptyFunc = function _emptyFunc2() {
    return 0;
  };
  var _startAtRevertConfig = {
    suppressEvents: true,
    isStart: true,
    kill: false
  };
  var _revertConfigNoKill = {
    suppressEvents: true,
    kill: false
  };
  var _revertConfig = {
    suppressEvents: true
  };
  var _reservedProps = {};
  var _lazyTweens = [];
  var _lazyLookup = {};
  var _lastRenderedFrame;
  var _plugins = {};
  var _effects = {};
  var _nextGCFrame = 30;
  var _harnessPlugins = [];
  var _callbackNames = "";
  var _harness = function _harness2(targets) {
    var target = targets[0], harnessPlugin, i2;
    _isObject(target) || _isFunction(target) || (targets = [targets]);
    if (!(harnessPlugin = (target._gsap || {}).harness)) {
      i2 = _harnessPlugins.length;
      while (i2-- && !_harnessPlugins[i2].targetTest(target)) {
      }
      harnessPlugin = _harnessPlugins[i2];
    }
    i2 = targets.length;
    while (i2--) {
      targets[i2] && (targets[i2]._gsap || (targets[i2]._gsap = new GSCache(targets[i2], harnessPlugin))) || targets.splice(i2, 1);
    }
    return targets;
  };
  var _getCache = function _getCache2(target) {
    return target._gsap || _harness(toArray(target))[0]._gsap;
  };
  var _getProperty = function _getProperty2(target, property, v) {
    return (v = target[property]) && _isFunction(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
  };
  var _forEachName = function _forEachName2(names, func) {
    return (names = names.split(",")).forEach(func) || names;
  };
  var _round = function _round2(value) {
    return Math.round(value * 1e5) / 1e5 || 0;
  };
  var _roundPrecise = function _roundPrecise2(value) {
    return Math.round(value * 1e7) / 1e7 || 0;
  };
  var _parseRelative = function _parseRelative2(start, value) {
    var operator = value.charAt(0), end = parseFloat(value.substr(2));
    start = parseFloat(start);
    return operator === "+" ? start + end : operator === "-" ? start - end : operator === "*" ? start * end : start / end;
  };
  var _arrayContainsAny = function _arrayContainsAny2(toSearch, toFind) {
    var l = toFind.length, i2 = 0;
    for (; toSearch.indexOf(toFind[i2]) < 0 && ++i2 < l; ) {
    }
    return i2 < l;
  };
  var _lazyRender = function _lazyRender2() {
    var l = _lazyTweens.length, a = _lazyTweens.slice(0), i2, tween;
    _lazyLookup = {};
    _lazyTweens.length = 0;
    for (i2 = 0; i2 < l; i2++) {
      tween = a[i2];
      tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
    }
  };
  var _lazySafeRender = function _lazySafeRender2(animation, time, suppressEvents, force) {
    _lazyTweens.length && !_reverting && _lazyRender();
    animation.render(time, suppressEvents, force || _reverting && time < 0 && (animation._initted || animation._startAt));
    _lazyTweens.length && !_reverting && _lazyRender();
  };
  var _numericIfPossible = function _numericIfPossible2(value) {
    var n2 = parseFloat(value);
    return (n2 || n2 === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n2 : _isString(value) ? value.trim() : value;
  };
  var _passThrough = function _passThrough2(p) {
    return p;
  };
  var _setDefaults = function _setDefaults2(obj, defaults2) {
    for (var p in defaults2) {
      p in obj || (obj[p] = defaults2[p]);
    }
    return obj;
  };
  var _setKeyframeDefaults = function _setKeyframeDefaults2(excludeDuration) {
    return function(obj, defaults2) {
      for (var p in defaults2) {
        p in obj || p === "duration" && excludeDuration || p === "ease" || (obj[p] = defaults2[p]);
      }
    };
  };
  var _merge = function _merge2(base, toMerge) {
    for (var p in toMerge) {
      base[p] = toMerge[p];
    }
    return base;
  };
  var _mergeDeep = function _mergeDeep2(base, toMerge) {
    for (var p in toMerge) {
      p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject(toMerge[p]) ? _mergeDeep2(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
    }
    return base;
  };
  var _copyExcluding = function _copyExcluding2(obj, excluding) {
    var copy = {}, p;
    for (p in obj) {
      p in excluding || (copy[p] = obj[p]);
    }
    return copy;
  };
  var _inheritDefaults = function _inheritDefaults2(vars) {
    var parent = vars.parent || _globalTimeline, func = vars.keyframes ? _setKeyframeDefaults(_isArray(vars.keyframes)) : _setDefaults;
    if (_isNotFalse(vars.inherit)) {
      while (parent) {
        func(vars, parent.vars.defaults);
        parent = parent.parent || parent._dp;
      }
    }
    return vars;
  };
  var _arraysMatch = function _arraysMatch2(a1, a2) {
    var i2 = a1.length, match = i2 === a2.length;
    while (match && i2-- && a1[i2] === a2[i2]) {
    }
    return i2 < 0;
  };
  var _addLinkedListItem = function _addLinkedListItem2(parent, child, firstProp, lastProp, sortBy) {
    if (firstProp === void 0) {
      firstProp = "_first";
    }
    if (lastProp === void 0) {
      lastProp = "_last";
    }
    var prev = parent[lastProp], t2;
    if (sortBy) {
      t2 = child[sortBy];
      while (prev && prev[sortBy] > t2) {
        prev = prev._prev;
      }
    }
    if (prev) {
      child._next = prev._next;
      prev._next = child;
    } else {
      child._next = parent[firstProp];
      parent[firstProp] = child;
    }
    if (child._next) {
      child._next._prev = child;
    } else {
      parent[lastProp] = child;
    }
    child._prev = prev;
    child.parent = child._dp = parent;
    return child;
  };
  var _removeLinkedListItem = function _removeLinkedListItem2(parent, child, firstProp, lastProp) {
    if (firstProp === void 0) {
      firstProp = "_first";
    }
    if (lastProp === void 0) {
      lastProp = "_last";
    }
    var prev = child._prev, next = child._next;
    if (prev) {
      prev._next = next;
    } else if (parent[firstProp] === child) {
      parent[firstProp] = next;
    }
    if (next) {
      next._prev = prev;
    } else if (parent[lastProp] === child) {
      parent[lastProp] = prev;
    }
    child._next = child._prev = child.parent = null;
  };
  var _removeFromParent = function _removeFromParent2(child, onlyIfParentHasAutoRemove) {
    child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove(child);
    child._act = 0;
  };
  var _uncache = function _uncache2(animation, child) {
    if (animation && (!child || child._end > animation._dur || child._start < 0)) {
      var a = animation;
      while (a) {
        a._dirty = 1;
        a = a.parent;
      }
    }
    return animation;
  };
  var _recacheAncestors = function _recacheAncestors2(animation) {
    var parent = animation.parent;
    while (parent && parent.parent) {
      parent._dirty = 1;
      parent.totalDuration();
      parent = parent.parent;
    }
    return animation;
  };
  var _rewindStartAt = function _rewindStartAt2(tween, totalTime, suppressEvents, force) {
    return tween._startAt && (_reverting ? tween._startAt.revert(_revertConfigNoKill) : tween.vars.immediateRender && !tween.vars.autoRevert || tween._startAt.render(totalTime, true, force));
  };
  var _hasNoPausedAncestors = function _hasNoPausedAncestors2(animation) {
    return !animation || animation._ts && _hasNoPausedAncestors2(animation.parent);
  };
  var _elapsedCycleDuration = function _elapsedCycleDuration2(animation) {
    return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
  };
  var _animationCycle = function _animationCycle2(tTime, cycleDuration) {
    var whole = Math.floor(tTime /= cycleDuration);
    return tTime && whole === tTime ? whole - 1 : whole;
  };
  var _parentToChildTotalTime = function _parentToChildTotalTime2(parentTime, child) {
    return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
  };
  var _setEnd = function _setEnd2(animation) {
    return animation._end = _roundPrecise(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
  };
  var _alignPlayhead = function _alignPlayhead2(animation, totalTime) {
    var parent = animation._dp;
    if (parent && parent.smoothChildTiming && animation._ts) {
      animation._start = _roundPrecise(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));
      _setEnd(animation);
      parent._dirty || _uncache(parent, animation);
    }
    return animation;
  };
  var _postAddChecks = function _postAddChecks2(timeline2, child) {
    var t2;
    if (child._time || child._initted && !child._dur) {
      t2 = _parentToChildTotalTime(timeline2.rawTime(), child);
      if (!child._dur || _clamp(0, child.totalDuration(), t2) - child._tTime > _tinyNum) {
        child.render(t2, true);
      }
    }
    if (_uncache(timeline2, child)._dp && timeline2._initted && timeline2._time >= timeline2._dur && timeline2._ts) {
      if (timeline2._dur < timeline2.duration()) {
        t2 = timeline2;
        while (t2._dp) {
          t2.rawTime() >= 0 && t2.totalTime(t2._tTime);
          t2 = t2._dp;
        }
      }
      timeline2._zTime = -_tinyNum;
    }
  };
  var _addToTimeline = function _addToTimeline2(timeline2, child, position, skipChecks) {
    child.parent && _removeFromParent(child);
    child._start = _roundPrecise((_isNumber(position) ? position : position || timeline2 !== _globalTimeline ? _parsePosition(timeline2, position, child) : timeline2._time) + child._delay);
    child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));
    _addLinkedListItem(timeline2, child, "_first", "_last", timeline2._sort ? "_start" : 0);
    _isFromOrFromStart(child) || (timeline2._recent = child);
    skipChecks || _postAddChecks(timeline2, child);
    timeline2._ts < 0 && _alignPlayhead(timeline2, timeline2._tTime);
    return timeline2;
  };
  var _scrollTrigger = function _scrollTrigger2(animation, trigger) {
    return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
  };
  var _attemptInitTween = function _attemptInitTween2(tween, time, force, suppressEvents, tTime) {
    _initTween(tween, time, tTime);
    if (!tween._initted) {
      return 1;
    }
    if (!force && tween._pt && !_reverting && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
      _lazyTweens.push(tween);
      tween._lazy = [tTime, suppressEvents];
      return 1;
    }
  };
  var _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart2(_ref) {
    var parent = _ref.parent;
    return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart2(parent));
  };
  var _isFromOrFromStart = function _isFromOrFromStart2(_ref2) {
    var data = _ref2.data;
    return data === "isFromStart" || data === "isStart";
  };
  var _renderZeroDurationTween = function _renderZeroDurationTween2(tween, totalTime, suppressEvents, force) {
    var prevRatio = tween.ratio, ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1, repeatDelay = tween._rDelay, tTime = 0, pt, iteration, prevIteration;
    if (repeatDelay && tween._repeat) {
      tTime = _clamp(0, tween._tDur, totalTime);
      iteration = _animationCycle(tTime, repeatDelay);
      tween._yoyo && iteration & 1 && (ratio = 1 - ratio);
      if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
        prevRatio = 1 - ratio;
        tween.vars.repeatRefresh && tween._initted && tween.invalidate();
      }
    }
    if (ratio !== prevRatio || _reverting || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
      if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents, tTime)) {
        return;
      }
      prevIteration = tween._zTime;
      tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
      suppressEvents || (suppressEvents = totalTime && !prevIteration);
      tween.ratio = ratio;
      tween._from && (ratio = 1 - ratio);
      tween._time = 0;
      tween._tTime = tTime;
      pt = tween._pt;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
      totalTime < 0 && _rewindStartAt(tween, totalTime, suppressEvents, true);
      tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
      tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");
      if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
        ratio && _removeFromParent(tween, 1);
        if (!suppressEvents && !_reverting) {
          _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);
          tween._prom && tween._prom();
        }
      }
    } else if (!tween._zTime) {
      tween._zTime = totalTime;
    }
  };
  var _findNextPauseTween = function _findNextPauseTween2(animation, prevTime, time) {
    var child;
    if (time > prevTime) {
      child = animation._first;
      while (child && child._start <= time) {
        if (child.data === "isPause" && child._start > prevTime) {
          return child;
        }
        child = child._next;
      }
    } else {
      child = animation._last;
      while (child && child._start >= time) {
        if (child.data === "isPause" && child._start < prevTime) {
          return child;
        }
        child = child._prev;
      }
    }
  };
  var _setDuration = function _setDuration2(animation, duration, skipUncache, leavePlayhead) {
    var repeat = animation._repeat, dur = _roundPrecise(duration) || 0, totalProgress = animation._tTime / animation._tDur;
    totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
    animation._dur = dur;
    animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
    totalProgress > 0 && !leavePlayhead && _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress);
    animation.parent && _setEnd(animation);
    skipUncache || _uncache(animation.parent, animation);
    return animation;
  };
  var _onUpdateTotalDuration = function _onUpdateTotalDuration2(animation) {
    return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
  };
  var _zeroPosition = {
    _start: 0,
    endTime: _emptyFunc,
    totalDuration: _emptyFunc
  };
  var _parsePosition = function _parsePosition2(animation, position, percentAnimation) {
    var labels = animation.labels, recent = animation._recent || _zeroPosition, clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur, i2, offset, isPercent;
    if (_isString(position) && (isNaN(position) || position in labels)) {
      offset = position.charAt(0);
      isPercent = position.substr(-1) === "%";
      i2 = position.indexOf("=");
      if (offset === "<" || offset === ">") {
        i2 >= 0 && (position = position.replace(/=/, ""));
        return (offset === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0) * (isPercent ? (i2 < 0 ? recent : percentAnimation).totalDuration() / 100 : 1);
      }
      if (i2 < 0) {
        position in labels || (labels[position] = clippedDuration);
        return labels[position];
      }
      offset = parseFloat(position.charAt(i2 - 1) + position.substr(i2 + 1));
      if (isPercent && percentAnimation) {
        offset = offset / 100 * (_isArray(percentAnimation) ? percentAnimation[0] : percentAnimation).totalDuration();
      }
      return i2 > 1 ? _parsePosition2(animation, position.substr(0, i2 - 1), percentAnimation) + offset : clippedDuration + offset;
    }
    return position == null ? clippedDuration : +position;
  };
  var _createTweenType = function _createTweenType2(type, params, timeline2) {
    var isLegacy = _isNumber(params[1]), varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1), vars = params[varsIndex], irVars, parent;
    isLegacy && (vars.duration = params[1]);
    vars.parent = timeline2;
    if (type) {
      irVars = vars;
      parent = timeline2;
      while (parent && !("immediateRender" in irVars)) {
        irVars = parent.vars.defaults || {};
        parent = _isNotFalse(parent.vars.inherit) && parent.parent;
      }
      vars.immediateRender = _isNotFalse(irVars.immediateRender);
      type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1];
    }
    return new Tween(params[0], vars, params[varsIndex + 1]);
  };
  var _conditionalReturn = function _conditionalReturn2(value, func) {
    return value || value === 0 ? func(value) : func;
  };
  var _clamp = function _clamp2(min, max, value) {
    return value < min ? min : value > max ? max : value;
  };
  var getUnit = function getUnit2(value, v) {
    return !_isString(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
  };
  var clamp = function clamp2(min, max, value) {
    return _conditionalReturn(value, function(v) {
      return _clamp(min, max, v);
    });
  };
  var _slice = [].slice;
  var _isArrayLike = function _isArrayLike2(value, nonEmpty) {
    return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win;
  };
  var _flatten = function _flatten2(ar, leaveStrings, accumulator) {
    if (accumulator === void 0) {
      accumulator = [];
    }
    return ar.forEach(function(value) {
      var _accumulator;
      return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
    }) || accumulator;
  };
  var toArray = function toArray2(value, scope, leaveStrings) {
    return _context && !scope && _context.selector ? _context.selector(value) : _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call((scope || _doc).querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
  };
  var selector = function selector2(value) {
    value = toArray(value)[0] || _warn("Invalid scope") || {};
    return function(v) {
      var el = value.current || value.nativeElement || value;
      return toArray(v, el.querySelectorAll ? el : el === value ? _warn("Invalid scope") || _doc.createElement("div") : value);
    };
  };
  var shuffle = function shuffle2(a) {
    return a.sort(function() {
      return 0.5 - Math.random();
    });
  };
  var distribute = function distribute2(v) {
    if (_isFunction(v)) {
      return v;
    }
    var vars = _isObject(v) ? v : {
      each: v
    }, ease = _parseEase(vars.ease), from = vars.from || 0, base = parseFloat(vars.base) || 0, cache = {}, isDecimal = from > 0 && from < 1, ratios = isNaN(from) || isDecimal, axis = vars.axis, ratioX = from, ratioY = from;
    if (_isString(from)) {
      ratioX = ratioY = {
        center: 0.5,
        edges: 0.5,
        end: 1
      }[from] || 0;
    } else if (!isDecimal && ratios) {
      ratioX = from[0];
      ratioY = from[1];
    }
    return function(i2, target, a) {
      var l = (a || vars).length, distances = cache[l], originX, originY, x, y, d, j, max, min, wrapAt;
      if (!distances) {
        wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum])[1];
        if (!wrapAt) {
          max = -_bigNum;
          while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {
          }
          wrapAt--;
        }
        distances = cache[l] = [];
        originX = ratios ? Math.min(wrapAt, l) * ratioX - 0.5 : from % wrapAt;
        originY = wrapAt === _bigNum ? 0 : ratios ? l * ratioY / wrapAt - 0.5 : from / wrapAt | 0;
        max = 0;
        min = _bigNum;
        for (j = 0; j < l; j++) {
          x = j % wrapAt - originX;
          y = originY - (j / wrapAt | 0);
          distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
          d > max && (max = d);
          d < min && (min = d);
        }
        from === "random" && shuffle(distances);
        distances.max = max - min;
        distances.min = min;
        distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
        distances.b = l < 0 ? base - l : base;
        distances.u = getUnit(vars.amount || vars.each) || 0;
        ease = ease && l < 0 ? _invertEase(ease) : ease;
      }
      l = (distances[i2] - distances.min) / distances.max || 0;
      return _roundPrecise(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u;
    };
  };
  var _roundModifier = function _roundModifier2(v) {
    var p = Math.pow(10, ((v + "").split(".")[1] || "").length);
    return function(raw) {
      var n2 = _roundPrecise(Math.round(parseFloat(raw) / v) * v * p);
      return (n2 - n2 % 1) / p + (_isNumber(raw) ? 0 : getUnit(raw));
    };
  };
  var snap = function snap2(snapTo, value) {
    var isArray = _isArray(snapTo), radius, is2D;
    if (!isArray && _isObject(snapTo)) {
      radius = isArray = snapTo.radius || _bigNum;
      if (snapTo.values) {
        snapTo = toArray(snapTo.values);
        if (is2D = !_isNumber(snapTo[0])) {
          radius *= radius;
        }
      } else {
        snapTo = _roundModifier(snapTo.increment);
      }
    }
    return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function(raw) {
      is2D = snapTo(raw);
      return Math.abs(is2D - raw) <= radius ? is2D : raw;
    } : function(raw) {
      var x = parseFloat(is2D ? raw.x : raw), y = parseFloat(is2D ? raw.y : 0), min = _bigNum, closest = 0, i2 = snapTo.length, dx, dy;
      while (i2--) {
        if (is2D) {
          dx = snapTo[i2].x - x;
          dy = snapTo[i2].y - y;
          dx = dx * dx + dy * dy;
        } else {
          dx = Math.abs(snapTo[i2] - x);
        }
        if (dx < min) {
          min = dx;
          closest = i2;
        }
      }
      closest = !radius || min <= radius ? snapTo[closest] : raw;
      return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
    });
  };
  var random = function random2(min, max, roundingIncrement, returnFunction) {
    return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function() {
      return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * 0.99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
    });
  };
  var pipe = function pipe2() {
    for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
      functions[_key] = arguments[_key];
    }
    return function(value) {
      return functions.reduce(function(v, f) {
        return f(v);
      }, value);
    };
  };
  var unitize = function unitize2(func, unit) {
    return function(value) {
      return func(parseFloat(value)) + (unit || getUnit(value));
    };
  };
  var normalize = function normalize2(min, max, value) {
    return mapRange(min, max, 0, 1, value);
  };
  var _wrapArray = function _wrapArray2(a, wrapper, value) {
    return _conditionalReturn(value, function(index) {
      return a[~~wrapper(index)];
    });
  };
  var wrap = function wrap2(min, max, value) {
    var range = max - min;
    return _isArray(min) ? _wrapArray(min, wrap2(0, min.length), max) : _conditionalReturn(value, function(value2) {
      return (range + (value2 - min) % range) % range + min;
    });
  };
  var wrapYoyo = function wrapYoyo2(min, max, value) {
    var range = max - min, total = range * 2;
    return _isArray(min) ? _wrapArray(min, wrapYoyo2(0, min.length - 1), max) : _conditionalReturn(value, function(value2) {
      value2 = (total + (value2 - min) % total) % total || 0;
      return min + (value2 > range ? total - value2 : value2);
    });
  };
  var _replaceRandom = function _replaceRandom2(value) {
    var prev = 0, s2 = "", i2, nums, end, isArray;
    while (~(i2 = value.indexOf("random(", prev))) {
      end = value.indexOf(")", i2);
      isArray = value.charAt(i2 + 7) === "[";
      nums = value.substr(i2 + 7, end - i2 - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
      s2 += value.substr(prev, i2 - prev) + random(isArray ? nums : +nums[0], isArray ? 0 : +nums[1], +nums[2] || 1e-5);
      prev = end + 1;
    }
    return s2 + value.substr(prev, value.length - prev);
  };
  var mapRange = function mapRange2(inMin, inMax, outMin, outMax, value) {
    var inRange = inMax - inMin, outRange = outMax - outMin;
    return _conditionalReturn(value, function(value2) {
      return outMin + ((value2 - inMin) / inRange * outRange || 0);
    });
  };
  var interpolate = function interpolate2(start, end, progress, mutate) {
    var func = isNaN(start + end) ? 0 : function(p2) {
      return (1 - p2) * start + p2 * end;
    };
    if (!func) {
      var isString = _isString(start), master = {}, p, i2, interpolators, l, il;
      progress === true && (mutate = 1) && (progress = null);
      if (isString) {
        start = {
          p: start
        };
        end = {
          p: end
        };
      } else if (_isArray(start) && !_isArray(end)) {
        interpolators = [];
        l = start.length;
        il = l - 2;
        for (i2 = 1; i2 < l; i2++) {
          interpolators.push(interpolate2(start[i2 - 1], start[i2]));
        }
        l--;
        func = function func2(p2) {
          p2 *= l;
          var i3 = Math.min(il, ~~p2);
          return interpolators[i3](p2 - i3);
        };
        progress = end;
      } else if (!mutate) {
        start = _merge(_isArray(start) ? [] : {}, start);
      }
      if (!interpolators) {
        for (p in end) {
          _addPropTween.call(master, start, p, "get", end[p]);
        }
        func = function func2(p2) {
          return _renderPropTweens(p2, master) || (isString ? start.p : start);
        };
      }
    }
    return _conditionalReturn(progress, func);
  };
  var _getLabelInDirection = function _getLabelInDirection2(timeline2, fromTime, backward) {
    var labels = timeline2.labels, min = _bigNum, p, distance, label;
    for (p in labels) {
      distance = labels[p] - fromTime;
      if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
        label = p;
        min = distance;
      }
    }
    return label;
  };
  var _callback = function _callback2(animation, type, executeLazyFirst) {
    var v = animation.vars, callback = v[type], prevContext = _context, context3 = animation._ctx, params, scope, result;
    if (!callback) {
      return;
    }
    params = v[type + "Params"];
    scope = v.callbackScope || animation;
    executeLazyFirst && _lazyTweens.length && _lazyRender();
    context3 && (_context = context3);
    result = params ? callback.apply(scope, params) : callback.call(scope);
    _context = prevContext;
    return result;
  };
  var _interrupt = function _interrupt2(animation) {
    _removeFromParent(animation);
    animation.scrollTrigger && animation.scrollTrigger.kill(!!_reverting);
    animation.progress() < 1 && _callback(animation, "onInterrupt");
    return animation;
  };
  var _quickTween;
  var _registerPluginQueue = [];
  var _createPlugin = function _createPlugin2(config3) {
    if (!_windowExists()) {
      _registerPluginQueue.push(config3);
      return;
    }
    config3 = !config3.name && config3["default"] || config3;
    var name = config3.name, isFunc = _isFunction(config3), Plugin = name && !isFunc && config3.init ? function() {
      this._props = [];
    } : config3, instanceDefaults = {
      init: _emptyFunc,
      render: _renderPropTweens,
      add: _addPropTween,
      kill: _killPropTweensOf,
      modifier: _addPluginModifier,
      rawVars: 0
    }, statics = {
      targetTest: 0,
      get: 0,
      getSetter: _getSetter,
      aliases: {},
      register: 0
    };
    _wake();
    if (config3 !== Plugin) {
      if (_plugins[name]) {
        return;
      }
      _setDefaults(Plugin, _setDefaults(_copyExcluding(config3, instanceDefaults), statics));
      _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config3, statics)));
      _plugins[Plugin.prop = name] = Plugin;
      if (config3.targetTest) {
        _harnessPlugins.push(Plugin);
        _reservedProps[name] = 1;
      }
      name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
    }
    _addGlobal(name, Plugin);
    config3.register && config3.register(gsap, Plugin, PropTween);
  };
  var _255 = 255;
  var _colorLookup = {
    aqua: [0, _255, _255],
    lime: [0, _255, 0],
    silver: [192, 192, 192],
    black: [0, 0, 0],
    maroon: [128, 0, 0],
    teal: [0, 128, 128],
    blue: [0, 0, _255],
    navy: [0, 0, 128],
    white: [_255, _255, _255],
    olive: [128, 128, 0],
    yellow: [_255, _255, 0],
    orange: [_255, 165, 0],
    gray: [128, 128, 128],
    purple: [128, 0, 128],
    green: [0, 128, 0],
    red: [_255, 0, 0],
    pink: [_255, 192, 203],
    cyan: [0, _255, _255],
    transparent: [_255, _255, _255, 0]
  };
  var _hue = function _hue2(h, m1, m2) {
    h += h < 0 ? 1 : h > 1 ? -1 : 0;
    return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < 0.5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + 0.5 | 0;
  };
  var splitColor = function splitColor2(v, toHSL, forceAlpha) {
    var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0, r2, g, b, h, s2, l, max, min, d, wasHSL;
    if (!a) {
      if (v.substr(-1) === ",") {
        v = v.substr(0, v.length - 1);
      }
      if (_colorLookup[v]) {
        a = _colorLookup[v];
      } else if (v.charAt(0) === "#") {
        if (v.length < 6) {
          r2 = v.charAt(1);
          g = v.charAt(2);
          b = v.charAt(3);
          v = "#" + r2 + r2 + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
        }
        if (v.length === 9) {
          a = parseInt(v.substr(1, 6), 16);
          return [a >> 16, a >> 8 & _255, a & _255, parseInt(v.substr(7), 16) / 255];
        }
        v = parseInt(v.substr(1), 16);
        a = [v >> 16, v >> 8 & _255, v & _255];
      } else if (v.substr(0, 3) === "hsl") {
        a = wasHSL = v.match(_strictNumExp);
        if (!toHSL) {
          h = +a[0] % 360 / 360;
          s2 = +a[1] / 100;
          l = +a[2] / 100;
          g = l <= 0.5 ? l * (s2 + 1) : l + s2 - l * s2;
          r2 = l * 2 - g;
          a.length > 3 && (a[3] *= 1);
          a[0] = _hue(h + 1 / 3, r2, g);
          a[1] = _hue(h, r2, g);
          a[2] = _hue(h - 1 / 3, r2, g);
        } else if (~v.indexOf("=")) {
          a = v.match(_numExp);
          forceAlpha && a.length < 4 && (a[3] = 1);
          return a;
        }
      } else {
        a = v.match(_strictNumExp) || _colorLookup.transparent;
      }
      a = a.map(Number);
    }
    if (toHSL && !wasHSL) {
      r2 = a[0] / _255;
      g = a[1] / _255;
      b = a[2] / _255;
      max = Math.max(r2, g, b);
      min = Math.min(r2, g, b);
      l = (max + min) / 2;
      if (max === min) {
        h = s2 = 0;
      } else {
        d = max - min;
        s2 = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        h = max === r2 ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r2) / d + 2 : (r2 - g) / d + 4;
        h *= 60;
      }
      a[0] = ~~(h + 0.5);
      a[1] = ~~(s2 * 100 + 0.5);
      a[2] = ~~(l * 100 + 0.5);
    }
    forceAlpha && a.length < 4 && (a[3] = 1);
    return a;
  };
  var _colorOrderData = function _colorOrderData2(v) {
    var values = [], c = [], i2 = -1;
    v.split(_colorExp).forEach(function(v2) {
      var a = v2.match(_numWithUnitExp) || [];
      values.push.apply(values, a);
      c.push(i2 += a.length + 1);
    });
    values.c = c;
    return values;
  };
  var _formatColors = function _formatColors2(s2, toHSL, orderMatchData) {
    var result = "", colors = (s2 + result).match(_colorExp), type = toHSL ? "hsla(" : "rgba(", i2 = 0, c, shell, d, l;
    if (!colors) {
      return s2;
    }
    colors = colors.map(function(color) {
      return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
    });
    if (orderMatchData) {
      d = _colorOrderData(s2);
      c = orderMatchData.c;
      if (c.join(result) !== d.c.join(result)) {
        shell = s2.replace(_colorExp, "1").split(_numWithUnitExp);
        l = shell.length - 1;
        for (; i2 < l; i2++) {
          result += shell[i2] + (~c.indexOf(i2) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
        }
      }
    }
    if (!shell) {
      shell = s2.split(_colorExp);
      l = shell.length - 1;
      for (; i2 < l; i2++) {
        result += shell[i2] + colors[i2];
      }
    }
    return result + shell[l];
  };
  var _colorExp = function() {
    var s2 = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", p;
    for (p in _colorLookup) {
      s2 += "|" + p + "\\b";
    }
    return new RegExp(s2 + ")", "gi");
  }();
  var _hslExp = /hsl[a]?\(/;
  var _colorStringFilter = function _colorStringFilter2(a) {
    var combined = a.join(" "), toHSL;
    _colorExp.lastIndex = 0;
    if (_colorExp.test(combined)) {
      toHSL = _hslExp.test(combined);
      a[1] = _formatColors(a[1], toHSL);
      a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1]));
      return true;
    }
  };
  var _tickerActive;
  var _ticker = function() {
    var _getTime3 = Date.now, _lagThreshold = 500, _adjustedLag = 33, _startTime = _getTime3(), _lastUpdate = _startTime, _gap = 1e3 / 240, _nextTime = _gap, _listeners3 = [], _id, _req, _raf, _self, _delta, _i2, _tick = function _tick2(v) {
      var elapsed = _getTime3() - _lastUpdate, manual = v === true, overlap, dispatch, time, frame;
      elapsed > _lagThreshold && (_startTime += elapsed - _adjustedLag);
      _lastUpdate += elapsed;
      time = _lastUpdate - _startTime;
      overlap = time - _nextTime;
      if (overlap > 0 || manual) {
        frame = ++_self.frame;
        _delta = time - _self.time * 1e3;
        _self.time = time = time / 1e3;
        _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
        dispatch = 1;
      }
      manual || (_id = _req(_tick2));
      if (dispatch) {
        for (_i2 = 0; _i2 < _listeners3.length; _i2++) {
          _listeners3[_i2](time, _delta, frame, v);
        }
      }
    };
    _self = {
      time: 0,
      frame: 0,
      tick: function tick() {
        _tick(true);
      },
      deltaRatio: function deltaRatio(fps) {
        return _delta / (1e3 / (fps || 60));
      },
      wake: function wake() {
        if (_coreReady) {
          if (!_coreInitted && _windowExists()) {
            _win = _coreInitted = window;
            _doc = _win.document || {};
            _globals.gsap = gsap;
            (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);
            _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});
            _raf = _win.requestAnimationFrame;
            _registerPluginQueue.forEach(_createPlugin);
          }
          _id && _self.sleep();
          _req = _raf || function(f) {
            return setTimeout(f, _nextTime - _self.time * 1e3 + 1 | 0);
          };
          _tickerActive = 1;
          _tick(2);
        }
      },
      sleep: function sleep() {
        (_raf ? _win.cancelAnimationFrame : clearTimeout)(_id);
        _tickerActive = 0;
        _req = _emptyFunc;
      },
      lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
        _lagThreshold = threshold || Infinity;
        _adjustedLag = Math.min(adjustedLag || 33, _lagThreshold);
      },
      fps: function fps(_fps) {
        _gap = 1e3 / (_fps || 240);
        _nextTime = _self.time * 1e3 + _gap;
      },
      add: function add(callback, once, prioritize) {
        var func = once ? function(t2, d, f, v) {
          callback(t2, d, f, v);
          _self.remove(func);
        } : callback;
        _self.remove(callback);
        _listeners3[prioritize ? "unshift" : "push"](func);
        _wake();
        return func;
      },
      remove: function remove(callback, i2) {
        ~(i2 = _listeners3.indexOf(callback)) && _listeners3.splice(i2, 1) && _i2 >= i2 && _i2--;
      },
      _listeners: _listeners3
    };
    return _self;
  }();
  var _wake = function _wake2() {
    return !_tickerActive && _ticker.wake();
  };
  var _easeMap = {};
  var _customEaseExp = /^[\d.\-M][\d.\-,\s]/;
  var _quotesExp = /["']/g;
  var _parseObjectInString = function _parseObjectInString2(value) {
    var obj = {}, split = value.substr(1, value.length - 3).split(":"), key = split[0], i2 = 1, l = split.length, index, val, parsedVal;
    for (; i2 < l; i2++) {
      val = split[i2];
      index = i2 !== l - 1 ? val.lastIndexOf(",") : val.length;
      parsedVal = val.substr(0, index);
      obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
      key = val.substr(index + 1).trim();
    }
    return obj;
  };
  var _valueInParentheses = function _valueInParentheses2(value) {
    var open = value.indexOf("(") + 1, close = value.indexOf(")"), nested = value.indexOf("(", open);
    return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
  };
  var _configEaseFromString = function _configEaseFromString2(name) {
    var split = (name + "").split("("), ease = _easeMap[split[0]];
    return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
  };
  var _invertEase = function _invertEase2(ease) {
    return function(p) {
      return 1 - ease(1 - p);
    };
  };
  var _propagateYoyoEase = function _propagateYoyoEase2(timeline2, isYoyo) {
    var child = timeline2._first, ease;
    while (child) {
      if (child instanceof Timeline) {
        _propagateYoyoEase2(child, isYoyo);
      } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
        if (child.timeline) {
          _propagateYoyoEase2(child.timeline, isYoyo);
        } else {
          ease = child._ease;
          child._ease = child._yEase;
          child._yEase = ease;
          child._yoyo = isYoyo;
        }
      }
      child = child._next;
    }
  };
  var _parseEase = function _parseEase2(ease, defaultEase) {
    return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
  };
  var _insertEase = function _insertEase2(names, easeIn, easeOut, easeInOut) {
    if (easeOut === void 0) {
      easeOut = function easeOut2(p) {
        return 1 - easeIn(1 - p);
      };
    }
    if (easeInOut === void 0) {
      easeInOut = function easeInOut2(p) {
        return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
      };
    }
    var ease = {
      easeIn,
      easeOut,
      easeInOut
    }, lowercaseName;
    _forEachName(names, function(name) {
      _easeMap[name] = _globals[name] = ease;
      _easeMap[lowercaseName = name.toLowerCase()] = easeOut;
      for (var p in ease) {
        _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
      }
    });
    return ease;
  };
  var _easeInOutFromOut = function _easeInOutFromOut2(easeOut) {
    return function(p) {
      return p < 0.5 ? (1 - easeOut(1 - p * 2)) / 2 : 0.5 + easeOut((p - 0.5) * 2) / 2;
    };
  };
  var _configElastic = function _configElastic2(type, amplitude, period) {
    var p1 = amplitude >= 1 ? amplitude : 1, p2 = (period || (type ? 0.3 : 0.45)) / (amplitude < 1 ? amplitude : 1), p3 = p2 / _2PI * (Math.asin(1 / p1) || 0), easeOut = function easeOut2(p) {
      return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
    }, ease = type === "out" ? easeOut : type === "in" ? function(p) {
      return 1 - easeOut(1 - p);
    } : _easeInOutFromOut(easeOut);
    p2 = _2PI / p2;
    ease.config = function(amplitude2, period2) {
      return _configElastic2(type, amplitude2, period2);
    };
    return ease;
  };
  var _configBack = function _configBack2(type, overshoot) {
    if (overshoot === void 0) {
      overshoot = 1.70158;
    }
    var easeOut = function easeOut2(p) {
      return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
    }, ease = type === "out" ? easeOut : type === "in" ? function(p) {
      return 1 - easeOut(1 - p);
    } : _easeInOutFromOut(easeOut);
    ease.config = function(overshoot2) {
      return _configBack2(type, overshoot2);
    };
    return ease;
  };
  _forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function(name, i2) {
    var power = i2 < 5 ? i2 + 1 : i2;
    _insertEase(name + ",Power" + (power - 1), i2 ? function(p) {
      return Math.pow(p, power);
    } : function(p) {
      return p;
    }, function(p) {
      return 1 - Math.pow(1 - p, power);
    }, function(p) {
      return p < 0.5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
    });
  });
  _easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
  _insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());
  (function(n2, c) {
    var n1 = 1 / c, n22 = 2 * n1, n3 = 2.5 * n1, easeOut = function easeOut2(p) {
      return p < n1 ? n2 * p * p : p < n22 ? n2 * Math.pow(p - 1.5 / c, 2) + 0.75 : p < n3 ? n2 * (p -= 2.25 / c) * p + 0.9375 : n2 * Math.pow(p - 2.625 / c, 2) + 0.984375;
    };
    _insertEase("Bounce", function(p) {
      return 1 - easeOut(1 - p);
    }, easeOut);
  })(7.5625, 2.75);
  _insertEase("Expo", function(p) {
    return p ? Math.pow(2, 10 * (p - 1)) : 0;
  });
  _insertEase("Circ", function(p) {
    return -(_sqrt(1 - p * p) - 1);
  });
  _insertEase("Sine", function(p) {
    return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
  });
  _insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
  _easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
    config: function config(steps, immediateStart) {
      if (steps === void 0) {
        steps = 1;
      }
      var p1 = 1 / steps, p2 = steps + (immediateStart ? 0 : 1), p3 = immediateStart ? 1 : 0, max = 1 - _tinyNum;
      return function(p) {
        return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
      };
    }
  };
  _defaults.ease = _easeMap["quad.out"];
  _forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(name) {
    return _callbackNames += name + "," + name + "Params,";
  });
  var GSCache = function GSCache2(target, harness) {
    this.id = _gsID++;
    target._gsap = this;
    this.target = target;
    this.harness = harness;
    this.get = harness ? harness.get : _getProperty;
    this.set = harness ? harness.getSetter : _getSetter;
  };
  var Animation = /* @__PURE__ */ function() {
    function Animation2(vars) {
      this.vars = vars;
      this._delay = +vars.delay || 0;
      if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
        this._rDelay = vars.repeatDelay || 0;
        this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
      }
      this._ts = 1;
      _setDuration(this, +vars.duration, 1, 1);
      this.data = vars.data;
      if (_context) {
        this._ctx = _context;
        _context.data.push(this);
      }
      _tickerActive || _ticker.wake();
    }
    var _proto = Animation2.prototype;
    _proto.delay = function delay(value) {
      if (value || value === 0) {
        this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
        this._delay = value;
        return this;
      }
      return this._delay;
    };
    _proto.duration = function duration(value) {
      return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
    };
    _proto.totalDuration = function totalDuration(value) {
      if (!arguments.length) {
        return this._tDur;
      }
      this._dirty = 0;
      return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
    };
    _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
      _wake();
      if (!arguments.length) {
        return this._tTime;
      }
      var parent = this._dp;
      if (parent && parent.smoothChildTiming && this._ts) {
        _alignPlayhead(this, _totalTime);
        !parent._dp || parent.parent || _postAddChecks(parent, this);
        while (parent && parent.parent) {
          if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
            parent.totalTime(parent._tTime, true);
          }
          parent = parent.parent;
        }
        if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
          _addToTimeline(this._dp, this, this._start - this._delay);
        }
      }
      if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
        this._ts || (this._pTime = _totalTime);
        _lazySafeRender(this, _totalTime, suppressEvents);
      }
      return this;
    };
    _proto.time = function time(value, suppressEvents) {
      return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time;
    };
    _proto.totalProgress = function totalProgress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.ratio;
    };
    _proto.progress = function progress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.ratio;
    };
    _proto.iteration = function iteration(value, suppressEvents) {
      var cycleDuration = this.duration() + this._rDelay;
      return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
    };
    _proto.timeScale = function timeScale(value) {
      if (!arguments.length) {
        return this._rts === -_tinyNum ? 0 : this._rts;
      }
      if (this._rts === value) {
        return this;
      }
      var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime;
      this._rts = +value || 0;
      this._ts = this._ps || value === -_tinyNum ? 0 : this._rts;
      this.totalTime(_clamp(-Math.abs(this._delay), this._tDur, tTime), true);
      _setEnd(this);
      return _recacheAncestors(this);
    };
    _proto.paused = function paused(value) {
      if (!arguments.length) {
        return this._ps;
      }
      if (this._ps !== value) {
        this._ps = value;
        if (value) {
          this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
          this._ts = this._act = 0;
        } else {
          _wake();
          this._ts = this._rts;
          this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum));
        }
      }
      return this;
    };
    _proto.startTime = function startTime(value) {
      if (arguments.length) {
        this._start = value;
        var parent = this.parent || this._dp;
        parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
        return this;
      }
      return this._start;
    };
    _proto.endTime = function endTime(includeRepeats) {
      return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
    };
    _proto.rawTime = function rawTime(wrapRepeats) {
      var parent = this.parent || this._dp;
      return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
    };
    _proto.revert = function revert(config3) {
      if (config3 === void 0) {
        config3 = _revertConfig;
      }
      var prevIsReverting = _reverting;
      _reverting = config3;
      if (this._initted || this._startAt) {
        this.timeline && this.timeline.revert(config3);
        this.totalTime(-0.01, config3.suppressEvents);
      }
      this.data !== "nested" && config3.kill !== false && this.kill();
      _reverting = prevIsReverting;
      return this;
    };
    _proto.globalTime = function globalTime(rawTime) {
      var animation = this, time = arguments.length ? rawTime : animation.rawTime();
      while (animation) {
        time = animation._start + time / (animation._ts || 1);
        animation = animation._dp;
      }
      return !this.parent && this._sat ? this._sat.vars.immediateRender ? -1 : this._sat.globalTime(rawTime) : time;
    };
    _proto.repeat = function repeat(value) {
      if (arguments.length) {
        this._repeat = value === Infinity ? -2 : value;
        return _onUpdateTotalDuration(this);
      }
      return this._repeat === -2 ? Infinity : this._repeat;
    };
    _proto.repeatDelay = function repeatDelay(value) {
      if (arguments.length) {
        var time = this._time;
        this._rDelay = value;
        _onUpdateTotalDuration(this);
        return time ? this.time(time) : this;
      }
      return this._rDelay;
    };
    _proto.yoyo = function yoyo(value) {
      if (arguments.length) {
        this._yoyo = value;
        return this;
      }
      return this._yoyo;
    };
    _proto.seek = function seek(position, suppressEvents) {
      return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
    };
    _proto.restart = function restart(includeDelay, suppressEvents) {
      return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
    };
    _proto.play = function play(from, suppressEvents) {
      from != null && this.seek(from, suppressEvents);
      return this.reversed(false).paused(false);
    };
    _proto.reverse = function reverse(from, suppressEvents) {
      from != null && this.seek(from || this.totalDuration(), suppressEvents);
      return this.reversed(true).paused(false);
    };
    _proto.pause = function pause(atTime, suppressEvents) {
      atTime != null && this.seek(atTime, suppressEvents);
      return this.paused(true);
    };
    _proto.resume = function resume() {
      return this.paused(false);
    };
    _proto.reversed = function reversed(value) {
      if (arguments.length) {
        !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0));
        return this;
      }
      return this._rts < 0;
    };
    _proto.invalidate = function invalidate() {
      this._initted = this._act = 0;
      this._zTime = -_tinyNum;
      return this;
    };
    _proto.isActive = function isActive() {
      var parent = this.parent || this._dp, start = this._start, rawTime;
      return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
    };
    _proto.eventCallback = function eventCallback(type, callback, params) {
      var vars = this.vars;
      if (arguments.length > 1) {
        if (!callback) {
          delete vars[type];
        } else {
          vars[type] = callback;
          params && (vars[type + "Params"] = params);
          type === "onUpdate" && (this._onUpdate = callback);
        }
        return this;
      }
      return vars[type];
    };
    _proto.then = function then(onFulfilled) {
      var self = this;
      return new Promise(function(resolve) {
        var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough, _resolve = function _resolve2() {
          var _then = self.then;
          self.then = null;
          _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
          resolve(f);
          self.then = _then;
        };
        if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
          _resolve();
        } else {
          self._prom = _resolve;
        }
      });
    };
    _proto.kill = function kill() {
      _interrupt(this);
    };
    return Animation2;
  }();
  _setDefaults(Animation.prototype, {
    _time: 0,
    _start: 0,
    _end: 0,
    _tTime: 0,
    _tDur: 0,
    _dirty: 0,
    _repeat: 0,
    _yoyo: false,
    parent: null,
    _initted: false,
    _rDelay: 0,
    _ts: 1,
    _dp: 0,
    ratio: 0,
    _zTime: -_tinyNum,
    _prom: 0,
    _ps: false,
    _rts: 1
  });
  var Timeline = /* @__PURE__ */ function(_Animation) {
    _inheritsLoose(Timeline2, _Animation);
    function Timeline2(vars, position) {
      var _this;
      if (vars === void 0) {
        vars = {};
      }
      _this = _Animation.call(this, vars) || this;
      _this.labels = {};
      _this.smoothChildTiming = !!vars.smoothChildTiming;
      _this.autoRemoveChildren = !!vars.autoRemoveChildren;
      _this._sort = _isNotFalse(vars.sortChildren);
      _globalTimeline && _addToTimeline(vars.parent || _globalTimeline, _assertThisInitialized(_this), position);
      vars.reversed && _this.reverse();
      vars.paused && _this.paused(true);
      vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
      return _this;
    }
    var _proto2 = Timeline2.prototype;
    _proto2.to = function to(targets, vars, position) {
      _createTweenType(0, arguments, this);
      return this;
    };
    _proto2.from = function from(targets, vars, position) {
      _createTweenType(1, arguments, this);
      return this;
    };
    _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
      _createTweenType(2, arguments, this);
      return this;
    };
    _proto2.set = function set(targets, vars, position) {
      vars.duration = 0;
      vars.parent = this;
      _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
      vars.immediateRender = !!vars.immediateRender;
      new Tween(targets, vars, _parsePosition(this, position), 1);
      return this;
    };
    _proto2.call = function call(callback, params, position) {
      return _addToTimeline(this, Tween.delayedCall(0, callback, params), position);
    };
    _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.duration = duration;
      vars.stagger = vars.stagger || stagger;
      vars.onComplete = onCompleteAll;
      vars.onCompleteParams = onCompleteAllParams;
      vars.parent = this;
      new Tween(targets, vars, _parsePosition(this, position));
      return this;
    };
    _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.runBackwards = 1;
      _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
      return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
    };
    _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
      toVars.startAt = fromVars;
      _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
      return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
    };
    _proto2.render = function render3(totalTime, suppressEvents, force) {
      var prevTime = this._time, tDur = this._dirty ? this.totalDuration() : this._tDur, dur = this._dur, tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime), crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur), time, child, next, iteration, cycleDuration, prevPaused, pauseTween, timeScale, prevStart, prevIteration, yoyo, isYoyo;
      this !== _globalTimeline && tTime > tDur && totalTime >= 0 && (tTime = tDur);
      if (tTime !== this._tTime || force || crossingStart) {
        if (prevTime !== this._time && dur) {
          tTime += this._time - prevTime;
          totalTime += this._time - prevTime;
        }
        time = tTime;
        prevStart = this._start;
        timeScale = this._ts;
        prevPaused = !timeScale;
        if (crossingStart) {
          dur || (prevTime = this._zTime);
          (totalTime || !suppressEvents) && (this._zTime = totalTime);
        }
        if (this._repeat) {
          yoyo = this._yoyo;
          cycleDuration = dur + this._rDelay;
          if (this._repeat < -1 && totalTime < 0) {
            return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
          }
          time = _roundPrecise(tTime % cycleDuration);
          if (tTime === tDur) {
            iteration = this._repeat;
            time = dur;
          } else {
            iteration = ~~(tTime / cycleDuration);
            if (iteration && iteration === tTime / cycleDuration) {
              time = dur;
              iteration--;
            }
            time > dur && (time = dur);
          }
          prevIteration = _animationCycle(this._tTime, cycleDuration);
          !prevTime && this._tTime && prevIteration !== iteration && this._tTime - prevIteration * cycleDuration - this._dur <= 0 && (prevIteration = iteration);
          if (yoyo && iteration & 1) {
            time = dur - time;
            isYoyo = 1;
          }
          if (iteration !== prevIteration && !this._lock) {
            var rewinding = yoyo && prevIteration & 1, doesWrap = rewinding === (yoyo && iteration & 1);
            iteration < prevIteration && (rewinding = !rewinding);
            prevTime = rewinding ? 0 : dur;
            this._lock = 1;
            this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
            this._tTime = tTime;
            !suppressEvents && this.parent && _callback(this, "onRepeat");
            this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);
            if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) {
              return this;
            }
            dur = this._dur;
            tDur = this._tDur;
            if (doesWrap) {
              this._lock = 2;
              prevTime = rewinding ? dur : -1e-4;
              this.render(prevTime, true);
              this.vars.repeatRefresh && !isYoyo && this.invalidate();
            }
            this._lock = 0;
            if (!this._ts && !prevPaused) {
              return this;
            }
            _propagateYoyoEase(this, isYoyo);
          }
        }
        if (this._hasPause && !this._forcing && this._lock < 2) {
          pauseTween = _findNextPauseTween(this, _roundPrecise(prevTime), _roundPrecise(time));
          if (pauseTween) {
            tTime -= time - (time = pauseTween._start);
          }
        }
        this._tTime = tTime;
        this._time = time;
        this._act = !timeScale;
        if (!this._initted) {
          this._onUpdate = this.vars.onUpdate;
          this._initted = 1;
          this._zTime = totalTime;
          prevTime = 0;
        }
        if (!prevTime && time && !suppressEvents && !iteration) {
          _callback(this, "onStart");
          if (this._tTime !== tTime) {
            return this;
          }
        }
        if (time >= prevTime && totalTime >= 0) {
          child = this._first;
          while (child) {
            next = child._next;
            if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force);
              }
              child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0;
                next && (tTime += this._zTime = -_tinyNum);
                break;
              }
            }
            child = next;
          }
        } else {
          child = this._last;
          var adjustedTime = totalTime < 0 ? totalTime : time;
          while (child) {
            next = child._prev;
            if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force);
              }
              child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force || _reverting && (child._initted || child._startAt));
              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0;
                next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum);
                break;
              }
            }
            child = next;
          }
        }
        if (pauseTween && !suppressEvents) {
          this.pause();
          pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;
          if (this._ts) {
            this._start = prevStart;
            _setEnd(this);
            return this.render(totalTime, suppressEvents, force);
          }
        }
        this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
        if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) {
          if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) {
            if (!this._lock) {
              (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
              if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
                _callback(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);
                this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
              }
            }
          }
        }
      }
      return this;
    };
    _proto2.add = function add(child, position) {
      var _this2 = this;
      _isNumber(position) || (position = _parsePosition(this, position, child));
      if (!(child instanceof Animation)) {
        if (_isArray(child)) {
          child.forEach(function(obj) {
            return _this2.add(obj, position);
          });
          return this;
        }
        if (_isString(child)) {
          return this.addLabel(child, position);
        }
        if (_isFunction(child)) {
          child = Tween.delayedCall(0, child);
        } else {
          return this;
        }
      }
      return this !== child ? _addToTimeline(this, child, position) : this;
    };
    _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
      if (nested === void 0) {
        nested = true;
      }
      if (tweens === void 0) {
        tweens = true;
      }
      if (timelines === void 0) {
        timelines = true;
      }
      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = -_bigNum;
      }
      var a = [], child = this._first;
      while (child) {
        if (child._start >= ignoreBeforeTime) {
          if (child instanceof Tween) {
            tweens && a.push(child);
          } else {
            timelines && a.push(child);
            nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
          }
        }
        child = child._next;
      }
      return a;
    };
    _proto2.getById = function getById2(id) {
      var animations = this.getChildren(1, 1, 1), i2 = animations.length;
      while (i2--) {
        if (animations[i2].vars.id === id) {
          return animations[i2];
        }
      }
    };
    _proto2.remove = function remove(child) {
      if (_isString(child)) {
        return this.removeLabel(child);
      }
      if (_isFunction(child)) {
        return this.killTweensOf(child);
      }
      _removeLinkedListItem(this, child);
      if (child === this._recent) {
        this._recent = this._last;
      }
      return _uncache(this);
    };
    _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
      if (!arguments.length) {
        return this._tTime;
      }
      this._forcing = 1;
      if (!this._dp && this._ts) {
        this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
      }
      _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
      this._forcing = 0;
      return this;
    };
    _proto2.addLabel = function addLabel(label, position) {
      this.labels[label] = _parsePosition(this, position);
      return this;
    };
    _proto2.removeLabel = function removeLabel(label) {
      delete this.labels[label];
      return this;
    };
    _proto2.addPause = function addPause(position, callback, params) {
      var t2 = Tween.delayedCall(0, callback || _emptyFunc, params);
      t2.data = "isPause";
      this._hasPause = 1;
      return _addToTimeline(this, t2, _parsePosition(this, position));
    };
    _proto2.removePause = function removePause(position) {
      var child = this._first;
      position = _parsePosition(this, position);
      while (child) {
        if (child._start === position && child.data === "isPause") {
          _removeFromParent(child);
        }
        child = child._next;
      }
    };
    _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      var tweens = this.getTweensOf(targets, onlyActive), i2 = tweens.length;
      while (i2--) {
        _overwritingTween !== tweens[i2] && tweens[i2].kill(targets, props);
      }
      return this;
    };
    _proto2.getTweensOf = function getTweensOf2(targets, onlyActive) {
      var a = [], parsedTargets = toArray(targets), child = this._first, isGlobalTime = _isNumber(onlyActive), children;
      while (child) {
        if (child instanceof Tween) {
          if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
            a.push(child);
          }
        } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
          a.push.apply(a, children);
        }
        child = child._next;
      }
      return a;
    };
    _proto2.tweenTo = function tweenTo(position, vars) {
      vars = vars || {};
      var tl = this, endTime = _parsePosition(tl, position), _vars = vars, startAt = _vars.startAt, _onStart = _vars.onStart, onStartParams = _vars.onStartParams, immediateRender = _vars.immediateRender, initted, tween = Tween.to(tl, _setDefaults({
        ease: vars.ease || "none",
        lazy: false,
        immediateRender: false,
        time: endTime,
        overwrite: "auto",
        duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
        onStart: function onStart() {
          tl.pause();
          if (!initted) {
            var duration = vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale());
            tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
            initted = 1;
          }
          _onStart && _onStart.apply(tween, onStartParams || []);
        }
      }, vars));
      return immediateRender ? tween.render(0) : tween;
    };
    _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
      return this.tweenTo(toPosition, _setDefaults({
        startAt: {
          time: _parsePosition(this, fromPosition)
        }
      }, vars));
    };
    _proto2.recent = function recent() {
      return this._recent;
    };
    _proto2.nextLabel = function nextLabel(afterTime) {
      if (afterTime === void 0) {
        afterTime = this._time;
      }
      return _getLabelInDirection(this, _parsePosition(this, afterTime));
    };
    _proto2.previousLabel = function previousLabel(beforeTime) {
      if (beforeTime === void 0) {
        beforeTime = this._time;
      }
      return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
    };
    _proto2.currentLabel = function currentLabel(value) {
      return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
    };
    _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = 0;
      }
      var child = this._first, labels = this.labels, p;
      while (child) {
        if (child._start >= ignoreBeforeTime) {
          child._start += amount;
          child._end += amount;
        }
        child = child._next;
      }
      if (adjustLabels) {
        for (p in labels) {
          if (labels[p] >= ignoreBeforeTime) {
            labels[p] += amount;
          }
        }
      }
      return _uncache(this);
    };
    _proto2.invalidate = function invalidate(soft) {
      var child = this._first;
      this._lock = 0;
      while (child) {
        child.invalidate(soft);
        child = child._next;
      }
      return _Animation.prototype.invalidate.call(this, soft);
    };
    _proto2.clear = function clear(includeLabels) {
      if (includeLabels === void 0) {
        includeLabels = true;
      }
      var child = this._first, next;
      while (child) {
        next = child._next;
        this.remove(child);
        child = next;
      }
      this._dp && (this._time = this._tTime = this._pTime = 0);
      includeLabels && (this.labels = {});
      return _uncache(this);
    };
    _proto2.totalDuration = function totalDuration(value) {
      var max = 0, self = this, child = self._last, prevStart = _bigNum, prev, start, parent;
      if (arguments.length) {
        return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
      }
      if (self._dirty) {
        parent = self.parent;
        while (child) {
          prev = child._prev;
          child._dirty && child.totalDuration();
          start = child._start;
          if (start > prevStart && self._sort && child._ts && !self._lock) {
            self._lock = 1;
            _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
          } else {
            prevStart = start;
          }
          if (start < 0 && child._ts) {
            max -= start;
            if (!parent && !self._dp || parent && parent.smoothChildTiming) {
              self._start += start / self._ts;
              self._time -= start;
              self._tTime -= start;
            }
            self.shiftChildren(-start, false, -Infinity);
            prevStart = 0;
          }
          child._end > max && child._ts && (max = child._end);
          child = prev;
        }
        _setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1, 1);
        self._dirty = 0;
      }
      return self._tDur;
    };
    Timeline2.updateRoot = function updateRoot(time) {
      if (_globalTimeline._ts) {
        _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
        _lastRenderedFrame = _ticker.frame;
      }
      if (_ticker.frame >= _nextGCFrame) {
        _nextGCFrame += _config.autoSleep || 120;
        var child = _globalTimeline._first;
        if (!child || !child._ts) {
          if (_config.autoSleep && _ticker._listeners.length < 2) {
            while (child && !child._ts) {
              child = child._next;
            }
            child || _ticker.sleep();
          }
        }
      }
    };
    return Timeline2;
  }(Animation);
  _setDefaults(Timeline.prototype, {
    _lock: 0,
    _hasPause: 0,
    _forcing: 0
  });
  var _addComplexStringPropTween = function _addComplexStringPropTween2(target, prop, start, end, setter, stringFilter, funcParam) {
    var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter), index = 0, matchIndex = 0, result, startNums, color, endNum, chunk, startNum, hasRandom, a;
    pt.b = start;
    pt.e = end;
    start += "";
    end += "";
    if (hasRandom = ~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }
    if (stringFilter) {
      a = [start, end];
      stringFilter(a, target, prop);
      start = a[0];
      end = a[1];
    }
    startNums = start.match(_complexStringNumExp) || [];
    while (result = _complexStringNumExp.exec(end)) {
      endNum = result[0];
      chunk = end.substring(index, result.index);
      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(") {
        color = 1;
      }
      if (endNum !== startNums[matchIndex++]) {
        startNum = parseFloat(startNums[matchIndex - 1]) || 0;
        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
          //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
          s: startNum,
          c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
          m: color && color < 4 ? Math.round : 0
        };
        index = _complexStringNumExp.lastIndex;
      }
    }
    pt.c = index < end.length ? end.substring(index, end.length) : "";
    pt.fp = funcParam;
    if (_relExp.test(end) || hasRandom) {
      pt.e = 0;
    }
    this._pt = pt;
    return pt;
  };
  var _addPropTween = function _addPropTween2(target, prop, start, end, index, targets, modifier, stringFilter, funcParam, optional) {
    _isFunction(end) && (end = end(index || 0, target, targets));
    var currentValue = target[prop], parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](), setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc, pt;
    if (_isString(end)) {
      if (~end.indexOf("random(")) {
        end = _replaceRandom(end);
      }
      if (end.charAt(1) === "=") {
        pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);
        if (pt || pt === 0) {
          end = pt;
        }
      }
    }
    if (!optional || parsedStart !== end || _forceAllPropTweens) {
      if (!isNaN(parsedStart * end) && end !== "") {
        pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
        funcParam && (pt.fp = funcParam);
        modifier && pt.modifier(modifier, this, target);
        return this._pt = pt;
      }
      !currentValue && !(prop in target) && _missingPlugin(prop, end);
      return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
    }
  };
  var _processVars = function _processVars2(vars, index, target, targets, tween) {
    _isFunction(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));
    if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
      return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
    }
    var copy = {}, p;
    for (p in vars) {
      copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
    }
    return copy;
  };
  var _checkPlugin = function _checkPlugin2(property, vars, tween, index, target, targets) {
    var plugin, pt, ptLookup, i2;
    if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
      tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);
      if (tween !== _quickTween) {
        ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
        i2 = plugin._props.length;
        while (i2--) {
          ptLookup[plugin._props[i2]] = pt;
        }
      }
    }
    return plugin;
  };
  var _overwritingTween;
  var _forceAllPropTweens;
  var _initTween = function _initTween2(tween, time, tTime) {
    var vars = tween.vars, ease = vars.ease, startAt = vars.startAt, immediateRender = vars.immediateRender, lazy = vars.lazy, onUpdate = vars.onUpdate, onUpdateParams = vars.onUpdateParams, callbackScope = vars.callbackScope, runBackwards = vars.runBackwards, yoyoEase = vars.yoyoEase, keyframes = vars.keyframes, autoRevert = vars.autoRevert, dur = tween._dur, prevStartAt = tween._startAt, targets = tween._targets, parent = tween.parent, fullTargets = parent && parent.data === "nested" ? parent.vars.targets : targets, autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites, tl = tween.timeline, cleanVars, i2, p, pt, target, hasPriority, gsData, harness, plugin, ptLookup, index, harnessVars, overwritten;
    tl && (!keyframes || !ease) && (ease = "none");
    tween._ease = _parseEase(ease, _defaults.ease);
    tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;
    if (yoyoEase && tween._yoyo && !tween._repeat) {
      yoyoEase = tween._yEase;
      tween._yEase = tween._ease;
      tween._ease = yoyoEase;
    }
    tween._from = !tl && !!vars.runBackwards;
    if (!tl || keyframes && !vars.stagger) {
      harness = targets[0] ? _getCache(targets[0]).harness : 0;
      harnessVars = harness && vars[harness.prop];
      cleanVars = _copyExcluding(vars, _reservedProps);
      if (prevStartAt) {
        prevStartAt._zTime < 0 && prevStartAt.progress(1);
        time < 0 && runBackwards && immediateRender && !autoRevert ? prevStartAt.render(-1, true) : prevStartAt.revert(runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig);
        prevStartAt._lazy = 0;
      }
      if (startAt) {
        _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
          data: "isStart",
          overwrite: false,
          parent,
          immediateRender: true,
          lazy: !prevStartAt && _isNotFalse(lazy),
          startAt: null,
          delay: 0,
          onUpdate,
          onUpdateParams,
          callbackScope,
          stagger: 0
        }, startAt)));
        tween._startAt._dp = 0;
        tween._startAt._sat = tween;
        time < 0 && (_reverting || !immediateRender && !autoRevert) && tween._startAt.revert(_revertConfigNoKill);
        if (immediateRender) {
          if (dur && time <= 0 && tTime <= 0) {
            time && (tween._zTime = time);
            return;
          }
        }
      } else if (runBackwards && dur) {
        if (!prevStartAt) {
          time && (immediateRender = false);
          p = _setDefaults({
            overwrite: false,
            data: "isFromStart",
            //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
            lazy: immediateRender && !prevStartAt && _isNotFalse(lazy),
            immediateRender,
            //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
            stagger: 0,
            parent
            //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y:gsap.utils.wrap([-100,100])})
          }, cleanVars);
          harnessVars && (p[harness.prop] = harnessVars);
          _removeFromParent(tween._startAt = Tween.set(targets, p));
          tween._startAt._dp = 0;
          tween._startAt._sat = tween;
          time < 0 && (_reverting ? tween._startAt.revert(_revertConfigNoKill) : tween._startAt.render(-1, true));
          tween._zTime = time;
          if (!immediateRender) {
            _initTween2(tween._startAt, _tinyNum, _tinyNum);
          } else if (!time) {
            return;
          }
        }
      }
      tween._pt = tween._ptCache = 0;
      lazy = dur && _isNotFalse(lazy) || lazy && !dur;
      for (i2 = 0; i2 < targets.length; i2++) {
        target = targets[i2];
        gsData = target._gsap || _harness(targets)[i2]._gsap;
        tween._ptLookup[i2] = ptLookup = {};
        _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender();
        index = fullTargets === targets ? i2 : fullTargets.indexOf(target);
        if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
          tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
          plugin._props.forEach(function(name) {
            ptLookup[name] = pt;
          });
          plugin.priority && (hasPriority = 1);
        }
        if (!harness || harnessVars) {
          for (p in cleanVars) {
            if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
              plugin.priority && (hasPriority = 1);
            } else {
              ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
            }
          }
        }
        tween._op && tween._op[i2] && tween.kill(target, tween._op[i2]);
        if (autoOverwrite && tween._pt) {
          _overwritingTween = tween;
          _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time));
          overwritten = !tween.parent;
          _overwritingTween = 0;
        }
        tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
      }
      hasPriority && _sortPropTweensByPriority(tween);
      tween._onInit && tween._onInit(tween);
    }
    tween._onUpdate = onUpdate;
    tween._initted = (!tween._op || tween._pt) && !overwritten;
    keyframes && time <= 0 && tl.render(_bigNum, true, true);
  };
  var _updatePropTweens = function _updatePropTweens2(tween, property, value, start, startIsRelative, ratio, time) {
    var ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property], pt, rootPT, lookup, i2;
    if (!ptCache) {
      ptCache = tween._ptCache[property] = [];
      lookup = tween._ptLookup;
      i2 = tween._targets.length;
      while (i2--) {
        pt = lookup[i2][property];
        if (pt && pt.d && pt.d._pt) {
          pt = pt.d._pt;
          while (pt && pt.p !== property && pt.fp !== property) {
            pt = pt._next;
          }
        }
        if (!pt) {
          _forceAllPropTweens = 1;
          tween.vars[property] = "+=0";
          _initTween(tween, time);
          _forceAllPropTweens = 0;
          return 1;
        }
        ptCache.push(pt);
      }
    }
    i2 = ptCache.length;
    while (i2--) {
      rootPT = ptCache[i2];
      pt = rootPT._pt || rootPT;
      pt.s = (start || start === 0) && !startIsRelative ? start : pt.s + (start || 0) + ratio * pt.c;
      pt.c = value - pt.s;
      rootPT.e && (rootPT.e = _round(value) + getUnit(rootPT.e));
      rootPT.b && (rootPT.b = pt.s + getUnit(rootPT.b));
    }
  };
  var _addAliasesToVars = function _addAliasesToVars2(targets, vars) {
    var harness = targets[0] ? _getCache(targets[0]).harness : 0, propertyAliases = harness && harness.aliases, copy, p, i2, aliases;
    if (!propertyAliases) {
      return vars;
    }
    copy = _merge({}, vars);
    for (p in propertyAliases) {
      if (p in copy) {
        aliases = propertyAliases[p].split(",");
        i2 = aliases.length;
        while (i2--) {
          copy[aliases[i2]] = copy[p];
        }
      }
    }
    return copy;
  };
  var _parseKeyframe = function _parseKeyframe2(prop, obj, allProps, easeEach) {
    var ease = obj.ease || easeEach || "power1.inOut", p, a;
    if (_isArray(obj)) {
      a = allProps[prop] || (allProps[prop] = []);
      obj.forEach(function(value, i2) {
        return a.push({
          t: i2 / (obj.length - 1) * 100,
          v: value,
          e: ease
        });
      });
    } else {
      for (p in obj) {
        a = allProps[p] || (allProps[p] = []);
        p === "ease" || a.push({
          t: parseFloat(prop),
          v: obj[p],
          e: ease
        });
      }
    }
  };
  var _parseFuncOrString = function _parseFuncOrString2(value, tween, i2, target, targets) {
    return _isFunction(value) ? value.call(tween, i2, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
  };
  var _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert";
  var _staggerPropsToSkip = {};
  _forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", function(name) {
    return _staggerPropsToSkip[name] = 1;
  });
  var Tween = /* @__PURE__ */ function(_Animation2) {
    _inheritsLoose(Tween2, _Animation2);
    function Tween2(targets, vars, position, skipInherit) {
      var _this3;
      if (typeof vars === "number") {
        position.duration = vars;
        vars = position;
        position = null;
      }
      _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) || this;
      var _this3$vars = _this3.vars, duration = _this3$vars.duration, delay = _this3$vars.delay, immediateRender = _this3$vars.immediateRender, stagger = _this3$vars.stagger, overwrite = _this3$vars.overwrite, keyframes = _this3$vars.keyframes, defaults2 = _this3$vars.defaults, scrollTrigger = _this3$vars.scrollTrigger, yoyoEase = _this3$vars.yoyoEase, parent = vars.parent || _globalTimeline, parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray(targets), tl, i2, copy, l, p, curTarget, staggerFunc, staggerVarsToMerge;
      _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://greensock.com", !_config.nullTargetWarn) || [];
      _this3._ptLookup = [];
      _this3._overwrite = overwrite;
      if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        vars = _this3.vars;
        tl = _this3.timeline = new Timeline({
          data: "nested",
          defaults: defaults2 || {},
          targets: parent && parent.data === "nested" ? parent.vars.targets : parsedTargets
        });
        tl.kill();
        tl.parent = tl._dp = _assertThisInitialized(_this3);
        tl._start = 0;
        if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
          l = parsedTargets.length;
          staggerFunc = stagger && distribute(stagger);
          if (_isObject(stagger)) {
            for (p in stagger) {
              if (~_staggerTweenProps.indexOf(p)) {
                staggerVarsToMerge || (staggerVarsToMerge = {});
                staggerVarsToMerge[p] = stagger[p];
              }
            }
          }
          for (i2 = 0; i2 < l; i2++) {
            copy = _copyExcluding(vars, _staggerPropsToSkip);
            copy.stagger = 0;
            yoyoEase && (copy.yoyoEase = yoyoEase);
            staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
            curTarget = parsedTargets[i2];
            copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i2, curTarget, parsedTargets);
            copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i2, curTarget, parsedTargets) || 0) - _this3._delay;
            if (!stagger && l === 1 && copy.delay) {
              _this3._delay = delay = copy.delay;
              _this3._start += delay;
              copy.delay = 0;
            }
            tl.to(curTarget, copy, staggerFunc ? staggerFunc(i2, curTarget, parsedTargets) : 0);
            tl._ease = _easeMap.none;
          }
          tl.duration() ? duration = delay = 0 : _this3.timeline = 0;
        } else if (keyframes) {
          _inheritDefaults(_setDefaults(tl.vars.defaults, {
            ease: "none"
          }));
          tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
          var time = 0, a, kf, v;
          if (_isArray(keyframes)) {
            keyframes.forEach(function(frame) {
              return tl.to(parsedTargets, frame, ">");
            });
            tl.duration();
          } else {
            copy = {};
            for (p in keyframes) {
              p === "ease" || p === "easeEach" || _parseKeyframe(p, keyframes[p], copy, keyframes.easeEach);
            }
            for (p in copy) {
              a = copy[p].sort(function(a2, b) {
                return a2.t - b.t;
              });
              time = 0;
              for (i2 = 0; i2 < a.length; i2++) {
                kf = a[i2];
                v = {
                  ease: kf.e,
                  duration: (kf.t - (i2 ? a[i2 - 1].t : 0)) / 100 * duration
                };
                v[p] = kf.v;
                tl.to(parsedTargets, v, time);
                time += v.duration;
              }
            }
            tl.duration() < duration && tl.to({}, {
              duration: duration - tl.duration()
            });
          }
        }
        duration || _this3.duration(duration = tl.duration());
      } else {
        _this3.timeline = 0;
      }
      if (overwrite === true && !_suppressOverwrites) {
        _overwritingTween = _assertThisInitialized(_this3);
        _globalTimeline.killTweensOf(parsedTargets);
        _overwritingTween = 0;
      }
      _addToTimeline(parent, _assertThisInitialized(_this3), position);
      vars.reversed && _this3.reverse();
      vars.paused && _this3.paused(true);
      if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
        _this3._tTime = -_tinyNum;
        _this3.render(Math.max(0, -delay) || 0);
      }
      scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
      return _this3;
    }
    var _proto3 = Tween2.prototype;
    _proto3.render = function render3(totalTime, suppressEvents, force) {
      var prevTime = this._time, tDur = this._tDur, dur = this._dur, isNegative = totalTime < 0, tTime = totalTime > tDur - _tinyNum && !isNegative ? tDur : totalTime < _tinyNum ? 0 : totalTime, time, pt, iteration, cycleDuration, prevIteration, isYoyo, ratio, timeline2, yoyoEase;
      if (!dur) {
        _renderZeroDurationTween(this, totalTime, suppressEvents, force);
      } else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== isNegative) {
        time = tTime;
        timeline2 = this.timeline;
        if (this._repeat) {
          cycleDuration = dur + this._rDelay;
          if (this._repeat < -1 && isNegative) {
            return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
          }
          time = _roundPrecise(tTime % cycleDuration);
          if (tTime === tDur) {
            iteration = this._repeat;
            time = dur;
          } else {
            iteration = ~~(tTime / cycleDuration);
            if (iteration && iteration === tTime / cycleDuration) {
              time = dur;
              iteration--;
            }
            time > dur && (time = dur);
          }
          isYoyo = this._yoyo && iteration & 1;
          if (isYoyo) {
            yoyoEase = this._yEase;
            time = dur - time;
          }
          prevIteration = _animationCycle(this._tTime, cycleDuration);
          if (time === prevTime && !force && this._initted) {
            this._tTime = tTime;
            return this;
          }
          if (iteration !== prevIteration) {
            timeline2 && this._yEase && _propagateYoyoEase(timeline2, isYoyo);
            if (this.vars.repeatRefresh && !isYoyo && !this._lock) {
              this._lock = force = 1;
              this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
            }
          }
        }
        if (!this._initted) {
          if (_attemptInitTween(this, isNegative ? totalTime : time, force, suppressEvents, tTime)) {
            this._tTime = 0;
            return this;
          }
          if (prevTime !== this._time) {
            return this;
          }
          if (dur !== this._dur) {
            return this.render(totalTime, suppressEvents, force);
          }
        }
        this._tTime = tTime;
        this._time = time;
        if (!this._act && this._ts) {
          this._act = 1;
          this._lazy = 0;
        }
        this.ratio = ratio = (yoyoEase || this._ease)(time / dur);
        if (this._from) {
          this.ratio = ratio = 1 - ratio;
        }
        if (time && !prevTime && !suppressEvents && !iteration) {
          _callback(this, "onStart");
          if (this._tTime !== tTime) {
            return this;
          }
        }
        pt = this._pt;
        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }
        timeline2 && timeline2.render(totalTime < 0 ? totalTime : !time && isYoyo ? -_tinyNum : timeline2._dur * timeline2._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);
        if (this._onUpdate && !suppressEvents) {
          isNegative && _rewindStartAt(this, totalTime, suppressEvents, force);
          _callback(this, "onUpdate");
        }
        this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");
        if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
          isNegative && !this._onUpdate && _rewindStartAt(this, totalTime, true, true);
          (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
          if (!suppressEvents && !(isNegative && !prevTime) && (tTime || prevTime || isYoyo)) {
            _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);
            this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
          }
        }
      }
      return this;
    };
    _proto3.targets = function targets() {
      return this._targets;
    };
    _proto3.invalidate = function invalidate(soft) {
      (!soft || !this.vars.runBackwards) && (this._startAt = 0);
      this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0;
      this._ptLookup = [];
      this.timeline && this.timeline.invalidate(soft);
      return _Animation2.prototype.invalidate.call(this, soft);
    };
    _proto3.resetTo = function resetTo(property, value, start, startIsRelative) {
      _tickerActive || _ticker.wake();
      this._ts || this.play();
      var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts), ratio;
      this._initted || _initTween(this, time);
      ratio = this._ease(time / this._dur);
      if (_updatePropTweens(this, property, value, start, startIsRelative, ratio, time)) {
        return this.resetTo(property, value, start, startIsRelative);
      }
      _alignPlayhead(this, 0);
      this.parent || _addLinkedListItem(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0);
      return this.render(0);
    };
    _proto3.kill = function kill(targets, vars) {
      if (vars === void 0) {
        vars = "all";
      }
      if (!targets && (!vars || vars === "all")) {
        this._lazy = this._pt = 0;
        return this.parent ? _interrupt(this) : this;
      }
      if (this.timeline) {
        var tDur = this.timeline.totalDuration();
        this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this);
        this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1);
        return this;
      }
      var parsedTargets = this._targets, killingTargets = targets ? toArray(targets) : parsedTargets, propTweenLookup = this._ptLookup, firstPT = this._pt, overwrittenProps, curLookup, curOverwriteProps, props, p, pt, i2;
      if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
        vars === "all" && (this._pt = 0);
        return _interrupt(this);
      }
      overwrittenProps = this._op = this._op || [];
      if (vars !== "all") {
        if (_isString(vars)) {
          p = {};
          _forEachName(vars, function(name) {
            return p[name] = 1;
          });
          vars = p;
        }
        vars = _addAliasesToVars(parsedTargets, vars);
      }
      i2 = parsedTargets.length;
      while (i2--) {
        if (~killingTargets.indexOf(parsedTargets[i2])) {
          curLookup = propTweenLookup[i2];
          if (vars === "all") {
            overwrittenProps[i2] = vars;
            props = curLookup;
            curOverwriteProps = {};
          } else {
            curOverwriteProps = overwrittenProps[i2] = overwrittenProps[i2] || {};
            props = vars;
          }
          for (p in props) {
            pt = curLookup && curLookup[p];
            if (pt) {
              if (!("kill" in pt.d) || pt.d.kill(p) === true) {
                _removeLinkedListItem(this, pt, "_pt");
              }
              delete curLookup[p];
            }
            if (curOverwriteProps !== "all") {
              curOverwriteProps[p] = 1;
            }
          }
        }
      }
      this._initted && !this._pt && firstPT && _interrupt(this);
      return this;
    };
    Tween2.to = function to(targets, vars) {
      return new Tween2(targets, vars, arguments[2]);
    };
    Tween2.from = function from(targets, vars) {
      return _createTweenType(1, arguments);
    };
    Tween2.delayedCall = function delayedCall(delay, callback, params, scope) {
      return new Tween2(callback, 0, {
        immediateRender: false,
        lazy: false,
        overwrite: false,
        delay,
        onComplete: callback,
        onReverseComplete: callback,
        onCompleteParams: params,
        onReverseCompleteParams: params,
        callbackScope: scope
      });
    };
    Tween2.fromTo = function fromTo(targets, fromVars, toVars) {
      return _createTweenType(2, arguments);
    };
    Tween2.set = function set(targets, vars) {
      vars.duration = 0;
      vars.repeatDelay || (vars.repeat = 0);
      return new Tween2(targets, vars);
    };
    Tween2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      return _globalTimeline.killTweensOf(targets, props, onlyActive);
    };
    return Tween2;
  }(Animation);
  _setDefaults(Tween.prototype, {
    _targets: [],
    _lazy: 0,
    _startAt: 0,
    _op: 0,
    _onInit: 0
  });
  _forEachName("staggerTo,staggerFrom,staggerFromTo", function(name) {
    Tween[name] = function() {
      var tl = new Timeline(), params = _slice.call(arguments, 0);
      params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
      return tl[name].apply(tl, params);
    };
  });
  var _setterPlain = function _setterPlain2(target, property, value) {
    return target[property] = value;
  };
  var _setterFunc = function _setterFunc2(target, property, value) {
    return target[property](value);
  };
  var _setterFuncWithParam = function _setterFuncWithParam2(target, property, value, data) {
    return target[property](data.fp, value);
  };
  var _setterAttribute = function _setterAttribute2(target, property, value) {
    return target.setAttribute(property, value);
  };
  var _getSetter = function _getSetter2(target, property) {
    return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
  };
  var _renderPlain = function _renderPlain2(ratio, data) {
    return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e6) / 1e6, data);
  };
  var _renderBoolean = function _renderBoolean2(ratio, data) {
    return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
  };
  var _renderComplexString = function _renderComplexString2(ratio, data) {
    var pt = data._pt, s2 = "";
    if (!ratio && data.b) {
      s2 = data.b;
    } else if (ratio === 1 && data.e) {
      s2 = data.e;
    } else {
      while (pt) {
        s2 = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 1e4) / 1e4) + s2;
        pt = pt._next;
      }
      s2 += data.c;
    }
    data.set(data.t, data.p, s2, data);
  };
  var _renderPropTweens = function _renderPropTweens2(ratio, data) {
    var pt = data._pt;
    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }
  };
  var _addPluginModifier = function _addPluginModifier2(modifier, tween, target, property) {
    var pt = this._pt, next;
    while (pt) {
      next = pt._next;
      pt.p === property && pt.modifier(modifier, tween, target);
      pt = next;
    }
  };
  var _killPropTweensOf = function _killPropTweensOf2(property) {
    var pt = this._pt, hasNonDependentRemaining, next;
    while (pt) {
      next = pt._next;
      if (pt.p === property && !pt.op || pt.op === property) {
        _removeLinkedListItem(this, pt, "_pt");
      } else if (!pt.dep) {
        hasNonDependentRemaining = 1;
      }
      pt = next;
    }
    return !hasNonDependentRemaining;
  };
  var _setterWithModifier = function _setterWithModifier2(target, property, value, data) {
    data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
  };
  var _sortPropTweensByPriority = function _sortPropTweensByPriority2(parent) {
    var pt = parent._pt, next, pt2, first, last;
    while (pt) {
      next = pt._next;
      pt2 = first;
      while (pt2 && pt2.pr > pt.pr) {
        pt2 = pt2._next;
      }
      if (pt._prev = pt2 ? pt2._prev : last) {
        pt._prev._next = pt;
      } else {
        first = pt;
      }
      if (pt._next = pt2) {
        pt2._prev = pt;
      } else {
        last = pt;
      }
      pt = next;
    }
    parent._pt = first;
  };
  var PropTween = /* @__PURE__ */ function() {
    function PropTween2(next, target, prop, start, change, renderer, data, setter, priority) {
      this.t = target;
      this.s = start;
      this.c = change;
      this.p = prop;
      this.r = renderer || _renderPlain;
      this.d = data || this;
      this.set = setter || _setterPlain;
      this.pr = priority || 0;
      this._next = next;
      if (next) {
        next._prev = this;
      }
    }
    var _proto4 = PropTween2.prototype;
    _proto4.modifier = function modifier(func, tween, target) {
      this.mSet = this.mSet || this.set;
      this.set = _setterWithModifier;
      this.m = func;
      this.mt = target;
      this.tween = tween;
    };
    return PropTween2;
  }();
  _forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(name) {
    return _reservedProps[name] = 1;
  });
  _globals.TweenMax = _globals.TweenLite = Tween;
  _globals.TimelineLite = _globals.TimelineMax = Timeline;
  _globalTimeline = new Timeline({
    sortChildren: false,
    defaults: _defaults,
    autoRemoveChildren: true,
    id: "root",
    smoothChildTiming: true
  });
  _config.stringFilter = _colorStringFilter;
  var _media = [];
  var _listeners = {};
  var _emptyArray = [];
  var _lastMediaTime = 0;
  var _dispatch = function _dispatch2(type) {
    return (_listeners[type] || _emptyArray).map(function(f) {
      return f();
    });
  };
  var _onMediaChange = function _onMediaChange2() {
    var time = Date.now(), matches = [];
    if (time - _lastMediaTime > 2) {
      _dispatch("matchMediaInit");
      _media.forEach(function(c) {
        var queries = c.queries, conditions = c.conditions, match, p, anyMatch, toggled;
        for (p in queries) {
          match = _win.matchMedia(queries[p]).matches;
          match && (anyMatch = 1);
          if (match !== conditions[p]) {
            conditions[p] = match;
            toggled = 1;
          }
        }
        if (toggled) {
          c.revert();
          anyMatch && matches.push(c);
        }
      });
      _dispatch("matchMediaRevert");
      matches.forEach(function(c) {
        return c.onMatch(c);
      });
      _lastMediaTime = time;
      _dispatch("matchMedia");
    }
  };
  var Context = /* @__PURE__ */ function() {
    function Context2(func, scope) {
      this.selector = scope && selector(scope);
      this.data = [];
      this._r = [];
      this.isReverted = false;
      func && this.add(func);
    }
    var _proto5 = Context2.prototype;
    _proto5.add = function add(name, func, scope) {
      if (_isFunction(name)) {
        scope = func;
        func = name;
        name = _isFunction;
      }
      var self = this, f = function f2() {
        var prev = _context, prevSelector = self.selector, result;
        prev && prev !== self && prev.data.push(self);
        scope && (self.selector = selector(scope));
        _context = self;
        result = func.apply(self, arguments);
        _isFunction(result) && self._r.push(result);
        _context = prev;
        self.selector = prevSelector;
        self.isReverted = false;
        return result;
      };
      self.last = f;
      return name === _isFunction ? f(self) : name ? self[name] = f : f;
    };
    _proto5.ignore = function ignore(func) {
      var prev = _context;
      _context = null;
      func(this);
      _context = prev;
    };
    _proto5.getTweens = function getTweens() {
      var a = [];
      this.data.forEach(function(e2) {
        return e2 instanceof Context2 ? a.push.apply(a, e2.getTweens()) : e2 instanceof Tween && !(e2.parent && e2.parent.data === "nested") && a.push(e2);
      });
      return a;
    };
    _proto5.clear = function clear() {
      this._r.length = this.data.length = 0;
    };
    _proto5.kill = function kill(revert, matchMedia2) {
      var _this4 = this;
      if (revert) {
        var tweens = this.getTweens();
        this.data.forEach(function(t2) {
          if (t2.data === "isFlip") {
            t2.revert();
            t2.getChildren(true, true, false).forEach(function(tween) {
              return tweens.splice(tweens.indexOf(tween), 1);
            });
          }
        });
        tweens.map(function(t2) {
          return {
            g: t2.globalTime(0),
            t: t2
          };
        }).sort(function(a, b) {
          return b.g - a.g || -1;
        }).forEach(function(o2) {
          return o2.t.revert(revert);
        });
        this.data.forEach(function(e2) {
          return !(e2 instanceof Animation) && e2.revert && e2.revert(revert);
        });
        this._r.forEach(function(f) {
          return f(revert, _this4);
        });
        this.isReverted = true;
      } else {
        this.data.forEach(function(e2) {
          return e2.kill && e2.kill();
        });
      }
      this.clear();
      if (matchMedia2) {
        var i2 = _media.indexOf(this);
        !!~i2 && _media.splice(i2, 1);
      }
    };
    _proto5.revert = function revert(config3) {
      this.kill(config3 || {});
    };
    return Context2;
  }();
  var MatchMedia = /* @__PURE__ */ function() {
    function MatchMedia2(scope) {
      this.contexts = [];
      this.scope = scope;
    }
    var _proto6 = MatchMedia2.prototype;
    _proto6.add = function add(conditions, func, scope) {
      _isObject(conditions) || (conditions = {
        matches: conditions
      });
      var context3 = new Context(0, scope || this.scope), cond = context3.conditions = {}, mq, p, active;
      this.contexts.push(context3);
      func = context3.add("onMatch", func);
      context3.queries = conditions;
      for (p in conditions) {
        if (p === "all") {
          active = 1;
        } else {
          mq = _win.matchMedia(conditions[p]);
          if (mq) {
            _media.indexOf(context3) < 0 && _media.push(context3);
            (cond[p] = mq.matches) && (active = 1);
            mq.addListener ? mq.addListener(_onMediaChange) : mq.addEventListener("change", _onMediaChange);
          }
        }
      }
      active && func(context3);
      return this;
    };
    _proto6.revert = function revert(config3) {
      this.kill(config3 || {});
    };
    _proto6.kill = function kill(revert) {
      this.contexts.forEach(function(c) {
        return c.kill(revert, true);
      });
    };
    return MatchMedia2;
  }();
  var _gsap = {
    registerPlugin: function registerPlugin() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      args.forEach(function(config3) {
        return _createPlugin(config3);
      });
    },
    timeline: function timeline(vars) {
      return new Timeline(vars);
    },
    getTweensOf: function getTweensOf(targets, onlyActive) {
      return _globalTimeline.getTweensOf(targets, onlyActive);
    },
    getProperty: function getProperty(target, property, unit, uncache) {
      _isString(target) && (target = toArray(target)[0]);
      var getter = _getCache(target || {}).get, format = unit ? _passThrough : _numericIfPossible;
      unit === "native" && (unit = "");
      return !target ? target : !property ? function(property2, unit2, uncache2) {
        return format((_plugins[property2] && _plugins[property2].get || getter)(target, property2, unit2, uncache2));
      } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
    },
    quickSetter: function quickSetter(target, property, unit) {
      target = toArray(target);
      if (target.length > 1) {
        var setters = target.map(function(t2) {
          return gsap.quickSetter(t2, property, unit);
        }), l = setters.length;
        return function(value) {
          var i2 = l;
          while (i2--) {
            setters[i2](value);
          }
        };
      }
      target = target[0] || {};
      var Plugin = _plugins[property], cache = _getCache(target), p = cache.harness && (cache.harness.aliases || {})[property] || property, setter = Plugin ? function(value) {
        var p2 = new Plugin();
        _quickTween._pt = 0;
        p2.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
        p2.render(1, p2);
        _quickTween._pt && _renderPropTweens(1, _quickTween);
      } : cache.set(target, p);
      return Plugin ? setter : function(value) {
        return setter(target, p, unit ? value + unit : value, cache, 1);
      };
    },
    quickTo: function quickTo(target, property, vars) {
      var _merge22;
      var tween = gsap.to(target, _merge((_merge22 = {}, _merge22[property] = "+=0.1", _merge22.paused = true, _merge22), vars || {})), func = function func2(value, start, startIsRelative) {
        return tween.resetTo(property, value, start, startIsRelative);
      };
      func.tween = tween;
      return func;
    },
    isTweening: function isTweening(targets) {
      return _globalTimeline.getTweensOf(targets, true).length > 0;
    },
    defaults: function defaults(value) {
      value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease));
      return _mergeDeep(_defaults, value || {});
    },
    config: function config2(value) {
      return _mergeDeep(_config, value || {});
    },
    registerEffect: function registerEffect(_ref3) {
      var name = _ref3.name, effect = _ref3.effect, plugins = _ref3.plugins, defaults2 = _ref3.defaults, extendTimeline = _ref3.extendTimeline;
      (plugins || "").split(",").forEach(function(pluginName) {
        return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
      });
      _effects[name] = function(targets, vars, tl) {
        return effect(toArray(targets), _setDefaults(vars || {}, defaults2), tl);
      };
      if (extendTimeline) {
        Timeline.prototype[name] = function(targets, vars, position) {
          return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
        };
      }
    },
    registerEase: function registerEase(name, ease) {
      _easeMap[name] = _parseEase(ease);
    },
    parseEase: function parseEase(ease, defaultEase) {
      return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
    },
    getById: function getById(id) {
      return _globalTimeline.getById(id);
    },
    exportRoot: function exportRoot(vars, includeDelayedCalls) {
      if (vars === void 0) {
        vars = {};
      }
      var tl = new Timeline(vars), child, next;
      tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
      _globalTimeline.remove(tl);
      tl._dp = 0;
      tl._time = tl._tTime = _globalTimeline._time;
      child = _globalTimeline._first;
      while (child) {
        next = child._next;
        if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
          _addToTimeline(tl, child, child._start - child._delay);
        }
        child = next;
      }
      _addToTimeline(_globalTimeline, tl, 0);
      return tl;
    },
    context: function context(func, scope) {
      return func ? new Context(func, scope) : _context;
    },
    matchMedia: function matchMedia(scope) {
      return new MatchMedia(scope);
    },
    matchMediaRefresh: function matchMediaRefresh() {
      return _media.forEach(function(c) {
        var cond = c.conditions, found, p;
        for (p in cond) {
          if (cond[p]) {
            cond[p] = false;
            found = 1;
          }
        }
        found && c.revert();
      }) || _onMediaChange();
    },
    addEventListener: function addEventListener(type, callback) {
      var a = _listeners[type] || (_listeners[type] = []);
      ~a.indexOf(callback) || a.push(callback);
    },
    removeEventListener: function removeEventListener(type, callback) {
      var a = _listeners[type], i2 = a && a.indexOf(callback);
      i2 >= 0 && a.splice(i2, 1);
    },
    utils: {
      wrap,
      wrapYoyo,
      distribute,
      random,
      snap,
      normalize,
      getUnit,
      clamp,
      splitColor,
      toArray,
      selector,
      mapRange,
      pipe,
      unitize,
      interpolate,
      shuffle
    },
    install: _install,
    effects: _effects,
    ticker: _ticker,
    updateRoot: Timeline.updateRoot,
    plugins: _plugins,
    globalTimeline: _globalTimeline,
    core: {
      PropTween,
      globals: _addGlobal,
      Tween,
      Timeline,
      Animation,
      getCache: _getCache,
      _removeLinkedListItem,
      reverting: function reverting() {
        return _reverting;
      },
      context: function context2(toAdd) {
        if (toAdd && _context) {
          _context.data.push(toAdd);
          toAdd._ctx = _context;
        }
        return _context;
      },
      suppressOverwrites: function suppressOverwrites(value) {
        return _suppressOverwrites = value;
      }
    }
  };
  _forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function(name) {
    return _gsap[name] = Tween[name];
  });
  _ticker.add(Timeline.updateRoot);
  _quickTween = _gsap.to({}, {
    duration: 0
  });
  var _getPluginPropTween = function _getPluginPropTween2(plugin, prop) {
    var pt = plugin._pt;
    while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
      pt = pt._next;
    }
    return pt;
  };
  var _addModifiers = function _addModifiers2(tween, modifiers) {
    var targets = tween._targets, p, i2, pt;
    for (p in modifiers) {
      i2 = targets.length;
      while (i2--) {
        pt = tween._ptLookup[i2][p];
        if (pt && (pt = pt.d)) {
          if (pt._pt) {
            pt = _getPluginPropTween(pt, p);
          }
          pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i2], p);
        }
      }
    }
  };
  var _buildModifierPlugin = function _buildModifierPlugin2(name, modifier) {
    return {
      name,
      rawVars: 1,
      //don't pre-process function-based values or "random()" strings.
      init: function init4(target, vars, tween) {
        tween._onInit = function(tween2) {
          var temp, p;
          if (_isString(vars)) {
            temp = {};
            _forEachName(vars, function(name2) {
              return temp[name2] = 1;
            });
            vars = temp;
          }
          if (modifier) {
            temp = {};
            for (p in vars) {
              temp[p] = modifier(vars[p]);
            }
            vars = temp;
          }
          _addModifiers(tween2, vars);
        };
      }
    };
  };
  var gsap = _gsap.registerPlugin({
    name: "attr",
    init: function init(target, vars, tween, index, targets) {
      var p, pt, v;
      this.tween = tween;
      for (p in vars) {
        v = target.getAttribute(p) || "";
        pt = this.add(target, "setAttribute", (v || 0) + "", vars[p], index, targets, 0, 0, p);
        pt.op = p;
        pt.b = v;
        this._props.push(p);
      }
    },
    render: function render(ratio, data) {
      var pt = data._pt;
      while (pt) {
        _reverting ? pt.set(pt.t, pt.p, pt.b, pt) : pt.r(ratio, pt.d);
        pt = pt._next;
      }
    }
  }, {
    name: "endArray",
    init: function init2(target, value) {
      var i2 = value.length;
      while (i2--) {
        this.add(target, i2, target[i2] || 0, value[i2], 0, 0, 0, 0, 0, 1);
      }
    }
  }, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
  Tween.version = Timeline.version = gsap.version = "3.11.5";
  _coreReady = 1;
  _windowExists() && _wake();
  var Power0 = _easeMap.Power0;
  var Power1 = _easeMap.Power1;
  var Power2 = _easeMap.Power2;
  var Power3 = _easeMap.Power3;
  var Power4 = _easeMap.Power4;
  var Linear = _easeMap.Linear;
  var Quad = _easeMap.Quad;
  var Cubic = _easeMap.Cubic;
  var Quart = _easeMap.Quart;
  var Quint = _easeMap.Quint;
  var Strong = _easeMap.Strong;
  var Elastic = _easeMap.Elastic;
  var Back = _easeMap.Back;
  var SteppedEase = _easeMap.SteppedEase;
  var Bounce = _easeMap.Bounce;
  var Sine = _easeMap.Sine;
  var Expo = _easeMap.Expo;
  var Circ = _easeMap.Circ;

  // node_modules/.pnpm/gsap@3.11.5/node_modules/gsap/CSSPlugin.js
  init_live_reload();
  var _win2;
  var _doc2;
  var _docElement;
  var _pluginInitted;
  var _tempDiv;
  var _tempDivStyler;
  var _recentSetterPlugin;
  var _reverting2;
  var _windowExists3 = function _windowExists4() {
    return typeof window !== "undefined";
  };
  var _transformProps = {};
  var _RAD2DEG = 180 / Math.PI;
  var _DEG2RAD = Math.PI / 180;
  var _atan2 = Math.atan2;
  var _bigNum2 = 1e8;
  var _capsExp = /([A-Z])/g;
  var _horizontalExp = /(left|right|width|margin|padding|x)/i;
  var _complexExp = /[\s,\(]\S/;
  var _propertyAliases = {
    autoAlpha: "opacity,visibility",
    scale: "scaleX,scaleY",
    alpha: "opacity"
  };
  var _renderCSSProp = function _renderCSSProp2(ratio, data) {
    return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
  };
  var _renderPropWithEnd = function _renderPropWithEnd2(ratio, data) {
    return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
  };
  var _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning2(ratio, data) {
    return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u : data.b, data);
  };
  var _renderRoundedCSSProp = function _renderRoundedCSSProp2(ratio, data) {
    var value = data.s + data.c * ratio;
    data.set(data.t, data.p, ~~(value + (value < 0 ? -0.5 : 0.5)) + data.u, data);
  };
  var _renderNonTweeningValue = function _renderNonTweeningValue2(ratio, data) {
    return data.set(data.t, data.p, ratio ? data.e : data.b, data);
  };
  var _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd2(ratio, data) {
    return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
  };
  var _setterCSSStyle = function _setterCSSStyle2(target, property, value) {
    return target.style[property] = value;
  };
  var _setterCSSProp = function _setterCSSProp2(target, property, value) {
    return target.style.setProperty(property, value);
  };
  var _setterTransform = function _setterTransform2(target, property, value) {
    return target._gsap[property] = value;
  };
  var _setterScale = function _setterScale2(target, property, value) {
    return target._gsap.scaleX = target._gsap.scaleY = value;
  };
  var _setterScaleWithRender = function _setterScaleWithRender2(target, property, value, data, ratio) {
    var cache = target._gsap;
    cache.scaleX = cache.scaleY = value;
    cache.renderTransform(ratio, cache);
  };
  var _setterTransformWithRender = function _setterTransformWithRender2(target, property, value, data, ratio) {
    var cache = target._gsap;
    cache[property] = value;
    cache.renderTransform(ratio, cache);
  };
  var _transformProp = "transform";
  var _transformOriginProp = _transformProp + "Origin";
  var _saveStyle = function _saveStyle2(property, isNotCSS) {
    var _this = this;
    var target = this.target, style = target.style;
    if (property in _transformProps) {
      this.tfm = this.tfm || {};
      if (property !== "transform") {
        property = _propertyAliases[property] || property;
        ~property.indexOf(",") ? property.split(",").forEach(function(a) {
          return _this.tfm[a] = _get(target, a);
        }) : this.tfm[property] = target._gsap.x ? target._gsap[property] : _get(target, property);
      } else {
        return _propertyAliases.transform.split(",").forEach(function(p) {
          return _saveStyle2.call(_this, p, isNotCSS);
        });
      }
      if (this.props.indexOf(_transformProp) >= 0) {
        return;
      }
      if (target._gsap.svg) {
        this.svgo = target.getAttribute("data-svg-origin");
        this.props.push(_transformOriginProp, isNotCSS, "");
      }
      property = _transformProp;
    }
    (style || isNotCSS) && this.props.push(property, isNotCSS, style[property]);
  };
  var _removeIndependentTransforms = function _removeIndependentTransforms2(style) {
    if (style.translate) {
      style.removeProperty("translate");
      style.removeProperty("scale");
      style.removeProperty("rotate");
    }
  };
  var _revertStyle = function _revertStyle2() {
    var props = this.props, target = this.target, style = target.style, cache = target._gsap, i2, p;
    for (i2 = 0; i2 < props.length; i2 += 3) {
      props[i2 + 1] ? target[props[i2]] = props[i2 + 2] : props[i2 + 2] ? style[props[i2]] = props[i2 + 2] : style.removeProperty(props[i2].substr(0, 2) === "--" ? props[i2] : props[i2].replace(_capsExp, "-$1").toLowerCase());
    }
    if (this.tfm) {
      for (p in this.tfm) {
        cache[p] = this.tfm[p];
      }
      if (cache.svg) {
        cache.renderTransform();
        target.setAttribute("data-svg-origin", this.svgo || "");
      }
      i2 = _reverting2();
      if ((!i2 || !i2.isStart) && !style[_transformProp]) {
        _removeIndependentTransforms(style);
        cache.uncache = 1;
      }
    }
  };
  var _getStyleSaver = function _getStyleSaver2(target, properties) {
    var saver = {
      target,
      props: [],
      revert: _revertStyle,
      save: _saveStyle
    };
    target._gsap || gsap.core.getCache(target);
    properties && properties.split(",").forEach(function(p) {
      return saver.save(p);
    });
    return saver;
  };
  var _supports3D;
  var _createElement = function _createElement2(type, ns) {
    var e2 = _doc2.createElementNS ? _doc2.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc2.createElement(type);
    return e2.style ? e2 : _doc2.createElement(type);
  };
  var _getComputedProperty = function _getComputedProperty2(target, property, skipPrefixFallback) {
    var cs = getComputedStyle(target);
    return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty2(target, _checkPropPrefix(property) || property, 1) || "";
  };
  var _prefixes = "O,Moz,ms,Ms,Webkit".split(",");
  var _checkPropPrefix = function _checkPropPrefix2(property, element, preferPrefix) {
    var e2 = element || _tempDiv, s2 = e2.style, i2 = 5;
    if (property in s2 && !preferPrefix) {
      return property;
    }
    property = property.charAt(0).toUpperCase() + property.substr(1);
    while (i2-- && !(_prefixes[i2] + property in s2)) {
    }
    return i2 < 0 ? null : (i2 === 3 ? "ms" : i2 >= 0 ? _prefixes[i2] : "") + property;
  };
  var _initCore = function _initCore2() {
    if (_windowExists3() && window.document) {
      _win2 = window;
      _doc2 = _win2.document;
      _docElement = _doc2.documentElement;
      _tempDiv = _createElement("div") || {
        style: {}
      };
      _tempDivStyler = _createElement("div");
      _transformProp = _checkPropPrefix(_transformProp);
      _transformOriginProp = _transformProp + "Origin";
      _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
      _supports3D = !!_checkPropPrefix("perspective");
      _reverting2 = gsap.core.reverting;
      _pluginInitted = 1;
    }
  };
  var _getBBoxHack = function _getBBoxHack2(swapIfPossible) {
    var svg = _createElement("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), oldParent = this.parentNode, oldSibling = this.nextSibling, oldCSS = this.style.cssText, bbox;
    _docElement.appendChild(svg);
    svg.appendChild(this);
    this.style.display = "block";
    if (swapIfPossible) {
      try {
        bbox = this.getBBox();
        this._gsapBBox = this.getBBox;
        this.getBBox = _getBBoxHack2;
      } catch (e2) {
      }
    } else if (this._gsapBBox) {
      bbox = this._gsapBBox();
    }
    if (oldParent) {
      if (oldSibling) {
        oldParent.insertBefore(this, oldSibling);
      } else {
        oldParent.appendChild(this);
      }
    }
    _docElement.removeChild(svg);
    this.style.cssText = oldCSS;
    return bbox;
  };
  var _getAttributeFallbacks = function _getAttributeFallbacks2(target, attributesArray) {
    var i2 = attributesArray.length;
    while (i2--) {
      if (target.hasAttribute(attributesArray[i2])) {
        return target.getAttribute(attributesArray[i2]);
      }
    }
  };
  var _getBBox = function _getBBox2(target) {
    var bounds;
    try {
      bounds = target.getBBox();
    } catch (error) {
      bounds = _getBBoxHack.call(target, true);
    }
    bounds && (bounds.width || bounds.height) || target.getBBox === _getBBoxHack || (bounds = _getBBoxHack.call(target, true));
    return bounds && !bounds.width && !bounds.x && !bounds.y ? {
      x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
      y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
      width: 0,
      height: 0
    } : bounds;
  };
  var _isSVG = function _isSVG2(e2) {
    return !!(e2.getCTM && (!e2.parentNode || e2.ownerSVGElement) && _getBBox(e2));
  };
  var _removeProperty = function _removeProperty2(target, property) {
    if (property) {
      var style = target.style;
      if (property in _transformProps && property !== _transformOriginProp) {
        property = _transformProp;
      }
      if (style.removeProperty) {
        if (property.substr(0, 2) === "ms" || property.substr(0, 6) === "webkit") {
          property = "-" + property;
        }
        style.removeProperty(property.replace(_capsExp, "-$1").toLowerCase());
      } else {
        style.removeAttribute(property);
      }
    }
  };
  var _addNonTweeningPT = function _addNonTweeningPT2(plugin, target, property, beginning, end, onlySetAtEnd) {
    var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
    plugin._pt = pt;
    pt.b = beginning;
    pt.e = end;
    plugin._props.push(property);
    return pt;
  };
  var _nonConvertibleUnits = {
    deg: 1,
    rad: 1,
    turn: 1
  };
  var _nonStandardLayouts = {
    grid: 1,
    flex: 1
  };
  var _convertToUnit = function _convertToUnit2(target, property, value, unit) {
    var curValue = parseFloat(value) || 0, curUnit = (value + "").trim().substr((curValue + "").length) || "px", style = _tempDiv.style, horizontal = _horizontalExp.test(property), isRootSVG = target.tagName.toLowerCase() === "svg", measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"), amount = 100, toPixels = unit === "px", toPercent = unit === "%", px, parent, cache, isSVG;
    if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
      return curValue;
    }
    curUnit !== "px" && !toPixels && (curValue = _convertToUnit2(target, property, value, "px"));
    isSVG = target.getCTM && _isSVG(target);
    if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
      px = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
      return _round(toPercent ? curValue / px * amount : curValue / 100 * px);
    }
    style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
    parent = ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;
    if (isSVG) {
      parent = (target.ownerSVGElement || {}).parentNode;
    }
    if (!parent || parent === _doc2 || !parent.appendChild) {
      parent = _doc2.body;
    }
    cache = parent._gsap;
    if (cache && toPercent && cache.width && horizontal && cache.time === _ticker.time && !cache.uncache) {
      return _round(curValue / cache.width * amount);
    } else {
      (toPercent || curUnit === "%") && !_nonStandardLayouts[_getComputedProperty(parent, "display")] && (style.position = _getComputedProperty(target, "position"));
      parent === target && (style.position = "static");
      parent.appendChild(_tempDiv);
      px = _tempDiv[measureProperty];
      parent.removeChild(_tempDiv);
      style.position = "absolute";
      if (horizontal && toPercent) {
        cache = _getCache(parent);
        cache.time = _ticker.time;
        cache.width = parent[measureProperty];
      }
    }
    return _round(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
  };
  var _get = function _get2(target, property, unit, uncache) {
    var value;
    _pluginInitted || _initCore();
    if (property in _propertyAliases && property !== "transform") {
      property = _propertyAliases[property];
      if (~property.indexOf(",")) {
        property = property.split(",")[0];
      }
    }
    if (_transformProps[property] && property !== "transform") {
      value = _parseTransform(target, uncache);
      value = property !== "transformOrigin" ? value[property] : value.svg ? value.origin : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
    } else {
      value = target.style[property];
      if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
        value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0);
      }
    }
    return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
  };
  var _tweenComplexCSSString = function _tweenComplexCSSString2(target, prop, start, end) {
    if (!start || start === "none") {
      var p = _checkPropPrefix(prop, target, 1), s2 = p && _getComputedProperty(target, p, 1);
      if (s2 && s2 !== start) {
        prop = p;
        start = s2;
      } else if (prop === "borderColor") {
        start = _getComputedProperty(target, "borderTopColor");
      }
    }
    var pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString), index = 0, matchIndex = 0, a, result, startValues, startNum, color, startValue, endValue, endNum, chunk, endUnit, startUnit, endValues;
    pt.b = start;
    pt.e = end;
    start += "";
    end += "";
    if (end === "auto") {
      target.style[prop] = end;
      end = _getComputedProperty(target, prop) || end;
      target.style[prop] = start;
    }
    a = [start, end];
    _colorStringFilter(a);
    start = a[0];
    end = a[1];
    startValues = start.match(_numWithUnitExp) || [];
    endValues = end.match(_numWithUnitExp) || [];
    if (endValues.length) {
      while (result = _numWithUnitExp.exec(end)) {
        endValue = result[0];
        chunk = end.substring(index, result.index);
        if (color) {
          color = (color + 1) % 5;
        } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
          color = 1;
        }
        if (endValue !== (startValue = startValues[matchIndex++] || "")) {
          startNum = parseFloat(startValue) || 0;
          startUnit = startValue.substr((startNum + "").length);
          endValue.charAt(1) === "=" && (endValue = _parseRelative(startNum, endValue) + startUnit);
          endNum = parseFloat(endValue);
          endUnit = endValue.substr((endNum + "").length);
          index = _numWithUnitExp.lastIndex - endUnit.length;
          if (!endUnit) {
            endUnit = endUnit || _config.units[prop] || startUnit;
            if (index === end.length) {
              end += endUnit;
              pt.e += endUnit;
            }
          }
          if (startUnit !== endUnit) {
            startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
          }
          pt._pt = {
            _next: pt._pt,
            p: chunk || matchIndex === 1 ? chunk : ",",
            //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
            s: startNum,
            c: endNum - startNum,
            m: color && color < 4 || prop === "zIndex" ? Math.round : 0
          };
        }
      }
      pt.c = index < end.length ? end.substring(index, end.length) : "";
    } else {
      pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
    }
    _relExp.test(end) && (pt.e = 0);
    this._pt = pt;
    return pt;
  };
  var _keywordToPercent = {
    top: "0%",
    bottom: "100%",
    left: "0%",
    right: "100%",
    center: "50%"
  };
  var _convertKeywordsToPercentages = function _convertKeywordsToPercentages2(value) {
    var split = value.split(" "), x = split[0], y = split[1] || "50%";
    if (x === "top" || x === "bottom" || y === "left" || y === "right") {
      value = x;
      x = y;
      y = value;
    }
    split[0] = _keywordToPercent[x] || x;
    split[1] = _keywordToPercent[y] || y;
    return split.join(" ");
  };
  var _renderClearProps = function _renderClearProps2(ratio, data) {
    if (data.tween && data.tween._time === data.tween._dur) {
      var target = data.t, style = target.style, props = data.u, cache = target._gsap, prop, clearTransforms, i2;
      if (props === "all" || props === true) {
        style.cssText = "";
        clearTransforms = 1;
      } else {
        props = props.split(",");
        i2 = props.length;
        while (--i2 > -1) {
          prop = props[i2];
          if (_transformProps[prop]) {
            clearTransforms = 1;
            prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
          }
          _removeProperty(target, prop);
        }
      }
      if (clearTransforms) {
        _removeProperty(target, _transformProp);
        if (cache) {
          cache.svg && target.removeAttribute("transform");
          _parseTransform(target, 1);
          cache.uncache = 1;
          _removeIndependentTransforms(style);
        }
      }
    }
  };
  var _specialProps = {
    clearProps: function clearProps(plugin, target, property, endValue, tween) {
      if (tween.data !== "isFromStart") {
        var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
        pt.u = endValue;
        pt.pr = -10;
        pt.tween = tween;
        plugin._props.push(property);
        return 1;
      }
    }
    /* className feature (about 0.4kb gzipped).
    , className(plugin, target, property, endValue, tween) {
    	let _renderClassName = (ratio, data) => {
    			data.css.render(ratio, data.css);
    			if (!ratio || ratio === 1) {
    				let inline = data.rmv,
    					target = data.t,
    					p;
    				target.setAttribute("class", ratio ? data.e : data.b);
    				for (p in inline) {
    					_removeProperty(target, p);
    				}
    			}
    		},
    		_getAllStyles = (target) => {
    			let styles = {},
    				computed = getComputedStyle(target),
    				p;
    			for (p in computed) {
    				if (isNaN(p) && p !== "cssText" && p !== "length") {
    					styles[p] = computed[p];
    				}
    			}
    			_setDefaults(styles, _parseTransform(target, 1));
    			return styles;
    		},
    		startClassList = target.getAttribute("class"),
    		style = target.style,
    		cssText = style.cssText,
    		cache = target._gsap,
    		classPT = cache.classPT,
    		inlineToRemoveAtEnd = {},
    		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
    		changingVars = {},
    		startVars = _getAllStyles(target),
    		transformRelated = /(transform|perspective)/i,
    		endVars, p;
    	if (classPT) {
    		classPT.r(1, classPT.d);
    		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
    	}
    	target.setAttribute("class", data.e);
    	endVars = _getAllStyles(target, true);
    	target.setAttribute("class", startClassList);
    	for (p in endVars) {
    		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
    			changingVars[p] = endVars[p];
    			if (!style[p] && style[p] !== "0") {
    				inlineToRemoveAtEnd[p] = 1;
    			}
    		}
    	}
    	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
    	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://greensock.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
    		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
    	}
    	_parseTransform(target, true); //to clear the caching of transforms
    	data.css = new gsap.plugins.css();
    	data.css.init(target, changingVars, tween);
    	plugin._props.push(...data.css._props);
    	return 1;
    }
    */
  };
  var _identity2DMatrix = [1, 0, 0, 1, 0, 0];
  var _rotationalProperties = {};
  var _isNullTransform = function _isNullTransform2(value) {
    return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
  };
  var _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray2(target) {
    var matrixString = _getComputedProperty(target, _transformProp);
    return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round);
  };
  var _getMatrix = function _getMatrix2(target, force2D) {
    var cache = target._gsap || _getCache(target), style = target.style, matrix = _getComputedTransformMatrixAsArray(target), parent, nextSibling, temp, addedToDOM;
    if (cache.svg && target.getAttribute("transform")) {
      temp = target.transform.baseVal.consolidate().matrix;
      matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
      return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
    } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
      temp = style.display;
      style.display = "block";
      parent = target.parentNode;
      if (!parent || !target.offsetParent) {
        addedToDOM = 1;
        nextSibling = target.nextElementSibling;
        _docElement.appendChild(target);
      }
      matrix = _getComputedTransformMatrixAsArray(target);
      temp ? style.display = temp : _removeProperty(target, "display");
      if (addedToDOM) {
        nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
      }
    }
    return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
  };
  var _applySVGOrigin = function _applySVGOrigin2(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
    var cache = target._gsap, matrix = matrixArray || _getMatrix(target, true), xOriginOld = cache.xOrigin || 0, yOriginOld = cache.yOrigin || 0, xOffsetOld = cache.xOffset || 0, yOffsetOld = cache.yOffset || 0, a = matrix[0], b = matrix[1], c = matrix[2], d = matrix[3], tx = matrix[4], ty = matrix[5], originSplit = origin.split(" "), xOrigin = parseFloat(originSplit[0]) || 0, yOrigin = parseFloat(originSplit[1]) || 0, bounds, determinant, x, y;
    if (!originIsAbsolute) {
      bounds = _getBBox(target);
      xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
      yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
    } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
      x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
      y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
      xOrigin = x;
      yOrigin = y;
    }
    if (smooth || smooth !== false && cache.smooth) {
      tx = xOrigin - xOriginOld;
      ty = yOrigin - yOriginOld;
      cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
      cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
    } else {
      cache.xOffset = cache.yOffset = 0;
    }
    cache.xOrigin = xOrigin;
    cache.yOrigin = yOrigin;
    cache.smooth = !!smooth;
    cache.origin = origin;
    cache.originIsAbsolute = !!originIsAbsolute;
    target.style[_transformOriginProp] = "0px 0px";
    if (pluginToAddPropTweensTo) {
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
    }
    target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
  };
  var _parseTransform = function _parseTransform2(target, uncache) {
    var cache = target._gsap || new GSCache(target);
    if ("x" in cache && !uncache && !cache.uncache) {
      return cache;
    }
    var style = target.style, invertedScaleX = cache.scaleX < 0, px = "px", deg = "deg", cs = getComputedStyle(target), origin = _getComputedProperty(target, _transformOriginProp) || "0", x, y, z, scaleX, scaleY, rotation, rotationX, rotationY, skewX, skewY, perspective, xOrigin, yOrigin, matrix, angle, cos, sin, a, b, c, d, a12, a22, t1, t2, t3, a13, a23, a33, a42, a43, a32;
    x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
    scaleX = scaleY = 1;
    cache.svg = !!(target.getCTM && _isSVG(target));
    if (cs.translate) {
      if (cs.translate !== "none" || cs.scale !== "none" || cs.rotate !== "none") {
        style[_transformProp] = (cs.translate !== "none" ? "translate3d(" + (cs.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (cs.rotate !== "none" ? "rotate(" + cs.rotate + ") " : "") + (cs.scale !== "none" ? "scale(" + cs.scale.split(" ").join(",") + ") " : "") + (cs[_transformProp] !== "none" ? cs[_transformProp] : "");
      }
      style.scale = style.rotate = style.translate = "none";
    }
    matrix = _getMatrix(target, cache.svg);
    if (cache.svg) {
      if (cache.uncache) {
        t2 = target.getBBox();
        origin = cache.xOrigin - t2.x + "px " + (cache.yOrigin - t2.y) + "px";
        t1 = "";
      } else {
        t1 = !uncache && target.getAttribute("data-svg-origin");
      }
      _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
    }
    xOrigin = cache.xOrigin || 0;
    yOrigin = cache.yOrigin || 0;
    if (matrix !== _identity2DMatrix) {
      a = matrix[0];
      b = matrix[1];
      c = matrix[2];
      d = matrix[3];
      x = a12 = matrix[4];
      y = a22 = matrix[5];
      if (matrix.length === 6) {
        scaleX = Math.sqrt(a * a + b * b);
        scaleY = Math.sqrt(d * d + c * c);
        rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0;
        skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
        skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD)));
        if (cache.svg) {
          x -= xOrigin - (xOrigin * a + yOrigin * c);
          y -= yOrigin - (xOrigin * b + yOrigin * d);
        }
      } else {
        a32 = matrix[6];
        a42 = matrix[7];
        a13 = matrix[8];
        a23 = matrix[9];
        a33 = matrix[10];
        a43 = matrix[11];
        x = matrix[12];
        y = matrix[13];
        z = matrix[14];
        angle = _atan2(a32, a33);
        rotationX = angle * _RAD2DEG;
        if (angle) {
          cos = Math.cos(-angle);
          sin = Math.sin(-angle);
          t1 = a12 * cos + a13 * sin;
          t2 = a22 * cos + a23 * sin;
          t3 = a32 * cos + a33 * sin;
          a13 = a12 * -sin + a13 * cos;
          a23 = a22 * -sin + a23 * cos;
          a33 = a32 * -sin + a33 * cos;
          a43 = a42 * -sin + a43 * cos;
          a12 = t1;
          a22 = t2;
          a32 = t3;
        }
        angle = _atan2(-c, a33);
        rotationY = angle * _RAD2DEG;
        if (angle) {
          cos = Math.cos(-angle);
          sin = Math.sin(-angle);
          t1 = a * cos - a13 * sin;
          t2 = b * cos - a23 * sin;
          t3 = c * cos - a33 * sin;
          a43 = d * sin + a43 * cos;
          a = t1;
          b = t2;
          c = t3;
        }
        angle = _atan2(b, a);
        rotation = angle * _RAD2DEG;
        if (angle) {
          cos = Math.cos(angle);
          sin = Math.sin(angle);
          t1 = a * cos + b * sin;
          t2 = a12 * cos + a22 * sin;
          b = b * cos - a * sin;
          a22 = a22 * cos - a12 * sin;
          a = t1;
          a12 = t2;
        }
        if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
          rotationX = rotation = 0;
          rotationY = 180 - rotationY;
        }
        scaleX = _round(Math.sqrt(a * a + b * b + c * c));
        scaleY = _round(Math.sqrt(a22 * a22 + a32 * a32));
        angle = _atan2(a12, a22);
        skewX = Math.abs(angle) > 2e-4 ? angle * _RAD2DEG : 0;
        perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
      }
      if (cache.svg) {
        t1 = target.getAttribute("transform");
        cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
        t1 && target.setAttribute("transform", t1);
      }
    }
    if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
      if (invertedScaleX) {
        scaleX *= -1;
        skewX += rotation <= 0 ? 180 : -180;
        rotation += rotation <= 0 ? 180 : -180;
      } else {
        scaleY *= -1;
        skewX += skewX <= 0 ? 180 : -180;
      }
    }
    uncache = uncache || cache.uncache;
    cache.x = x - ((cache.xPercent = x && (!uncache && cache.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0))) ? target.offsetWidth * cache.xPercent / 100 : 0) + px;
    cache.y = y - ((cache.yPercent = y && (!uncache && cache.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0))) ? target.offsetHeight * cache.yPercent / 100 : 0) + px;
    cache.z = z + px;
    cache.scaleX = _round(scaleX);
    cache.scaleY = _round(scaleY);
    cache.rotation = _round(rotation) + deg;
    cache.rotationX = _round(rotationX) + deg;
    cache.rotationY = _round(rotationY) + deg;
    cache.skewX = skewX + deg;
    cache.skewY = skewY + deg;
    cache.transformPerspective = perspective + px;
    if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || 0) {
      style[_transformOriginProp] = _firstTwoOnly(origin);
    }
    cache.xOffset = cache.yOffset = 0;
    cache.force3D = _config.force3D;
    cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
    cache.uncache = 0;
    return cache;
  };
  var _firstTwoOnly = function _firstTwoOnly2(value) {
    return (value = value.split(" "))[0] + " " + value[1];
  };
  var _addPxTranslate = function _addPxTranslate2(target, start, value) {
    var unit = getUnit(start);
    return _round(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
  };
  var _renderNon3DTransforms = function _renderNon3DTransforms2(ratio, cache) {
    cache.z = "0px";
    cache.rotationY = cache.rotationX = "0deg";
    cache.force3D = 0;
    _renderCSSTransforms(ratio, cache);
  };
  var _zeroDeg = "0deg";
  var _zeroPx = "0px";
  var _endParenthesis = ") ";
  var _renderCSSTransforms = function _renderCSSTransforms2(ratio, cache) {
    var _ref = cache || this, xPercent = _ref.xPercent, yPercent = _ref.yPercent, x = _ref.x, y = _ref.y, z = _ref.z, rotation = _ref.rotation, rotationY = _ref.rotationY, rotationX = _ref.rotationX, skewX = _ref.skewX, skewY = _ref.skewY, scaleX = _ref.scaleX, scaleY = _ref.scaleY, transformPerspective = _ref.transformPerspective, force3D = _ref.force3D, target = _ref.target, zOrigin = _ref.zOrigin, transforms = "", use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true;
    if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
      var angle = parseFloat(rotationY) * _DEG2RAD, a13 = Math.sin(angle), a33 = Math.cos(angle), cos;
      angle = parseFloat(rotationX) * _DEG2RAD;
      cos = Math.cos(angle);
      x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
      y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
      z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
    }
    if (transformPerspective !== _zeroPx) {
      transforms += "perspective(" + transformPerspective + _endParenthesis;
    }
    if (xPercent || yPercent) {
      transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
    }
    if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
      transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
    }
    if (rotation !== _zeroDeg) {
      transforms += "rotate(" + rotation + _endParenthesis;
    }
    if (rotationY !== _zeroDeg) {
      transforms += "rotateY(" + rotationY + _endParenthesis;
    }
    if (rotationX !== _zeroDeg) {
      transforms += "rotateX(" + rotationX + _endParenthesis;
    }
    if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
      transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
    }
    if (scaleX !== 1 || scaleY !== 1) {
      transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
    }
    target.style[_transformProp] = transforms || "translate(0, 0)";
  };
  var _renderSVGTransforms = function _renderSVGTransforms2(ratio, cache) {
    var _ref2 = cache || this, xPercent = _ref2.xPercent, yPercent = _ref2.yPercent, x = _ref2.x, y = _ref2.y, rotation = _ref2.rotation, skewX = _ref2.skewX, skewY = _ref2.skewY, scaleX = _ref2.scaleX, scaleY = _ref2.scaleY, target = _ref2.target, xOrigin = _ref2.xOrigin, yOrigin = _ref2.yOrigin, xOffset = _ref2.xOffset, yOffset = _ref2.yOffset, forceCSS = _ref2.forceCSS, tx = parseFloat(x), ty = parseFloat(y), a11, a21, a12, a22, temp;
    rotation = parseFloat(rotation);
    skewX = parseFloat(skewX);
    skewY = parseFloat(skewY);
    if (skewY) {
      skewY = parseFloat(skewY);
      skewX += skewY;
      rotation += skewY;
    }
    if (rotation || skewX) {
      rotation *= _DEG2RAD;
      skewX *= _DEG2RAD;
      a11 = Math.cos(rotation) * scaleX;
      a21 = Math.sin(rotation) * scaleX;
      a12 = Math.sin(rotation - skewX) * -scaleY;
      a22 = Math.cos(rotation - skewX) * scaleY;
      if (skewX) {
        skewY *= _DEG2RAD;
        temp = Math.tan(skewX - skewY);
        temp = Math.sqrt(1 + temp * temp);
        a12 *= temp;
        a22 *= temp;
        if (skewY) {
          temp = Math.tan(skewY);
          temp = Math.sqrt(1 + temp * temp);
          a11 *= temp;
          a21 *= temp;
        }
      }
      a11 = _round(a11);
      a21 = _round(a21);
      a12 = _round(a12);
      a22 = _round(a22);
    } else {
      a11 = scaleX;
      a22 = scaleY;
      a21 = a12 = 0;
    }
    if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
      tx = _convertToUnit(target, "x", x, "px");
      ty = _convertToUnit(target, "y", y, "px");
    }
    if (xOrigin || yOrigin || xOffset || yOffset) {
      tx = _round(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
      ty = _round(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
    }
    if (xPercent || yPercent) {
      temp = target.getBBox();
      tx = _round(tx + xPercent / 100 * temp.width);
      ty = _round(ty + yPercent / 100 * temp.height);
    }
    temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
    target.setAttribute("transform", temp);
    forceCSS && (target.style[_transformProp] = temp);
  };
  var _addRotationalPropTween = function _addRotationalPropTween2(plugin, target, property, startNum, endValue) {
    var cap = 360, isString = _isString(endValue), endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1), change = endNum - startNum, finalValue = startNum + change + "deg", direction, pt;
    if (isString) {
      direction = endValue.split("_")[1];
      if (direction === "short") {
        change %= cap;
        if (change !== change % (cap / 2)) {
          change += change < 0 ? cap : -cap;
        }
      }
      if (direction === "cw" && change < 0) {
        change = (change + cap * _bigNum2) % cap - ~~(change / cap) * cap;
      } else if (direction === "ccw" && change > 0) {
        change = (change - cap * _bigNum2) % cap - ~~(change / cap) * cap;
      }
    }
    plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
    pt.e = finalValue;
    pt.u = "deg";
    plugin._props.push(property);
    return pt;
  };
  var _assign = function _assign2(target, source) {
    for (var p in source) {
      target[p] = source[p];
    }
    return target;
  };
  var _addRawTransformPTs = function _addRawTransformPTs2(plugin, transforms, target) {
    var startCache = _assign({}, target._gsap), exclude = "perspective,force3D,transformOrigin,svgOrigin", style = target.style, endCache, p, startValue, endValue, startNum, endNum, startUnit, endUnit;
    if (startCache.svg) {
      startValue = target.getAttribute("transform");
      target.setAttribute("transform", "");
      style[_transformProp] = transforms;
      endCache = _parseTransform(target, 1);
      _removeProperty(target, _transformProp);
      target.setAttribute("transform", startValue);
    } else {
      startValue = getComputedStyle(target)[_transformProp];
      style[_transformProp] = transforms;
      endCache = _parseTransform(target, 1);
      style[_transformProp] = startValue;
    }
    for (p in _transformProps) {
      startValue = startCache[p];
      endValue = endCache[p];
      if (startValue !== endValue && exclude.indexOf(p) < 0) {
        startUnit = getUnit(startValue);
        endUnit = getUnit(endValue);
        startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
        endNum = parseFloat(endValue);
        plugin._pt = new PropTween(plugin._pt, endCache, p, startNum, endNum - startNum, _renderCSSProp);
        plugin._pt.u = endUnit || 0;
        plugin._props.push(p);
      }
    }
    _assign(endCache, startCache);
  };
  _forEachName("padding,margin,Width,Radius", function(name, index) {
    var t2 = "Top", r2 = "Right", b = "Bottom", l = "Left", props = (index < 3 ? [t2, r2, b, l] : [t2 + l, t2 + r2, b + r2, b + l]).map(function(side) {
      return index < 2 ? name + side : "border" + side + name;
    });
    _specialProps[index > 1 ? "border" + name : name] = function(plugin, target, property, endValue, tween) {
      var a, vars;
      if (arguments.length < 4) {
        a = props.map(function(prop) {
          return _get(plugin, prop, property);
        });
        vars = a.join(" ");
        return vars.split(a[0]).length === 5 ? a[0] : vars;
      }
      a = (endValue + "").split(" ");
      vars = {};
      props.forEach(function(prop, i2) {
        return vars[prop] = a[i2] = a[i2] || a[(i2 - 1) / 2 | 0];
      });
      plugin.init(target, vars, tween);
    };
  });
  var CSSPlugin = {
    name: "css",
    register: _initCore,
    targetTest: function targetTest(target) {
      return target.style && target.nodeType;
    },
    init: function init3(target, vars, tween, index, targets) {
      var props = this._props, style = target.style, startAt = tween.vars.startAt, startValue, endValue, endNum, startNum, type, specialProp, p, startUnit, endUnit, relative, isTransformRelated, transformPropTween, cache, smooth, hasPriority, inlineProps;
      _pluginInitted || _initCore();
      this.styles = this.styles || _getStyleSaver(target);
      inlineProps = this.styles.props;
      this.tween = tween;
      for (p in vars) {
        if (p === "autoRound") {
          continue;
        }
        endValue = vars[p];
        if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) {
          continue;
        }
        type = typeof endValue;
        specialProp = _specialProps[p];
        if (type === "function") {
          endValue = endValue.call(tween, index, target, targets);
          type = typeof endValue;
        }
        if (type === "string" && ~endValue.indexOf("random(")) {
          endValue = _replaceRandom(endValue);
        }
        if (specialProp) {
          specialProp(this, target, p, endValue, tween) && (hasPriority = 1);
        } else if (p.substr(0, 2) === "--") {
          startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
          endValue += "";
          _colorExp.lastIndex = 0;
          if (!_colorExp.test(startValue)) {
            startUnit = getUnit(startValue);
            endUnit = getUnit(endValue);
          }
          endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
          this.add(style, "setProperty", startValue, endValue, index, targets, 0, 0, p);
          props.push(p);
          inlineProps.push(p, 0, style[p]);
        } else if (type !== "undefined") {
          if (startAt && p in startAt) {
            startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index, target, targets) : startAt[p];
            _isString(startValue) && ~startValue.indexOf("random(") && (startValue = _replaceRandom(startValue));
            getUnit(startValue + "") || (startValue += _config.units[p] || getUnit(_get(target, p)) || "");
            (startValue + "").charAt(1) === "=" && (startValue = _get(target, p));
          } else {
            startValue = _get(target, p);
          }
          startNum = parseFloat(startValue);
          relative = type === "string" && endValue.charAt(1) === "=" && endValue.substr(0, 2);
          relative && (endValue = endValue.substr(2));
          endNum = parseFloat(endValue);
          if (p in _propertyAliases) {
            if (p === "autoAlpha") {
              if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
                startNum = 0;
              }
              inlineProps.push("visibility", 0, style.visibility);
              _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
            }
            if (p !== "scale" && p !== "transform") {
              p = _propertyAliases[p];
              ~p.indexOf(",") && (p = p.split(",")[0]);
            }
          }
          isTransformRelated = p in _transformProps;
          if (isTransformRelated) {
            this.styles.save(p);
            if (!transformPropTween) {
              cache = target._gsap;
              cache.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform);
              smooth = vars.smoothOrigin !== false && cache.smooth;
              transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1);
              transformPropTween.dep = 1;
            }
            if (p === "scale") {
              this._pt = new PropTween(this._pt, cache, "scaleY", cache.scaleY, (relative ? _parseRelative(cache.scaleY, relative + endNum) : endNum) - cache.scaleY || 0, _renderCSSProp);
              this._pt.u = 0;
              props.push("scaleY", p);
              p += "X";
            } else if (p === "transformOrigin") {
              inlineProps.push(_transformOriginProp, 0, style[_transformOriginProp]);
              endValue = _convertKeywordsToPercentages(endValue);
              if (cache.svg) {
                _applySVGOrigin(target, endValue, 0, smooth, 0, this);
              } else {
                endUnit = parseFloat(endValue.split(" ")[2]) || 0;
                endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);
                _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
              }
              continue;
            } else if (p === "svgOrigin") {
              _applySVGOrigin(target, endValue, 1, smooth, 0, this);
              continue;
            } else if (p in _rotationalProperties) {
              _addRotationalPropTween(this, cache, p, startNum, relative ? _parseRelative(startNum, relative + endValue) : endValue);
              continue;
            } else if (p === "smoothOrigin") {
              _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);
              continue;
            } else if (p === "force3D") {
              cache[p] = endValue;
              continue;
            } else if (p === "transform") {
              _addRawTransformPTs(this, endValue, target);
              continue;
            }
          } else if (!(p in style)) {
            p = _checkPropPrefix(p) || p;
          }
          if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
            startUnit = (startValue + "").substr((startNum + "").length);
            endNum || (endNum = 0);
            endUnit = getUnit(endValue) || (p in _config.units ? _config.units[p] : startUnit);
            startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
            this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, (relative ? _parseRelative(startNum, relative + endNum) : endNum) - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
            this._pt.u = endUnit || 0;
            if (startUnit !== endUnit && endUnit !== "%") {
              this._pt.b = startValue;
              this._pt.r = _renderCSSPropWithBeginning;
            }
          } else if (!(p in style)) {
            if (p in target) {
              this.add(target, p, startValue || target[p], relative ? relative + endValue : endValue, index, targets);
            } else if (p !== "parseTransform") {
              _missingPlugin(p, endValue);
              continue;
            }
          } else {
            _tweenComplexCSSString.call(this, target, p, startValue, relative ? relative + endValue : endValue);
          }
          isTransformRelated || (p in style ? inlineProps.push(p, 0, style[p]) : inlineProps.push(p, 1, startValue || target[p]));
          props.push(p);
        }
      }
      hasPriority && _sortPropTweensByPriority(this);
    },
    render: function render2(ratio, data) {
      if (data.tween._time || !_reverting2()) {
        var pt = data._pt;
        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }
      } else {
        data.styles.revert();
      }
    },
    get: _get,
    aliases: _propertyAliases,
    getSetter: function getSetter(target, property, plugin) {
      var p = _propertyAliases[property];
      p && p.indexOf(",") < 0 && (property = p);
      return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
    },
    core: {
      _removeProperty,
      _getMatrix
    }
  };
  gsap.utils.checkPrefix = _checkPropPrefix;
  gsap.core.getStyleSaver = _getStyleSaver;
  (function(positionAndScale, rotation, others, aliases) {
    var all = _forEachName(positionAndScale + "," + rotation + "," + others, function(name) {
      _transformProps[name] = 1;
    });
    _forEachName(rotation, function(name) {
      _config.units[name] = "deg";
      _rotationalProperties[name] = 1;
    });
    _propertyAliases[all[13]] = positionAndScale + "," + rotation;
    _forEachName(aliases, function(name) {
      var split = name.split(":");
      _propertyAliases[split[1]] = all[split[0]];
    });
  })("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
  _forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(name) {
    _config.units[name] = "px";
  });
  gsap.registerPlugin(CSSPlugin);

  // node_modules/.pnpm/gsap@3.11.5/node_modules/gsap/index.js
  var gsapWithCSS = gsap.registerPlugin(CSSPlugin) || gsap;
  var TweenMaxWithCSS = gsapWithCSS.core.Tween;

  // node_modules/.pnpm/gsap@3.11.5/node_modules/gsap/ScrollTrigger.js
  init_live_reload();

  // node_modules/.pnpm/gsap@3.11.5/node_modules/gsap/Observer.js
  init_live_reload();
  function _defineProperties(target, props) {
    for (var i2 = 0; i2 < props.length; i2++) {
      var descriptor = props[i2];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  var gsap2;
  var _coreInitted2;
  var _clamp3;
  var _win3;
  var _doc3;
  var _docEl;
  var _body;
  var _isTouch;
  var _pointerType;
  var ScrollTrigger;
  var _root;
  var _normalizer;
  var _eventTypes;
  var _context2;
  var _getGSAP = function _getGSAP2() {
    return gsap2 || typeof window !== "undefined" && (gsap2 = window.gsap) && gsap2.registerPlugin && gsap2;
  };
  var _startup = 1;
  var _observers = [];
  var _scrollers = [];
  var _proxies = [];
  var _getTime = Date.now;
  var _bridge = function _bridge2(name, value) {
    return value;
  };
  var _integrate = function _integrate2() {
    var core = ScrollTrigger.core, data = core.bridge || {}, scrollers = core._scrollers, proxies = core._proxies;
    scrollers.push.apply(scrollers, _scrollers);
    proxies.push.apply(proxies, _proxies);
    _scrollers = scrollers;
    _proxies = proxies;
    _bridge = function _bridge3(name, value) {
      return data[name](value);
    };
  };
  var _getProxyProp = function _getProxyProp2(element, property) {
    return ~_proxies.indexOf(element) && _proxies[_proxies.indexOf(element) + 1][property];
  };
  var _isViewport = function _isViewport2(el) {
    return !!~_root.indexOf(el);
  };
  var _addListener = function _addListener2(element, type, func, nonPassive, capture) {
    return element.addEventListener(type, func, {
      passive: !nonPassive,
      capture: !!capture
    });
  };
  var _removeListener = function _removeListener2(element, type, func, capture) {
    return element.removeEventListener(type, func, !!capture);
  };
  var _scrollLeft = "scrollLeft";
  var _scrollTop = "scrollTop";
  var _onScroll = function _onScroll2() {
    return _normalizer && _normalizer.isPressed || _scrollers.cache++;
  };
  var _scrollCacheFunc = function _scrollCacheFunc2(f, doNotCache) {
    var cachingFunc = function cachingFunc2(value) {
      if (value || value === 0) {
        _startup && (_win3.history.scrollRestoration = "manual");
        var isNormalizing = _normalizer && _normalizer.isPressed;
        value = cachingFunc2.v = Math.round(value) || (_normalizer && _normalizer.iOS ? 1 : 0);
        f(value);
        cachingFunc2.cacheID = _scrollers.cache;
        isNormalizing && _bridge("ss", value);
      } else if (doNotCache || _scrollers.cache !== cachingFunc2.cacheID || _bridge("ref")) {
        cachingFunc2.cacheID = _scrollers.cache;
        cachingFunc2.v = f();
      }
      return cachingFunc2.v + cachingFunc2.offset;
    };
    cachingFunc.offset = 0;
    return f && cachingFunc;
  };
  var _horizontal = {
    s: _scrollLeft,
    p: "left",
    p2: "Left",
    os: "right",
    os2: "Right",
    d: "width",
    d2: "Width",
    a: "x",
    sc: _scrollCacheFunc(function(value) {
      return arguments.length ? _win3.scrollTo(value, _vertical.sc()) : _win3.pageXOffset || _doc3[_scrollLeft] || _docEl[_scrollLeft] || _body[_scrollLeft] || 0;
    })
  };
  var _vertical = {
    s: _scrollTop,
    p: "top",
    p2: "Top",
    os: "bottom",
    os2: "Bottom",
    d: "height",
    d2: "Height",
    a: "y",
    op: _horizontal,
    sc: _scrollCacheFunc(function(value) {
      return arguments.length ? _win3.scrollTo(_horizontal.sc(), value) : _win3.pageYOffset || _doc3[_scrollTop] || _docEl[_scrollTop] || _body[_scrollTop] || 0;
    })
  };
  var _getTarget = function _getTarget2(t2) {
    return gsap2.utils.toArray(t2)[0] || (typeof t2 === "string" && gsap2.config().nullTargetWarn !== false ? console.warn("Element not found:", t2) : null);
  };
  var _getScrollFunc = function _getScrollFunc2(element, _ref) {
    var s2 = _ref.s, sc = _ref.sc;
    _isViewport(element) && (element = _doc3.scrollingElement || _docEl);
    var i2 = _scrollers.indexOf(element), offset = sc === _vertical.sc ? 1 : 2;
    !~i2 && (i2 = _scrollers.push(element) - 1);
    _scrollers[i2 + offset] || element.addEventListener("scroll", _onScroll);
    var prev = _scrollers[i2 + offset], func = prev || (_scrollers[i2 + offset] = _scrollCacheFunc(_getProxyProp(element, s2), true) || (_isViewport(element) ? sc : _scrollCacheFunc(function(value) {
      return arguments.length ? element[s2] = value : element[s2];
    })));
    func.target = element;
    prev || (func.smooth = gsap2.getProperty(element, "scrollBehavior") === "smooth");
    return func;
  };
  var _getVelocityProp = function _getVelocityProp2(value, minTimeRefresh, useDelta) {
    var v1 = value, v2 = value, t1 = _getTime(), t2 = t1, min = minTimeRefresh || 50, dropToZeroTime = Math.max(500, min * 3), update = function update2(value2, force) {
      var t3 = _getTime();
      if (force || t3 - t1 > min) {
        v2 = v1;
        v1 = value2;
        t2 = t1;
        t1 = t3;
      } else if (useDelta) {
        v1 += value2;
      } else {
        v1 = v2 + (value2 - v2) / (t3 - t2) * (t1 - t2);
      }
    }, reset = function reset2() {
      v2 = v1 = useDelta ? 0 : v1;
      t2 = t1 = 0;
    }, getVelocity = function getVelocity2(latestValue) {
      var tOld = t2, vOld = v2, t3 = _getTime();
      (latestValue || latestValue === 0) && latestValue !== v1 && update(latestValue);
      return t1 === t2 || t3 - t2 > dropToZeroTime ? 0 : (v1 + (useDelta ? vOld : -vOld)) / ((useDelta ? t3 : t1) - tOld) * 1e3;
    };
    return {
      update,
      reset,
      getVelocity
    };
  };
  var _getEvent = function _getEvent2(e2, preventDefault) {
    preventDefault && !e2._gsapAllow && e2.preventDefault();
    return e2.changedTouches ? e2.changedTouches[0] : e2;
  };
  var _getAbsoluteMax = function _getAbsoluteMax2(a) {
    var max = Math.max.apply(Math, a), min = Math.min.apply(Math, a);
    return Math.abs(max) >= Math.abs(min) ? max : min;
  };
  var _setScrollTrigger = function _setScrollTrigger2() {
    ScrollTrigger = gsap2.core.globals().ScrollTrigger;
    ScrollTrigger && ScrollTrigger.core && _integrate();
  };
  var _initCore3 = function _initCore4(core) {
    gsap2 = core || _getGSAP();
    if (gsap2 && typeof document !== "undefined" && document.body) {
      _win3 = window;
      _doc3 = document;
      _docEl = _doc3.documentElement;
      _body = _doc3.body;
      _root = [_win3, _doc3, _docEl, _body];
      _clamp3 = gsap2.utils.clamp;
      _context2 = gsap2.core.context || function() {
      };
      _pointerType = "onpointerenter" in _body ? "pointer" : "mouse";
      _isTouch = Observer.isTouch = _win3.matchMedia && _win3.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in _win3 || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0;
      _eventTypes = Observer.eventTypes = ("ontouchstart" in _docEl ? "touchstart,touchmove,touchcancel,touchend" : !("onpointerdown" in _docEl) ? "mousedown,mousemove,mouseup,mouseup" : "pointerdown,pointermove,pointercancel,pointerup").split(",");
      setTimeout(function() {
        return _startup = 0;
      }, 500);
      _setScrollTrigger();
      _coreInitted2 = 1;
    }
    return _coreInitted2;
  };
  _horizontal.op = _vertical;
  _scrollers.cache = 0;
  var Observer = /* @__PURE__ */ function() {
    function Observer3(vars) {
      this.init(vars);
    }
    var _proto = Observer3.prototype;
    _proto.init = function init4(vars) {
      _coreInitted2 || _initCore3(gsap2) || console.warn("Please gsap.registerPlugin(Observer)");
      ScrollTrigger || _setScrollTrigger();
      var tolerance = vars.tolerance, dragMinimum = vars.dragMinimum, type = vars.type, target = vars.target, lineHeight = vars.lineHeight, debounce = vars.debounce, preventDefault = vars.preventDefault, onStop = vars.onStop, onStopDelay = vars.onStopDelay, ignore = vars.ignore, wheelSpeed = vars.wheelSpeed, event2 = vars.event, onDragStart = vars.onDragStart, onDragEnd = vars.onDragEnd, onDrag = vars.onDrag, onPress = vars.onPress, onRelease = vars.onRelease, onRight = vars.onRight, onLeft = vars.onLeft, onUp = vars.onUp, onDown = vars.onDown, onChangeX = vars.onChangeX, onChangeY = vars.onChangeY, onChange = vars.onChange, onToggleX = vars.onToggleX, onToggleY = vars.onToggleY, onHover = vars.onHover, onHoverEnd = vars.onHoverEnd, onMove = vars.onMove, ignoreCheck = vars.ignoreCheck, isNormalizer = vars.isNormalizer, onGestureStart = vars.onGestureStart, onGestureEnd = vars.onGestureEnd, onWheel = vars.onWheel, onEnable = vars.onEnable, onDisable = vars.onDisable, onClick2 = vars.onClick, scrollSpeed = vars.scrollSpeed, capture = vars.capture, allowClicks = vars.allowClicks, lockAxis = vars.lockAxis, onLockAxis = vars.onLockAxis;
      this.target = target = _getTarget(target) || _docEl;
      this.vars = vars;
      ignore && (ignore = gsap2.utils.toArray(ignore));
      tolerance = tolerance || 1e-9;
      dragMinimum = dragMinimum || 0;
      wheelSpeed = wheelSpeed || 1;
      scrollSpeed = scrollSpeed || 1;
      type = type || "wheel,touch,pointer";
      debounce = debounce !== false;
      lineHeight || (lineHeight = parseFloat(_win3.getComputedStyle(_body).lineHeight) || 22);
      var id, onStopDelayedCall, dragged, moved, wheeled, locked, axis, self = this, prevDeltaX = 0, prevDeltaY = 0, scrollFuncX = _getScrollFunc(target, _horizontal), scrollFuncY = _getScrollFunc(target, _vertical), scrollX = scrollFuncX(), scrollY = scrollFuncY(), limitToTouch = ~type.indexOf("touch") && !~type.indexOf("pointer") && _eventTypes[0] === "pointerdown", isViewport = _isViewport(target), ownerDoc = target.ownerDocument || _doc3, deltaX = [0, 0, 0], deltaY = [0, 0, 0], onClickTime = 0, clickCapture = function clickCapture2() {
        return onClickTime = _getTime();
      }, _ignoreCheck = function _ignoreCheck2(e2, isPointerOrTouch) {
        return (self.event = e2) && ignore && ~ignore.indexOf(e2.target) || isPointerOrTouch && limitToTouch && e2.pointerType !== "touch" || ignoreCheck && ignoreCheck(e2, isPointerOrTouch);
      }, onStopFunc = function onStopFunc2() {
        self._vx.reset();
        self._vy.reset();
        onStopDelayedCall.pause();
        onStop && onStop(self);
      }, update = function update2() {
        var dx = self.deltaX = _getAbsoluteMax(deltaX), dy = self.deltaY = _getAbsoluteMax(deltaY), changedX = Math.abs(dx) >= tolerance, changedY = Math.abs(dy) >= tolerance;
        onChange && (changedX || changedY) && onChange(self, dx, dy, deltaX, deltaY);
        if (changedX) {
          onRight && self.deltaX > 0 && onRight(self);
          onLeft && self.deltaX < 0 && onLeft(self);
          onChangeX && onChangeX(self);
          onToggleX && self.deltaX < 0 !== prevDeltaX < 0 && onToggleX(self);
          prevDeltaX = self.deltaX;
          deltaX[0] = deltaX[1] = deltaX[2] = 0;
        }
        if (changedY) {
          onDown && self.deltaY > 0 && onDown(self);
          onUp && self.deltaY < 0 && onUp(self);
          onChangeY && onChangeY(self);
          onToggleY && self.deltaY < 0 !== prevDeltaY < 0 && onToggleY(self);
          prevDeltaY = self.deltaY;
          deltaY[0] = deltaY[1] = deltaY[2] = 0;
        }
        if (moved || dragged) {
          onMove && onMove(self);
          if (dragged) {
            onDrag(self);
            dragged = false;
          }
          moved = false;
        }
        locked && !(locked = false) && onLockAxis && onLockAxis(self);
        if (wheeled) {
          onWheel(self);
          wheeled = false;
        }
        id = 0;
      }, onDelta = function onDelta2(x, y, index) {
        deltaX[index] += x;
        deltaY[index] += y;
        self._vx.update(x);
        self._vy.update(y);
        debounce ? id || (id = requestAnimationFrame(update)) : update();
      }, onTouchOrPointerDelta = function onTouchOrPointerDelta2(x, y) {
        if (lockAxis && !axis) {
          self.axis = axis = Math.abs(x) > Math.abs(y) ? "x" : "y";
          locked = true;
        }
        if (axis !== "y") {
          deltaX[2] += x;
          self._vx.update(x, true);
        }
        if (axis !== "x") {
          deltaY[2] += y;
          self._vy.update(y, true);
        }
        debounce ? id || (id = requestAnimationFrame(update)) : update();
      }, _onDrag = function _onDrag2(e2) {
        if (_ignoreCheck(e2, 1)) {
          return;
        }
        e2 = _getEvent(e2, preventDefault);
        var x = e2.clientX, y = e2.clientY, dx = x - self.x, dy = y - self.y, isDragging = self.isDragging;
        self.x = x;
        self.y = y;
        if (isDragging || Math.abs(self.startX - x) >= dragMinimum || Math.abs(self.startY - y) >= dragMinimum) {
          onDrag && (dragged = true);
          isDragging || (self.isDragging = true);
          onTouchOrPointerDelta(dx, dy);
          isDragging || onDragStart && onDragStart(self);
        }
      }, _onPress = self.onPress = function(e2) {
        if (_ignoreCheck(e2, 1) || e2 && e2.button) {
          return;
        }
        self.axis = axis = null;
        onStopDelayedCall.pause();
        self.isPressed = true;
        e2 = _getEvent(e2);
        prevDeltaX = prevDeltaY = 0;
        self.startX = self.x = e2.clientX;
        self.startY = self.y = e2.clientY;
        self._vx.reset();
        self._vy.reset();
        _addListener(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, preventDefault, true);
        self.deltaX = self.deltaY = 0;
        onPress && onPress(self);
      }, _onRelease = self.onRelease = function(e2) {
        if (_ignoreCheck(e2, 1)) {
          return;
        }
        _removeListener(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, true);
        var isTrackingDrag = !isNaN(self.y - self.startY), wasDragging = self.isDragging && (Math.abs(self.x - self.startX) > 3 || Math.abs(self.y - self.startY) > 3), eventData = _getEvent(e2);
        if (!wasDragging && isTrackingDrag) {
          self._vx.reset();
          self._vy.reset();
          if (preventDefault && allowClicks) {
            gsap2.delayedCall(0.08, function() {
              if (_getTime() - onClickTime > 300 && !e2.defaultPrevented) {
                if (e2.target.click) {
                  e2.target.click();
                } else if (ownerDoc.createEvent) {
                  var syntheticEvent = ownerDoc.createEvent("MouseEvents");
                  syntheticEvent.initMouseEvent("click", true, true, _win3, 1, eventData.screenX, eventData.screenY, eventData.clientX, eventData.clientY, false, false, false, false, 0, null);
                  e2.target.dispatchEvent(syntheticEvent);
                }
              }
            });
          }
        }
        self.isDragging = self.isGesturing = self.isPressed = false;
        onStop && !isNormalizer && onStopDelayedCall.restart(true);
        onDragEnd && wasDragging && onDragEnd(self);
        onRelease && onRelease(self, wasDragging);
      }, _onGestureStart = function _onGestureStart2(e2) {
        return e2.touches && e2.touches.length > 1 && (self.isGesturing = true) && onGestureStart(e2, self.isDragging);
      }, _onGestureEnd = function _onGestureEnd2() {
        return (self.isGesturing = false) || onGestureEnd(self);
      }, onScroll2 = function onScroll3(e2) {
        if (_ignoreCheck(e2)) {
          return;
        }
        var x = scrollFuncX(), y = scrollFuncY();
        onDelta((x - scrollX) * scrollSpeed, (y - scrollY) * scrollSpeed, 1);
        scrollX = x;
        scrollY = y;
        onStop && onStopDelayedCall.restart(true);
      }, _onWheel = function _onWheel2(e2) {
        if (_ignoreCheck(e2)) {
          return;
        }
        e2 = _getEvent(e2, preventDefault);
        onWheel && (wheeled = true);
        var multiplier = (e2.deltaMode === 1 ? lineHeight : e2.deltaMode === 2 ? _win3.innerHeight : 1) * wheelSpeed;
        onDelta(e2.deltaX * multiplier, e2.deltaY * multiplier, 0);
        onStop && !isNormalizer && onStopDelayedCall.restart(true);
      }, _onMove = function _onMove2(e2) {
        if (_ignoreCheck(e2)) {
          return;
        }
        var x = e2.clientX, y = e2.clientY, dx = x - self.x, dy = y - self.y;
        self.x = x;
        self.y = y;
        moved = true;
        (dx || dy) && onTouchOrPointerDelta(dx, dy);
      }, _onHover = function _onHover2(e2) {
        self.event = e2;
        onHover(self);
      }, _onHoverEnd = function _onHoverEnd2(e2) {
        self.event = e2;
        onHoverEnd(self);
      }, _onClick = function _onClick2(e2) {
        return _ignoreCheck(e2) || _getEvent(e2, preventDefault) && onClick2(self);
      };
      onStopDelayedCall = self._dc = gsap2.delayedCall(onStopDelay || 0.25, onStopFunc).pause();
      self.deltaX = self.deltaY = 0;
      self._vx = _getVelocityProp(0, 50, true);
      self._vy = _getVelocityProp(0, 50, true);
      self.scrollX = scrollFuncX;
      self.scrollY = scrollFuncY;
      self.isDragging = self.isGesturing = self.isPressed = false;
      _context2(this);
      self.enable = function(e2) {
        if (!self.isEnabled) {
          _addListener(isViewport ? ownerDoc : target, "scroll", _onScroll);
          type.indexOf("scroll") >= 0 && _addListener(isViewport ? ownerDoc : target, "scroll", onScroll2, preventDefault, capture);
          type.indexOf("wheel") >= 0 && _addListener(target, "wheel", _onWheel, preventDefault, capture);
          if (type.indexOf("touch") >= 0 && _isTouch || type.indexOf("pointer") >= 0) {
            _addListener(target, _eventTypes[0], _onPress, preventDefault, capture);
            _addListener(ownerDoc, _eventTypes[2], _onRelease);
            _addListener(ownerDoc, _eventTypes[3], _onRelease);
            allowClicks && _addListener(target, "click", clickCapture, false, true);
            onClick2 && _addListener(target, "click", _onClick);
            onGestureStart && _addListener(ownerDoc, "gesturestart", _onGestureStart);
            onGestureEnd && _addListener(ownerDoc, "gestureend", _onGestureEnd);
            onHover && _addListener(target, _pointerType + "enter", _onHover);
            onHoverEnd && _addListener(target, _pointerType + "leave", _onHoverEnd);
            onMove && _addListener(target, _pointerType + "move", _onMove);
          }
          self.isEnabled = true;
          e2 && e2.type && _onPress(e2);
          onEnable && onEnable(self);
        }
        return self;
      };
      self.disable = function() {
        if (self.isEnabled) {
          _observers.filter(function(o2) {
            return o2 !== self && _isViewport(o2.target);
          }).length || _removeListener(isViewport ? ownerDoc : target, "scroll", _onScroll);
          if (self.isPressed) {
            self._vx.reset();
            self._vy.reset();
            _removeListener(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, true);
          }
          _removeListener(isViewport ? ownerDoc : target, "scroll", onScroll2, capture);
          _removeListener(target, "wheel", _onWheel, capture);
          _removeListener(target, _eventTypes[0], _onPress, capture);
          _removeListener(ownerDoc, _eventTypes[2], _onRelease);
          _removeListener(ownerDoc, _eventTypes[3], _onRelease);
          _removeListener(target, "click", clickCapture, true);
          _removeListener(target, "click", _onClick);
          _removeListener(ownerDoc, "gesturestart", _onGestureStart);
          _removeListener(ownerDoc, "gestureend", _onGestureEnd);
          _removeListener(target, _pointerType + "enter", _onHover);
          _removeListener(target, _pointerType + "leave", _onHoverEnd);
          _removeListener(target, _pointerType + "move", _onMove);
          self.isEnabled = self.isPressed = self.isDragging = false;
          onDisable && onDisable(self);
        }
      };
      self.kill = self.revert = function() {
        self.disable();
        var i2 = _observers.indexOf(self);
        i2 >= 0 && _observers.splice(i2, 1);
        _normalizer === self && (_normalizer = 0);
      };
      _observers.push(self);
      isNormalizer && _isViewport(target) && (_normalizer = self);
      self.enable(event2);
    };
    _createClass(Observer3, [{
      key: "velocityX",
      get: function get() {
        return this._vx.getVelocity();
      }
    }, {
      key: "velocityY",
      get: function get() {
        return this._vy.getVelocity();
      }
    }]);
    return Observer3;
  }();
  Observer.version = "3.11.5";
  Observer.create = function(vars) {
    return new Observer(vars);
  };
  Observer.register = _initCore3;
  Observer.getAll = function() {
    return _observers.slice();
  };
  Observer.getById = function(id) {
    return _observers.filter(function(o2) {
      return o2.vars.id === id;
    })[0];
  };
  _getGSAP() && gsap2.registerPlugin(Observer);

  // node_modules/.pnpm/gsap@3.11.5/node_modules/gsap/ScrollTrigger.js
  var gsap3;
  var _coreInitted3;
  var _win4;
  var _doc4;
  var _docEl2;
  var _body2;
  var _root2;
  var _resizeDelay;
  var _toArray;
  var _clamp4;
  var _time2;
  var _syncInterval;
  var _refreshing;
  var _pointerIsDown;
  var _transformProp2;
  var _i;
  var _prevWidth;
  var _prevHeight;
  var _autoRefresh;
  var _sort;
  var _suppressOverwrites2;
  var _ignoreResize;
  var _normalizer2;
  var _ignoreMobileResize;
  var _baseScreenHeight;
  var _baseScreenWidth;
  var _fixIOSBug;
  var _context3;
  var _scrollRestoration;
  var _limitCallbacks;
  var _startup2 = 1;
  var _getTime2 = Date.now;
  var _time1 = _getTime2();
  var _lastScrollTime = 0;
  var _enabled = 0;
  var _rafBugFix = function _rafBugFix2() {
    return _enabled && requestAnimationFrame(_rafBugFix2);
  };
  var _pointerDownHandler = function _pointerDownHandler2() {
    return _pointerIsDown = 1;
  };
  var _pointerUpHandler = function _pointerUpHandler2() {
    return _pointerIsDown = 0;
  };
  var _passThrough3 = function _passThrough4(v) {
    return v;
  };
  var _round3 = function _round4(value) {
    return Math.round(value * 1e5) / 1e5 || 0;
  };
  var _windowExists5 = function _windowExists6() {
    return typeof window !== "undefined";
  };
  var _getGSAP3 = function _getGSAP4() {
    return gsap3 || _windowExists5() && (gsap3 = window.gsap) && gsap3.registerPlugin && gsap3;
  };
  var _isViewport3 = function _isViewport4(e2) {
    return !!~_root2.indexOf(e2);
  };
  var _getBoundsFunc = function _getBoundsFunc2(element) {
    return _getProxyProp(element, "getBoundingClientRect") || (_isViewport3(element) ? function() {
      _winOffsets.width = _win4.innerWidth;
      _winOffsets.height = _win4.innerHeight;
      return _winOffsets;
    } : function() {
      return _getBounds(element);
    });
  };
  var _getSizeFunc = function _getSizeFunc2(scroller, isViewport, _ref) {
    var d = _ref.d, d2 = _ref.d2, a = _ref.a;
    return (a = _getProxyProp(scroller, "getBoundingClientRect")) ? function() {
      return a()[d];
    } : function() {
      return (isViewport ? _win4["inner" + d2] : scroller["client" + d2]) || 0;
    };
  };
  var _getOffsetsFunc = function _getOffsetsFunc2(element, isViewport) {
    return !isViewport || ~_proxies.indexOf(element) ? _getBoundsFunc(element) : function() {
      return _winOffsets;
    };
  };
  var _maxScroll = function _maxScroll2(element, _ref2) {
    var s2 = _ref2.s, d2 = _ref2.d2, d = _ref2.d, a = _ref2.a;
    return Math.max(0, (s2 = "scroll" + d2) && (a = _getProxyProp(element, s2)) ? a() - _getBoundsFunc(element)()[d] : _isViewport3(element) ? (_docEl2[s2] || _body2[s2]) - (_win4["inner" + d2] || _docEl2["client" + d2] || _body2["client" + d2]) : element[s2] - element["offset" + d2]);
  };
  var _iterateAutoRefresh = function _iterateAutoRefresh2(func, events2) {
    for (var i2 = 0; i2 < _autoRefresh.length; i2 += 3) {
      (!events2 || ~events2.indexOf(_autoRefresh[i2 + 1])) && func(_autoRefresh[i2], _autoRefresh[i2 + 1], _autoRefresh[i2 + 2]);
    }
  };
  var _isString3 = function _isString4(value) {
    return typeof value === "string";
  };
  var _isFunction3 = function _isFunction4(value) {
    return typeof value === "function";
  };
  var _isNumber3 = function _isNumber4(value) {
    return typeof value === "number";
  };
  var _isObject3 = function _isObject4(value) {
    return typeof value === "object";
  };
  var _endAnimation = function _endAnimation2(animation, reversed, pause) {
    return animation && animation.progress(reversed ? 0 : 1) && pause && animation.pause();
  };
  var _callback3 = function _callback4(self, func) {
    if (self.enabled) {
      var result = func(self);
      result && result.totalTime && (self.callbackAnimation = result);
    }
  };
  var _abs = Math.abs;
  var _left = "left";
  var _top = "top";
  var _right = "right";
  var _bottom = "bottom";
  var _width = "width";
  var _height = "height";
  var _Right = "Right";
  var _Left = "Left";
  var _Top = "Top";
  var _Bottom = "Bottom";
  var _padding = "padding";
  var _margin = "margin";
  var _Width = "Width";
  var _Height = "Height";
  var _px = "px";
  var _getComputedStyle = function _getComputedStyle2(element) {
    return _win4.getComputedStyle(element);
  };
  var _makePositionable = function _makePositionable2(element) {
    var position = _getComputedStyle(element).position;
    element.style.position = position === "absolute" || position === "fixed" ? position : "relative";
  };
  var _setDefaults3 = function _setDefaults4(obj, defaults2) {
    for (var p in defaults2) {
      p in obj || (obj[p] = defaults2[p]);
    }
    return obj;
  };
  var _getBounds = function _getBounds2(element, withoutTransforms) {
    var tween = withoutTransforms && _getComputedStyle(element)[_transformProp2] !== "matrix(1, 0, 0, 1, 0, 0)" && gsap3.to(element, {
      x: 0,
      y: 0,
      xPercent: 0,
      yPercent: 0,
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      skewX: 0,
      skewY: 0
    }).progress(1), bounds = element.getBoundingClientRect();
    tween && tween.progress(0).kill();
    return bounds;
  };
  var _getSize = function _getSize2(element, _ref3) {
    var d2 = _ref3.d2;
    return element["offset" + d2] || element["client" + d2] || 0;
  };
  var _getLabelRatioArray = function _getLabelRatioArray2(timeline2) {
    var a = [], labels = timeline2.labels, duration = timeline2.duration(), p;
    for (p in labels) {
      a.push(labels[p] / duration);
    }
    return a;
  };
  var _getClosestLabel = function _getClosestLabel2(animation) {
    return function(value) {
      return gsap3.utils.snap(_getLabelRatioArray(animation), value);
    };
  };
  var _snapDirectional = function _snapDirectional2(snapIncrementOrArray) {
    var snap3 = gsap3.utils.snap(snapIncrementOrArray), a = Array.isArray(snapIncrementOrArray) && snapIncrementOrArray.slice(0).sort(function(a2, b) {
      return a2 - b;
    });
    return a ? function(value, direction, threshold) {
      if (threshold === void 0) {
        threshold = 1e-3;
      }
      var i2;
      if (!direction) {
        return snap3(value);
      }
      if (direction > 0) {
        value -= threshold;
        for (i2 = 0; i2 < a.length; i2++) {
          if (a[i2] >= value) {
            return a[i2];
          }
        }
        return a[i2 - 1];
      } else {
        i2 = a.length;
        value += threshold;
        while (i2--) {
          if (a[i2] <= value) {
            return a[i2];
          }
        }
      }
      return a[0];
    } : function(value, direction, threshold) {
      if (threshold === void 0) {
        threshold = 1e-3;
      }
      var snapped = snap3(value);
      return !direction || Math.abs(snapped - value) < threshold || snapped - value < 0 === direction < 0 ? snapped : snap3(direction < 0 ? value - snapIncrementOrArray : value + snapIncrementOrArray);
    };
  };
  var _getLabelAtDirection = function _getLabelAtDirection2(timeline2) {
    return function(value, st) {
      return _snapDirectional(_getLabelRatioArray(timeline2))(value, st.direction);
    };
  };
  var _multiListener = function _multiListener2(func, element, types, callback) {
    return types.split(",").forEach(function(type) {
      return func(element, type, callback);
    });
  };
  var _addListener3 = function _addListener4(element, type, func, nonPassive, capture) {
    return element.addEventListener(type, func, {
      passive: !nonPassive,
      capture: !!capture
    });
  };
  var _removeListener3 = function _removeListener4(element, type, func, capture) {
    return element.removeEventListener(type, func, !!capture);
  };
  var _wheelListener = function _wheelListener2(func, el, scrollFunc) {
    scrollFunc = scrollFunc && scrollFunc.wheelHandler;
    if (scrollFunc) {
      func(el, "wheel", scrollFunc);
      func(el, "touchmove", scrollFunc);
    }
  };
  var _markerDefaults = {
    startColor: "green",
    endColor: "red",
    indent: 0,
    fontSize: "16px",
    fontWeight: "normal"
  };
  var _defaults2 = {
    toggleActions: "play",
    anticipatePin: 0
  };
  var _keywords = {
    top: 0,
    left: 0,
    center: 0.5,
    bottom: 1,
    right: 1
  };
  var _offsetToPx = function _offsetToPx2(value, size) {
    if (_isString3(value)) {
      var eqIndex = value.indexOf("="), relative = ~eqIndex ? +(value.charAt(eqIndex - 1) + 1) * parseFloat(value.substr(eqIndex + 1)) : 0;
      if (~eqIndex) {
        value.indexOf("%") > eqIndex && (relative *= size / 100);
        value = value.substr(0, eqIndex - 1);
      }
      value = relative + (value in _keywords ? _keywords[value] * size : ~value.indexOf("%") ? parseFloat(value) * size / 100 : parseFloat(value) || 0);
    }
    return value;
  };
  var _createMarker = function _createMarker2(type, name, container, direction, _ref4, offset, matchWidthEl, containerAnimation) {
    var startColor = _ref4.startColor, endColor = _ref4.endColor, fontSize = _ref4.fontSize, indent = _ref4.indent, fontWeight = _ref4.fontWeight;
    var e2 = _doc4.createElement("div"), useFixedPosition = _isViewport3(container) || _getProxyProp(container, "pinType") === "fixed", isScroller = type.indexOf("scroller") !== -1, parent = useFixedPosition ? _body2 : container, isStart = type.indexOf("start") !== -1, color = isStart ? startColor : endColor, css = "border-color:" + color + ";font-size:" + fontSize + ";color:" + color + ";font-weight:" + fontWeight + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
    css += "position:" + ((isScroller || containerAnimation) && useFixedPosition ? "fixed;" : "absolute;");
    (isScroller || containerAnimation || !useFixedPosition) && (css += (direction === _vertical ? _right : _bottom) + ":" + (offset + parseFloat(indent)) + "px;");
    matchWidthEl && (css += "box-sizing:border-box;text-align:left;width:" + matchWidthEl.offsetWidth + "px;");
    e2._isStart = isStart;
    e2.setAttribute("class", "gsap-marker-" + type + (name ? " marker-" + name : ""));
    e2.style.cssText = css;
    e2.innerText = name || name === 0 ? type + "-" + name : type;
    parent.children[0] ? parent.insertBefore(e2, parent.children[0]) : parent.appendChild(e2);
    e2._offset = e2["offset" + direction.op.d2];
    _positionMarker(e2, 0, direction, isStart);
    return e2;
  };
  var _positionMarker = function _positionMarker2(marker, start, direction, flipped) {
    var vars = {
      display: "block"
    }, side = direction[flipped ? "os2" : "p2"], oppositeSide = direction[flipped ? "p2" : "os2"];
    marker._isFlipped = flipped;
    vars[direction.a + "Percent"] = flipped ? -100 : 0;
    vars[direction.a] = flipped ? "1px" : 0;
    vars["border" + side + _Width] = 1;
    vars["border" + oppositeSide + _Width] = 0;
    vars[direction.p] = start + "px";
    gsap3.set(marker, vars);
  };
  var _triggers = [];
  var _ids = {};
  var _rafID;
  var _sync = function _sync2() {
    return _getTime2() - _lastScrollTime > 34 && (_rafID || (_rafID = requestAnimationFrame(_updateAll)));
  };
  var _onScroll3 = function _onScroll4() {
    if (!_normalizer2 || !_normalizer2.isPressed || _normalizer2.startX > _body2.clientWidth) {
      _scrollers.cache++;
      if (_normalizer2) {
        _rafID || (_rafID = requestAnimationFrame(_updateAll));
      } else {
        _updateAll();
      }
      _lastScrollTime || _dispatch3("scrollStart");
      _lastScrollTime = _getTime2();
    }
  };
  var _setBaseDimensions = function _setBaseDimensions2() {
    _baseScreenWidth = _win4.innerWidth;
    _baseScreenHeight = _win4.innerHeight;
  };
  var _onResize = function _onResize2() {
    _scrollers.cache++;
    !_refreshing && !_ignoreResize && !_doc4.fullscreenElement && !_doc4.webkitFullscreenElement && (!_ignoreMobileResize || _baseScreenWidth !== _win4.innerWidth || Math.abs(_win4.innerHeight - _baseScreenHeight) > _win4.innerHeight * 0.25) && _resizeDelay.restart(true);
  };
  var _listeners2 = {};
  var _emptyArray2 = [];
  var _softRefresh = function _softRefresh2() {
    return _removeListener3(ScrollTrigger2, "scrollEnd", _softRefresh2) || _refreshAll(true);
  };
  var _dispatch3 = function _dispatch4(type) {
    return _listeners2[type] && _listeners2[type].map(function(f) {
      return f();
    }) || _emptyArray2;
  };
  var _savedStyles = [];
  var _revertRecorded = function _revertRecorded2(media) {
    for (var i2 = 0; i2 < _savedStyles.length; i2 += 5) {
      if (!media || _savedStyles[i2 + 4] && _savedStyles[i2 + 4].query === media) {
        _savedStyles[i2].style.cssText = _savedStyles[i2 + 1];
        _savedStyles[i2].getBBox && _savedStyles[i2].setAttribute("transform", _savedStyles[i2 + 2] || "");
        _savedStyles[i2 + 3].uncache = 1;
      }
    }
  };
  var _revertAll = function _revertAll2(kill, media) {
    var trigger;
    for (_i = 0; _i < _triggers.length; _i++) {
      trigger = _triggers[_i];
      if (trigger && (!media || trigger._ctx === media)) {
        if (kill) {
          trigger.kill(1);
        } else {
          trigger.revert(true, true);
        }
      }
    }
    media && _revertRecorded(media);
    media || _dispatch3("revert");
  };
  var _clearScrollMemory = function _clearScrollMemory2(scrollRestoration, force) {
    _scrollers.cache++;
    (force || !_refreshingAll) && _scrollers.forEach(function(obj) {
      return _isFunction3(obj) && obj.cacheID++ && (obj.rec = 0);
    });
    _isString3(scrollRestoration) && (_win4.history.scrollRestoration = _scrollRestoration = scrollRestoration);
  };
  var _refreshingAll;
  var _refreshID = 0;
  var _queueRefreshID;
  var _queueRefreshAll = function _queueRefreshAll2() {
    if (_queueRefreshID !== _refreshID) {
      var id = _queueRefreshID = _refreshID;
      requestAnimationFrame(function() {
        return id === _refreshID && _refreshAll(true);
      });
    }
  };
  var _refreshAll = function _refreshAll2(force, skipRevert) {
    if (_lastScrollTime && !force) {
      _addListener3(ScrollTrigger2, "scrollEnd", _softRefresh);
      return;
    }
    _refreshingAll = ScrollTrigger2.isRefreshing = true;
    _scrollers.forEach(function(obj) {
      return _isFunction3(obj) && obj.cacheID++ && (obj.rec = obj());
    });
    var refreshInits = _dispatch3("refreshInit");
    _sort && ScrollTrigger2.sort();
    skipRevert || _revertAll();
    _scrollers.forEach(function(obj) {
      if (_isFunction3(obj)) {
        obj.smooth && (obj.target.style.scrollBehavior = "auto");
        obj(0);
      }
    });
    _triggers.slice(0).forEach(function(t2) {
      return t2.refresh();
    });
    _triggers.forEach(function(t2, i2) {
      if (t2._subPinOffset && t2.pin) {
        var prop = t2.vars.horizontal ? "offsetWidth" : "offsetHeight", original = t2.pin[prop];
        t2.revert(true, 1);
        t2.adjustPinSpacing(t2.pin[prop] - original);
        t2.refresh();
      }
    });
    _triggers.forEach(function(t2) {
      return t2.vars.end === "max" && t2.setPositions(t2.start, Math.max(t2.start + 1, _maxScroll(t2.scroller, t2._dir)));
    });
    refreshInits.forEach(function(result) {
      return result && result.render && result.render(-1);
    });
    _scrollers.forEach(function(obj) {
      if (_isFunction3(obj)) {
        obj.smooth && requestAnimationFrame(function() {
          return obj.target.style.scrollBehavior = "smooth";
        });
        obj.rec && obj(obj.rec);
      }
    });
    _clearScrollMemory(_scrollRestoration, 1);
    _resizeDelay.pause();
    _refreshID++;
    _refreshingAll = 2;
    _updateAll(2);
    _triggers.forEach(function(t2) {
      return _isFunction3(t2.vars.onRefresh) && t2.vars.onRefresh(t2);
    });
    _refreshingAll = ScrollTrigger2.isRefreshing = false;
    _dispatch3("refresh");
  };
  var _lastScroll = 0;
  var _direction = 1;
  var _primary;
  var _updateAll = function _updateAll2(force) {
    if (!_refreshingAll || force === 2) {
      ScrollTrigger2.isUpdating = true;
      _primary && _primary.update(0);
      var l = _triggers.length, time = _getTime2(), recordVelocity = time - _time1 >= 50, scroll = l && _triggers[0].scroll();
      _direction = _lastScroll > scroll ? -1 : 1;
      _refreshingAll || (_lastScroll = scroll);
      if (recordVelocity) {
        if (_lastScrollTime && !_pointerIsDown && time - _lastScrollTime > 200) {
          _lastScrollTime = 0;
          _dispatch3("scrollEnd");
        }
        _time2 = _time1;
        _time1 = time;
      }
      if (_direction < 0) {
        _i = l;
        while (_i-- > 0) {
          _triggers[_i] && _triggers[_i].update(0, recordVelocity);
        }
        _direction = 1;
      } else {
        for (_i = 0; _i < l; _i++) {
          _triggers[_i] && _triggers[_i].update(0, recordVelocity);
        }
      }
      ScrollTrigger2.isUpdating = false;
    }
    _rafID = 0;
  };
  var _propNamesToCopy = [_left, _top, _bottom, _right, _margin + _Bottom, _margin + _Right, _margin + _Top, _margin + _Left, "display", "flexShrink", "float", "zIndex", "gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd", "gridArea", "justifySelf", "alignSelf", "placeSelf", "order"];
  var _stateProps = _propNamesToCopy.concat([_width, _height, "boxSizing", "max" + _Width, "max" + _Height, "position", _margin, _padding, _padding + _Top, _padding + _Right, _padding + _Bottom, _padding + _Left]);
  var _swapPinOut = function _swapPinOut2(pin, spacer, state) {
    _setState(state);
    var cache = pin._gsap;
    if (cache.spacerIsNative) {
      _setState(cache.spacerState);
    } else if (pin._gsap.swappedIn) {
      var parent = spacer.parentNode;
      if (parent) {
        parent.insertBefore(pin, spacer);
        parent.removeChild(spacer);
      }
    }
    pin._gsap.swappedIn = false;
  };
  var _swapPinIn = function _swapPinIn2(pin, spacer, cs, spacerState) {
    if (!pin._gsap.swappedIn) {
      var i2 = _propNamesToCopy.length, spacerStyle = spacer.style, pinStyle = pin.style, p;
      while (i2--) {
        p = _propNamesToCopy[i2];
        spacerStyle[p] = cs[p];
      }
      spacerStyle.position = cs.position === "absolute" ? "absolute" : "relative";
      cs.display === "inline" && (spacerStyle.display = "inline-block");
      pinStyle[_bottom] = pinStyle[_right] = "auto";
      spacerStyle.flexBasis = cs.flexBasis || "auto";
      spacerStyle.overflow = "visible";
      spacerStyle.boxSizing = "border-box";
      spacerStyle[_width] = _getSize(pin, _horizontal) + _px;
      spacerStyle[_height] = _getSize(pin, _vertical) + _px;
      spacerStyle[_padding] = pinStyle[_margin] = pinStyle[_top] = pinStyle[_left] = "0";
      _setState(spacerState);
      pinStyle[_width] = pinStyle["max" + _Width] = cs[_width];
      pinStyle[_height] = pinStyle["max" + _Height] = cs[_height];
      pinStyle[_padding] = cs[_padding];
      if (pin.parentNode !== spacer) {
        pin.parentNode.insertBefore(spacer, pin);
        spacer.appendChild(pin);
      }
      pin._gsap.swappedIn = true;
    }
  };
  var _capsExp2 = /([A-Z])/g;
  var _setState = function _setState2(state) {
    if (state) {
      var style = state.t.style, l = state.length, i2 = 0, p, value;
      (state.t._gsap || gsap3.core.getCache(state.t)).uncache = 1;
      for (; i2 < l; i2 += 2) {
        value = state[i2 + 1];
        p = state[i2];
        if (value) {
          style[p] = value;
        } else if (style[p]) {
          style.removeProperty(p.replace(_capsExp2, "-$1").toLowerCase());
        }
      }
    }
  };
  var _getState = function _getState2(element) {
    var l = _stateProps.length, style = element.style, state = [], i2 = 0;
    for (; i2 < l; i2++) {
      state.push(_stateProps[i2], style[_stateProps[i2]]);
    }
    state.t = element;
    return state;
  };
  var _copyState = function _copyState2(state, override, omitOffsets) {
    var result = [], l = state.length, i2 = omitOffsets ? 8 : 0, p;
    for (; i2 < l; i2 += 2) {
      p = state[i2];
      result.push(p, p in override ? override[p] : state[i2 + 1]);
    }
    result.t = state.t;
    return result;
  };
  var _winOffsets = {
    left: 0,
    top: 0
  };
  var _parsePosition3 = function _parsePosition4(value, trigger, scrollerSize, direction, scroll, marker, markerScroller, self, scrollerBounds, borderWidth, useFixedPosition, scrollerMax, containerAnimation) {
    _isFunction3(value) && (value = value(self));
    if (_isString3(value) && value.substr(0, 3) === "max") {
      value = scrollerMax + (value.charAt(4) === "=" ? _offsetToPx("0" + value.substr(3), scrollerSize) : 0);
    }
    var time = containerAnimation ? containerAnimation.time() : 0, p1, p2, element;
    containerAnimation && containerAnimation.seek(0);
    if (!_isNumber3(value)) {
      _isFunction3(trigger) && (trigger = trigger(self));
      var offsets = (value || "0").split(" "), bounds, localOffset, globalOffset, display;
      element = _getTarget(trigger) || _body2;
      bounds = _getBounds(element) || {};
      if ((!bounds || !bounds.left && !bounds.top) && _getComputedStyle(element).display === "none") {
        display = element.style.display;
        element.style.display = "block";
        bounds = _getBounds(element);
        display ? element.style.display = display : element.style.removeProperty("display");
      }
      localOffset = _offsetToPx(offsets[0], bounds[direction.d]);
      globalOffset = _offsetToPx(offsets[1] || "0", scrollerSize);
      value = bounds[direction.p] - scrollerBounds[direction.p] - borderWidth + localOffset + scroll - globalOffset;
      markerScroller && _positionMarker(markerScroller, globalOffset, direction, scrollerSize - globalOffset < 20 || markerScroller._isStart && globalOffset > 20);
      scrollerSize -= scrollerSize - globalOffset;
    } else {
      containerAnimation && (value = gsap3.utils.mapRange(containerAnimation.scrollTrigger.start, containerAnimation.scrollTrigger.end, 0, scrollerMax, value));
      markerScroller && _positionMarker(markerScroller, scrollerSize, direction, true);
    }
    if (marker) {
      var position = value + scrollerSize, isStart = marker._isStart;
      p1 = "scroll" + direction.d2;
      _positionMarker(marker, position, direction, isStart && position > 20 || !isStart && (useFixedPosition ? Math.max(_body2[p1], _docEl2[p1]) : marker.parentNode[p1]) <= position + 1);
      if (useFixedPosition) {
        scrollerBounds = _getBounds(markerScroller);
        useFixedPosition && (marker.style[direction.op.p] = scrollerBounds[direction.op.p] - direction.op.m - marker._offset + _px);
      }
    }
    if (containerAnimation && element) {
      p1 = _getBounds(element);
      containerAnimation.seek(scrollerMax);
      p2 = _getBounds(element);
      containerAnimation._caScrollDist = p1[direction.p] - p2[direction.p];
      value = value / containerAnimation._caScrollDist * scrollerMax;
    }
    containerAnimation && containerAnimation.seek(time);
    return containerAnimation ? value : Math.round(value);
  };
  var _prefixExp = /(webkit|moz|length|cssText|inset)/i;
  var _reparent = function _reparent2(element, parent, top, left) {
    if (element.parentNode !== parent) {
      var style = element.style, p, cs;
      if (parent === _body2) {
        element._stOrig = style.cssText;
        cs = _getComputedStyle(element);
        for (p in cs) {
          if (!+p && !_prefixExp.test(p) && cs[p] && typeof style[p] === "string" && p !== "0") {
            style[p] = cs[p];
          }
        }
        style.top = top;
        style.left = left;
      } else {
        style.cssText = element._stOrig;
      }
      gsap3.core.getCache(element).uncache = 1;
      parent.appendChild(element);
    }
  };
  var _interruptionTracker = function _interruptionTracker2(getValueFunc, initialValue, onInterrupt) {
    var last1 = initialValue, last2 = last1;
    return function(value) {
      var current = Math.round(getValueFunc());
      if (current !== last1 && current !== last2 && Math.abs(current - last1) > 3 && Math.abs(current - last2) > 3) {
        value = current;
        onInterrupt && onInterrupt();
      }
      last2 = last1;
      last1 = value;
      return value;
    };
  };
  var _getTweenCreator = function _getTweenCreator2(scroller, direction) {
    var getScroll = _getScrollFunc(scroller, direction), prop = "_scroll" + direction.p2, lastScroll1, lastScroll2, getTween = function getTween2(scrollTo, vars, initialValue, change1, change2) {
      var tween = getTween2.tween, onComplete = vars.onComplete, modifiers = {};
      initialValue = initialValue || getScroll();
      var checkForInterruption = _interruptionTracker(getScroll, initialValue, function() {
        tween.kill();
        getTween2.tween = 0;
      });
      change2 = change1 && change2 || 0;
      change1 = change1 || scrollTo - initialValue;
      tween && tween.kill();
      lastScroll1 = Math.round(initialValue);
      vars[prop] = scrollTo;
      vars.modifiers = modifiers;
      modifiers[prop] = function() {
        return checkForInterruption(initialValue + change1 * tween.ratio + change2 * tween.ratio * tween.ratio);
      };
      vars.onUpdate = function() {
        _scrollers.cache++;
        _updateAll();
      };
      vars.onComplete = function() {
        getTween2.tween = 0;
        onComplete && onComplete.call(tween);
      };
      tween = getTween2.tween = gsap3.to(scroller, vars);
      return tween;
    };
    scroller[prop] = getScroll;
    getScroll.wheelHandler = function() {
      return getTween.tween && getTween.tween.kill() && (getTween.tween = 0);
    };
    _addListener3(scroller, "wheel", getScroll.wheelHandler);
    ScrollTrigger2.isTouch && _addListener3(scroller, "touchmove", getScroll.wheelHandler);
    return getTween;
  };
  var ScrollTrigger2 = /* @__PURE__ */ function() {
    function ScrollTrigger3(vars, animation) {
      _coreInitted3 || ScrollTrigger3.register(gsap3) || console.warn("Please gsap.registerPlugin(ScrollTrigger)");
      this.init(vars, animation);
    }
    var _proto = ScrollTrigger3.prototype;
    _proto.init = function init4(vars, animation) {
      this.progress = this.start = 0;
      this.vars && this.kill(true, true);
      if (!_enabled) {
        this.update = this.refresh = this.kill = _passThrough3;
        return;
      }
      vars = _setDefaults3(_isString3(vars) || _isNumber3(vars) || vars.nodeType ? {
        trigger: vars
      } : vars, _defaults2);
      var _vars = vars, onUpdate = _vars.onUpdate, toggleClass = _vars.toggleClass, id = _vars.id, onToggle = _vars.onToggle, onRefresh = _vars.onRefresh, scrub = _vars.scrub, trigger = _vars.trigger, pin = _vars.pin, pinSpacing = _vars.pinSpacing, invalidateOnRefresh = _vars.invalidateOnRefresh, anticipatePin = _vars.anticipatePin, onScrubComplete = _vars.onScrubComplete, onSnapComplete = _vars.onSnapComplete, once = _vars.once, snap3 = _vars.snap, pinReparent = _vars.pinReparent, pinSpacer = _vars.pinSpacer, containerAnimation = _vars.containerAnimation, fastScrollEnd = _vars.fastScrollEnd, preventOverlaps = _vars.preventOverlaps, direction = vars.horizontal || vars.containerAnimation && vars.horizontal !== false ? _horizontal : _vertical, isToggle = !scrub && scrub !== 0, scroller = _getTarget(vars.scroller || _win4), scrollerCache = gsap3.core.getCache(scroller), isViewport = _isViewport3(scroller), useFixedPosition = ("pinType" in vars ? vars.pinType : _getProxyProp(scroller, "pinType") || isViewport && "fixed") === "fixed", callbacks = [vars.onEnter, vars.onLeave, vars.onEnterBack, vars.onLeaveBack], toggleActions = isToggle && vars.toggleActions.split(" "), markers = "markers" in vars ? vars.markers : _defaults2.markers, borderWidth = isViewport ? 0 : parseFloat(_getComputedStyle(scroller)["border" + direction.p2 + _Width]) || 0, self = this, onRefreshInit = vars.onRefreshInit && function() {
        return vars.onRefreshInit(self);
      }, getScrollerSize = _getSizeFunc(scroller, isViewport, direction), getScrollerOffsets = _getOffsetsFunc(scroller, isViewport), lastSnap = 0, lastRefresh = 0, scrollFunc = _getScrollFunc(scroller, direction), tweenTo, pinCache, snapFunc, scroll1, scroll2, start, end, markerStart, markerEnd, markerStartTrigger, markerEndTrigger, markerVars, change, pinOriginalState, pinActiveState, pinState, spacer, offset, pinGetter, pinSetter, pinStart, pinChange, spacingStart, spacerState, markerStartSetter, pinMoves, markerEndSetter, cs, snap1, snap22, scrubTween, scrubSmooth, snapDurClamp, snapDelayedCall, prevProgress, prevScroll, prevAnimProgress, caMarkerSetter, customRevertReturn;
      _context3(self);
      self._dir = direction;
      anticipatePin *= 45;
      self.scroller = scroller;
      self.scroll = containerAnimation ? containerAnimation.time.bind(containerAnimation) : scrollFunc;
      scroll1 = scrollFunc();
      self.vars = vars;
      animation = animation || vars.animation;
      if ("refreshPriority" in vars) {
        _sort = 1;
        vars.refreshPriority === -9999 && (_primary = self);
      }
      scrollerCache.tweenScroll = scrollerCache.tweenScroll || {
        top: _getTweenCreator(scroller, _vertical),
        left: _getTweenCreator(scroller, _horizontal)
      };
      self.tweenTo = tweenTo = scrollerCache.tweenScroll[direction.p];
      self.scrubDuration = function(value) {
        scrubSmooth = _isNumber3(value) && value;
        if (!scrubSmooth) {
          scrubTween && scrubTween.progress(1).kill();
          scrubTween = 0;
        } else {
          scrubTween ? scrubTween.duration(value) : scrubTween = gsap3.to(animation, {
            ease: "expo",
            totalProgress: "+=0.001",
            duration: scrubSmooth,
            paused: true,
            onComplete: function onComplete() {
              return onScrubComplete && onScrubComplete(self);
            }
          });
        }
      };
      if (animation) {
        animation.vars.lazy = false;
        animation._initted || animation.vars.immediateRender !== false && vars.immediateRender !== false && animation.duration() && animation.render(0, true, true);
        self.animation = animation.pause();
        animation.scrollTrigger = self;
        self.scrubDuration(scrub);
        scrubTween && scrubTween.resetTo && scrubTween.resetTo("totalProgress", 0);
        snap1 = 0;
        id || (id = animation.vars.id);
      }
      _triggers.push(self);
      if (snap3) {
        if (!_isObject3(snap3) || snap3.push) {
          snap3 = {
            snapTo: snap3
          };
        }
        "scrollBehavior" in _body2.style && gsap3.set(isViewport ? [_body2, _docEl2] : scroller, {
          scrollBehavior: "auto"
        });
        _scrollers.forEach(function(o2) {
          return _isFunction3(o2) && o2.target === (isViewport ? _doc4.scrollingElement || _docEl2 : scroller) && (o2.smooth = false);
        });
        snapFunc = _isFunction3(snap3.snapTo) ? snap3.snapTo : snap3.snapTo === "labels" ? _getClosestLabel(animation) : snap3.snapTo === "labelsDirectional" ? _getLabelAtDirection(animation) : snap3.directional !== false ? function(value, st) {
          return _snapDirectional(snap3.snapTo)(value, _getTime2() - lastRefresh < 500 ? 0 : st.direction);
        } : gsap3.utils.snap(snap3.snapTo);
        snapDurClamp = snap3.duration || {
          min: 0.1,
          max: 2
        };
        snapDurClamp = _isObject3(snapDurClamp) ? _clamp4(snapDurClamp.min, snapDurClamp.max) : _clamp4(snapDurClamp, snapDurClamp);
        snapDelayedCall = gsap3.delayedCall(snap3.delay || scrubSmooth / 2 || 0.1, function() {
          var scroll = scrollFunc(), refreshedRecently = _getTime2() - lastRefresh < 500, tween = tweenTo.tween;
          if ((refreshedRecently || Math.abs(self.getVelocity()) < 10) && !tween && !_pointerIsDown && lastSnap !== scroll) {
            var progress = (scroll - start) / change, totalProgress = animation && !isToggle ? animation.totalProgress() : progress, velocity = refreshedRecently ? 0 : (totalProgress - snap22) / (_getTime2() - _time2) * 1e3 || 0, change1 = gsap3.utils.clamp(-progress, 1 - progress, _abs(velocity / 2) * velocity / 0.185), naturalEnd = progress + (snap3.inertia === false ? 0 : change1), endValue = _clamp4(0, 1, snapFunc(naturalEnd, self)), endScroll = Math.round(start + endValue * change), _snap = snap3, onStart = _snap.onStart, _onInterrupt = _snap.onInterrupt, _onComplete = _snap.onComplete;
            if (scroll <= end && scroll >= start && endScroll !== scroll) {
              if (tween && !tween._initted && tween.data <= _abs(endScroll - scroll)) {
                return;
              }
              if (snap3.inertia === false) {
                change1 = endValue - progress;
              }
              tweenTo(endScroll, {
                duration: snapDurClamp(_abs(Math.max(_abs(naturalEnd - totalProgress), _abs(endValue - totalProgress)) * 0.185 / velocity / 0.05 || 0)),
                ease: snap3.ease || "power3",
                data: _abs(endScroll - scroll),
                // record the distance so that if another snap tween occurs (conflict) we can prioritize the closest snap.
                onInterrupt: function onInterrupt() {
                  return snapDelayedCall.restart(true) && _onInterrupt && _onInterrupt(self);
                },
                onComplete: function onComplete() {
                  self.update();
                  lastSnap = scrollFunc();
                  snap1 = snap22 = animation && !isToggle ? animation.totalProgress() : self.progress;
                  onSnapComplete && onSnapComplete(self);
                  _onComplete && _onComplete(self);
                }
              }, scroll, change1 * change, endScroll - scroll - change1 * change);
              onStart && onStart(self, tweenTo.tween);
            }
          } else if (self.isActive && lastSnap !== scroll) {
            snapDelayedCall.restart(true);
          }
        }).pause();
      }
      id && (_ids[id] = self);
      trigger = self.trigger = _getTarget(trigger || pin);
      customRevertReturn = trigger && trigger._gsap && trigger._gsap.stRevert;
      customRevertReturn && (customRevertReturn = customRevertReturn(self));
      pin = pin === true ? trigger : _getTarget(pin);
      _isString3(toggleClass) && (toggleClass = {
        targets: trigger,
        className: toggleClass
      });
      if (pin) {
        pinSpacing === false || pinSpacing === _margin || (pinSpacing = !pinSpacing && pin.parentNode && pin.parentNode.style && _getComputedStyle(pin.parentNode).display === "flex" ? false : _padding);
        self.pin = pin;
        pinCache = gsap3.core.getCache(pin);
        if (!pinCache.spacer) {
          if (pinSpacer) {
            pinSpacer = _getTarget(pinSpacer);
            pinSpacer && !pinSpacer.nodeType && (pinSpacer = pinSpacer.current || pinSpacer.nativeElement);
            pinCache.spacerIsNative = !!pinSpacer;
            pinSpacer && (pinCache.spacerState = _getState(pinSpacer));
          }
          pinCache.spacer = spacer = pinSpacer || _doc4.createElement("div");
          spacer.classList.add("pin-spacer");
          id && spacer.classList.add("pin-spacer-" + id);
          pinCache.pinState = pinOriginalState = _getState(pin);
        } else {
          pinOriginalState = pinCache.pinState;
        }
        vars.force3D !== false && gsap3.set(pin, {
          force3D: true
        });
        self.spacer = spacer = pinCache.spacer;
        cs = _getComputedStyle(pin);
        spacingStart = cs[pinSpacing + direction.os2];
        pinGetter = gsap3.getProperty(pin);
        pinSetter = gsap3.quickSetter(pin, direction.a, _px);
        _swapPinIn(pin, spacer, cs);
        pinState = _getState(pin);
      }
      if (markers) {
        markerVars = _isObject3(markers) ? _setDefaults3(markers, _markerDefaults) : _markerDefaults;
        markerStartTrigger = _createMarker("scroller-start", id, scroller, direction, markerVars, 0);
        markerEndTrigger = _createMarker("scroller-end", id, scroller, direction, markerVars, 0, markerStartTrigger);
        offset = markerStartTrigger["offset" + direction.op.d2];
        var content = _getTarget(_getProxyProp(scroller, "content") || scroller);
        markerStart = this.markerStart = _createMarker("start", id, content, direction, markerVars, offset, 0, containerAnimation);
        markerEnd = this.markerEnd = _createMarker("end", id, content, direction, markerVars, offset, 0, containerAnimation);
        containerAnimation && (caMarkerSetter = gsap3.quickSetter([markerStart, markerEnd], direction.a, _px));
        if (!useFixedPosition && !(_proxies.length && _getProxyProp(scroller, "fixedMarkers") === true)) {
          _makePositionable(isViewport ? _body2 : scroller);
          gsap3.set([markerStartTrigger, markerEndTrigger], {
            force3D: true
          });
          markerStartSetter = gsap3.quickSetter(markerStartTrigger, direction.a, _px);
          markerEndSetter = gsap3.quickSetter(markerEndTrigger, direction.a, _px);
        }
      }
      if (containerAnimation) {
        var oldOnUpdate = containerAnimation.vars.onUpdate, oldParams = containerAnimation.vars.onUpdateParams;
        containerAnimation.eventCallback("onUpdate", function() {
          self.update(0, 0, 1);
          oldOnUpdate && oldOnUpdate.apply(containerAnimation, oldParams || []);
        });
      }
      self.previous = function() {
        return _triggers[_triggers.indexOf(self) - 1];
      };
      self.next = function() {
        return _triggers[_triggers.indexOf(self) + 1];
      };
      self.revert = function(revert, temp) {
        if (!temp) {
          return self.kill(true);
        }
        var r2 = revert !== false || !self.enabled, prevRefreshing = _refreshing;
        if (r2 !== self.isReverted) {
          if (r2) {
            prevScroll = Math.max(scrollFunc(), self.scroll.rec || 0);
            prevProgress = self.progress;
            prevAnimProgress = animation && animation.progress();
          }
          markerStart && [markerStart, markerEnd, markerStartTrigger, markerEndTrigger].forEach(function(m) {
            return m.style.display = r2 ? "none" : "block";
          });
          if (r2) {
            _refreshing = self;
            self.update(r2);
          }
          if (pin && (!pinReparent || !self.isActive)) {
            if (r2) {
              _swapPinOut(pin, spacer, pinOriginalState);
            } else {
              _swapPinIn(pin, spacer, _getComputedStyle(pin), spacerState);
            }
          }
          r2 || self.update(r2);
          _refreshing = prevRefreshing;
          self.isReverted = r2;
        }
      };
      self.refresh = function(soft, force) {
        if ((_refreshing || !self.enabled) && !force) {
          return;
        }
        if (pin && soft && _lastScrollTime) {
          _addListener3(ScrollTrigger3, "scrollEnd", _softRefresh);
          return;
        }
        !_refreshingAll && onRefreshInit && onRefreshInit(self);
        _refreshing = self;
        lastRefresh = _getTime2();
        if (tweenTo.tween) {
          tweenTo.tween.kill();
          tweenTo.tween = 0;
        }
        scrubTween && scrubTween.pause();
        invalidateOnRefresh && animation && animation.revert({
          kill: false
        }).invalidate();
        self.isReverted || self.revert(true, true);
        self._subPinOffset = false;
        var size = getScrollerSize(), scrollerBounds = getScrollerOffsets(), max = containerAnimation ? containerAnimation.duration() : _maxScroll(scroller, direction), isFirstRefresh = change <= 0.01, offset2 = 0, otherPinOffset = 0, parsedEnd = vars.end, parsedEndTrigger = vars.endTrigger || trigger, parsedStart = vars.start || (vars.start === 0 || !trigger ? 0 : pin ? "0 0" : "0 100%"), pinnedContainer = self.pinnedContainer = vars.pinnedContainer && _getTarget(vars.pinnedContainer), triggerIndex = trigger && Math.max(0, _triggers.indexOf(self)) || 0, i2 = triggerIndex, cs2, bounds, scroll, isVertical, override, curTrigger, curPin, oppositeScroll, initted, revertedPins, forcedOverflow;
        while (i2--) {
          curTrigger = _triggers[i2];
          curTrigger.end || curTrigger.refresh(0, 1) || (_refreshing = self);
          curPin = curTrigger.pin;
          if (curPin && (curPin === trigger || curPin === pin || curPin === pinnedContainer) && !curTrigger.isReverted) {
            revertedPins || (revertedPins = []);
            revertedPins.unshift(curTrigger);
            curTrigger.revert(true, true);
          }
          if (curTrigger !== _triggers[i2]) {
            triggerIndex--;
            i2--;
          }
        }
        _isFunction3(parsedStart) && (parsedStart = parsedStart(self));
        start = _parsePosition3(parsedStart, trigger, size, direction, scrollFunc(), markerStart, markerStartTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation) || (pin ? -1e-3 : 0);
        _isFunction3(parsedEnd) && (parsedEnd = parsedEnd(self));
        if (_isString3(parsedEnd) && !parsedEnd.indexOf("+=")) {
          if (~parsedEnd.indexOf(" ")) {
            parsedEnd = (_isString3(parsedStart) ? parsedStart.split(" ")[0] : "") + parsedEnd;
          } else {
            offset2 = _offsetToPx(parsedEnd.substr(2), size);
            parsedEnd = _isString3(parsedStart) ? parsedStart : (containerAnimation ? gsap3.utils.mapRange(0, containerAnimation.duration(), containerAnimation.scrollTrigger.start, containerAnimation.scrollTrigger.end, start) : start) + offset2;
            parsedEndTrigger = trigger;
          }
        }
        end = Math.max(start, _parsePosition3(parsedEnd || (parsedEndTrigger ? "100% 0" : max), parsedEndTrigger, size, direction, scrollFunc() + offset2, markerEnd, markerEndTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation)) || -1e-3;
        change = end - start || (start -= 0.01) && 1e-3;
        offset2 = 0;
        i2 = triggerIndex;
        while (i2--) {
          curTrigger = _triggers[i2];
          curPin = curTrigger.pin;
          if (curPin && curTrigger.start - curTrigger._pinPush <= start && !containerAnimation && curTrigger.end > 0) {
            cs2 = curTrigger.end - curTrigger.start;
            if ((curPin === trigger && curTrigger.start - curTrigger._pinPush < start || curPin === pinnedContainer) && !_isNumber3(parsedStart)) {
              offset2 += cs2 * (1 - curTrigger.progress);
            }
            curPin === pin && (otherPinOffset += cs2);
          }
        }
        start += offset2;
        end += offset2;
        if (isFirstRefresh) {
          prevProgress = gsap3.utils.clamp(0, 1, gsap3.utils.normalize(start, end, prevScroll));
        }
        self._pinPush = otherPinOffset;
        if (markerStart && offset2) {
          cs2 = {};
          cs2[direction.a] = "+=" + offset2;
          pinnedContainer && (cs2[direction.p] = "-=" + scrollFunc());
          gsap3.set([markerStart, markerEnd], cs2);
        }
        if (pin) {
          cs2 = _getComputedStyle(pin);
          isVertical = direction === _vertical;
          scroll = scrollFunc();
          pinStart = parseFloat(pinGetter(direction.a)) + otherPinOffset;
          if (!max && end > 1) {
            forcedOverflow = (isViewport ? _doc4.scrollingElement || _docEl2 : scroller).style;
            forcedOverflow = {
              style: forcedOverflow,
              value: forcedOverflow["overflow" + direction.a.toUpperCase()]
            };
            forcedOverflow.style["overflow" + direction.a.toUpperCase()] = "scroll";
          }
          _swapPinIn(pin, spacer, cs2);
          pinState = _getState(pin);
          bounds = _getBounds(pin, true);
          oppositeScroll = useFixedPosition && _getScrollFunc(scroller, isVertical ? _horizontal : _vertical)();
          if (pinSpacing) {
            spacerState = [pinSpacing + direction.os2, change + otherPinOffset + _px];
            spacerState.t = spacer;
            i2 = pinSpacing === _padding ? _getSize(pin, direction) + change + otherPinOffset : 0;
            i2 && spacerState.push(direction.d, i2 + _px);
            _setState(spacerState);
            if (pinnedContainer) {
              _triggers.forEach(function(t2) {
                if (t2.pin === pinnedContainer && t2.vars.pinSpacing !== false) {
                  t2._subPinOffset = true;
                }
              });
            }
            useFixedPosition && scrollFunc(prevScroll);
          }
          if (useFixedPosition) {
            override = {
              top: bounds.top + (isVertical ? scroll - start : oppositeScroll) + _px,
              left: bounds.left + (isVertical ? oppositeScroll : scroll - start) + _px,
              boxSizing: "border-box",
              position: "fixed"
            };
            override[_width] = override["max" + _Width] = Math.ceil(bounds.width) + _px;
            override[_height] = override["max" + _Height] = Math.ceil(bounds.height) + _px;
            override[_margin] = override[_margin + _Top] = override[_margin + _Right] = override[_margin + _Bottom] = override[_margin + _Left] = "0";
            override[_padding] = cs2[_padding];
            override[_padding + _Top] = cs2[_padding + _Top];
            override[_padding + _Right] = cs2[_padding + _Right];
            override[_padding + _Bottom] = cs2[_padding + _Bottom];
            override[_padding + _Left] = cs2[_padding + _Left];
            pinActiveState = _copyState(pinOriginalState, override, pinReparent);
            _refreshingAll && scrollFunc(0);
          }
          if (animation) {
            initted = animation._initted;
            _suppressOverwrites2(1);
            animation.render(animation.duration(), true, true);
            pinChange = pinGetter(direction.a) - pinStart + change + otherPinOffset;
            pinMoves = Math.abs(change - pinChange) > 1;
            useFixedPosition && pinMoves && pinActiveState.splice(pinActiveState.length - 2, 2);
            animation.render(0, true, true);
            initted || animation.invalidate(true);
            animation.parent || animation.totalTime(animation.totalTime());
            _suppressOverwrites2(0);
          } else {
            pinChange = change;
          }
          forcedOverflow && (forcedOverflow.value ? forcedOverflow.style["overflow" + direction.a.toUpperCase()] = forcedOverflow.value : forcedOverflow.style.removeProperty("overflow-" + direction.a));
        } else if (trigger && scrollFunc() && !containerAnimation) {
          bounds = trigger.parentNode;
          while (bounds && bounds !== _body2) {
            if (bounds._pinOffset) {
              start -= bounds._pinOffset;
              end -= bounds._pinOffset;
            }
            bounds = bounds.parentNode;
          }
        }
        revertedPins && revertedPins.forEach(function(t2) {
          return t2.revert(false, true);
        });
        self.start = start;
        self.end = end;
        scroll1 = scroll2 = _refreshingAll ? prevScroll : scrollFunc();
        if (!containerAnimation && !_refreshingAll) {
          scroll1 < prevScroll && scrollFunc(prevScroll);
          self.scroll.rec = 0;
        }
        self.revert(false, true);
        if (snapDelayedCall) {
          lastSnap = -1;
          self.isActive && scrollFunc(start + change * prevProgress);
          snapDelayedCall.restart(true);
        }
        _refreshing = 0;
        animation && isToggle && (animation._initted || prevAnimProgress) && animation.progress() !== prevAnimProgress && animation.progress(prevAnimProgress, true).render(animation.time(), true, true);
        if (isFirstRefresh || prevProgress !== self.progress || containerAnimation) {
          animation && !isToggle && animation.totalProgress(containerAnimation && start < -1e-3 && !prevProgress ? gsap3.utils.normalize(start, end, 0) : prevProgress, true);
          self.progress = (scroll1 - start) / change === prevProgress ? 0 : prevProgress;
        }
        pin && pinSpacing && (spacer._pinOffset = Math.round(self.progress * pinChange));
        scrubTween && scrubTween.invalidate();
        onRefresh && !_refreshingAll && onRefresh(self);
      };
      self.getVelocity = function() {
        return (scrollFunc() - scroll2) / (_getTime2() - _time2) * 1e3 || 0;
      };
      self.endAnimation = function() {
        _endAnimation(self.callbackAnimation);
        if (animation) {
          scrubTween ? scrubTween.progress(1) : !animation.paused() ? _endAnimation(animation, animation.reversed()) : isToggle || _endAnimation(animation, self.direction < 0, 1);
        }
      };
      self.labelToScroll = function(label) {
        return animation && animation.labels && (start || self.refresh() || start) + animation.labels[label] / animation.duration() * change || 0;
      };
      self.getTrailing = function(name) {
        var i2 = _triggers.indexOf(self), a = self.direction > 0 ? _triggers.slice(0, i2).reverse() : _triggers.slice(i2 + 1);
        return (_isString3(name) ? a.filter(function(t2) {
          return t2.vars.preventOverlaps === name;
        }) : a).filter(function(t2) {
          return self.direction > 0 ? t2.end <= start : t2.start >= end;
        });
      };
      self.update = function(reset, recordVelocity, forceFake) {
        if (containerAnimation && !forceFake && !reset) {
          return;
        }
        var scroll = _refreshingAll === true ? prevScroll : self.scroll(), p = reset ? 0 : (scroll - start) / change, clipped = p < 0 ? 0 : p > 1 ? 1 : p || 0, prevProgress2 = self.progress, isActive, wasActive, toggleState, action, stateChanged, toggled, isAtMax, isTakingAction;
        if (recordVelocity) {
          scroll2 = scroll1;
          scroll1 = containerAnimation ? scrollFunc() : scroll;
          if (snap3) {
            snap22 = snap1;
            snap1 = animation && !isToggle ? animation.totalProgress() : clipped;
          }
        }
        anticipatePin && !clipped && pin && !_refreshing && !_startup2 && _lastScrollTime && start < scroll + (scroll - scroll2) / (_getTime2() - _time2) * anticipatePin && (clipped = 1e-4);
        if (clipped !== prevProgress2 && self.enabled) {
          isActive = self.isActive = !!clipped && clipped < 1;
          wasActive = !!prevProgress2 && prevProgress2 < 1;
          toggled = isActive !== wasActive;
          stateChanged = toggled || !!clipped !== !!prevProgress2;
          self.direction = clipped > prevProgress2 ? 1 : -1;
          self.progress = clipped;
          if (stateChanged && !_refreshing) {
            toggleState = clipped && !prevProgress2 ? 0 : clipped === 1 ? 1 : prevProgress2 === 1 ? 2 : 3;
            if (isToggle) {
              action = !toggled && toggleActions[toggleState + 1] !== "none" && toggleActions[toggleState + 1] || toggleActions[toggleState];
              isTakingAction = animation && (action === "complete" || action === "reset" || action in animation);
            }
          }
          preventOverlaps && (toggled || isTakingAction) && (isTakingAction || scrub || !animation) && (_isFunction3(preventOverlaps) ? preventOverlaps(self) : self.getTrailing(preventOverlaps).forEach(function(t2) {
            return t2.endAnimation();
          }));
          if (!isToggle) {
            if (scrubTween && !_refreshing && !_startup2) {
              scrubTween._dp._time - scrubTween._start !== scrubTween._time && scrubTween.render(scrubTween._dp._time - scrubTween._start);
              if (scrubTween.resetTo) {
                scrubTween.resetTo("totalProgress", clipped, animation._tTime / animation._tDur);
              } else {
                scrubTween.vars.totalProgress = clipped;
                scrubTween.invalidate().restart();
              }
            } else if (animation) {
              animation.totalProgress(clipped, !!_refreshing);
            }
          }
          if (pin) {
            reset && pinSpacing && (spacer.style[pinSpacing + direction.os2] = spacingStart);
            if (!useFixedPosition) {
              pinSetter(_round3(pinStart + pinChange * clipped));
            } else if (stateChanged) {
              isAtMax = !reset && clipped > prevProgress2 && end + 1 > scroll && scroll + 1 >= _maxScroll(scroller, direction);
              if (pinReparent) {
                if (!reset && (isActive || isAtMax)) {
                  var bounds = _getBounds(pin, true), _offset = scroll - start;
                  _reparent(pin, _body2, bounds.top + (direction === _vertical ? _offset : 0) + _px, bounds.left + (direction === _vertical ? 0 : _offset) + _px);
                } else {
                  _reparent(pin, spacer);
                }
              }
              _setState(isActive || isAtMax ? pinActiveState : pinState);
              pinMoves && clipped < 1 && isActive || pinSetter(pinStart + (clipped === 1 && !isAtMax ? pinChange : 0));
            }
          }
          snap3 && !tweenTo.tween && !_refreshing && !_startup2 && snapDelayedCall.restart(true);
          toggleClass && (toggled || once && clipped && (clipped < 1 || !_limitCallbacks)) && _toArray(toggleClass.targets).forEach(function(el) {
            return el.classList[isActive || once ? "add" : "remove"](toggleClass.className);
          });
          onUpdate && !isToggle && !reset && onUpdate(self);
          if (stateChanged && !_refreshing) {
            if (isToggle) {
              if (isTakingAction) {
                if (action === "complete") {
                  animation.pause().totalProgress(1);
                } else if (action === "reset") {
                  animation.restart(true).pause();
                } else if (action === "restart") {
                  animation.restart(true);
                } else {
                  animation[action]();
                }
              }
              onUpdate && onUpdate(self);
            }
            if (toggled || !_limitCallbacks) {
              onToggle && toggled && _callback3(self, onToggle);
              callbacks[toggleState] && _callback3(self, callbacks[toggleState]);
              once && (clipped === 1 ? self.kill(false, 1) : callbacks[toggleState] = 0);
              if (!toggled) {
                toggleState = clipped === 1 ? 1 : 3;
                callbacks[toggleState] && _callback3(self, callbacks[toggleState]);
              }
            }
            if (fastScrollEnd && !isActive && Math.abs(self.getVelocity()) > (_isNumber3(fastScrollEnd) ? fastScrollEnd : 2500)) {
              _endAnimation(self.callbackAnimation);
              scrubTween ? scrubTween.progress(1) : _endAnimation(animation, action === "reverse" ? 1 : !clipped, 1);
            }
          } else if (isToggle && onUpdate && !_refreshing) {
            onUpdate(self);
          }
        }
        if (markerEndSetter) {
          var n2 = containerAnimation ? scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0) : scroll;
          markerStartSetter(n2 + (markerStartTrigger._isFlipped ? 1 : 0));
          markerEndSetter(n2);
        }
        caMarkerSetter && caMarkerSetter(-scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0));
      };
      self.enable = function(reset, refresh) {
        if (!self.enabled) {
          self.enabled = true;
          _addListener3(scroller, "resize", _onResize);
          _addListener3(isViewport ? _doc4 : scroller, "scroll", _onScroll3);
          onRefreshInit && _addListener3(ScrollTrigger3, "refreshInit", onRefreshInit);
          if (reset !== false) {
            self.progress = prevProgress = 0;
            scroll1 = scroll2 = lastSnap = scrollFunc();
          }
          refresh !== false && self.refresh();
        }
      };
      self.getTween = function(snap4) {
        return snap4 && tweenTo ? tweenTo.tween : scrubTween;
      };
      self.setPositions = function(newStart, newEnd) {
        if (pin) {
          pinStart += newStart - start;
          pinChange += newEnd - newStart - change;
          pinSpacing === _padding && self.adjustPinSpacing(newEnd - newStart - change);
        }
        self.start = start = newStart;
        self.end = end = newEnd;
        change = newEnd - newStart;
        self.update();
      };
      self.adjustPinSpacing = function(amount) {
        if (spacerState && amount) {
          var i2 = spacerState.indexOf(direction.d) + 1;
          spacerState[i2] = parseFloat(spacerState[i2]) + amount + _px;
          spacerState[1] = parseFloat(spacerState[1]) + amount + _px;
          _setState(spacerState);
        }
      };
      self.disable = function(reset, allowAnimation) {
        if (self.enabled) {
          reset !== false && self.revert(true, true);
          self.enabled = self.isActive = false;
          allowAnimation || scrubTween && scrubTween.pause();
          prevScroll = 0;
          pinCache && (pinCache.uncache = 1);
          onRefreshInit && _removeListener3(ScrollTrigger3, "refreshInit", onRefreshInit);
          if (snapDelayedCall) {
            snapDelayedCall.pause();
            tweenTo.tween && tweenTo.tween.kill() && (tweenTo.tween = 0);
          }
          if (!isViewport) {
            var i2 = _triggers.length;
            while (i2--) {
              if (_triggers[i2].scroller === scroller && _triggers[i2] !== self) {
                return;
              }
            }
            _removeListener3(scroller, "resize", _onResize);
            _removeListener3(scroller, "scroll", _onScroll3);
          }
        }
      };
      self.kill = function(revert, allowAnimation) {
        self.disable(revert, allowAnimation);
        scrubTween && !allowAnimation && scrubTween.kill();
        id && delete _ids[id];
        var i2 = _triggers.indexOf(self);
        i2 >= 0 && _triggers.splice(i2, 1);
        i2 === _i && _direction > 0 && _i--;
        i2 = 0;
        _triggers.forEach(function(t2) {
          return t2.scroller === self.scroller && (i2 = 1);
        });
        i2 || _refreshingAll || (self.scroll.rec = 0);
        if (animation) {
          animation.scrollTrigger = null;
          revert && animation.revert({
            kill: false
          });
          allowAnimation || animation.kill();
        }
        markerStart && [markerStart, markerEnd, markerStartTrigger, markerEndTrigger].forEach(function(m) {
          return m.parentNode && m.parentNode.removeChild(m);
        });
        _primary === self && (_primary = 0);
        if (pin) {
          pinCache && (pinCache.uncache = 1);
          i2 = 0;
          _triggers.forEach(function(t2) {
            return t2.pin === pin && i2++;
          });
          i2 || (pinCache.spacer = 0);
        }
        vars.onKill && vars.onKill(self);
      };
      self.enable(false, false);
      customRevertReturn && customRevertReturn(self);
      !animation || !animation.add || change ? self.refresh() : gsap3.delayedCall(0.01, function() {
        return start || end || self.refresh();
      }) && (change = 0.01) && (start = end = 0);
      pin && _queueRefreshAll();
    };
    ScrollTrigger3.register = function register(core) {
      if (!_coreInitted3) {
        gsap3 = core || _getGSAP3();
        _windowExists5() && window.document && ScrollTrigger3.enable();
        _coreInitted3 = _enabled;
      }
      return _coreInitted3;
    };
    ScrollTrigger3.defaults = function defaults2(config3) {
      if (config3) {
        for (var p in config3) {
          _defaults2[p] = config3[p];
        }
      }
      return _defaults2;
    };
    ScrollTrigger3.disable = function disable(reset, kill) {
      _enabled = 0;
      _triggers.forEach(function(trigger) {
        return trigger[kill ? "kill" : "disable"](reset);
      });
      _removeListener3(_win4, "wheel", _onScroll3);
      _removeListener3(_doc4, "scroll", _onScroll3);
      clearInterval(_syncInterval);
      _removeListener3(_doc4, "touchcancel", _passThrough3);
      _removeListener3(_body2, "touchstart", _passThrough3);
      _multiListener(_removeListener3, _doc4, "pointerdown,touchstart,mousedown", _pointerDownHandler);
      _multiListener(_removeListener3, _doc4, "pointerup,touchend,mouseup", _pointerUpHandler);
      _resizeDelay.kill();
      _iterateAutoRefresh(_removeListener3);
      for (var i2 = 0; i2 < _scrollers.length; i2 += 3) {
        _wheelListener(_removeListener3, _scrollers[i2], _scrollers[i2 + 1]);
        _wheelListener(_removeListener3, _scrollers[i2], _scrollers[i2 + 2]);
      }
    };
    ScrollTrigger3.enable = function enable() {
      _win4 = window;
      _doc4 = document;
      _docEl2 = _doc4.documentElement;
      _body2 = _doc4.body;
      if (gsap3) {
        _toArray = gsap3.utils.toArray;
        _clamp4 = gsap3.utils.clamp;
        _context3 = gsap3.core.context || _passThrough3;
        _suppressOverwrites2 = gsap3.core.suppressOverwrites || _passThrough3;
        _scrollRestoration = _win4.history.scrollRestoration || "auto";
        _lastScroll = _win4.pageYOffset;
        gsap3.core.globals("ScrollTrigger", ScrollTrigger3);
        if (_body2) {
          _enabled = 1;
          _rafBugFix();
          Observer.register(gsap3);
          ScrollTrigger3.isTouch = Observer.isTouch;
          _fixIOSBug = Observer.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent);
          _addListener3(_win4, "wheel", _onScroll3);
          _root2 = [_win4, _doc4, _docEl2, _body2];
          if (gsap3.matchMedia) {
            ScrollTrigger3.matchMedia = function(vars) {
              var mm = gsap3.matchMedia(), p;
              for (p in vars) {
                mm.add(p, vars[p]);
              }
              return mm;
            };
            gsap3.addEventListener("matchMediaInit", function() {
              return _revertAll();
            });
            gsap3.addEventListener("matchMediaRevert", function() {
              return _revertRecorded();
            });
            gsap3.addEventListener("matchMedia", function() {
              _refreshAll(0, 1);
              _dispatch3("matchMedia");
            });
            gsap3.matchMedia("(orientation: portrait)", function() {
              _setBaseDimensions();
              return _setBaseDimensions;
            });
          } else {
            console.warn("Requires GSAP 3.11.0 or later");
          }
          _setBaseDimensions();
          _addListener3(_doc4, "scroll", _onScroll3);
          var bodyStyle = _body2.style, border = bodyStyle.borderTopStyle, AnimationProto = gsap3.core.Animation.prototype, bounds, i2;
          AnimationProto.revert || Object.defineProperty(AnimationProto, "revert", {
            value: function value() {
              return this.time(-0.01, true);
            }
          });
          bodyStyle.borderTopStyle = "solid";
          bounds = _getBounds(_body2);
          _vertical.m = Math.round(bounds.top + _vertical.sc()) || 0;
          _horizontal.m = Math.round(bounds.left + _horizontal.sc()) || 0;
          border ? bodyStyle.borderTopStyle = border : bodyStyle.removeProperty("border-top-style");
          _syncInterval = setInterval(_sync, 250);
          gsap3.delayedCall(0.5, function() {
            return _startup2 = 0;
          });
          _addListener3(_doc4, "touchcancel", _passThrough3);
          _addListener3(_body2, "touchstart", _passThrough3);
          _multiListener(_addListener3, _doc4, "pointerdown,touchstart,mousedown", _pointerDownHandler);
          _multiListener(_addListener3, _doc4, "pointerup,touchend,mouseup", _pointerUpHandler);
          _transformProp2 = gsap3.utils.checkPrefix("transform");
          _stateProps.push(_transformProp2);
          _coreInitted3 = _getTime2();
          _resizeDelay = gsap3.delayedCall(0.2, _refreshAll).pause();
          _autoRefresh = [_doc4, "visibilitychange", function() {
            var w = _win4.innerWidth, h = _win4.innerHeight;
            if (_doc4.hidden) {
              _prevWidth = w;
              _prevHeight = h;
            } else if (_prevWidth !== w || _prevHeight !== h) {
              _onResize();
            }
          }, _doc4, "DOMContentLoaded", _refreshAll, _win4, "load", _refreshAll, _win4, "resize", _onResize];
          _iterateAutoRefresh(_addListener3);
          _triggers.forEach(function(trigger) {
            return trigger.enable(0, 1);
          });
          for (i2 = 0; i2 < _scrollers.length; i2 += 3) {
            _wheelListener(_removeListener3, _scrollers[i2], _scrollers[i2 + 1]);
            _wheelListener(_removeListener3, _scrollers[i2], _scrollers[i2 + 2]);
          }
        }
      }
    };
    ScrollTrigger3.config = function config3(vars) {
      "limitCallbacks" in vars && (_limitCallbacks = !!vars.limitCallbacks);
      var ms = vars.syncInterval;
      ms && clearInterval(_syncInterval) || (_syncInterval = ms) && setInterval(_sync, ms);
      "ignoreMobileResize" in vars && (_ignoreMobileResize = ScrollTrigger3.isTouch === 1 && vars.ignoreMobileResize);
      if ("autoRefreshEvents" in vars) {
        _iterateAutoRefresh(_removeListener3) || _iterateAutoRefresh(_addListener3, vars.autoRefreshEvents || "none");
        _ignoreResize = (vars.autoRefreshEvents + "").indexOf("resize") === -1;
      }
    };
    ScrollTrigger3.scrollerProxy = function scrollerProxy(target, vars) {
      var t2 = _getTarget(target), i2 = _scrollers.indexOf(t2), isViewport = _isViewport3(t2);
      if (~i2) {
        _scrollers.splice(i2, isViewport ? 6 : 2);
      }
      if (vars) {
        isViewport ? _proxies.unshift(_win4, vars, _body2, vars, _docEl2, vars) : _proxies.unshift(t2, vars);
      }
    };
    ScrollTrigger3.clearMatchMedia = function clearMatchMedia(query) {
      _triggers.forEach(function(t2) {
        return t2._ctx && t2._ctx.query === query && t2._ctx.kill(true, true);
      });
    };
    ScrollTrigger3.isInViewport = function isInViewport(element, ratio, horizontal) {
      var bounds = (_isString3(element) ? _getTarget(element) : element).getBoundingClientRect(), offset = bounds[horizontal ? _width : _height] * ratio || 0;
      return horizontal ? bounds.right - offset > 0 && bounds.left + offset < _win4.innerWidth : bounds.bottom - offset > 0 && bounds.top + offset < _win4.innerHeight;
    };
    ScrollTrigger3.positionInViewport = function positionInViewport(element, referencePoint, horizontal) {
      _isString3(element) && (element = _getTarget(element));
      var bounds = element.getBoundingClientRect(), size = bounds[horizontal ? _width : _height], offset = referencePoint == null ? size / 2 : referencePoint in _keywords ? _keywords[referencePoint] * size : ~referencePoint.indexOf("%") ? parseFloat(referencePoint) * size / 100 : parseFloat(referencePoint) || 0;
      return horizontal ? (bounds.left + offset) / _win4.innerWidth : (bounds.top + offset) / _win4.innerHeight;
    };
    ScrollTrigger3.killAll = function killAll(allowListeners) {
      _triggers.slice(0).forEach(function(t2) {
        return t2.vars.id !== "ScrollSmoother" && t2.kill();
      });
      if (allowListeners !== true) {
        var listeners = _listeners2.killAll || [];
        _listeners2 = {};
        listeners.forEach(function(f) {
          return f();
        });
      }
    };
    return ScrollTrigger3;
  }();
  ScrollTrigger2.version = "3.11.5";
  ScrollTrigger2.saveStyles = function(targets) {
    return targets ? _toArray(targets).forEach(function(target) {
      if (target && target.style) {
        var i2 = _savedStyles.indexOf(target);
        i2 >= 0 && _savedStyles.splice(i2, 5);
        _savedStyles.push(target, target.style.cssText, target.getBBox && target.getAttribute("transform"), gsap3.core.getCache(target), _context3());
      }
    }) : _savedStyles;
  };
  ScrollTrigger2.revert = function(soft, media) {
    return _revertAll(!soft, media);
  };
  ScrollTrigger2.create = function(vars, animation) {
    return new ScrollTrigger2(vars, animation);
  };
  ScrollTrigger2.refresh = function(safe) {
    return safe ? _onResize() : (_coreInitted3 || ScrollTrigger2.register()) && _refreshAll(true);
  };
  ScrollTrigger2.update = function(force) {
    return ++_scrollers.cache && _updateAll(force === true ? 2 : 0);
  };
  ScrollTrigger2.clearScrollMemory = _clearScrollMemory;
  ScrollTrigger2.maxScroll = function(element, horizontal) {
    return _maxScroll(element, horizontal ? _horizontal : _vertical);
  };
  ScrollTrigger2.getScrollFunc = function(element, horizontal) {
    return _getScrollFunc(_getTarget(element), horizontal ? _horizontal : _vertical);
  };
  ScrollTrigger2.getById = function(id) {
    return _ids[id];
  };
  ScrollTrigger2.getAll = function() {
    return _triggers.filter(function(t2) {
      return t2.vars.id !== "ScrollSmoother";
    });
  };
  ScrollTrigger2.isScrolling = function() {
    return !!_lastScrollTime;
  };
  ScrollTrigger2.snapDirectional = _snapDirectional;
  ScrollTrigger2.addEventListener = function(type, callback) {
    var a = _listeners2[type] || (_listeners2[type] = []);
    ~a.indexOf(callback) || a.push(callback);
  };
  ScrollTrigger2.removeEventListener = function(type, callback) {
    var a = _listeners2[type], i2 = a && a.indexOf(callback);
    i2 >= 0 && a.splice(i2, 1);
  };
  ScrollTrigger2.batch = function(targets, vars) {
    var result = [], varsCopy = {}, interval = vars.interval || 0.016, batchMax = vars.batchMax || 1e9, proxyCallback = function proxyCallback2(type, callback) {
      var elements = [], triggers = [], delay = gsap3.delayedCall(interval, function() {
        callback(elements, triggers);
        elements = [];
        triggers = [];
      }).pause();
      return function(self) {
        elements.length || delay.restart(true);
        elements.push(self.trigger);
        triggers.push(self);
        batchMax <= elements.length && delay.progress(1);
      };
    }, p;
    for (p in vars) {
      varsCopy[p] = p.substr(0, 2) === "on" && _isFunction3(vars[p]) && p !== "onRefreshInit" ? proxyCallback(p, vars[p]) : vars[p];
    }
    if (_isFunction3(batchMax)) {
      batchMax = batchMax();
      _addListener3(ScrollTrigger2, "refresh", function() {
        return batchMax = vars.batchMax();
      });
    }
    _toArray(targets).forEach(function(target) {
      var config3 = {};
      for (p in varsCopy) {
        config3[p] = varsCopy[p];
      }
      config3.trigger = target;
      result.push(ScrollTrigger2.create(config3));
    });
    return result;
  };
  var _clampScrollAndGetDurationMultiplier = function _clampScrollAndGetDurationMultiplier2(scrollFunc, current, end, max) {
    current > max ? scrollFunc(max) : current < 0 && scrollFunc(0);
    return end > max ? (max - current) / (end - current) : end < 0 ? current / (current - end) : 1;
  };
  var _allowNativePanning = function _allowNativePanning2(target, direction) {
    if (direction === true) {
      target.style.removeProperty("touch-action");
    } else {
      target.style.touchAction = direction === true ? "auto" : direction ? "pan-" + direction + (Observer.isTouch ? " pinch-zoom" : "") : "none";
    }
    target === _docEl2 && _allowNativePanning2(_body2, direction);
  };
  var _overflow = {
    auto: 1,
    scroll: 1
  };
  var _nestedScroll = function _nestedScroll2(_ref5) {
    var event2 = _ref5.event, target = _ref5.target, axis = _ref5.axis;
    var node = (event2.changedTouches ? event2.changedTouches[0] : event2).target, cache = node._gsap || gsap3.core.getCache(node), time = _getTime2(), cs;
    if (!cache._isScrollT || time - cache._isScrollT > 2e3) {
      while (node && node !== _body2 && (node.scrollHeight <= node.clientHeight && node.scrollWidth <= node.clientWidth || !(_overflow[(cs = _getComputedStyle(node)).overflowY] || _overflow[cs.overflowX]))) {
        node = node.parentNode;
      }
      cache._isScroll = node && node !== target && !_isViewport3(node) && (_overflow[(cs = _getComputedStyle(node)).overflowY] || _overflow[cs.overflowX]);
      cache._isScrollT = time;
    }
    if (cache._isScroll || axis === "x") {
      event2.stopPropagation();
      event2._gsapAllow = true;
    }
  };
  var _inputObserver = function _inputObserver2(target, type, inputs, nested) {
    return Observer.create({
      target,
      capture: true,
      debounce: false,
      lockAxis: true,
      type,
      onWheel: nested = nested && _nestedScroll,
      onPress: nested,
      onDrag: nested,
      onScroll: nested,
      onEnable: function onEnable() {
        return inputs && _addListener3(_doc4, Observer.eventTypes[0], _captureInputs, false, true);
      },
      onDisable: function onDisable() {
        return _removeListener3(_doc4, Observer.eventTypes[0], _captureInputs, true);
      }
    });
  };
  var _inputExp = /(input|label|select|textarea)/i;
  var _inputIsFocused;
  var _captureInputs = function _captureInputs2(e2) {
    var isInput = _inputExp.test(e2.target.tagName);
    if (isInput || _inputIsFocused) {
      e2._gsapAllow = true;
      _inputIsFocused = isInput;
    }
  };
  var _getScrollNormalizer = function _getScrollNormalizer2(vars) {
    _isObject3(vars) || (vars = {});
    vars.preventDefault = vars.isNormalizer = vars.allowClicks = true;
    vars.type || (vars.type = "wheel,touch");
    vars.debounce = !!vars.debounce;
    vars.id = vars.id || "normalizer";
    var _vars2 = vars, normalizeScrollX = _vars2.normalizeScrollX, momentum = _vars2.momentum, allowNestedScroll = _vars2.allowNestedScroll, onRelease = _vars2.onRelease, self, maxY, target = _getTarget(vars.target) || _docEl2, smoother = gsap3.core.globals().ScrollSmoother, smootherInstance = smoother && smoother.get(), content = _fixIOSBug && (vars.content && _getTarget(vars.content) || smootherInstance && vars.content !== false && !smootherInstance.smooth() && smootherInstance.content()), scrollFuncY = _getScrollFunc(target, _vertical), scrollFuncX = _getScrollFunc(target, _horizontal), scale = 1, initialScale = (Observer.isTouch && _win4.visualViewport ? _win4.visualViewport.scale * _win4.visualViewport.width : _win4.outerWidth) / _win4.innerWidth, wheelRefresh = 0, resolveMomentumDuration = _isFunction3(momentum) ? function() {
      return momentum(self);
    } : function() {
      return momentum || 2.8;
    }, lastRefreshID, skipTouchMove, inputObserver = _inputObserver(target, vars.type, true, allowNestedScroll), resumeTouchMove = function resumeTouchMove2() {
      return skipTouchMove = false;
    }, scrollClampX = _passThrough3, scrollClampY = _passThrough3, updateClamps = function updateClamps2() {
      maxY = _maxScroll(target, _vertical);
      scrollClampY = _clamp4(_fixIOSBug ? 1 : 0, maxY);
      normalizeScrollX && (scrollClampX = _clamp4(0, _maxScroll(target, _horizontal)));
      lastRefreshID = _refreshID;
    }, removeContentOffset = function removeContentOffset2() {
      content._gsap.y = _round3(parseFloat(content._gsap.y) + scrollFuncY.offset) + "px";
      content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(content._gsap.y) + ", 0, 1)";
      scrollFuncY.offset = scrollFuncY.cacheID = 0;
    }, ignoreDrag = function ignoreDrag2() {
      if (skipTouchMove) {
        requestAnimationFrame(resumeTouchMove);
        var offset = _round3(self.deltaY / 2), scroll = scrollClampY(scrollFuncY.v - offset);
        if (content && scroll !== scrollFuncY.v + scrollFuncY.offset) {
          scrollFuncY.offset = scroll - scrollFuncY.v;
          var y = _round3((parseFloat(content && content._gsap.y) || 0) - scrollFuncY.offset);
          content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + y + ", 0, 1)";
          content._gsap.y = y + "px";
          scrollFuncY.cacheID = _scrollers.cache;
          _updateAll();
        }
        return true;
      }
      scrollFuncY.offset && removeContentOffset();
      skipTouchMove = true;
    }, tween, startScrollX, startScrollY, onStopDelayedCall, onResize2 = function onResize3() {
      updateClamps();
      if (tween.isActive() && tween.vars.scrollY > maxY) {
        scrollFuncY() > maxY ? tween.progress(1) && scrollFuncY(maxY) : tween.resetTo("scrollY", maxY);
      }
    };
    content && gsap3.set(content, {
      y: "+=0"
    });
    vars.ignoreCheck = function(e2) {
      return _fixIOSBug && e2.type === "touchmove" && ignoreDrag(e2) || scale > 1.05 && e2.type !== "touchstart" || self.isGesturing || e2.touches && e2.touches.length > 1;
    };
    vars.onPress = function() {
      skipTouchMove = false;
      var prevScale = scale;
      scale = _round3((_win4.visualViewport && _win4.visualViewport.scale || 1) / initialScale);
      tween.pause();
      prevScale !== scale && _allowNativePanning(target, scale > 1.01 ? true : normalizeScrollX ? false : "x");
      startScrollX = scrollFuncX();
      startScrollY = scrollFuncY();
      updateClamps();
      lastRefreshID = _refreshID;
    };
    vars.onRelease = vars.onGestureStart = function(self2, wasDragging) {
      scrollFuncY.offset && removeContentOffset();
      if (!wasDragging) {
        onStopDelayedCall.restart(true);
      } else {
        _scrollers.cache++;
        var dur = resolveMomentumDuration(), currentScroll, endScroll;
        if (normalizeScrollX) {
          currentScroll = scrollFuncX();
          endScroll = currentScroll + dur * 0.05 * -self2.velocityX / 0.227;
          dur *= _clampScrollAndGetDurationMultiplier(scrollFuncX, currentScroll, endScroll, _maxScroll(target, _horizontal));
          tween.vars.scrollX = scrollClampX(endScroll);
        }
        currentScroll = scrollFuncY();
        endScroll = currentScroll + dur * 0.05 * -self2.velocityY / 0.227;
        dur *= _clampScrollAndGetDurationMultiplier(scrollFuncY, currentScroll, endScroll, _maxScroll(target, _vertical));
        tween.vars.scrollY = scrollClampY(endScroll);
        tween.invalidate().duration(dur).play(0.01);
        if (_fixIOSBug && tween.vars.scrollY >= maxY || currentScroll >= maxY - 1) {
          gsap3.to({}, {
            onUpdate: onResize2,
            duration: dur
          });
        }
      }
      onRelease && onRelease(self2);
    };
    vars.onWheel = function() {
      tween._ts && tween.pause();
      if (_getTime2() - wheelRefresh > 1e3) {
        lastRefreshID = 0;
        wheelRefresh = _getTime2();
      }
    };
    vars.onChange = function(self2, dx, dy, xArray, yArray) {
      _refreshID !== lastRefreshID && updateClamps();
      dx && normalizeScrollX && scrollFuncX(scrollClampX(xArray[2] === dx ? startScrollX + (self2.startX - self2.x) : scrollFuncX() + dx - xArray[1]));
      if (dy) {
        scrollFuncY.offset && removeContentOffset();
        var isTouch = yArray[2] === dy, y = isTouch ? startScrollY + self2.startY - self2.y : scrollFuncY() + dy - yArray[1], yClamped = scrollClampY(y);
        isTouch && y !== yClamped && (startScrollY += yClamped - y);
        scrollFuncY(yClamped);
      }
      (dy || dx) && _updateAll();
    };
    vars.onEnable = function() {
      _allowNativePanning(target, normalizeScrollX ? false : "x");
      ScrollTrigger2.addEventListener("refresh", onResize2);
      _addListener3(_win4, "resize", onResize2);
      if (scrollFuncY.smooth) {
        scrollFuncY.target.style.scrollBehavior = "auto";
        scrollFuncY.smooth = scrollFuncX.smooth = false;
      }
      inputObserver.enable();
    };
    vars.onDisable = function() {
      _allowNativePanning(target, true);
      _removeListener3(_win4, "resize", onResize2);
      ScrollTrigger2.removeEventListener("refresh", onResize2);
      inputObserver.kill();
    };
    vars.lockAxis = vars.lockAxis !== false;
    self = new Observer(vars);
    self.iOS = _fixIOSBug;
    _fixIOSBug && !scrollFuncY() && scrollFuncY(1);
    _fixIOSBug && gsap3.ticker.add(_passThrough3);
    onStopDelayedCall = self._dc;
    tween = gsap3.to(self, {
      ease: "power4",
      paused: true,
      scrollX: normalizeScrollX ? "+=0.1" : "+=0",
      scrollY: "+=0.1",
      modifiers: {
        scrollY: _interruptionTracker(scrollFuncY, scrollFuncY(), function() {
          return tween.pause();
        })
      },
      onUpdate: _updateAll,
      onComplete: onStopDelayedCall.vars.onComplete
    });
    return self;
  };
  ScrollTrigger2.sort = function(func) {
    return _triggers.sort(func || function(a, b) {
      return (a.vars.refreshPriority || 0) * -1e6 + a.start - (b.start + (b.vars.refreshPriority || 0) * -1e6);
    });
  };
  ScrollTrigger2.observe = function(vars) {
    return new Observer(vars);
  };
  ScrollTrigger2.normalizeScroll = function(vars) {
    if (typeof vars === "undefined") {
      return _normalizer2;
    }
    if (vars === true && _normalizer2) {
      return _normalizer2.enable();
    }
    if (vars === false) {
      return _normalizer2 && _normalizer2.kill();
    }
    var normalizer = vars instanceof Observer ? vars : _getScrollNormalizer(vars);
    _normalizer2 && _normalizer2.target === normalizer.target && _normalizer2.kill();
    _isViewport3(normalizer.target) && (_normalizer2 = normalizer);
    return normalizer;
  };
  ScrollTrigger2.core = {
    // smaller file size way to leverage in ScrollSmoother and Observer
    _getVelocityProp,
    _inputObserver,
    _scrollers,
    _proxies,
    bridge: {
      // when normalizeScroll sets the scroll position (ss = setScroll)
      ss: function ss() {
        _lastScrollTime || _dispatch3("scrollStart");
        _lastScrollTime = _getTime2();
      },
      // a way to get the _refreshing value in Observer
      ref: function ref() {
        return _refreshing;
      }
    }
  };
  _getGSAP3() && gsap3.registerPlugin(ScrollTrigger2);

  // src/index.ts
  var import_powerglitch = __toESM(require_src(), 1);

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/swiper.esm.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/core.js
  init_live_reload();

  // node_modules/.pnpm/ssr-window@4.0.2/node_modules/ssr-window/ssr-window.esm.js
  init_live_reload();
  function isObject(obj) {
    return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
  }
  function extend(target = {}, src = {}) {
    Object.keys(src).forEach((key) => {
      if (typeof target[key] === "undefined")
        target[key] = src[key];
      else if (isObject(src[key]) && isObject(target[key]) && Object.keys(src[key]).length > 0) {
        extend(target[key], src[key]);
      }
    });
  }
  var ssrDocument = {
    body: {},
    addEventListener() {
    },
    removeEventListener() {
    },
    activeElement: {
      blur() {
      },
      nodeName: ""
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    getElementById() {
      return null;
    },
    createEvent() {
      return {
        initEvent() {
        }
      };
    },
    createElement() {
      return {
        children: [],
        childNodes: [],
        style: {},
        setAttribute() {
        },
        getElementsByTagName() {
          return [];
        }
      };
    },
    createElementNS() {
      return {};
    },
    importNode() {
      return null;
    },
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: ""
    }
  };
  function getDocument() {
    const doc = typeof document !== "undefined" ? document : {};
    extend(doc, ssrDocument);
    return doc;
  }
  var ssrWindow = {
    document: ssrDocument,
    navigator: {
      userAgent: ""
    },
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: ""
    },
    history: {
      replaceState() {
      },
      pushState() {
      },
      go() {
      },
      back() {
      }
    },
    CustomEvent: function CustomEvent() {
      return this;
    },
    addEventListener() {
    },
    removeEventListener() {
    },
    getComputedStyle() {
      return {
        getPropertyValue() {
          return "";
        }
      };
    },
    Image() {
    },
    Date() {
    },
    screen: {},
    setTimeout() {
    },
    clearTimeout() {
    },
    matchMedia() {
      return {};
    },
    requestAnimationFrame(callback) {
      if (typeof setTimeout === "undefined") {
        callback();
        return null;
      }
      return setTimeout(callback, 0);
    },
    cancelAnimationFrame(id) {
      if (typeof setTimeout === "undefined") {
        return;
      }
      clearTimeout(id);
    }
  };
  function getWindow() {
    const win = typeof window !== "undefined" ? window : {};
    extend(win, ssrWindow);
    return win;
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/shared/utils.js
  init_live_reload();
  function deleteProps(obj) {
    const object = obj;
    Object.keys(object).forEach((key) => {
      try {
        object[key] = null;
      } catch (e2) {
      }
      try {
        delete object[key];
      } catch (e2) {
      }
    });
  }
  function nextTick(callback, delay = 0) {
    return setTimeout(callback, delay);
  }
  function now() {
    return Date.now();
  }
  function getComputedStyle2(el) {
    const window2 = getWindow();
    let style;
    if (window2.getComputedStyle) {
      style = window2.getComputedStyle(el, null);
    }
    if (!style && el.currentStyle) {
      style = el.currentStyle;
    }
    if (!style) {
      style = el.style;
    }
    return style;
  }
  function getTranslate(el, axis = "x") {
    const window2 = getWindow();
    let matrix;
    let curTransform;
    let transformMatrix;
    const curStyle = getComputedStyle2(el, null);
    if (window2.WebKitCSSMatrix) {
      curTransform = curStyle.transform || curStyle.webkitTransform;
      if (curTransform.split(",").length > 6) {
        curTransform = curTransform.split(", ").map((a) => a.replace(",", ".")).join(", ");
      }
      transformMatrix = new window2.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
    } else {
      transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
      matrix = transformMatrix.toString().split(",");
    }
    if (axis === "x") {
      if (window2.WebKitCSSMatrix)
        curTransform = transformMatrix.m41;
      else if (matrix.length === 16)
        curTransform = parseFloat(matrix[12]);
      else
        curTransform = parseFloat(matrix[4]);
    }
    if (axis === "y") {
      if (window2.WebKitCSSMatrix)
        curTransform = transformMatrix.m42;
      else if (matrix.length === 16)
        curTransform = parseFloat(matrix[13]);
      else
        curTransform = parseFloat(matrix[5]);
    }
    return curTransform || 0;
  }
  function isObject2(o2) {
    return typeof o2 === "object" && o2 !== null && o2.constructor && Object.prototype.toString.call(o2).slice(8, -1) === "Object";
  }
  function isNode(node) {
    if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") {
      return node instanceof HTMLElement;
    }
    return node && (node.nodeType === 1 || node.nodeType === 11);
  }
  function extend2(...args) {
    const to = Object(args[0]);
    const noExtend = ["__proto__", "constructor", "prototype"];
    for (let i2 = 1; i2 < args.length; i2 += 1) {
      const nextSource = args[i2];
      if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
        const keysArray = Object.keys(Object(nextSource)).filter((key) => noExtend.indexOf(key) < 0);
        for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
          const nextKey = keysArray[nextIndex];
          const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== void 0 && desc.enumerable) {
            if (isObject2(to[nextKey]) && isObject2(nextSource[nextKey])) {
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend2(to[nextKey], nextSource[nextKey]);
              }
            } else if (!isObject2(to[nextKey]) && isObject2(nextSource[nextKey])) {
              to[nextKey] = {};
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend2(to[nextKey], nextSource[nextKey]);
              }
            } else {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
    }
    return to;
  }
  function setCSSProperty(el, varName, varValue) {
    el.style.setProperty(varName, varValue);
  }
  function animateCSSModeScroll({
    swiper,
    targetPosition,
    side
  }) {
    const window2 = getWindow();
    const startPosition = -swiper.translate;
    let startTime = null;
    let time;
    const duration = swiper.params.speed;
    swiper.wrapperEl.style.scrollSnapType = "none";
    window2.cancelAnimationFrame(swiper.cssModeFrameID);
    const dir = targetPosition > startPosition ? "next" : "prev";
    const isOutOfBound = (current, target) => {
      return dir === "next" && current >= target || dir === "prev" && current <= target;
    };
    const animate = () => {
      time = (/* @__PURE__ */ new Date()).getTime();
      if (startTime === null) {
        startTime = time;
      }
      const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
      const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
      let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
      if (isOutOfBound(currentPosition, targetPosition)) {
        currentPosition = targetPosition;
      }
      swiper.wrapperEl.scrollTo({
        [side]: currentPosition
      });
      if (isOutOfBound(currentPosition, targetPosition)) {
        swiper.wrapperEl.style.overflow = "hidden";
        swiper.wrapperEl.style.scrollSnapType = "";
        setTimeout(() => {
          swiper.wrapperEl.style.overflow = "";
          swiper.wrapperEl.scrollTo({
            [side]: currentPosition
          });
        });
        window2.cancelAnimationFrame(swiper.cssModeFrameID);
        return;
      }
      swiper.cssModeFrameID = window2.requestAnimationFrame(animate);
    };
    animate();
  }
  function getSlideTransformEl(slideEl) {
    return slideEl.querySelector(".swiper-slide-transform") || slideEl.shadowEl && slideEl.shadowEl.querySelector(".swiper-slide-transform") || slideEl;
  }
  function elementChildren(element, selector3 = "") {
    return [...element.children].filter((el) => el.matches(selector3));
  }
  function createElement(tag, classes = []) {
    const el = document.createElement(tag);
    el.classList.add(...Array.isArray(classes) ? classes : [classes]);
    return el;
  }
  function elementPrevAll(el, selector3) {
    const prevEls = [];
    while (el.previousElementSibling) {
      const prev = el.previousElementSibling;
      if (selector3) {
        if (prev.matches(selector3))
          prevEls.push(prev);
      } else
        prevEls.push(prev);
      el = prev;
    }
    return prevEls;
  }
  function elementNextAll(el, selector3) {
    const nextEls = [];
    while (el.nextElementSibling) {
      const next = el.nextElementSibling;
      if (selector3) {
        if (next.matches(selector3))
          nextEls.push(next);
      } else
        nextEls.push(next);
      el = next;
    }
    return nextEls;
  }
  function elementStyle(el, prop) {
    const window2 = getWindow();
    return window2.getComputedStyle(el, null).getPropertyValue(prop);
  }
  function elementIndex(el) {
    let child = el;
    let i2;
    if (child) {
      i2 = 0;
      while ((child = child.previousSibling) !== null) {
        if (child.nodeType === 1)
          i2 += 1;
      }
      return i2;
    }
    return void 0;
  }
  function elementParents(el, selector3) {
    const parents = [];
    let parent = el.parentElement;
    while (parent) {
      if (selector3) {
        if (parent.matches(selector3))
          parents.push(parent);
      } else {
        parents.push(parent);
      }
      parent = parent.parentElement;
    }
    return parents;
  }
  function elementTransitionEnd(el, callback) {
    function fireCallBack(e2) {
      if (e2.target !== el)
        return;
      callback.call(el, e2);
      el.removeEventListener("transitionend", fireCallBack);
    }
    if (callback) {
      el.addEventListener("transitionend", fireCallBack);
    }
  }
  function elementOuterSize(el, size, includeMargins) {
    const window2 = getWindow();
    if (includeMargins) {
      return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
    }
    return el.offsetWidth;
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/shared/get-support.js
  init_live_reload();
  var support;
  function calcSupport() {
    const window2 = getWindow();
    const document2 = getDocument();
    return {
      smoothScroll: document2.documentElement && "scrollBehavior" in document2.documentElement.style,
      touch: !!("ontouchstart" in window2 || window2.DocumentTouch && document2 instanceof window2.DocumentTouch)
    };
  }
  function getSupport() {
    if (!support) {
      support = calcSupport();
    }
    return support;
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/shared/get-device.js
  init_live_reload();
  var deviceCached;
  function calcDevice({
    userAgent
  } = {}) {
    const support2 = getSupport();
    const window2 = getWindow();
    const platform = window2.navigator.platform;
    const ua = userAgent || window2.navigator.userAgent;
    const device = {
      ios: false,
      android: false
    };
    const screenWidth = window2.screen.width;
    const screenHeight = window2.screen.height;
    const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
    const windows = platform === "Win32";
    let macos = platform === "MacIntel";
    const iPadScreens = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
    if (!ipad && macos && support2.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
      ipad = ua.match(/(Version)\/([\d.]+)/);
      if (!ipad)
        ipad = [0, 1, "13_0_0"];
      macos = false;
    }
    if (android && !windows) {
      device.os = "android";
      device.android = true;
    }
    if (ipad || iphone || ipod) {
      device.os = "ios";
      device.ios = true;
    }
    return device;
  }
  function getDevice(overrides = {}) {
    if (!deviceCached) {
      deviceCached = calcDevice(overrides);
    }
    return deviceCached;
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/shared/get-browser.js
  init_live_reload();
  var browser;
  function calcBrowser() {
    const window2 = getWindow();
    let needPerspectiveFix = false;
    function isSafari() {
      const ua = window2.navigator.userAgent.toLowerCase();
      return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
    }
    if (isSafari()) {
      const ua = String(window2.navigator.userAgent);
      if (ua.includes("Version/")) {
        const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num) => Number(num));
        needPerspectiveFix = major < 16 || major === 16 && minor < 2;
      }
    }
    return {
      isSafari: needPerspectiveFix || isSafari(),
      needPerspectiveFix,
      isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window2.navigator.userAgent)
    };
  }
  function getBrowser() {
    if (!browser) {
      browser = calcBrowser();
    }
    return browser;
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/modules/resize/resize.js
  init_live_reload();
  function Resize({
    swiper,
    on,
    emit
  }) {
    const window2 = getWindow();
    let observer = null;
    let animationFrame = null;
    const resizeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized)
        return;
      emit("beforeResize");
      emit("resize");
    };
    const createObserver = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized)
        return;
      observer = new ResizeObserver((entries) => {
        animationFrame = window2.requestAnimationFrame(() => {
          const {
            width,
            height
          } = swiper;
          let newWidth = width;
          let newHeight = height;
          entries.forEach(({
            contentBoxSize,
            contentRect,
            target
          }) => {
            if (target && target !== swiper.el)
              return;
            newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
            newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
          });
          if (newWidth !== width || newHeight !== height) {
            resizeHandler();
          }
        });
      });
      observer.observe(swiper.el);
    };
    const removeObserver = () => {
      if (animationFrame) {
        window2.cancelAnimationFrame(animationFrame);
      }
      if (observer && observer.unobserve && swiper.el) {
        observer.unobserve(swiper.el);
        observer = null;
      }
    };
    const orientationChangeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized)
        return;
      emit("orientationchange");
    };
    on("init", () => {
      if (swiper.params.resizeObserver && typeof window2.ResizeObserver !== "undefined") {
        createObserver();
        return;
      }
      window2.addEventListener("resize", resizeHandler);
      window2.addEventListener("orientationchange", orientationChangeHandler);
    });
    on("destroy", () => {
      removeObserver();
      window2.removeEventListener("resize", resizeHandler);
      window2.removeEventListener("orientationchange", orientationChangeHandler);
    });
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/modules/observer/observer.js
  init_live_reload();
  function Observer2({
    swiper,
    extendParams,
    on,
    emit
  }) {
    const observers = [];
    const window2 = getWindow();
    const attach = (target, options = {}) => {
      const ObserverFunc = window2.MutationObserver || window2.WebkitMutationObserver;
      const observer = new ObserverFunc((mutations) => {
        if (swiper.__preventObserver__)
          return;
        if (mutations.length === 1) {
          emit("observerUpdate", mutations[0]);
          return;
        }
        const observerUpdate = function observerUpdate2() {
          emit("observerUpdate", mutations[0]);
        };
        if (window2.requestAnimationFrame) {
          window2.requestAnimationFrame(observerUpdate);
        } else {
          window2.setTimeout(observerUpdate, 0);
        }
      });
      observer.observe(target, {
        attributes: typeof options.attributes === "undefined" ? true : options.attributes,
        childList: typeof options.childList === "undefined" ? true : options.childList,
        characterData: typeof options.characterData === "undefined" ? true : options.characterData
      });
      observers.push(observer);
    };
    const init4 = () => {
      if (!swiper.params.observer)
        return;
      if (swiper.params.observeParents) {
        const containerParents = elementParents(swiper.el);
        for (let i2 = 0; i2 < containerParents.length; i2 += 1) {
          attach(containerParents[i2]);
        }
      }
      attach(swiper.el, {
        childList: swiper.params.observeSlideChildren
      });
      attach(swiper.wrapperEl, {
        attributes: false
      });
    };
    const destroy = () => {
      observers.forEach((observer) => {
        observer.disconnect();
      });
      observers.splice(0, observers.length);
    };
    extendParams({
      observer: false,
      observeParents: false,
      observeSlideChildren: false
    });
    on("init", init4);
    on("destroy", destroy);
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/events-emitter.js
  init_live_reload();
  var events_emitter_default = {
    on(events2, handler, priority) {
      const self = this;
      if (!self.eventsListeners || self.destroyed)
        return self;
      if (typeof handler !== "function")
        return self;
      const method = priority ? "unshift" : "push";
      events2.split(" ").forEach((event2) => {
        if (!self.eventsListeners[event2])
          self.eventsListeners[event2] = [];
        self.eventsListeners[event2][method](handler);
      });
      return self;
    },
    once(events2, handler, priority) {
      const self = this;
      if (!self.eventsListeners || self.destroyed)
        return self;
      if (typeof handler !== "function")
        return self;
      function onceHandler(...args) {
        self.off(events2, onceHandler);
        if (onceHandler.__emitterProxy) {
          delete onceHandler.__emitterProxy;
        }
        handler.apply(self, args);
      }
      onceHandler.__emitterProxy = handler;
      return self.on(events2, onceHandler, priority);
    },
    onAny(handler, priority) {
      const self = this;
      if (!self.eventsListeners || self.destroyed)
        return self;
      if (typeof handler !== "function")
        return self;
      const method = priority ? "unshift" : "push";
      if (self.eventsAnyListeners.indexOf(handler) < 0) {
        self.eventsAnyListeners[method](handler);
      }
      return self;
    },
    offAny(handler) {
      const self = this;
      if (!self.eventsListeners || self.destroyed)
        return self;
      if (!self.eventsAnyListeners)
        return self;
      const index = self.eventsAnyListeners.indexOf(handler);
      if (index >= 0) {
        self.eventsAnyListeners.splice(index, 1);
      }
      return self;
    },
    off(events2, handler) {
      const self = this;
      if (!self.eventsListeners || self.destroyed)
        return self;
      if (!self.eventsListeners)
        return self;
      events2.split(" ").forEach((event2) => {
        if (typeof handler === "undefined") {
          self.eventsListeners[event2] = [];
        } else if (self.eventsListeners[event2]) {
          self.eventsListeners[event2].forEach((eventHandler, index) => {
            if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
              self.eventsListeners[event2].splice(index, 1);
            }
          });
        }
      });
      return self;
    },
    emit(...args) {
      const self = this;
      if (!self.eventsListeners || self.destroyed)
        return self;
      if (!self.eventsListeners)
        return self;
      let events2;
      let data;
      let context3;
      if (typeof args[0] === "string" || Array.isArray(args[0])) {
        events2 = args[0];
        data = args.slice(1, args.length);
        context3 = self;
      } else {
        events2 = args[0].events;
        data = args[0].data;
        context3 = args[0].context || self;
      }
      data.unshift(context3);
      const eventsArray = Array.isArray(events2) ? events2 : events2.split(" ");
      eventsArray.forEach((event2) => {
        if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
          self.eventsAnyListeners.forEach((eventHandler) => {
            eventHandler.apply(context3, [event2, ...data]);
          });
        }
        if (self.eventsListeners && self.eventsListeners[event2]) {
          self.eventsListeners[event2].forEach((eventHandler) => {
            eventHandler.apply(context3, data);
          });
        }
      });
      return self;
    }
  };

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/update/index.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/update/updateSize.js
  init_live_reload();
  function updateSize() {
    const swiper = this;
    let width;
    let height;
    const el = swiper.el;
    if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) {
      width = swiper.params.width;
    } else {
      width = el.clientWidth;
    }
    if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) {
      height = swiper.params.height;
    } else {
      height = el.clientHeight;
    }
    if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
      return;
    }
    width = width - parseInt(elementStyle(el, "padding-left") || 0, 10) - parseInt(elementStyle(el, "padding-right") || 0, 10);
    height = height - parseInt(elementStyle(el, "padding-top") || 0, 10) - parseInt(elementStyle(el, "padding-bottom") || 0, 10);
    if (Number.isNaN(width))
      width = 0;
    if (Number.isNaN(height))
      height = 0;
    Object.assign(swiper, {
      width,
      height,
      size: swiper.isHorizontal() ? width : height
    });
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/update/updateSlides.js
  init_live_reload();
  function updateSlides() {
    const swiper = this;
    function getDirectionLabel(property) {
      if (swiper.isHorizontal()) {
        return property;
      }
      return {
        "width": "height",
        "margin-top": "margin-left",
        "margin-bottom ": "margin-right",
        "margin-left": "margin-top",
        "margin-right": "margin-bottom",
        "padding-left": "padding-top",
        "padding-right": "padding-bottom",
        "marginRight": "marginBottom"
      }[property];
    }
    function getDirectionPropertyValue(node, label) {
      return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
    }
    const params = swiper.params;
    const {
      wrapperEl,
      slidesEl,
      size: swiperSize,
      rtlTranslate: rtl,
      wrongRTL
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
    const slides = elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
    const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
    let snapGrid = [];
    const slidesGrid = [];
    const slidesSizesGrid = [];
    let offsetBefore = params.slidesOffsetBefore;
    if (typeof offsetBefore === "function") {
      offsetBefore = params.slidesOffsetBefore.call(swiper);
    }
    let offsetAfter = params.slidesOffsetAfter;
    if (typeof offsetAfter === "function") {
      offsetAfter = params.slidesOffsetAfter.call(swiper);
    }
    const previousSnapGridLength = swiper.snapGrid.length;
    const previousSlidesGridLength = swiper.slidesGrid.length;
    let spaceBetween = params.spaceBetween;
    let slidePosition = -offsetBefore;
    let prevSlideSize = 0;
    let index = 0;
    if (typeof swiperSize === "undefined") {
      return;
    }
    if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
      spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
    }
    swiper.virtualSize = -spaceBetween;
    slides.forEach((slideEl) => {
      if (rtl) {
        slideEl.style.marginLeft = "";
      } else {
        slideEl.style.marginRight = "";
      }
      slideEl.style.marginBottom = "";
      slideEl.style.marginTop = "";
    });
    if (params.centeredSlides && params.cssMode) {
      setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
      setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
    }
    const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
    if (gridEnabled) {
      swiper.grid.initSlides(slidesLength);
    }
    let slideSize;
    const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key) => {
      return typeof params.breakpoints[key].slidesPerView !== "undefined";
    }).length > 0;
    for (let i2 = 0; i2 < slidesLength; i2 += 1) {
      slideSize = 0;
      let slide;
      if (slides[i2])
        slide = slides[i2];
      if (gridEnabled) {
        swiper.grid.updateSlide(i2, slide, slidesLength, getDirectionLabel);
      }
      if (slides[i2] && elementStyle(slide, "display") === "none")
        continue;
      if (params.slidesPerView === "auto") {
        if (shouldResetSlideSize) {
          slides[i2].style[getDirectionLabel("width")] = ``;
        }
        const slideStyles = getComputedStyle(slide);
        const currentTransform = slide.style.transform;
        const currentWebKitTransform = slide.style.webkitTransform;
        if (currentTransform) {
          slide.style.transform = "none";
        }
        if (currentWebKitTransform) {
          slide.style.webkitTransform = "none";
        }
        if (params.roundLengths) {
          slideSize = swiper.isHorizontal() ? elementOuterSize(slide, "width", true) : elementOuterSize(slide, "height", true);
        } else {
          const width = getDirectionPropertyValue(slideStyles, "width");
          const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
          const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
          const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
          const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
          const boxSizing = slideStyles.getPropertyValue("box-sizing");
          if (boxSizing && boxSizing === "border-box") {
            slideSize = width + marginLeft + marginRight;
          } else {
            const {
              clientWidth,
              offsetWidth
            } = slide;
            slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
          }
        }
        if (currentTransform) {
          slide.style.transform = currentTransform;
        }
        if (currentWebKitTransform) {
          slide.style.webkitTransform = currentWebKitTransform;
        }
        if (params.roundLengths)
          slideSize = Math.floor(slideSize);
      } else {
        slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
        if (params.roundLengths)
          slideSize = Math.floor(slideSize);
        if (slides[i2]) {
          slides[i2].style[getDirectionLabel("width")] = `${slideSize}px`;
        }
      }
      if (slides[i2]) {
        slides[i2].swiperSlideSize = slideSize;
      }
      slidesSizesGrid.push(slideSize);
      if (params.centeredSlides) {
        slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
        if (prevSlideSize === 0 && i2 !== 0)
          slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
        if (i2 === 0)
          slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
        if (Math.abs(slidePosition) < 1 / 1e3)
          slidePosition = 0;
        if (params.roundLengths)
          slidePosition = Math.floor(slidePosition);
        if (index % params.slidesPerGroup === 0)
          snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
      } else {
        if (params.roundLengths)
          slidePosition = Math.floor(slidePosition);
        if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0)
          snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
        slidePosition = slidePosition + slideSize + spaceBetween;
      }
      swiper.virtualSize += slideSize + spaceBetween;
      prevSlideSize = slideSize;
      index += 1;
    }
    swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
    if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) {
      wrapperEl.style.width = `${swiper.virtualSize + params.spaceBetween}px`;
    }
    if (params.setWrapperSize) {
      wrapperEl.style[getDirectionLabel("width")] = `${swiper.virtualSize + params.spaceBetween}px`;
    }
    if (gridEnabled) {
      swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
    }
    if (!params.centeredSlides) {
      const newSlidesGrid = [];
      for (let i2 = 0; i2 < snapGrid.length; i2 += 1) {
        let slidesGridItem = snapGrid[i2];
        if (params.roundLengths)
          slidesGridItem = Math.floor(slidesGridItem);
        if (snapGrid[i2] <= swiper.virtualSize - swiperSize) {
          newSlidesGrid.push(slidesGridItem);
        }
      }
      snapGrid = newSlidesGrid;
      if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
        snapGrid.push(swiper.virtualSize - swiperSize);
      }
    }
    if (isVirtual && params.loop) {
      const size = slidesSizesGrid[0] + spaceBetween;
      if (params.slidesPerGroup > 1) {
        const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
        const groupSize = size * params.slidesPerGroup;
        for (let i2 = 0; i2 < groups; i2 += 1) {
          snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
        }
      }
      for (let i2 = 0; i2 < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i2 += 1) {
        if (params.slidesPerGroup === 1) {
          snapGrid.push(snapGrid[snapGrid.length - 1] + size);
        }
        slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
        swiper.virtualSize += size;
      }
    }
    if (snapGrid.length === 0)
      snapGrid = [0];
    if (params.spaceBetween !== 0) {
      const key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
      slides.filter((_, slideIndex) => {
        if (!params.cssMode || params.loop)
          return true;
        if (slideIndex === slides.length - 1) {
          return false;
        }
        return true;
      }).forEach((slideEl) => {
        slideEl.style[key] = `${spaceBetween}px`;
      });
    }
    if (params.centeredSlides && params.centeredSlidesBounds) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
      });
      allSlidesSize -= params.spaceBetween;
      const maxSnap = allSlidesSize - swiperSize;
      snapGrid = snapGrid.map((snap3) => {
        if (snap3 < 0)
          return -offsetBefore;
        if (snap3 > maxSnap)
          return maxSnap + offsetAfter;
        return snap3;
      });
    }
    if (params.centerInsufficientSlides) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
      });
      allSlidesSize -= params.spaceBetween;
      if (allSlidesSize < swiperSize) {
        const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
        snapGrid.forEach((snap3, snapIndex) => {
          snapGrid[snapIndex] = snap3 - allSlidesOffset;
        });
        slidesGrid.forEach((snap3, snapIndex) => {
          slidesGrid[snapIndex] = snap3 + allSlidesOffset;
        });
      }
    }
    Object.assign(swiper, {
      slides,
      snapGrid,
      slidesGrid,
      slidesSizesGrid
    });
    if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
      setCSSProperty(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
      setCSSProperty(wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
      const addToSnapGrid = -swiper.snapGrid[0];
      const addToSlidesGrid = -swiper.slidesGrid[0];
      swiper.snapGrid = swiper.snapGrid.map((v) => v + addToSnapGrid);
      swiper.slidesGrid = swiper.slidesGrid.map((v) => v + addToSlidesGrid);
    }
    if (slidesLength !== previousSlidesLength) {
      swiper.emit("slidesLengthChange");
    }
    if (snapGrid.length !== previousSnapGridLength) {
      if (swiper.params.watchOverflow)
        swiper.checkOverflow();
      swiper.emit("snapGridLengthChange");
    }
    if (slidesGrid.length !== previousSlidesGridLength) {
      swiper.emit("slidesGridLengthChange");
    }
    if (params.watchSlidesProgress) {
      swiper.updateSlidesOffset();
    }
    if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
      const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
      const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
      if (slidesLength <= params.maxBackfaceHiddenSlides) {
        if (!hasClassBackfaceClassAdded)
          swiper.el.classList.add(backFaceHiddenClass);
      } else if (hasClassBackfaceClassAdded) {
        swiper.el.classList.remove(backFaceHiddenClass);
      }
    }
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/update/updateAutoHeight.js
  init_live_reload();
  function updateAutoHeight(speed) {
    const swiper = this;
    const activeSlides = [];
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    let newHeight = 0;
    let i2;
    if (typeof speed === "number") {
      swiper.setTransition(speed);
    } else if (speed === true) {
      swiper.setTransition(swiper.params.speed);
    }
    const getSlideByIndex = (index) => {
      if (isVirtual) {
        return swiper.getSlideIndexByData(index);
      }
      return swiper.slides[index];
    };
    if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) {
      if (swiper.params.centeredSlides) {
        (swiper.visibleSlides || []).forEach((slide) => {
          activeSlides.push(slide);
        });
      } else {
        for (i2 = 0; i2 < Math.ceil(swiper.params.slidesPerView); i2 += 1) {
          const index = swiper.activeIndex + i2;
          if (index > swiper.slides.length && !isVirtual)
            break;
          activeSlides.push(getSlideByIndex(index));
        }
      }
    } else {
      activeSlides.push(getSlideByIndex(swiper.activeIndex));
    }
    for (i2 = 0; i2 < activeSlides.length; i2 += 1) {
      if (typeof activeSlides[i2] !== "undefined") {
        const height = activeSlides[i2].offsetHeight;
        newHeight = height > newHeight ? height : newHeight;
      }
    }
    if (newHeight || newHeight === 0)
      swiper.wrapperEl.style.height = `${newHeight}px`;
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/update/updateSlidesOffset.js
  init_live_reload();
  function updateSlidesOffset() {
    const swiper = this;
    const slides = swiper.slides;
    const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
    for (let i2 = 0; i2 < slides.length; i2 += 1) {
      slides[i2].swiperSlideOffset = (swiper.isHorizontal() ? slides[i2].offsetLeft : slides[i2].offsetTop) - minusOffset;
    }
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/update/updateSlidesProgress.js
  init_live_reload();
  function updateSlidesProgress(translate = this && this.translate || 0) {
    const swiper = this;
    const params = swiper.params;
    const {
      slides,
      rtlTranslate: rtl,
      snapGrid
    } = swiper;
    if (slides.length === 0)
      return;
    if (typeof slides[0].swiperSlideOffset === "undefined")
      swiper.updateSlidesOffset();
    let offsetCenter = -translate;
    if (rtl)
      offsetCenter = translate;
    slides.forEach((slideEl) => {
      slideEl.classList.remove(params.slideVisibleClass);
    });
    swiper.visibleSlidesIndexes = [];
    swiper.visibleSlides = [];
    for (let i2 = 0; i2 < slides.length; i2 += 1) {
      const slide = slides[i2];
      let slideOffset = slide.swiperSlideOffset;
      if (params.cssMode && params.centeredSlides) {
        slideOffset -= slides[0].swiperSlideOffset;
      }
      const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
      const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
      const slideBefore = -(offsetCenter - slideOffset);
      const slideAfter = slideBefore + swiper.slidesSizesGrid[i2];
      const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
      if (isVisible) {
        swiper.visibleSlides.push(slide);
        swiper.visibleSlidesIndexes.push(i2);
        slides[i2].classList.add(params.slideVisibleClass);
      }
      slide.progress = rtl ? -slideProgress : slideProgress;
      slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
    }
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/update/updateProgress.js
  init_live_reload();
  function updateProgress(translate) {
    const swiper = this;
    if (typeof translate === "undefined") {
      const multiplier = swiper.rtlTranslate ? -1 : 1;
      translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
    }
    const params = swiper.params;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    let {
      progress,
      isBeginning,
      isEnd,
      progressLoop
    } = swiper;
    const wasBeginning = isBeginning;
    const wasEnd = isEnd;
    if (translatesDiff === 0) {
      progress = 0;
      isBeginning = true;
      isEnd = true;
    } else {
      progress = (translate - swiper.minTranslate()) / translatesDiff;
      const isBeginningRounded = Math.abs(translate - swiper.minTranslate()) < 1;
      const isEndRounded = Math.abs(translate - swiper.maxTranslate()) < 1;
      isBeginning = isBeginningRounded || progress <= 0;
      isEnd = isEndRounded || progress >= 1;
      if (isBeginningRounded)
        progress = 0;
      if (isEndRounded)
        progress = 1;
    }
    if (params.loop) {
      const firstSlideIndex = swiper.getSlideIndexByData(0);
      const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
      const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
      const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
      const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
      const translateAbs = Math.abs(translate);
      if (translateAbs >= firstSlideTranslate) {
        progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
      } else {
        progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
      }
      if (progressLoop > 1)
        progressLoop -= 1;
    }
    Object.assign(swiper, {
      progress,
      progressLoop,
      isBeginning,
      isEnd
    });
    if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight)
      swiper.updateSlidesProgress(translate);
    if (isBeginning && !wasBeginning) {
      swiper.emit("reachBeginning toEdge");
    }
    if (isEnd && !wasEnd) {
      swiper.emit("reachEnd toEdge");
    }
    if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
      swiper.emit("fromEdge");
    }
    swiper.emit("progress", progress);
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/update/updateSlidesClasses.js
  init_live_reload();
  function updateSlidesClasses() {
    const swiper = this;
    const {
      slides,
      params,
      slidesEl,
      activeIndex
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const getFilteredSlide = (selector3) => {
      return elementChildren(slidesEl, `.${params.slideClass}${selector3}, swiper-slide${selector3}`)[0];
    };
    slides.forEach((slideEl) => {
      slideEl.classList.remove(params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
    });
    let activeSlide;
    if (isVirtual) {
      if (params.loop) {
        let slideIndex = activeIndex - swiper.virtual.slidesBefore;
        if (slideIndex < 0)
          slideIndex = swiper.virtual.slides.length + slideIndex;
        if (slideIndex >= swiper.virtual.slides.length)
          slideIndex -= swiper.virtual.slides.length;
        activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
      } else {
        activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`);
      }
    } else {
      activeSlide = slides[activeIndex];
    }
    if (activeSlide) {
      activeSlide.classList.add(params.slideActiveClass);
      let nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
      if (params.loop && !nextSlide) {
        nextSlide = slides[0];
      }
      if (nextSlide) {
        nextSlide.classList.add(params.slideNextClass);
      }
      let prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
      if (params.loop && !prevSlide === 0) {
        prevSlide = slides[slides.length - 1];
      }
      if (prevSlide) {
        prevSlide.classList.add(params.slidePrevClass);
      }
    }
    swiper.emitSlidesClasses();
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/update/updateActiveIndex.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/shared/process-lazy-preloader.js
  init_live_reload();
  var processLazyPreloader = (swiper, imageEl) => {
    if (!swiper || swiper.destroyed || !swiper.params)
      return;
    const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
    const slideEl = imageEl.closest(slideSelector());
    if (slideEl) {
      const lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
      if (lazyEl)
        lazyEl.remove();
    }
  };
  var unlazy = (swiper, index) => {
    if (!swiper.slides[index])
      return;
    const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
    if (imageEl)
      imageEl.removeAttribute("loading");
  };
  var preload = (swiper) => {
    if (!swiper || swiper.destroyed || !swiper.params)
      return;
    let amount = swiper.params.lazyPreloadPrevNext;
    const len = swiper.slides.length;
    if (!len || !amount || amount < 0)
      return;
    amount = Math.min(amount, len);
    const slidesPerView = swiper.params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
    const activeIndex = swiper.activeIndex;
    const slideIndexLastInView = activeIndex + slidesPerView - 1;
    if (swiper.params.rewind) {
      for (let i2 = activeIndex - amount; i2 <= slideIndexLastInView + amount; i2 += 1) {
        const realIndex = (i2 % len + len) % len;
        if (realIndex !== activeIndex && realIndex > slideIndexLastInView)
          unlazy(swiper, realIndex);
      }
    } else {
      for (let i2 = Math.max(slideIndexLastInView - amount, 0); i2 <= Math.min(slideIndexLastInView + amount, len - 1); i2 += 1) {
        if (i2 !== activeIndex && i2 > slideIndexLastInView)
          unlazy(swiper, i2);
      }
    }
  };

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/update/updateActiveIndex.js
  function getActiveIndexByTranslate(swiper) {
    const {
      slidesGrid,
      params
    } = swiper;
    const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    let activeIndex;
    for (let i2 = 0; i2 < slidesGrid.length; i2 += 1) {
      if (typeof slidesGrid[i2 + 1] !== "undefined") {
        if (translate >= slidesGrid[i2] && translate < slidesGrid[i2 + 1] - (slidesGrid[i2 + 1] - slidesGrid[i2]) / 2) {
          activeIndex = i2;
        } else if (translate >= slidesGrid[i2] && translate < slidesGrid[i2 + 1]) {
          activeIndex = i2 + 1;
        }
      } else if (translate >= slidesGrid[i2]) {
        activeIndex = i2;
      }
    }
    if (params.normalizeSlideIndex) {
      if (activeIndex < 0 || typeof activeIndex === "undefined")
        activeIndex = 0;
    }
    return activeIndex;
  }
  function updateActiveIndex(newActiveIndex) {
    const swiper = this;
    const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    const {
      snapGrid,
      params,
      activeIndex: previousIndex,
      realIndex: previousRealIndex,
      snapIndex: previousSnapIndex
    } = swiper;
    let activeIndex = newActiveIndex;
    let snapIndex;
    const getVirtualRealIndex = (aIndex) => {
      let realIndex2 = aIndex - swiper.virtual.slidesBefore;
      if (realIndex2 < 0) {
        realIndex2 = swiper.virtual.slides.length + realIndex2;
      }
      if (realIndex2 >= swiper.virtual.slides.length) {
        realIndex2 -= swiper.virtual.slides.length;
      }
      return realIndex2;
    };
    if (typeof activeIndex === "undefined") {
      activeIndex = getActiveIndexByTranslate(swiper);
    }
    if (snapGrid.indexOf(translate) >= 0) {
      snapIndex = snapGrid.indexOf(translate);
    } else {
      const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
      snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
    }
    if (snapIndex >= snapGrid.length)
      snapIndex = snapGrid.length - 1;
    if (activeIndex === previousIndex) {
      if (snapIndex !== previousSnapIndex) {
        swiper.snapIndex = snapIndex;
        swiper.emit("snapIndexChange");
      }
      if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
        swiper.realIndex = getVirtualRealIndex(activeIndex);
      }
      return;
    }
    let realIndex;
    if (swiper.virtual && params.virtual.enabled && params.loop) {
      realIndex = getVirtualRealIndex(activeIndex);
    } else if (swiper.slides[activeIndex]) {
      realIndex = parseInt(swiper.slides[activeIndex].getAttribute("data-swiper-slide-index") || activeIndex, 10);
    } else {
      realIndex = activeIndex;
    }
    Object.assign(swiper, {
      snapIndex,
      realIndex,
      previousIndex,
      activeIndex
    });
    if (swiper.initialized) {
      preload(swiper);
    }
    swiper.emit("activeIndexChange");
    swiper.emit("snapIndexChange");
    if (previousRealIndex !== realIndex) {
      swiper.emit("realIndexChange");
    }
    if (swiper.initialized || swiper.params.runCallbacksOnInit) {
      swiper.emit("slideChange");
    }
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/update/updateClickedSlide.js
  init_live_reload();
  function updateClickedSlide(e2) {
    const swiper = this;
    const params = swiper.params;
    const slide = e2.closest(`.${params.slideClass}, swiper-slide`);
    let slideFound = false;
    let slideIndex;
    if (slide) {
      for (let i2 = 0; i2 < swiper.slides.length; i2 += 1) {
        if (swiper.slides[i2] === slide) {
          slideFound = true;
          slideIndex = i2;
          break;
        }
      }
    }
    if (slide && slideFound) {
      swiper.clickedSlide = slide;
      if (swiper.virtual && swiper.params.virtual.enabled) {
        swiper.clickedIndex = parseInt(slide.getAttribute("data-swiper-slide-index"), 10);
      } else {
        swiper.clickedIndex = slideIndex;
      }
    } else {
      swiper.clickedSlide = void 0;
      swiper.clickedIndex = void 0;
      return;
    }
    if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) {
      swiper.slideToClickedSlide();
    }
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/update/index.js
  var update_default = {
    updateSize,
    updateSlides,
    updateAutoHeight,
    updateSlidesOffset,
    updateSlidesProgress,
    updateProgress,
    updateSlidesClasses,
    updateActiveIndex,
    updateClickedSlide
  };

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/translate/index.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/translate/getTranslate.js
  init_live_reload();
  function getSwiperTranslate(axis = this.isHorizontal() ? "x" : "y") {
    const swiper = this;
    const {
      params,
      rtlTranslate: rtl,
      translate,
      wrapperEl
    } = swiper;
    if (params.virtualTranslate) {
      return rtl ? -translate : translate;
    }
    if (params.cssMode) {
      return translate;
    }
    let currentTranslate = getTranslate(wrapperEl, axis);
    if (rtl)
      currentTranslate = -currentTranslate;
    return currentTranslate || 0;
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/translate/setTranslate.js
  init_live_reload();
  function setTranslate(translate, byController) {
    const swiper = this;
    const {
      rtlTranslate: rtl,
      params,
      wrapperEl,
      progress
    } = swiper;
    let x = 0;
    let y = 0;
    const z = 0;
    if (swiper.isHorizontal()) {
      x = rtl ? -translate : translate;
    } else {
      y = translate;
    }
    if (params.roundLengths) {
      x = Math.floor(x);
      y = Math.floor(y);
    }
    if (params.cssMode) {
      wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y;
    } else if (!params.virtualTranslate) {
      wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    }
    swiper.previousTranslate = swiper.translate;
    swiper.translate = swiper.isHorizontal() ? x : y;
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (translate - swiper.minTranslate()) / translatesDiff;
    }
    if (newProgress !== progress) {
      swiper.updateProgress(translate);
    }
    swiper.emit("setTranslate", swiper.translate, byController);
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/translate/minTranslate.js
  init_live_reload();
  function minTranslate() {
    return -this.snapGrid[0];
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/translate/maxTranslate.js
  init_live_reload();
  function maxTranslate() {
    return -this.snapGrid[this.snapGrid.length - 1];
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/translate/translateTo.js
  init_live_reload();
  function translateTo(translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
    const swiper = this;
    const {
      params,
      wrapperEl
    } = swiper;
    if (swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }
    const minTranslate2 = swiper.minTranslate();
    const maxTranslate2 = swiper.maxTranslate();
    let newTranslate;
    if (translateBounds && translate > minTranslate2)
      newTranslate = minTranslate2;
    else if (translateBounds && translate < maxTranslate2)
      newTranslate = maxTranslate2;
    else
      newTranslate = translate;
    swiper.updateProgress(newTranslate);
    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      if (speed === 0) {
        wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll({
            swiper,
            targetPosition: -newTranslate,
            side: isH ? "left" : "top"
          });
          return true;
        }
        wrapperEl.scrollTo({
          [isH ? "left" : "top"]: -newTranslate,
          behavior: "smooth"
        });
      }
      return true;
    }
    if (speed === 0) {
      swiper.setTransition(0);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.emit("transitionEnd");
      }
    } else {
      swiper.setTransition(speed);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.emit("transitionStart");
      }
      if (!swiper.animating) {
        swiper.animating = true;
        if (!swiper.onTranslateToWrapperTransitionEnd) {
          swiper.onTranslateToWrapperTransitionEnd = function transitionEnd2(e2) {
            if (!swiper || swiper.destroyed)
              return;
            if (e2.target !== this)
              return;
            swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
            swiper.onTranslateToWrapperTransitionEnd = null;
            delete swiper.onTranslateToWrapperTransitionEnd;
            if (runCallbacks) {
              swiper.emit("transitionEnd");
            }
          };
        }
        swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
      }
    }
    return true;
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/translate/index.js
  var translate_default = {
    getTranslate: getSwiperTranslate,
    setTranslate,
    minTranslate,
    maxTranslate,
    translateTo
  };

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/transition/index.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/transition/setTransition.js
  init_live_reload();
  function setTransition(duration, byController) {
    const swiper = this;
    if (!swiper.params.cssMode) {
      swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
    }
    swiper.emit("setTransition", duration, byController);
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/transition/transitionStart.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/transition/transitionEmit.js
  init_live_reload();
  function transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step
  }) {
    const {
      activeIndex,
      previousIndex
    } = swiper;
    let dir = direction;
    if (!dir) {
      if (activeIndex > previousIndex)
        dir = "next";
      else if (activeIndex < previousIndex)
        dir = "prev";
      else
        dir = "reset";
    }
    swiper.emit(`transition${step}`);
    if (runCallbacks && activeIndex !== previousIndex) {
      if (dir === "reset") {
        swiper.emit(`slideResetTransition${step}`);
        return;
      }
      swiper.emit(`slideChangeTransition${step}`);
      if (dir === "next") {
        swiper.emit(`slideNextTransition${step}`);
      } else {
        swiper.emit(`slidePrevTransition${step}`);
      }
    }
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/transition/transitionStart.js
  function transitionStart(runCallbacks = true, direction) {
    const swiper = this;
    const {
      params
    } = swiper;
    if (params.cssMode)
      return;
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step: "Start"
    });
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/transition/transitionEnd.js
  init_live_reload();
  function transitionEnd(runCallbacks = true, direction) {
    const swiper = this;
    const {
      params
    } = swiper;
    swiper.animating = false;
    if (params.cssMode)
      return;
    swiper.setTransition(0);
    transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step: "End"
    });
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/transition/index.js
  var transition_default = {
    setTransition,
    transitionStart,
    transitionEnd
  };

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/slide/index.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/slide/slideTo.js
  init_live_reload();
  function slideTo(index = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
    if (typeof index === "string") {
      index = parseInt(index, 10);
    }
    const swiper = this;
    let slideIndex = index;
    if (slideIndex < 0)
      slideIndex = 0;
    const {
      params,
      snapGrid,
      slidesGrid,
      previousIndex,
      activeIndex,
      rtlTranslate: rtl,
      wrapperEl,
      enabled
    } = swiper;
    if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
      return false;
    }
    const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
    let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
    if (snapIndex >= snapGrid.length)
      snapIndex = snapGrid.length - 1;
    const translate = -snapGrid[snapIndex];
    if (params.normalizeSlideIndex) {
      for (let i2 = 0; i2 < slidesGrid.length; i2 += 1) {
        const normalizedTranslate = -Math.floor(translate * 100);
        const normalizedGrid = Math.floor(slidesGrid[i2] * 100);
        const normalizedGridNext = Math.floor(slidesGrid[i2 + 1] * 100);
        if (typeof slidesGrid[i2 + 1] !== "undefined") {
          if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
            slideIndex = i2;
          } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
            slideIndex = i2 + 1;
          }
        } else if (normalizedTranslate >= normalizedGrid) {
          slideIndex = i2;
        }
      }
    }
    if (swiper.initialized && slideIndex !== activeIndex) {
      if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
        return false;
      }
      if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
        if ((activeIndex || 0) !== slideIndex) {
          return false;
        }
      }
    }
    if (slideIndex !== (previousIndex || 0) && runCallbacks) {
      swiper.emit("beforeSlideChangeStart");
    }
    swiper.updateProgress(translate);
    let direction;
    if (slideIndex > activeIndex)
      direction = "next";
    else if (slideIndex < activeIndex)
      direction = "prev";
    else
      direction = "reset";
    if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
      swiper.updateActiveIndex(slideIndex);
      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }
      swiper.updateSlidesClasses();
      if (params.effect !== "slide") {
        swiper.setTranslate(translate);
      }
      if (direction !== "reset") {
        swiper.transitionStart(runCallbacks, direction);
        swiper.transitionEnd(runCallbacks, direction);
      }
      return false;
    }
    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      const t2 = rtl ? translate : -translate;
      if (speed === 0) {
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        if (isVirtual) {
          swiper.wrapperEl.style.scrollSnapType = "none";
          swiper._immediateVirtual = true;
        }
        if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
          swiper._cssModeVirtualInitialSet = true;
          requestAnimationFrame(() => {
            wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t2;
          });
        } else {
          wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t2;
        }
        if (isVirtual) {
          requestAnimationFrame(() => {
            swiper.wrapperEl.style.scrollSnapType = "";
            swiper._immediateVirtual = false;
          });
        }
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll({
            swiper,
            targetPosition: t2,
            side: isH ? "left" : "top"
          });
          return true;
        }
        wrapperEl.scrollTo({
          [isH ? "left" : "top"]: t2,
          behavior: "smooth"
        });
      }
      return true;
    }
    swiper.setTransition(speed);
    swiper.setTranslate(translate);
    swiper.updateActiveIndex(slideIndex);
    swiper.updateSlidesClasses();
    swiper.emit("beforeTransitionStart", speed, internal);
    swiper.transitionStart(runCallbacks, direction);
    if (speed === 0) {
      swiper.transitionEnd(runCallbacks, direction);
    } else if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onSlideToWrapperTransitionEnd) {
        swiper.onSlideToWrapperTransitionEnd = function transitionEnd2(e2) {
          if (!swiper || swiper.destroyed)
            return;
          if (e2.target !== this)
            return;
          swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
          swiper.onSlideToWrapperTransitionEnd = null;
          delete swiper.onSlideToWrapperTransitionEnd;
          swiper.transitionEnd(runCallbacks, direction);
        };
      }
      swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
    }
    return true;
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/slide/slideToLoop.js
  init_live_reload();
  function slideToLoop(index = 0, speed = this.params.speed, runCallbacks = true, internal) {
    if (typeof index === "string") {
      const indexAsNumber = parseInt(index, 10);
      index = indexAsNumber;
    }
    const swiper = this;
    let newIndex = index;
    if (swiper.params.loop) {
      if (swiper.virtual && swiper.params.virtual.enabled) {
        newIndex = newIndex + swiper.virtual.slidesBefore;
      } else {
        newIndex = swiper.getSlideIndexByData(newIndex);
      }
    }
    return swiper.slideTo(newIndex, speed, runCallbacks, internal);
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/slide/slideNext.js
  init_live_reload();
  function slideNext(speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    const {
      enabled,
      params,
      animating
    } = swiper;
    if (!enabled)
      return swiper;
    let perGroup = params.slidesPerGroup;
    if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
    }
    const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    if (params.loop) {
      if (animating && !isVirtual && params.loopPreventsSliding)
        return false;
      swiper.loopFix({
        direction: "next"
      });
      swiper._clientLeft = swiper.wrapperEl.clientLeft;
    }
    if (params.rewind && swiper.isEnd) {
      return swiper.slideTo(0, speed, runCallbacks, internal);
    }
    return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/slide/slidePrev.js
  init_live_reload();
  function slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    const {
      params,
      snapGrid,
      slidesGrid,
      rtlTranslate,
      enabled,
      animating
    } = swiper;
    if (!enabled)
      return swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    if (params.loop) {
      if (animating && !isVirtual && params.loopPreventsSliding)
        return false;
      swiper.loopFix({
        direction: "prev"
      });
      swiper._clientLeft = swiper.wrapperEl.clientLeft;
    }
    const translate = rtlTranslate ? swiper.translate : -swiper.translate;
    function normalize3(val) {
      if (val < 0)
        return -Math.floor(Math.abs(val));
      return Math.floor(val);
    }
    const normalizedTranslate = normalize3(translate);
    const normalizedSnapGrid = snapGrid.map((val) => normalize3(val));
    let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
    if (typeof prevSnap === "undefined" && params.cssMode) {
      let prevSnapIndex;
      snapGrid.forEach((snap3, snapIndex) => {
        if (normalizedTranslate >= snap3) {
          prevSnapIndex = snapIndex;
        }
      });
      if (typeof prevSnapIndex !== "undefined") {
        prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
      }
    }
    let prevIndex = 0;
    if (typeof prevSnap !== "undefined") {
      prevIndex = slidesGrid.indexOf(prevSnap);
      if (prevIndex < 0)
        prevIndex = swiper.activeIndex - 1;
      if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
        prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
        prevIndex = Math.max(prevIndex, 0);
      }
    }
    if (params.rewind && swiper.isBeginning) {
      const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
      return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
    }
    return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/slide/slideReset.js
  init_live_reload();
  function slideReset(speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/slide/slideToClosest.js
  init_live_reload();
  function slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = 0.5) {
    const swiper = this;
    let index = swiper.activeIndex;
    const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
    const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
    const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    if (translate >= swiper.snapGrid[snapIndex]) {
      const currentSnap = swiper.snapGrid[snapIndex];
      const nextSnap = swiper.snapGrid[snapIndex + 1];
      if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
        index += swiper.params.slidesPerGroup;
      }
    } else {
      const prevSnap = swiper.snapGrid[snapIndex - 1];
      const currentSnap = swiper.snapGrid[snapIndex];
      if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) {
        index -= swiper.params.slidesPerGroup;
      }
    }
    index = Math.max(index, 0);
    index = Math.min(index, swiper.slidesGrid.length - 1);
    return swiper.slideTo(index, speed, runCallbacks, internal);
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/slide/slideToClickedSlide.js
  init_live_reload();
  function slideToClickedSlide() {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
    let slideToIndex = swiper.clickedIndex;
    let realIndex;
    const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
    if (params.loop) {
      if (swiper.animating)
        return;
      realIndex = parseInt(swiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
      if (params.centeredSlides) {
        if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
          swiper.loopFix();
          slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
          nextTick(() => {
            swiper.slideTo(slideToIndex);
          });
        } else {
          swiper.slideTo(slideToIndex);
        }
      } else if (slideToIndex > swiper.slides.length - slidesPerView) {
        swiper.loopFix();
        slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else {
      swiper.slideTo(slideToIndex);
    }
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/slide/index.js
  var slide_default = {
    slideTo,
    slideToLoop,
    slideNext,
    slidePrev,
    slideReset,
    slideToClosest,
    slideToClickedSlide
  };

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/loop/index.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/loop/loopCreate.js
  init_live_reload();
  function loopCreate(slideRealIndex) {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    if (!params.loop || swiper.virtual && swiper.params.virtual.enabled)
      return;
    const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
    slides.forEach((el, index) => {
      el.setAttribute("data-swiper-slide-index", index);
    });
    swiper.loopFix({
      slideRealIndex,
      direction: params.centeredSlides ? void 0 : "next"
    });
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/loop/loopFix.js
  init_live_reload();
  function loopFix({
    slideRealIndex,
    slideTo: slideTo2 = true,
    direction,
    setTranslate: setTranslate2,
    activeSlideIndex,
    byController,
    byMousewheel
  } = {}) {
    const swiper = this;
    if (!swiper.params.loop)
      return;
    swiper.emit("beforeLoopFix");
    const {
      slides,
      allowSlidePrev,
      allowSlideNext,
      slidesEl,
      params
    } = swiper;
    swiper.allowSlidePrev = true;
    swiper.allowSlideNext = true;
    if (swiper.virtual && params.virtual.enabled) {
      if (slideTo2) {
        if (!params.centeredSlides && swiper.snapIndex === 0) {
          swiper.slideTo(swiper.virtual.slides.length, 0, false, true);
        } else if (params.centeredSlides && swiper.snapIndex < params.slidesPerView) {
          swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true);
        } else if (swiper.snapIndex === swiper.snapGrid.length - 1) {
          swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
        }
      }
      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;
      swiper.emit("loopFix");
      return;
    }
    const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10));
    let loopedSlides = params.loopedSlides || slidesPerView;
    if (loopedSlides % params.slidesPerGroup !== 0) {
      loopedSlides += params.slidesPerGroup - loopedSlides % params.slidesPerGroup;
    }
    swiper.loopedSlides = loopedSlides;
    const prependSlidesIndexes = [];
    const appendSlidesIndexes = [];
    let activeIndex = swiper.activeIndex;
    if (typeof activeSlideIndex === "undefined") {
      activeSlideIndex = swiper.getSlideIndex(swiper.slides.filter((el) => el.classList.contains(params.slideActiveClass))[0]);
    } else {
      activeIndex = activeSlideIndex;
    }
    const isNext = direction === "next" || !direction;
    const isPrev = direction === "prev" || !direction;
    let slidesPrepended = 0;
    let slidesAppended = 0;
    if (activeSlideIndex < loopedSlides) {
      slidesPrepended = Math.max(loopedSlides - activeSlideIndex, params.slidesPerGroup);
      for (let i2 = 0; i2 < loopedSlides - activeSlideIndex; i2 += 1) {
        const index = i2 - Math.floor(i2 / slides.length) * slides.length;
        prependSlidesIndexes.push(slides.length - index - 1);
      }
    } else if (activeSlideIndex > swiper.slides.length - loopedSlides * 2) {
      slidesAppended = Math.max(activeSlideIndex - (swiper.slides.length - loopedSlides * 2), params.slidesPerGroup);
      for (let i2 = 0; i2 < slidesAppended; i2 += 1) {
        const index = i2 - Math.floor(i2 / slides.length) * slides.length;
        appendSlidesIndexes.push(index);
      }
    }
    if (isPrev) {
      prependSlidesIndexes.forEach((index) => {
        slidesEl.prepend(swiper.slides[index]);
      });
    }
    if (isNext) {
      appendSlidesIndexes.forEach((index) => {
        slidesEl.append(swiper.slides[index]);
      });
    }
    swiper.recalcSlides();
    if (params.watchSlidesProgress) {
      swiper.updateSlidesOffset();
    }
    if (slideTo2) {
      if (prependSlidesIndexes.length > 0 && isPrev) {
        if (typeof slideRealIndex === "undefined") {
          const currentSlideTranslate = swiper.slidesGrid[activeIndex];
          const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
          const diff = newSlideTranslate - currentSlideTranslate;
          if (byMousewheel) {
            swiper.setTranslate(swiper.translate - diff);
          } else {
            swiper.slideTo(activeIndex + slidesPrepended, 0, false, true);
            if (setTranslate2) {
              swiper.touches[swiper.isHorizontal() ? "startX" : "startY"] += diff;
            }
          }
        } else {
          if (setTranslate2) {
            swiper.slideToLoop(slideRealIndex, 0, false, true);
          }
        }
      } else if (appendSlidesIndexes.length > 0 && isNext) {
        if (typeof slideRealIndex === "undefined") {
          const currentSlideTranslate = swiper.slidesGrid[activeIndex];
          const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
          const diff = newSlideTranslate - currentSlideTranslate;
          if (byMousewheel) {
            swiper.setTranslate(swiper.translate - diff);
          } else {
            swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
            if (setTranslate2) {
              swiper.touches[swiper.isHorizontal() ? "startX" : "startY"] += diff;
            }
          }
        } else {
          swiper.slideToLoop(slideRealIndex, 0, false, true);
        }
      }
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    if (swiper.controller && swiper.controller.control && !byController) {
      const loopParams = {
        slideRealIndex,
        slideTo: false,
        direction,
        setTranslate: setTranslate2,
        activeSlideIndex,
        byController: true
      };
      if (Array.isArray(swiper.controller.control)) {
        swiper.controller.control.forEach((c) => {
          if (!c.destroyed && c.params.loop)
            c.loopFix(loopParams);
        });
      } else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) {
        swiper.controller.control.loopFix(loopParams);
      }
    }
    swiper.emit("loopFix");
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/loop/loopDestroy.js
  init_live_reload();
  function loopDestroy() {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    if (!params.loop || swiper.virtual && swiper.params.virtual.enabled)
      return;
    swiper.recalcSlides();
    const newSlidesOrder = [];
    swiper.slides.forEach((slideEl) => {
      const index = typeof slideEl.swiperSlideIndex === "undefined" ? slideEl.getAttribute("data-swiper-slide-index") * 1 : slideEl.swiperSlideIndex;
      newSlidesOrder[index] = slideEl;
    });
    swiper.slides.forEach((slideEl) => {
      slideEl.removeAttribute("data-swiper-slide-index");
    });
    newSlidesOrder.forEach((slideEl) => {
      slidesEl.append(slideEl);
    });
    swiper.recalcSlides();
    swiper.slideTo(swiper.realIndex, 0);
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/loop/index.js
  var loop_default = {
    loopCreate,
    loopFix,
    loopDestroy
  };

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/grab-cursor/index.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/grab-cursor/setGrabCursor.js
  init_live_reload();
  function setGrabCursor(moving) {
    const swiper = this;
    if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode)
      return;
    const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
    if (swiper.isElement) {
      swiper.__preventObserver__ = true;
    }
    el.style.cursor = "move";
    el.style.cursor = moving ? "grabbing" : "grab";
    if (swiper.isElement) {
      requestAnimationFrame(() => {
        swiper.__preventObserver__ = false;
      });
    }
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/grab-cursor/unsetGrabCursor.js
  init_live_reload();
  function unsetGrabCursor() {
    const swiper = this;
    if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
      return;
    }
    if (swiper.isElement) {
      swiper.__preventObserver__ = true;
    }
    swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
    if (swiper.isElement) {
      requestAnimationFrame(() => {
        swiper.__preventObserver__ = false;
      });
    }
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/grab-cursor/index.js
  var grab_cursor_default = {
    setGrabCursor,
    unsetGrabCursor
  };

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/events/index.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/events/onTouchStart.js
  init_live_reload();
  function closestElement(selector3, base = this) {
    function __closestFrom(el) {
      if (!el || el === getDocument() || el === getWindow())
        return null;
      if (el.assignedSlot)
        el = el.assignedSlot;
      const found = el.closest(selector3);
      if (!found && !el.getRootNode) {
        return null;
      }
      return found || __closestFrom(el.getRootNode().host);
    }
    return __closestFrom(base);
  }
  function onTouchStart(event2) {
    const swiper = this;
    const document2 = getDocument();
    const window2 = getWindow();
    const data = swiper.touchEventsData;
    data.evCache.push(event2);
    const {
      params,
      touches,
      enabled
    } = swiper;
    if (!enabled)
      return;
    if (!params.simulateTouch && event2.pointerType === "mouse")
      return;
    if (swiper.animating && params.preventInteractionOnTransition) {
      return;
    }
    if (!swiper.animating && params.cssMode && params.loop) {
      swiper.loopFix();
    }
    let e2 = event2;
    if (e2.originalEvent)
      e2 = e2.originalEvent;
    let targetEl = e2.target;
    if (params.touchEventsTarget === "wrapper") {
      if (!swiper.wrapperEl.contains(targetEl))
        return;
    }
    if ("which" in e2 && e2.which === 3)
      return;
    if ("button" in e2 && e2.button > 0)
      return;
    if (data.isTouched && data.isMoved)
      return;
    const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
    const eventPath = event2.composedPath ? event2.composedPath() : event2.path;
    if (swipingClassHasValue && e2.target && e2.target.shadowRoot && eventPath) {
      targetEl = eventPath[0];
    }
    const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
    const isTargetShadow = !!(e2.target && e2.target.shadowRoot);
    if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
      swiper.allowClick = true;
      return;
    }
    if (params.swipeHandler) {
      if (!targetEl.closest(params.swipeHandler))
        return;
    }
    touches.currentX = e2.pageX;
    touches.currentY = e2.pageY;
    const startX = touches.currentX;
    const startY = touches.currentY;
    const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
    const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
    if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window2.innerWidth - edgeSwipeThreshold)) {
      if (edgeSwipeDetection === "prevent") {
        event2.preventDefault();
      } else {
        return;
      }
    }
    Object.assign(data, {
      isTouched: true,
      isMoved: false,
      allowTouchCallbacks: true,
      isScrolling: void 0,
      startMoving: void 0
    });
    touches.startX = startX;
    touches.startY = startY;
    data.touchStartTime = now();
    swiper.allowClick = true;
    swiper.updateSize();
    swiper.swipeDirection = void 0;
    if (params.threshold > 0)
      data.allowThresholdMove = false;
    let preventDefault = true;
    if (targetEl.matches(data.focusableElements)) {
      preventDefault = false;
      if (targetEl.nodeName === "SELECT") {
        data.isTouched = false;
      }
    }
    if (document2.activeElement && document2.activeElement.matches(data.focusableElements) && document2.activeElement !== targetEl) {
      document2.activeElement.blur();
    }
    const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
    if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) {
      e2.preventDefault();
    }
    if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
      swiper.freeMode.onTouchStart();
    }
    swiper.emit("touchStart", e2);
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/events/onTouchMove.js
  init_live_reload();
  function onTouchMove(event2) {
    const document2 = getDocument();
    const swiper = this;
    const data = swiper.touchEventsData;
    const {
      params,
      touches,
      rtlTranslate: rtl,
      enabled
    } = swiper;
    if (!enabled)
      return;
    if (!params.simulateTouch && event2.pointerType === "mouse")
      return;
    let e2 = event2;
    if (e2.originalEvent)
      e2 = e2.originalEvent;
    if (!data.isTouched) {
      if (data.startMoving && data.isScrolling) {
        swiper.emit("touchMoveOpposite", e2);
      }
      return;
    }
    const pointerIndex = data.evCache.findIndex((cachedEv) => cachedEv.pointerId === e2.pointerId);
    if (pointerIndex >= 0)
      data.evCache[pointerIndex] = e2;
    const targetTouch = data.evCache.length > 1 ? data.evCache[0] : e2;
    const pageX = targetTouch.pageX;
    const pageY = targetTouch.pageY;
    if (e2.preventedByNestedSwiper) {
      touches.startX = pageX;
      touches.startY = pageY;
      return;
    }
    if (!swiper.allowTouchMove) {
      if (!e2.target.matches(data.focusableElements)) {
        swiper.allowClick = false;
      }
      if (data.isTouched) {
        Object.assign(touches, {
          startX: pageX,
          startY: pageY,
          prevX: swiper.touches.currentX,
          prevY: swiper.touches.currentY,
          currentX: pageX,
          currentY: pageY
        });
        data.touchStartTime = now();
      }
      return;
    }
    if (params.touchReleaseOnEdges && !params.loop) {
      if (swiper.isVertical()) {
        if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
          data.isTouched = false;
          data.isMoved = false;
          return;
        }
      } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
        return;
      }
    }
    if (document2.activeElement) {
      if (e2.target === document2.activeElement && e2.target.matches(data.focusableElements)) {
        data.isMoved = true;
        swiper.allowClick = false;
        return;
      }
    }
    if (data.allowTouchCallbacks) {
      swiper.emit("touchMove", e2);
    }
    if (e2.targetTouches && e2.targetTouches.length > 1)
      return;
    touches.currentX = pageX;
    touches.currentY = pageY;
    const diffX = touches.currentX - touches.startX;
    const diffY = touches.currentY - touches.startY;
    if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold)
      return;
    if (typeof data.isScrolling === "undefined") {
      let touchAngle;
      if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
        data.isScrolling = false;
      } else {
        if (diffX * diffX + diffY * diffY >= 25) {
          touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
          data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
        }
      }
    }
    if (data.isScrolling) {
      swiper.emit("touchMoveOpposite", e2);
    }
    if (typeof data.startMoving === "undefined") {
      if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
        data.startMoving = true;
      }
    }
    if (data.isScrolling || swiper.zoom && swiper.params.zoom && swiper.params.zoom.enabled && data.evCache.length > 1) {
      data.isTouched = false;
      return;
    }
    if (!data.startMoving) {
      return;
    }
    swiper.allowClick = false;
    if (!params.cssMode && e2.cancelable) {
      e2.preventDefault();
    }
    if (params.touchMoveStopPropagation && !params.nested) {
      e2.stopPropagation();
    }
    let diff = swiper.isHorizontal() ? diffX : diffY;
    let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
    if (params.oneWayMovement) {
      diff = Math.abs(diff) * (rtl ? 1 : -1);
      touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
    }
    touches.diff = diff;
    diff *= params.touchRatio;
    if (rtl) {
      diff = -diff;
      touchesDiff = -touchesDiff;
    }
    const prevTouchesDirection = swiper.touchesDirection;
    swiper.swipeDirection = diff > 0 ? "prev" : "next";
    swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
    const isLoop = swiper.params.loop && !params.cssMode;
    if (!data.isMoved) {
      if (isLoop) {
        swiper.loopFix({
          direction: swiper.swipeDirection
        });
      }
      data.startTranslate = swiper.getTranslate();
      swiper.setTransition(0);
      if (swiper.animating) {
        const evt = new window.CustomEvent("transitionend", {
          bubbles: true,
          cancelable: true
        });
        swiper.wrapperEl.dispatchEvent(evt);
      }
      data.allowMomentumBounce = false;
      if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
        swiper.setGrabCursor(true);
      }
      swiper.emit("sliderFirstMove", e2);
    }
    let loopFixed;
    if (data.isMoved && prevTouchesDirection !== swiper.touchesDirection && isLoop && Math.abs(diff) >= 1) {
      swiper.loopFix({
        direction: swiper.swipeDirection,
        setTranslate: true
      });
      loopFixed = true;
    }
    swiper.emit("sliderMove", e2);
    data.isMoved = true;
    data.currentTranslate = diff + data.startTranslate;
    let disableParentSwiper = true;
    let resistanceRatio = params.resistanceRatio;
    if (params.touchReleaseOnEdges) {
      resistanceRatio = 0;
    }
    if (diff > 0) {
      if (isLoop && !loopFixed && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.size / 2 : swiper.minTranslate())) {
        swiper.loopFix({
          direction: "prev",
          setTranslate: true,
          activeSlideIndex: 0
        });
      }
      if (data.currentTranslate > swiper.minTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) {
          data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
        }
      }
    } else if (diff < 0) {
      if (isLoop && !loopFixed && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.size / 2 : swiper.maxTranslate())) {
        swiper.loopFix({
          direction: "next",
          setTranslate: true,
          activeSlideIndex: swiper.slides.length - (params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
        });
      }
      if (data.currentTranslate < swiper.maxTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) {
          data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
        }
      }
    }
    if (disableParentSwiper) {
      e2.preventedByNestedSwiper = true;
    }
    if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }
    if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }
    if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
      data.currentTranslate = data.startTranslate;
    }
    if (params.threshold > 0) {
      if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
        if (!data.allowThresholdMove) {
          data.allowThresholdMove = true;
          touches.startX = touches.currentX;
          touches.startY = touches.currentY;
          data.currentTranslate = data.startTranslate;
          touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
          return;
        }
      } else {
        data.currentTranslate = data.startTranslate;
        return;
      }
    }
    if (!params.followFinger || params.cssMode)
      return;
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) {
      swiper.freeMode.onTouchMove();
    }
    swiper.updateProgress(data.currentTranslate);
    swiper.setTranslate(data.currentTranslate);
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/events/onTouchEnd.js
  init_live_reload();
  function onTouchEnd(event2) {
    const swiper = this;
    const data = swiper.touchEventsData;
    const pointerIndex = data.evCache.findIndex((cachedEv) => cachedEv.pointerId === event2.pointerId);
    if (pointerIndex >= 0) {
      data.evCache.splice(pointerIndex, 1);
    }
    if (["pointercancel", "pointerout", "pointerleave"].includes(event2.type)) {
      const proceed = event2.type === "pointercancel" && (swiper.browser.isSafari || swiper.browser.isWebView);
      if (!proceed) {
        return;
      }
    }
    const {
      params,
      touches,
      rtlTranslate: rtl,
      slidesGrid,
      enabled
    } = swiper;
    if (!enabled)
      return;
    if (!params.simulateTouch && event2.pointerType === "mouse")
      return;
    let e2 = event2;
    if (e2.originalEvent)
      e2 = e2.originalEvent;
    if (data.allowTouchCallbacks) {
      swiper.emit("touchEnd", e2);
    }
    data.allowTouchCallbacks = false;
    if (!data.isTouched) {
      if (data.isMoved && params.grabCursor) {
        swiper.setGrabCursor(false);
      }
      data.isMoved = false;
      data.startMoving = false;
      return;
    }
    if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(false);
    }
    const touchEndTime = now();
    const timeDiff = touchEndTime - data.touchStartTime;
    if (swiper.allowClick) {
      const pathTree = e2.path || e2.composedPath && e2.composedPath();
      swiper.updateClickedSlide(pathTree && pathTree[0] || e2.target);
      swiper.emit("tap click", e2);
      if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
        swiper.emit("doubleTap doubleClick", e2);
      }
    }
    data.lastClickTime = now();
    nextTick(() => {
      if (!swiper.destroyed)
        swiper.allowClick = true;
    });
    if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      return;
    }
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    let currentPos;
    if (params.followFinger) {
      currentPos = rtl ? swiper.translate : -swiper.translate;
    } else {
      currentPos = -data.currentTranslate;
    }
    if (params.cssMode) {
      return;
    }
    if (swiper.params.freeMode && params.freeMode.enabled) {
      swiper.freeMode.onTouchEnd({
        currentPos
      });
      return;
    }
    let stopIndex = 0;
    let groupSize = swiper.slidesSizesGrid[0];
    for (let i2 = 0; i2 < slidesGrid.length; i2 += i2 < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
      const increment2 = i2 < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
      if (typeof slidesGrid[i2 + increment2] !== "undefined") {
        if (currentPos >= slidesGrid[i2] && currentPos < slidesGrid[i2 + increment2]) {
          stopIndex = i2;
          groupSize = slidesGrid[i2 + increment2] - slidesGrid[i2];
        }
      } else if (currentPos >= slidesGrid[i2]) {
        stopIndex = i2;
        groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
      }
    }
    let rewindFirstIndex = null;
    let rewindLastIndex = null;
    if (params.rewind) {
      if (swiper.isBeginning) {
        rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
      } else if (swiper.isEnd) {
        rewindFirstIndex = 0;
      }
    }
    const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
    const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (timeDiff > params.longSwipesMs) {
      if (!params.longSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      if (swiper.swipeDirection === "next") {
        if (ratio >= params.longSwipesRatio)
          swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);
        else
          swiper.slideTo(stopIndex);
      }
      if (swiper.swipeDirection === "prev") {
        if (ratio > 1 - params.longSwipesRatio) {
          swiper.slideTo(stopIndex + increment);
        } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
          swiper.slideTo(rewindLastIndex);
        } else {
          swiper.slideTo(stopIndex);
        }
      }
    } else {
      if (!params.shortSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      const isNavButtonTarget = swiper.navigation && (e2.target === swiper.navigation.nextEl || e2.target === swiper.navigation.prevEl);
      if (!isNavButtonTarget) {
        if (swiper.swipeDirection === "next") {
          swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
        }
        if (swiper.swipeDirection === "prev") {
          swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
        }
      } else if (e2.target === swiper.navigation.nextEl) {
        swiper.slideTo(stopIndex + increment);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/events/onResize.js
  init_live_reload();
  var timeout;
  function onResize() {
    const swiper = this;
    const {
      params,
      el
    } = swiper;
    if (el && el.offsetWidth === 0)
      return;
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }
    const {
      allowSlideNext,
      allowSlidePrev,
      snapGrid
    } = swiper;
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    swiper.allowSlideNext = true;
    swiper.allowSlidePrev = true;
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateSlidesClasses();
    const isVirtualLoop = isVirtual && params.loop;
    if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) {
      swiper.slideTo(swiper.slides.length - 1, 0, false, true);
    } else {
      if (swiper.params.loop && !isVirtual) {
        swiper.slideToLoop(swiper.realIndex, 0, false, true);
      } else {
        swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
    }
    if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
          swiper.autoplay.resume();
        }
      }, 500);
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/events/onClick.js
  init_live_reload();
  function onClick(e2) {
    const swiper = this;
    if (!swiper.enabled)
      return;
    if (!swiper.allowClick) {
      if (swiper.params.preventClicks)
        e2.preventDefault();
      if (swiper.params.preventClicksPropagation && swiper.animating) {
        e2.stopPropagation();
        e2.stopImmediatePropagation();
      }
    }
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/events/onScroll.js
  init_live_reload();
  function onScroll() {
    const swiper = this;
    const {
      wrapperEl,
      rtlTranslate,
      enabled
    } = swiper;
    if (!enabled)
      return;
    swiper.previousTranslate = swiper.translate;
    if (swiper.isHorizontal()) {
      swiper.translate = -wrapperEl.scrollLeft;
    } else {
      swiper.translate = -wrapperEl.scrollTop;
    }
    if (swiper.translate === 0)
      swiper.translate = 0;
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
    }
    if (newProgress !== swiper.progress) {
      swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
    }
    swiper.emit("setTranslate", swiper.translate, false);
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/events/onLoad.js
  init_live_reload();
  function onLoad(e2) {
    const swiper = this;
    processLazyPreloader(swiper, e2.target);
    swiper.update();
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/events/index.js
  var dummyEventAttached = false;
  function dummyEventListener() {
  }
  var events = (swiper, method) => {
    const document2 = getDocument();
    const {
      params,
      el,
      wrapperEl,
      device
    } = swiper;
    const capture = !!params.nested;
    const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
    const swiperMethod = method;
    el[domMethod]("pointerdown", swiper.onTouchStart, {
      passive: false
    });
    document2[domMethod]("pointermove", swiper.onTouchMove, {
      passive: false,
      capture
    });
    document2[domMethod]("pointerup", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("pointercancel", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("pointerout", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("pointerleave", swiper.onTouchEnd, {
      passive: true
    });
    if (params.preventClicks || params.preventClicksPropagation) {
      el[domMethod]("click", swiper.onClick, true);
    }
    if (params.cssMode) {
      wrapperEl[domMethod]("scroll", swiper.onScroll);
    }
    if (params.updateOnWindowResize) {
      swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true);
    } else {
      swiper[swiperMethod]("observerUpdate", onResize, true);
    }
    el[domMethod]("load", swiper.onLoad, {
      capture: true
    });
  };
  function attachEvents() {
    const swiper = this;
    const document2 = getDocument();
    const {
      params
    } = swiper;
    swiper.onTouchStart = onTouchStart.bind(swiper);
    swiper.onTouchMove = onTouchMove.bind(swiper);
    swiper.onTouchEnd = onTouchEnd.bind(swiper);
    if (params.cssMode) {
      swiper.onScroll = onScroll.bind(swiper);
    }
    swiper.onClick = onClick.bind(swiper);
    swiper.onLoad = onLoad.bind(swiper);
    if (!dummyEventAttached) {
      document2.addEventListener("touchstart", dummyEventListener);
      dummyEventAttached = true;
    }
    events(swiper, "on");
  }
  function detachEvents() {
    const swiper = this;
    events(swiper, "off");
  }
  var events_default = {
    attachEvents,
    detachEvents
  };

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/breakpoints/index.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/breakpoints/setBreakpoint.js
  init_live_reload();
  var isGridEnabled = (swiper, params) => {
    return swiper.grid && params.grid && params.grid.rows > 1;
  };
  function setBreakpoint() {
    const swiper = this;
    const {
      realIndex,
      initialized,
      params,
      el
    } = swiper;
    const breakpoints = params.breakpoints;
    if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0)
      return;
    const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
    if (!breakpoint || swiper.currentBreakpoint === breakpoint)
      return;
    const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
    const breakpointParams = breakpointOnlyParams || swiper.originalParams;
    const wasMultiRow = isGridEnabled(swiper, params);
    const isMultiRow = isGridEnabled(swiper, breakpointParams);
    const wasEnabled = params.enabled;
    if (wasMultiRow && !isMultiRow) {
      el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
      swiper.emitContainerClasses();
    } else if (!wasMultiRow && isMultiRow) {
      el.classList.add(`${params.containerModifierClass}grid`);
      if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") {
        el.classList.add(`${params.containerModifierClass}grid-column`);
      }
      swiper.emitContainerClasses();
    }
    ["navigation", "pagination", "scrollbar"].forEach((prop) => {
      const wasModuleEnabled = params[prop] && params[prop].enabled;
      const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
      if (wasModuleEnabled && !isModuleEnabled) {
        swiper[prop].disable();
      }
      if (!wasModuleEnabled && isModuleEnabled) {
        swiper[prop].enable();
      }
    });
    const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
    const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
    if (directionChanged && initialized) {
      swiper.changeDirection();
    }
    extend2(swiper.params, breakpointParams);
    const isEnabled = swiper.params.enabled;
    Object.assign(swiper, {
      allowTouchMove: swiper.params.allowTouchMove,
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev
    });
    if (wasEnabled && !isEnabled) {
      swiper.disable();
    } else if (!wasEnabled && isEnabled) {
      swiper.enable();
    }
    swiper.currentBreakpoint = breakpoint;
    swiper.emit("_beforeBreakpoint", breakpointParams);
    if (needsReLoop && initialized) {
      swiper.loopDestroy();
      swiper.loopCreate(realIndex);
      swiper.updateSlides();
    }
    swiper.emit("breakpoint", breakpointParams);
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/breakpoints/getBreakpoint.js
  init_live_reload();
  function getBreakpoint(breakpoints, base = "window", containerEl) {
    if (!breakpoints || base === "container" && !containerEl)
      return void 0;
    let breakpoint = false;
    const window2 = getWindow();
    const currentHeight = base === "window" ? window2.innerHeight : containerEl.clientHeight;
    const points = Object.keys(breakpoints).map((point) => {
      if (typeof point === "string" && point.indexOf("@") === 0) {
        const minRatio = parseFloat(point.substr(1));
        const value = currentHeight * minRatio;
        return {
          value,
          point
        };
      }
      return {
        value: point,
        point
      };
    });
    points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
    for (let i2 = 0; i2 < points.length; i2 += 1) {
      const {
        point,
        value
      } = points[i2];
      if (base === "window") {
        if (window2.matchMedia(`(min-width: ${value}px)`).matches) {
          breakpoint = point;
        }
      } else if (value <= containerEl.clientWidth) {
        breakpoint = point;
      }
    }
    return breakpoint || "max";
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/breakpoints/index.js
  var breakpoints_default = {
    setBreakpoint,
    getBreakpoint
  };

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/classes/index.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/classes/addClasses.js
  init_live_reload();
  function prepareClasses(entries, prefix) {
    const resultClasses = [];
    entries.forEach((item) => {
      if (typeof item === "object") {
        Object.keys(item).forEach((classNames) => {
          if (item[classNames]) {
            resultClasses.push(prefix + classNames);
          }
        });
      } else if (typeof item === "string") {
        resultClasses.push(prefix + item);
      }
    });
    return resultClasses;
  }
  function addClasses() {
    const swiper = this;
    const {
      classNames,
      params,
      rtl,
      el,
      device
    } = swiper;
    const suffixes = prepareClasses(["initialized", params.direction, {
      "free-mode": swiper.params.freeMode && params.freeMode.enabled
    }, {
      "autoheight": params.autoHeight
    }, {
      "rtl": rtl
    }, {
      "grid": params.grid && params.grid.rows > 1
    }, {
      "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
    }, {
      "android": device.android
    }, {
      "ios": device.ios
    }, {
      "css-mode": params.cssMode
    }, {
      "centered": params.cssMode && params.centeredSlides
    }, {
      "watch-progress": params.watchSlidesProgress
    }], params.containerModifierClass);
    classNames.push(...suffixes);
    el.classList.add(...classNames);
    swiper.emitContainerClasses();
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/classes/removeClasses.js
  init_live_reload();
  function removeClasses() {
    const swiper = this;
    const {
      el,
      classNames
    } = swiper;
    el.classList.remove(...classNames);
    swiper.emitContainerClasses();
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/classes/index.js
  var classes_default = {
    addClasses,
    removeClasses
  };

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/check-overflow/index.js
  init_live_reload();
  function checkOverflow() {
    const swiper = this;
    const {
      isLocked: wasLocked,
      params
    } = swiper;
    const {
      slidesOffsetBefore
    } = params;
    if (slidesOffsetBefore) {
      const lastSlideIndex = swiper.slides.length - 1;
      const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
      swiper.isLocked = swiper.size > lastSlideRightEdge;
    } else {
      swiper.isLocked = swiper.snapGrid.length === 1;
    }
    if (params.allowSlideNext === true) {
      swiper.allowSlideNext = !swiper.isLocked;
    }
    if (params.allowSlidePrev === true) {
      swiper.allowSlidePrev = !swiper.isLocked;
    }
    if (wasLocked && wasLocked !== swiper.isLocked) {
      swiper.isEnd = false;
    }
    if (wasLocked !== swiper.isLocked) {
      swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
  }
  var check_overflow_default = {
    checkOverflow
  };

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/defaults.js
  init_live_reload();
  var defaults_default = {
    init: true,
    direction: "horizontal",
    oneWayMovement: false,
    touchEventsTarget: "wrapper",
    initialSlide: 0,
    speed: 300,
    cssMode: false,
    updateOnWindowResize: true,
    resizeObserver: true,
    nested: false,
    createElements: false,
    enabled: true,
    focusableElements: "input, select, option, textarea, button, video, label",
    // Overrides
    width: null,
    height: null,
    //
    preventInteractionOnTransition: false,
    // ssr
    userAgent: null,
    url: null,
    // To support iOS's swipe-to-go-back gesture (when being used in-app).
    edgeSwipeDetection: false,
    edgeSwipeThreshold: 20,
    // Autoheight
    autoHeight: false,
    // Set wrapper width
    setWrapperSize: false,
    // Virtual Translate
    virtualTranslate: false,
    // Effects
    effect: "slide",
    // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
    // Breakpoints
    breakpoints: void 0,
    breakpointsBase: "window",
    // Slides grid
    spaceBetween: 0,
    slidesPerView: 1,
    slidesPerGroup: 1,
    slidesPerGroupSkip: 0,
    slidesPerGroupAuto: false,
    centeredSlides: false,
    centeredSlidesBounds: false,
    slidesOffsetBefore: 0,
    // in px
    slidesOffsetAfter: 0,
    // in px
    normalizeSlideIndex: true,
    centerInsufficientSlides: false,
    // Disable swiper and hide navigation when container not overflow
    watchOverflow: true,
    // Round length
    roundLengths: false,
    // Touches
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: true,
    shortSwipes: true,
    longSwipes: true,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: true,
    allowTouchMove: true,
    threshold: 5,
    touchMoveStopPropagation: false,
    touchStartPreventDefault: true,
    touchStartForcePreventDefault: false,
    touchReleaseOnEdges: false,
    // Unique Navigation Elements
    uniqueNavElements: true,
    // Resistance
    resistance: true,
    resistanceRatio: 0.85,
    // Progress
    watchSlidesProgress: false,
    // Cursor
    grabCursor: false,
    // Clicks
    preventClicks: true,
    preventClicksPropagation: true,
    slideToClickedSlide: false,
    // loop
    loop: false,
    loopedSlides: null,
    loopPreventsSliding: true,
    // rewind
    rewind: false,
    // Swiping/no swiping
    allowSlidePrev: true,
    allowSlideNext: true,
    swipeHandler: null,
    // '.swipe-handler',
    noSwiping: true,
    noSwipingClass: "swiper-no-swiping",
    noSwipingSelector: null,
    // Passive Listeners
    passiveListeners: true,
    maxBackfaceHiddenSlides: 10,
    // NS
    containerModifierClass: "swiper-",
    // NEW
    slideClass: "swiper-slide",
    slideActiveClass: "swiper-slide-active",
    slideVisibleClass: "swiper-slide-visible",
    slideNextClass: "swiper-slide-next",
    slidePrevClass: "swiper-slide-prev",
    wrapperClass: "swiper-wrapper",
    lazyPreloaderClass: "swiper-lazy-preloader",
    lazyPreloadPrevNext: 0,
    // Callbacks
    runCallbacksOnInit: true,
    // Internals
    _emitClasses: false
  };

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/moduleExtendParams.js
  init_live_reload();
  function moduleExtendParams(params, allModulesParams) {
    return function extendParams(obj = {}) {
      const moduleParamName = Object.keys(obj)[0];
      const moduleParams = obj[moduleParamName];
      if (typeof moduleParams !== "object" || moduleParams === null) {
        extend2(allModulesParams, obj);
        return;
      }
      if (["navigation", "pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
        params[moduleParamName] = {
          auto: true
        };
      }
      if (!(moduleParamName in params && "enabled" in moduleParams)) {
        extend2(allModulesParams, obj);
        return;
      }
      if (params[moduleParamName] === true) {
        params[moduleParamName] = {
          enabled: true
        };
      }
      if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) {
        params[moduleParamName].enabled = true;
      }
      if (!params[moduleParamName])
        params[moduleParamName] = {
          enabled: false
        };
      extend2(allModulesParams, obj);
    };
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/core/core.js
  var prototypes = {
    eventsEmitter: events_emitter_default,
    update: update_default,
    translate: translate_default,
    transition: transition_default,
    slide: slide_default,
    loop: loop_default,
    grabCursor: grab_cursor_default,
    events: events_default,
    breakpoints: breakpoints_default,
    checkOverflow: check_overflow_default,
    classes: classes_default
  };
  var extendedDefaults = {};
  var Swiper = class {
    constructor(...args) {
      let el;
      let params;
      if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") {
        params = args[0];
      } else {
        [el, params] = args;
      }
      if (!params)
        params = {};
      params = extend2({}, params);
      if (el && !params.el)
        params.el = el;
      const document2 = getDocument();
      if (params.el && typeof params.el === "string" && document2.querySelectorAll(params.el).length > 1) {
        const swipers = [];
        document2.querySelectorAll(params.el).forEach((containerEl) => {
          const newParams = extend2({}, params, {
            el: containerEl
          });
          swipers.push(new Swiper(newParams));
        });
        return swipers;
      }
      const swiper = this;
      swiper.__swiper__ = true;
      swiper.support = getSupport();
      swiper.device = getDevice({
        userAgent: params.userAgent
      });
      swiper.browser = getBrowser();
      swiper.eventsListeners = {};
      swiper.eventsAnyListeners = [];
      swiper.modules = [...swiper.__modules__];
      if (params.modules && Array.isArray(params.modules)) {
        swiper.modules.push(...params.modules);
      }
      const allModulesParams = {};
      swiper.modules.forEach((mod) => {
        mod({
          params,
          swiper,
          extendParams: moduleExtendParams(params, allModulesParams),
          on: swiper.on.bind(swiper),
          once: swiper.once.bind(swiper),
          off: swiper.off.bind(swiper),
          emit: swiper.emit.bind(swiper)
        });
      });
      const swiperParams = extend2({}, defaults_default, allModulesParams);
      swiper.params = extend2({}, swiperParams, extendedDefaults, params);
      swiper.originalParams = extend2({}, swiper.params);
      swiper.passedParams = extend2({}, params);
      if (swiper.params && swiper.params.on) {
        Object.keys(swiper.params.on).forEach((eventName) => {
          swiper.on(eventName, swiper.params.on[eventName]);
        });
      }
      if (swiper.params && swiper.params.onAny) {
        swiper.onAny(swiper.params.onAny);
      }
      Object.assign(swiper, {
        enabled: swiper.params.enabled,
        el,
        // Classes
        classNames: [],
        // Slides
        slides: [],
        slidesGrid: [],
        snapGrid: [],
        slidesSizesGrid: [],
        // isDirection
        isHorizontal() {
          return swiper.params.direction === "horizontal";
        },
        isVertical() {
          return swiper.params.direction === "vertical";
        },
        // Indexes
        activeIndex: 0,
        realIndex: 0,
        //
        isBeginning: true,
        isEnd: false,
        // Props
        translate: 0,
        previousTranslate: 0,
        progress: 0,
        velocity: 0,
        animating: false,
        // Locks
        allowSlideNext: swiper.params.allowSlideNext,
        allowSlidePrev: swiper.params.allowSlidePrev,
        // Touch Events
        touchEventsData: {
          isTouched: void 0,
          isMoved: void 0,
          allowTouchCallbacks: void 0,
          touchStartTime: void 0,
          isScrolling: void 0,
          currentTranslate: void 0,
          startTranslate: void 0,
          allowThresholdMove: void 0,
          // Form elements to match
          focusableElements: swiper.params.focusableElements,
          // Last click time
          lastClickTime: 0,
          clickTimeout: void 0,
          // Velocities
          velocities: [],
          allowMomentumBounce: void 0,
          startMoving: void 0,
          evCache: []
        },
        // Clicks
        allowClick: true,
        // Touches
        allowTouchMove: swiper.params.allowTouchMove,
        touches: {
          startX: 0,
          startY: 0,
          currentX: 0,
          currentY: 0,
          diff: 0
        },
        // Images
        imagesToLoad: [],
        imagesLoaded: 0
      });
      swiper.emit("_swiper");
      if (swiper.params.init) {
        swiper.init();
      }
      return swiper;
    }
    getSlideIndex(slideEl) {
      const {
        slidesEl,
        params
      } = this;
      const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
      const firstSlideIndex = elementIndex(slides[0]);
      return elementIndex(slideEl) - firstSlideIndex;
    }
    getSlideIndexByData(index) {
      return this.getSlideIndex(this.slides.filter((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === index)[0]);
    }
    recalcSlides() {
      const swiper = this;
      const {
        slidesEl,
        params
      } = swiper;
      swiper.slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
    }
    enable() {
      const swiper = this;
      if (swiper.enabled)
        return;
      swiper.enabled = true;
      if (swiper.params.grabCursor) {
        swiper.setGrabCursor();
      }
      swiper.emit("enable");
    }
    disable() {
      const swiper = this;
      if (!swiper.enabled)
        return;
      swiper.enabled = false;
      if (swiper.params.grabCursor) {
        swiper.unsetGrabCursor();
      }
      swiper.emit("disable");
    }
    setProgress(progress, speed) {
      const swiper = this;
      progress = Math.min(Math.max(progress, 0), 1);
      const min = swiper.minTranslate();
      const max = swiper.maxTranslate();
      const current = (max - min) * progress + min;
      swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    emitContainerClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el)
        return;
      const cls = swiper.el.className.split(" ").filter((className) => {
        return className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
      });
      swiper.emit("_containerClasses", cls.join(" "));
    }
    getSlideClasses(slideEl) {
      const swiper = this;
      if (swiper.destroyed)
        return "";
      return slideEl.className.split(" ").filter((className) => {
        return className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0;
      }).join(" ");
    }
    emitSlidesClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el)
        return;
      const updates = [];
      swiper.slides.forEach((slideEl) => {
        const classNames = swiper.getSlideClasses(slideEl);
        updates.push({
          slideEl,
          classNames
        });
        swiper.emit("_slideClass", slideEl, classNames);
      });
      swiper.emit("_slideClasses", updates);
    }
    slidesPerViewDynamic(view = "current", exact = false) {
      const swiper = this;
      const {
        params,
        slides,
        slidesGrid,
        slidesSizesGrid,
        size: swiperSize,
        activeIndex
      } = swiper;
      let spv = 1;
      if (params.centeredSlides) {
        let slideSize = slides[activeIndex].swiperSlideSize;
        let breakLoop;
        for (let i2 = activeIndex + 1; i2 < slides.length; i2 += 1) {
          if (slides[i2] && !breakLoop) {
            slideSize += slides[i2].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize)
              breakLoop = true;
          }
        }
        for (let i2 = activeIndex - 1; i2 >= 0; i2 -= 1) {
          if (slides[i2] && !breakLoop) {
            slideSize += slides[i2].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize)
              breakLoop = true;
          }
        }
      } else {
        if (view === "current") {
          for (let i2 = activeIndex + 1; i2 < slides.length; i2 += 1) {
            const slideInView = exact ? slidesGrid[i2] + slidesSizesGrid[i2] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i2] - slidesGrid[activeIndex] < swiperSize;
            if (slideInView) {
              spv += 1;
            }
          }
        } else {
          for (let i2 = activeIndex - 1; i2 >= 0; i2 -= 1) {
            const slideInView = slidesGrid[activeIndex] - slidesGrid[i2] < swiperSize;
            if (slideInView) {
              spv += 1;
            }
          }
        }
      }
      return spv;
    }
    update() {
      const swiper = this;
      if (!swiper || swiper.destroyed)
        return;
      const {
        snapGrid,
        params
      } = swiper;
      if (params.breakpoints) {
        swiper.setBreakpoint();
      }
      [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach((imageEl) => {
        if (imageEl.complete) {
          processLazyPreloader(swiper, imageEl);
        }
      });
      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();
      function setTranslate2() {
        const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
        const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
        swiper.setTranslate(newTranslate);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }
      let translated;
      if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
        setTranslate2();
        if (swiper.params.autoHeight) {
          swiper.updateAutoHeight();
        }
      } else {
        if ((swiper.params.slidesPerView === "auto" || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
          translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
        } else {
          translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
        }
        if (!translated) {
          setTranslate2();
        }
      }
      if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
        swiper.checkOverflow();
      }
      swiper.emit("update");
    }
    changeDirection(newDirection, needUpdate = true) {
      const swiper = this;
      const currentDirection = swiper.params.direction;
      if (!newDirection) {
        newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
      }
      if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") {
        return swiper;
      }
      swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
      swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
      swiper.emitContainerClasses();
      swiper.params.direction = newDirection;
      swiper.slides.forEach((slideEl) => {
        if (newDirection === "vertical") {
          slideEl.style.width = "";
        } else {
          slideEl.style.height = "";
        }
      });
      swiper.emit("changeDirection");
      if (needUpdate)
        swiper.update();
      return swiper;
    }
    changeLanguageDirection(direction) {
      const swiper = this;
      if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr")
        return;
      swiper.rtl = direction === "rtl";
      swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
      if (swiper.rtl) {
        swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
        swiper.el.dir = "rtl";
      } else {
        swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
        swiper.el.dir = "ltr";
      }
      swiper.update();
    }
    mount(element) {
      const swiper = this;
      if (swiper.mounted)
        return true;
      let el = element || swiper.params.el;
      if (typeof el === "string") {
        el = document.querySelector(el);
      }
      if (!el) {
        return false;
      }
      el.swiper = swiper;
      if (el.shadowEl) {
        swiper.isElement = true;
      }
      const getWrapperSelector = () => {
        return `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
      };
      const getWrapper = () => {
        if (el && el.shadowRoot && el.shadowRoot.querySelector) {
          const res = el.shadowRoot.querySelector(getWrapperSelector());
          return res;
        }
        return elementChildren(el, getWrapperSelector())[0];
      };
      let wrapperEl = getWrapper();
      if (!wrapperEl && swiper.params.createElements) {
        wrapperEl = createElement("div", swiper.params.wrapperClass);
        el.append(wrapperEl);
        elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl) => {
          wrapperEl.append(slideEl);
        });
      }
      Object.assign(swiper, {
        el,
        wrapperEl,
        slidesEl: swiper.isElement ? el : wrapperEl,
        mounted: true,
        // RTL
        rtl: el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl",
        rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl"),
        wrongRTL: elementStyle(wrapperEl, "display") === "-webkit-box"
      });
      return true;
    }
    init(el) {
      const swiper = this;
      if (swiper.initialized)
        return swiper;
      const mounted = swiper.mount(el);
      if (mounted === false)
        return swiper;
      swiper.emit("beforeInit");
      if (swiper.params.breakpoints) {
        swiper.setBreakpoint();
      }
      swiper.addClasses();
      swiper.updateSize();
      swiper.updateSlides();
      if (swiper.params.watchOverflow) {
        swiper.checkOverflow();
      }
      if (swiper.params.grabCursor && swiper.enabled) {
        swiper.setGrabCursor();
      }
      if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
        swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true);
      } else {
        swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
      }
      if (swiper.params.loop) {
        swiper.loopCreate();
      }
      swiper.attachEvents();
      [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach((imageEl) => {
        if (imageEl.complete) {
          processLazyPreloader(swiper, imageEl);
        } else {
          imageEl.addEventListener("load", (e2) => {
            processLazyPreloader(swiper, e2.target);
          });
        }
      });
      preload(swiper);
      swiper.initialized = true;
      preload(swiper);
      swiper.emit("init");
      swiper.emit("afterInit");
      return swiper;
    }
    destroy(deleteInstance = true, cleanStyles = true) {
      const swiper = this;
      const {
        params,
        el,
        wrapperEl,
        slides
      } = swiper;
      if (typeof swiper.params === "undefined" || swiper.destroyed) {
        return null;
      }
      swiper.emit("beforeDestroy");
      swiper.initialized = false;
      swiper.detachEvents();
      if (params.loop) {
        swiper.loopDestroy();
      }
      if (cleanStyles) {
        swiper.removeClasses();
        el.removeAttribute("style");
        wrapperEl.removeAttribute("style");
        if (slides && slides.length) {
          slides.forEach((slideEl) => {
            slideEl.classList.remove(params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
            slideEl.removeAttribute("style");
            slideEl.removeAttribute("data-swiper-slide-index");
          });
        }
      }
      swiper.emit("destroy");
      Object.keys(swiper.eventsListeners).forEach((eventName) => {
        swiper.off(eventName);
      });
      if (deleteInstance !== false) {
        swiper.el.swiper = null;
        deleteProps(swiper);
      }
      swiper.destroyed = true;
      return null;
    }
    static extendDefaults(newDefaults) {
      extend2(extendedDefaults, newDefaults);
    }
    static get extendedDefaults() {
      return extendedDefaults;
    }
    static get defaults() {
      return defaults_default;
    }
    static installModule(mod) {
      if (!Swiper.prototype.__modules__)
        Swiper.prototype.__modules__ = [];
      const modules = Swiper.prototype.__modules__;
      if (typeof mod === "function" && modules.indexOf(mod) < 0) {
        modules.push(mod);
      }
    }
    static use(module) {
      if (Array.isArray(module)) {
        module.forEach((m) => Swiper.installModule(m));
        return Swiper;
      }
      Swiper.installModule(module);
      return Swiper;
    }
  };
  Object.keys(prototypes).forEach((prototypeGroup) => {
    Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
      Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
    });
  });
  Swiper.use([Resize, Observer2]);
  var core_default = Swiper;

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/virtual/virtual.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/keyboard/keyboard.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/mousewheel/mousewheel.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/navigation/navigation.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/shared/create-element-if-not-defined.js
  init_live_reload();
  function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
    if (swiper.params.createElements) {
      Object.keys(checkProps).forEach((key) => {
        if (!params[key] && params.auto === true) {
          let element = elementChildren(swiper.el, `.${checkProps[key]}`)[0];
          if (!element) {
            element = createElement("div", checkProps[key]);
            element.className = checkProps[key];
            swiper.el.append(element);
          }
          params[key] = element;
          originalParams[key] = element;
        }
      });
    }
    return params;
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/navigation/navigation.js
  function Navigation({
    swiper,
    extendParams,
    on,
    emit
  }) {
    extendParams({
      navigation: {
        nextEl: null,
        prevEl: null,
        hideOnClick: false,
        disabledClass: "swiper-button-disabled",
        hiddenClass: "swiper-button-hidden",
        lockClass: "swiper-button-lock",
        navigationDisabledClass: "swiper-navigation-disabled"
      }
    });
    swiper.navigation = {
      nextEl: null,
      prevEl: null
    };
    const makeElementsArray = (el) => {
      if (!Array.isArray(el))
        el = [el].filter((e2) => !!e2);
      return el;
    };
    function getEl(el) {
      let res;
      if (el && typeof el === "string" && swiper.isElement) {
        res = swiper.el.shadowRoot.querySelector(el);
        if (res)
          return res;
      }
      if (el) {
        if (typeof el === "string")
          res = [...document.querySelectorAll(el)];
        if (swiper.params.uniqueNavElements && typeof el === "string" && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) {
          res = swiper.el.querySelector(el);
        }
      }
      if (el && !res)
        return el;
      return res;
    }
    function toggleEl(el, disabled) {
      const params = swiper.params.navigation;
      el = makeElementsArray(el);
      el.forEach((subEl) => {
        if (subEl) {
          subEl.classList[disabled ? "add" : "remove"](...params.disabledClass.split(" "));
          if (subEl.tagName === "BUTTON")
            subEl.disabled = disabled;
          if (swiper.params.watchOverflow && swiper.enabled) {
            subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
          }
        }
      });
    }
    function update() {
      const {
        nextEl,
        prevEl
      } = swiper.navigation;
      if (swiper.params.loop) {
        toggleEl(prevEl, false);
        toggleEl(nextEl, false);
        return;
      }
      toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
      toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
    }
    function onPrevClick(e2) {
      e2.preventDefault();
      if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind)
        return;
      swiper.slidePrev();
      emit("navigationPrev");
    }
    function onNextClick(e2) {
      e2.preventDefault();
      if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind)
        return;
      swiper.slideNext();
      emit("navigationNext");
    }
    function init4() {
      const params = swiper.params.navigation;
      swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
        nextEl: "swiper-button-next",
        prevEl: "swiper-button-prev"
      });
      if (!(params.nextEl || params.prevEl))
        return;
      let nextEl = getEl(params.nextEl);
      let prevEl = getEl(params.prevEl);
      Object.assign(swiper.navigation, {
        nextEl,
        prevEl
      });
      nextEl = makeElementsArray(nextEl);
      prevEl = makeElementsArray(prevEl);
      const initButton = (el, dir) => {
        if (el) {
          el.addEventListener("click", dir === "next" ? onNextClick : onPrevClick);
        }
        if (!swiper.enabled && el) {
          el.classList.add(...params.lockClass.split(" "));
        }
      };
      nextEl.forEach((el) => initButton(el, "next"));
      prevEl.forEach((el) => initButton(el, "prev"));
    }
    function destroy() {
      let {
        nextEl,
        prevEl
      } = swiper.navigation;
      nextEl = makeElementsArray(nextEl);
      prevEl = makeElementsArray(prevEl);
      const destroyButton = (el, dir) => {
        el.removeEventListener("click", dir === "next" ? onNextClick : onPrevClick);
        el.classList.remove(...swiper.params.navigation.disabledClass.split(" "));
      };
      nextEl.forEach((el) => destroyButton(el, "next"));
      prevEl.forEach((el) => destroyButton(el, "prev"));
    }
    on("init", () => {
      if (swiper.params.navigation.enabled === false) {
        disable();
      } else {
        init4();
        update();
      }
    });
    on("toEdge fromEdge lock unlock", () => {
      update();
    });
    on("destroy", () => {
      destroy();
    });
    on("enable disable", () => {
      let {
        nextEl,
        prevEl
      } = swiper.navigation;
      nextEl = makeElementsArray(nextEl);
      prevEl = makeElementsArray(prevEl);
      [...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList[swiper.enabled ? "remove" : "add"](swiper.params.navigation.lockClass));
    });
    on("click", (_s, e2) => {
      let {
        nextEl,
        prevEl
      } = swiper.navigation;
      nextEl = makeElementsArray(nextEl);
      prevEl = makeElementsArray(prevEl);
      const targetEl = e2.target;
      if (swiper.params.navigation.hideOnClick && !prevEl.includes(targetEl) && !nextEl.includes(targetEl)) {
        if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl)))
          return;
        let isHidden;
        if (nextEl.length) {
          isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass);
        } else if (prevEl.length) {
          isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
        }
        if (isHidden === true) {
          emit("navigationShow");
        } else {
          emit("navigationHide");
        }
        [...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList.toggle(swiper.params.navigation.hiddenClass));
      }
    });
    const enable = () => {
      swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(" "));
      init4();
      update();
    };
    const disable = () => {
      swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(" "));
      destroy();
    };
    Object.assign(swiper.navigation, {
      enable,
      disable,
      update,
      init: init4,
      destroy
    });
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/pagination/pagination.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/shared/classes-to-selector.js
  init_live_reload();
  function classesToSelector(classes = "") {
    return `.${classes.trim().replace(/([\.:!+\/])/g, "\\$1").replace(/ /g, ".")}`;
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/pagination/pagination.js
  function Pagination({
    swiper,
    extendParams,
    on,
    emit
  }) {
    const pfx = "swiper-pagination";
    extendParams({
      pagination: {
        el: null,
        bulletElement: "span",
        clickable: false,
        hideOnClick: false,
        renderBullet: null,
        renderProgressbar: null,
        renderFraction: null,
        renderCustom: null,
        progressbarOpposite: false,
        type: "bullets",
        // 'bullets' or 'progressbar' or 'fraction' or 'custom'
        dynamicBullets: false,
        dynamicMainBullets: 1,
        formatFractionCurrent: (number) => number,
        formatFractionTotal: (number) => number,
        bulletClass: `${pfx}-bullet`,
        bulletActiveClass: `${pfx}-bullet-active`,
        modifierClass: `${pfx}-`,
        currentClass: `${pfx}-current`,
        totalClass: `${pfx}-total`,
        hiddenClass: `${pfx}-hidden`,
        progressbarFillClass: `${pfx}-progressbar-fill`,
        progressbarOppositeClass: `${pfx}-progressbar-opposite`,
        clickableClass: `${pfx}-clickable`,
        lockClass: `${pfx}-lock`,
        horizontalClass: `${pfx}-horizontal`,
        verticalClass: `${pfx}-vertical`,
        paginationDisabledClass: `${pfx}-disabled`
      }
    });
    swiper.pagination = {
      el: null,
      bullets: []
    };
    let bulletSize;
    let dynamicBulletIndex = 0;
    const makeElementsArray = (el) => {
      if (!Array.isArray(el))
        el = [el].filter((e2) => !!e2);
      return el;
    };
    function isPaginationDisabled() {
      return !swiper.params.pagination.el || !swiper.pagination.el || Array.isArray(swiper.pagination.el) && swiper.pagination.el.length === 0;
    }
    function setSideBullets(bulletEl, position) {
      const {
        bulletActiveClass
      } = swiper.params.pagination;
      if (!bulletEl)
        return;
      bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
      if (bulletEl) {
        bulletEl.classList.add(`${bulletActiveClass}-${position}`);
        bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
        if (bulletEl) {
          bulletEl.classList.add(`${bulletActiveClass}-${position}-${position}`);
        }
      }
    }
    function onBulletClick(e2) {
      const bulletEl = e2.target.closest(classesToSelector(swiper.params.pagination.bulletClass));
      if (!bulletEl) {
        return;
      }
      e2.preventDefault();
      const index = elementIndex(bulletEl) * swiper.params.slidesPerGroup;
      if (swiper.params.loop) {
        if (swiper.realIndex === index)
          return;
        if (index < swiper.loopedSlides || index > swiper.slides.length - swiper.loopedSlides) {
          swiper.loopFix({
            direction: index < swiper.loopedSlides ? "prev" : "next",
            activeSlideIndex: index,
            slideTo: false
          });
        }
        swiper.slideToLoop(index);
      } else {
        swiper.slideTo(index);
      }
    }
    function update() {
      const rtl = swiper.rtl;
      const params = swiper.params.pagination;
      if (isPaginationDisabled())
        return;
      let el = swiper.pagination.el;
      el = makeElementsArray(el);
      let current;
      const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
      const total = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
      if (swiper.params.loop) {
        current = swiper.params.slidesPerGroup > 1 ? Math.floor(swiper.realIndex / swiper.params.slidesPerGroup) : swiper.realIndex;
      } else if (typeof swiper.snapIndex !== "undefined") {
        current = swiper.snapIndex;
      } else {
        current = swiper.activeIndex || 0;
      }
      if (params.type === "bullets" && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
        const bullets = swiper.pagination.bullets;
        let firstIndex;
        let lastIndex;
        let midIndex;
        if (params.dynamicBullets) {
          bulletSize = elementOuterSize(bullets[0], swiper.isHorizontal() ? "width" : "height", true);
          el.forEach((subEl) => {
            subEl.style[swiper.isHorizontal() ? "width" : "height"] = `${bulletSize * (params.dynamicMainBullets + 4)}px`;
          });
          if (params.dynamicMainBullets > 1 && swiper.previousIndex !== void 0) {
            dynamicBulletIndex += current - (swiper.previousIndex || 0);
            if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
              dynamicBulletIndex = params.dynamicMainBullets - 1;
            } else if (dynamicBulletIndex < 0) {
              dynamicBulletIndex = 0;
            }
          }
          firstIndex = Math.max(current - dynamicBulletIndex, 0);
          lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
          midIndex = (lastIndex + firstIndex) / 2;
        }
        bullets.forEach((bulletEl) => {
          const classesToRemove = [...["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((suffix) => `${params.bulletActiveClass}${suffix}`)].map((s2) => typeof s2 === "string" && s2.includes(" ") ? s2.split(" ") : s2).flat();
          bulletEl.classList.remove(...classesToRemove);
        });
        if (el.length > 1) {
          bullets.forEach((bullet) => {
            const bulletIndex = elementIndex(bullet);
            if (bulletIndex === current) {
              bullet.classList.add(...params.bulletActiveClass.split(" "));
            }
            if (params.dynamicBullets) {
              if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
                bullet.classList.add(...`${params.bulletActiveClass}-main`.split(" "));
              }
              if (bulletIndex === firstIndex) {
                setSideBullets(bullet, "prev");
              }
              if (bulletIndex === lastIndex) {
                setSideBullets(bullet, "next");
              }
            }
          });
        } else {
          const bullet = bullets[current];
          if (bullet) {
            bullet.classList.add(...params.bulletActiveClass.split(" "));
          }
          if (params.dynamicBullets) {
            const firstDisplayedBullet = bullets[firstIndex];
            const lastDisplayedBullet = bullets[lastIndex];
            for (let i2 = firstIndex; i2 <= lastIndex; i2 += 1) {
              if (bullets[i2]) {
                bullets[i2].classList.add(...`${params.bulletActiveClass}-main`.split(" "));
              }
            }
            setSideBullets(firstDisplayedBullet, "prev");
            setSideBullets(lastDisplayedBullet, "next");
          }
        }
        if (params.dynamicBullets) {
          const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
          const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
          const offsetProp = rtl ? "right" : "left";
          bullets.forEach((bullet) => {
            bullet.style[swiper.isHorizontal() ? offsetProp : "top"] = `${bulletsOffset}px`;
          });
        }
      }
      el.forEach((subEl, subElIndex) => {
        if (params.type === "fraction") {
          subEl.querySelectorAll(classesToSelector(params.currentClass)).forEach((fractionEl) => {
            fractionEl.textContent = params.formatFractionCurrent(current + 1);
          });
          subEl.querySelectorAll(classesToSelector(params.totalClass)).forEach((totalEl) => {
            totalEl.textContent = params.formatFractionTotal(total);
          });
        }
        if (params.type === "progressbar") {
          let progressbarDirection;
          if (params.progressbarOpposite) {
            progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal";
          } else {
            progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
          }
          const scale = (current + 1) / total;
          let scaleX = 1;
          let scaleY = 1;
          if (progressbarDirection === "horizontal") {
            scaleX = scale;
          } else {
            scaleY = scale;
          }
          subEl.querySelectorAll(classesToSelector(params.progressbarFillClass)).forEach((progressEl) => {
            progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`;
            progressEl.style.transitionDuration = `${swiper.params.speed}ms`;
          });
        }
        if (params.type === "custom" && params.renderCustom) {
          subEl.innerHTML = params.renderCustom(swiper, current + 1, total);
          if (subElIndex === 0)
            emit("paginationRender", subEl);
        } else {
          if (subElIndex === 0)
            emit("paginationRender", subEl);
          emit("paginationUpdate", subEl);
        }
        if (swiper.params.watchOverflow && swiper.enabled) {
          subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
        }
      });
    }
    function render3() {
      const params = swiper.params.pagination;
      if (isPaginationDisabled())
        return;
      const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
      let el = swiper.pagination.el;
      el = makeElementsArray(el);
      let paginationHTML = "";
      if (params.type === "bullets") {
        let numberOfBullets = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
        if (swiper.params.freeMode && swiper.params.freeMode.enabled && numberOfBullets > slidesLength) {
          numberOfBullets = slidesLength;
        }
        for (let i2 = 0; i2 < numberOfBullets; i2 += 1) {
          if (params.renderBullet) {
            paginationHTML += params.renderBullet.call(swiper, i2, params.bulletClass);
          } else {
            paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
          }
        }
      }
      if (params.type === "fraction") {
        if (params.renderFraction) {
          paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
        } else {
          paginationHTML = `<span class="${params.currentClass}"></span> / <span class="${params.totalClass}"></span>`;
        }
      }
      if (params.type === "progressbar") {
        if (params.renderProgressbar) {
          paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
        } else {
          paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
        }
      }
      swiper.pagination.bullets = [];
      el.forEach((subEl) => {
        if (params.type !== "custom") {
          subEl.innerHTML = paginationHTML || "";
        }
        if (params.type === "bullets") {
          swiper.pagination.bullets.push(...subEl.querySelectorAll(classesToSelector(params.bulletClass)));
        }
      });
      if (params.type !== "custom") {
        emit("paginationRender", el[0]);
      }
    }
    function init4() {
      swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
        el: "swiper-pagination"
      });
      const params = swiper.params.pagination;
      if (!params.el)
        return;
      let el;
      if (typeof params.el === "string" && swiper.isElement) {
        el = swiper.el.shadowRoot.querySelector(params.el);
      }
      if (!el && typeof params.el === "string") {
        el = [...document.querySelectorAll(params.el)];
      }
      if (!el) {
        el = params.el;
      }
      if (!el || el.length === 0)
        return;
      if (swiper.params.uniqueNavElements && typeof params.el === "string" && Array.isArray(el) && el.length > 1) {
        el = [...swiper.el.querySelectorAll(params.el)];
        if (el.length > 1) {
          el = el.filter((subEl) => {
            if (elementParents(subEl, ".swiper")[0] !== swiper.el)
              return false;
            return true;
          })[0];
        }
      }
      if (Array.isArray(el) && el.length === 1)
        el = el[0];
      Object.assign(swiper.pagination, {
        el
      });
      el = makeElementsArray(el);
      el.forEach((subEl) => {
        if (params.type === "bullets" && params.clickable) {
          subEl.classList.add(params.clickableClass);
        }
        subEl.classList.add(params.modifierClass + params.type);
        subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
        if (params.type === "bullets" && params.dynamicBullets) {
          subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`);
          dynamicBulletIndex = 0;
          if (params.dynamicMainBullets < 1) {
            params.dynamicMainBullets = 1;
          }
        }
        if (params.type === "progressbar" && params.progressbarOpposite) {
          subEl.classList.add(params.progressbarOppositeClass);
        }
        if (params.clickable) {
          subEl.addEventListener("click", onBulletClick);
        }
        if (!swiper.enabled) {
          subEl.classList.add(params.lockClass);
        }
      });
    }
    function destroy() {
      const params = swiper.params.pagination;
      if (isPaginationDisabled())
        return;
      let el = swiper.pagination.el;
      if (el) {
        el = makeElementsArray(el);
        el.forEach((subEl) => {
          subEl.classList.remove(params.hiddenClass);
          subEl.classList.remove(params.modifierClass + params.type);
          subEl.classList.remove(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
          if (params.clickable) {
            subEl.removeEventListener("click", onBulletClick);
          }
        });
      }
      if (swiper.pagination.bullets)
        swiper.pagination.bullets.forEach((subEl) => subEl.classList.remove(...params.bulletActiveClass.split(" ")));
    }
    on("init", () => {
      if (swiper.params.pagination.enabled === false) {
        disable();
      } else {
        init4();
        render3();
        update();
      }
    });
    on("activeIndexChange", () => {
      if (typeof swiper.snapIndex === "undefined") {
        update();
      }
    });
    on("snapIndexChange", () => {
      update();
    });
    on("snapGridLengthChange", () => {
      render3();
      update();
    });
    on("destroy", () => {
      destroy();
    });
    on("enable disable", () => {
      let {
        el
      } = swiper.pagination;
      if (el) {
        el = makeElementsArray(el);
        el.forEach((subEl) => subEl.classList[swiper.enabled ? "remove" : "add"](swiper.params.pagination.lockClass));
      }
    });
    on("lock unlock", () => {
      update();
    });
    on("click", (_s, e2) => {
      const targetEl = e2.target;
      let {
        el
      } = swiper.pagination;
      if (!Array.isArray(el))
        el = [el].filter((element) => !!element);
      if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && el && el.length > 0 && !targetEl.classList.contains(swiper.params.pagination.bulletClass)) {
        if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl))
          return;
        const isHidden = el[0].classList.contains(swiper.params.pagination.hiddenClass);
        if (isHidden === true) {
          emit("paginationShow");
        } else {
          emit("paginationHide");
        }
        el.forEach((subEl) => subEl.classList.toggle(swiper.params.pagination.hiddenClass));
      }
    });
    const enable = () => {
      swiper.el.classList.remove(swiper.params.pagination.paginationDisabledClass);
      let {
        el
      } = swiper.pagination;
      if (el) {
        el = makeElementsArray(el);
        el.forEach((subEl) => subEl.classList.remove(swiper.params.pagination.paginationDisabledClass));
      }
      init4();
      render3();
      update();
    };
    const disable = () => {
      swiper.el.classList.add(swiper.params.pagination.paginationDisabledClass);
      let {
        el
      } = swiper.pagination;
      if (el) {
        el = makeElementsArray(el);
        el.forEach((subEl) => subEl.classList.add(swiper.params.pagination.paginationDisabledClass));
      }
      destroy();
    };
    Object.assign(swiper.pagination, {
      enable,
      disable,
      render: render3,
      update,
      init: init4,
      destroy
    });
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/scrollbar/scrollbar.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/parallax/parallax.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/zoom/zoom.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/controller/controller.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/a11y/a11y.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/history/history.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/hash-navigation/hash-navigation.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/autoplay/autoplay.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/thumbs/thumbs.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/free-mode/free-mode.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/grid/grid.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/manipulation/manipulation.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/manipulation/methods/appendSlide.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/manipulation/methods/prependSlide.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/manipulation/methods/addSlide.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/manipulation/methods/removeSlide.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/manipulation/methods/removeAllSlides.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/effect-fade/effect-fade.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/shared/effect-init.js
  init_live_reload();
  function effectInit(params) {
    const {
      effect,
      swiper,
      on,
      setTranslate: setTranslate2,
      setTransition: setTransition2,
      overwriteParams,
      perspective,
      recreateShadows,
      getEffectParams,
      setRandomRotate
    } = params;
    on("beforeInit", () => {
      if (swiper.params.effect !== effect)
        return;
      swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);
      if (perspective && perspective()) {
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
      }
      const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
      Object.assign(swiper.params, overwriteParamsResult);
      Object.assign(swiper.originalParams, overwriteParamsResult);
    });
    on("afterInit", () => {
      setRandomRotate();
    });
    on("setTranslate", () => {
      if (swiper.params.effect !== effect)
        return;
      setTranslate2();
    });
    on("setTransition", (_s, duration) => {
      if (swiper.params.effect !== effect)
        return;
      setTransition2(duration);
    });
    on("transitionEnd", () => {
      if (swiper.params.effect !== effect)
        return;
      if (recreateShadows) {
        if (!getEffectParams || !getEffectParams().slideShadows)
          return;
        swiper.slides.forEach((slideEl) => {
          slideEl.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((shadowEl) => shadowEl.remove());
        });
        recreateShadows();
      }
    });
    let requireUpdateOnVirtual;
    on("virtualUpdate", () => {
      if (swiper.params.effect !== effect)
        return;
      if (!swiper.slides.length) {
        requireUpdateOnVirtual = true;
      }
      requestAnimationFrame(() => {
        if (requireUpdateOnVirtual && swiper.slides && swiper.slides.length) {
          setTranslate2();
          requireUpdateOnVirtual = false;
        }
      });
    });
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/shared/effect-target.js
  init_live_reload();
  function effectTarget(effectParams, slideEl) {
    const transformEl = getSlideTransformEl(slideEl);
    if (transformEl !== slideEl) {
      transformEl.style.backfaceVisibility = "hidden";
      transformEl.style["-webkit-backface-visibility"] = "hidden";
    }
    return transformEl;
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/shared/effect-virtual-transition-end.js
  init_live_reload();
  function effectVirtualTransitionEnd({
    swiper,
    duration,
    transformElements,
    allSlides
  }) {
    const {
      activeIndex
    } = swiper;
    const getSlide = (el) => {
      if (!el.parentElement) {
        const slide = swiper.slides.filter((slideEl) => slideEl.shadowEl && slideEl.shadowEl === el.parentNode)[0];
        return slide;
      }
      return el.parentElement;
    };
    if (swiper.params.virtualTranslate && duration !== 0) {
      let eventTriggered = false;
      let transitionEndTarget;
      if (allSlides) {
        transitionEndTarget = transformElements;
      } else {
        transitionEndTarget = transformElements.filter((transformEl) => {
          const el = transformEl.classList.contains("swiper-slide-transform") ? getSlide(transformEl) : transformEl;
          return swiper.getSlideIndex(el) === activeIndex;
        });
      }
      transitionEndTarget.forEach((el) => {
        elementTransitionEnd(el, () => {
          if (eventTriggered)
            return;
          if (!swiper || swiper.destroyed)
            return;
          eventTriggered = true;
          swiper.animating = false;
          const evt = new window.CustomEvent("transitionend", {
            bubbles: true,
            cancelable: true
          });
          swiper.wrapperEl.dispatchEvent(evt);
        });
      });
    }
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/effect-fade/effect-fade.js
  function EffectFade({
    swiper,
    extendParams,
    on
  }) {
    extendParams({
      fadeEffect: {
        crossFade: false
      }
    });
    const setTranslate2 = () => {
      const {
        slides
      } = swiper;
      const params = swiper.params.fadeEffect;
      for (let i2 = 0; i2 < slides.length; i2 += 1) {
        const slideEl = swiper.slides[i2];
        const offset = slideEl.swiperSlideOffset;
        let tx = -offset;
        if (!swiper.params.virtualTranslate)
          tx -= swiper.translate;
        let ty = 0;
        if (!swiper.isHorizontal()) {
          ty = tx;
          tx = 0;
        }
        const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(slideEl.progress), 0) : 1 + Math.min(Math.max(slideEl.progress, -1), 0);
        const targetEl = effectTarget(params, slideEl);
        targetEl.style.opacity = slideOpacity;
        targetEl.style.transform = `translate3d(${tx}px, ${ty}px, 0px)`;
      }
    };
    const setTransition2 = (duration) => {
      const transformElements = swiper.slides.map((slideEl) => getSlideTransformEl(slideEl));
      transformElements.forEach((el) => {
        el.style.transitionDuration = `${duration}ms`;
      });
      effectVirtualTransitionEnd({
        swiper,
        duration,
        transformElements,
        allSlides: true
      });
    };
    effectInit({
      effect: "fade",
      swiper,
      on,
      setTranslate: setTranslate2,
      setTransition: setTransition2,
      overwriteParams: () => ({
        slidesPerView: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        spaceBetween: 0,
        virtualTranslate: !swiper.params.cssMode
      })
    });
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/effect-cube/effect-cube.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/effect-flip/effect-flip.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/shared/create-shadow.js
  init_live_reload();
  function createShadow(params, slideEl, side) {
    const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ""}`;
    const shadowContainer = getSlideTransformEl(slideEl);
    let shadowEl = shadowContainer.querySelector(`.${shadowClass}`);
    if (!shadowEl) {
      shadowEl = createElement("div", `swiper-slide-shadow${side ? `-${side}` : ""}`);
      shadowContainer.append(shadowEl);
    }
    return shadowEl;
  }

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/effect-coverflow/effect-coverflow.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/effect-creative/effect-creative.js
  init_live_reload();

  // node_modules/.pnpm/swiper@9.2.0/node_modules/swiper/modules/effect-cards/effect-cards.js
  init_live_reload();
  function EffectCards({
    swiper,
    extendParams,
    on
  }) {
    extendParams({
      cardsEffect: {
        slideShadows: true,
        rotate: true,
        perSlideRotate: 2,
        perSlideOffset: 8
      }
    });
    const setTranslate2 = () => {
      const {
        slides,
        activeIndex
      } = swiper;
      const params = swiper.params.cardsEffect;
      const {
        startTranslate,
        isTouched
      } = swiper.touchEventsData;
      const currentTranslate = swiper.translate;
      for (let i2 = 0; i2 < slides.length; i2 += 1) {
        const slideEl = slides[i2];
        const slideProgress = slideEl.progress;
        const progress = Math.min(Math.max(slideProgress, -4), 4);
        let offset = slideEl.swiperSlideOffset;
        if (swiper.params.centeredSlides && !swiper.params.cssMode) {
          swiper.wrapperEl.style.transform = `translateX(${swiper.minTranslate()}px)`;
        }
        if (swiper.params.centeredSlides && swiper.params.cssMode) {
          offset -= slides[0].swiperSlideOffset;
        }
        let tX = swiper.params.cssMode ? -offset - swiper.translate : -offset;
        let tY = 0;
        const tZ = -100 * Math.abs(progress);
        let scale = 1;
        let rotate = randomValues[i2] * progress;
        let tXAdd = params.perSlideOffset - Math.abs(progress) * 0.75;
        const slideIndex = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.from + i2 : i2;
        const isSwipeToNext = (slideIndex === activeIndex || slideIndex === activeIndex - 1) && progress > 0 && progress < 1 && (isTouched || swiper.params.cssMode) && currentTranslate < startTranslate;
        const isSwipeToPrev = (slideIndex === activeIndex || slideIndex === activeIndex + 1) && progress < 0 && progress > -1 && (isTouched || swiper.params.cssMode) && currentTranslate > startTranslate;
        if (isSwipeToNext || isSwipeToPrev) {
          const subProgress = (1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
          rotate += -20 * progress * subProgress;
          scale += -0.5 * subProgress;
          tXAdd += 96 * subProgress;
          tY = `${-25 * subProgress * Math.abs(progress)}%`;
        }
        if (progress < 0) {
          tX = `calc(${tX}px + (${tXAdd * Math.abs(progress)}%))`;
        } else if (progress > 0) {
          tX = `calc(${tX}px + (-${tXAdd * Math.abs(progress)}%))`;
        } else {
          tX = `${tX}px`;
        }
        if (!swiper.isHorizontal()) {
          const prevY = tY;
          tY = tX;
          tX = prevY;
        }
        const scaleString = progress < 0 ? `${1 + (1 - scale) * progress}` : `${1 - (1 - scale) * progress}`;
        const transform = `
        translate3d(${tX}, ${tY}, ${tZ}px)
        rotateZ(${params.rotate ? rotate : 0}deg)
        scale(${scaleString})
      `;
        if (params.slideShadows) {
          let shadowEl = slideEl.querySelector(".swiper-slide-shadow");
          if (!shadowEl) {
            shadowEl = createShadow(params, slideEl);
          }
          if (shadowEl)
            shadowEl.style.opacity = Math.min(Math.max((Math.abs(progress) - 0.5) / 0.5, 0), 1);
        }
        slideEl.style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
        const targetEl = effectTarget(params, slideEl);
        targetEl.style.transform = transform;
      }
    };
    const setTransition2 = (duration) => {
      const transformElements = swiper.slides.map((slideEl) => getSlideTransformEl(slideEl));
      transformElements.forEach((el) => {
        el.style.transitionDuration = `${duration}ms`;
        el.querySelectorAll(".swiper-slide-shadow").forEach((shadowEl) => {
          shadowEl.style.transitionDuration = `${duration}ms`;
        });
      });
      effectVirtualTransitionEnd({
        swiper,
        duration,
        transformElements
      });
    };
    const randomValues = [];
    const setRandomRotate = () => {
      console.log(swiper.slides);
      swiper.slides.forEach((slide, i2) => {
        randomValues[i2] = Math.random() * 4 - Math.random() * 4;
      });
    };
    console.log(randomValues);
    effectInit({
      effect: "cards",
      swiper,
      on,
      setRandomRotate,
      setTranslate: setTranslate2,
      setTransition: setTransition2,
      perspective: () => true,
      overwriteParams: () => ({
        watchSlidesProgress: true,
        virtualTranslate: !swiper.params.cssMode
      })
    });
  }

  // src/index.ts
  gsapWithCSS.registerPlugin(ScrollTrigger2);
  window.Webflow ||= [];
  window.Webflow.push(async () => {
    console.log(window.Webflow.scroll);
    import_powerglitch.PowerGlitch.glitch(".logo svg", {
      playMode: "always",
      createContainers: true,
      hideOverflow: true,
      timing: {
        duration: 3e3
      },
      glitchTimeSpan: {
        start: 0,
        end: 3
      },
      shake: {
        velocity: 14,
        amplitudeX: 2e-3,
        amplitudeY: 5e-3
      },
      slice: {
        count: 3,
        velocity: 9,
        minHeight: 0.02,
        maxHeight: 0.1,
        hueRotate: true
      },
      pulse: false
    });
    import_powerglitch.PowerGlitch.glitch(".hero-circle", {
      playMode: "always",
      createContainers: true,
      hideOverflow: false,
      timing: {
        duration: 1e3
      },
      glitchTimeSpan: {
        start: 0,
        end: 1
      },
      shake: {
        velocity: 2,
        amplitudeX: 5e-3,
        amplitudeY: 5e-3
      },
      slice: {
        count: 0,
        velocity: 8,
        minHeight: 1e-3,
        maxHeight: 0.05,
        hueRotate: false
      },
      pulse: true
    });
    const pageScroller = new r({
      wrapper: window,
      lerp: 0.2,
      duration: 1.2,
      infinite: false
    });
    function raf(time) {
      pageScroller.raf(time);
      requestAnimationFrame(raf);
    }
    const scrollLinks = document.querySelectorAll(".scroll-navigation_link");
    scrollLinks.forEach((link, index) => {
      const target = link.getAttribute("href") || "";
      link.setAttribute("data-target", target);
      link.removeAttribute("href");
      link.addEventListener("click", (e2) => {
        e2.preventDefault();
        pageScroller.scrollTo(target, {
          lerp: 0.04,
          duration: 5
        });
      });
    });
    requestAnimationFrame(raf);
    function attr(defaultVal, attrVal) {
      const defaultValType = typeof defaultVal;
      if (typeof attrVal !== "string" || attrVal.trim() === "")
        return defaultVal;
      if (attrVal === "true" && defaultValType === "boolean")
        return true;
      if (attrVal === "false" && defaultValType === "boolean")
        return false;
      if (isNaN(attrVal) && defaultValType === "string")
        return attrVal;
      if (!isNaN(attrVal) && defaultValType === "number")
        return +attrVal;
      return defaultVal;
    }
    document.querySelectorAll("[tr-marquee-element='component']").forEach(function(element, index) {
      const componentEl = element;
      const panelEl = componentEl.querySelectorAll("[tr-marquee-element='panel']");
      let speedSetting = attr(100, componentEl.getAttribute("tr-marquee-speed"));
      const verticalSetting = attr(false, componentEl.getAttribute("tr-marquee-vertical"));
      const reverseSetting = attr(false, componentEl.getAttribute("tr-marquee-reverse"));
      const scrollDirectionSetting = attr(
        false,
        componentEl.getAttribute("tr-marquee-scrolldirection")
      );
      const scrollScrubSetting = attr(false, componentEl.getAttribute("tr-marquee-scrollscrub"));
      let moveDistanceSetting = -100;
      let timeScaleSetting = 1;
      const pausedStateSetting = false;
      if (reverseSetting)
        moveDistanceSetting = 100;
      const marqueeTimeline = gsapWithCSS.timeline({
        repeat: -1,
        onReverseComplete: () => marqueeTimeline.progress(1)
      });
      speedSetting = panelEl[0]?.clientWidth / speedSetting;
      marqueeTimeline.fromTo(
        panelEl,
        { xPercent: 0 },
        { xPercent: moveDistanceSetting, ease: "none", duration: speedSetting }
      );
      const scrubObject = { value: 1 };
      ScrollTrigger2.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (!pausedStateSetting) {
            if (scrollDirectionSetting && timeScaleSetting !== self.direction) {
              timeScaleSetting = self.direction;
              marqueeTimeline.timeScale(self.direction);
            }
            if (scrollScrubSetting) {
              let v = pageScroller.velocity * 0.5;
              v = gsapWithCSS.utils.clamp(-60, 60, v);
              const scrubTimeline = gsapWithCSS.timeline({
                onUpdate: () => marqueeTimeline.timeScale(scrubObject.value)
              });
              scrubTimeline.fromTo(
                scrubObject,
                { value: v },
                { value: timeScaleSetting, duration: 0.5 }
              );
            }
          }
        }
      });
    });
    const collectionCardSwiper = new core_default(".swiper.collection-card_container", {
      // wrapperClass: 'div-block-8',
      // slideClass: 'collection-card',
      effect: "cards",
      centeredSlides: true,
      cardsEffect: {
        rotate: true,
        perSlideRotate: 1,
        perSlideOffset: 2,
        slideShadows: false
      },
      grabCursor: true,
      loop: true,
      observer: true,
      resizeObserver: true,
      breakpoints: {
        991: {
          enabled: false
        }
      },
      on: {
        init: function(swiper) {
        }
      },
      // keyboard: true,
      modules: [EffectCards]
    });
    const collectionCards = document.querySelectorAll(".collection-card_component");
    collectionCards.forEach((collectionCard) => {
      const rgbColor = collectionCard.querySelector(".collection-card_face")?.style?.borderColor;
      collectionCard.addEventListener("click", function() {
        const faceWrap = this.querySelector(".collection-card_faces-wrap");
        if (!this.dataset.clicked) {
          collectionCards.forEach((collectionCard2) => {
            const card = collectionCard2.querySelector(".collection-card_faces-wrap");
            gsapWithCSS.to(card, { rotationY: 0, duration: 0.6, ease: "sine.out" });
            collectionCard2.removeAttribute("data-clicked");
          });
          this.setAttribute("data-clicked", "true");
          gsapWithCSS.to(faceWrap, {
            rotationY: 180,
            duration: 0.6,
            ease: "sine.out",
            onStart: animateScore
          });
        } else {
          this.removeAttribute("data-clicked");
          gsapWithCSS.to(faceWrap, {
            rotationY: 0,
            duration: 0.6,
            ease: "sine.out"
          });
        }
      });
      function animateScore() {
        const scores = collectionCard.querySelectorAll(".collection-card_score");
        scores.forEach(function(score, i2) {
          const totalScore = score.dataset.count;
          let list = score.querySelectorAll(".collection-card_score_bar");
          const styleValues = [
            { key: "boxShadow", value: `0px 0px 6px ${rgbColor}` },
            { key: "backgroundColor", value: rgbColor }
          ];
          if (list.length === 0) {
            list = score.querySelectorAll(".collection-card_score_icon svg");
            styleValues[0].key = "filter";
            styleValues[0].value = `drop-shadow(0 0 .5rem ${rgbColor})`;
            styleValues[1].key = "fill";
          }
          const dots = Array.prototype.slice.call(list, 0, totalScore);
          setTimeout(() => {
            gsapWithCSS.to(dots, {
              [styleValues[0].key]: styleValues[0].value,
              [styleValues[1].key]: styleValues[1].value,
              delay: 0.3,
              duration: 0.2,
              stagger: 0.05
            });
          }, i2 * 75);
        });
      }
    });
    class TextScramble {
      constructor(el2) {
        this.el = el2;
        this.chars = "!<>-_\\/[]{}\u2014=+*^?#________";
        this.update = this.update.bind(this);
      }
      setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i2 = 0; i2 < length; i2++) {
          const from = oldText[i2] || "";
          const to = newText[i2] || "";
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
        let output = "";
        let complete = 0;
        for (let i2 = 0, n2 = this.queue.length; i2 < n2; i2++) {
          let { from, to, start, end, char } = this.queue[i2];
          if (this.frame >= end) {
            complete++;
            output += to;
          } else if (this.frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = this.randomChar();
              this.queue[i2].char = char;
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
    const phrases = ["Incoming Transmission"];
    const el = document.querySelectorAll("[type-el]");
    const next = () => {
      el.forEach((item) => {
        const fx = new TextScramble(item);
        fx.setText(phrases[0]);
      });
    };
    const panelComponents = document.querySelectorAll(".panel_component");
    panelComponents.forEach((panel) => {
      const size = {
        width: panel.querySelector(".panel_box-component")?.clientWidth,
        height: panel.querySelector(".panel_box-component")?.clientHeight
      };
      panel.querySelector(".panel_box-component").style.minHeight = size.height + "px";
      panel.querySelector(".panel_box_padding").style.minWidth = size.width + "px";
      if (panel.querySelector(".panel_box_loader") != null) {
        panel.querySelector(".panel_box_loader").style.minWidth = size.width + "px";
        panel.querySelectorAll('[type-el=""]').textContent = "";
      }
      const panelEl = panel.querySelector(".panel_box_width");
      const cornersEl = panel.querySelector(".panel_corner-wrap");
      const tl = gsapWithCSS.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 50%"
          // 10% of .panel2 enters the bottom of the viewport
        }
      }).fromTo(
        panelEl,
        {
          // duration: 0,
          height: 0,
          width: 0
        },
        {
          height: "auto",
          duration: 0.4,
          ease: "power2.out"
        }
      ).fromTo(
        cornersEl,
        {
          transform: "scale(0.99)",
          width: "80%",
          opacity: 0
        },
        {
          width: "100%",
          transform: "scale(1)",
          opacity: 1,
          duration: 0.4,
          // delay: 0.1,
          ease: "power2.out"
        }
      ).to(
        panelEl,
        {
          delay: 0.05,
          duration: 1.2,
          ease: "power2.out",
          width: "100%"
        },
        "<"
      ).fromTo(
        ".div-block-28",
        {
          width: 0,
          duration: 0,
          onComplete: next
        },
        {
          width: "100%",
          duration: 2,
          delay: 0.1,
          ease: "power2.out"
        }
      ).to(".panel_box_loader", {
        opacity: 0,
        onComplete: function() {
          document.querySelector(".panel_box_loader").style.display = "none";
        }
      }).fromTo(
        ".panel_box_container",
        {
          opacity: 0
        },
        {
          opacity: 1
        },
        "<"
      );
    });
    function updatePanelWidth() {
      panelComponents.forEach((panel) => {
        panel.querySelector(".panel_box_padding").style.minWidth = panel.querySelector(".panel_box-component")?.clientWidth + "px";
        if (panel.querySelector(".panel_box_loader") != null) {
          panel.querySelector(".panel_box_loader").style.minWidth = "0px";
        }
        panel.querySelector(".panel_box-component").style.minHeight = panel.querySelector(".panel_box_width")?.clientHeight + "px";
      });
    }
    const pagination = document.querySelector('[swiper="pagination"]');
    const swiperContainer = document.querySelector('[swiper="container"]');
    swiperContainer?.append(pagination);
    let resizeTimeout, currentWindowWidth = document.documentElement.clientWidth, oldWindowWidth = currentWindowWidth, initTeamCardSwiper = false, teamCardSwiper;
    window.addEventListener("resize", () => {
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
    window.addEventListener("load", () => {
      swiperCard(currentWindowWidth);
    });
    function swiperCard(windowWidth) {
      if (windowWidth <= 1200 && !initTeamCardSwiper) {
        initTeamCardSwiper = true;
        teamCardSwiper = new core_default(".team-card_container", {
          wrapperClass: "team-card_wrapper",
          slideClass: "team-card_slide",
          slidesPerView: "auto",
          speed: 600,
          centeredSlides: true,
          spaceBetween: 40,
          loop: true,
          grabCursor: true,
          autoHeight: false,
          pagination: {
            el: ".swiper-pagination-wrap",
            bulletClass: "bullet-small",
            bulletActiveClass: "is-active",
            clickable: true,
            type: "bullets"
          },
          breakpoints: {
            1200: {
              enabled: false,
              centeredSlides: false
            }
          },
          // keyboard: true,
          modules: [Pagination]
        });
      } else if (windowWidth > 1200 && initTeamCardSwiper) {
        teamCardSwiper.destroy(true, true);
        initTeamCardSwiper = false;
      }
    }
    const panelSwiper = new core_default(".panel_box_container", {
      // wrapperClass: 'panel_wrapper',
      // slideClass: 'panel_slide',
      slidesPerView: 1,
      effect: "fade",
      fadeEffect: {
        crossFade: true
      },
      speed: 1e3,
      centeredSlides: true,
      grabCursor: false,
      autoHeight: false,
      pagination: {
        el: ".swiper-pagination-wrap",
        bulletClass: "bullet-large",
        bulletActiveClass: "is-active",
        clickable: true,
        type: "bullets"
      },
      navigation: {
        nextEl: ".swiper_button-next",
        prevEl: ".swiper_button-prev"
      },
      breakpoints: {
        991: {
          allowTouchMove: false,
          autoHeight: false
        }
      },
      // keyboard: true,
      modules: [Pagination, Navigation, EffectFade],
      on: {
        slideChangeTransitionStart(swiper) {
          const panelEl = document.querySelector(".panel_box_width");
          const tl = gsapWithCSS.timeline();
          tl.to(panelEl, {
            // delay: 0.15,
            duration: 0.5,
            ease: "power2.out",
            width: "0%"
          }).to(panelEl, {
            // delay: 0.1,
            duration: 0.2,
            ease: "power2.out",
            height: "0"
          }).to(panelEl, {
            delay: 0.05,
            duration: 0.3,
            ease: "power2.out",
            height: "auto"
          }).to(panelEl, {
            // delay: 0.1,
            duration: 0.6,
            ease: "power2.out",
            width: "100%"
          });
        }
      }
    });
  });
})();
/*! Bundled license information:

gsap/gsap-core.js:
  (*!
   * GSAP 3.11.5
   * https://greensock.com
   *
   * @license Copyright 2008-2023, GreenSock. All rights reserved.
   * Subject to the terms at https://greensock.com/standard-license or for
   * Club GreenSock members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/CSSPlugin.js:
  (*!
   * CSSPlugin 3.11.5
   * https://greensock.com
   *
   * Copyright 2008-2023, GreenSock. All rights reserved.
   * Subject to the terms at https://greensock.com/standard-license or for
   * Club GreenSock members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/Observer.js:
  (*!
   * Observer 3.11.5
   * https://greensock.com
   *
   * @license Copyright 2008-2023, GreenSock. All rights reserved.
   * Subject to the terms at https://greensock.com/standard-license or for
   * Club GreenSock members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/ScrollTrigger.js:
  (*!
   * ScrollTrigger 3.11.5
   * https://greensock.com
   *
   * @license Copyright 2008-2023, GreenSock. All rights reserved.
   * Subject to the terms at https://greensock.com/standard-license or for
   * Club GreenSock members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  *)
*/
//# sourceMappingURL=index.js.map