

gsap.fromTo('.fv-bg__video',
  {
    scale: 1,
    filter: 'blur(0px)',
    immediateRender: true
  },
  {
    scale: 2.0,
    filter: 'blur(6px)',
    ease: 'none',
    scrollTrigger: {
      trigger: '.fv',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      //markers: true,
    }
  }
);

const textElements = document.querySelectorAll('.reveal-text');

textElements.forEach(textElement => {

  const nodes = Array.from(textElement.childNodes);
  textElement.innerHTML = '';

  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const chars = node.textContent.split('');
      chars.forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        textElement.appendChild(span);
      });
    } else if (node.nodeName === 'BR') {
      textElement.appendChild(document.createElement('br'));
    }
  });

  const spans = textElement.querySelectorAll('span');

  gsap.to(spans, {
    color: '#ffffff',
    ease: 'none',
    stagger: 0.1,
    scrollTrigger: {
      trigger: textElement,
      start: 'top 50%',
      end: 'top 10%',
      scrub: true,
      // markers: true,
    }
  });
});

const numberElements = document.querySelectorAll('.service-marketing__box-content-text__number');

numberElements.forEach((num) => {
  gsap.to(num, {
    opacity: 0.2,
    ease: 'none',

    scrollTrigger: {
      trigger: num,
      start: 'top 50%',
      end: 'top 10%',
      scrub: true,
      invalidateOnRefresh: true,
      //markers: true,
    }
  });
});

gsap.fromTo('service-marketing__bg-video',
  {
    opacity: 0
  },
  {
    opacity: 0.9,
    ease: 'none',
    scrollTrigger: {
      trigger: '.service-marketing',
      start: 'top 80%',
      end: '+=1400',
      scrub: true,
      //markers: true,
    }
  }
);

gsap.to(['.service-marketing' , '.service-marketing__bg-video'], {
  width: '100%',
  borderRadius: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: '.service-marketing',
    start: 'top 50%',
    end: 'top 20%',
    scrub: 1,
    //markers: true,
  }
});



document.addEventListener('DOMContentLoaded', () => {
  const scrollArea = document.getElementById('scrollArea');
  const cards = document.querySelectorAll('.service-marketing__box-content');
  const box = document.querySelector('.service-marketing__box');

  if (!scrollArea || cards.length === 0 || !box) return;

  const cardDataList = Array.from(cards).map(card => {
    const numberEl = card.querySelector('.service-marketing__box-content-text__number');
    const textElement = card.querySelector('.reveal-text__service');
    let spans = [];

    if (textElement) {
      const nodes = Array.from(textElement.childNodes);
      textElement.innerHTML = '';

      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const chars = node.textContent.split('');
          chars.forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0.2'; 
            textElement.appendChild(span);
            spans.push(span);
          });
        } else if (node.nodeName === 'BR') {
          textElement.appendChild(document.createElement('br'));
        }
      });
    }

    return { card, numberEl, spans };
  });

  const bottomStackOffset = 30;
  let areaTop = 0;
  let areaHeight = 0;

  function recalculatePosition() {
    const rect = scrollArea.getBoundingClientRect();
    areaTop = rect.top + window.scrollY;
    areaHeight = scrollArea.offsetHeight;
  }

  recalculatePosition();
  window.addEventListener('resize', recalculatePosition);

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;

        let progress = (scrollTop - areaTop) / (areaHeight - windowHeight);
        progress = Math.max(0, Math.min(1, progress));

        updateCardsPosition(progress, windowHeight);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  function updateCardsPosition(progress, windowHeight) {
    const cardCount = cardDataList.length;
    const boxHeight = box.offsetHeight;
    const finalY = 0;
    const bottomY = boxHeight - (cardCount * bottomStackOffset);

    cardDataList.forEach(({ card, numberEl, spans }, index) => {
      const start = index === 0 ? 0 : (index - 1) / (cardCount - 1);
      const end = index === 0 ? (1 / (cardCount - 1)) : index / (cardCount - 1);
      const initialY = bottomY + (index * bottomStackOffset);

      if (progress <= start) {
        if (index !== 0) {
          card.style.transform = `translateY(${initialY}px)`;
        } else {
          card.style.transform = `translateY(${finalY}px)`;
        }
        if (numberEl) numberEl.style.opacity = '0.2';

      } else if (progress >= end) {
        card.style.transform = `translateY(${finalY}px)`;
        if (numberEl) numberEl.style.opacity = '1';

      } else {
        const cardProgress = (progress - start) / (end - start);
        const currentY = initialY + (cardProgress * (finalY - initialY));
        if (index !== 0) {
          card.style.transform = `translateY(${currentY}px)`;
        }
        if (numberEl) {
          const currentOpacity = 0.2 + (cardProgress * 0.8);
          numberEl.style.opacity = currentOpacity.toFixed(2);
        }
      }

      if (spans.length > 0) {
        const cardRect = card.getBoundingClientRect();
        const cardTop = cardRect.top;

        const startPx = windowHeight * 0.3; 
        const endPx = windowHeight * 0.05; 

        let textProgress = (startPx - cardTop) / (startPx - endPx);
        textProgress = Math.max(0, Math.min(1, textProgress));

        if (textProgress <= 0) {
          spans.forEach(span => span.style.opacity = '0.2');
        } else if (textProgress >= 1) {
          spans.forEach(span => span.style.opacity = '1');
        } else {
         
          const overlap = 0.3; 
          const step = (1 - overlap) / Math.max(1, spans.length - 1);

          spans.forEach((span, charIndex) => {
            const charStart = charIndex * step;
            const charEnd = charStart + overlap;

            let charProgress = (textProgress - charStart) / (charEnd - charStart);
            charProgress = Math.max(0, Math.min(1, charProgress));

            const spanOpacity = 0.2 + (charProgress * 0.8);
            span.style.opacity = spanOpacity.toFixed(2);
          });
        }
      }
    });
  }
});


$(window).on('load', function () {
  var $slider = $('.works-slider');
  var $prevBtn = $('.works-list__prev-button');
  var $nextBtn = $('.works-list__next-button');

  $slider.on('init afterChange', function (event, slick, currentSlide) {
    var slideIndex = currentSlide || 0;

    $prevBtn.toggleClass('is-disabled', slideIndex === 0);

    var isLast = (slideIndex >= slick.slideCount - 1);
    $nextBtn.toggleClass('is-disabled', isLast);
  });

  $slider.slick({
    prevArrow: '.works-list__prev-button',
    nextArrow: '.works-list__next-button',
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
  });
});


window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});