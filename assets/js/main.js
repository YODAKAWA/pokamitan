var hamburger = document.querySelector('.hamburger-menu');
var navMenu = document.querySelector('.header-wrapper');

hamburger.addEventListener('click', function () {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});



window.addEventListener('scroll', () => {

  const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      document.body.style.setProperty('--scroll-bg__color', scrollPercent);
    });

gsap.registerPlugin(ScrollTrigger);

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
  document.querySelectorAll(selector).forEach(button => {
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
          y: 20,
          opacity: 0
        },
        {
          y: 0,        
          opacity: 1,
          duration: 1, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,      
            start: 'top 90%', 
            toggleActions: 'play none none none'
          }
        }
      );
    });
