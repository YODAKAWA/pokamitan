
const topEl = document.getElementById("loader-top");
const leftEl = document.getElementById("loader-left");
const rightEl = document.getElementById("loader-right");
const bottomEl = document.getElementById("loader-bottom");
const overlay = document.getElementById("loader-overlay");

const MIN_DISPLAY_TIME = 1500;
const FADE_DURATION = 300;

let startTime = null;

function clearAll() {
  [topEl, rightEl, bottomEl, leftEl].forEach(el => el.className = "");
}

function rightToLeft() {
  clearAll();
  rightEl.className = "run";
  leftEl.className = "red";
  bottomEl.className = "yellow passive";
  topEl.className = "yellow passive";
  setTimeout(bottomToTop, 500);
}
function bottomToTop() {
  clearAll();
  bottomEl.className = "run";
  topEl.className = "yellow";
  rightEl.className = "green passive";
  leftEl.className = "green passive";
  setTimeout(leftToRight, 500);
}
function leftToRight() {
  clearAll();
  leftEl.className = "run";
  rightEl.className = "green";
  bottomEl.className = "blue passive";
  topEl.className = "blue passive";
  setTimeout(topToBottom, 500);
}
function topToBottom() {
  clearAll();
  topEl.className = "run";
  bottomEl.className = "blue";
  leftEl.className = "red passive";
  rightEl.className = "red passive";
  setTimeout(rightToLeft, 500);
}

function showLoader() {
  startTime = Date.now();
  overlay.classList.remove("fade-out");
  overlay.style.display = "block";
  document.body.style.overflow = "hidden";
  rightToLeft();
}

function startSectionAnimations() {
  const isVisited = sessionStorage.getItem("visited");
  const header = document.querySelector('.header-wrapper.js-animate');

  document.querySelectorAll(".js-animate").forEach(el => {
    el.classList.add("after-loading");
  });

  if (header && !isVisited) {
    header.classList.add("is-first-time");
    sessionStorage.setItem("visited", "true");
  }
}

function hideLoader() {
  const elapsed = Date.now() - startTime;
  const remaining = Math.max(MIN_DISPLAY_TIME - elapsed, 0);

  setTimeout(() => {
    overlay.classList.add("fade-out");
    setTimeout(() => {
      overlay.style.display = "none";
      document.body.style.overflow = "";
      startSectionAnimations();
    }, FADE_DURATION);
  }, remaining);
}

showLoader();
window.addEventListener("load", hideLoader);


document.addEventListener('DOMContentLoaded', () => {

  const hamburger = document.querySelector('.hamburger-menu');
  const navMenu = document.querySelector('.header-wrapper');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  const lenis = new Lenis({
    duration: 1.6,
    wheelMultiplier: 0.7,
    touchMultiplier: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const setupDropdowns = (selector) => {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(button => {
      const dropdown = button.nextElementSibling;

      const arrow = button.querySelector("[class$='__button-arrow']");

      button.addEventListener("click", () => {
        button.classList.toggle("is-active");
        if (dropdown) dropdown.classList.toggle("is-open");
        if (arrow) arrow.classList.toggle("is-open");
      });
    });
  };

  setupDropdowns(".header-nav__button");
  setupDropdowns(".footer-nav__button");

  gsap.registerPlugin(ScrollTrigger);

  const fadeElements = document.querySelectorAll('.fadein');
  fadeElements.forEach((el) => {
    gsap.fromTo(
      el,
      {
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  gsap.registerPlugin(ScrollTrigger);

const footer = document.querySelector('.footer');
const footerWrapper = document.querySelector('.footer-wrapper');

const wrapperStyle = getComputedStyle(footerWrapper);
const basePaddingLeft = parseFloat(wrapperStyle.paddingLeft) || 0;
const basePaddingRight = parseFloat(wrapperStyle.paddingRight) || 0;

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: footer,
    start: 'top bottom-=90',
    end: '+=130', 
    scrub: true,
    // markers: true,
  }
});

tl.to(footer, {
  padding: 0,
  ease: 'none'
}, 0)
.to(footerWrapper, {
  borderRadius: 0,
  paddingLeft: basePaddingLeft + 15,
  paddingRight: basePaddingRight + 15,
  ease: 'none'
}, 0);


  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});
