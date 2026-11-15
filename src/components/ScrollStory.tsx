import { useLayoutEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './scroll-story.css';

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    step: '01', name: 'Strategy', title: 'A clear', emphasis: 'direction.',
    text: 'Every meaningful brand starts with a good question. We connect your goals, your audience and your next move.',
    image: '/res/projects/devii-brandmark.png', alt: 'DEVII Ayurvedic Products brand identity artwork',
    caption: 'DEVII / BRAND IDENTITY', color: '#141b15',
  },
  {
    step: '02', name: 'Creativity', title: 'An idea', emphasis: 'brought to life.',
    text: 'Then we give that thinking a voice. Distinctive design and thoughtful content turn a direction into something people can feel.',
    image: '/res/projects/island-tea-oreo.png', alt: 'Island Tea Company Oreo milk tea creative',
    caption: 'ISLAND TEA CO. / SOCIAL CREATIVE', color: '#241e16',
  },
  {
    step: '03', name: 'Connection', title: 'Made to', emphasis: 'make a mark.',
    text: 'We bring the details together to help your brand connect with people, in their feeds and in the real world.',
    image: '/res/projects/seedevi-roast.png', alt: 'Seedevi Family Restaurant food promotion artwork',
    caption: 'SEEDEVI / PROMOTIONAL CREATIVE', color: '#281813',
  },
];

/** Native sequential content becomes a scroll-scrubbed editorial scene on desktop. */
export default function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(min-width: 901px) and (min-height: 641px) and (prefers-reduced-motion: no-preference)', () => {
        const panels = Array.from(section.querySelectorAll<HTMLElement>('.story-chapter'));
        const pin = section.querySelector<HTMLElement>('.scroll-story-pin');
        const progress = section.querySelector<HTMLElement>('.story-scroll-progress span');
        section.classList.add('story-motion-ready');
        section.dataset.storyStep = '0';
        gsap.set(panels, { opacity: 0 });
        gsap.set(panels[0], { opacity: 1 });
        gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });
        const syncChapter = (value: number) => {
          section.dataset.storyStep = String(value < 0.35 ? 0 : value < 0.72 ? 1 : 2);
        };

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.7,
            invalidateOnRefresh: true,
            // Lazy artwork/font loads can refresh a settled timeline with events suppressed.
            onRefresh: (trigger) => syncChapter(trigger.progress),
          },
        });
        timeline.to(progress, { scaleX: 1, duration: 3 }, 0);
        chapters.slice(1).forEach((chapter, offset) => {
          const index = offset + 1;
          const previous = panels[index - 1];
          const next = panels[index];
          const position = index === 1 ? 0.85 : 1.95;
          timeline.to(previous.querySelector('.story-copy'), { y: -35, opacity: 0, duration: 0.25 }, position);
          timeline.to(previous.querySelector('.story-art'), { x: -75, rotation: -11, scale: 0.88, opacity: 0, duration: 0.4 }, position);
          timeline.to(previous, { opacity: 0, duration: 0.01 }, position + 0.4);
          timeline.set(next, { opacity: 1 }, position + 0.08);
          timeline.fromTo(next.querySelector('.story-copy'), { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, position + 0.1);
          timeline.fromTo(next.querySelector('.story-art'), { x: 95, rotation: 12, scale: 0.88, opacity: 0 }, { x: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.42 }, position + 0.08);
          timeline.to(pin, { backgroundColor: chapter.color, duration: 0.5 }, position);
        });
        timeline.to(section.querySelector('.story-orbit'), { rotation: 55, scale: 1.14, duration: 3 }, 0);
        timeline.eventCallback('onUpdate', () => {
          syncChapter(timeline.progress());
        });
        const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => {
          cancelAnimationFrame(refreshFrame);
          section.classList.remove('story-motion-ready');
          delete section.dataset.storyStep;
        };
      });
    }, section);
    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <section className="scroll-story" ref={sectionRef} aria-labelledby="scroll-story-heading">
      <div className="scroll-story-pin">
        <div className="shell scroll-story-shell">
          <div className="story-topline">
            <h2 id="scroll-story-heading">FROM THE FIRST IDEA TO A LASTING IMPRESSION</h2>
            <span className="story-scroll-cue" aria-hidden="true">SCROLL TO EXPLORE <ArrowDown size={13} /></span>
          </div>
          <div className="story-stage">
            <div className="story-orbit" aria-hidden="true" />
            {chapters.map((chapter) => (
              <article className="story-chapter" key={chapter.step}>
                <div className="story-copy">
                  <span className="story-chapter-label">{chapter.step} / {chapter.name.toUpperCase()}</span>
                  <h3>{chapter.title}<br /><em>{chapter.emphasis}</em></h3>
                  <p>{chapter.text}</p>
                </div>
                <figure className="story-art">
                  <div className="story-art-frame"><img src={chapter.image} alt={chapter.alt} loading="lazy" /></div>
                  <figcaption>{chapter.caption}</figcaption>
                </figure>
              </article>
            ))}
          </div>
          <div className="story-bottomline">
            <div className="story-chapter-index" aria-hidden="true">{chapters.map((chapter, index) => <span data-index={index} key={chapter.step}>{chapter.step} <b>{chapter.name}</b></span>)}</div>
            <a href="#work">SEE THE WORK <ArrowUpRight size={15} /></a>
          </div>
          <div className="story-scroll-progress" aria-hidden="true"><span /></div>
        </div>
      </div>
    </section>
  );
}
