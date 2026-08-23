document.addEventListener('DOMContentLoaded', () => {
  // GSAP 登録
  gsap.registerPlugin(ScrollTrigger);

  // --- 1. FV Video Animation ---
  gsap.fromTo('.fv-bg__video',
    { scale: 1, filter: 'blur(0px)', immediateRender: true },
    {
      scale: 2.0,
      filter: 'blur(6px)',
      ease: 'none',
      scrollTrigger: {
        trigger: '.fv',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    }
  );

  gsap.registerPlugin(ScrollTrigger);

  gsap.to(".scroll-down", {
    opacity: 0,
    scrollTrigger: {
      trigger: ".fv-message",
      start: 'top 60%',
        end: 'top 10%',
      scrub: true,
      //markers: true,
    }
  });

  // --- 2. Text Reveal Animation (個別ループ) ---
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
        start: 'top 70%',
        end: 'top 40%',
        scrub: true,
      }
    });
  });

  // --- 3. Service Marketing Number Opacity ---
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
      }
    });
  });

  // --- 4. Service Marketing Expand (Opacityアニメーションは削除) ---
  gsap.to(['.service-marketing', '.service-marketing__bg-video__wrapper'], {
    width: '100%',
    borderRadius: 0,
    clipPath: 'inset(0px round 0px 0px 0px 0px)',
    ease: 'none',
    scrollTrigger: {
      trigger: '.service-marketing',
      start: 'top 50%',
      end: 'top 20%',
      scrub: 1,
    }
  });

  // --- 5. Stacking Cards Logic ---
  const scrollArea = document.getElementById('scrollArea');
  const cards = document.querySelectorAll('.service-marketing__box-content');
  const box = document.querySelector('.service-marketing__box');

  if (scrollArea && cards.length > 0 && box) {
    const cardDataList = Array.from(cards).map(card => {
      const numberEl = card.querySelector('.service-marketing__box-content-text__number');
      const textElement = card.querySelector('.reveal-text__service');
      let spans = [];
      if (textElement) {
        const nodes = Array.from(textElement.childNodes);
        textElement.innerHTML = '';
        nodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            node.textContent.split('').forEach(char => {
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
      const isFirstNumber = numberEl && numberEl.classList.contains('service-marketing__box-content-text__number-first');
      return { card, numberEl, spans, isFirstNumber };
    });

    const bottomStackOffset = 40;
    let areaTop = 0, areaHeight = 0;

    const recalculatePosition = () => {
      const rect = scrollArea.getBoundingClientRect();
      areaTop = rect.top + window.scrollY;
      areaHeight = scrollArea.offsetHeight;
      ScrollTrigger.refresh();
    };
    recalculatePosition();
    window.addEventListener('resize', recalculatePosition);

    window.addEventListener('scroll', () => {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        let progress = (scrollTop - areaTop) / (areaHeight - windowHeight);
        progress = Math.max(0, Math.min(1, progress));

        const cardCount = cardDataList.length;
        const boxHeight = box.offsetHeight;
        const bottomY = boxHeight - (cardCount * bottomStackOffset);

        cardDataList.forEach(({ card, numberEl, spans, isFirstNumber }, index) => {
          const start = index === 0 ? 0 : (index - 1) / (cardCount - 1);
          const end = index === 0 ? (1 / (cardCount - 1)) : index / (cardCount - 1);
          const initialY = bottomY + (index * bottomStackOffset);
          const isLastCard = index === cardCount - 1;

          let scale = 1, cardOpacity = 1;
          if (!isLastCard) {
            const exitProgress = index === 0 ? Math.max(0, Math.min(1, progress / end)) : Math.max(0, Math.min(1, (progress - end) / (1 / (cardCount - 1))));
            if (progress > (index === 0 ? 0 : end)) {
              scale = 1 - (exitProgress * 0.1);
              cardOpacity = 1 - exitProgress;
            }
          }

          // numberElのopacity計算用にcardProgressを保持しておく
          let cardProgress;

          if (progress <= start) {
            card.style.transform = `translateY(${index === 0 ? 0 : initialY}px) scale(${scale})`;
            cardProgress = 0;
          } else if (progress >= end) {
            card.style.transform = `translateY(0px) scale(${scale})`;
            cardProgress = 1;
          } else {
            cardProgress = (progress - start) / (end - start);
            const currentY = index === 0 ? 0 : initialY + (cardProgress * (0 - initialY));
            card.style.transform = `translateY(${currentY}px) scale(${scale})`;
          }
          card.style.opacity = cardOpacity;

          // --- numberElのopacityはcardのフェードに巻き込まれず、cardProgressで独立制御 ---
          if (numberEl) {
            if (isFirstNumber) {
              numberEl.style.opacity = '1';
            } else {
              numberEl.style.opacity = (0.2 + (cardProgress * 0.8)).toFixed(2);
            }
          }

          if (spans.length > 0) {
            const cardTop = card.getBoundingClientRect().top;
            let textProgress = Math.max(0, Math.min(1, (windowHeight * 0.3 - cardTop) / (windowHeight * 0.25)));
            spans.forEach((span, i) => {
              const step = 0.7 / spans.length;
              let charProgress = Math.max(0, Math.min(1, (textProgress - (i * step)) / 0.3));
              span.style.opacity = 0.2 + (charProgress * 0.8);
            });
          }
        });
      });
    });
  }

  // --- 6. Service Liver Entry Image ---
  const entryImages = document.querySelectorAll('.service-liver__entry-img');
  entryImages.forEach(triggerEl => {
    const images = triggerEl.querySelectorAll('.service-liver__entry-img__first_img, .service-liver__entry-img__second_img');
    gsap.to(images, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: triggerEl,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  });

  // --- 7. Service Liver Wrapper Expand ---
  gsap.to('.service-liver__entry-wrapper', {
    width: '100%',
    borderRadius: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.service-liver__entry-wrapper',
      start: 'top 90%',
      end: 'top 57%',
      scrub: 1,
      invalidateOnRefresh: true,
    }
  });

  // --- 8. Works / Member List Parallax (個別ループ) ---
  const worksImages = document.querySelectorAll('.works-list__img');
  worksImages.forEach(item => {
    const target = item.querySelector('.works-list__img-animation');
    if (target) {
      gsap.to(target, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    }
  });

  const memberImages = document.querySelectorAll('.member-list__img');
  memberImages.forEach(item => {
    const target = item.querySelector('.member-list__img-animation');
    if (target) {
      gsap.to(target, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    }
  });

  var $slider = $('.works-slider');
  if ($slider.length > 0) {
    $slider.on('init afterChange', function (event, slick, currentSlide) {
      var slideIndex = currentSlide || 0;
      $('.works-list__prev-button').toggleClass('is-disabled', slideIndex === 0);

      $('.works-list__next-button').toggleClass('is-disabled', slideIndex >= slick.slideCount - 1);
    });

    $slider.slick({
      prevArrow: '.works-list__prev-button',
      nextArrow: '.works-list__next-button',
      infinite: false,
      slidesToShow: 2,
      slidesToScroll: 1,
      variableWidth: true,
      responsive: [
        {
          breakpoint: 821,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  }

  // --- 10. 全ての計算を確定させる ---
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});
