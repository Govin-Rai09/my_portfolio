let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSliders() {
  controller = new ScrollMagic.Controller();
  //   select
  const sliders = document.querySelectorAll(`.slide`);
  const nav = document.querySelector(`.nav`);
  sliders.forEach((slide, index, slides) => {
    const reImg = slide.querySelector(`.reveal-img`);
    const img = slide.querySelector(`img`);
    const reText = slide.querySelector(`.reveal-text`);
    // gsap

    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: `power2.inOut` }
    });
    slideTl.fromTo(reImg, { x: `0` }, { x: `100%` });
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
    slideTl.fromTo(reText, { x: `0` }, { x: `100%` }, "-=0.75");
    // slideTl.fromTo(nav, { y: `-100%` }, { y: `0` }, "-=0.5");
    //  create scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false
    })
      .setTween(slideTl)
      .addIndicators({
        colorStart: `white`,
        colorTrigger: `white`,
        name: `slide`
      })
      .addTo(controller);
    // new animation
    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? `end` : slides[index + 1];
    pageTl.fromTo(nextSlide, 1, { y: `0%` }, { y: `50%` });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, 1, { y: `50%` }, { y: `0%` }, "-=0.5");
    // new scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0,
      duration: `100%`
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addIndicators({
        colorStart: `white`,
        colorTrigger: `white`,
        name: `page`,
        indent: 200
      })
      .addTo(controller);
  });
}
const mouse = document.querySelector(`.cursor`);
const mouseTxt = mouse.querySelector(`span`);
const burger = document.querySelector(`.burger`);
function cursor(e) {
  mouse.style.top = e.pageY + `px`;
  mouse.style.left = e.pageX + `px`;
}
function activeCursor(e) {
  const item = e.target;
  if (item.id === `logo` || item.classList.contains(`burger`)) {
    mouse.classList.add(`nav-active`);
  } else {
    mouse.classList.remove(`nav-active`);
  }
  if (item.classList.contains(`exp`)) {
    mouse.classList.add(`exp-active`);
    gsap.to(`.title-swipe`, 1, { y: `0%` });
    mouseTxt.innerText = `Tap`;
  } else {
    mouse.classList.remove(`exp-active`);
    mouseTxt.innerText = ``;
    gsap.to(`.title-swipe`, 1, { y: `100%` });
  }
}
function navToggle(e) {
  if (!e.target.classList.contains(`active`)) {
    e.target.classList.add(`active`);
    gsap.to(`.line1`, 0.5, {
      rotate: `45`,
      y: 7,
      opacity: `1`,
      background: "black"
    });
    gsap.to(`.line2`, 0.5, { opacity: 0 });
    gsap.to(`.line3`, 0.5, {
      rotate: `-45`,
      y: -7,
      opacity: `1`,
      background: "black"
    });
    gsap.to(`#logo`, 1, { color: `black` });
    gsap.to(`.nav-bar`, 1, { clipPath: `circle(2500px at 100% -10%)` });
    document.body.classList.add(`hide`);
  } else {
    e.target.classList.remove(`active`);
    gsap.to(`.line1`, 0.5, { rotate: `0`, y: 0, background: "wheat" });
    gsap.to(`.line2`, 0.5, { opacity: 1 });
    gsap.to(`.line3`, 0.5, { rotate: `0`, y: 0, background: "wheat" });
    gsap.to(`#logo`, 1, { color: `white` });
    gsap.to(`.nav-bar`, 1, { clipPath: `circle(50px at 100% -10%)` });
    document.body.classList.remove(`hide`);
  }
}
// barba page transition
const logo = document.querySelector(`#logo`);
barba.init({
  views: [
    {
      namespace: `home`,
      beforeEnter() {
        animateSliders();
        logo.href = `./ind.html`;
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      }
    },
    {
      namespace: `go`,
      beforeEnter() {
        logo.href = `../ind.html`;
        detailAnim();
        // gsap.fromTo(`.nav`, 1, { y: `100%` }, { y: `0`, ease: `power2.inOut` });
      },
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      }
    }
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        // scroll
        window.scrollTo(0, 0);
        //animation
        const tl = gsap.timeline({ defaults: { ease: `power2.inOut` } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          `.swipe`,
          0.75,
          { x: `-100%` },
          { x: `0%`, onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        const tl = gsap.timeline({ defaults: { ease: `power2.inOut` } });
        tl.fromTo(
          `.swipe`,
          0.75,
          { x: `0%` },
          { x: `100%`, stagger: 0.25, onComplete: done }
        );

        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
        tl.fromTo(`.nav`, 1, { y: `-100%` }, { y: `0` }, "-=1");
      }
    }
  ]
});
function detailAnim() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(`.de-slide`);
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({ defaults: { duration: 1 } });
    let nextSlide = slides.length - 1 === index ? `end` : slides[index + 1];
    const nxtImg = nextSlide.querySelector(`img`);
    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=0.5");
    slideTl.fromTo(nxtImg, { x: `50%` }, { x: `0%` });
    // scene
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: `100%`,
      triggerHook: 0
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      .addIndicators({
        colorStart: `white`,
        colorTrigger: `white`,
        name: `detailScene`
      })
      .addTo(controller);
  });
}
burger.addEventListener(`click`, navToggle);
window.addEventListener(`mouseover`, activeCursor);
window.addEventListener(`mousemove`, cursor);
