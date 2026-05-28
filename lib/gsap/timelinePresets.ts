import { gsap, ScrollTrigger } from './register';

export const fadeUpReveal = (
  target: gsap.TweenTarget,
  options?: gsap.TweenVars,
) =>
  gsap.from(target, {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.08,
    ...options,
  });

export const fadeInReveal = (
  target: gsap.TweenTarget,
  options?: gsap.TweenVars,
) =>
  gsap.from(target, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.06,
    ...options,
  });

export const beamScrub = (beam: gsap.TweenTarget, container: Element) =>
  gsap
    .timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
    })
    .to(beam, { y: '100vh', ease: 'none' });

export const makeScrollTimeline = (
  trigger: Element | string,
  options?: ScrollTrigger.Vars,
) =>
  gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
      ...options,
    },
  });
