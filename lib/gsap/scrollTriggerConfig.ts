'use client';

import { ScrollTrigger } from './register';

export function configureScrollTrigger() {
  ScrollTrigger.defaults({
    toggleActions: 'play none none reverse',
  });

  ScrollTrigger.config({
    ignoreMobileResize: true,
  });
}
