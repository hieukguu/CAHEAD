'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const revealSelector = ['.section-heading', '.service-card', '.step', '.ecosystem-row > div', '.work-card', '.why-grid > div', '.insight-card', '.service-list-item', '.method-grid > div', '.case-detail', '.article-body > section', '.contact-layout > *'].join(',');

export function MotionEffects() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const hero = document.querySelector<HTMLElement>('.hero-v2');
    root.classList.add('motion-enabled');
    const updateScroll = () => {
      const available = root.scrollHeight - window.innerHeight;
      root.style.setProperty('--scroll-progress', String(available > 0 ? Math.min(window.scrollY / available, 1) : 0));
      root.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));
    elements.forEach((element, index) => {
      element.classList.add('reveal-ready');
      element.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
    });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }), { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
    elements.forEach(element => observer.observe(element));
    const updatePointer = (event: PointerEvent) => {
      if (!hero) return;
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      hero.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
      hero.style.setProperty('--image-shift-x', `${((event.clientX / window.innerWidth) - .5) * -10}px`);
      hero.style.setProperty('--image-shift-y', `${((event.clientY / window.innerHeight) - .5) * -7}px`);
    };
    window.addEventListener('scroll', updateScroll, { passive: true });
    hero?.addEventListener('pointermove', updatePointer, { passive: true });
    updateScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateScroll);
      hero?.removeEventListener('pointermove', updatePointer);
      root.classList.remove('is-scrolled');
    };
  }, [pathname]);
  return null;
}
