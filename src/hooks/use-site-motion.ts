import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/** Keep scroll work outside React rendering, and revert every effect on unmount. */
export function useSiteMotion(rootRef: RefObject<HTMLDivElement | null>, filter: string, overlayOpen: boolean, service: number) {
  const lenisRef = useRef<Lenis | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    let refreshFrame = 0;
    const refresh = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const select = gsap.utils.selector(root);

      const intro = select('.page-intro');
      const introTimeline = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
      introTimeline
        .fromTo(select('.page-intro-mark'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .62 })
        .to(select('.page-intro-mark'), { opacity: 0, y: -10, duration: .34, ease: 'power2.in' }, '+=.32')
        .to(select('.page-intro-panel-left'), { xPercent: -102, duration: 1.05 }, .82)
        .to(select('.page-intro-panel-right'), { xPercent: 102, duration: 1.05 }, .82)
        .set(intro, { display: 'none' });

      select('.ambient-background').forEach((background: HTMLElement) => {
        ScrollTrigger.create({
          trigger: background.parentElement, start: 'top bottom', end: 'bottom top',
          toggleClass: { targets: background, className: 'ambient-active' },
        });
      });
      const progress = select('.scroll-progress-fill');
      gsap.fromTo(progress, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: .2 },
      });

      gsap.timeline({ defaults: { ease: 'power3.out' }, delay: .9 })
        .from(select('.hero .eyebrow'), { y: 16, opacity: 0, duration: .7 })
        .from(select('#hero-title span'), { y: 35, opacity: 0, duration: .9, stagger: .15 }, .15)
        .from(select('.hero-copy > p, .hero-actions, .hero-proof'), { y: 20, opacity: 0, duration: .8, stagger: .1 }, .55)
        .from(select('.hero-visual'), { y: 35, opacity: 0, duration: 1 }, .3);

      const headings = select('.section-pad h2');
      headings.forEach((heading: HTMLElement) => {
        gsap.from(heading, {
          y: 42, opacity: 0, duration: .95, ease: 'power3.out',
          scrollTrigger: { trigger: heading, start: 'top 92%', once: true },
          clearProps: 'transform,opacity',
        });
      });
      select('.section-label, .about-content, .vision-item, .contact-form, .contact-details').forEach((item: HTMLElement) => {
        gsap.from(item, {
          y: 24, opacity: 0, duration: .8, ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 94%', once: true },
          clearProps: 'transform,opacity',
        });
      });
      select('.team-card, .location-row').forEach((item: HTMLElement, index: number) => {
        gsap.from(item, {
          y: 30, opacity: 0, duration: .7, delay: (index % 5) * .065,
          scrollTrigger: { trigger: item, start: 'top 96%', once: true },
          clearProps: 'transform,opacity',
        });
      });

      gsap.fromTo(select('.statement-inner p'), { scale: .9, y: 24 }, {
        scale: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: '.statement', start: 'top bottom', end: 'center center', scrub: .7 },
      });
      gsap.fromTo(select('.statement'), { clipPath: 'inset(0 5% 0 5%)' }, {
        clipPath: 'inset(0 0% 0 0%)', ease: 'none',
        scrollTrigger: { trigger: '.statement', start: 'top 95%', end: 'top 35%', scrub: .7 },
      });
    });

    media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const select = gsap.utils.selector(root);
      root.querySelectorAll<SVGSVGElement>('.ambient-curves').forEach((curves) => {
        gsap.fromTo(curves, { yPercent: 7, rotation: -2 }, {
          yPercent: -7, rotation: 2, ease: 'none',
          scrollTrigger: { trigger: curves.closest('section'), start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        });
      });
      const hero = root.querySelector('.hero');
      gsap.to(select('.hero-visual, .hero-visual-stage, .hero-frameless-composition'), {
        yPercent: -12, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .8 },
      });
      gsap.to(select('.hero-brand-mark'), {
        yPercent: -8, scale: 1.03, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
      });
      gsap.to(select('.visual-stamp'), {
        rotation: -80, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .8 },
      });
      gsap.to(select('.hero-copy'), {
        y: -55, opacity: .25, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top -100', end: 'bottom 20%', scrub: .8 },
      });

      const header = root.querySelector<HTMLElement>('.site-header');
      const moveHeader = gsap.quickTo(header, 'yPercent', { duration: .28, ease: 'power2.out' });
      const showHeader = () => moveHeader(0);
      header?.addEventListener('focusin', showHeader);
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: (self) => {
          const focused = !!header?.querySelector(':focus-visible');
          moveHeader(self.direction > 0 && self.scroll() > 300 && !focused ? -100 : 0);
        },
      });
      return () => header?.removeEventListener('focusin', showHeader);
    });

    media.add('(min-width: 901px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({
        duration: 1.05, smoothWheel: true, syncTouch: false,
        anchors: { offset: -90 },
        prevent: (node) => !!node.closest('.project-modal, .mobile-nav, textarea, select'),
      });
      lenisRef.current = lenis;
      const tick = (seconds: number) => lenis.raf(seconds * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        lenis.off('scroll', ScrollTrigger.update);
        lenis.destroy();
        lenisRef.current = null;
      };
    });

    const images = [...root.querySelectorAll('img')];
    images.forEach((image) => image.addEventListener('load', refresh));
    let mounted = true;
    document.fonts.ready.then(() => { if (mounted) refresh(); });
    refresh();
    return () => {
      mounted = false;
      cancelAnimationFrame(refreshFrame);
      images.forEach((image) => image.removeEventListener('load', refresh));
      media.revert();
    };
  }, [rootRef]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      root.querySelectorAll('.project-card').forEach((card, index) => {
        gsap.from(card, {
          y: 45, opacity: 0, duration: .85, ease: 'power3.out', delay: (index % 2) * .1,
          scrollTrigger: { trigger: card, start: 'top 96%', once: true },
          clearProps: 'transform,opacity',
        });
        const image = card.querySelector<HTMLElement>('.project-image');
        const artwork = card.querySelector<HTMLElement>('.project-image img');
        if (image) {
          gsap.fromTo(image, { clipPath: 'inset(9% 0 9% 0)' }, {
            clipPath: 'inset(0% 0 0% 0)',
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 92%', once: true },
            clearProps: 'clipPath',
          });
        }
        if (artwork) {
          gsap.fromTo(artwork, { scale: 1.08, yPercent: 3 }, {
            scale: 1,
            yPercent: -3,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: .8 },
          });
        }
      });
    });
    ScrollTrigger.refresh();
    return () => media.revert();
  }, [filter, rootRef]);

  useEffect(() => {
    if (overlayOpen) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [overlayOpen]);

  useLayoutEffect(() => { ScrollTrigger.refresh(); }, [service]);
}
